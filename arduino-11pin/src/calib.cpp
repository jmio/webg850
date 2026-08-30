#include "calib.h"
#include "capture.h"
#include "config.h"
#include "timing.h"
#include "proto.h"
#include "player.h"

#include <string.h>

/* hist[0] = L 期間、hist[1] = H 期間。添字が usec */
static uint16_t s_hist[2][CAL_HIST_N];

/* CAL_HIST_N usec を超える区間は個別に残す。bit31 がレベル、下位が usec */
static uint32_t s_long[CAL_LONG_MAX];
static volatile uint16_t s_long_n;
static volatile uint32_t s_long_over;
static volatile uint8_t  s_mark_h;   /* 長い H（＝区切り）の本数。1 回の転送に 4 本 */

static volatile uint32_t s_last_t;
static volatile uint8_t  s_last_l;
static volatile bool     s_have_last;
static volatile uint32_t s_edges;
static volatile uint32_t s_t_first;
static volatile uint32_t s_t_last;

static bool s_armed;
static uint8_t s_poll_last;

static inline uint8_t readXoutRaw(void)
{
	return (uint8_t)((digitalRead(PIN_XOUT) == HIGH ? 1 : 0) ^ g_tim.inv_in);
}

static inline void record(uint8_t level, uint32_t width)
{
	if (width < CAL_HIST_N) {
		uint16_t *slot = &s_hist[level & 1][width];
		if (*slot != 0xFFFF) {
			(*slot)++;
		}
		return;
	}
	if (level & 1) {
		s_mark_h++;
	}
	if (s_long_n < CAL_LONG_MAX) {
		s_long[s_long_n++] = ((uint32_t)(level & 1) << 31)
		                     | (width & 0x7FFFFFFFUL);
	} else {
		s_long_over++;
	}
}

static void calEdge(uint32_t t, uint8_t level)
{
	if (s_have_last) {
		record(s_last_l, t - s_last_t);
	} else {
		s_t_first = t;
	}
	s_last_t = t;
	s_last_l = level;
	s_have_last = true;
	s_t_last = t;
	s_edges++;
}

static void calIsr(void)
{
	calEdge(micros(), readXoutRaw());
}

void calArm(void)
{
	memset(s_hist, 0, sizeof(s_hist));
	memset(s_long, 0, sizeof(s_long));
	s_long_n = 0;
	s_long_over = 0;
	s_mark_h = 0;
	s_have_last = false;
	s_edges = 0;
	s_t_first = 0;
	s_t_last = 0;

	pinMode(PIN_XOUT, INPUT);
	s_poll_last = readXoutRaw();
	if (g_tim.cap_mode == 0) {
		uint32_t before[32];
		edgeIrqSnapshot(before);
		attachInterrupt(digitalPinToInterrupt(PIN_XOUT), calIsr, CHANGE);
		/* CAP と同じ優先度にする。既定の 12 では USB に横取りされる */
		edgeIrqAfterAttach(before);
	}
	s_armed = true;
}

void calDisarm(void)
{
	if (!s_armed) {
		return;
	}
	if (g_tim.cap_mode == 0) {
		detachInterrupt(digitalPinToInterrupt(PIN_XOUT));
	}
	s_armed = false;
}

void calPoll(void)
{
	if (!s_armed || g_tim.cap_mode == 0) {
		return;
	}
	uint8_t cur = readXoutRaw();
	if (cur != s_poll_last) {
		s_poll_last = cur;
		calEdge(micros(), cur);
	}
}

void calReport(void)
{
	for (uint8_t lvl = 0; lvl < 2; lvl++) {
		for (uint32_t w = 0; w < CAL_HIST_N; w++) {
			if (s_hist[lvl][w]) {
				emitBlocking('+', "H %u %lu %u", (unsigned)lvl,
				             (unsigned long)w, (unsigned)s_hist[lvl][w]);
			}
		}
	}
	for (uint16_t i = 0; i < s_long_n; i++) {
		emitBlocking('+', "L %u %lu %lu", (unsigned)i,
		             (unsigned long)(s_long[i] >> 31),
		             (unsigned long)(s_long[i] & 0x7FFFFFFFUL));
	}
	uint32_t span = (s_edges >= 2) ? (s_t_last - s_t_first) : 0;
	emitBlocking('+', "DONE edges=%lu long=%u longover=%lu span_us=%lu",
	             (unsigned long)s_edges, (unsigned)s_long_n,
	             (unsigned long)s_long_over, (unsigned long)span);
	emitBlocking('+', "OK");
}

void calRun(uint32_t timeout_ms)
{
	calArm();
	emitBlocking('#', "cal armed timeout=%lums mode=%s",
	             (unsigned long)timeout_ms, g_tim.cap_mode ? "poll" : "irq");

	uint32_t t_start = millis();
	uint32_t last_report = t_start;
	bool aborted = false;

	for (;;) {
		calPoll();
		if (s_mark_h >= 4) {
			/* 区切りの長い H は 1 回の転送にちょうど 4 本。
			 * 4 本目を記録した時点で転送は終わっているので待たない */
			break;
		}
		if (abortRequested()) {
			aborted = true;
			break;
		}
		if (millis() - t_start >= timeout_ms) {
			break;
		}
		/* 進捗は転送が始まる前だけ。取り込み中にシリアルへ書くと
		 * エッジ割り込みを取りこぼす（capture.cpp の説明を参照）*/
		if (s_mark_h == 0 && millis() - last_report >= 1000) {
			last_report = millis();
			emit('*', "CAL waiting %lus edges=%lu",
			     (unsigned long)((millis() - t_start) / 1000),
			     (unsigned long)s_edges);
		}
	}

	calDisarm();
	if (aborted) {
		emitBlocking('#', "aborted");
	}
	calReport();
	abortClear();
}

