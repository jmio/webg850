/*
	webserial.js - Arduino (g850-11pin) と Web Serial で話すためのプロトコル層

	実機の 11pin I/O との橋渡しは arduino-11pin/ のファームウェアが行う。
	ここが運ぶのは BSAVE の信号形式 (.bin) のバイト列だけで、
	波形のタイミング・極性・パリティの知識は一切持たない。

	プロトコルの仕様は arduino-11pin/docs/protocol.md を参照。
	要点だけ再掲する。

	  - 1 行 1 レコード。先頭 1 文字が種別
	      '+' 正常応答・データ / '!' エラー(終端) / '#' 情報 / '*' 進捗
	  - すべてのコマンドは `+OK` で始まる行か `!` で始まる行で終わる
	  - 文字は ASCII のみ
	  - 中断は ESC(0x1B) を生の 1 バイトで送る

	実行環境（2026-08-30 実測）:
	  Firefox の file:// でそのまま動く。サーバは要らない。
	  ただし許可は保存されないので getPorts() は当てにせず、
	  接続は常に requestPort() から始める。
*/
"use strict";

/* Web Serial が使えるか。使えない環境では実機の UI ごと出さない */
function g850SerialAvailable() {
	return (typeof navigator !== "undefined") && ("serial" in navigator);
}

/*
	デバイスが返すのと同じ CRC (CRC-16/CCITT-FALSE)

	LOAD の応答 `+OK n=.. crc=....` と突き合わせて、
	送ったものがそのまま届いたかを確かめるために使う。
*/
function g850Crc16(bytes) {
	var c = 0xFFFF;
	for (var i = 0; i < bytes.length; i++) {
		c ^= bytes[i] << 8;
		for (var k = 0; k < 8; k++)
			c = (c & 0x8000) ? ((c << 1) ^ 0x1021) & 0xFFFF : (c << 1) & 0xFFFF;
	}
	return c;
}

function g850Hex2(v) {
	return ("0" + v.toString(16).toUpperCase()).slice(-2);
}

function g850Hex4(v) {
	return ("000" + v.toString(16).toUpperCase()).slice(-4);
}

/*
	1 行の "key=value key=value ..." を { key: value } にする
*/
function g850ParseKV(s) {
	var out = {};
	var parts = s.split(/\s+/);
	for (var i = 0; i < parts.length; i++) {
		var e = parts[i].indexOf("=");
		if (e > 0)
			out[parts[i].substring(0, e)] = parts[i].substring(e + 1);
	}
	return out;
}

/*
	応答の 1 コマンド分

	  data     '+' の行（先頭の '+' を除く）。終端の "OK..." は含まない
	  logs     '#' の行
	  progress '*' の行
	  done     終端の "OK" に続く文字列（例 "n=12288 crc=834C"）
*/
function G850Reply() {
	this.data = [];
	this.logs = [];
	this.progress = [];
	this.done = "";
}

/*
	デバイスとの接続 1 つ分

	使い方:
		var link = new G850Link();
		await link.connect();
		var rep = await link.command("PING");
		await link.disconnect();
*/
function G850Link() {
	this.port = null;
	this.reader = null;
	this.writer = null;
	this.version = "";

	this._buf = "";          /* 行に分けきれていない残り */
	this._pending = null;    /* 実行中のコマンド */
	this._readLoop = null;
	this._encoder = new TextEncoder();

	/* 行が届くたびに呼ばれる。デバッグ用に外から差し替えられる */
	this.onLine = null;
}

/* ---- 接続 ------------------------------------------------------------ */

/*
	ポートを選んで開き、PING で相手を確認する。

	requestPort() は利用者の操作（クリック）から呼ぶ必要がある。
	許可は保存されないので毎回ダイアログが出る。
*/
G850Link.prototype.connect = async function () {
	if (this.port)
		throw new Error("すでに接続している");

	var port = await navigator.serial.requestPort();
	await port.open({ baudRate: 115200 });

	this.port = port;
	this.reader = port.readable.getReader();
	this.writer = port.writable.getWriter();
	this._buf = "";
	this._readLoop = this._read();

	/*
		相手が本当に g850-11pin かを確かめる。
		別のシリアル機器を選んでしまったときに、ここで止める。
	*/
	try {
		var rep = await this.command("PING", { timeout: 3000 });
		var line = rep.data.length > 0 ? rep.data[0] : "";
		if (line.indexOf("PONG g850-11pin") !== 0)
			throw new Error("g850-11pin ではないようです: " + (line || "応答なし"));
		this.version = line.split(/\s+/)[2] || "";
	} catch (e) {
		await this.disconnect();
		throw e;
	}
	return this.version;
};

G850Link.prototype.isOpen = function () {
	return this.port != null;
};

/*
	切断する。

	pipeThrough を使わず getReader() / getWriter() で掴んでいるので、
	cancel → releaseLock → close の順で確実に解放する。
	ここを飛ばすと次の接続で開けなくなる。
*/
G850Link.prototype.disconnect = async function () {
	if (this._pending) {
		var p = this._pending;
		this._pending = null;
		clearTimeout(p.timer);
		p.reject(new Error("切断された"));
	}
	try { if (this.reader) { await this.reader.cancel(); } } catch (e) {}
	try { if (this.reader) { this.reader.releaseLock(); } } catch (e) {}
	try { if (this.writer) { this.writer.releaseLock(); } } catch (e) {}
	try { if (this.port) { await this.port.close(); } } catch (e) {}
	this.reader = this.writer = this.port = null;
	this.version = "";
};

/* ---- 受信 ------------------------------------------------------------ */

G850Link.prototype._read = async function () {
	var dec = new TextDecoder();
	try {
		for (;;) {
			var r = await this.reader.read();
			if (r.done)
				break;
			this._buf += dec.decode(r.value, { stream: true });
			var i;
			while ((i = this._buf.indexOf("\n")) >= 0) {
				var line = this._buf.substring(0, i).replace(/\r$/, "");
				this._buf = this._buf.substring(i + 1);
				this._line(line);
			}
		}
	} catch (e) {
		/* cancel() でここに来る。切断の一部なので何もしない */
	}
};

G850Link.prototype._line = function (line) {
	if (line === "")
		return;
	if (this.onLine)
		this.onLine(line);

	var p = this._pending;
	if (!p)
		return;   /* コマンドの外で届いたものは捨てる */

	var kind = line.charAt(0);
	var body = line.substring(1);

	if (kind === "+") {
		/* 終端は "+OK" か "+OK <なにか>" の 2 通りだけ */
		if (body === "OK" || body.indexOf("OK ") === 0) {
			this._pending = null;
			clearTimeout(p.timer);
			p.reply.done = (body.length > 3 ? body.substring(3) : "");
			p.resolve(p.reply);
			return;
		}
		p.reply.data.push(body);
		if (p.onData)
			p.onData(body);
	} else if (kind === "!") {
		this._pending = null;
		clearTimeout(p.timer);
		p.reject(new Error(body));
	} else if (kind === "#") {
		p.reply.logs.push(body);
		if (p.onLog)
			p.onLog(body);
	} else if (kind === "*") {
		p.reply.progress.push(body);
		if (p.onProgress)
			p.onProgress(body);
	}
};

/* ---- 送信 ------------------------------------------------------------ */

G850Link.prototype._write = function (text) {
	return this.writer.write(this._encoder.encode(text));
};

/*
	コマンドを 1 つ送り、`+OK` か `!` が来るまで待つ。

	opts:
	  timeout     ミリ秒。既定 10000
	  onData      '+' の行が届くたびに呼ばれる
	  onLog       '#' の行
	  onProgress  '*' の行
	  body        コマンド行のあとに続けて送る文字列（LOAD 用）
*/
G850Link.prototype.command = function (line, opts) {
	opts = opts || {};
	if (!this.port)
		return Promise.reject(new Error("接続していない"));
	if (this._pending)
		return Promise.reject(new Error("前のコマンドが終わっていない"));

	var self = this;
	return new Promise(function (resolve, reject) {
		self._pending = {
			reply: new G850Reply(),
			resolve: resolve,
			reject: reject,
			onData: opts.onData,
			onLog: opts.onLog,
			onProgress: opts.onProgress,
			timer: null
		};

		var arm = function (ms) {
			clearTimeout(self._pending.timer);
			self._pending.timer = setTimeout(function () {
				var p = self._pending;
				if (!p)
					return;
				self._pending = null;
				p.reject(new Error("応答が来ない: " + line));
			}, ms);
		};
		/* 進捗が届いている間はタイムアウトを延ばす */
		self._pending.rearm = arm;
		arm(opts.timeout || 10000);

		self._write(line + "\n").then(function () {
			return opts.body ? self._write(opts.body) : null;
		}).catch(function (e) {
			var p = self._pending;
			if (p) {
				self._pending = null;
				clearTimeout(p.timer);
				p.reject(e);
			}
		});
	});
};

/*
	送出中・取り込み中のコマンドを中断する。

	ESC(0x1B) を生の 1 バイトで送る。行として解釈されないので
	command() を通さずに直接書く。
*/
G850Link.prototype.abort = function () {
	if (!this.writer)
		return Promise.resolve();
	return this.writer.write(new Uint8Array([0x1B]));
};

/* ---- .bin をデバイスへ送る (LOAD) ------------------------------------ */

/*
	1 行あたりのバイト数。

	デバイスの行バッファは 192 文字で、"D XXXX " の 7 文字を除いた
	184 文字が 16 進 92 バイトにあたるため上限は 92。
	ただし 1 行を長くしても速くならない（律速はデバイス側の行の解釈で、
	12288 バイトが 638ms → 606ms にしかならない）ので 32 のままにする。
*/
var G850_LOAD_CHUNK = 32;

/*
	.bin をデバイスのバッファへ送る。

	フロー制御は要らない。12288 バイト（27652 文字・384 行）を
	1 回の write で投げてよく、`+RDY` を待つ必要も無い（実測で確認済み）。
	ここでは素直に「コマンド行 + 本体」をまとめて 1 回で書く。

	戻り値はデバイスが計算した CRC。g850Crc16() と一致するはず。
*/
G850Link.prototype.load = async function (bytes, opts) {
	opts = opts || {};
	if (bytes.length < 49)
		throw new Error(".bin が短すぎる: " + bytes.length + " バイト");
	if (bytes.length > 12288)
		throw new Error(".bin が大きすぎる: " + bytes.length +
		                " バイト（デバイスのバッファは 12288 まで）");

	var lines = [];
	for (var off = 0; off < bytes.length; off += G850_LOAD_CHUNK) {
		var end = Math.min(off + G850_LOAD_CHUNK, bytes.length);
		var hex = "";
		for (var i = off; i < end; i++)
			hex += g850Hex2(bytes[i]);
		lines.push("D " + g850Hex4(off) + " " + hex);
	}
	lines.push("END");

	var rep = await this.command("LOAD " + bytes.length, {
		timeout: opts.timeout || 20000,
		body: lines.join("\n") + "\n",
		onLog: opts.onLog
	});

	var kv = g850ParseKV(rep.done);
	var crc = parseInt(kv.crc, 16);
	if (isNaN(crc))
		throw new Error("LOAD の応答に crc が無い: " + rep.done);

	var mine = g850Crc16(bytes);
	if (crc !== mine)
		throw new Error("CRC が一致しない: デバイス " + g850Hex4(crc) +
		                " / こちら " + g850Hex4(mine));
	return crc;
};

/*
	デバイスのバッファを取り出す (DUMP)。往復の確認に使う。
*/
G850Link.prototype.dump = async function (opts) {
	opts = opts || {};
	var rep = await this.command("DUMP", { timeout: opts.timeout || 20000 });

	/* "D 0 <オフセット> <16進>" を集める */
	var parts = [];
	var total = 0;
	for (var i = 0; i < rep.data.length; i++) {
		var t = rep.data[i].split(/\s+/);
		if (t[0] !== "D")
			continue;
		var off = parseInt(t[2], 16);
		var hex = t[3] || "";
		if (off !== total)
			throw new Error("DUMP のオフセットが飛んだ: " + off +
			                " (期待 " + total + ")");
		var b = new Uint8Array(hex.length / 2);
		for (var k = 0; k < b.length; k++)
			b[k] = parseInt(hex.substr(k * 2, 2), 16);
		parts.push(b);
		total += b.length;
	}

	var out = new Uint8Array(total);
	var pos = 0;
	for (var j = 0; j < parts.length; j++) {
		out.set(parts[j], pos);
		pos += parts[j].length;
	}
	return out;
};

/* ---- 実機の波形を取り込む (CAP) -------------------------------------- */

/*
	CAP の結果から .bin を組み立てる。

	`+D <ブロック> <オフセット> <16進>` が 32 バイトごとに届く。
	ブロック 1 が .bin のヘッダ 48 バイト、ブロック 2 が本体。
	**どちらも末尾 2 バイトはパリティなので落とす。**

	opts:
	  timeout     取り込みの制限時間 [秒]。既定 300
	  onState     "armed" / "begin" / "receiving" / "done"
	  onProgress  { bits, total, pct, blk, bytes }

	戻り値: { bin, blocks, marks, bits, glitch, ovf, ms }
*/
G850Link.prototype.capture = async function (opts) {
	opts = opts || {};
	var sec = opts.timeout || 300;

	/* ブロック番号 -> { off, chunks[] } */
	var blocks = {};
	var reports = [];
	var declared = -1;

	/*
		進捗の分母。本体サイズが分かるまでは PWM1 のぶんだけ。

		  PWM1 = 10000 + 40 + 40 + 1 + (48 + 2) * 9 + 1 = 10532
		  PWM2 = 25848 + 20 + 20 + 1 + (N  + 2) * 9 + 1

		実機が出すヘッダのビット数は固定なので、この式で計算できる。
	*/
	var totalBits = 10532;

	var self = this;
	var rep = await this.command("CAP " + sec, {
		timeout: (sec + 30) * 1000,

		onData: function (line) {
			var t = line.split(/\s+/);
			if (t[0] === "D") {
				var blk = parseInt(t[1], 10);
				var off = parseInt(t[2], 16);
				var hex = t[3] || "";
				var b = blocks[blk] || (blocks[blk] = { off: 0, chunks: [], len: 0 });
				if (off !== b.len)
					throw new Error("CAP のオフセットが飛んだ: ブロック " + blk +
					                " " + off + " (期待 " + b.len + ")");
				var u = new Uint8Array(hex.length / 2);
				for (var i = 0; i < u.length; i++)
					u[i] = parseInt(hex.substr(i * 2, 2), 16);
				b.chunks.push(u);
				b.len += u.length;

				/*
					ブロック 1 が 48 バイト以上そろった時点で本体サイズが
					分かる。PWM2 が始まる前なので、進捗の分母を
					正しくしてから本体の受信に入れる。
				*/
				if (blk === 1 && declared < 0 && b.len >= 20) {
					var head = g850Concat(b.chunks);
					declared = head[0x12] | (head[0x13] << 8);
					totalBits = 10532 + 25848 + 20 + 20 + 1 +
					            (declared + 2) * 9 + 1;
				}
			} else if (t[0] === "R") {
				reports.push(g850ParseKV(line.substring(2)));
			}
		},

		onLog: function (line) {
			if (line.indexOf("cap armed") === 0 && opts.onState)
				opts.onState("armed");
			else if (line.indexOf("cap begin") === 0 && opts.onState)
				opts.onState("begin");
		},

		onProgress: function (line) {
			if (line.indexOf("CAP waiting") === 0) {
				if (opts.onState) opts.onState("waiting");
				return;
			}
			if (line.indexOf("CAP ") !== 0)
				return;
			/*
				進捗は bits を使う。bytes ではない。
				PWM2 のヘッダ 25848 ビットを読み飛ばす 8.4 秒間は
				1 バイトも復号されないので、bytes は 0 のまま止まって見える。
			*/
			var kv = g850ParseKV(line.substring(4));
			var bits = parseInt(kv.bits, 10) || 0;
			if (opts.onProgress)
				opts.onProgress({
					bits: bits,
					total: totalBits,
					pct: Math.min(100, Math.floor(bits * 100 / totalBits)),
					blk: parseInt(kv.blk, 10) || 0,
					bytes: parseInt(kv.bytes, 10) || 0
				});
		}
	});

	if (opts.onState)
		opts.onState("done");

	var summary = g850ParseKV(rep.done ? rep.done : "");
	var done = {};
	rep.data.forEach(function (l) {
		if (l.indexOf("DONE ") === 0)
			done = g850ParseKV(l.substring(5));
	});

	/* --- 検算 --------------------------------------------------------- */

	if (!blocks[1] || !blocks[2])
		throw new Error("ブロックが揃っていない（" +
		                Object.keys(blocks).join(",") +
		                "）。転送の途中から拾った可能性がある");

	for (var i = 0; i < reports.length; i++) {
		var r = reports[i];
		if (r.parity !== r.calc)
			throw new Error("ブロック " + (i + 1) + " のパリティが合わない: " +
			                r.parity + " / 計算 " + r.calc);
		if (parseInt(r.fe, 10) > 0)
			throw new Error("ブロック " + (i + 1) + " にフレーミングエラー: fe=" + r.fe);
	}
	if (done.ovf && parseInt(done.ovf, 10) > 0)
		throw new Error("エッジを取りこぼした: ovf=" + done.ovf);

	/* 末尾 2 バイトのパリティを落とす */
	var head = g850Concat(blocks[1].chunks);
	var body = g850Concat(blocks[2].chunks);
	if (head.length < 50 || body.length < 2)
		throw new Error("ブロックが短すぎる: " + head.length + " / " + body.length);
	head = head.subarray(0, head.length - 2);
	body = body.subarray(0, body.length - 2);

	if (head.length !== 48)
		throw new Error("ヘッダが 48 バイトでない: " + head.length);

	var size = head[0x12] | (head[0x13] << 8);
	if (size !== body.length)
		throw new Error("本体の長さが申告と違う: " + body.length +
		                "（申告 " + size + "）");

	var bin = new Uint8Array(head.length + body.length);
	bin.set(head, 0);
	bin.set(body, head.length);

	return {
		bin: bin,
		marks: parseInt(done.marks, 10) || 0,
		bits: parseInt(done.bits, 10) || 0,
		glitch: parseInt(done.glitch, 10) || 0,
		ovf: parseInt(done.ovf, 10) || 0,
		ms: parseInt(done.ms, 10) || 0,
		reports: reports
	};
};

/* Uint8Array の配列を 1 本につなぐ */
function g850Concat(list) {
	var total = 0, i;
	for (i = 0; i < list.length; i++)
		total += list[i].length;
	var out = new Uint8Array(total);
	var pos = 0;
	for (i = 0; i < list.length; i++) {
		out.set(list[i], pos);
		pos += list[i].length;
	}
	return out;
}

/* ---- .bin を実機へ送る (LOAD + PLAY) --------------------------------- */

/*
	バッファの内容を PWM 波形として実機へ送出する。

	**先に実機で BLOAD を実行して待たせておくこと。**
	実機の BLOAD は BREAK するまで待ち続けるので、待たせる側を
	実機にしておけば取りこぼしが無い。

	2854 バイトで約 17.5 秒（起動時の既定 PROFILE FAST）。
*/
G850Link.prototype.play = async function (opts) {
	opts = opts || {};
	var rep = await this.command("PLAY " + (opts.delayMs || 0), {
		timeout: opts.timeout || 180000,
		onProgress: function (line) {
			/* "PLAY <済み>/<総数> <%>" */
			var m = line.match(/^PLAY (\d+)\/(\d+)\s+(\d+)/);
			if (m && opts.onProgress)
				opts.onProgress({
					done: parseInt(m[1], 10),
					total: parseInt(m[2], 10),
					pct: parseInt(m[3], 10)
				});
		}
	});

	var done = {};
	rep.data.forEach(function (l) {
		if (l.indexOf("DONE ") === 0)
			done = g850ParseKV(l.substring(5));
	});
	if (done.status && done.status !== "ok")
		throw new Error("送出が完了しなかった: " + done.status);
	return { ms: parseInt(done.ms, 10) || 0, n: parseInt(done.n, 10) || 0 };
};

/* .bin を送り込んでから送出する。実機側は先に BLOAD で待たせておくこと */
G850Link.prototype.sendBin = async function (bytes, opts) {
	opts = opts || {};
	await this.load(bytes, { onLog: opts.onLog });
	return await this.play(opts);
};

/* ---- .bin を流し込みながら送る (PLAYS) -------------------------------- */

/*
	16 進を少しずつ書き込む。

	**詰まったら待たされるのが正しい。** デバイスはリングが埋まると読むのを
	やめ、USB が NAK を返してこちらの write が止まる。それがそのまま流量
	調整になるので、クレジットのやり取りは要らない。
*/
/*
	1 回の書き込みで送るバイト数。

	**大きめにする。** ブラウザではエミュレータ本体が同じスレッドで動いて
	おり、await のたびにイベントループを回すことになる。小分けにすると
	往復が増え、供給が細ってデバイス側が underrun になる（2026-08-30、
	64 バイトでは 20163 バイトの送出が途中で止まり ERROR 81 になった）。
	詰まれば write が待たされるので、大きくしても流量調整は効く。
*/
var G850_STREAM_CHUNK = 1024;

/*
	詰まらせないための余裕。報告された空きからこれを引いた分しか書かない。

	報告は 300ms ごとで、その間にもデバイスは食べ続けている。つまり実際の
	空きは報告値より大きい。それでも余裕を残すのは、報告と書き込みの間に
	何も食べなかった場合でも溢れさせないため。
*/
var G850_STREAM_MARGIN = 128;

/* 行の "free=<n>" を取り出す。無ければ dflt */
function g850StreamFree(line, dflt) {
	var m = line.match(/free=(\d+)/);
	return m ? parseInt(m[1], 10) : dflt;
}

/*
	デバイスが報告した空きを受け取る。

	**流量調整はこれだけが頼り。** 「詰まったら write が待たされる」という
	前提は成り立たない（_streamHex のコメントを参照）。
*/
G850Link.prototype._setStreamCredit = function (free) {
	var c = free - G850_STREAM_MARGIN;
	this._streamCredit = (c > 0) ? c : 0;
	if (this._creditWake) {
		var wake = this._creditWake;
		this._creditWake = null;
		wake();
	}
};

/*
	16 進を、デバイスが「空いている」と言った分だけ書く。

	**詰まらせてはいけない。** pyserial なら詰まっても write が待たされる
	だけだが、**Firefox の Web Serial は待たずにストリームをエラーにする。**
	一度エラーになると以後の書き込みがすべて失敗し、接続し直すまで戻らない
	（2026-08-30 に実機への送出で発生）。
*/
G850Link.prototype._streamHex = async function (bytes) {
	var self = this;
	var off = 0;

	while (off < bytes.length) {
		if (this._streamCredit <= 0) {
			/* 次の空きの報告を待つ。進捗は 300ms ごとに来る */
			await new Promise(function (resolve) {
				self._creditWake = resolve;
				setTimeout(function () {
					if (self._creditWake === resolve) {
						self._creditWake = null;
						resolve();
					}
				}, 5000);
			});
			continue;
		}

		var n = Math.min(this._streamCredit, G850_STREAM_CHUNK,
		                 bytes.length - off);
		var hex = "";
		for (var i = off; i < off + n; i++)
			hex += g850Hex2(bytes[i]);

		await this._write(hex + "\n");
		this._streamCredit -= n;
		off += n;
	}
};

/*
	貯めずに流し込みながら送出する。

	**大きさに上限が無い。** デバイスのバッファは 12288 バイトで頭打ちに
	なるが（RAM の都合で 13824 までしか増やせない）、こちらは 512 バイトの
	リングしか使わない。実機の空き容量 27286 バイトの全部を送れる。

	**先に実機で BLOAD を実行して待たせておくこと。** load() のような
	CRC の突き合わせは無いが、デバイスが受け取ったバイト数 (fed) と
	化けたビット数 (hbad) を返すので、それで確かめる。
*/
G850Link.prototype.playStream = async function (bytes, opts) {
	opts = opts || {};
	if (bytes.length < 49)
		throw new Error(".bin が短すぎる: " + bytes.length + " バイト");

	var self = this;
	var started = false;
	this._streamCredit = 0;
	this._creditWake = null;
	this._streamError = null;

	var rep = await this.command("PLAYS " + bytes.length + " " +
	                             (opts.delayMs || 0), {
		timeout: opts.timeout || 600000,
		onLog: opts.onLog,
		onData: function (line) {
			/* +RDY を見てから流し始める。先に流すと頭を取り逃がす */
			if (!started && line.indexOf("RDY") === 0) {
				started = true;
				self._setStreamCredit(g850StreamFree(line, 0));
				self._streamHex(bytes).catch(function (e) {
					/*
						書き込みが失敗したら、以後は何を書いても失敗する。
						つないだ状態も戻らないので中断して知らせる。
					*/
					self._streamError = e;
					self.abort();
				});
			}
		},
		onProgress: function (line) {
			var free = g850StreamFree(line, -1);
			if (free >= 0)
				self._setStreamCredit(free);
			var m = line.match(/^PLAY (\d+)\/(\d+)\s+(\d+)/);
			if (m && opts.onProgress)
				opts.onProgress({
					done: parseInt(m[1], 10),
					total: parseInt(m[2], 10),
					pct: parseInt(m[3], 10)
				});
		}
	});

	if (this._streamError)
		throw new Error("送り込みが途切れた (" + this._streamError.message +
		                ")。接続し直してください");

	var done = {};
	rep.data.forEach(function (l) {
		if (l.indexOf("DONE ") === 0)
			done = g850ParseKV(l.substring(5));
	});
	if (done.status && done.status !== "ok")
		throw new Error("送出が完了しなかった: " + done.status);

	var fed = parseInt(done.fed, 10);
	if (fed !== bytes.length)
		throw new Error("送り込んだ量が合わない: デバイス " + fed +
		                " / こちら " + bytes.length);

	return {
		ms: parseInt(done.ms, 10) || 0,
		n: parseInt(done.n, 10) || 0,
		bad: parseInt(done.hbad, 10) || 0,
		under: parseInt(done.under, 10) || 0
	};
};
