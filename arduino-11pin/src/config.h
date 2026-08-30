/*
 * config.h - ピン割り当てとバッファ構成
 *
 * 対象: Arduino Uno R4 Minima (Renesas RA4M1, 5V ロジック)
 * 相手: SHARP PC-G850 系の 11pin インターフェース (5V TTL)
 *
 * 配線の詳細と安全上の注意は docs/hardware.md を参照。
 */
#pragma once

#include <Arduino.h>

#define FW_NAME    "g850-11pin"
#define FW_VERSION "0.5.0"

/*
 * 起動時のプロファイル。0 = REAL（実機と同じ波形）、1 = FAST（短縮）。
 *
 * FAST を既定にしている。22 バイトの転送が 26.5 秒から 3.33 秒になり、
 * 実機で動作を確認済みだから（docs/experiment-log.md の段階 4）。
 *
 * ただし実機での下限 1750〜2000 に対する余裕は 2 倍で、各設定の試行は
 * 1 回しかしていない。うまくいかないときは `PROFILE REAL` を送ると
 * ヘッダが桁違いに長くなる（10000 / 25848）。それでも駄目なら
 * 短縮以外に原因がある。
 *
 * プロファイルは送出 (PLAY) の波形だけを変える。取り込み (CAP) は
 * 実機が出す波形をそのまま測るので影響を受けない。
 */
#define DEFAULT_PROFILE_FAST 1

/* ---- ピン割り当て -------------------------------------------------------
 *
 *  11pin      信号 (SSIO/PWM モード)   向き(実機)   Arduino
 *  ---------  -----------------------  -----------  ---------------------
 *  pin-3      GND                      --           GND
 *  pin-7      XOUT                     出力         D2 (入力・外部割り込み)
 *  pin-6      XIN                      入力         D3 (出力・1kΩ 直列)
 *  pin-4      BUSY                     出力         D4 (入力・監視のみ)
 *  pin-9      ACK                      入力         D5 (既定 Hi-Z)
 *
 *  pin-2 (VCC) は接続しない。GND だけ共通にする。
 */
static const uint8_t PIN_XOUT = 2;  /* 実機 → Arduino。割り込み可能なピンを選ぶこと */
static const uint8_t PIN_XIN  = 3;  /* Arduino → 実機 */
static const uint8_t PIN_BUSY = 4;  /* 実機 → Arduino（BSAVE/BLOAD が使うかの確認用） */
static const uint8_t PIN_ACK  = 5;  /* Arduino → 実機（TEXT SIO の flow 調査用・既定は入力） */

/* ---- 共有バッファ -------------------------------------------------------
 *
 * PLAY 用の .bin と RAW のエッジ列は同時には使わないので同じ領域を共有する。
 * uint32_t で確保しておけばどちらの用途でもアラインメントが合う。
 */
static const size_t STORE_WORDS   = 3072;                 /* 12 KB */
static const size_t BIN_CAPACITY  = STORE_WORDS * 4;      /* .bin の最大サイズ */
static const size_t RAW_CAPACITY  = STORE_WORDS;          /* RAW のエッジ本数 */

extern uint32_t g_store[STORE_WORDS];

static inline uint8_t *binBuf(void) { return (uint8_t *)g_store; }
static inline uint32_t *rawBuf(void) { return g_store; }

/* エッジ割り込みのリングバッファ。2 の冪であること */
static const size_t EDGE_RING = 256;

/* 較正 (CAL) 用。パルス幅のヒストグラムは 1usec 刻みでここまで数える。
 * これを超える長さのパルスは個別に記録する */
static const size_t CAL_HIST_N    = 1024;
static const size_t CAL_LONG_MAX  = 48;
