#include "capture.h"
#include "config.h"
#include "timing.h"
#include "proto.h"
#include "pwmblock.h"

#include <stdio.h>
#include <string.h>

/* ---- エッジのリングバッファ ------------------------------------------ */

static volatile uint32_t s_ring_t[EDGE_RING];
static volatile uint8_t  s_ring_l[EDGE_RING];
static volatile uint16_t s_head;
static volatile uint16_t s_tail;
static volatile uint32_t s_overflow;

static inline uint8_t readXout(void)
{
	return (uint8_t)((digitalRead(PIN_XOUT) == HIGH ? 1 : 0) ^ g_tim.inv_in);
}

static inline void pushEdge(uint32_t t, uint8_t level)
{
	uint16_t h = s_head;
	uint16_t nxt = (uint16_t)((h + 1) & (EDGE_RING - 1));
	if (nxt == s_tail) {
		s_overflow++;
		return;
	}
	s_ring_t[h] = t;
	s_ring_l[h] = level;
	s_head = nxt;
}

static void xoutIsr(void)
{
	pushEdge(micros(), readXout());
}

static bool popEdge(uint32_t *t, uint8_t *level)
{
	if (s_tail == s_head) {
		return false;
	}
	*t = s_ring_t[s_tail];
	*level = s_ring_l[s_tail];
	s_tail = (uint16_t)((s_tail + 1) & (EDGE_RING - 1));
	return true;
}

static uint8_t s_poll_last;

/*
 * エッジ割り込みの NVIC 番号。attachInterrupt がどの ICU スロットを
 * 使ったかは公開されていないので、IELSR の変化から突き止める。
 * RA4M1 では IELSR のスロット番号がそのまま NVIC の割り込み番号になる。
 */
static int s_edge_irqn = -1;

static int findEdgeIrqn(const uint32_t *before)
{
	for (int i = 0; i < 32; i++) {
		if (R_ICU->IELSR[i] != before[i]) {
			return i;
		}
	}
	return -1;
}

void edgeIrqSnapshot(uint32_t *before)
{
	for (int i = 0; i < 32; i++) {
		before[i] = R_ICU->IELSR[i];
	}
}

/*
 * attachInterrupt の直後に呼ぶ。優先度を g_tim.irq_prio にする。
 *
 * IELSR が変わるのは起動後の最初の 1 回だけ。detachInterrupt を呼んでも
 * スロットの内容は残るため、2 回目以降は差分が出ない。一度見つけた番号を
 * 覚えておかないと 2 回目から優先度が設定されなくなる（実際にこれで
 * 実験を 1 回無駄にした。docs/experiment-log.md の「段階 A」を参照）。
 */
void edgeIrqAfterAttach(const uint32_t *before)
{
	int found = findEdgeIrqn(before);
	if (found >= 0) {
		s_edge_irqn = found;
	}
	if (s_edge_irqn >= 0 && g_tim.irq_prio < 16) {
		NVIC_SetPriority((IRQn_Type)s_edge_irqn, g_tim.irq_prio);
	}
}

static void armEdges(void)
{
	noInterrupts();
	s_head = s_tail = 0;
	s_overflow = 0;
	interrupts();

	s_poll_last = readXout();
	if (g_tim.cap_mode == 0) {
		uint32_t before[32];
		edgeIrqSnapshot(before);
		attachInterrupt(digitalPinToInterrupt(PIN_XOUT), xoutIsr, CHANGE);
		edgeIrqAfterAttach(before);
	}
}

/* 現在のエッジ割り込みの番号と優先度。突き止められなければ prio に 255 */
void captureIrqInfo(int *irqn, uint32_t *prio)
{
	*irqn = s_edge_irqn;
	*prio = (s_edge_irqn >= 0)
	            ? (uint32_t)NVIC_GetPriority((IRQn_Type)s_edge_irqn)
	            : 255u;
}

static void disarmEdges(void)
{
	if (g_tim.cap_mode == 0) {
		detachInterrupt(digitalPinToInterrupt(PIN_XOUT));
	}
}

/* ポーリング方式のときはここでエッジを作る（割り込みが使えない場合の逃げ道） */
static inline void pollEdges(void)
{
	if (g_tim.cap_mode == 0) {
		return;
	}
	uint8_t cur = readXout();
	if (cur != s_poll_last) {
		s_poll_last = cur;
		pushEdge(micros(), cur);
	}
}

void captureBegin(void)
{
	/* PIN_ACK はここでは触らない。ACK コマンドで出力に切り替えることがあり、
	 * 取り込みのたびに入力へ戻してしまうと設定が消えるため */
	pinMode(PIN_XOUT, INPUT);
	pinMode(PIN_BUSY, INPUT);
}

/* ---- PWM の復号 -------------------------------------------------------
 *
 * 復号したバイトは g_store にためこみ、転送が終わってからまとめて吐く。
 *
 * 以前は 32 バイト貯まるたびに `+D` 行を流していた。これは誤りだった。
 * **取り込みの最中に USB へ書くと、その間にエッジ割り込みを取りこぼす。**
 *
 * 2854 バイトの転送（61694 ビット）で実測したところ、87 回の行送出のうち
 * 7 回で 1 ビットずつ欠落した。欠落位置は本体の 32/192/224/352/448/608/768
 * バイト目、すなわち**例外なく 32 バイト境界＝行を吐いた瞬間**だった。
 * 9 ビットの枠が 1 ビットずれるため、そこから先は全部化ける。
 *
 * リングバッファは溢れていない (ovf=0) ので、主ループの遅れではなく
 * **割り込み自体が発火していない**。したがって受信側を速くしても直らず、
 * 取り込み中は一切書かないという方法しかない。
 *
 * 22 バイトの転送では本体の `+D` が 1 回しか出ないので表面化しなかった。
 * データが大きくなって初めて出る種類の不具合である。
 * 経緯は docs/experiment-log.md の「段階 A」を参照。
 *
 * ためこむ上限は BIN_CAPACITY (12 KB)。超えた分は捨てて TRUNCATED として
 * 報告する。PLAY 用の .bin と同じ領域なので、CAP を実行すると
 * LOAD したデータは失われる。
 */

#define CAP_MAX_BLOCKS 4
#define CAP_MAX_MARKS  8

struct BlkRec {
	uint32_t off;          /* g_store 内の開始位置 */
	uint32_t nbytes;       /* パリティ 2 バイトを含む復号済みバイト数 */
	uint32_t data;         /* パリティを除いたバイト数 */
	uint32_t z1, o, z2;    /* 読み飛ばしたヘッダ */
	uint32_t fe, noise;
	uint16_t parity, calc;
	uint8_t  ok;
	uint8_t  trunc;        /* バッファに入りきらなかった */
	uint8_t  streamed;     /* 取り込みながら流した */
};

static PwmDec  s_dec;
static BlkRec  s_blk[CAP_MAX_BLOCKS];
static uint8_t s_blk_index;      /* 1 起点。0 は「まだ無い」 */
static bool    s_blk_open;
static uint32_t s_store_len;     /* g_store に貯めた総バイト数 */
static uint32_t s_dropped;       /* 入りきらずに捨てたバイト数 */
static uint32_t s_mark_us[CAP_MAX_MARKS];

/* 調査用のストリーミング経路で使う行バッファ */
static uint8_t  s_line[32];
static uint8_t  s_line_len;
static uint32_t s_line_off;

static void streamFlushLine(void)
{
	if (s_line_len == 0) {
		return;
	}
	char prefix[24];
	snprintf(prefix, sizeof(prefix), "D %u %04lX ",
	         (unsigned)s_blk_index, (unsigned long)s_line_off);
	emitHexLine(prefix, s_line, s_line_len);
	s_line_off += s_line_len;
	s_line_len = 0;
}

/* このブロックを取り込みながら流すか。blockOpen で決まる */
static bool s_streaming;

static void byteSink(void *ctx, uint8_t v)
{
	(void)ctx;
	if (s_streaming) {
		s_line[s_line_len++] = v;
		if (s_line_len >= sizeof(s_line)) {
			streamFlushLine();
		}
		return;
	}
	if (s_store_len < BIN_CAPACITY) {
		binBuf()[s_store_len++] = v;
	} else {
		s_dropped++;
	}
}

static void blockOpen(void)
{
	pwmDecInit(&s_dec, byteSink, NULL);
	s_line_len = 0;
	s_line_off = 0;
	s_blk_index++;

	/*
	 * このブロックを貯めるか流すかを決める。
	 *
	 * 貯めるほうが安全（取り込み中に一切喋らない）なので既定はそちら。
	 * ただし 12 KB を超えると入りきらないので、その場合だけ流す。
	 * 実機の BASIC 領域は 27286 バイトあり、バッファは RAM の制約から
	 * 13.8 KB までしか増やせない（ヒープ 8 KB とスタック 1 KB が固定）。
	 *
	 * ブロック 2 の大きさは、ブロック 1 に入っている .bin ヘッダの
	 * オフセット 0x12 の 16 ビット（リトルエンディアン）で分かる。
	 * ブロック 1 が閉じたあと PWM2 が始まるまでには 2 秒あるので、
	 * 始まる前に判断できる。
	 */
	if (g_tim.cap_stream == 1) {
		s_streaming = true;
	} else if (g_tim.cap_stream == 2) {
		s_streaming = false;
	} else if (s_blk_index >= 2 && s_store_len >= 20) {
		const uint8_t *h = binBuf();
		uint32_t declared = (uint32_t)h[0x12] | ((uint32_t)h[0x13] << 8);
		uint32_t need = declared + 2;   /* パリティ 2 バイト */
		s_streaming = (s_store_len + need > BIN_CAPACITY);
	} else {
		s_streaming = false;
	}
	s_blk_open = true;
	if (s_blk_index <= CAP_MAX_BLOCKS) {
		BlkRec *r = &s_blk[s_blk_index - 1];
		memset(r, 0, sizeof(*r));
		r->off = s_store_len;
	}
}

static void blockClose(void)
{
	if (!s_blk_open) {
		return;
	}
	s_blk_open = false;
	if (s_streaming) {
		streamFlushLine();
	}
	if (s_blk_index > CAP_MAX_BLOCKS) {
		return;
	}
	BlkRec *r = &s_blk[s_blk_index - 1];
	r->nbytes = s_dec.nbytes;
	r->data   = pwmDecDataBytes(&s_dec);
	r->z1     = s_dec.z1;
	r->o      = s_dec.o;
	r->z2     = s_dec.z2;
	r->fe     = s_dec.fe;
	r->noise  = s_dec.noise;
	r->parity = pwmDecParity(&s_dec);
	r->calc   = pwmDecCalc(&s_dec);
	r->ok     = pwmDecOk(&s_dec) ? 1 : 0;
	r->streamed = s_streaming ? 1 : 0;
	r->trunc  = (!s_streaming && r->off + r->nbytes > BIN_CAPACITY) ? 1 : 0;
}

/* 取り込みが終わってから呼ぶ。ここで初めてシリアルに書く */
static void blockReport(uint32_t marks)
{
	for (uint32_t i = 0; i < marks && i < CAP_MAX_MARKS; i++) {
		emitBlocking('*', "MARK %lu %luus",
		             (unsigned long)(i + 1), (unsigned long)s_mark_us[i]);
	}

	uint8_t n = s_blk_index < CAP_MAX_BLOCKS ? s_blk_index : CAP_MAX_BLOCKS;
	for (uint8_t i = 0; i < n; i++) {
		const BlkRec *r = &s_blk[i];

		/* バッファに実際に残っているぶんだけ吐く */
		uint32_t have = r->nbytes;
		if (r->off >= BIN_CAPACITY) {
			have = 0;
		} else if (r->off + have > BIN_CAPACITY) {
			have = BIN_CAPACITY - r->off;
		}

		emitBlocking('#', "block %u begin", (unsigned)(i + 1));
		if (r->streamed) {
			have = 0;   /* 取り込み中に流し終えている */
		}
		for (uint32_t o = 0; o < have; o += 32) {
			uint32_t k = have - o;
			if (k > 32) {
				k = 32;
			}
			char prefix[24];
			snprintf(prefix, sizeof(prefix), "D %u %04lX ",
			         (unsigned)(i + 1), (unsigned long)o);
			emitHexLine(prefix, binBuf() + r->off + o, k);
		}
		emitBlocking('+', "R %u bytes=%lu data=%lu hdr=%lu/%lu/%lu "
		                  "parity=%04X calc=%04X %s fe=%lu noise=%lu%s",
		             (unsigned)(i + 1),
		             (unsigned long)r->nbytes, (unsigned long)r->data,
		             (unsigned long)r->z1, (unsigned long)r->o,
		             (unsigned long)r->z2,
		             (unsigned)r->parity, (unsigned)r->calc,
		             r->ok ? "OK" : "NG",
		             (unsigned long)r->fe, (unsigned long)r->noise,
		             r->trunc ? " TRUNCATED"
		                      : (r->streamed ? " streamed" : ""));
	}
}

/* ---- 取り込み本体 -----------------------------------------------------
 *
 * 最初の区切りを見てから最後の区切りを見るまでの間は、
 * **進捗も含めてシリアルに一切書かない**（上の説明を参照）。
 */

void captureRun(uint32_t timeout_ms)
{
	uint32_t marks = 0;
	uint32_t bits = 0;
	uint32_t glitches = 0;
	bool started = false;      /* 最初の区切りを見たか */
	bool have_rise = false;
	uint32_t rise_t = 0;
	uint32_t t_first = 0;
	uint32_t last_report = millis();
	uint32_t t_start = millis();
	bool done = false;
	bool aborted = false;

	s_blk_index = 0;
	s_blk_open = false;
	s_store_len = 0;
	s_dropped = 0;
	s_streaming = false;

	captureBegin();
	emitBlocking('#', "cap armed timeout=%lums mode=%s stream=%u",
	             (unsigned long)timeout_ms,
	             g_tim.cap_mode ? "poll" : "irq",
	             (unsigned)g_tim.cap_stream);
	armEdges();
	{
		int irqn;
		uint32_t prio;
		captureIrqInfo(&irqn, &prio);
		emitBlocking('#', "cap irqn=%d prio=%lu", irqn, (unsigned long)prio);
	}

	while (!done) {
		pollEdges();

		uint32_t t;
		uint8_t level;
		while (popEdge(&t, &level)) {
			if (level) {
				rise_t = t;
				have_rise = true;
				continue;
			}
			if (!have_rise) {
				continue;   /* 立ち上がりを見ていない立ち下がりは捨てる */
			}
			have_rise = false;

			uint32_t width = t - rise_t;
			if (width <= g_tim.cap_glitch_us) {
				glitches++;
				continue;
			}

			if (width >= g_tim.cap_mark_us) {
				marks++;
				if (!started) {
					started = true;
					t_first = millis();
					/* 転送が始まったことだけは知らせる。
					 * ここは PULSES1 の区切りの直後で、このあと
					 * 約 8 秒の L が続くことが波形の構成から保証
					 * されている（他の区切りの後は 6〜24 ms しか
					 * 無いので同じことはできない）。
					 * これが無いと、進捗表示が止まったのが
					 * 「始まった」のか「何も来ていない」のか
					 * ホストから区別できない。 */
					emit('#', "cap begin mark=%luus", (unsigned long)width);
				}
				blockClose();
				if (marks <= CAP_MAX_MARKS) {
					s_mark_us[marks - 1] = width;
				}
				if (marks >= 4) {
					done = true;
					break;
				}
				continue;
			}

			if (!started) {
				continue;   /* 転送の途中から拾ったビットは信用できない */
			}
			bits++;
			if (!s_blk_open) {
				blockOpen();
			}
			pwmDecBit(&s_dec, width < g_tim.cap_bit_us ? 0 : 1);
		}

		if (done) {
			break;
		}

		if (abortRequested()) {
			aborted = true;
			break;
		}
		if (millis() - t_start >= timeout_ms) {
			break;
		}
		/*
		 * 進捗。転送中も出すかどうかは方式で決まる。
		 *
		 * capstream=2（常に貯める）だけは転送中に一切書かない。
		 * それ以外は `+D` を流している以上ここで黙る意味が無く、
		 * PULSES1 の 8 秒や PWM1 のヘッダ 3.3 秒は `+D` が出ないので、
		 * ホスト側に進捗を見せるにはこの 1 秒ごとの行が要る。
		 */
		if (millis() - last_report >= 1000) {
			last_report = millis();
			if (!started) {
				emit('*', "CAP waiting %lus",
				     (unsigned long)((millis() - t_start) / 1000));
			} else if (g_tim.cap_stream != 2) {
				/* bytes はブロックごとの累計なので blk と対で読むこと */
				emit('*', "CAP marks=%lu bits=%lu blk=%u bytes=%lu",
				     (unsigned long)marks, (unsigned long)bits,
				     (unsigned)s_blk_index,
				     (unsigned long)(s_line_off + s_line_len));
			}
		}
	}

	disarmEdges();
	blockClose();

	uint32_t elapsed = started ? (millis() - t_first) : 0;

	blockReport(marks);

	const char *status = aborted ? "aborted" : (marks >= 4 ? "ok" : "timeout");
	emitBlocking('+', "DONE marks=%lu bits=%lu blocks=%u glitch=%lu ovf=%lu "
	                  "dropped=%lu ms=%lu status=%s",
	             (unsigned long)marks, (unsigned long)bits,
	             (unsigned)s_blk_index, (unsigned long)glitches,
	             (unsigned long)s_overflow, (unsigned long)s_dropped,
	             (unsigned long)elapsed, status);
	emitBlocking('+', "OK");
	abortClear();
}

/* ---- 生のエッジ列 ----------------------------------------------------- */

void rawRun(uint32_t timeout_ms, uint32_t max_edges)
{
	if (max_edges == 0 || max_edges > RAW_CAPACITY) {
		max_edges = RAW_CAPACITY;
	}

	uint32_t *buf = rawBuf();
	uint32_t count = 0;
	uint32_t prev_t = 0;
	bool have_prev = false;
	uint32_t t_start = millis();
	bool aborted = false;

	captureBegin();
	armEdges();
	emitBlocking('#', "raw armed timeout=%lums max=%lu mode=%s",
	             (unsigned long)timeout_ms, (unsigned long)max_edges,
	             g_tim.cap_mode ? "poll" : "irq");

	while (count < max_edges) {
		pollEdges();

		uint32_t t;
		uint8_t level;
		while (count < max_edges && popEdge(&t, &level)) {
			if (have_prev) {
				uint32_t d = t - prev_t;
				if (d > 0x7FFFFFFFUL) {
					d = 0x7FFFFFFFUL;
				}
				/* 直前の区間の「レベル」は今のレベルの反対 */
				uint32_t lv = level ? 0u : 1u;
				buf[count++] = (lv << 31) | d;
			}
			prev_t = t;
			have_prev = true;
		}

		if (abortRequested()) {
			aborted = true;
			break;
		}
		if (millis() - t_start >= timeout_ms) {
			break;
		}
	}

	disarmEdges();

	for (uint32_t i = 0; i < count; i++) {
		emitBlocking('+', "E %lu %lu %lu", (unsigned long)i,
		             (unsigned long)(buf[i] >> 31),
		             (unsigned long)(buf[i] & 0x7FFFFFFFUL));
	}
	emitBlocking('+', "DONE edges=%lu ovf=%lu status=%s", (unsigned long)count,
	             (unsigned long)s_overflow, aborted ? "aborted" : "ok");
	emitBlocking('+', "OK");
	abortClear();
}

void pinsReport(const char *xin_state)
{
	captureBegin();
	emitBlocking('+', "PINS xout=%u busy=%u ack=%u xin=%s",
	             (unsigned)readXout(),
	             (unsigned)(digitalRead(PIN_BUSY) == HIGH ? 1 : 0),
	             (unsigned)(digitalRead(PIN_ACK) == HIGH ? 1 : 0),
	             xin_state);
}
