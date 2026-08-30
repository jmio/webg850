#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""2 枚の板で PWM の往復を確かめる（ポケコン不要）。

1 枚が送出、もう 1 枚が取り込みを担当する。**測る側が別の MCU になる**のが
要点で、D3-D2 のループバック（`g850ctl.py selftest`）と違い、送出の乱れと
取り込みの乱れが混ざらない。

配線:

    送出側 D3 ──> 取り込み側 D2      （XIN 出力 → XOUT 入力）
    GND    ────  GND                 （これが無いと測れない）

    取り込み側 D3 ──> 送出側 D2      （逆向きも試すなら。任意）

D3 どうしを結ぶと出力がぶつかる。D3 → D2 の向きを守ること。

**極性に注意。** 送出側の既定 `invout=1` は実機の XIN が反転しているため。
板どうしでは実機の XOUT と同じ向きで出したいので `invout=0` にして流し、
終わったら 1 に戻す。戻し忘れると実機で `BLOAD` が通らなくなる。

使い方:

    python host/twoboard.py ../tools/tmp/basen.bin
    python host/twoboard.py ../tools/tmp/basen.bin --stress 20000 --usbmask 0
    python host/twoboard.py ../tools/tmp/basen.bin --tx COM16 --rx COM17

`--stress` は送出側のホスト回線に流す雑音。`--usbmask 0` と組み合わせると
**転送が壊れる**ことを確かめられる（docs/experiment-log.md の段階 6）。
"""
import argparse
import hashlib
import sys
import threading
import time

sys.path.insert(0, __file__.rsplit("/", 1)[0] if "/" in __file__ else ".")

from g850ctl import Device, upload, assemble_blocks, stream_hex   # noqa: E402
import pwmcodec                                        # noqa: E402


def start_capture(dev, out, timeout):
    """取り込みは待ち受けなので、送出より先に別スレッドで始める"""
    def work():
        try:
            out["rep"] = dev.cmd(f"CAP {timeout}", timeout=timeout + 30)
        except Exception as e:                          # noqa: BLE001
            out["err"] = e
    t = threading.Thread(target=work, daemon=True)
    t.start()
    return t


def main(argv=None) -> int:
    ap = argparse.ArgumentParser(description=__doc__,
                                 formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("file", help="送出する .bin")
    ap.add_argument("--tx", default="COM16", help="送出側のポート")
    ap.add_argument("--rx", default="COM17", help="取り込み側のポート")
    ap.add_argument("--stress", type=int, default=0, metavar="BPS",
                    help="送出側の回線に毎秒 BPS バイトの雑音を流す")
    ap.add_argument("--usbmask", default="1", choices=["0", "1"],
                    help="送出中に USB の割り込みを止めるか（既定 1）")
    ap.add_argument("--stream", action="store_true",
                    help="貯めずに流し込みながら送る（PLAYS。大きさ無制限）")
    ap.add_argument("--real", action="store_true",
                    help="REAL プロファイルで流す（既定は FAST）")
    ap.add_argument("--timeout", type=int, default=120)
    ap.add_argument("-o", "--out", help="取り込んだ .bin の保存先")
    a = ap.parse_args(argv)

    data = open(a.file, "rb").read()
    src = hashlib.sha256(data).hexdigest()
    print(f"元: {a.file} {len(data)} バイト sha={src[:16]}")
    print(f"   {pwmcodec.parse_bin(data)}")

    tx = Device(a.tx)
    rx = Device(a.rx)
    print(f"送出   {a.tx}: {tx.cmd('INFO').data[0]}")
    print(f"取り込み {a.rx}: {rx.cmd('INFO').data[0]}")

    tx.cmd("PROFILE REAL" if a.real else "PROFILE FAST")
    rx.cmd("PROFILE REAL" if a.real else "PROFILE FAST")
    tx.cmd("CFG invout 0")            # 板どうしは実機の XOUT と同じ向きで
    tx.cmd(f"CFG usbmask {a.usbmask}")
    if not a.stream:
        upload(tx, data)

    # **取り込みを始める前に線を LOW で駆動しておく。**
    # 書き込み直後の送出側は XIN が Hi-Z で、浮いた線が長い H に見える。
    # 取り込み側はそれを区切りと数えるので、4 本溜まった時点で転送が
    # 打ち切られる（実測: 316 ミリ秒・14 ビットで終わった）。
    # 実機の XOUT は常に駆動されているので、これは板どうしのときだけの話。
    tx.cmd("IDLE 0")

    got: dict = {}
    th = start_capture(rx, got, a.timeout)
    time.sleep(2.0)                   # #cap armed を待つ。先に流すと頭を逃がす

    mode = "PLAYS（流し込み）" if a.stream else "PLAY（貯め込み）"
    print(f"送出中 {mode}（usbmask={a.usbmask} 雑音={a.stress}B/s）…", flush=True)
    tx.stress_bytes = 0
    if a.stream:
        started: list = []

        def on_data(line: str) -> None:
            if line.startswith("RDY") and not started:
                started.append(stream_hex(tx, data))

        rep = tx.cmd(f"PLAYS {len(data)} 0", timeout=400.0,
                     stress_bps=a.stress, on_data=on_data)
    else:
        rep = tx.cmd("PLAY 0", timeout=400.0, stress_bps=a.stress)
    for line in rep.data:
        if line.startswith("DONE"):
            print("  送出側:", line)
    if a.stress:
        print(f"  流せた雑音: {getattr(tx, 'stress_bytes', 0)} バイト")

    th.join(timeout=a.timeout)
    tx.cmd("CFG invout 1")            # 実機用に戻す。忘れると BLOAD が通らない
    tx.close()

    cap = got.get("rep")
    if cap is None:
        print("取り込みが返ってこない:", got.get("err"), file=sys.stderr)
        rx.close()
        return 1
    for line in cap.data:
        if line.startswith(("R ", "DONE")):
            print("  取り込み:", line)
    rx.close()

    blocks = assemble_blocks(cap.data)
    if 1 not in blocks or 2 not in blocks:
        print(f"**失敗** ブロックが揃っていない: {sorted(blocks)}", file=sys.stderr)
        return 1

    out = blocks[1][:-2] + blocks[2][:-2]
    print(f"復元: {len(out)} バイト sha={hashlib.sha256(out).hexdigest()[:16]}")
    if out == data:
        print("一致")
        if a.out:
            open(a.out, "wb").write(out)
        return 0

    diff = sum(1 for x, y in zip(out, data) if x != y)
    print(f"**不一致** 長さ {len(out)}/{len(data)} 違うバイト {diff}", file=sys.stderr)
    if a.out:
        open(a.out, "wb").write(out)
    return 1


if __name__ == "__main__":
    sys.exit(main())
