# arduino-11pin/docs

Arduino Uno R4 Minima から PC-G850 実機の 11pin I/O を叩く実験のドキュメント。

| ファイル | 内容 |
|:--|:--|
| [experiment-plan.md](experiment-plan.md) | **実験計画**。目的・前提知見・ピン配置・手順・判定基準・リスク |
| [hardware.md](hardware.md) | 配線と通電前の安全確認 |
| [protocol.md](protocol.md) | USB Serial のコマンド仕様 |
| [waveform.md](waveform.md) | 送出・復号する波形の定義と実測値 |
| [experiment-log.md](experiment-log.md) | 実測の記録（段階ごとに追記）|
| [cal-2026-08-30-pc-g850v.json](cal-2026-08-30-pc-g850v.json) | **較正の生の結果**（`CAL` の出力）。下記を参照 |

エミュレータ側の知見は本リポジトリの [../../docs/](../../docs/) にある。
とくに次の 3 つが本実験の前提。

- [../../docs/analysis/bsave-signal-format.md](../../docs/analysis/bsave-signal-format.md) — PWM の信号形式
- [../../docs/emulator/bsave-file-format.md](../../docs/emulator/bsave-file-format.md) — `.bin` のファイル形式
- [../../docs/emulator/bsave-bload.md](../../docs/emulator/bsave-bload.md) — 送出・復号の実装と短縮波形

**ROM を公開しないという最重要ルールは本フォルダでも同じ。**
実機から取り出したデータを置くときは、それが ROM 由来でないことを確かめること。

## cal-2026-08-30-pc-g850v.json について

`g850ctl.py cal --save` が吐いた較正結果を、**記録として**置いてある。
2026-08-30 に PC-G850V の実機 1 台で `BSAVE` を測ったときのもの。

**動作には要らない。** ここに入っている値は
[../src/timing.cpp](../src/timing.cpp) の既定値として焼き込んであるので、
ファームウェアは何も読み込まずに動く。
残してあるのは、まとめた表（[waveform.md](waveform.md) の「実測値」、
[experiment-log.md](experiment-log.md) の段階 1）が
**元のどの観測から出たのかを後から辿れるようにする**ため。
パルス幅のかたまり・外れ値・長い区間の並びが、丸める前の形で入っている。

別の個体で `cal --save` を取り直したときは、
`docs/cal-<日付>-<機種>.json` の名前で並べて置けばよい（`.gitignore` は
`docs/` 以下の `cal-*.json` だけ追跡対象にしてある）。
作業ディレクトリに置いた `cal-*.json` は従来どおり無視される。
