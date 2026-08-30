# arduino-11pin

Arduino Uno R4 Minima から **PC-G850 実機の 11pin I/O** を叩き、
`BSAVE` / `BLOAD` の PWM 波形を出し入れする実験環境。

エミュレータ側で確定させた信号形式が実機にも通用するかを確かめ、
**実機とエミュレータの間で `.bin` を行き来させられるようにする**のが目的。

- **まず [docs/experiment-plan.md](docs/experiment-plan.md) を読むこと。**
  目的・前提知見・ピン配置・手順・判定基準がまとまっている。
- 配線は [docs/hardware.md](docs/hardware.md)。**通電前の確認を飛ばさない。**
- コマンド仕様は [docs/protocol.md](docs/protocol.md)。
- 実測の記録は [docs/experiment-log.md](docs/experiment-log.md)。

## 構成

```
arduino-11pin/
├── platformio.ini          PlatformIO の設定（renesas-ra / uno_r4_minima）
├── src/
│   ├── config.h            ピン割り当て・バッファ構成・起動時プロファイル
│   ├── timing.h/.cpp       波形のタイミング定数とプロファイル
│   ├── pwmblock.h/.cpp     ビット列の組み立てと復号（ハードウェア非依存）
│   ├── player.h/.cpp       .bin → PWM 波形の送出（実験 A）
│   ├── capture.h/.cpp      波形の取り込みと復号 / 生エッジ（実験 B）
│   ├── calib.h/.cpp        パルス幅の統計（時間軸の較正）
│   ├── proto.h/.cpp        行指向プロトコルの共通処理
│   └── main.cpp            コマンドループ
├── host/
│   ├── g850ctl.py          デバイスを操作するツール（要 pyserial）
│   └── pwmcodec.py         信号形式の Python 参照実装・自己テスト
└── docs/                   本実験のドキュメント
```

## 使い方

### ビルドと書き込み

```
cd arduino-11pin
pio run                  # ビルド
pio run -t upload        # 書き込み
pio device monitor       # 手で叩いて確かめる
```

### 実機なしで確かめる

```
# ホスト側の参照実装で .bin の往復を確認する（ボードも要らない）
python host/pwmcodec.py info     ../tools/tmp/bsave-test.bin
python host/pwmcodec.py selftest ../tools/tmp/bsave-test.bin

# ボードだけ（実機も配線も不要）: ビット列の組み立てと復号の往復
python host/g850ctl.py -p COM16 dectest ../tools/tmp/bsave-test.bin

# D3 と D2 をジャンパでつなぐ: 自分が出したパルス幅を読み返す
python host/g850ctl.py -p COM16 selftest --fast ../tools/tmp/bsave-test.bin
```

### 実機につないでから

**タイミング・極性の既定値は実機での実測値を焼き込んである**（v0.2.0 以降）。
USB を挿すだけで設定コマンドなしに使える。

```
# 実機 → PC（実験 B）
python host/g850ctl.py -p COM16 capture -o out.bin --timeout 90
（表示が出たら実機で BSAVE を実行）

# PC → 実機（実験 A）
python host/g850ctl.py -p COM16 play out.bin
（実機で先に BLOAD を実行して待たせてから）
```

22 バイトの転送で約 3.3 秒（起動時の既定は `PROFILE FAST`）。
うまくいかないときは `profile REAL` でヘッダを桁違いに長くして試す。

**別の個体につなぐときは較正から始めること。** 焼き込んである値は
この 1 台（PC-G850V）の実測値である。

```
python host/g850ctl.py -p COM16 cal --timeout 90 --save cal-other.json --apply
（表示が出たら実機で BSAVE を実行）
```

**較正 → 取り込み → 再生の順で進める。** 理由は
[docs/experiment-plan.md](docs/experiment-plan.md) の
「進める順序についての方針: 測ってから出す」を参照。

### 配線（実機で確認済み）

```
  pin-3 GND ──────────────────────── GND
  pin-7 XOUT ──[100Ω]──┬─────────── D2
                        │
                       ═╪═ 100nF        ← スパイク除去。無いと復号に失敗しうる
                        │
                       GND
  pin-6 XIN ───[1kΩ]──────────────── D3
```

**11pin は出力と入力で極性が違う。** `0x18` bit7 = 1 は pin-7 が 5V、
`0x1F` bit2 = 1 は pin-6 が **0V**。ファームウェアは `invout=1` でこれを吸収する。
詳細は [docs/waveform.md](docs/waveform.md) の「極性」。

## 注意

- 本リポジトリの最重要ルール（`rom.zip` と ROM 由来のバイナリを公開しない）は
  本フォルダでも同じ。実機から取り出したデータを置くときは、
  それが ROM 由来でないことを確かめること。
- `.pio/` はビルド生成物なので追跡しない。
