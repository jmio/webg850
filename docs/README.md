# docs

PC-G850 の内部解析と、エミュレータへの実装のドキュメントを置く場所です。

## 構成

| 場所 | 追跡 | 内容 |
|:--|:--|:--|
| [analysis/](analysis/) | する | **解析結果**。実機とその ROM がどうなっているか。信号フォーマット、I/O ポートの仕様など |
| [emulator/](emulator/) | する | **エミュレータへの実装**。webg850 側でどう作ったか、どう使うか、保存するファイルの形式 |
| [plans/](plans/) | する | 解析計画。何を、どの手順で、どこまで調べるかを事前に書き出したもの |
| `binary/` | **しない** | ROM (Z80 バイナリ) の解析経過のドキュメントと、書き出した逆アセンブル結果・ダンプなどの作業ファイル |

**解析結果と実装は必ず分けて書きます。** 「実機がこうなっている」という発見は `analysis/`、
「エミュレータでこう作った」は `emulator/` です。互いにリンクで参照します。

なお `analysis/io-ports.md` には各ポートのエミュレータ実装状況を併記しています。
ポートの仕様と実装状況は突き合わせて見るものなので、この表だけは例外的に同居させています。

## 現在あるもの

### analysis/

| ファイル | 内容 |
|:--|:--|
| [analysis/bsave-signal-format.md](analysis/bsave-signal-format.md) | `BSAVE` / `BLOAD` が 11pin へ流す PWM 信号の形式。外部資料と実測の突き合わせ |
| [analysis/io-ports.md](analysis/io-ports.md) | `10H`-`1FH` と `60H`-`74H` の I/O ポート一覧 |
| [analysis/11pin-uart.md](analysis/11pin-uart.md) | 11pin インターフェースと UART のレジスタ、初期化手順 |
| [analysis/text-sio.md](analysis/text-sio.md) | TEXT モードの `Sio` の `Save` / `Load`。UART ではなく調歩同期のビットバンギング |

### emulator/

| ファイル | 内容 |
|:--|:--|
| [emulator/bsave-bload.md](emulator/bsave-bload.md) | `BSAVE` / `BLOAD` エミュレーションの仕組みと使い方 |
| [emulator/bsave-file-format.md](emulator/bsave-file-format.md) | 保存されるファイルの形式。これだけ読めば別のツールで読み書きできる |
| [emulator/debug-operation.md](emulator/debug-operation.md) | エミュレータを動かして解析するときの手順と勘所 |
| [emulator/text-sio-file-io.md](emulator/text-sio-file-io.md) | TEXT モードの `Sio` の `Save` / `Load` をファイルとして出し入れする仕組み |
| [emulator/screen-layout.md](emulator/screen-layout.md) | 画面レイアウトの固定と自動縮小の仕組み |

## 書くときの注意

**ROM の実体を貼らないこと。** `rom.zip` は SHARP の著作権保護対象であり、
本リポジトリは public です。逆アセンブル結果の長い引用や、連続したバイト列のダンプを
そのまま貼り付けてはいけません。

**ROM (Z80 バイナリ) の解析経過のドキュメントは `docs/binary/` 以下に書きます。**
ROM の内容を書き出した作業ファイル（逆アセンブル結果・ダンプ）も同じ場所です。
このフォルダは `.gitignore` で除外されているためコミットされません。この除外を解除しないでください。

ROM 内蔵のプログラムを `BSAVE` して得たファイルも ROM 由来の著作物です。
`tools/tmp/` か `docs/binary/` に置いてください。

## 解析経過を docs/ へ移すまでの流れ

1. **解析中は `docs/binary/` に書く。** 追跡対象外なので、ROM の内容に踏み込んだ記述をしてよい。
   逆アセンブル結果やダンプもここに置く。
2. 一区切りついたら、**ROM の内容に直接依存しない部分だけを抜き出してリライト**する。
   逆アセンブルの引用やバイト列を落とし、アドレスと役割の対応・処理の流れ・仕様の記述に置き換える。
3. **リライトした内容の確認を得てから** `analysis/` または `emulator/` へ移す。
   ここへ置いた時点でコミット対象になる。

`docs/binary/` の内容をそのままコピーしないこと。必ず 2 のリライトを挟む。
確認を経ずに移動・コミットしないこと。

コミットするドキュメントには、次のような「調べて分かった事実の記述」として残してください。

- アドレスと役割の対応（例: `0xBD03` はキー入力待ちのエントリ）
- 引数・戻り値・破壊されるレジスタ
- 処理の流れを日本語で説明したもの
- 再現に必要な最小限の断片（数命令程度）

詳細は [../AGENTS.md](../AGENTS.md) を参照してください。
