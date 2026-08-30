#include "capture.h"
#include "config.h"
#include "timing.h"
#include "proto.h"
#include "pwmblock.h"

#include <stdio.h>
#include <string.h>

/* ---- エッジのリングバッファ ------------------------------------------ */

static volatile uint32_t s_ring_t[EDGE_RING];
static volatile uint8_t  s_ring_l[EDGE_RING];
static volatile uint16_t s_head;
static volatile uint16_t s_tail;
static volatile uint32_t s_overflow;

static inline uint8_t readXout(void)
{
	return (uint8_t)((digitalRead(PIN_XOUT) == HIGH ? 1 : 0) ^ g_tim.inv_in);
}

static inline void pushEdge(uint32_t t, uint8_t level)
{
	uint16_t h = s_head;
	uint16_t nxt = (uint16_t)((h + 1) & (EDGE_RING - 1));
	if (nxt == s_tail) {
		s_overflow++;
		return;
	}
	s_ring_t[h] = t;
	s_ring_l[h] = level;
	s_head = nxt;
}

static void xoutIsr(void)
{
	pushEdge(micros(), readXout());
}

static bool popEdge(uint32_t *t, uint8_t *level)
{
	if (s_tail == s_head) {
		return false;
	}
	*t = s_ring_t[s_tail];
	*level = s_ring_l[s_tail];
	s_tail = (uint16_t)((s_tail + 1) & (EDGE_RING - 1));
	return true;
}

static uint8_t s_poll_last;

static void armEdges(void)
{
	noInterrupts();
	s_head = s_tail = 0;
	s_overflow = 0;
	interrupts();

	s_poll_last = readXout();
	if (g_tim.cap_mode == 0) {
		attachInterrupt(digitalPinToInterrupt(PIN_XOUT), xoutIsr, CHANGE);
	}
}

static void disarmEdges(void)
{
	if (g_tim.cap_mode == 0) {
		detachInterrupt(digitalPinToInterrupt(PIN_XOUT));
	}
}

/* ポーリング方式のときはここでエッジを作る（割り込みが使えない場合の逃げ道） */
static inline void pollEdges(void)
{
	if (g_tim.cap_mode == 0) {
		return;
	}
	uint8_t cur = readXout();
	if (cur != s_poll_last) {
		s_poll_last = cur;
		pushEdge(micros(), cur);
	}
}

void captureBegin(void)
{
	/* PIN_ACK はここでは触らない。ACK コマンドで出力に切り替えることがあり、
	 * 取り込みのたびに入力へ戻してしまうと設定が消えるため */
	pinMode(PIN_XOUT, INPUT);
	pinMode(PIN_BUSY, INPUT);
}

/* ---- PWM の復号 ------------------------------------------------------- */

/*
 * 復号したバイトはためこまず 16 進の行にして流す。
 * 本体は最大 65535 バイトになりうるので RAM に持てない。
 * 転送速度は最大でも毎秒 340 バイト程度なので USB には十分間に合う。
 */
static PwmDec s_dec;
static uint8_t s_blk_index;
static bool s_blk_open;
static uint32_t s_out_off;
static uint8_t s_line[32];
static uint8_t s_line_len;

static void blockFlushLine(void)
{
	if (s_line_len == 0) {
		return;
	}
	char prefix[24];
	snprintf(prefix, sizeof(prefix), "D %u %04lX ",
	         (unsigned)s_blk_index, (unsigned long)s_out_off);
	emitHexLine(prefix, s_line, s_line_len);
	s_out_off += s_line_len;
	s_line_len = 0;
}

static void byteSink(void *ctx, uint8_t v)
{
	(void)ctx;
	s_line[s_line_len++] = v;
	if (s_line_len >= sizeof(s_line)) {
		blockFlushLine();
	}
}

static void blockOpen(void)
{
	pwmDecInit(&s_dec, byteSink, NULL);
	s_out_off = 0;
	s_line_len = 0;
	s_blk_index++;
	s_blk_open = true;
	emitBlocking('#', "block %u begin", (unsigned)s_blk_index);
}

static void blockClose(void)
{
	if (!s_blk_open) {
		return;
	}
	blockFlushLine();
	s_blk_open = false;

	emitBlocking('+', "R %u bytes=%lu data=%lu hdr=%lu/%lu/%lu parity=%04X calc=%04X %s fe=%lu noise=%lu",
	             (unsigned)s_blk_index,
	             (unsigned long)s_dec.nbytes,
	             (unsigned long)pwmDecDataBytes(&s_dec),
	             (unsigned long)s_dec.z1, (unsigned long)s_dec.o,
	             (unsigned long)s_dec.z2,
	             (unsigned)pwmDecParity(&s_dec), (unsigned)pwmDecCalc(&s_dec),
	             pwmDecOk(&s_dec) ? "OK" : "NG",
	             (unsigned long)s_dec.fe, (unsigned long)s_dec.noise);
}

/* ---- 取り込み本体 ----------------------------------------------------- */

void captureRun(uint32_t timeout_ms)
{
	uint32_t marks = 0;
	uint32_t bits = 0;
	uint32_t glitches = 0;
	bool started = false;      /* 最初の区切りを見たか */
	bool have_rise = false;
	uint32_t rise_t = 0;
	uint32_t t_first = 0;
	uint32_t last_report = millis();
	uint32_t t_start = millis();
	bool done = false;
	bool aborted = false;

	s_blk_index = 0;
	s_blk_open = false;

	captureBegin();
	armEdges();
	emitBlocking('#', "cap armed timeout=%lums mode=%s",
	             (unsigned long)timeout_ms,
	             g_tim.cap_mode ? "poll" : "irq");

	while (!done) {
		pollEdges();

		uint32_t t;
		uint8_t level;
		while (popEdge(&t, &level)) {
			if (level) {
				rise_t = t;
				have_rise = true;
				continue;
			}
			if (!have_rise) {
				continue;   /* 立ち上がりを見ていない立ち下がりは捨てる */
			}
			have_rise = false;

			uint32_t width = t - rise_t;
			if (width <= g_tim.cap_glitch_us) {
				glitches++;
				continue;
			}

			if (width >= g_tim.cap_mark_us) {
				marks++;
				if (!started) {
					started = true;
					t_first = millis();
				}
				blockClose();
				emitBlocking('*', "MARK %lu %luus",
				             (unsigned long)marks, (unsigned long)width);
				if (marks >= 4) {
					done = true;
					break;
				}
				continue;
			}

			if (!started) {
				continue;   /* 転送の途中から拾ったビットは信用できない */
			}
			bits++;
			if (!s_blk_open) {
				blockOpen();
			}
			pwmDecBit(&s_dec, width < g_tim.cap_bit_us ? 0 : 1);
		}

		if (done) {
			break;
		}

		if (abortRequested()) {
			aborted = true;
			break;
		}
		if (millis() - t_start >= timeout_ms) {
			break;
		}
		if (millis() - last_report >= 1000) {
			last_report = millis();
			emit('*', "CAP marks=%lu bits=%lu", (unsigned long)marks,
			     (unsigned long)bits);
		}
	}

	disarmEdges();
	blockClose();

	uint32_t elapsed = started ? (millis() - t_first) : 0;

	const char *status = aborted ? "aborted" : (marks >= 4 ? "ok" : "timeout");
	emitBlocking('+', "DONE marks=%lu bits=%lu blocks=%u glitch=%lu ovf=%lu ms=%lu status=%s",
	             (unsigned long)marks, (unsigned long)bits,
	             (unsigned)s_blk_index, (unsigned long)glitches,
	             (unsigned long)s_overflow, (unsigned long)elapsed, status);
	emitBlocking('+', "OK");
	abortClear();
}

/* ---- 生のエッジ列 ----------------------------------------------------- */

void rawRun(uint32_t timeout_ms, uint32_t max_edges)
{
	if (max_edges == 0 || max_edges > RAW_CAPACITY) {
		max_edges = RAW_CAPACITY;
	}

	uint32_t *buf = rawBuf();
	uint32_t count = 0;
	uint32_t prev_t = 0;
	bool have_prev = false;
	uint32_t t_start = millis();
	bool aborted = false;

	captureBegin();
	armEdges();
	emitBlocking('#', "raw armed timeout=%lums max=%lu mode=%s",
	             (unsigned long)timeout_ms, (unsigned long)max_edges,
	             g_tim.cap_mode ? "poll" : "irq");

	while (count < max_edges) {
		pollEdges();

		uint32_t t;
		uint8_t level;
		while (count < max_edges && popEdge(&t, &level)) {
			if (have_prev) {
				uint32_t d = t - prev_t;
				if (d > 0x7FFFFFFFUL) {
					d = 0x7FFFFFFFUL;
				}
				/* 直前の区間の「レベル」は今のレベルの反対 */
				uint32_t lv = level ? 0u : 1u;
				buf[count++] = (lv << 31) | d;
			}
			prev_t = t;
			have_prev = true;
		}

		if (abortRequested()) {
			aborted = true;
			break;
		}
		if (millis() - t_start >= timeout_ms) {
			break;
		}
	}

	disarmEdges();

	for (uint32_t i = 0; i < count; i++) {
		emitBlocking('+', "E %lu %lu %lu", (unsigned long)i,
		             (unsigned long)(buf[i] >> 31),
		             (unsigned long)(buf[i] & 0x7FFFFFFFUL));
	}
	emitBlocking('+', "DONE edges=%lu ovf=%lu status=%s", (unsigned long)count,
	             (unsigned long)s_overflow, aborted ? "aborted" : "ok");
	emitBlocking('+', "OK");
	abortClear();
}

void pinsReport(const char *xin_state)
{
	captureBegin();
	emitBlocking('+', "PINS xout=%u busy=%u ack=%u xin=%s",
	             (unsigned)readXout(),
	             (unsigned)(digitalRead(PIN_BUSY) == HIGH ? 1 : 0),
	             (unsigned)(digitalRead(PIN_ACK) == HIGH ? 1 : 0),
	             xin_state);
}
