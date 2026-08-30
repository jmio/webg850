/*
 * capture.h - 11pin の XOUT に出る波形を取り込む（実験 B）
 *
 * captureRun() は PWM を復号してバイト列を返す。
 * rawRun() は復号せずエッジの列をそのまま返す。波形の素性を調べるとき用。
 */
#pragma once

#include <Arduino.h>

void captureBegin(void);

/* PWM を復号する。区切りの長い H を 4 回見たら 1 回の転送が終わったとみなす */
void captureRun(uint32_t timeout_ms);

/* 生のエッジ列を取り込んで一括で吐き出す */
void rawRun(uint32_t timeout_ms, uint32_t max_edges);

/* 現在のピンの状態。xin_state は XIN の駆動状態を表す文字列 */
void pinsReport(const char *xin_state);
void captureIrqInfo(int *irqn, uint32_t *prio);

/* エッジ割り込みの NVIC 優先度を g_tim.irq_prio にする。
 * attachInterrupt を挟んで snapshot → afterAttach の順で呼ぶ */
void edgeIrqSnapshot(uint32_t *before);          /* uint32_t[32] */
void edgeIrqAfterAttach(const uint32_t *before);
