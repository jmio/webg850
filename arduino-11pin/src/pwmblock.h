/*
 * pwmblock.h - PWM 1 ブロック分のビット列の組み立てと復号
 *
 * ハードウェアにも時間にも依存しない純粋な処理だけをここに置く。
 * 送出 (player.cpp) と取り込み (capture.cpp) が同じ規則を 2 か所に
 * 書くのを避けるためで、DECTEST コマンドで両者の突き合わせもできる。
 *
 * ブロックの構成:
 *   0 の並び → 1 の並び → 0 の並び → START_BIT(1)
 *   → [1 + 8bit] × N → [1 + 8bit] × 2（パリティ）→ STOP_BIT(1)
 *
 * データは MSB ファースト。パリティはデータ部の 8 ビット群に含まれる
 * 1 の総数で、16 ビット・ビッグエンディアン。
 */
#pragma once

#include <stdbool.h>
#include <stdint.h>

uint16_t pwmParity(const uint8_t *data, uint32_t len);

/* ビットを 1 個ずつ受け取る先。false を返すと組み立てを打ち切る */
typedef bool (*PwmBitSink)(void *ctx, uint8_t bit);

bool pwmEncodeBlock(const uint8_t *data, uint32_t len,
                    uint32_t z1, uint32_t o, uint32_t z2,
                    PwmBitSink sink, void *ctx);

/*
 * ヘッダの「1 の並び」として認めるのに必要な最低の長さ。
 *
 * 実機のヘッダは PWM1 が 1×40、PWM2 が 1×20 なので 4 倍の余裕がある。
 * これより短い孤立した 1 はノイズとみなして 0 の並びへ戻す。
 *
 * 実測（2026-08-30）: 25848 個の 0 が並ぶ PWM2 のヘッダの途中に、
 * 配線由来と思われる幅 338us / 536us のパルスが現れ、これを 1 と判定した
 * 結果ヘッダの読み飛ばしが途中で終わって 9 ビットの枠が 1 ビットずれた。
 * この保護はその再発を防ぐためのもの。
 */
#define PWM_MIN_ONES 5

/* 復号したバイトを受け取る先 */
typedef void (*PwmByteSink)(void *ctx, uint8_t byte);

struct PwmDec {
	uint8_t     st;        /* 0=先頭の0 1=1の並び 2=0の並び 3=データ */
	uint32_t    z1, o, z2; /* 読み飛ばしたヘッダの実測値 */
	uint8_t     grp;       /* 9 ビット 1 組の中の位置。0 はスタートビット */
	uint8_t     acc;
	uint32_t    nbytes;    /* パリティ 2 バイトを含む復号済みバイト数 */
	uint32_t    fe;        /* スタートビットが 1 でなかった回数 */
	uint32_t    noise;     /* ヘッダの 0 の並びの中でノイズとして戻した 1 の数 */
	uint32_t    ones;      /* 復号したバイト全部の 1 の総数 */
	uint8_t     last2[2];
	PwmByteSink sink;
	void       *ctx;
};

void pwmDecInit(PwmDec *d, PwmByteSink sink, void *ctx);
void pwmDecBit(PwmDec *d, uint8_t bit);

/* パリティ 2 バイトを除いたデータ部のバイト数 */
uint32_t pwmDecDataBytes(const PwmDec *d);
/* 受け取ったパリティと、データ部から計算したパリティ */
uint16_t pwmDecParity(const PwmDec *d);
uint16_t pwmDecCalc(const PwmDec *d);
bool     pwmDecOk(const PwmDec *d);
