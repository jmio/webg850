/*
 * main.cpp - USB Serial のコマンドループ
 *
 * PC-G850 の 11pin I/O に対して BSAVE / BLOAD の PWM 波形を出し入れする。
 * コマンドの仕様は docs/protocol.md を参照。
 */
#include <Arduino.h>

#include "config.h"
#include "timing.h"
#include "proto.h"
#include "player.h"
#include "capture.h"
#include "calib.h"
#include "pwmblock.h"

#include <ctype.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

uint32_t g_store[STORE_WORDS];

static uint32_t s_bin_len;      /* バッファに入っている .bin のバイト数 */
static char s_line[192];

/* ---- 小道具 ----------------------------------------------------------- */

/* 空白区切りのトークンを取り出す。無ければ NULL */
static char *nextTok(char **p)
{
	char *s = *p;
	while (*s == ' ' || *s == '\t') {
		s++;
	}
	if (*s == '\0') {
		*p = s;
		return NULL;
	}
	char *start = s;
	while (*s && *s != ' ' && *s != '\t') {
		s++;
	}
	if (*s) {
		*s++ = '\0';
	}
	*p = s;
	return start;
}

static bool eqi(const char *a, const char *b)
{
	while (*a && *b) {
		if (toupper((unsigned char)*a) != toupper((unsigned char)*b)) {
			return false;
		}
		a++;
		b++;
	}
	return *a == *b;
}

static uint32_t toU32(const char *s, uint32_t dflt)
{
	if (!s || !*s) {
		return dflt;
	}
	return (uint32_t)strtoul(s, NULL, 0);
}

static const char *idleName(void)
{
	switch (playerIdle()) {
	case IDLE_LOW:  return "L";
	case IDLE_HIGH: return "H";
	default:        return "Z";
	}
}

/* ---- .bin のヘッダ検査 ------------------------------------------------ */

static void binReport(void)
{
	if (s_bin_len < 49) {
		emitBlocking('#', "bin empty");
		return;
	}
	const uint8_t *b = binBuf();
	uint32_t declared = (uint32_t)b[0x12] | ((uint32_t)b[0x13] << 8);
	uint32_t body = s_bin_len - 48;
	uint32_t addr = (uint32_t)b[0x14] | ((uint32_t)b[0x15] << 8);

	emitBlocking('+', "BIN n=%lu body=%lu declared=%lu mode=%02X addr=%04lX crc=%04X %s",
	             (unsigned long)s_bin_len, (unsigned long)body,
	             (unsigned long)declared, (unsigned)b[0], (unsigned long)addr,
	             (unsigned)crc16ccitt(binBuf(), s_bin_len),
	             (declared == body) ? "sizeok" : "SIZEMISMATCH");
}

/* ---- コマンド --------------------------------------------------------- */

/*
 * LOAD <n>
 *   +RDY
 *   D <offset16> <hex...>     ← ホストから。offset は 16 進 4 桁
 *   ...
 *   END
 *   +OK n=<n> crc=<hhhh>
 */
static void cmdLoad(char *args)
{
	uint32_t n = toU32(nextTok(&args), 0);
	if (n < 49 || n > BIN_CAPACITY) {
		emitBlocking('!', "ERR size %lu (49..%lu)", (unsigned long)n,
		             (unsigned long)BIN_CAPACITY);
		return;
	}

	uint8_t *buf = binBuf();
	uint32_t got = 0;
	s_bin_len = 0;
	emitBlocking('+', "RDY %lu", (unsigned long)n);

	for (;;) {
		int len = readLine(s_line, sizeof(s_line), 10000);
		if (len < 0) {
			emitBlocking('!', "ERR timeout at %lu", (unsigned long)got);
			return;
		}
		char *p = s_line;
		char *tok = nextTok(&p);
		if (!tok) {
			continue;
		}
		if (eqi(tok, "END")) {
			break;
		}
		if (eqi(tok, "ABORT")) {
			emitBlocking('!', "ERR aborted");
			return;
		}
		if (!eqi(tok, "D")) {
			emitBlocking('!', "ERR expected D/END, got %s", tok);
			return;
		}

		char *offs = nextTok(&p);
		char *hex = nextTok(&p);
		if (!offs || !hex) {
			emitBlocking('!', "ERR malformed D line");
			return;
		}
		uint32_t off = (uint32_t)strtoul(offs, NULL, 16);
		if (off != got) {
			emitBlocking('!', "ERR offset %lu expected %lu",
			             (unsigned long)off, (unsigned long)got);
			return;
		}
		for (char *q = hex; q[0] && q[1]; q += 2) {
			int hi = hexVal(q[0]);
			int lo = hexVal(q[1]);
			if (hi < 0 || lo < 0) {
				emitBlocking('!', "ERR bad hex at %lu", (unsigned long)got);
				return;
			}
			if (got >= n) {
				emitBlocking('!', "ERR too much data");
				return;
			}
			buf[got++] = (uint8_t)((hi << 4) | lo);
		}
	}

	if (got != n) {
		emitBlocking('!', "ERR short %lu of %lu", (unsigned long)got,
		             (unsigned long)n);
		return;
	}
	s_bin_len = n;
	binReport();
	emitBlocking('+', "OK n=%lu crc=%04X", (unsigned long)n,
	             (unsigned)crc16ccitt(buf, n));
}

static void cmdDump(void)
{
	if (s_bin_len == 0) {
		emitBlocking('!', "ERR empty");
		return;
	}
	const uint8_t *buf = binBuf();
	for (uint32_t off = 0; off < s_bin_len; off += 32) {
		uint32_t n = s_bin_len - off;
		if (n > 32) {
			n = 32;
		}
		char prefix[24];
		snprintf(prefix, sizeof(prefix), "D 0 %04lX ", (unsigned long)off);
		emitHexLine(prefix, buf + off, n);
	}
	emitBlocking('+', "OK n=%lu crc=%04X", (unsigned long)s_bin_len,
	             (unsigned)crc16ccitt(buf, s_bin_len));
}

static void cmdPlay(char *args)
{
	if (s_bin_len < 49) {
		emitBlocking('!', "ERR no bin loaded");
		return;
	}
	const uint8_t *b = binBuf();
	uint32_t declared = (uint32_t)b[0x12] | ((uint32_t)b[0x13] << 8);
	if (declared != s_bin_len - 48) {
		emitBlocking('#', "warn declared=%lu but body=%lu",
		             (unsigned long)declared, (unsigned long)(s_bin_len - 48));
	}

	uint32_t delay_ms = toU32(nextTok(&args), 0);
	abortClear();
	uint32_t t0 = millis();
	bool ok = playerRun(b, s_bin_len, delay_ms);
	uint32_t ms = millis() - t0;

	emitBlocking('+', "DONE n=%lu ms=%lu status=%s", (unsigned long)s_bin_len,
	             (unsigned long)ms, ok ? "ok" : "aborted");
	emitBlocking('+', "OK");
	abortClear();
}

/*
 * DECTEST - ビット列の組み立てと復号を RAM の中だけで往復させる。
 *
 * ピンも時間も使わないので実機も配線も要らない。ここが通っていれば、
 * あとに残る問題は波形のタイミングとレベルだけに絞り込める。
 */
static PwmDec s_dt_dec;
static const uint8_t *s_dt_expect;
static uint32_t s_dt_len;
static uint32_t s_dt_idx;
static uint32_t s_dt_bad;

static void dtByte(void *ctx, uint8_t v)
{
	(void)ctx;
	/* 末尾 2 バイトはパリティなので照合の対象にしない */
	if (s_dt_idx < s_dt_len && v != s_dt_expect[s_dt_idx]) {
		s_dt_bad++;
	}
	s_dt_idx++;
}

static bool dtBit(void *ctx, uint8_t bit)
{
	(void)ctx;
	pwmDecBit(&s_dt_dec, bit);
	return true;
}

static bool decTestBlock(const char *name, const uint8_t *data, uint32_t len,
                         uint32_t z1, uint32_t o, uint32_t z2)
{
	s_dt_expect = data;
	s_dt_len = len;
	s_dt_idx = 0;
	s_dt_bad = 0;
	pwmDecInit(&s_dt_dec, dtByte, NULL);
	pwmEncodeBlock(data, len, z1, o, z2, dtBit, NULL);

	bool ok = (pwmDecDataBytes(&s_dt_dec) == len) && (s_dt_bad == 0)
	          && pwmDecOk(&s_dt_dec)
	          && s_dt_dec.z1 == z1 && s_dt_dec.o == o && s_dt_dec.z2 == z2;

	emitBlocking('+', "T %s len=%lu got=%lu bad=%lu hdr=%lu/%lu/%lu "
	                  "parity=%04X calc=%04X fe=%lu %s",
	             name, (unsigned long)len,
	             (unsigned long)pwmDecDataBytes(&s_dt_dec),
	             (unsigned long)s_dt_bad,
	             (unsigned long)s_dt_dec.z1, (unsigned long)s_dt_dec.o,
	             (unsigned long)s_dt_dec.z2,
	             (unsigned)pwmDecParity(&s_dt_dec), (unsigned)pwmDecCalc(&s_dt_dec),
	             (unsigned long)s_dt_dec.fe, ok ? "OK" : "NG");
	return ok;
}

static void cmdDecTest(void)
{
	if (s_bin_len < 49) {
		emitBlocking('!', "ERR no bin loaded");
		return;
	}
	const uint8_t *b = binBuf();
	bool ok = decTestBlock("PWM1", b, 48,
	                       g_tim.hdr1_z1, g_tim.hdr1_o, g_tim.hdr1_z2);
	ok &= decTestBlock("PWM2", b + 48, s_bin_len - 48,
	                   g_tim.hdr2_z1, g_tim.hdr2_o, g_tim.hdr2_z2);
	emitBlocking('+', "OK %s", ok ? "PASS" : "FAIL");
}

/*
 * SELFTEST - 自分が出した波形を読み返して幅を測る。
 *
 * D3 (XIN 出力) を D2 (XOUT 入力) にジャンパでつなぐ。実機がつながって
 * いると出力同士がぶつかるので、実機側は外しておくこと。
 *
 * 実機なしで「組み立てたビット列とパルス幅が意図どおりか」を確かめられる。
 * ここが合っていれば、あとは実機側のしきい値の問題に絞り込める。
 */
static void cmdSelftest(char *args)
{
	if (s_bin_len < 49) {
		emitBlocking('!', "ERR no bin loaded");
		return;
	}
	if (g_tim.cap_mode != 0) {
		/* 送出中は主ループがビジーウェイトしているのでポーリングできない。
		 * SELFTEST はピン変化割り込みでしか成立しない */
		emitBlocking('!', "ERR selftest needs capmode=0 (irq)");
		return;
	}
	uint32_t delay_ms = toU32(nextTok(&args), 0);

	emitBlocking('#', "selftest: jumper D%u -> D%u, disconnect the PC-G850",
	             (unsigned)PIN_XIN, (unsigned)PIN_XOUT);
	abortClear();
	calArm();
	uint32_t t0 = millis();
	bool ok = playerRun(binBuf(), s_bin_len, delay_ms);
	uint32_t ms = millis() - t0;
	calDisarm();

	emitBlocking('#', "played ms=%lu status=%s", (unsigned long)ms,
	             ok ? "ok" : "aborted");
	calReport();
	abortClear();
}

static void cmdInfo(void)
{
	emitBlocking('+', "INFO name=%s ver=%s board=uno_r4_minima", FW_NAME, FW_VERSION);
	emitBlocking('+', "INFO pins xout=D%u xin=D%u busy=D%u ack=D%u",
	             (unsigned)PIN_XOUT, (unsigned)PIN_XIN,
	             (unsigned)PIN_BUSY, (unsigned)PIN_ACK);
	emitBlocking('+', "INFO bincap=%lu rawcap=%lu binlen=%lu xin=%s",
	             (unsigned long)BIN_CAPACITY, (unsigned long)RAW_CAPACITY,
	             (unsigned long)s_bin_len, idleName());
	emitBlocking('+', "OK");
}

static void cmdCfg(char *args)
{
	char *key = nextTok(&args);
	if (!key) {
		timingDump();
		emitBlocking('+', "OK");
		return;
	}
	char *val = nextTok(&args);
	if (!val) {
		emitBlocking('!', "ERR value required");
		return;
	}
	if (!timingSet(key, toU32(val, 0))) {
		emitBlocking('!', "ERR unknown key %s", key);
		return;
	}
	emitBlocking('+', "OK %s", key);
}

static void cmdProfile(char *args)
{
	char *p = nextTok(&args);
	if (!p) {
		emitBlocking('!', "ERR REAL or FAST");
		return;
	}
	if (eqi(p, "REAL")) {
		timingSetProfile(PROFILE_REAL);
	} else if (eqi(p, "FAST")) {
		timingSetProfile(PROFILE_FAST);
	} else {
		emitBlocking('!', "ERR REAL or FAST");
		return;
	}
	emitBlocking('+', "OK %s", p);
}

static void cmdIdle(char *args)
{
	char *p = nextTok(&args);
	if (!p) {
		emitBlocking('!', "ERR 0|1|Z");
		return;
	}
	if (eqi(p, "Z")) {
		playerSetIdle(IDLE_HIZ);
	} else if (toU32(p, 0)) {
		playerSetIdle(IDLE_HIGH);
	} else {
		playerSetIdle(IDLE_LOW);
	}
	emitBlocking('+', "OK xin=%s", idleName());
}

static void cmdAck(char *args)
{
	char *p = nextTok(&args);
	if (!p) {
		emitBlocking('!', "ERR 0|1|Z");
		return;
	}
	if (eqi(p, "Z")) {
		pinMode(PIN_ACK, INPUT);
		emitBlocking('+', "OK ack=Z");
		return;
	}
	pinMode(PIN_ACK, OUTPUT);
	digitalWrite(PIN_ACK, toU32(p, 0) ? HIGH : LOW);
	emitBlocking('+', "OK ack=%lu", (unsigned long)toU32(p, 0));
}

static void dispatch(char *line)
{
	char *p = line;
	char *cmd = nextTok(&p);
	if (!cmd) {
		return;
	}

	if (eqi(cmd, "PING")) {
		emitBlocking('+', "PONG %s %s", FW_NAME, FW_VERSION);
		emitBlocking('+', "OK");
	} else if (eqi(cmd, "INFO")) {
		cmdInfo();
	} else if (eqi(cmd, "CFG")) {
		cmdCfg(p);
	} else if (eqi(cmd, "PROFILE")) {
		cmdProfile(p);
	} else if (eqi(cmd, "LOAD")) {
		cmdLoad(p);
	} else if (eqi(cmd, "DUMP")) {
		cmdDump();
	} else if (eqi(cmd, "BIN")) {
		binReport();
	} else if (eqi(cmd, "PLAY")) {
		cmdPlay(p);
	} else if (eqi(cmd, "CAP")) {
		abortClear();
		captureRun(toU32(nextTok(&p), 120) * 1000UL);
	} else if (eqi(cmd, "RAW")) {
		abortClear();
		uint32_t sec = toU32(nextTok(&p), 60);
		uint32_t max = toU32(nextTok(&p), RAW_CAPACITY);
		rawRun(sec * 1000UL, max);
	} else if (eqi(cmd, "CAL")) {
		abortClear();
		calRun(toU32(nextTok(&p), 120) * 1000UL);
	} else if (eqi(cmd, "DECTEST")) {
		cmdDecTest();
	} else if (eqi(cmd, "SELFTEST")) {
		cmdSelftest(p);
	} else if (eqi(cmd, "PINS")) {
		pinsReport(idleName());
		emitBlocking('+', "OK");
	} else if (eqi(cmd, "IDLE")) {
		cmdIdle(p);
	} else if (eqi(cmd, "ACK")) {
		cmdAck(p);
	} else {
		emitBlocking('!', "ERR unknown command %s", cmd);
	}
}

/* ---- Arduino のエントリポイント --------------------------------------- */

void setup(void)
{
	Serial.begin(115200);

	timingSetProfile(DEFAULT_PROFILE_FAST ? PROFILE_FAST : PROFILE_REAL);

	/*
	 * 11pin は出力と入力で極性が違う（2026-08-30 に実機で確定）。
	 *
	 *   pin-7 XOUT: 0x18 bit7 = 1 → 5V     … 非反転
	 *   pin-6 XIN : 0x1F bit2 = 1 ⟺ 0V     … 反転
	 *
	 * したがって XIN を駆動するときは反転させる。詳細は
	 * docs/waveform.md の「極性」を参照。
	 */
	g_tim.inv_out = 1;
	g_tim.inv_in = 0;

	playerBegin();
	captureBegin();
	pinMode(PIN_ACK, INPUT);
	s_bin_len = 0;

	uint32_t t0 = millis();
	while (!Serial && (millis() - t0) < 3000) {
		;
	}
	/* 起動時の設定を明示する。較正済みの値が入っていることを
	 * つないだ側がすぐ確認できるようにするため */
	emitBlocking('#', "%s %s ready", FW_NAME, FW_VERSION);
	emitBlocking('#', "profile=%s bit0=%lu bit1=%lu mark=%lu hdr=%lu/%lu",
	             DEFAULT_PROFILE_FAST ? "FAST" : "REAL",
	             (unsigned long)g_tim.bit0_us, (unsigned long)g_tim.bit1_us,
	             (unsigned long)g_tim.mark_us,
	             (unsigned long)g_tim.hdr1_z1, (unsigned long)g_tim.hdr2_z1);
	emitBlocking('#', "invout=%u invin=%u xin=Z (measured on PC-G850V 2026-08-30)",
	             (unsigned)g_tim.inv_out, (unsigned)g_tim.inv_in);
}

void loop(void)
{
	int len = readLine(s_line, sizeof(s_line), 0);
	if (len > 0) {
		dispatch(s_line);
	}
}
