# エミュレータのデバッグ操作

解析作業でエミュレータを動かすときの手順と勘所。実際に試して確認できたものを追記していく。

## 起動（解析用）

リポジトリ直下をローカル HTTP サーバで配信し、ブラウザで開く。

```bash
python tools/serve.py          # 既定 8850 番
# → http://127.0.0.1:8850/webg850v.htm
```

**`python -m http.server` を直接使わないこと。**
ブラウザが `g800main.js` をキャッシュし、コードを直しても古いものを掘み続ける。
ページを再読み込みしても直らない（スクリプトの URL が同じのでキャッシュが効く）ので、
新しい関数が `is not defined` になって初めて気づくことになる。
[../../tools/serve.py](../../tools/serve.py) は全レスポンスでキャッシュを禁止し、`Last-Modified` も落とす。

**確認済み**: この方法なら Firefox の `security.fileuri.strict_origin_policy` は不要で、
Chromium 系ブラウザでも実機 ROM を読み込んで起動する。`file://` が必要なのは
ローカルファイルを XHR で読むためだけなので、HTTP 配信にすればその制約が消える。

起動できたかは次で確認できる。

```js
rom.length        // 23 (rom[0]..rom[0x15] + 1)
romBanks          // 21
z80pc.toString(16)  // ROM 内のアドレスになっていれば実行中
machine           // 2 = MACHINE_G850
```

最終的な実装は Firefox + `file://` でも動く必要がある（[../../README.md](../../README.md)）。

## 画面を見る

LCD は canvas なので DOM を読んでも何も分からない。スクリーンショットを撮る。

| 対象 | セレクタ | 内容 |
|:--|:--|:--|
| 表示部のみ | `#lcd` | 24桁×6行のドットマトリクス |
| ステータス含む | `section.LCD` | 右側の `#seglcd` に RUN / PRO / CAPS / DEG / BUSY 等が出る |

**動作モードや BUSY はドットマトリクス側ではなく `#seglcd` に出る。**
モードを確認したいときは `section.LCD` 全体を撮ること。

## キー入力

`buttonHold(gkey)` / `buttonRelease(gkey)` を JavaScript から直接呼ぶ。
`keyMatrix` を直接叩くので、画面上のボタンを click する必要はない。

- `gkey` は `GKEY_A` `GKEY_0` `GKEY_RETURN` などのグローバル定数。
- SHIFT 併用のキーは `new Uint8Array([GKEY_SHIFT, GKEY_W])` のように配列で渡せる
  （`buttonHold` が配列を再帰処理する）。`"` は SHIFT+W、`:` は既定の `GKEY_COLON` が
  `Uint8Array([GKEY_SHIFT, GKEY_SEMICOLON])` として定義済み。
- **押しっぱなしの時間が必要。** ROM がキーマトリクスをスキャンするのは実時間で進むため、
  押下 90ms・離してから 60ms 程度の間隔を空けると確実に入る。連続入力は非同期に待つこと。

```js
async function press(gkey) {
  buttonHold(gkey);
  await sleep(90);
  buttonRelease(gkey);
  await sleep(60);
}
```

## BASIC を操作するときの勘所

**実際に詰まった点なので必ず読むこと。**

- **エラーが出たら次の入力の前に CLS を押す。**
  `ERROR nn` が表示された状態では入力行が残っており、**以降のキー入力が一切反映されない。**
  画面が固まったように見えるが CPU は動いている（キースキャンの I/O は回り続ける）。
  `GKEY_CLS` を 1 回押せば復帰する。
- **プログラム行の入力には PROGRAM MODE が必要。**
  起動直後は RUN MODE で、`10 REM ...` のような行を打つと `ERROR 10` になる。
  `GKEY_BASIC` を押すと RUN ⇔ PROGRAM が切り替わる。現在のモードは `#seglcd` の
  `RUN` / `PRO` 表示で確認する。
  - エラー状態のままでは `GKEY_BASIC` も効かない。**CLS → BASIC の順**に押すこと。
- 入力できたかは `LIST` で確認する。`10 REM UUUU` は `10:REM UUUU` と表示される。

## テスト用の実プログラムを手に入れる

自分で長いプログラムを打ち込まなくても、ROM 内蔵の BASE 変換プログラムを
メモリに呼び出して試験に使える。

1. RUN MODE で **2ndF** → **)（BASE-n）** を押す
   （`GKEY_2NDF` のあと `GKEY_RKAKKO`）
2. `***** n シン エンザン *****` のメニューが表示され、プログラムが動き始める
3. **ON キー（`GKEY_BREAK`）で Break** する
4. CLS → BASIC で PROGRAM MODE に移り、`LIST` すると `100:*INIT` から始まる
   プログラムが入っている

**2806 バイト**の BASIC 中間コードで、フレーム境界を大量にまたぐため
転送処理の試験に向いている。

**注意**: このプログラムは ROM に内蔵されているものなので、
`BSAVE` して得たファイルは **ROM 由来の著作物**にあたる。
`tools/tmp/` か `docs/binary/` に置き、絶対にコミットしないこと。

## 実行時フック（本体を書き換えずに計測する）

エミュレータの関数はすべてグローバルなので、実行時にラップすればフックを差し込める。
`g800main.js` を変更せずに計測できるので、解析中はこの方法を使う。

```js
// I/O ポートの利用状況を数える
var _in = z80inport, _out = z80outport;
z80inport  = function(a)   { inCnt[a] = (inCnt[a]||0)+1; return _in(a); };
z80outport = function(a,v) { outCnt[a] = (outCnt[a]||0)+1; return _out(a,v); };
```

`setInterval` から呼ばれる `run` も同様にラップできる（呼び出しがグローバル解決のため）。
フレーム数を数えれば、フレームをまたぐ累積 Z80 ステート数を作れる。

```js
var _run = run;
run = function() { frame++; _run(); };
// 累積ステート = frame * (clocks / (fps * fpsN)) + (z80executeStates - z80restStates)
// G850 既定では 1 フレーム 150,000 ステート
```

**計測結果はブラウザ内で集計してから取り出すこと。** 生の配列をそのまま持ち出さない。

## エミュレータ側の I/O の実装状況

- 未実装のポートは **read が常に `0x78`、write は無視**される（`z80inport` の最後の `return 0x78`）。
  ROM が未実装ポートを読んで判断している場合、実機と違う分岐に入る可能性がある。
- 11pin インターフェース周りは実装が薄い。`in18()` は常に 0。
  `in1f()` が返すのは BREAK キー（bit7）、`BLOAD` の送出（bit2）、
  TEXT の `Sio` の送信許可（bit1）だけ。

### アイドル時（BASIC のコマンド待ち）の I/O 基準値

キースキャンのループが回り続けるため、以下は「何もしていない状態」の目安。
異常を見分けるにはこの基準値と比較する。500ms あたりの回数:

| ポート | 方向 | 回数 |
|:--|:--|:--|
| `0x10` | in | 約 1210 |
| `0x11` | out | 約 1574 |
| `0x12` | out | 約 605 |
| `0x13` `0x14` `0x16` `0x1f` `0x40` | in | 各 約 121（1 フレームに 1 回）|
| `0x1d` `0x1e` | in/out | 各 約 243 |

## 後始末

- 作業用のスクリーンショットや測定データは `tools/tmp/` または `docs/binary/` に置く（どちらも追跡対象外）。
- Playwright を使うと作業ディレクトリに `.playwright-mcp/` が作られる。追跡しないこと。
