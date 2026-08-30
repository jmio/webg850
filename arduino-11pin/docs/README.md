# arduino-11pin/docs

Arduino Uno R4 Minima から PC-G850 実機の 11pin I/O を叩く実験のドキュメント。

| ファイル | 内容 |
|:--|:--|
| [experiment-plan.md](experiment-plan.md) | **実験計画**。目的・前提知見・ピン配置・手順・判定基準・リスク |
| [hardware.md](hardware.md) | 配線と通電前の安全確認 |
| [protocol.md](protocol.md) | USB Serial のコマンド仕様 |
| [waveform.md](waveform.md) | 送出・復号する波形の定義と実測値 |
| [experiment-log.md](experiment-log.md) | 実測の記録（段階ごとに追記）|

エミュレータ側の知見は本リポジトリの [../../docs/](../../docs/) にある。
とくに次の 3 つが本実験の前提。

- [../../docs/analysis/bsave-signal-format.md](../../docs/analysis/bsave-signal-format.md) — PWM の信号形式
- [../../docs/emulator/bsave-file-format.md](../../docs/emulator/bsave-file-format.md) — `.bin` のファイル形式
- [../../docs/emulator/bsave-bload.md](../../docs/emulator/bsave-bload.md) — 送出・復号の実装と短縮波形

**ROM を公開しないという最重要ルールは本フォルダでも同じ。**
実機から取り出したデータを置くときは、それが ROM 由来でないことを確かめること。
