# AGENTS.md

このリポジトリで作業する AI コーディングエージェント（Claude Code / Codex / Copilot など）向けの
プロジェクトガイドです。人間の利用者向けの説明は [README.md](README.md) を参照してください。

---

## 最重要ルール: ROM を公開しない

**`rom.zip` は絶対にコミット・アップロード・再配布してはいけません。**

- `rom.zip` は SHARP PC-G850 の実機から吸い出した ROM イメージ（Intel HEX 形式を ZIP で固めたもの）です。
- SHARP の著作権保護対象であり、本リポジトリは **public** です。
- そのため `.gitignore` で除外しています。この除外を解除しないでください。
- `git add -f rom.zip` のような強制追加、ROM のバイト列やダンプ結果をコミットに含める行為、
  ROM 由来のコードを丸ごと貼り付ける行為も同様に禁止です。
- 解析メモを残す場合も、ROM の実体（連続したバイナリ／逆アセンブル全文）ではなく、
  アドレスと意味の対応など「事実の記述」に留めてください。

ROM は利用者が自分の実機から取り出し、`webg850v.htm` と同じフォルダに置く前提です。

---

## プロジェクト概要

SHARP のポケットコンピュータ **PC-G850 シリーズのエミュレータ**を、
Firefox 上で動かして**ポケコンの内部解析**を行うための環境です。

- ベースは maruhiro 氏の `g800.js`（PC-G800 系全般対応）。本環境は **PC-G850 モード専用**の想定で改変。
- 実機 ROM を読み込んで実行するため、実機と同じ挙動を追いながら
  ディスアセンブル・メモリダンプ・ブレークポイント・ステップ実行ができます。
- ライセンス: MIT（[LICENSE](LICENSE) を参照）。同梱物の著作権表記は `readme_copyright_*.txt` / `.md` を参照。

### ビルド・テストについて

- **ビルドシステムはありません。** npm / bundler / トランスパイラ等は一切使いません。
- 素の JavaScript（ES5 相当、`var` ベース、グローバル関数中心）を `<script>` で直接読み込みます。
- **自動テストもありません。** 動作確認は Firefox で `webg850v.htm` を開いて手動で行います。
- したがって「テストを実行して確認」はできません。変更後は起動確認手順（後述）を利用者に案内してください。

### 起動手順

1. Firefox の `about:config` で `security.fileuri.strict_origin_policy` を `false` にする
   （詳細は [firefox_localfile.txt](firefox_localfile.txt)）。
   ローカルファイル（`rom.zip` / `ram.txt`）を `XMLHttpRequest` で読むために必要です。
2. `rom.zip` を `webg850v.htm` と同じフォルダに置く。
3. `webg850v.htm` を Firefox で開く。

Chrome 系は `file://` の同一オリジン制約を緩められないため、そのままでは動きません。

---

## ファイル構成

| ファイル | 役割 | 出自 |
|:--|:--|:--|
| [webg850v.htm](webg850v.htm) | 唯一のエントリポイント。LCD 用 canvas、画面上のキーボード、デバッグ UI をすべて定義 | 本リポジトリ |
| [g800main.js](g800main.js) | エミュレータ本体。メモリ／I/O／LCD／キー／割り込み／デバッグ機能 | `g800.js` を分割・改変 |
| [z80.js](z80.js) | Z80 CPU コア（命令実行） | `g800.js` を分割・改変 |
| [mdZ80.js](mdZ80.js) | Z80 逆アセンブラ。C 版 Manbow-J Disassembler を JS へ移植 | 外部（改変あり） |
| [hex.js](hex.js) | Intel HEX デコーダ。ZIP 内 HEX の読み込みにも対応 | 本リポジトリ寄り |
| [jszip.js](jszip.js) | ZIP 展開ライブラリ（JSZip） | 外部（そのまま） |
| [ram.txt](ram.txt) | 起動時に流し込む RAM イメージ（Intel HEX, 0x0040-0x7FF0） | 本リポジトリ |
| `rom.zip` | 実機 ROM（**追跡対象外・公開禁止**） | 利用者が用意 |

`jszip.js` と `mdZ80.js` は外部由来です。**バグ修正以外で書き換えないでください。**
また各 `readme_copyright_*` の著作権表記は削除・改変しないでください。

---

## アーキテクチャ

### 実行モデル

```
init()  → 機種設定・canvas 生成・キーバインド
boot()  → z80reset() + I/O 初期値 + RST ベクタ等を RAM に直接書き込み
（rom.zip / ram.txt をロード）
setInterval(run, 1000/fps)   ← fps 既定 60
    run() → z80execute(clocks/(fps*fpsN), bken, bkpt) を 1 フレーム分実行
          → 割り込み処理（IA / KON / 1S / INT1）
          → VRAM から LCD イメージを再構築して canvas へ描画
```

`z80execute()` は「指定ステート数を消化するまで」命令を実行します。ブレーク時は `z80break` が立ち、
`z80exitbreak`（1=ステップ, 2=実行再開）で解除されます。

### メモリマップ（[g800main.js:767](g800main.js#L767) `z80read8` / `z80write8`）

| アドレス | 内容 |
|:--|:--|
| `0x0000`-`0x7FFF` | RAM（`ram`, 32KB）。書き込み可能なのはこの範囲のみ |
| `0x8000`-`0xBFFF` | 固定 ROM = `rom[0]` |
| `0xC000`-`0xFFFF` | バンク切り替え ROM = `rom[romBank]` |

- ROM は 16KB × 22 バンク（`rom[0]`〜`rom[0x15]`、`romBanks = 0x15`）。
- バンク選択は I/O ポート `0x19`（`in19` / `out19`）。`exBank` は拡張バンク。
- ROM 領域への書き込みは黙って捨てられます。

### I/O ポート（`z80inport` / `z80outport`）

`in<port>()` / `out<port>(x)` という命名で 1 ポート 1 関数に分かれています。

| ポート | 用途 |
|:--|:--|
| `0x10`-`0x12` | キーマトリクス（ストローブ／読み出し） |
| `0x18` | 11 ピン出力。ブザー波形生成 ＋ **シリアル出力キャプチャ**（`serialcapture`）|
| `0x19` | ROM バンク切り替え |
| `0x1B`-`0x1F` | タイマ・割り込みマスク等 |
| `0x40`, `0x41`, `0x60`-`0x6F` | PC-G850 の LCD コントローラ（`*_g850` 系関数）|
| `0x50`-`0x5B` | PC-G815 / E200 の LCD（`*_g815` / `*_e200`）。G850 では未使用 |

`serialcapture()` は `out18` に来るビット列をソフトウェア UART として復号し、
デバッグ窓に文字として出力します。ポケコン側から `PRINT #` 等で文字を出す解析に使えます。

### 機種差分

`MACHINE_E200` / `MACHINE_G815` / `MACHINE_G850` の 3 系統が残っています。
本リポジトリの想定は **G850 のみ**（`webg850v.htm` は `machine` を指定しないため既定の G850）ですが、
オリジナル由来の E200 / G815 用コードも残存しています。G850 に無関係な箇所を触らないよう注意してください。

G850 の既定値: クロック 9000kHz、LCD 24桁×6行（144×48 ドット）、VRAM は 8 行分。

### IOCS エミュレーション（ROM が無いときのフォールバック）

`z80subroutine(address)` は `0xBD03` などの IOCS エントリを JS 関数（`iocs_*`）で肩代わりする仕組みですが、

```js
if(romBanks > 0) return -1;   // ROM があるときは何もしない
```

となっており、**実機 ROM をロードしている本環境では IOCS エミュレーションは働きません。**
実際には ROM 内のコードがそのまま実行されます。`iocs_*` 群はオリジナル `g800.js` の
「ROM 無しで BASIC を動かす」ためのコードであり、解析対象ではありません。

### 起動時のロード（[g800main.js:3748](g800main.js#L3748) `init()` 直後）

```js
hexrom.readzip("rom.zip", romfiles);  // rom00.ihx 〜 rom15.ihx を ZIP から読む
hex.read("ram.txt");                  // RAM イメージ
```

`romfiles` 配列にファイル名が直書きされています。**ROM のファイル名や分割数を変える場合はここを修正します。**
1 ファイルずつ `.ihx` を読むコード（ZIP を使わない版）もコメントアウトで残っています。

### URL クエリによる設定（`getArg()`）

`<script src="./g800main.js?zoom=4&end=on&start=0&buzzer=n">` の **クエリ文字列**を設定として読みます
（ページの URL ではなく script タグの src である点に注意）。

主なキー: `machine`(e200/g815/g850) / `clocks`(kHz) / `zoom` / `orient`(v で縦) / `fps` /
`lcdscales`(階調数) / `buzzer`(y で音を出す) / `start`(開始 PC, 16進) / `program`(起動時ロードする ihx, `|` 区切り)

---

## デバッグ機能（この環境の主目的）

`webg850v.htm` の緑色のボタン群と、`g800main.js` 末尾のユーティリティが解析用の中核です。

| UI | 実体 | 内容 |
|:--|:--|:--|
| ENB / CLR | `consoleonoff()` / `clearconsole()` | デバッグ出力窓（`#TEXT_CONSOLE`）の表示切替・クリア |
| DISASM | `disasm(addr, count)` | `mdZ80` で逆アセンブル |
| DUMP | `memdump(addr, count)` | 16バイト/行のダンプ |
| REGS | `z80debug_log()` | 全レジスタ・フラグ・裏レジスタを表示 |
| BKPT / FETCH | `bken` / `fetch` + `#TEXT_BREAK` | PC 一致でブレーク。FETCH 有効時はメモリ READ でもブレーク |
| STEP / RUN | `z80break` / `z80exitbreak` | ステップ実行／実行再開 |
| RAMSAVE | `memtoihx(0x0040, 0x7FF0)` → `downloadData()` | RAM を Intel HEX で保存。`ram.txt` と差し替えれば状態を復元できる |
| LOAD IHX | `loadData()` | 任意の Intel HEX をメモリへロード |

**`console.log` は上書きされています**（[g800main.js:4110](g800main.js#L4110) 付近）。
出力はブラウザの開発者コンソールではなく、ページ内の `#TEXT_CONSOLE` テキストエリアへ流れます。
デバッグ出力を追加するときは `console.log` をそのまま使えば窓に出ますが、
毎フレーム呼ぶような出力は文字列連結でどんどん重くなるので避けてください。

RAMSAVE で状態を保存するときは、**先に画面上の OFF（電源オフ）を押してから**押す必要があります。
そうしないと起動用 `ram.txt` として使ったときに正しく復帰しません。

---

## コーディング規約

- 既存コードのスタイルに合わせること: `var`、タブインデント、日本語のブロックコメント `/* ... */`。
  ES6 以降の構文（`let`/`const`/アロー関数/クラス）を既存ファイルへ持ち込まないでください。
- 関数はグローバルスコープに置かれ、HTML の `onclick` から直接呼ばれます。名前を変えると HTML が壊れます。
- I/O ポートを追加・変更するときは `in<port>` / `out<port>` の命名と `z80inport` / `z80outport` の
  ディスパッチ表の両方を更新すること。
- 文字コードは UTF-8。`webg850v.htm` は `<meta charset="UTF-8">` を宣言済み。
- ドキュメント・コメントは日本語で書くこと。

## Git 運用

- コミットメッセージは日本語。
- `rom.zip` を含むコミットを作らないこと（前述）。コミット前に `git status` で確認する。
