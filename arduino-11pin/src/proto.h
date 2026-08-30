/*
 * proto.h - USB Serial の行指向プロトコルまわりの共通処理
 *
 * 応答は 1 行 1 レコード。先頭 1 文字が種別を表す。
 *   '+' 正常応答・データ / '!' エラー / '#' 情報 / '*' 進捗
 */
#pragma once

#include <Arduino.h>

/* 種別文字を付けて 1 行出力する。書き込みバッファに空きが無ければ捨てる
 * （ホストが読んでいないときに送出タイミングを壊さないため） */
void emit(char kind, const char *fmt, ...);

/* 捨てずに必ず出す版。長時間動作中には使わないこと */
void emitBlocking(char kind, const char *fmt, ...);

/* 1 行読む。行末の CR/LF は取り除く。
 * 戻り値: 行の長さ。timeout_ms 経過したら -1 */
/* 戻り値が負のときの意味。-2 でも改行までは読み捨ててあるので
 * 次の行から続けられる */
#define READLINE_TIMEOUT (-1)
#define READLINE_TOOLONG (-2)   /* cap に収まらなかった */
int readLine(char *buf, size_t cap, uint32_t timeout_ms);

/* 長時間動作の中断要求を拾う。ESC(0x1B) か Ctrl-C(0x03) が来たら true */
bool abortRequested(void);
void abortClear(void);

/* 指定した絶対時刻 (micros) まで待つ。待っている間に中断要求が来たら false */
bool waitUntilUs(uint32_t deadline_us);

uint16_t crc16ccitt(const uint8_t *p, size_t n);

/* 16 進 1 文字 → 0-15。不正なら -1 */
int hexVal(char c);

/* バイト列を 1 行の 16 進として出力する。prefix の後ろに続けて書く */
void emitHexLine(const char *prefix, const uint8_t *p, size_t n);
