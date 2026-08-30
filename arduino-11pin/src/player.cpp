#include "player.h"
#include "config.h"
#include "timing.h"
#include "proto.h"
#include "pwmblock.h"
#include "usbirq.h"

static IdleDrive s_idle = IDLE_HIZ;

/* 短い H が実際に何 usec 出ていたかの記録（player.h の playerHStats）*/
static uint32_t s_h_start;
static bool     s_h_open;
static uint32_t s_h_max;
static uint32_t s_h_bad;
static uint32_t s_h_n;
static uint8_t  s_h_bit;      /* いま出しているつもりのビット */
static uint32_t s_bits_done;
static uint32_t s_bits_total;
static uint32_t s_last_report;

static inline void driveXin(uint8_t level)
{
	digitalWrite(PIN_XIN, (level ^ g_tim.inv_out) ? HIGH : LOW);
}

void playerBegin(void)
{
	/* 起動直後は実機に一切触れない。docs/experiment-plan.md の段階 0 のため */
	pinMode(PIN_XIN, INPUT);
	s_idle = IDLE_HIZ;
}

void playerSetIdle(IdleDrive d)
{
	s_idle = d;
	if (d == IDLE_HIZ) {
		pinMode(PIN_XIN, INPUT);
	} else {
		pinMode(PIN_XIN, OUTPUT);
		driveXin(d == IDLE_HIGH ? 1 : 0);
	}
}

IdleDrive playerIdle(void)
{
	return s_idle;
}

void playerHStats(uint32_t *max_us, uint32_t *bad, uint32_t *n)
{
	*max_us = s_h_max;
	*bad    = s_h_bad;
	*n      = s_h_n;
}

/*
 * 1 区間を出す。
 *
 * 待ち時間は「レベルを変えた直後の micros()」を起点にする。絶対時刻を
 * 積み上げていく方式だと、進捗表示などで一度でも遅れたときに次の H が
 * 短くなってしまう。区間ごとに取り直せば遅れは L 側にだけ乗る。
 *
 * 受信側はビットを H の長さだけで判定していて L の長さは見ていないので
 * （docs/analysis/bsave-signal-format.md の実測）、これで問題ない。
 *
 * **短い H の間は USB の割り込みを止める。** ここはビジーウェイトなので
 * USB の ISR に横取りされると H がその分だけ伸びる。遅れを L 側だけに
 * 寄せるという上の考え方を、割り込みに対しても通すもの。区切りのような
 * 長い H では止めない（usbirq.h を参照）。
 */
static bool segment(uint8_t level, uint32_t us)
{
	bool hold = (level != 0) && g_tim.usb_mask && (us <= g_tim.usb_mask_max_us);

	if (hold) {
		usbIrqMask();
	}
	driveXin(level);

	if (level && us <= g_tim.usb_mask_max_us) {
		/* 短い H の始まり。実際に出た長さを出した側で測る */
		s_h_start = micros();
		s_h_open = true;
	} else if (!level && s_h_open) {
		uint32_t d = micros() - s_h_start;
		uint8_t got = (d >= g_tim.cap_bit_us) ? 1 : 0;

		s_h_open = false;
		s_h_n++;
		if (d > s_h_max) {
			s_h_max = d;
		}
		/* 出したつもりのビットと、受信側が読むであろうビットの食い違い */
		if (got != s_h_bit) {
			s_h_bad++;
		}
	}

	if (!hold) {
		/* L に入った、または止めない長さの H。保留を吐き出させる */
		usbIrqUnmask();

		/*
		 * L の間に受信を捌く。読まないと相手のバッファが詰まり、
		 * 送出中はホストから何も送れなくなる。ここで捌くから
		 * 中断 (ESC) もビットの合間で効く。
		 */
		if (g_tim.play_pump && abortRequested()) {
			return false;
		}
	}
	return waitUntilUs(micros() + us);
}

static void maybeReport(void)
{
	uint32_t now = millis();
	if (now - s_last_report < 300) {
		return;
	}
	s_last_report = now;
	uint32_t pct = s_bits_total ? (s_bits_done * 100 / s_bits_total) : 0;
	emit('*', "PLAY %lu/%lu %lu%%", (unsigned long)s_bits_done,
	     (unsigned long)s_bits_total, (unsigned long)pct);
}

static bool emitBit(uint8_t b)
{
	uint32_t t = b ? g_tim.bit1_us : g_tim.bit0_us;

	s_h_bit = b;
	if (!segment(1, t)) {
		return false;
	}
	if (!segment(0, t)) {
		return false;
	}
	s_bits_done++;
	/* L を出し終えた直後に報告する。次の立ち上がりが少し遅れるだけで、
	 * H の幅には影響しない */
	maybeReport();
	return true;
}

static bool bitSink(void *ctx, uint8_t bit)
{
	(void)ctx;
	return emitBit(bit);
}

static bool playBlock(const uint8_t *data, uint32_t len,
                      uint32_t z1, uint32_t o, uint32_t z2)
{
	return pwmEncodeBlock(data, len, z1, o, z2, bitSink, NULL);
}

bool playerRun(const uint8_t *bin, uint32_t n, uint32_t delay_ms)
{
	const uint32_t body = n - 48;

	pinMode(PIN_XIN, OUTPUT);
	driveXin(0);

	s_bits_done = 0;
	s_bits_total = timingBlockBits(48, false) + timingBlockBits(body, true);
	s_last_report = millis();
	s_h_max = s_h_bad = s_h_n = 0;
	s_h_open = false;
	s_h_bit = 0;

	/*
	 * USB のスロットは毎回探し直し、**実際に見つかった本数を報告する**。
	 * 取り込み側で「設定した優先度が適用されていないのに気付かず、
	 * 優先度では直らないと誤った結論を出しかけた」ため
	 * （docs/experiment-log.md 段階 A）。設定値ではなく効いた値を出す。
	 */
	usbIrqScan();

	emitBlocking('#', "play n=%lu body=%lu bits=%lu usbmask=%u irqs=%d",
	             (unsigned long)n, (unsigned long)body,
	             (unsigned long)s_bits_total,
	             (unsigned)g_tim.usb_mask, usbIrqCount());

	if (delay_ms && !waitUntilUs(micros() + delay_ms * 1000UL)) {
		goto aborted;
	}

	/* PULSES1: H(30ms) - L(8000ms) */
	if (!segment(1, g_tim.mark_us)) goto aborted;
	if (!segment(0, g_tim.p1_l_us)) goto aborted;

	/* PWM1: ヘッダ 48 バイト */
	if (!playBlock(bin, 48, g_tim.hdr1_z1, g_tim.hdr1_o, g_tim.hdr1_z2)) goto aborted;

	/* PULSES2: L(2000ms) - H(30ms) - L(24ms) - H(30ms) - L(6ms) */
	if (!segment(0, g_tim.p2_l_us))  goto aborted;
	if (!segment(1, g_tim.mark_us))  goto aborted;
	if (!segment(0, g_tim.p2_s1_us)) goto aborted;
	if (!segment(1, g_tim.mark_us))  goto aborted;
	if (!segment(0, g_tim.p2_s2_us)) goto aborted;

	/* PWM2: 本体 */
	if (!playBlock(bin + 48, body, g_tim.hdr2_z1, g_tim.hdr2_o, g_tim.hdr2_z2)) goto aborted;

	/* PULSES3: L(4000ms) - H(30ms) */
	if (!segment(0, g_tim.p3_l_us)) goto aborted;
	if (!segment(1, g_tim.mark_us)) goto aborted;

	/* 送出後はアイドルレベルへ戻す。既定の LOW が実機のアイドルと同じ */
	usbIrqUnmask();
	playerSetIdle(s_idle == IDLE_HIZ ? IDLE_LOW : s_idle);
	return true;

aborted:
	/* 中断でも必ず戻す。止めたまま抜けると USB が黙る */
	usbIrqUnmask();
	playerSetIdle(s_idle == IDLE_HIZ ? IDLE_LOW : s_idle);
	return false;
}
