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
