#!/usr/bin/env python3
"""Arduino Uno R4 Minima 上のファームウェアを操作するホスト側ツール。

    python g850ctl.py -p COM5 ping
    python g850ctl.py -p COM5 cal --apply --save profile.json   # 時間軸の較正
    python g850ctl.py -p COM5 capture -o out.bin                # 実験 B
    python g850ctl.py -p COM5 play in.bin                       # 実験 A

コマンドの仕様は ../docs/protocol.md を参照。
"""

from __future__ import annotations

import argparse
import json
import sys
import time
from dataclasses import dataclass

try:
    import serial  # pyserial
except ImportError:  # pragma: no cover
    print("pyserial が要ります: pip install pyserial", file=sys.stderr)
    raise

import pwmcodec

CHUNK = 32  # LOAD の 1 行あたりのバイト数


# --------------------------------------------------------------------------
# デバイスとのやり取り
# --------------------------------------------------------------------------

@dataclass
class Reply:
    data: list[str]      # '+' の行（種別文字を除く）
    logs: list[str]      # '#' の行
    progress: list[str]  # '*' の行
    error: str | None    # '!' の行
    done: str = ""       # 終端の '+OK ...' 行（'OK ' の後ろ）

    @property
    def ok(self) -> bool:
        return self.error is None

    def find(self, prefix: str) -> list[str]:
        return [d for d in self.data if d.startswith(prefix)]


class Device:
    def __init__(self, port: str, baud: int = 115200, verbose: bool = False):
        self.ser = serial.Serial(port, baud, timeout=0.2)
        self.verbose = verbose
        time.sleep(0.3)
        self.ser.reset_input_buffer()

    def close(self) -> None:
        self.ser.close()

    def _write_line(self, s: str) -> None:
        if self.verbose:
            print(f"> {s}", file=sys.stderr)
        self.ser.write((s + "\n").encode("ascii"))
        self.ser.flush()

    def _read_until_done(self, timeout: float, on_progress=None,
                         on_log=None) -> Reply:
        """'+OK...' か '!...' が来るまで読む。"""
        data: list[str] = []
        logs: list[str] = []
        progress: list[str] = []
        deadline = time.time() + timeout
        buf = b""

        while time.time() < deadline:
            chunk = self.ser.read(4096)
            if not chunk:
                continue
            buf += chunk
            while b"\n" in buf:
                raw, buf = buf.split(b"\n", 1)
                line = raw.decode("ascii", "replace").rstrip("\r")
                if not line:
                    continue
                if self.verbose:
                    print(f"< {line}", file=sys.stderr)
                kind, body = line[0], line[1:]
                if kind == "+":
                    if body == "OK" or body.startswith("OK "):
                        return Reply(data, logs, progress, None, body[3:])
                    data.append(body)
                elif kind == "!":
                    return Reply(data, logs, progress, body)
                elif kind == "#":
                    logs.append(body)
                    if on_log:
                        on_log(body)
                elif kind == "*":
                    progress.append(body)
                    if on_progress:
                        on_progress(body)
                else:
                    logs.append(line)
        raise TimeoutError("デバイスからの応答が途切れた")

    def cmd(self, line: str, timeout: float = 10.0, on_progress=None,
            on_log=None) -> Reply:
        self._write_line(line)
        return self._read_until_done(timeout, on_progress, on_log)

    def abort(self) -> None:
        self.ser.write(b"\x1b")
        self.ser.flush()


def show(rep: Reply, prefix: str = "") -> None:
    for line in rep.logs:
        print(f"{prefix}# {line}")
    for line in rep.data:
        print(f"{prefix}{line}")
    if rep.error:
        print(f"{prefix}!! {rep.error}", file=sys.stderr)


def progress_printer(label: str):
    def cb(msg: str) -> None:
        print(f"\r  {label}: {msg}      ", end="", file=sys.stderr, flush=True)
    return cb


# --------------------------------------------------------------------------
# データ転送
# --------------------------------------------------------------------------

def upload(dev: Device, data: bytes, verbose: bool = False) -> None:
    """.bin をデバイスのバッファへ送る。

    バイナリをそのまま流さず ASCII の 16 進で運ぶ。コマンドが行指向なので
    生バイナリを混ぜると同期が壊れやすく、中断用の 0x1B / 0x03 とも
    ぶつかる。詳しくは ../docs/protocol.md の「なぜ 16 進か」を参照。
    """
    dev._write_line(f"LOAD {len(data)}")

    # +RDY を待つ
    deadline = time.time() + 5.0
    buf = b""
    ready = False
    while time.time() < deadline and not ready:
        buf += dev.ser.read(256)
        while b"\n" in buf:
            raw, buf = buf.split(b"\n", 1)
            line = raw.decode("ascii", "replace").rstrip("\r")
            if verbose and line:
                print(f"< {line}", file=sys.stderr)
            if line.startswith("+RDY"):
                ready = True
                break
            if line.startswith("!"):
                raise RuntimeError(f"LOAD が拒否された: {line}")
    if not ready:
        raise TimeoutError("+RDY が来ない")

    for off in range(0, len(data), CHUNK):
        piece = data[off:off + CHUNK]
        dev._write_line(f"D {off:04X} {piece.hex().upper()}")
    dev._write_line("END")

    rep = dev._read_until_done(10.0)
    show(rep)
    if not rep.ok:
        raise RuntimeError(f"LOAD 失敗: {rep.error}")


def download(dev: Device) -> bytes:
    rep = dev.cmd("DUMP", timeout=20.0)
    if not rep.ok:
        raise RuntimeError(f"DUMP 失敗: {rep.error}")
    return assemble_blocks(rep.data).get(0, b"")


def assemble_blocks(lines: list[str]) -> dict[int, bytes]:
    """'D <block> <offset16> <hex>' の行をブロックごとに組み立てる。"""
    parts: dict[int, dict[int, bytes]] = {}
    for line in lines:
        if not line.startswith("D "):
            continue
        _, blk, off, hexs = (line.split(None, 3) + [""])[:4]
        parts.setdefault(int(blk), {})[int(off, 16)] = bytes.fromhex(hexs)
    out: dict[int, bytes] = {}
    for blk, chunks in parts.items():
        buf = bytearray()
        for off in sorted(chunks):
            if off != len(buf):
                raise ValueError(f"ブロック {blk} のオフセットが飛んでいる: {off}")
            buf += chunks[off]
        out[blk] = bytes(buf)
    return out


def parse_kv(line: str) -> dict[str, str]:
    out = {}
    for tok in line.split():
        if "=" in tok:
            k, v = tok.split("=", 1)
            out[k] = v
    return out


# --------------------------------------------------------------------------
# 較正
# --------------------------------------------------------------------------

def cluster(hist: dict[int, int], gap: int = 30) -> list[tuple[int, int, int, float]]:
    """幅のヒストグラムを、間隔が gap 以上あくところで分ける。

    戻り値は (代表値, 総数, 最小, 平均) の並び。代表値は最頻値。
    """
    out = []
    cur: list[tuple[int, int]] = []
    for w in sorted(hist):
        if cur and w - cur[-1][0] > gap:
            out.append(cur)
            cur = []
        cur.append((w, hist[w]))
    if cur:
        out.append(cur)

    result = []
    for group in out:
        total = sum(c for _, c in group)
        mode = max(group, key=lambda p: p[1])[0]
        mean = sum(w * c for w, c in group) / total
        result.append((mode, total, group[0][0], mean))
    return result


def do_calibrate(dev: Device, timeout: int) -> dict:
    """実機の BSAVE の波形を測り、送出用のタイミングを決める。"""
    print(f"CAL を開始します（最長 {timeout} 秒）。")
    print("実機で BSAVE を実行してください。PULSES1 の L が 8 秒あるので、")
    print("最初の数秒は何も出ていないように見えます。")
    rep = dev.cmd(f"CAL {timeout}", timeout=timeout + 30,
                  on_progress=progress_printer("CAL"))
    print(file=sys.stderr)
    if not rep.ok:
        raise RuntimeError(f"CAL 失敗: {rep.error}")

    hist = {0: {}, 1: {}}
    longs: list[tuple[int, int]] = []
    summary: dict[str, str] = {}
    for line in rep.data:
        tok = line.split()
        if tok[0] == "H":
            hist[int(tok[1])][int(tok[2])] = int(tok[3])
        elif tok[0] == "L":
            longs.append((int(tok[2]), int(tok[3])))
        elif tok[0] == "DONE":
            summary = parse_kv(line)

    if not hist[1]:
        raise RuntimeError("H パルスが 1 つも取れていない。配線と極性を確認すること")

    print(f"エッジ数 {summary.get('edges')} / 観測時間 "
          f"{int(summary.get('span_us', 0)) / 1e6:.2f} 秒")

    result: dict = {"summary": summary}
    for lvl, name in ((1, "H"), (0, "L")):
        groups = cluster(hist[lvl])
        print(f"\n{name} 期間のかたまり（1usec 刻み）:")
        for mode, total, lo, mean in groups:
            print(f"  最頻 {mode:5d} usec  個数 {total:7d}  最小 {lo:5d}  平均 {mean:8.1f}")
        result[f"hist_{name.lower()}"] = [
            {"mode": m, "count": c, "min": lo, "mean": round(mean, 1)}
            for m, c, lo, mean in groups
        ]

    print("\n1024usec を超えた区間（区切りの H と PULSES の L）:")
    for i, (lvl, us) in enumerate(longs):
        print(f"  [{i:2d}] {'H' if lvl else 'L'} {us:>10d} usec  ({us / 1000:.1f} ms)")
    result["long"] = [{"level": lvl, "us": us} for lvl, us in longs]

    # --- 送出用のタイミングを決める ---
    h_groups = cluster(hist[1])
    h_groups.sort(key=lambda g: g[1], reverse=True)   # 個数の多い順
    if len(h_groups) < 2:
        raise RuntimeError(
            "H に 2 つのかたまりが見つからない。"
            "転送の途中までしか取れていない可能性がある（もう一度 BSAVE から）")
    top2 = sorted(h_groups[:2], key=lambda g: g[0])   # 幅の小さい順
    bit0, bit1 = top2[0][0], top2[1][0]

    marks = [us for lvl, us in longs if lvl == 1]
    long_ls = [us for lvl, us in longs if lvl == 0]
    mark = round(sum(marks) / len(marks)) if marks else None

    cfg: dict[str, int] = {"bit0": bit0, "bit1": bit1}
    if mark:
        cfg["mark"] = mark
    # 判定しきい値は 2 つの中間、区切りは長い H の半分
    cfg["capbit"] = (bit0 + bit1) // 2
    if mark:
        cfg["capmark"] = max(bit1 * 2, mark // 4)

    # PULSES の L。長さの大きい順に p1l / p3l / p2l、短い 2 つが p2s1 / p2s2
    big = sorted((x for x in long_ls if x > 100_000), reverse=True)
    small = sorted((x for x in long_ls if x <= 100_000), reverse=True)
    if len(big) >= 3:
        cfg["p1l"], cfg["p3l"], cfg["p2l"] = big[0], big[1], big[2]
    if len(small) >= 2:
        cfg["p2s1"], cfg["p2s2"] = small[0], small[1]

    print("\n決まったタイミング:")
    for k, v in cfg.items():
        print(f"  {k:8s} = {v}")
    if marks and len(marks) != 4:
        print(f"  ※ 区切りの H が {len(marks)} 回。正常なら 4 回")

    result["cfg"] = cfg
    return result


def apply_cfg(dev: Device, cfg: dict[str, int]) -> None:
    for k, v in cfg.items():
        rep = dev.cmd(f"CFG {k} {v}", timeout=5.0)
        if not rep.ok:
            print(f"  CFG {k} 失敗: {rep.error}", file=sys.stderr)
    print("デバイスへ反映しました。")


# --------------------------------------------------------------------------
# サブコマンド
# --------------------------------------------------------------------------

def cmd_ping(dev: Device, a) -> int:
    show(dev.cmd("PING"))
    return 0


def cmd_info(dev: Device, a) -> int:
    show(dev.cmd("INFO"))
    show(dev.cmd("PINS"))
    return 0


def cmd_cfg(dev: Device, a) -> int:
    if a.key is None:
        show(dev.cmd("CFG"))
        return 0
    show(dev.cmd(f"CFG {a.key} {a.value}"))
    return 0


def cmd_profile(dev: Device, a) -> int:
    show(dev.cmd(f"PROFILE {a.name}"))
    return 0


def cmd_load(dev: Device, a) -> int:
    data = open(a.file, "rb").read()
    print(f"{a.file}: {pwmcodec.parse_bin(data)}")
    upload(dev, data, a.verbose)
    return 0


def cmd_dump(dev: Device, a) -> int:
    data = download(dev)
    open(a.out, "wb").write(data)
    print(f"{a.out}: {len(data)} バイト  {pwmcodec.parse_bin(data)}")
    return 0


def cmd_play(dev: Device, a) -> int:
    if a.file:
        data = open(a.file, "rb").read()
        info = pwmcodec.parse_bin(data)
        print(f"{a.file}: {info}")
        if info.problems and not a.force:
            print("ヘッダに問題がある。強行するなら --force", file=sys.stderr)
            return 1
        upload(dev, data, a.verbose)

    print("実機側で BLOAD を実行して待たせてから、送出を始めます。")
    rep = dev.cmd(f"PLAY {a.delay}", timeout=a.timeout,
                  on_progress=progress_printer("PLAY"))
    print(file=sys.stderr)
    show(rep)
    return 0 if rep.ok else 1


def cmd_capture(dev: Device, a) -> int:
    print(f"取り込みを開始します（最長 {a.timeout} 秒）。実機で BSAVE を実行してください。")

    def on_log(msg: str) -> None:
        # 転送の開始を知らせる。capstream=2 のときは以降の進捗が止まるので
        # 「止まった」のか「何も来ていない」のかを区別する手がかりになる。
        if msg.startswith("cap begin"):
            print(file=sys.stderr)
            print("  CAP: 転送を検出（実機のタイミングで約 40 秒）",
                  file=sys.stderr, flush=True)

    rep = dev.cmd(f"CAP {a.timeout}", timeout=a.timeout + 30,
                  on_progress=progress_printer("CAP"), on_log=on_log)
    print(file=sys.stderr)
    for line in rep.data:
        if line.startswith(("R ", "DONE")):
            print(line)
    if not rep.ok:
        print(f"失敗: {rep.error}", file=sys.stderr)
        return 1

    blocks = assemble_blocks(rep.data)
    if 1 not in blocks or 2 not in blocks:
        print(f"ブロックが揃っていない: {sorted(blocks)}", file=sys.stderr)
        return 1

    # 各ブロックの末尾 2 バイトはパリティなので落とす
    header, body = blocks[1][:-2], blocks[2][:-2]
    if len(header) != 48:
        print(f"ヘッダが 48 バイトでない: {len(header)}", file=sys.stderr)
        return 1

    data = header + body
    info = pwmcodec.parse_bin(data)
    print(f"復元: {len(data)} バイト  {info}")

    # ファームウェアとは独立にホスト側でもパリティを検算する
    for name, blk, payload in (("PWM1", blocks[1], header), ("PWM2", blocks[2], body)):
        got = (blk[-2] << 8) | blk[-1]
        calc = pwmcodec.parity_of(payload)
        print(f"  {name} パリティ {got:04X} / 計算 {calc:04X} "
              f"{'OK' if got == calc else 'NG'}")

    out = a.out or (info.name.strip() or "bsave") + ".bin"
    open(out, "wb").write(data)
    print(f"{out} へ保存した")
    return 0 if not info.problems else 1


def cmd_raw(dev: Device, a) -> int:
    print(f"生のエッジを取り込みます（最長 {a.timeout} 秒 / 最大 {a.max} 本）。")
    rep = dev.cmd(f"RAW {a.timeout} {a.max}", timeout=a.timeout + 60)
    if not rep.ok:
        print(f"失敗: {rep.error}", file=sys.stderr)
        return 1
    rows = []
    for line in rep.data:
        tok = line.split()
        if tok[0] == "E":
            rows.append((int(tok[2]), int(tok[3])))
        elif tok[0] == "DONE":
            print(line)
    if a.out:
        with open(a.out, "w", encoding="utf-8") as fp:
            fp.write("level,us\n")
            for lvl, us in rows:
                fp.write(f"{lvl},{us}\n")
        print(f"{a.out} へ {len(rows)} 行書き出した")
    else:
        for i, (lvl, us) in enumerate(rows):
            print(f"{i:5d} {'H' if lvl else 'L'} {us:>8d}")
    return 0


def cmd_cal(dev: Device, a) -> int:
    result = do_calibrate(dev, a.timeout)
    if a.save:
        with open(a.save, "w", encoding="utf-8") as fp:
            json.dump(result, fp, indent=2, ensure_ascii=False)
        print(f"\n{a.save} へ保存した")
    if a.apply:
        print()
        apply_cfg(dev, result["cfg"])
    else:
        print("\n（--apply を付けるとデバイスへ反映します）")
    return 0


def cmd_dectest(dev: Device, a) -> int:
    """ビット列の組み立てと復号を、デバイスの RAM の中だけで往復させる。

    LOAD と DECTEST を同じ接続の中で続けて行う。接続を張り直すと
    ボードがリセットされてバッファの内容が消える可能性があるため。
    """
    data = open(a.file, "rb").read()
    print(f"{a.file}: {pwmcodec.parse_bin(data)}")
    upload(dev, data, a.verbose)

    rep = dev.cmd("DECTEST", timeout=30.0)
    for line in rep.data:
        print(line)
    if not rep.ok:
        print(f"失敗: {rep.error}", file=sys.stderr)
        return 1

    # ホスト側の独立実装でも同じ往復を行い、結果を突き合わせる
    print("\nホスト側の参照実装:")
    rc = pwmcodec.main(["selftest", a.file])
    passed = rep.done.strip() == "PASS"
    print(f"\nデバイス側: {'PASS' if passed else 'FAIL'} / "
          f"ホスト側: {'PASS' if rc == 0 else 'FAIL'}")
    return 0 if (passed and rc == 0) else 1


def cmd_apply(dev: Device, a) -> int:
    """cal の結果 (JSON) をデバイスへ書き戻す。

    ボードは書き込みや電源断で既定値に戻るので、較正のたびに測り直さず
    保存しておいた値を流し込めるようにしてある。
    """
    with open(a.file, encoding="utf-8") as fp:
        result = json.load(fp)
    cfg = result.get("cfg")
    if not cfg:
        print(f"{a.file} に cfg がない", file=sys.stderr)
        return 1
    apply_cfg(dev, cfg)
    show(dev.cmd("CFG"))
    return 0


def cmd_selftest(dev: Device, a) -> int:
    print("D3 と D2 をジャンパでつなぎ、実機は外してから実行してください。")
    # プロファイルの切替と LOAD は同じ接続の中で行う。接続を張り直すと
    # ボードの状態が残っている保証が無いため。
    if a.fast:
        show(dev.cmd("PROFILE FAST"))
    if a.file:
        data = open(a.file, "rb").read()
        upload(dev, data, a.verbose)
    rep = dev.cmd(f"SELFTEST {a.delay}", timeout=a.timeout,
                  on_progress=progress_printer("SELFTEST"))
    print(file=sys.stderr)
    if not rep.ok:
        print(f"失敗: {rep.error}", file=sys.stderr)
        return 1

    hist = {0: {}, 1: {}}
    for line in rep.data:
        tok = line.split()
        if tok[0] == "H":
            hist[int(tok[1])][int(tok[2])] = int(tok[3])
        elif tok[0] in ("L", "DONE"):
            print(line)
    for lvl, name in ((1, "H"), (0, "L")):
        print(f"{name} 期間:")
        for mode, total, lo, mean in cluster(hist[lvl]):
            print(f"  最頻 {mode:5d} usec  個数 {total:7d}  最小 {lo:5d}  平均 {mean:8.1f}")
    return 0


def cmd_pins(dev: Device, a) -> int:
    show(dev.cmd("PINS"))
    return 0


def cmd_idle(dev: Device, a) -> int:
    show(dev.cmd(f"IDLE {a.level}"))
    return 0


def cmd_ack(dev: Device, a) -> int:
    show(dev.cmd(f"ACK {a.level}"))
    return 0


# --------------------------------------------------------------------------

def main(argv: list[str] | None = None) -> int:
    ap = argparse.ArgumentParser(description=__doc__,
                                 formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("-p", "--port", required=True, help="COM5 や /dev/ttyACM0")
    ap.add_argument("-b", "--baud", type=int, default=115200)
    ap.add_argument("-v", "--verbose", action="store_true", help="送受信を表示する")
    sub = ap.add_subparsers(dest="cmd", required=True)

    sub.add_parser("ping").set_defaults(func=cmd_ping)
    sub.add_parser("info").set_defaults(func=cmd_info)
    sub.add_parser("pins").set_defaults(func=cmd_pins)

    p = sub.add_parser("cfg", help="タイミング定数の表示・変更")
    p.add_argument("key", nargs="?")
    p.add_argument("value", nargs="?")
    p.set_defaults(func=cmd_cfg)

    p = sub.add_parser("profile", help="REAL / FAST の切替")
    p.add_argument("name", choices=["REAL", "FAST", "real", "fast"])
    p.set_defaults(func=cmd_profile)

    p = sub.add_parser("load", help=".bin をデバイスへ送る")
    p.add_argument("file")
    p.set_defaults(func=cmd_load)

    p = sub.add_parser("dump", help="デバイスのバッファを取り出す")
    p.add_argument("-o", "--out", default="dump.bin")
    p.set_defaults(func=cmd_dump)

    p = sub.add_parser("play", help="実験 A: PWM 波形を送出する")
    p.add_argument("file", nargs="?", help="省略するとバッファの内容を送る")
    p.add_argument("--delay", type=int, default=0, help="送出開始までの待ち [ms]")
    p.add_argument("--timeout", type=float, default=180.0)
    p.add_argument("--force", action="store_true")
    p.set_defaults(func=cmd_play)

    p = sub.add_parser("capture", help="実験 B: BSAVE を取り込んで .bin にする")
    p.add_argument("-o", "--out")
    p.add_argument("--timeout", type=int, default=120)
    p.set_defaults(func=cmd_capture)

    p = sub.add_parser("raw", help="生のエッジ列を取る")
    p.add_argument("-o", "--out")
    p.add_argument("--timeout", type=int, default=60)
    p.add_argument("--max", type=int, default=3072)
    p.set_defaults(func=cmd_raw)

    p = sub.add_parser("cal", help="実機の波形から時間軸を較正する")
    p.add_argument("--timeout", type=int, default=120)
    p.add_argument("--apply", action="store_true", help="結果をデバイスへ反映する")
    p.add_argument("--save", help="結果を JSON で保存する")
    p.set_defaults(func=cmd_cal)

    p = sub.add_parser("apply", help="cal の JSON をデバイスへ書き戻す")
    p.add_argument("file")
    p.set_defaults(func=cmd_apply)

    p = sub.add_parser("dectest", help="ビット列の往復（実機も配線も不要）")
    p.add_argument("file")
    p.set_defaults(func=cmd_dectest)

    p = sub.add_parser("selftest", help="D3→D2 ジャンパで自分の波形を読み返す")
    p.add_argument("file", nargs="?")
    p.add_argument("--fast", action="store_true", help="短縮タイミングで行う（同じ接続の中で PROFILE FAST を送る）")
    p.add_argument("--delay", type=int, default=0)
    p.add_argument("--timeout", type=float, default=180.0)
    p.set_defaults(func=cmd_selftest)

    p = sub.add_parser("idle", help="XIN の待機レベル")
    p.add_argument("level", choices=["0", "1", "Z", "z"])
    p.set_defaults(func=cmd_idle)

    p = sub.add_parser("ack", help="11pin の 9 番 (ACK) を駆動する")
    p.add_argument("level", choices=["0", "1", "Z", "z"])
    p.set_defaults(func=cmd_ack)

    a = ap.parse_args(argv)
    dev = Device(a.port, a.baud, a.verbose)
    try:
        return a.func(dev, a)
    except KeyboardInterrupt:
        dev.abort()
        print("\n中断しました", file=sys.stderr)
        return 130
    finally:
        dev.close()


if __name__ == "__main__":
    sys.exit(main())
