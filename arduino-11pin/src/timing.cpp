#include "timing.h"
#include "proto.h"

#include <string.h>

Timing g_tim;

/*
 * 既定値はすべて 2026-08-30 に実機（PC-G850V）で測った値。
 * 推定値ではないので、書き込み直後や電源投入後にそのまま使える。
 * 測定の経緯は docs/experiment-log.md の段階 1、値の一覧は
 * docs/waveform.md を参照。
 */
void timingSetProfile(TimingProfile p)
{
	/* 取り込みの既定。プロファイル切り替えでも戻す */
	g_tim.cap_stream = 1;     /* 1 = 常に流す。GUI から途中経過を見せるため */
	g_tim.irq_prio   = 11;    /* USB(12) より高く、タイマ(8) より低い */

	/* 送出の既定。短い H の間だけ USB を止める（usbirq.h を参照） */
	g_tim.usb_mask        = 1;
	g_tim.usb_mask_max_us = 1000;
	g_tim.play_pump       = 1;

	/* --- どちらのプロファイルでも変えないもの（すべて実機実測）--- */
	g_tim.bit0_us  = 162;      /* 最頻 162、平均 161.8、36413 個 */
	g_tim.bit1_us  = 406;      /* 最頻 406、平均 406.0、214 個 */
	g_tim.mark_us  = 30021;    /* 区切りの長い H。1 回の転送に 4 回だけ現れる */
	g_tim.p2_s1_us = 23969;
	g_tim.p2_s2_us = 6013;

	g_tim.hdr1_o  = 40;
	g_tim.hdr1_z2 = 40;
	g_tim.hdr2_o  = 20;
	g_tim.hdr2_z2 = 20;

	g_tim.cap_bit_us    = 284;   /* 162 と 406 の中間。どちらからも 100usec 以上の余裕 */
	g_tim.cap_mark_us   = 7500;  /* 区切り 30021 の 1/4。ビット 1 の 18 倍 */
	g_tim.cap_glitch_us = 40;

	if (p == PROFILE_REAL) {
		/* 実機がそのまま出している波形。1 回の転送に 26.5 秒かかる */
		g_tim.p1_l_us  = 7965382;
		g_tim.p2_l_us  = 2008226;
		g_tim.p3_l_us  = 3998066;
		g_tim.hdr1_z1  = 10000;
		g_tim.hdr2_z1  = 25848;
	} else {
		/* 短縮版。実機で測った下限（ヘッダ 1750〜2000 ビット、
		 * 1750 で失敗し 2000 で成功）に対して 2 倍の余裕を取った値。
		 * PULSES の長い L は 1/100 でも影響が無いことを確認済み。
		 * この設定での動作は実機で確認してある（22 バイトで 3.33 秒）。 */
		g_tim.p1_l_us  = 80000;
		g_tim.p2_l_us  = 20000;
		g_tim.p3_l_us  = 40000;
		g_tim.hdr1_z1  = 4000;
		g_tim.hdr2_z1  = 4000;
	}
}

struct Entry {
	const char *key;
	uint32_t *slot;
};

static Entry entries[] = {
	{ "bit0",    &g_tim.bit0_us },
	{ "bit1",    &g_tim.bit1_us },
	{ "mark",    &g_tim.mark_us },
	{ "p1l",     &g_tim.p1_l_us },
	{ "p2l",     &g_tim.p2_l_us },
	{ "p2s1",    &g_tim.p2_s1_us },
	{ "p2s2",    &g_tim.p2_s2_us },
	{ "p3l",     &g_tim.p3_l_us },
	{ "hdr1",    &g_tim.hdr1_z1 },
	{ "hdr1o",   &g_tim.hdr1_o },
	{ "hdr1z2",  &g_tim.hdr1_z2 },
	{ "hdr2",    &g_tim.hdr2_z1 },
	{ "hdr2o",   &g_tim.hdr2_o },
	{ "hdr2z2",  &g_tim.hdr2_z2 },
	{ "capbit",  &g_tim.cap_bit_us },
	{ "capmark", &g_tim.cap_mark_us },
	{ "capgl",   &g_tim.cap_glitch_us },
};

bool timingSet(const char *key, uint32_t value)
{
	for (size_t i = 0; i < sizeof(entries) / sizeof(entries[0]); i++) {
		if (strcmp(key, entries[i].key) == 0) {
			*entries[i].slot = value;
			return true;
		}
	}
	if (strcmp(key, "invout") == 0) {
		g_tim.inv_out = value ? 1 : 0;
		return true;
	}
	if (strcmp(key, "invin") == 0) {
		g_tim.inv_in = value ? 1 : 0;
		return true;
	}
	if (strcmp(key, "capmode") == 0) {
		g_tim.cap_mode = value ? 1 : 0;
		return true;
	}
	if (strcmp(key, "capstream") == 0) {
		g_tim.cap_stream = value ? 1 : 0;
		return true;
	}
	if (strcmp(key, "irqprio") == 0) {
		g_tim.irq_prio = value;
		return true;
	}
	if (strcmp(key, "usbmask") == 0) {
		g_tim.usb_mask = value ? 1 : 0;
		return true;
	}
	if (strcmp(key, "usbmaskmax") == 0) {
		g_tim.usb_mask_max_us = value;
		return true;
	}
	if (strcmp(key, "playpump") == 0) {
		g_tim.play_pump = value ? 1 : 0;
		return true;
	}
	return false;
}

void timingDump(void)
{
	for (size_t i = 0; i < sizeof(entries) / sizeof(entries[0]); i++) {
		emitBlocking('+', "CFG %s=%lu", entries[i].key,
		             (unsigned long)*entries[i].slot);
	}
	emitBlocking('+', "CFG invout=%u", (unsigned)g_tim.inv_out);
	emitBlocking('+', "CFG invin=%u", (unsigned)g_tim.inv_in);
	emitBlocking('+', "CFG capmode=%u", (unsigned)g_tim.cap_mode);
	emitBlocking('+', "CFG capstream=%u", (unsigned)g_tim.cap_stream);
	emitBlocking('+', "CFG irqprio=%lu", (unsigned long)g_tim.irq_prio);
	emitBlocking('+', "CFG usbmask=%u", (unsigned)g_tim.usb_mask);
	emitBlocking('+', "CFG usbmaskmax=%lu", (unsigned long)g_tim.usb_mask_max_us);
	emitBlocking('+', "CFG playpump=%u", (unsigned)g_tim.play_pump);
}

uint32_t timingBlockBits(uint32_t data_bytes, bool is_block2)
{
	uint32_t hdr = is_block2
	                   ? (g_tim.hdr2_z1 + g_tim.hdr2_o + g_tim.hdr2_z2)
	                   : (g_tim.hdr1_z1 + g_tim.hdr1_o + g_tim.hdr1_z2);
	/* START_BIT + (データ + パリティ 2 バイト) × 9 ビット + STOP_BIT */
	return hdr + 1 + (data_bytes + 2) * 9 + 1;
}
