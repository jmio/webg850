#include "proto.h"

#include <stdarg.h>

static volatile bool s_abort = false;

/* 受信バッファを覗いて中断要求だけ先に拾う。
 * 中断以外のバイトは捨てる（長時間動作中はコマンドを受け付けない） */
static void pumpInput(void)
{
	while (Serial.available()) {
		int c = Serial.read();
		if (c == 0x1B || c == 0x03) {
			s_abort = true;
		}
	}
}

bool abortRequested(void)
{
	pumpInput();
	return s_abort;
}

void abortClear(void)
{
	while (Serial.available()) {
		Serial.read();
	}
	s_abort = false;
}

static void emitv(char kind, const char *fmt, va_list ap, bool blocking)
{
	char buf[192];
	int n = vsnprintf(buf, sizeof(buf) - 2, fmt, ap);
	if (n < 0) {
		return;
	}
	if ((size_t)n > sizeof(buf) - 3) {
		n = (int)sizeof(buf) - 3;
	}
	buf[n++] = '\n';
	buf[n] = '\0';

	if (!blocking) {
		/* 1 + 本文が丸ごと入らないなら捨てる。途中まで書くと行が壊れる。
		 *
		 * availableForWrite() は Print の既定実装だと常に 0 を返す。
		 * 0 のときは「空きが分からない」と解釈してそのまま書く
		 * （USB CDC の送信は通常バッファリングされて詰まらない）。 */
		int avail = Serial.availableForWrite();
		if (avail > 0 && avail < n + 1) {
			return;
		}
	}
	Serial.write((uint8_t)kind);
	Serial.write((const uint8_t *)buf, (size_t)n);
}

void emit(char kind, const char *fmt, ...)
{
	va_list ap;
	va_start(ap, fmt);
	emitv(kind, fmt, ap, false);
	va_end(ap);
}

void emitBlocking(char kind, const char *fmt, ...)
{
	va_list ap;
	va_start(ap, fmt);
	emitv(kind, fmt, ap, true);
	va_end(ap);
}

int readLine(char *buf, size_t cap, uint32_t timeout_ms)
{
	size_t len = 0;
	bool over = false;
	uint32_t start = millis();

	for (;;) {
		if (Serial.available()) {
			int c = Serial.read();
			if (c < 0) {
				continue;
			}
			if (c == '\n') {
				buf[len] = '\0';
				/* 溢れた行を黙って切り詰めると、呼び出し側には
				 * 「オフセットがずれた」といった症状しか見えず、
				 * 本当の原因が分からなくなる。区別できるようにする */
				return over ? READLINE_TOOLONG : (int)len;
			}
			if (c == '\r') {
				continue;
			}
			if (len + 1 < cap) {
				buf[len++] = (char)c;
			} else {
				over = true;
			}
			start = millis();
			continue;
		}
		if (timeout_ms && (millis() - start) >= timeout_ms) {
			return READLINE_TIMEOUT;
		}
	}
}

bool waitUntilUs(uint32_t deadline_us)
{
	for (;;) {
		int32_t remain = (int32_t)(deadline_us - micros());
		if (remain <= 0) {
			return true;
		}
		/* エッジ直前は何もしない。中断確認のせいで数 usec ずれるのを避ける */
		if (remain > 2000) {
			if (abortRequested()) {
				return false;
			}
		}
	}
}

uint16_t crc16ccitt(const uint8_t *p, size_t n)
{
	uint16_t c = 0xFFFF;
	while (n--) {
		c ^= (uint16_t)(*p++) << 8;
		for (int i = 0; i < 8; i++) {
			c = (c & 0x8000) ? (uint16_t)((c << 1) ^ 0x1021) : (uint16_t)(c << 1);
		}
	}
	return c;
}

int hexVal(char c)
{
	if (c >= '0' && c <= '9') {
		return c - '0';
	}
	if (c >= 'a' && c <= 'f') {
		return c - 'a' + 10;
	}
	if (c >= 'A' && c <= 'F') {
		return c - 'A' + 10;
	}
	return -1;
}

void emitHexLine(const char *prefix, const uint8_t *p, size_t n)
{
	static const char kHex[] = "0123456789ABCDEF";
	char buf[160];
	size_t i = 0;

	while (prefix[i] && i < sizeof(buf) - 3) {
		buf[i] = prefix[i];
		i++;
	}
	for (size_t k = 0; k < n && i + 2 < sizeof(buf) - 2; k++) {
		buf[i++] = kHex[p[k] >> 4];
		buf[i++] = kHex[p[k] & 0x0F];
	}
	buf[i++] = '\n';
	buf[i] = '\0';

	Serial.write('+');
	Serial.write((const uint8_t *)buf, i);
}
