/*
 * player.h - .bin から PWM 波形を組み立てて 11pin の XIN へ送出する（実験 A）
 */
#pragma once

#include <Arduino.h>

/* XIN の待機時の駆動 */
enum IdleDrive {
	IDLE_LOW  = 0,  /* 0V に固定。BSAVE/BLOAD のアイドルはこちら */
	IDLE_HIGH = 1,
	IDLE_HIZ  = 2   /* 入力に戻す。実機に一切触れたくないとき */
};

void playerBegin(void);
void playerSetIdle(IdleDrive d);
IdleDrive playerIdle(void);

/*
 * bin[0..47]  = PWM1 のデータ部（48 バイトのヘッダ）
 * bin[48..n)  = PWM2 のデータ部（本体）
 * パリティは送出時に計算する。
 *
 * 戻り値: 正常終了なら true、中断されたら false
 */
bool playerRun(const uint8_t *bin, uint32_t n, uint32_t delay_ms);

/*
 * 直前の送出で、短い H が実際に何 usec 出ていたか。
 *
 * ループバックで測ると取り込み側の割り込み遅れと混ざって区別できない
 * ので、**出した側で測る**。max が判定のしきい値 (cap_bit_us) に
 * 近づいていれば、割り込みに H を伸ばされている。
 *
 *   max  … 短い H の最大値 [usec]
 *   bad  … **化けた本数**。ビット 0 のつもりの H がしきい値以上に
 *          伸びたもの（と、ビット 1 が縮んだもの）。0 でなければ
 *          受信側は違うビットを読む
 *   n    … 測った本数
 */
void playerHStats(uint32_t *max_us, uint32_t *bad, uint32_t *n);

/*
 * ホストから流し込みながら送出する（PLAYS）。
 *
 * 全部を RAM に貯める playerRun() は 12288 バイトで頭打ちになる。RAM の
 * 上限は 13824 で、実機の空き容量 27286 バイトには届かない
 * （docs/experiment-log.md 段階 A の「残った制約」）。こちらは 512 バイトの
 * リングだけを使うので、大きさに上限が無い。
 *
 * n は .bin 全体の長さ（ヘッダ 48 + 本体）。中身は 16 進の文字列として
 * Serial から読む。ホストは +RDY を見てから流し始めること。
 *
 * **待たされても壊れない。** データが足りないときに待つのはビットとビットの
 * 間、つまり L の区間なので、H の幅には影響しない。受信側は H の長さだけで
 * ビットを決めている。
 *
 * 流量が足りているかは戻り値ではなく under（待たされた回数）で見る。
 */
bool playerRunStream(uint32_t n, uint32_t delay_ms);

/* 直前の PLAYS で受け取ったバイト数と、データ待ちで止まった回数 */
void playerStreamStats(uint32_t *fed, uint32_t *under, bool *timeout);
