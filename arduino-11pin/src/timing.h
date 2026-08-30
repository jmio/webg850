/*
 * timing.h - BSAVE / BLOAD の PWM 波形を決める定数
 *
 * 既定値は「実機相当」。エミュレータの実測値を 9/8 倍したもので、
 * 外部資料の実機実測とも一致する。詳細は docs/waveform.md を参照。
 */
#pragma once

#include <Arduino.h>

struct Timing {
	/* --- 送出・取り込みに共通のパルス幅 [usec] --- */
	uint32_t bit0_us;      /* ビット 0 の H 期間 */
	uint32_t bit1_us;      /* ビット 1 の H 期間 */
	uint32_t mark_us;      /* ブロックの区切りになる長い H */

	/* --- PULSES の L 期間 [usec] --- */
	uint32_t p1_l_us;      /* PULSES1 の L */
	uint32_t p2_l_us;      /* PULSES2 の最初の L */
	uint32_t p2_s1_us;     /* PULSES2 の 2 つの区切りに挟まれた L */
	uint32_t p2_s2_us;     /* PULSES2 の最後の L */
	uint32_t p3_l_us;      /* PULSES3 の L */

	/* --- ヘッダのビット数 --- */
	uint32_t hdr1_z1;      /* PWM1: 先頭の 0 の個数 */
	uint32_t hdr1_o;       /* PWM1: 続く 1 の個数 */
	uint32_t hdr1_z2;      /* PWM1: 続く 0 の個数 */
	uint32_t hdr2_z1;      /* PWM2: 先頭の 0 の個数 */
	uint32_t hdr2_o;       /* PWM2: 続く 1 の個数 */
	uint32_t hdr2_z2;      /* PWM2: 続く 0 の個数 */

	/* --- 取り込み時の判定しきい値 [usec] --- */
	uint32_t cap_bit_us;   /* H がこれ未満ならビット 0、以上なら 1 */
	uint32_t cap_mark_us;  /* H がこれ以上なら区切り */
	uint32_t cap_glitch_us;/* これ以下の H はノイズとして捨てる */

	/* --- 極性 --- */
	uint8_t inv_out;       /* 1 なら XIN への出力を反転する */
	uint8_t inv_in;        /* 1 なら XOUT からの入力を反転する */

	/* --- 取り込み方式 --- */
	uint8_t cap_mode;      /* 0 = ピン変化割り込み、1 = ポーリング */

	/* --- 取り込み中の出力方法 ---
	 *
	 * 0 = 自動。ブロックが 12 KB に収まるなら貯めて最後に吐き、
	 *     収まらないなら取り込みながら流す
	 * 1 = 常に流す（既定）。大きさによらず途中経過が見えるので、
	 *     ホスト側に進捗表示を作るときはこれ
	 * 2 = 常に貯める。転送中は完全に沈黙する最も安全な方式。
	 *     12 KB を超えたら TRUNCATED
	 *
	 * 1 と 0 は irq_prio が正しいことが前提。2 だけはそれに依存しない。
	 */
	uint8_t  cap_stream;

	/* --- エッジ割り込みの NVIC 優先度（小さいほど高い）---
	 *
	 * 16 未満ならその値を設定する。255 は「触らない」。
	 *
	 * **9〜11 以外を指定してはいけない。** 実機で確かめた制約:
	 *   - USB は優先度 12。同じ 12 だと横取りできず、USB の ISR が
	 *     動いている間にエッジが 2 回来ると 1 ビット消える
	 *   - millis/micros のタイマは優先度 8。これより高くすると
	 *     ISR 内の micros() が飛び、幅の測定そのものが壊れる
	 *     （優先度 4 で偽の区切りが 4 本立ち、転送が 8.6 秒で終わった）
	 * 経緯は docs/experiment-log.md の「段階 A」を参照。
	 */
	uint32_t irq_prio;
};

extern Timing g_tim;

/* タイミングのプロファイル */
enum TimingProfile {
	PROFILE_REAL = 0,  /* 実機相当。1 回の転送に 26 秒前後かかる */
	PROFILE_FAST = 1   /* 短縮版。エミュレータで下限を確かめた値の約 2 倍の余裕 */
};

void timingSetProfile(TimingProfile p);

/* key に対応する値を設定する。未知の key なら false */
bool timingSet(const char *key, uint32_t value);

/* 現在の設定を "+CFG key=value" の形で全部出力する */
void timingDump(void);

/* PWM1 / PWM2 の総ビット数（進捗表示用） */
uint32_t timingBlockBits(uint32_t data_bytes, bool is_block2);
