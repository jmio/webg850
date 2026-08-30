/*
	realio.js - BSAVE の出力先 / BLOAD の入力元を「ファイル」と「実機」から選ぶ

	実機とのやり取りは webserial.js の G850Link が行う。
	ここは選択の状態と画面の面倒を見るだけで、プロトコルの知識は持たない。

	用語に注意（取り違えやすい）:

	  「実機とやり取り」  エミュレータで実行   実機で実行   波形の向き
	  ------------------  -------------------  -----------  ---------------
	  off                 BSAVE / BLOAD        --           --
	  on                  BSAVE                BLOAD        Arduino → 実機
	  on                  BLOAD                BSAVE        実機 → Arduino

	エミュレータが保存する先が実機のとき、実機側で実行するのは BLOAD。
	エミュレータが読み込む元が実機のとき、実機側で実行するのは BSAVE。
	保存と読み込みで実機側の操作が入れ替わる。

	計画と実測は docs/plans/2026-08-30-webserial-real-machine-io.md を参照。
*/
"use strict";

var realioLink = null;          /* G850Link。未接続なら null */
var realioBusy = false;         /* 転送中は多重実行を防ぐ */
var realioPendingBin = null;    /* BSAVE で作られ、まだ送出していない .bin */

/* ---- 画面 ------------------------------------------------------------ */

function realioEl(id) {
	return document.getElementById(id);
}

function realioStatus(text, kind) {
	var e = realioEl("REALIO_STAT");
	if (!e)
		return;
	e.textContent = text;
	e.style.color = (kind === "ng" ? "#a00" : (kind === "ok" ? "#060" : "#000"));
}

function realioProgress(pct, label) {
	var bar = realioEl("REALIO_BAR");
	if (!bar)
		return;
	if (pct == null) {
		bar.style.visibility = "hidden";
		return;
	}
	bar.style.visibility = "visible";
	realioEl("REALIO_BARFILL").style.width = Math.max(0, Math.min(100, pct)) + "%";
	realioEl("REALIO_BARTEXT").textContent = label || (pct + "%");
}

/*
	実機とやり取りするか。

	BSAVE の出力先と BLOAD の入力元は別々に選ばない。実機をつないで
	いるときは両方向とも実機を相手にしたい場面しか無く、片方だけ
	切り替える理由が無いため。外すとどちらも従来どおりファイルになる。
*/
function realioUseReal() {
	var e = realioEl("REALIO_USE");
	return e != null && e.checked;
}

function realioSetButtons() {
	var on = (realioLink != null && realioLink.isOpen());
	var use = realioUseReal();

	realioEl("REALIO_CONNECT").textContent = on ? "切断" : "接続";
	realioEl("REALIO_CONNECT").disabled = realioBusy;

	/* つないでいないうちは実機を相手に選べないようにする */
	var chk = realioEl("REALIO_USE");
	if (chk) {
		chk.disabled = !on || realioBusy;
		if (!on && chk.checked) {
			chk.checked = false;
			use = false;
		}
	}

	realioEl("REALIO_SEND").disabled = !on || realioBusy || realioPendingBin == null;
	realioEl("REALIO_RECV").disabled = !on || realioBusy || !use;
	realioEl("REALIO_ABORT").disabled = !realioBusy;
}

/* ---- 接続 ------------------------------------------------------------ */

/*
	接続 / 切断。

	許可が保存されないので、開くたびに requestPort() のダイアログが出る
	（2026-08-30 に Firefox で実測）。getPorts() は当てにしない。
*/
async function realioToggleConnect() {
	if (realioLink && realioLink.isOpen()) {
		await realioLink.disconnect();
		realioLink = null;
		realioStatus("切断した");
		realioSetButtons();
		return;
	}

	realioStatus("ポートを選んでください…");
	var link = new G850Link();
	try {
		var ver = await link.connect();
		realioLink = link;
		realioStatus("接続: g850-11pin " + ver, "ok");
	} catch (e) {
		realioLink = null;
		realioStatus("接続できない: " + e.message, "ng");
	}
	realioSetButtons();
}

/* ---- BSAVE 先 = 実機 -------------------------------------------------- */

/*
	g800main.js の bsaveFinish() から呼ばれる。

	true を返すとファイルへの保存を行わない。
	実機は BLOAD で待たせておく必要があるので、ここでは送出せずに
	預かるだけにして、利用者が [実機へ送出] を押したときに送る。
*/
function realioBsaveSink(bin, head) {
	if (!realioUseReal())
		return false;
	if (!realioLink || !realioLink.isOpen()) {
		realioStatus("実機につながっていない。ファイルへ保存します", "ng");
		return false;
	}
	if (bin.length > 12288) {
		/*
			ファームウェアの .bin バッファは 12288 バイト。
			RAM の都合で 13824 までしか増やせない（ヒープ 8KB と
			スタック 1KB が固定）。取り込み側に上限は無いが、
			送出側だけこの制限がある。
		*/
		realioStatus(bin.length + " バイトは送出の上限 12288 を超える。" +
		             "ファイルへ保存します", "ng");
		return false;
	}

	realioPendingBin = bin;
	realioStatus("受け取った " + bin.length + " バイト。" +
	             "実機で BLOAD を実行してから [実機へ送出] を押してください");
	realioSetButtons();
	return true;
}

/*
	預かった .bin を実機へ送る。

	実機側は先に BLOAD で待たせておくこと。実機の BLOAD は BREAK するまで
	待ち続けるので、待たせる側を実機にしておけば取りこぼしが無い。
*/
async function realioSend() {
	if (!realioLink || !realioLink.isOpen() || realioPendingBin == null)
		return;

	realioBusy = true;
	realioSetButtons();
	var bin = realioPendingBin;

	try {
		realioStatus("送り込み中… " + bin.length + " バイト");
		realioProgress(0, "LOAD");
		await realioLink.load(bin);

		realioStatus("送出中… 実機が受け取っています");
		var r = await realioLink.play({
			onProgress: function (p) {
				realioProgress(p.pct, "送出 " + p.pct + "%");
			}
		});

		realioProgress(100, "完了");
		realioStatus("送出完了 " + bin.length + " バイト / " +
		             (r.ms / 1000).toFixed(1) + " 秒。" +
		             "実機の画面右下に * が出れば成功", "ok");
		realioPendingBin = null;
	} catch (e) {
		realioProgress(null);
		realioStatus("送出に失敗: " + e.message, "ng");
	}
	realioBusy = false;
	realioSetButtons();
}

/* ---- BLOAD 元 = 実機 -------------------------------------------------- */

/*
	実機の BSAVE を取り込み、エミュレータの BLOAD へ仕込む。

	**待機に入ったことを確認してから利用者に合図する。**
	確認せずに合図すると転送の途中から拾い、ヘッダを取り逃がす。
	`#cap armed` を受け取ってから「実機で BSAVE を実行」と出す。
*/
async function realioReceive() {
	if (!realioLink || !realioLink.isOpen())
		return;

	realioBusy = true;
	realioSetButtons();
	realioProgress(0, "待機");

	try {
		realioStatus("待機の準備中…");
		var r = await realioLink.capture({
			timeout: 300,
			onState: function (st) {
				if (st === "armed" || st === "waiting")
					realioStatus("待機中。実機で BSAVE を実行してください");
				else if (st === "begin")
					realioStatus("転送を検出。受信中…（約 40 秒）");
			},
			onProgress: function (p) {
				realioProgress(p.pct, "受信 " + p.pct + "%");
			}
		});

		realioProgress(100, "完了");

		var info = bloadSetBytes(r.bin);
		realioStatus("取り込み完了 " + r.bin.length + " バイト" +
		             "（本体 " + info.size + "）/ " +
		             (r.ms / 1000).toFixed(1) + " 秒。" +
		             "エミュレータで BLOAD を実行してください", "ok");
	} catch (e) {
		realioProgress(null);
		realioStatus("取り込みに失敗: " + e.message, "ng");
	}
	realioBusy = false;
	realioSetButtons();
}

/* ---- 中断 ------------------------------------------------------------ */

function realioAbort() {
	if (realioLink && realioLink.isOpen())
		realioLink.abort();
	realioStatus("中断を送った");
}

/* ---- 組み込み --------------------------------------------------------- */

/*
	Web Serial が使えない環境ではブロックごと隠す。
	既存の LOAD BIN / BSAVE CAPTURE はそのまま使えるので、
	従来の動作は一切変わらない。
*/
function realioInit() {
	var rows = document.querySelectorAll(".REALIOROW");
	if (rows.length === 0)
		return;
	if (!g850SerialAvailable()) {
		for (var i = 0; i < rows.length; i++)
			rows[i].style.display = "none";
		return;
	}
	realioProgress(null);
	realioStatus("未接続");
	realioSetButtons();
}
