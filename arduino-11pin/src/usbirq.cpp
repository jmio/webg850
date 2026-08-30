#include "usbirq.h"

/*
 * USB FS が使う ICU のイベント番号。
 *
 *   0x31 USBFS_FIFO_0   0x32 USBFS_FIFO_1
 *   0x33 USBFS_INT      0x34 USBFS_RESUME
 *
 * 実機の IRQ コマンドで 4 本とも優先度 12 に並んでいることを確認している
 * （docs/experiment-log.md「割り込み優先度を調べる」）。
 */
static const uint8_t kUsbEvents[] = { 0x31, 0x32, 0x33, 0x34 };

#define USB_IRQ_MAX ((int)(sizeof(kUsbEvents) / sizeof(kUsbEvents[0])))

static int8_t s_irqn[USB_IRQ_MAX];
static int    s_count;
static bool   s_masked;

void usbIrqScan(void)
{
	/* 走査のやり直しに備えて、止めたままにしない */
	usbIrqUnmask();

	s_count = 0;
	for (int i = 0; i < 32 && s_count < USB_IRQ_MAX; i++) {
		uint32_t ev = R_ICU->IELSR[i] & 0xFFu;
		for (int k = 0; k < USB_IRQ_MAX; k++) {
			if (ev == kUsbEvents[k]) {
				s_irqn[s_count++] = (int8_t)i;
				break;
			}
		}
	}
}

int usbIrqCount(void)
{
	return s_count;
}

int usbIrqNumber(int i)
{
	if (i < 0 || i >= s_count) {
		return -1;
	}
	return s_irqn[i];
}

bool usbIrqIsUsb(int irqn)
{
	for (int i = 0; i < s_count; i++) {
		if (s_irqn[i] == irqn) {
			return true;
		}
	}
	return false;
}

void usbIrqMask(void)
{
	if (s_masked || s_count == 0) {
		return;
	}
	for (int i = 0; i < s_count; i++) {
		NVIC_DisableIRQ((IRQn_Type)s_irqn[i]);
	}
	/*
	 * 書き込みが効く前に H の待ちへ入らないようにする。これが無いと
	 * 止めたつもりの直後に 1 本だけ通ることがある。
	 */
	__DSB();
	__ISB();
	s_masked = true;
}

void usbIrqUnmask(void)
{
	if (!s_masked) {
		return;
	}
	for (int i = 0; i < s_count; i++) {
		NVIC_EnableIRQ((IRQn_Type)s_irqn[i]);
	}
	s_masked = false;
}
