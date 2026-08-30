#!/usr/bin/env python3
"""BSAVE / BLOAD の PWM 信号の参照実装（ホスト側）。

Arduino のファームウェアと同じ規則を Python で書いたもの。実機に触る前に
ホストだけで往復テストができ、ファームウェアの復号器と突き合わせる基準になる。

信号形式は ../../docs/analysis/bsave-signal-format.md、
.bin のファイル形式は ../../docs/emulator/bsave-file-format.md を参照。
"""

from __future__ import annotations

import argparse
import sys
from dataclasses import dataclass, field

HEADER_LEN = 48


# --------------------------------------------------------------------------
# タイミング
# --------------------------------------------------------------------------

@dataclass
class Timing:
    """実機相当の値。ファームウェアの PROFILE REAL と同じ。"""

    bit0_us: int = 162
    bit1_us: int = 406
    mark_us: int = 30_000
    p1_l_us: int = 8_000_000
    p2_l_us: int = 2_000_000
    p2_s1_us: int = 24_000
    p2_s2_us: int = 6_000
    p3_l_us: int = 4_000_000
    hdr1: tuple[int, int, int] = (10_000, 40, 40)
    hdr2: tuple[int, int, int] = (25_848, 20, 20)

    @classmethod
    def fast(cls) -> "Timing":
        """短縮版。ファームウェアの PROFILE FAST と同じ。"""
        return cls(
            p1_l_us=80_000,
            p2_l_us=20_000,
            p3_l_us=40_000,
            hdr1=(4_000, 40, 40),
            hdr2=(4_000, 20, 20),
        )


# --------------------------------------------------------------------------
# .bin のヘッダ
# --------------------------------------------------------------------------

@dataclass
class BinInfo:
    mode: int
    name: str
    declared_size: int
    start_addr: int
    body_size: int
    problems: list[str] = field(default_factory=list)

    @property
    def mode_name(self) -> str:
        return {0x01: "binary", 0x02: "basic"}.get(self.mode, "unknown")

    def __str__(self) -> str:
        s = (
            f"mode={self.mode:02X}({self.mode_name}) name={self.name!r} "
            f"declared={self.declared_size} body={self.body_size} "
            f"addr={self.start_addr:04X}"
        )
        if self.problems:
            s += " problems=" + ",".join(self.problems)
        return s


def parse_bin(data: bytes) -> BinInfo:
    """.bin のヘッダ 48 バイトを読む。"""
    problems: list[str] = []
    if len(data) < HEADER_LEN + 1:
        raise ValueError(f".bin が短すぎる: {len(data)} バイト（48 + 本体が要る）")

    mode = data[0x00]
    name = data[0x01:0x11].decode("ascii", "replace").rstrip(" ")
    declared = int.from_bytes(data[0x12:0x14], "little")
    addr = int.from_bytes(data[0x14:0x16], "little")
    body = len(data) - HEADER_LEN

    if mode not in (0x01, 0x02):
        problems.append(f"mode={mode:02X}")
    if data[0x11] != 0x0D:
        problems.append(f"sep={data[0x11]:02X}")
    if declared != body:
        problems.append(f"size {declared}!={body}")
    return BinInfo(mode, name, declared, addr, body, problems)


# --------------------------------------------------------------------------
# ビット列
# --------------------------------------------------------------------------

def parity_of(data: bytes) -> int:
    """データ部の 8 ビット群に含まれる 1 の総数。16 ビットに丸める。"""
    return sum(bin(b).count("1") for b in data) & 0xFFFF


def encode_block(data: bytes, hdr: tuple[int, int, int]) -> list[int]:
    """1 ブロック分のビット列を作る。

    0 の並び → 1 の並び → 0 の並び → START_BIT → [1 + 8bit] × N
    → [1 + 8bit] × 2（パリティ）→ STOP_BIT
    """
    z1, ones, z2 = hdr
    bits: list[int] = [0] * z1 + [1] * ones + [0] * z2
    bits.append(1)  # START_BIT

    def put(byte: int) -> None:
        bits.append(1)  # 各バイトのスタートビット
        for k in range(7, -1, -1):  # MSB ファースト
            bits.append((byte >> k) & 1)

    for b in data:
        put(b)
    par = parity_of(data)
    put(par >> 8)
    put(par & 0xFF)

    bits.append(1)  # STOP_BIT
    return bits


@dataclass
class DecodedBlock:
    data: bytes
    parity: int
    calc: int
    hdr: tuple[int, int, int]
    framing_errors: int

    @property
    def ok(self) -> bool:
        return self.parity == self.calc and self.framing_errors == 0


#: ヘッダの「1 の並び」として認めるのに必要な最低の長さ。
#: 実機のヘッダは PWM1 が 1×40、PWM2 が 1×20 なので 4 倍の余裕がある。
#: ファームウェアの PWM_MIN_ONES と同じ値にしておくこと。
MIN_ONES = 5


def decode_block(bits: list[int]) -> DecodedBlock:
    """encode_block の逆。ヘッダを読み飛ばして 9 ビット 1 組を組み立てる。

    0 の並びの途中に紛れ込んだ孤立した 1 はノイズとみなして読み飛ばす。
    実機の取り込みで実際に踏んだ（docs/experiment-log.md 参照）。
    """
    i = 0
    n = len(bits)

    z1 = ones = z2 = 0
    while i < n:
        # 0 の並び
        while i < n and bits[i] == 0:
            z1 += 1
            i += 1
        # 続く 1 の並び
        ones = 0
        while i < n and bits[i] == 1:
            ones += 1
            i += 1
        if ones >= MIN_ONES or i >= n:
            break
        # 短すぎる。ノイズだったので 0 の並びに数え直して続ける
        z1 += ones

    while i < n and bits[i] == 0:
        z2 += 1
        i += 1

    if i >= n:
        raise ValueError("ヘッダしか無い（データ部が見つからない）")
    i += 1  # START_BIT

    out = bytearray()
    fe = 0
    while i + 8 < n:
        if bits[i] != 1:
            fe += 1
        i += 1
        v = 0
        for _ in range(8):
            v = (v << 1) | bits[i]
            i += 1
        out.append(v)

    # 残り 1 ビットは STOP_BIT。末尾 2 バイトがパリティ
    if len(out) < 2:
        raise ValueError("データが短すぎる（パリティが取れない）")
    parity = (out[-2] << 8) | out[-1]
    data = bytes(out[:-2])
    return DecodedBlock(data, parity, parity_of(data), (z1, ones, z2), fe)


# --------------------------------------------------------------------------
# 波形（レベルと継続時間の列）
# --------------------------------------------------------------------------

def bits_to_segments(bits: list[int], t: Timing) -> list[tuple[int, int]]:
    segs = []
    for b in bits:
        w = t.bit1_us if b else t.bit0_us
        segs.append((1, w))
        segs.append((0, w))
    return segs


def build_waveform(data: bytes, t: Timing | None = None) -> list[tuple[int, int]]:
    """.bin 全体から (レベル, 継続時間 usec) の列を作る。"""
    t = t or Timing()
    info = parse_bin(data)
    header, body = data[:HEADER_LEN], data[HEADER_LEN:]
    del info

    segs: list[tuple[int, int]] = []
    segs.append((1, t.mark_us))                       # PULSES1
    segs.append((0, t.p1_l_us))
    segs += bits_to_segments(encode_block(header, t.hdr1), t)   # PWM1
    segs.append((0, t.p2_l_us))                       # PULSES2
    segs.append((1, t.mark_us))
    segs.append((0, t.p2_s1_us))
    segs.append((1, t.mark_us))
    segs.append((0, t.p2_s2_us))
    segs += bits_to_segments(encode_block(body, t.hdr2), t)      # PWM2
    segs.append((0, t.p3_l_us))                       # PULSES3
    segs.append((1, t.mark_us))
    return segs


def waveform_duration_us(segs: list[tuple[int, int]]) -> int:
    return sum(us for _, us in segs)


# --------------------------------------------------------------------------
# H パルスの列を復号する（実機からキャプチャしたものを想定）
# --------------------------------------------------------------------------

def decode_pulses(
    h_widths: list[int],
    bit_threshold_us: int = 280,
    mark_threshold_us: int = 1500,
    glitch_us: int = 40,
) -> list[DecodedBlock]:
    """H パルスの幅の列を復号する。

    ビットの値は H の長さだけで決まる。区切りの長い H でブロックが分かれ、
    ビットを含む区間が PWM1 / PWM2 になる。
    """
    blocks: list[DecodedBlock] = []
    cur: list[int] = []
    started = False

    for w in h_widths:
        if w <= glitch_us:
            continue
        if w >= mark_threshold_us:
            started = True
            if cur:
                blocks.append(decode_block(cur))
                cur = []
            continue
        if not started:
            continue
        cur.append(0 if w < bit_threshold_us else 1)

    if cur:
        blocks.append(decode_block(cur))
    return blocks


def segments_to_h_widths(segs: list[tuple[int, int]]) -> list[int]:
    return [us for lvl, us in segs if lvl == 1]


# --------------------------------------------------------------------------
# CLI
# --------------------------------------------------------------------------

def cmd_info(args: argparse.Namespace) -> int:
    data = open(args.file, "rb").read()
    info = parse_bin(data)
    print(f"{args.file}: {len(data)} バイト")
    print(f"  {info}")
    print(f"  PWM1 パリティ = {parity_of(data[:HEADER_LEN]):04X}")
    print(f"  PWM2 パリティ = {parity_of(data[HEADER_LEN:]):04X}")
    for name, t in (("REAL", Timing()), ("FAST", Timing.fast())):
        secs = waveform_duration_us(build_waveform(data, t)) / 1e6
        print(f"  送出時間 ({name}) = {secs:.1f} 秒")
    return 0 if not info.problems else 1


def cmd_selftest(args: argparse.Namespace) -> int:
    data = open(args.file, "rb").read()
    ok = True
    for name, t in (("REAL", Timing()), ("FAST", Timing.fast())):
        segs = build_waveform(data, t)
        blocks = decode_pulses(segs_h := segments_to_h_widths(segs))
        del segs_h
        if len(blocks) != 2:
            print(f"[{name}] NG: ブロック数 {len(blocks)}（2 のはず）")
            ok = False
            continue
        rebuilt = blocks[0].data + blocks[1].data
        detail = " ".join(
            f"blk{i + 1}(len={len(b.data)} par={b.parity:04X} "
            f"calc={b.calc:04X} hdr={b.hdr} fe={b.framing_errors})"
            for i, b in enumerate(blocks)
        )
        if rebuilt == data and all(b.ok for b in blocks):
            print(f"[{name}] OK  {len(data)} バイト往復一致  {detail}")
        else:
            print(f"[{name}] NG  {detail}")
            if rebuilt != data:
                for i, (a, b) in enumerate(zip(rebuilt, data)):
                    if a != b:
                        print(f"      最初の相違: offset {i} {a:02X} != {b:02X}")
                        break
                else:
                    print(f"      長さが違う: {len(rebuilt)} != {len(data)}")
            ok = False
    return 0 if ok else 1


def cmd_wave(args: argparse.Namespace) -> int:
    data = open(args.file, "rb").read()
    t = Timing.fast() if args.fast else Timing()
    segs = build_waveform(data, t)
    print(f"# {args.file}: {len(segs)} 区間 / {waveform_duration_us(segs) / 1e6:.3f} 秒")
    if args.csv:
        with open(args.csv, "w", encoding="utf-8") as fp:
            fp.write("level,us\n")
            for lvl, us in segs:
                fp.write(f"{lvl},{us}\n")
        print(f"# {args.csv} へ書き出した")
    return 0


def main(argv: list[str] | None = None) -> int:
    ap = argparse.ArgumentParser(description=__doc__)
    sub = ap.add_subparsers(dest="cmd", required=True)

    p = sub.add_parser("info", help=".bin のヘッダを表示する")
    p.add_argument("file")
    p.set_defaults(func=cmd_info)

    p = sub.add_parser("selftest", help="組み立て → 復号 の往復で一致を確かめる")
    p.add_argument("file")
    p.set_defaults(func=cmd_selftest)

    p = sub.add_parser("wave", help="波形を CSV に書き出す")
    p.add_argument("file")
    p.add_argument("--fast", action="store_true", help="短縮タイミングを使う")
    p.add_argument("--csv")
    p.set_defaults(func=cmd_wave)

    args = ap.parse_args(argv)
    return args.func(args)


if __name__ == "__main__":
    sys.exit(main())
