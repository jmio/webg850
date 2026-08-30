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

# 同上 + 送出中にホストから雑音を流す（USB 割り込みで H が伸びないかの試験）
python host/g850ctl.py -p COM16 selftest --fast --stress 2000 ../tools/tmp/bsave-test.bin
```

### 2 台つないで往復させる（ポケコン不要）

1 枚が送出、もう 1 枚が取り込みを担当する。**測る側が別の MCU になる**ので、
ループバックのように送出の乱れと取り込みの乱れが混ざらない。

```
送出側 D3 ──> 取り込み側 D2      GND ──── GND
```

D3 どうしは結ばないこと（出力がぶつかる）。

```
python host/twoboard.py ../tools/tmp/basen.bin
python host/twoboard.py ../tools/tmp/basen.bin --stress 20000 --usbmask 0   # 壊れる
```

送出側は `invout=0`（実機の XOUT と同じ向き）で流し、終わったら 1 に戻す。
スクリプトが毎回明示するので、**実機に戻す前に手で確かめる必要はない。**

`Uno R4 WiFi` を混ぜる場合、**そちらは取り込み側にすること。**
WiFi 版は `-DNO_USB` でビルドされ、`Serial` が ESP32-S3 への UART になる。
送出側に使うと `usbmask` が空振りし（`irqs=0` と出る）、UART をフロー制御
なしで止めれば受信が溢れる。取り込み側なら `irqprio=11` がそのまま効く
（邪魔をする SCI の優先度が USB と同じ 12 のため）。

`--stress` は送出の 12288 バイト制限を外すための下ごしらえ。制限を外すには
再生しながらシリアルから食べる必要があり、その間 USB の割り込みが H を
伸ばさないことが前提になる。

**実測すると、止めなければ 162usec の H が 11.2 ミリ秒まで伸びた。**
2 台つないで確かめると、伸びた H が受信側の区切り判定を超えるため、
**17.9 秒かかるはずの転送が 0.77 秒で打ち切られた。**

短い H の間だけ USB を止める `usbmask` と、L の区間で受信を捌く
`playpump` が v0.7.0 から既定で入っている。止めれば同じ雑音の下でも
sha256 が一致し、実機での往復も従来どおり通る。

詳細は [docs/protocol.md](docs/protocol.md) の「送出中の USB 割り込み」、
経緯と数字は [docs/experiment-log.md](docs/experiment-log.md) の段階 6。

### 実機につないでから

**タイミング・極性の既定値は実機での実測値を焼き込んである**（v0.2.0 以降）。
USB を挿すだけで設定コマンドなしに使える。

```
# 実機 → PC（実験 B）
python host/g850ctl.py -p COM16 capture -o out.bin --timeout 90
（表示が出たら実機で BSAVE を実行）

# PC → 実機（実験 A）
python host/g850ctl.py -p COM16 plays out.bin
（実機で先に BLOAD を実行して待たせてから）
```

`plays` は貯めずに流し込みながら送るので**大きさに上限が無い**。
`play` は先に `LOAD` で貯めるため 12288 バイトまで。

22 バイトの転送で約 3.3 秒（起動時の既定は `PROFILE FAST`）。
2854 バイトなら送出 17.5 秒、取り込み 40.0 秒。
うまくいかないときは `profile REAL` でヘッダを桁違いに長くして試す。

**送出も取り込みも実機の空き容量（`PRINT FRE` で 27286 バイト）まで扱える。**
取り込みは 12 KB に収まるものを貯めてから吐き、超えるものは流す。送出は
`plays` なら常に流す（`play` は貯めるので 12288 バイトまで）
（自動で切り替わる）。

**別の個体につなぐときは較正から始めること。** 焼き込んである値は
この 1 台（PC-G850V）の実測値である。

```
python host/g850ctl.py -p COM16 cal --timeout 90 --save docs/cal-<日付>-<機種>.json --apply
（表示が出たら実機で BSAVE を実行）
```

較正結果は `docs/` 以下に置けば記録として追跡される。
この 1 台のぶんは
[docs/cal-2026-08-30-pc-g850v.json](docs/cal-2026-08-30-pc-g850v.json)。

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

## 割り込み優先度について（触る前に読むこと）

エッジ割り込みの NVIC 優先度は **11 に固定してある**（`irqprio`）。
Arduino の `attachInterrupt` が設定する既定値 12 は **USB と同じ**で、
同一優先度は互いに横取りできないため、取り込み中に USB へ書くと
ビットが落ちる。逆にタイマ（優先度 8）より高くすると `micros()` が
飛んで幅の測定そのものが壊れる。

> **使える値は 9・10・11 の 3 つだけ。**

`CAP` の冒頭に出る `#cap irqn=<番号> prio=<値>` は**実際に適用された値**。
`irqn=-1` なら優先度は設定されていない。
経緯は [docs/experiment-log.md](docs/experiment-log.md) の「段階 B」。

## 注意

- 本リポジトリの最重要ルール（`rom.zip` と ROM 由来のバイナリを公開しない）は
  本フォルダでも同じ。実機から取り出したデータを置くときは、
  それが ROM 由来でないことを確かめること。
- `.pio/` はビルド生成物なので追跡しない。
