#include "pwmblock.h"

#include <string.h>

uint16_t pwmParity(const uint8_t *data, uint32_t len)
{
	uint32_t ones = 0;
	for (uint32_t i = 0; i < len; i++) {
		ones += (uint32_t)__builtin_popcount(data[i]);
	}
	return (uint16_t)ones;
}

static bool putByte(uint8_t v, PwmBitSink sink, void *ctx)
{
	if (!sink(ctx, 1)) {   /* 各バイトの前に付くスタートビット */
		return false;
	}
	for (int k = 7; k >= 0; k--) {   /* MSB ファースト */
		if (!sink(ctx, (uint8_t)((v >> k) & 1))) {
			return false;
		}
	}
	return true;
}

bool pwmEncodeBlock(const uint8_t *data, uint32_t len,
                    uint32_t z1, uint32_t o, uint32_t z2,
                    PwmBitSink sink, void *ctx)
{
	for (uint32_t i = 0; i < z1; i++) {
		if (!sink(ctx, 0)) return false;
	}
	for (uint32_t i = 0; i < o; i++) {
		if (!sink(ctx, 1)) return false;
	}
	for (uint32_t i = 0; i < z2; i++) {
		if (!sink(ctx, 0)) return false;
	}
	if (!sink(ctx, 1)) return false;   /* START_BIT */

	for (uint32_t i = 0; i < len; i++) {
		if (!putByte(data[i], sink, ctx)) return false;
	}
	uint16_t par = pwmParity(data, len);
	if (!putByte((uint8_t)(par >> 8), sink, ctx)) return false;
	if (!putByte((uint8_t)(par & 0xFF), sink, ctx)) return false;

	return sink(ctx, 1);   /* STOP_BIT */
}

void pwmDecInit(PwmDec *d, PwmByteSink sink, void *ctx)
{
	memset(d, 0, sizeof(*d));
	d->sink = sink;
	d->ctx = ctx;
}

void pwmDecBit(PwmDec *d, uint8_t bit)
{
	switch (d->st) {
	case 0:
		if (bit == 0) {
			d->z1++;
		} else {
			d->st = 1;
			d->o = 1;
		}
		break;
	case 1:
		if (bit == 1) {
			d->o++;
		} else if (d->o < PWM_MIN_ONES) {
			/* 短すぎる 1 の並びはノイズ。0 の並びに戻して数え直す。
			 * 実機のヘッダは 1 が 20 個ないし 40 個続くので取り違えない */
			d->noise += d->o;
			d->z1 += d->o + 1;   /* ノイズだった分 + いま来た 0 */
			d->o = 0;
			d->st = 0;
		} else {
			d->st = 2;
			d->z2 = 1;
		}
		break;
	case 2:
		if (bit == 0) {
			d->z2++;
		} else {
			/* この 1 が START_BIT。次から 9 ビット 1 組になる */
			d->st = 3;
			d->grp = 0;
		}
		break;
	default:
		if (d->grp == 0) {
			/* 各バイトのスタートビット。常に 1 のはず。
			 * ブロック末尾の STOP_BIT もここに来るが、直後に区切りが
			 * 来てブロックが閉じるので余りとして無視される */
			if (bit != 1) {
				d->fe++;
			}
			d->acc = 0;
			d->grp = 1;
		} else {
			d->acc = (uint8_t)((d->acc << 1) | bit);
			d->grp++;
			if (d->grp == 9) {
				uint8_t v = d->acc;
				d->grp = 0;
				d->nbytes++;
				d->ones += (uint32_t)__builtin_popcount(v);
				d->last2[0] = d->last2[1];
				d->last2[1] = v;
				if (d->sink) {
					d->sink(d->ctx, v);
				}
			}
		}
		break;
	}
}

uint32_t pwmDecDataBytes(const PwmDec *d)
{
	return (d->nbytes >= 2) ? d->nbytes - 2 : 0;
}

uint16_t pwmDecParity(const PwmDec *d)
{
	if (d->nbytes < 2) {
		return 0;
	}
	return (uint16_t)((d->last2[0] << 8) | d->last2[1]);
}

uint16_t pwmDecCalc(const PwmDec *d)
{
	if (d->nbytes < 2) {
		return 0;
	}
	return (uint16_t)(d->ones
	                  - (uint32_t)__builtin_popcount(d->last2[0])
	                  - (uint32_t)__builtin_popcount(d->last2[1]));
}

bool pwmDecOk(const PwmDec *d)
{
	return d->nbytes >= 2 && d->fe == 0 && pwmDecParity(d) == pwmDecCalc(d);
}
