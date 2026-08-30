/*
 * usbirq.h - H を出している間だけ USB の割り込みを止める
 *
 * 送出 (PLAY) は割り込みを使わず、ビジーウェイトで H の幅を作っている。
 * 割り込みはどれでもこれを横取りするので、USB の ISR が H の最中に走ると
 * その分だけ H が伸びる。ビット 0 は 162usec、ビット 1 は 406usec、判定の
 * しきい値は 284usec なので、**122usec 伸びればビット 0 がビット 1 に化ける**。
 *
 * 取り込み側にも「USB の ISR がエッジ割り込みを横取りしてビットが落ちる」
 * 問題があり、優先度を 11 にして解決した（docs/experiment-log.md の段階 A）。
 * 送出側は割り込みで動いていないので優先度では直せない。止めるしかない。
 *
 * 止めるのは短い H の間だけにする。区切りの 30msec まで止めると USB を
 * 長く待たせることになるうえ、そこでは幅の精度が要らない。
 *
 * RA4M1 の ICU は IELSR[i] のスロット番号がそのまま NVIC の番号になる。
 * USB FS はイベント 0x31-0x34 の 4 本を使う（実機で確認。IRQ コマンドの
 * 出力が 0..3 に event=33/34/31/32 を並べる）。番号は固定と決めつけず、
 * 毎回 IELSR を走査して突き止める。
 *
 * **Uno R4 WiFi では 1 本も見つからない。** あちらは -DNO_USB でビルドされ、
 * Serial が RA4M1 のネイティブ USB ではなく ESP32-S3 へつながる UART
 * (_UART1_) になる（コアの Arduino.h の #ifndef NO_USB）。RA4M1 の USB
 * ペリフェラルを使っていないので、止める相手が違う。WiFi 版を送出側に
 * 使うなら、ここを SCI の割り込みに広げること。取り込み側に使う分には
 * 関係ない（そちらは irqprio の話で、これも WiFi 版では測り直しが要る）。
 */
#pragma once

#include <Arduino.h>

/* IELSR から USB のスロットを探す。Serial が立ち上がった後に呼ぶこと */
void usbIrqScan(void);

/* 見つかった本数と、i 番目の NVIC 番号（無ければ -1） */
int usbIrqCount(void);
int usbIrqNumber(int i);

/* その NVIC 番号が USB のものか（IRQ コマンドの表示用） */
bool usbIrqIsUsb(int irqn);

/*
 * 止める / 戻す。
 *
 * 二重に呼んでも安全。止めている間に来た割り込みは保留され、戻した
 * ところで実行される（USB 側はその間 NAK を返して待つ）。
 */
void usbIrqMask(void);
void usbIrqUnmask(void);
