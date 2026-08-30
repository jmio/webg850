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
