/*
	SHARP POCKET COMPUTER PC-G850/G815/E200 Emulator g800.js
*/

/* エミュレートの対象: PC-G801/PC-G802/PC-G803/PC-G805/PC-G811/PC-G813/PC-G820/PC-G830/PC-E200/PC-E220 */
var MACHINE_E200 = 0;

/* エミュレートの対象: PC-G815 */
var MACHINE_G815 = 1;

/* エミュレートの対象: PC-G850/PC-G850S/PC-G850V/PC-G850VS */
var MACHINE_G850 = 2;

/* キー割り込み */
var INTERRUPT_IA = 0x01;

/* キー割り込み */
var INTERRUPT_KON = 0x02;

/* タイマ割り込み */
var INTERRUPT_1S = 0x04;

/* 11ピン割り込み */
var INTERRUPT_INT1 = 0x08;

/* キーコード: なし */
var GKEY_NONE = 0x00;

/* キーコード: OFFキー */
var GKEY_OFF = 0x01;

/* キーコード: Qキー */
var GKEY_Q = 0x02;

/* キーコード: Wキー */
var GKEY_W = 0x03;

/* キーコード: Eキー */
var GKEY_E = 0x04;

/* キーコード: Rキー */
var GKEY_R = 0x05;

/* キーコード: Tキー */
var GKEY_T = 0x06;

/* キーコード: Yキー */
var GKEY_Y = 0x07;

/* キーコード: Uキー */
var GKEY_U = 0x08;

/* キーコード: Aキー */
var GKEY_A = 0x09;

/* キーコード: Sキー */
var GKEY_S = 0x0a;

/* キーコード: Dキー */
var GKEY_D = 0x0b;

/* キーコード: Fキー */
var GKEY_F = 0x0c;

/* キーコード: Gキー */
var GKEY_G = 0x0d;

/* キーコード: Hキー */
var GKEY_H = 0x0e;

/* キーコード: Jキー */
var GKEY_J = 0x0f;

/* キーコード: Kキー */
var GKEY_K = 0x10;

/* キーコード: Zキー */
var GKEY_Z = 0x11;

/* キーコード: Xキー */
var GKEY_X = 0x12;

/* キーコード: Cキー */
var GKEY_C = 0x13;

/* キーコード: Vキー */
var GKEY_V = 0x14;

/* キーコード: Bキー */
var GKEY_B = 0x15;

/* キーコード: Nキー */
var GKEY_N = 0x16;

/* キーコード: Mキー */
var GKEY_M = 0x17;

/* キーコード: ,キー */
var GKEY_COMMA = 0x18;

/* キーコード: BASICキー */
var GKEY_BASIC = 0x19;

/* キーコード: TEXTキー */
var GKEY_TEXT = 0x1a;

/* キーコード: CAPSキー */
var GKEY_CAPS = 0x1b;

/* キーコード: カナキー */
var GKEY_KANA = 0x1c;

/* キーコード: TABキー */
var GKEY_TAB = 0x1d;

/* キーコード: SPACEキー */
var GKEY_SPACE = 0x1e;

/* キーコード: ↓キー */
var GKEY_DOWN = 0x1f;

/* キーコード: ↑キー */
var GKEY_UP = 0x20;

/* キーコード: ←キー */
var GKEY_LEFT = 0x21;

/* キーコード: →キー */
var GKEY_RIGHT = 0x22;

/* キーコード: ANSキー */
var GKEY_ANS = 0x23;

/* キーコード: 0キー */
var GKEY_0 = 0x24;

/* キーコード: .キー */
var GKEY_PERIOD = 0x25;

/* キーコード: =キー */
var GKEY_EQUAL = 0x26;

/* キーコード: +キー */
var GKEY_PLUS = 0x27;

/* キーコード: RETURNキー */
var GKEY_RETURN = 0x28;

/* キーコード: Lキー */
var GKEY_L = 0x29;

/* キーコード: ;キー */
var GKEY_SEMICOLON = 0x2a;

/* キーコード: CONSTキー */
var GKEY_CONST = 0x2b;

/* キーコード: 1キー */
var GKEY_1 = 0x2c;

/* キーコード: 2キー */
var GKEY_2 = 0x2d;

/* キーコード: 3キー */
var GKEY_3 = 0x2e;

/* キーコード: -キー */
var GKEY_MINUS = 0x2f;

/* キーコード: M+キー */
var GKEY_MPLUS = 0x30;

/* キーコード: Iキー */
var GKEY_I = 0x31;

/* キーコード: Oキー */
var GKEY_O = 0x32;

/* キーコード: INSキー */
var GKEY_INSERT = 0x33;

/* キーコード: 4キー */
var GKEY_4 = 0x34;

/* キーコード: 5キー */
var GKEY_5 = 0x35;

/* キーコード: 6キー */
var GKEY_6 = 0x36;

/* キーコード: *キー */
var GKEY_ASTER = 0x37;

/* キーコード: R・CMキー */
var GKEY_RCM = 0x38;

/* キーコード: Pキー */
var GKEY_P = 0x39;

/* キーコード: BSキー */
var GKEY_BACKSPACE = 0x3a;

/* キーコード: πキー */
var GKEY_PI = 0x3b;

/* キーコード: 7キー */
var GKEY_7 = 0x3c;

/* キーコード: 8キー */
var GKEY_8 = 0x3d;

/* キーコード: 9キー */
var GKEY_9 = 0x3e;

/* キーコード: /キー */
var GKEY_SLASH = 0x3f;

/* キーコード: )キー */
var GKEY_RKAKKO = 0x40;

/* キーコード: nPrキー */
var GKEY_NPR = 0x41;

/* キーコード: →DEGキー */
var GKEY_DEG = 0x42;

/* キーコード: √キー */
var GKEY_SQR = 0x43;

/* キーコード: x^2キー */
var GKEY_SQU = 0x44;

/* キーコード: ^キー */
var GKEY_HAT = 0x45;

/* キーコード: (キー */
var GKEY_LKAKKO = 0x46;

/* キーコード: 1/xキー */
var GKEY_RCP = 0x47;

/* キーコード: MDFキー */
var GKEY_MDF = 0x48;

/* キーコード: 2ndFキー */
var GKEY_2NDF = 0x49;

/* キーコード: sinキー */
var GKEY_SIN = 0x4a;

/* キーコード: cosキー */
var GKEY_COS = 0x4b;

/* キーコード: lnキー */
var GKEY_LN = 0x4c;

/* キーコード: logキー */
var GKEY_LOG = 0x4d;

/* キーコード: tanキー */
var GKEY_TAN = 0x4e;

/* キーコード: F←→Eキー */
var GKEY_FE = 0x4f;

/* キーコード: CLSキー */
var GKEY_CLS = 0x50;

/* キーコード: ONキー */
var GKEY_BREAK = 0x51;

/* キーコード: 同時押し */
var GKEY_DOUBLE = 0x52;

/* 仮想キーコード: SHIFTキー */
var GKEY_SHIFT = 0xfe;

/* 仮想キーコード: RESETキー */
var GKEY_RESET = 0xff;

/* 仮想キーコード: : キー */
var GKEY_COLON = new Uint8Array([GKEY_SHIFT,GKEY_SEMICOLON]);

/* エミュレートする機種 */
var machine;

/* CPUクロック周波数 */
var clocks;

/* VRAM横ドット数 */
var vramWidth;

/* VRAM縦文字数 */
var vramRows;

/* VRAM横文字数 */
var vramCols;

/* 1文字横ドット数 */
var cellWidth;

/* VRAM高さ */
var vramHeight;

/* LCD横ドット数 */
var lcdWidth;

/* LCD縦ドット数 */
var lcdHeight;

/* LCD横文字数 */
var lcdCols;

/* LCD縦文字数 */
var lcdRows;

/* RAM */
var ram = new Uint8Array(0x8000);

/* ROM */
var rom = new Array();

/* 現在のRAMページ番号 */
var ramBank = 0;

/* ROMの総ページ数 */
var romBanks = 0x15;

/* 現在のROMページ番号 */
var romBank = 0;

/* 現在のEXROMページ番号 */
var exBank = 0;

/* 割り込み要因 */
var interruptType = 0;

/* 割り込みマスク */
var interruptMask = 0;

/* タイマ */
var timer = 0;

/* タイマカウンタ */
var timerCount = 0;

/* タイマ周期 (usec) */
var timerInterval;

/* キーストローブ */
var keyStrobe;

/* 最後に設定したキーストローブ */
var keyStrobeLast;

/* キー状態 */
var keyMatrix = new Uint8Array(10);

/* ONキー状態 */
var keyBreak = 0;

/* シフトキー状態 */
var keyShift = 0;

/* リセットボタン状態 */
var keyReset = false;

/* キー割り込みを発生させるか? */
var intIA = false;

/* キー割り込みを発生させるか? */
var intKON = false;

/* キーストローブを設定したときの累積ステート数 */
var keyStrobeLastStates = 0;

/* キーストローブがクリアされるステート数 */
var keyStrobeClearStates = 130;

/* LCD 横アドレス */
var lcdX = 0;

/* LCD 縦アドレス */
var lcdY = 0;

/* LCD 横アドレス2 (PC-G815) */
var lcdX2 = 0;

/* 縦アドレス2 (PC-G815) */
var lcdY2 = 0;

/* 表示開始アドレス(PC-E200/PC-G815) */
var lcdBegin = 0;

/* LCD OFF(PC-G850) */
var lcdDisabled = false;

/* 表示開始位置 */
var lcdTop = 0;

/* コントラスト(PC-G850) */
var lcdContrast;

/* ミラーモード(PC-G850) */
var lcdEffectMirror = false;

/* 黒塗りつぶし(PC-G850) */
var lcdEffectBlack = false;

/* 反転(PC-G850) */
var lcdEffectReverse = false;

/* LCD電圧増加(PC-G850) */
var lcdEffectDark = false;

/* 白塗りつぶし(PC-G850) */
var lcdEffectWhite = false;

/* トリム(PC-G850) */
var lcdTrim = 0;

/* RWディファイモード(PC-G850) */
var lcdMod = false;

/* 読取可か? */
var lcdRead = false;

/* VRAM */
var vram;

/* 最後に押したキー */
var lastKey = 0;

/* 1秒あたりの画面の更新回数(更新周期) */
var fps;

/* 1秒あたりの画面の更新回数(倍数) */
var fpsN;

/* 波形 */
var wave;

/* ブザー出力ONの値 */
var waveOn;

/* ブザー出力OFFの値 */
var waveOff;

/* SIO をテキスト窓にキャプチャするかどうか (true 時、RUN の開始が若干遅くなる) */
var siocapture = false;

/* ブレークイネーブル */
var bken = false;
var fetch = false;

/* フォント */
var font = new Uint8Array([
	0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
	0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
	0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
	0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
	0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
	0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
	0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
	0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
	0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
	0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
	0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
	0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
	0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
	0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
	0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
	0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
	0x7f, 0x7f, 0x7f, 0x7f, 0x7f, 0x00,
	0x55, 0x2a, 0x55, 0x2a, 0x55, 0x00,
	0x2a, 0x55, 0x2a, 0x55, 0x2a, 0x00,
	0x1c, 0x1c, 0x3e, 0x1c, 0x08, 0x00,
	0x10, 0x38, 0x54, 0x10, 0x1f, 0x00,
	0x12, 0x19, 0x15, 0x12, 0x00, 0x00,
	0x15, 0x15, 0x15, 0x0a, 0x00, 0x00,
	0x45, 0x29, 0x11, 0x29, 0x45, 0x00,
	0x0d, 0x51, 0x51, 0x51, 0x3d, 0x00,
	0x41, 0x63, 0x55, 0x49, 0x41, 0x00,
	0x30, 0x48, 0x44, 0x3c, 0x04, 0x00,
	0x00, 0x04, 0x03, 0x00, 0x00, 0x00,
	0x08, 0x08, 0x2a, 0x1c, 0x08, 0x00,
	0x08, 0x1c, 0x2a, 0x08, 0x08, 0x00,
	0x04, 0x02, 0x7f, 0x02, 0x04, 0x00,
	0x10, 0x20, 0x7f, 0x20, 0x10, 0x00,
	0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
	0x00, 0x00, 0x5f, 0x00, 0x00, 0x00,
	0x05, 0x03, 0x05, 0x03, 0x00, 0x00,
	0x22, 0x7f, 0x22, 0x7f, 0x22, 0x00,
	0x24, 0x2a, 0x7f, 0x2a, 0x12, 0x00,
	0x23, 0x13, 0x08, 0x64, 0x62, 0x00,
	0x30, 0x4e, 0x59, 0x26, 0x50, 0x00,
	0x00, 0x01, 0x05, 0x03, 0x00, 0x00,
	0x00, 0x00, 0x1c, 0x22, 0x41, 0x00,
	0x41, 0x22, 0x1c, 0x00, 0x00, 0x00,
	0x14, 0x08, 0x3e, 0x08, 0x14, 0x00,
	0x08, 0x08, 0x3e, 0x08, 0x08, 0x00,
	0x50, 0x30, 0x00, 0x00, 0x00, 0x00,
	0x08, 0x08, 0x08, 0x08, 0x08, 0x00,
	0x60, 0x60, 0x00, 0x00, 0x00, 0x00,
	0x20, 0x10, 0x08, 0x04, 0x02, 0x00,
	0x3e, 0x51, 0x49, 0x45, 0x3e, 0x00,
	0x00, 0x42, 0x7f, 0x40, 0x00, 0x00,
	0x62, 0x51, 0x49, 0x49, 0x46, 0x00,
	0x22, 0x49, 0x49, 0x49, 0x36, 0x00,
	0x18, 0x14, 0x12, 0x7f, 0x10, 0x00,
	0x2f, 0x45, 0x45, 0x45, 0x39, 0x00,
	0x3e, 0x49, 0x49, 0x49, 0x32, 0x00,
	0x01, 0x61, 0x19, 0x05, 0x03, 0x00,
	0x36, 0x49, 0x49, 0x49, 0x36, 0x00,
	0x26, 0x49, 0x49, 0x49, 0x3e, 0x00,
	0x00, 0x36, 0x36, 0x00, 0x00, 0x00,
	0x00, 0x56, 0x36, 0x00, 0x00, 0x00,
	0x00, 0x08, 0x14, 0x22, 0x41, 0x00,
	0x14, 0x14, 0x14, 0x14, 0x14, 0x00,
	0x00, 0x41, 0x22, 0x14, 0x08, 0x00,
	0x02, 0x01, 0x59, 0x09, 0x06, 0x00,
	0x3e, 0x41, 0x5d, 0x55, 0x2e, 0x00,
	0x60, 0x1c, 0x13, 0x1c, 0x60, 0x00,
	0x7f, 0x49, 0x49, 0x49, 0x36, 0x00,
	0x1c, 0x22, 0x41, 0x41, 0x22, 0x00,
	0x7f, 0x41, 0x41, 0x22, 0x1c, 0x00,
	0x7f, 0x49, 0x49, 0x49, 0x41, 0x00,
	0x7f, 0x09, 0x09, 0x09, 0x01, 0x00,
	0x1c, 0x22, 0x41, 0x49, 0x3a, 0x00,
	0x7f, 0x08, 0x08, 0x08, 0x7f, 0x00,
	0x00, 0x41, 0x7f, 0x41, 0x00, 0x00,
	0x20, 0x40, 0x40, 0x40, 0x3f, 0x00,
	0x7f, 0x08, 0x14, 0x22, 0x41, 0x00,
	0x7f, 0x40, 0x40, 0x40, 0x40, 0x00,
	0x7f, 0x04, 0x18, 0x04, 0x7f, 0x00,
	0x7f, 0x04, 0x08, 0x10, 0x7f, 0x00,
	0x3e, 0x41, 0x41, 0x41, 0x3e, 0x00,
	0x7f, 0x09, 0x09, 0x09, 0x06, 0x00,
	0x3e, 0x41, 0x51, 0x21, 0x5e, 0x00,
	0x7f, 0x09, 0x19, 0x29, 0x46, 0x00,
	0x26, 0x49, 0x49, 0x49, 0x32, 0x00,
	0x01, 0x01, 0x7f, 0x01, 0x01, 0x00,
	0x3f, 0x40, 0x40, 0x40, 0x3f, 0x00,
	0x03, 0x1c, 0x60, 0x1c, 0x03, 0x00,
	0x0f, 0x70, 0x0f, 0x70, 0x0f, 0x00,
	0x41, 0x36, 0x08, 0x36, 0x41, 0x00,
	0x01, 0x06, 0x78, 0x06, 0x01, 0x00,
	0x61, 0x51, 0x49, 0x45, 0x43, 0x00,
	0x00, 0x00, 0x7f, 0x41, 0x41, 0x00,
	0x15, 0x16, 0x7c, 0x16, 0x15, 0x00,
	0x41, 0x41, 0x7f, 0x00, 0x00, 0x00,
	0x00, 0x02, 0x01, 0x02, 0x00, 0x00,
	0x40, 0x40, 0x40, 0x40, 0x40, 0x00,
	0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
	0x00, 0x20, 0x54, 0x54, 0x78, 0x00,
	0x00, 0x7f, 0x44, 0x44, 0x38, 0x00,
	0x00, 0x38, 0x44, 0x44, 0x28, 0x00,
	0x00, 0x38, 0x44, 0x44, 0x7f, 0x00,
	0x00, 0x38, 0x54, 0x54, 0x18, 0x00,
	0x00, 0x04, 0x7e, 0x05, 0x01, 0x00,
	0x00, 0x08, 0x54, 0x54, 0x3c, 0x00,
	0x00, 0x7f, 0x04, 0x04, 0x78, 0x00,
	0x00, 0x00, 0x7d, 0x00, 0x00, 0x00,
	0x00, 0x40, 0x40, 0x3d, 0x00, 0x00,
	0x00, 0x7f, 0x10, 0x28, 0x44, 0x00,
	0x00, 0x01, 0x7f, 0x00, 0x00, 0x00,
	0x7c, 0x04, 0x78, 0x04, 0x78, 0x00,
	0x00, 0x7c, 0x04, 0x04, 0x78, 0x00,
	0x00, 0x38, 0x44, 0x44, 0x38, 0x00,
	0x00, 0x7c, 0x14, 0x14, 0x08, 0x00,
	0x00, 0x08, 0x14, 0x14, 0x7c, 0x00,
	0x00, 0x7c, 0x08, 0x04, 0x04, 0x00,
	0x00, 0x48, 0x54, 0x54, 0x24, 0x00,
	0x00, 0x04, 0x3f, 0x44, 0x44, 0x00,
	0x00, 0x3c, 0x40, 0x40, 0x7c, 0x00,
	0x00, 0x3c, 0x40, 0x20, 0x1c, 0x00,
	0x1c, 0x60, 0x1c, 0x60, 0x1c, 0x00,
	0x00, 0x6c, 0x10, 0x10, 0x6c, 0x00,
	0x00, 0x4c, 0x50, 0x20, 0x1c, 0x00,
	0x00, 0x44, 0x64, 0x54, 0x4c, 0x00,
	0x00, 0x08, 0x36, 0x41, 0x41, 0x00,
	0x00, 0x00, 0x7f, 0x00, 0x00, 0x00,
	0x41, 0x41, 0x36, 0x08, 0x00, 0x00,
	0x08, 0x04, 0x08, 0x10, 0x08, 0x00,
	0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
	0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
	0x40, 0x40, 0x40, 0x40, 0x40, 0x00,
	0x60, 0x60, 0x60, 0x60, 0x60, 0x00,
	0x70, 0x70, 0x70, 0x70, 0x70, 0x00,
	0x78, 0x78, 0x78, 0x78, 0x78, 0x00,
	0x7c, 0x7c, 0x7c, 0x7c, 0x7c, 0x00,
	0x7e, 0x7e, 0x7e, 0x7e, 0x7e, 0x00,
	0x7f, 0x7f, 0x7f, 0x7f, 0x7f, 0x00,
	0x7f, 0x00, 0x00, 0x00, 0x00, 0x00,
	0x7f, 0x7f, 0x00, 0x00, 0x00, 0x00,
	0x7f, 0x7f, 0x7f, 0x00, 0x00, 0x00,
	0x7f, 0x7f, 0x7f, 0x7f, 0x00, 0x00,
	0x7f, 0x7f, 0x7f, 0x7f, 0x7f, 0x00,
	0x7f, 0x7f, 0x7f, 0x7f, 0x7f, 0x00,
	0x7f, 0x7f, 0x7f, 0x7f, 0x7f, 0x00,
	0x08, 0x08, 0x7f, 0x08, 0x08, 0x00,
	0x08, 0x08, 0x0f, 0x08, 0x08, 0x00,
	0x08, 0x08, 0x78, 0x08, 0x08, 0x00,
	0x08, 0x08, 0x7f, 0x00, 0x00, 0x00,
	0x00, 0x00, 0x7f, 0x08, 0x08, 0x00,
	0x01, 0x01, 0x01, 0x01, 0x01, 0x00,
	0x08, 0x08, 0x08, 0x08, 0x08, 0x00,
	0x00, 0x00, 0x7f, 0x00, 0x00, 0x00,
	0x00, 0x00, 0x00, 0x00, 0x7f, 0x00,
	0x00, 0x00, 0x78, 0x08, 0x08, 0x00,
	0x08, 0x08, 0x78, 0x00, 0x00, 0x00,
	0x00, 0x00, 0x0f, 0x08, 0x08, 0x00,
	0x08, 0x08, 0x0f, 0x00, 0x00, 0x00,
	0x00, 0x00, 0x70, 0x08, 0x08, 0x00,
	0x08, 0x08, 0x70, 0x00, 0x00, 0x00,
	0x00, 0x00, 0x07, 0x08, 0x08, 0x00,
	0x08, 0x08, 0x07, 0x00, 0x00, 0x00,
	0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
	0x20, 0x50, 0x20, 0x00, 0x00, 0x00,
	0x00, 0x00, 0x1e, 0x02, 0x02, 0x00,
	0x40, 0x40, 0x78, 0x00, 0x00, 0x00,
	0x20, 0x40, 0x00, 0x00, 0x00, 0x00,
	0x00, 0x18, 0x18, 0x00, 0x00, 0x00,
	0x02, 0x4a, 0x4a, 0x2a, 0x1e, 0x00,
	0x04, 0x44, 0x3c, 0x14, 0x0c, 0x00,
	0x20, 0x20, 0x10, 0x78, 0x04, 0x00,
	0x18, 0x48, 0x4c, 0x28, 0x18, 0x00,
	0x40, 0x48, 0x78, 0x48, 0x40, 0x00,
	0x28, 0x28, 0x58, 0x7c, 0x08, 0x00,
	0x08, 0x1c, 0x68, 0x08, 0x18, 0x00,
	0x40, 0x48, 0x48, 0x78, 0x40, 0x00,
	0x00, 0x44, 0x54, 0x54, 0x7c, 0x00,
	0x18, 0x40, 0x58, 0x20, 0x18, 0x00,
	0x04, 0x08, 0x08, 0x08, 0x08, 0x00,
	0x01, 0x41, 0x3d, 0x09, 0x07, 0x00,
	0x10, 0x10, 0x08, 0x7c, 0x03, 0x00,
	0x06, 0x42, 0x43, 0x22, 0x1e, 0x00,
	0x20, 0x22, 0x3e, 0x22, 0x20, 0x00,
	0x22, 0x12, 0x4a, 0x7f, 0x02, 0x00,
	0x42, 0x32, 0x0f, 0x42, 0x7e, 0x00,
	0x12, 0x12, 0x7f, 0x12, 0x12, 0x00,
	0x44, 0x43, 0x22, 0x12, 0x0e, 0x00,
	0x04, 0x03, 0x42, 0x3e, 0x02, 0x00,
	0x42, 0x42, 0x42, 0x42, 0x7e, 0x00,
	0x02, 0x4f, 0x22, 0x1f, 0x02, 0x00,
	0x45, 0x4a, 0x20, 0x10, 0x0c, 0x00,
	0x42, 0x22, 0x12, 0x2a, 0x46, 0x00,
	0x04, 0x3f, 0x44, 0x54, 0x4c, 0x00,
	0x01, 0x46, 0x20, 0x18, 0x06, 0x00,
	0x48, 0x44, 0x2b, 0x12, 0x0e, 0x00,
	0x08, 0x4a, 0x3e, 0x09, 0x08, 0x00,
	0x0e, 0x40, 0x4e, 0x20, 0x1e, 0x00,
	0x04, 0x45, 0x3d, 0x05, 0x04, 0x00,
	0x00, 0x7f, 0x08, 0x10, 0x00, 0x00,
	0x04, 0x44, 0x3f, 0x04, 0x04, 0x00,
	0x20, 0x22, 0x22, 0x22, 0x20, 0x00,
	0x42, 0x4a, 0x2a, 0x1a, 0x26, 0x00,
	0x22, 0x12, 0x7b, 0x16, 0x22, 0x00,
	0x40, 0x20, 0x18, 0x07, 0x00, 0x00,
	0x60, 0x1c, 0x00, 0x0e, 0x70, 0x00,
	0x3f, 0x48, 0x48, 0x44, 0x44, 0x00,
	0x02, 0x42, 0x22, 0x12, 0x0e, 0x00,
	0x08, 0x04, 0x08, 0x10, 0x20, 0x00,
	0x34, 0x04, 0x7f, 0x04, 0x34, 0x00,
	0x02, 0x12, 0x32, 0x4a, 0x06, 0x00,
	0x00, 0x21, 0x25, 0x4a, 0x42, 0x00,
	0x60, 0x58, 0x47, 0x20, 0x40, 0x00,
	0x40, 0x44, 0x24, 0x18, 0x27, 0x00,
	0x08, 0x09, 0x3f, 0x49, 0x48, 0x00,
	0x02, 0x0f, 0x72, 0x0a, 0x06, 0x00,
	0x20, 0x22, 0x22, 0x3e, 0x20, 0x00,
	0x42, 0x4a, 0x4a, 0x4a, 0x7e, 0x00,
	0x04, 0x45, 0x45, 0x25, 0x1c, 0x00,
	0x0f, 0x00, 0x40, 0x20, 0x1f, 0x00,
	0x40, 0x3c, 0x00, 0x7e, 0x20, 0x00,
	0x00, 0x7e, 0x40, 0x20, 0x10, 0x00,
	0x7e, 0x42, 0x42, 0x42, 0x7e, 0x00,
	0x06, 0x42, 0x42, 0x22, 0x1e, 0x00,
	0x41, 0x42, 0x20, 0x10, 0x0c, 0x00,
	0x01, 0x02, 0x01, 0x02, 0x00, 0x00,
	0x02, 0x05, 0x02, 0x00, 0x00, 0x00,
	0x14, 0x14, 0x14, 0x14, 0x14, 0x00,
	0x00, 0x00, 0x7f, 0x14, 0x14, 0x00,
	0x14, 0x14, 0x7f, 0x14, 0x14, 0x00,
	0x14, 0x14, 0x7f, 0x00, 0x00, 0x00,
	0x60, 0x70, 0x78, 0x7c, 0x7e, 0x00,
	0x7e, 0x7c, 0x78, 0x70, 0x60, 0x00,
	0x03, 0x07, 0x0f, 0x1f, 0x3f, 0x00,
	0x3f, 0x1f, 0x0f, 0x07, 0x03, 0x00,
	0x1c, 0x5e, 0x7f, 0x5e, 0x1c, 0x00,
	0x1e, 0x3f, 0x7c, 0x3f, 0x1e, 0x00,
	0x1c, 0x3e, 0x7f, 0x3e, 0x1c, 0x00,
	0x1c, 0x4b, 0x7f, 0x4b, 0x1c, 0x00,
	0x3e, 0x7f, 0x7f, 0x7f, 0x3e, 0x00,
	0x3e, 0x41, 0x41, 0x41, 0x3e, 0x00,
	0x20, 0x10, 0x08, 0x04, 0x02, 0x00,
	0x02, 0x04, 0x08, 0x10, 0x20, 0x00,
	0x22, 0x14, 0x08, 0x14, 0x22, 0x00,
	0x7f, 0x09, 0x0f, 0x49, 0x7f, 0x00,
	0x24, 0x3b, 0x2a, 0x7e, 0x2a, 0x00,
	0x40, 0x3f, 0x15, 0x55, 0x7f, 0x00,
	0x7f, 0x49, 0x49, 0x49, 0x7f, 0x00,
	0x3e, 0x3e, 0x2a, 0x4f, 0x7a, 0x00,
	0x44, 0x3b, 0x48, 0x7b, 0x04, 0x00,
	0x35, 0x7f, 0x46, 0x2f, 0x14, 0x00,
	0x04, 0x03, 0x04, 0x03, 0x00, 0x00,
	0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
	0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
	0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
	0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
	0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
	0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
	0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
	0x00, 0x00, 0x00, 0x00, 0x00, 0x00
]);

/* PC-G800のキーコードからASCIIコード変換への変換 (大文字) */
var gkeyToAsciiUpper = new Uint8Array([
	0x00, 0x06, 0x51, 0x57, 0x45, 0x52, 0x54, 0x59,
	0x55, 0x41, 0x53, 0x44, 0x46, 0x47, 0x48, 0x4a,
	0x4b, 0x5a, 0x58, 0x43, 0x56, 0x42, 0x4e, 0x4d,
	0x2c, 0x01, 0x02, 0x14, 0x11, 0x0a, 0x20, 0x1f,
	0x1e, 0x1d, 0x1c, 0x15, 0x30, 0x2e, 0x3d, 0x2b,
	0x0d, 0x4c, 0x3b, 0x17, 0x31, 0x32, 0x33, 0x2d,
	0x1a, 0x49, 0x4f, 0x12, 0x34, 0x35, 0x36, 0x2a,
	0x19, 0x50, 0x08, 0xfe, 0x37, 0x38, 0x39, 0x2f,
	0x29, 0xfe, 0xfe, 0xfe, 0xfe, 0x3e, 0x28, 0xfe,
	0xfe, 0x10, 0xfe, 0xfe, 0xfe, 0xfe, 0xfe, 0x0f,
	0x0c, 0x05, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
	0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
	0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
	0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
	0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
	0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
	0x00, 0x06, 0x21, 0x22, 0x23, 0x24, 0x25, 0x26,
	0x27, 0x5b, 0x5d, 0x7b, 0x7d, 0x5c, 0x7c, 0x7e,
	0x5f, 0xfe, 0xfe, 0xfe, 0xfe, 0xfe, 0xfe, 0xfe,
	0x3f, 0xf0, 0x03, 0x14, 0x11, 0x0a, 0x20, 0x1f,
	0x1e, 0x1d, 0x1c, 0xf2, 0x30, 0x13, 0x45, 0x2b,
	0x07, 0x3d, 0x3a, 0x18, 0x31, 0x32, 0x33, 0x16,
	0x1b, 0x3c, 0x3e, 0x09, 0x34, 0x35, 0x36, 0x2a,
	0x19, 0x40, 0x08, 0xfe, 0xdf, 0x27, 0xf8, 0x2f,
	0xf1, 0xfe, 0xfe, 0xfe, 0xfe, 0xfe, 0xfe, 0xfe,
	0x04, 0x10, 0xfe, 0xfe, 0xfe, 0xfe, 0xfe, 0x0e,
	0x0b, 0x05, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
	0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
	0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
	0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00
]);

/* PC-G800のキーコードからASCIIコード変換への変換 (小文字) */
var gkeyToAsciiLower = new Uint8Array([
	0x00, 0x06, 0x71, 0x77, 0x65, 0x72, 0x74, 0x79,
	0x75, 0x61, 0x73, 0x64, 0x66, 0x67, 0x68, 0x6a,
	0x6b, 0x7a, 0x78, 0x63, 0x76, 0x62, 0x6e, 0x6d,
	0x2c, 0x01, 0x02, 0x14, 0x11, 0x0a, 0x20, 0x1f,
	0x1e, 0x1d, 0x1c, 0x15, 0x30, 0x2e, 0x3d, 0x2b,
	0x0d, 0x6c, 0x3b, 0x17, 0x31, 0x32, 0x33, 0x2d,
	0x1a, 0x69, 0x6f, 0x12, 0x34, 0x35, 0x36, 0x2a,
	0x19, 0x70, 0x08, 0xfe, 0x37, 0x38, 0x39, 0x2f,
	0x29, 0xfe, 0xfe, 0xfe, 0xfe, 0x5e, 0x28, 0xfe
]);

/*
	メモリを読み込む (8bit)
*/
function z80read8(address) {
	if (z80break == false) {
		if ((bken == true) && (address == bkpt) && (fetch == true)) {
			z80break = true;
			z80restStates = 0;
			console.log("\n*** FETCH BREAK ***\n")
			z80debug_log();
			disasm(z80pc,1);
		}
	}

	if(address < 0x8000)
		return ram[address];
	if(address < 0xc000)
		return (romBanks > 0 ? rom[0][address - 0x8000]: 0xff);
	else
		return (romBank <= romBanks ? rom[romBank][address - 0xc000]: 0xff);
}

/*
	メモリを読み込む(16bit)
*/
function z80read16(address) {
	return z80read8(address) | (z80read8(address + 1) << 8);
}

/*
	メモリに書き込む (8bit)
*/
function z80write8(address, value) {
	if(address < 0x8000)
		ram[address] = value;
}

/*
	メモリに書き込む (16bit)
*/
function z80write16(address, value) {
	z80write8(address, value & 0xff);
	z80write8(address + 1, value >> 8);
}

/*
	キーの状態
*/
function in10() {
	if(keyStrobeLastStates - z80restStates > keyStrobeClearStates)
		keyStrobe = keyStrobeLast;

	var key =
	(keyStrobe & 0x001 ? keyMatrix[0]: 0) |
	(keyStrobe & 0x002 ? keyMatrix[1]: 0) |
	(keyStrobe & 0x004 ? keyMatrix[2]: 0) |
	(keyStrobe & 0x008 ? keyMatrix[3]: 0) |
	(keyStrobe & 0x010 ? keyMatrix[4]: 0) |
	(keyStrobe & 0x020 ? keyMatrix[5]: 0) |
	(keyStrobe & 0x040 ? keyMatrix[6]: 0) |
	(keyStrobe & 0x080 ? keyMatrix[7]: 0) |
	(keyStrobe & 0x100 ? keyMatrix[8]: 0) |
	(keyStrobe & 0x200 ? keyMatrix[9]: 0);

	keyStrobe = keyStrobeLast;
	return key;
}
function out10() {
}

/*
	キーストローブ(下位)
*/
function in11() {
	return 0;
}
function out11(x) {
	if(keyStrobeLastStates - z80restStates > keyStrobeClearStates)
		keyStrobe = 0;

	keyStrobeLast = x;
	keyStrobe |= keyStrobeLast;
	keyStrobeLastStates = z80restStates;

	if(x & 0x10)
		interruptType |= INTERRUPT_IA;
}

/*
	キーストローブ(上位)
*/
function in12() {
	return 0;
}
function out12(x) {
	if(keyStrobeLastStates - z80restStates > keyStrobeClearStates)
		keyStrobe = 0;

	keyStrobeLast = x << 8;
	keyStrobe |= keyStrobeLast;
	keyStrobeLastStates = z80restStates;
}

/*
	シフトキーの状態
*/
function in13() {
	return (keyStrobe & 0x08 ? keyShift: 0);
}
function out13() {
}

/*
	タイマ
*/
function in14()
{
	return timer;
}
function out14(x)
{
	timer = 0;
}

/*
	Xin入力端子の入力可否状態
*/
function in15() {
	/* 未対応 */
	return 0;
}
function out15() {
	/* 未対応 */
}

/*
	割り込み要因
*/
function in16() {
	return interruptType;
}
function out16(x) {
	interruptType &= ~x & 0x0f;
}

/*
	割り込みマスク
*/
function in17() {
	return interruptMask;
}
function out17(x) {
	interruptMask = x;
}

/*
	11pinI/Fの出力制御
*/
function in18() {
	/* 未対応 */
	return 0;
}

var out18state = 0;
var out18data  = 0;
var out18ctr   = 0;
function serialcapture(x)
{
	if (x & 0x02) {
		var data = (x & 0x80) ? 0 : 1;
		switch(out18state){
			case 0:
				if (data == 1) out18state = 1; // STOP BIT
				break;
			case 1:
				if (data == 0) {
					out18state = 2; // START BIT
					out18data = 0;
					out18ctr  = 0;
				}
				break;
			case 2:
				out18data = (out18data >> 1) + (data << 7);
				out18ctr = out18ctr + 1;
				if (out18ctr == 8) {
					if (out18data >= 0x20) {
						console.log(String.fromCharCode(out18data));
					} else if (out18data == 0x0a) {
						console.log("\n");
					}
					out18state = 0;
				}

		}
	}

}


function out18(x) {
	serialcapture(x);

	if(wave == null)
		return;
	if(z80executeStates <= 0)
		return;

	var pos = Math.floor((z80executeStates - z80restStates) * (44100 / fps) / z80executeStates);
	if(pos >= wave.length)
		return;
	else if(pos < 0)
		pos = 0;

	if(x & 0xc0)
		wave.set(waveOn.subarray(pos), pos);
	else
		wave.set(waveOff.subarray(pos), pos);
}

/*
	ROMバンク切り替え
*/
function in19() {
	return ((exBank & 0x07) << 4) | (romBank & 0x0f);
}
function out19(x) {
	if(romBanks > 0)
		romBank = (x & 0x0f) % romBanks;
	//console.log("--OUT19 BANK ",romBank);
	exBank = (x & 0x70) >> 4;
}

/*
	BOOT ROM ON/OFF
*/
function in1a() {
	return 0;
}
function out1a(x) {
	/* 未対応 */
}

/*
	RAMバンク切り替え
*/
function in1b() {
	return ramBank;
}
function out1b(x) {
	ramBank = x & 0x04;
}

/*
	I/Oリセット
*/
function in1c() {
	return 0;
}
function out1c(x) {
	/* 未対応 */
}

/*
	バッテリー状態
*/
function in1d() {
	return 0x08;
}
function out1d(x) {
}

/*
	?
*/
function in1e() {
	return 0;
}
function out1e(x) {
}

/*
	11pinI/Fの入力
*/
function in1f() {
	return keyBreak | (siocapture == true ? 0x02 : 0x00) ; // for Serial Capture
}
function out1f(x) {
}

/*
	VRAMのアドレスを得る (PC-E200)
*/
function e200VramAddress(x, row, begin) {
	row = (row - begin + 8) % 8;

	if(x == 0x3c)
		return row * vramWidth + (vramWidth - 1);

	if(row < 4)
		return (row - 0) * vramWidth + x;
	else
		return (row - 4) * vramWidth + (vramWidth - x - 2);
}

/*
	ディスプレイコントロール (PC-E200)
*/
function out58_e200(val) {
	lcdRead = false;

	switch(val & 0xc0) {
	case 0x00:
		break;
	case 0x40:
		lcdX = val & 0x3f;
		break;
	case 0x80:
		lcdY = val & 0x07;
		break;
	case 0xc0:
		var begin_prev = lcdBegin;
		lcdBegin = (val >> 3) & 0x07;

		for(var row = 0; row < 8; row++)
			for(var x = 0; x < 0x3d; x++) {
				var off_prev = e200VramAddress(x, row, begin_prev);
				var off      = e200VramAddress(x, row, lcdBegin);

				var tmp = vram[off_prev];
				vram[off_prev] = vram[off];
				vram[off] = tmp;
			}

		break;
	}
}
function in59_e200() {
	return 0;
}

/*
	ディスプレイ READ/WRITE (PC-E200)
*/
function out5a_e200(val) {
	lcdRead = false;

	if(lcdX < 0x3d && lcdY < 8)
		vram[e200VramOffset(lcdX++, lcdY, lcdBegin)] = val;
}
function in5b_e200() {
	if(!lcdRead) {
		lcdRead = true;
		return 0;
	}

	if(lcdX > 0 && lcdX < 0x3d && lcdY < 8)
		return vram[e200VramOffset(lcdX++, lcdY, lcdBegin)];
	else
		return 0;
}

/*
	VRAMのオフセット(PC-G815)
*/
function g815VramAddress(x, row, begin) {
	row = (row - begin + 8) % 8;

	if(x == 0x48)
		return row * vramWidth + (vramWidth - 1);
	if(row < 4)
		return (row - 0) * vramWidth + x;
	else
		return (row - 4) * vramWidth + (vramWidth - x - 2);
}

/*
	ディスプレイコントロール (PC-G815)
*/
function out50_g815(val) {
	lcdRead = false;

	switch(val & 0xc0) {
	case 0x00:
		break;
	case 0x40:
		lcdX2 = lcdX = val & 0x3f;
		break;
	case 0x80:
		lcdY2 = lcdY = val & 0x07;
		break;
	case 0xc0:
		var begin_prev = lcdBegin;
		lcdBegin = (val >> 3) & 0x07;

		for(var row = 0; row < 8; row++)
			for(var x = 0; x < 0x49; x++) {
				var off_prev = g815VramAddress(x, row, begin_prev);
				var off      = g815VramAddress(x, row, lcdBegin);

				var tmp = vram[off_prev];
				vram[off_prev] = vram[off];
				vram[off] = tmp;
			}

		break;
	}
}
function in51_g815() {
	return 0;
}
function out54_g815(val) {
	lcdRead = false;

	switch(val & 0xc0) {
	case 0x00:
		break;
	case 0x40:
		lcdX2 = val & 0x3f;
		break;
	case 0x80:
		lcdY2 = val & 0x07;
		break;
	case 0xc0:
		out50_g815(val);
		break;
	}
}
function in55_g815() {
	return 0;
}
function out58_g815(val) {
	lcdRead = false;

	switch(val & 0xc0) {
	case 0x00:
		break;
	case 0x40:
		lcdX = val & 0x3f;
		break;
	case 0x80:
		lcdY = val & 0x07;
		break;
	case 0xc0:
		out50_g815(val);
		break;
	}
}
function in59_g815() {
	return 0;
}

/*
	ディスプレイ WRITE (PC-G815) (outportの下請け)
*/
function out56_g815(x) {
	lcdRead = false;

	if(lcdX2 < 0x3c && lcdY2 < 8)
		vram[g815VramAddress(lcdX2++, lcdY2, lcdBegin)] = x;
}
function in57_g815() {
	if(!lcdRead) {
		lcdRead = true;
		return 0;
	}

	if(lcdX2 < 0x3c && lcdX2 > 0 && lcdY2 < 8)
		return vram[g815VramAddress(lcdX2++, lcdY2, lcdBegin)];
	return 0;
}
function out5a_g815(x) {
	lcdRead = false;

	if(0x3c + lcdX < 0x49 && lcdY < 8)
		vram[g815VramAddress(0x3c + lcdX++, lcdY, lcdBegin)] = x;
}
function in5b_g815() {
	if(!lcdRead) {
		lcdRead = true;
		return 0;
	}

	if(0x3c + lcdX < 0x49 && lcdY < 8)
		return vram[g815VramAddress(0x3c + lcdX++, lcdY, lcdBegin)];
	return 0;
}

function out52_g815(x) {
	out56_g815(x);
	out5a_g815(x);
}

/*
	VRAMのアドレスを得る (PC-G850)
*/
function g850VramAddress(x, row) {
	return (row % vramRows) * vramWidth + x;
}

/*
	ディスプレイコントロール (PC-G850)
*/
function in40_g850() {
	return 0;
}
function out40_g850(x) {
	lcdRead = false;

	switch(x & 0xf0) {
	case 0x00:
		if(!lcdMod)
			lcdX = (lcdX & 0xf0) | (x & 0x0f);
		break;
	case 0x10:
		if(!lcdMod)
			lcdX = ((x << 4) & 0xf0) | (lcdX & 0x0f);
		break;
	case 0x20:
		if(x == 0x24)
			lcdDisabled = true;
		else if(x == 0x25)
			lcdDisabled = false;
		break;
	case 0x30:
		timerInterval = 16192 * ((x & 0x0f) + 1);
		break;
	case 0x40:
	case 0x50:
	case 0x60:
	case 0x70:
		lcdTop = x - 0x40;
		break;
	case 0x80:
	case 0x90:
		lcdContrast = x - 0x80;
		break;
	case 0xa0:
		switch(x) {
		case 0xa0:
			lcdEffectMirror = false;
			break;
		case 0xa1:
			lcdEffectMirror = true;
			break;
		case 0xa4:
			lcdEffectBlack = false;
			break;
		case 0xa5:
			lcdEffectBlack = true;
			break;
		case 0xa6:
			lcdEffectReverse = false;
			break;
		case 0xa7:
			lcdEffectReverse = true;
			break;
		case 0xa8:
			lcdEffectDark = true;
			break;
		case 0xa9:
			lcdEffectDark = false;
			break;
		case 0xae:
			lcdEffectWhite = true;
			break;
		case 0xaf:
			lcdEffectWhite = false;
			break;
		}
		break;
	case 0xb0:
		lcdY = x & 0x0f;
		break;
	case 0xc0:
		lcdTrim = x & 0x0f;
		break;
	case 0xd0:
		break;
	case 0xe0:
		if(x == 0xe0) {
			lcdMod = true;
			lcdX2 = lcdX;
		} else if(x == 0xe2) {
			lcdMod = false;
			lcdContrast = 0;
		} else if(x == 0xee) {
			lcdMod = false;
			lcdX = lcdX2;
		}
		break;
	case 0xf0:
		break;
	}
}

/*
	ディスプレイ READ/WRITE (PC-G850)
*/
function in41_g850() {
	if(!lcdRead) {
		lcdRead = true;
		return 0;
	}

	var pat;

	if(lcdX < 166 - 1)
		pat = vram[g850VramAddress(lcdX, lcdY)];
	else
		pat = 0xff;
	if(!lcdMod)
		lcdX++;
	return pat;
}
function out41_g850(x) {
	lcdRead = false;

	if(lcdX < 166 && lcdY < 8)
		vram[g850VramAddress(lcdX++, lcdY)] = x;
}

/*
	11pin I/Fの動作 (PC-G850)
*/
function in60_g850() {
	/* 未対応 */
	return 0;
}
function out60_g850(x) {
	/* 未対応 */
}
/*
	パラレルI/Oの入出力方向 (PC-G850)
*/
function in61_g850() {
	return 0;
}
function out61_g850(x) {
	/* 未対応 */
}

/*
	パラレルI/Oのデータレジスタ (PC-G850)
*/
function in62_g850() {
	/* 未対応 */
	return 0;
}
function out62_g850(x) {
	/* 未対応 */
}

/*
	UARTフロー制御 (PC-G850)
*/
function in63_g850() {
	/* 未対応 */
	return 0;
}
function out63_g850(x) {
	/* 未対応 */
}

/*
	CD信号によるON制御 (PC-G850)
*/
function in64_g850() {
	/* 未対応 */
	return 0;
}
function out64_g850(x) {
	/* 未対応 */
}

/*
	M1信号後wait制御 (PC-G850)
*/
function in65_g850() {
	/* 未対応 */
	return 0;
}

/*
	M1信号後wait制御 (PC-G850)
*/
function out65_g850(x) {
	/* 未対応 */
}

/*
	I/O wait (PC-G850)
*/
function in66_g850() {
	/* 未対応 */
	return 0;
}

/*
	I/O wait (PC-G850)
*/
function out66_g850(x) {
	/* 未対応 */
}

/*
	CPUクロック高速/低速切り替え (PC-G850)
*/
function in67_g850() {
	/* 未対応 */
	return 0;
}
function out67_g850(x) {
	/* 未対応 */
}

/*
	タイマ信号/LCDドライバ周期 (PC-G850)
*/
function in68_g850() {
	/* 未対応 */
	return 0;
}
function out68_g850(x) {
	/* 未対応 */
}

/*
	ROMバンク切り替え (PC-G850)
*/
function in69_g850() {
	return romBank;
}
function out69_g850(x) {
	romBank = x;
	//console.log("--OUT69 BANK ",romBank);
}

/*
	? (PC-G850)
*/
function in6a_g850() {
	return 0;
}
function out6a_g850(x) {
}

/*
	UARTの入力選択 (PC-G850)
*/
function in6b_g850() {
	/* 未対応 */
	return 0;
}
function out6b_g850(x) {
	/* 未対応 */
}

/*
	UARTモードレジスタ (PC-G850)
*/
function in6c_g850() {
	/* 未対応 */
	return 0;
}
function out6c_g850(x) {
	/* 未対応 */
}

/*
	UARTコマンドレジスタ (PC-G850)
*/
function in6d_g850() {
	/* 未対応 */
	return 0;
}
function out6d_g850(x) {
	/* 未対応 */
}

/*
	UARTステータスレジスタ (PC-G850)
*/
function in6e_g850() {
	/* 未対応 */
	return 0;
	//return 0x08; // 08 = UART TX RDY
}
function out6e_g850(x) {
	/* 未対応 */
}

/*
	UART送受信レジスタ (PC-G850)
*/
function in6f_g850() {
	/* 未対応 */
	return 0;
}
function out6f_g850(x) {
	/* 未対応 */
}

/*
	I/Oから入力を得る
*/
function z80inport(address) {
	/*
	if ((address == 0x18) || ((address >= 0x20) && (address != 0x40) && (address != 0x41) && (address != 0x69))) {
		console.log("--IN ",address.toString(16).toUpperCase(),"\n");
	}
	*/

	/* ディスプレイ用・その他(機種依存) */
	switch(machine) {
	case MACHINE_E200:
		switch(address) {
		case 0x51:
		case 0x59:
			return in59_e200();
		case 0x57:
		case 0x5b:
			return in5b_e200();
		}
		break;
	case MACHINE_G815:
		switch(address) {
		case 0x51:
			return in51_g815();
		case 0x55:
			return in55_g815();
		case 0x57:
			return in57_g815();
		case 0x59:
			return in59_g815();
		case 0x5b:
			return in5b_g815();
		}
		break;
	case MACHINE_G850:
		switch(address) {
		case 0x40:
		case 0x42:
		case 0x44:
		case 0x46:
		case 0x48:
		case 0x4a:
		case 0x4c:
		case 0x4e:
		case 0x50:
		case 0x52:
		case 0x54:
		case 0x56:
		case 0x58:
		case 0x5a:
		case 0x5c:
		case 0x5e:
			return in40_g850();
		case 0x41:
		case 0x43:
		case 0x45:
		case 0x47:
		case 0x49:
		case 0x4b:
		case 0x4d:
		case 0x4f:
		case 0x51:
		case 0x53:
		case 0x55:
		case 0x57:
		case 0x59:
		case 0x5b:
		case 0x5d:
		case 0x5f:
			return in41_g850();
		case 0x60:
			return in60_g850();
		case 0x61:
			return in61_g850();
		case 0x62:
			return in62_g850();
		case 0x63:
			return in63_g850();
		case 0x64:
			return in64_g850();
		case 0x65:
			return in65_g850();
		case 0x66:
			return in66_g850();
		case 0x67:
			return in67_g850();
		case 0x68:
			return in68_g850();
		case 0x69:
			return in69_g850();
		case 0x6a:
			return in6a_g850();
		case 0x6b:
			return in6b_g850();
		case 0x6c:
			return in6c_g850();
		case 0x6d:
			return in6d_g850();
		case 0x6e:
			return in6e_g850();
		case 0x6f:
			return in6f_g850();
		}
	}

	/* システムポート(共通) */
	switch(address) {
	case 0x10:
		return in10();
	case 0x11:
		return in11();
	case 0x12:
		return in12();
	case 0x13:
		return in13();
	case 0x14:
		return in14();
	case 0x15:
		return in15();
	case 0x16:
		return in16();
	case 0x17:
		return in17();
	case 0x18:
		return in18();
	case 0x19:
		return in19();
	case 0x1a:
		return in1a();
	case 0x1b:
		return in1b();
	case 0x1c:
		return in1c();
	case 0x1d:
		return in1d();
	case 0x1e:
		return in1e();
	case 0x1f:
		return in1f();
	}

	return 0x78;
}

/*
	I/Oに出力する
*/
function z80outport(address, value) {
	/*
	if ((address == 0x18) || ((address >= 0x20) && (address != 0x40) && (address != 0x41) && (address != 0x69))) {
		console.log("--OUT ",address.toString(16).toUpperCase(),",",value.toString(16).toUpperCase(),"\n");
	}
	*/


	/* ディスプレイ用・その他(機種依存) */
	switch(machine) {
	case MACHINE_E200:
		switch(address) {
		case 0x50:
		case 0x58:
			out58_e200(value); break;
		case 0x56:
		case 0x5a:
			out5a_e200(value); break;
		}
		break;
	case MACHINE_G815:
		switch(address) {
		case 0x50:
			out50_g815(value); break;
		case 0x52:
			out52_g815(value); break;
		case 0x54:
			out54_g815(value); break;
		case 0x56:
			out56_g815(value); break;
		case 0x58:
			out58_g815(value); break;
		case 0x5a:
			out5a_g815(value); break;
		}
		break;
	case MACHINE_G850:
		switch(address) {
		case 0x40:
		case 0x42:
		case 0x44:
		case 0x46:
		case 0x48:
		case 0x4a:
		case 0x4c:
		case 0x4e:
		case 0x50:
		case 0x52:
		case 0x54:
		case 0x56:
		case 0x58:
		case 0x5a:
		case 0x5c:
		case 0x5e:
			out40_g850(value); break;
		case 0x41:
		case 0x43:
		case 0x45:
		case 0x47:
		case 0x49:
		case 0x4b:
		case 0x4d:
		case 0x4f:
		case 0x51:
		case 0x53:
		case 0x55:
		case 0x57:
		case 0x59:
		case 0x5b:
		case 0x5d:
		case 0x5f:
			out41_g850(value); break;
		case 0x60:
			out60_g850(value); break;
		case 0x61:
			out61_g850(value); break;
		case 0x62:
			out62_g850(value); break;
		case 0x63:
			out63_g850(value); break;
		case 0x64:
			out64_g850(value); break;
		case 0x65:
			out65_g850(value); break;
		case 0x66:
			out66_g850(value); break;
		case 0x67:
			out67_g850(value); break;
		case 0x68:
			out68_g850(value); break;
		case 0x69:
			out69_g850(value); break;
		case 0x6a:
			out6a_g850(value); break;
		case 0x6b:
			out6b_g850(value); break;
		case 0x6c:
			out6c_g850(value); break;
		case 0x6d:
			out6d_g850(value); break;
		case 0x6e:
			out6e_g850(value); break;
		case 0x6f:
			out6f_g850(value); break;
		}
	}

	/* システムポート(共通) */
	switch(address) {
	case 0x10:
		out10(value); break;
	case 0x11:
		out11(value); break;
	case 0x12:
		out12(value); break;
	case 0x13:
		out13(value); break;
	case 0x14:
		out14(value); break;
	case 0x15:
		out15(value); break;
	case 0x16:
		out16(value); break;
	case 0x17:
		out17(value); break;
	case 0x18:
		out18(value); break;
	case 0x19:
		out19(value); break;
	case 0x1a:
		out1a(value); break;
	case 0x1b:
		out1b(value); break;
	case 0x1c:
		out1c(value); break;
	case 0x1e:
		out1e(value); break;
	case 0x1f:
		out1f(value); break;
	}
}

/*
	16bitレジスタの値を得る
*/
function getR16(r) {
	return r[0] << 8 | r[1];
}

/*
	16bitレジスタの値を設定する
*/
function setR16(r, val) {
	r[0] = val >>> 8;
	r[1] = val & 0xff;
}

/*
	16bitレジスタの値を1加算する
*/
function incR16(r) {
	r[1]++;
	if(r[1] == 0)
		r[0]++;

	return (r[0] << 8) | r[1];
}

/*
	破壊された8bitレジスタの値を得る
*/
function destroy8() {
	return Math.floor(Math.random() * 255);
}

/*
	VRAMのアドレスを得る
*/
function lcdAddress(x, row) {
	if(machine == MACHINE_G850)
		return ((row + z80read8(0x790d)) % vramRows) * vramWidth + x;
	else
		return (row % vramRows) * vramWidth + x;
}

/*
	パターンを表示する
*/
function putPattern(pos, pat, off, len) {
	var address = lcdAddress(pos[1] * cellWidth, pos[0]);

	while(len-- > 0)
		vram[(address++) % vram.length] = pat[off++];
}

/*
	行を消去する
*/
function clearLine(row) {
	var address = lcdAddress(0, row);

	for(var x = 0; x < vramWidth - 1; x++)
		vram[address++] = 0;
}

/*
	画面全体を消去する
*/
function clearAll() {
	for(var row = 0; row < vramRows; row++)
		clearLine(row);
}

/*
	上にスクロールする
*/
function scrollUp() {
	var tmp = vram[g850VramAddress(lcdWidth, 7)];
	vram[g850VramAddress(lcdWidth, 7)] = vram[g850VramAddress(lcdWidth, 6)];
	vram[g850VramAddress(lcdWidth, 6)] = vram[g850VramAddress(lcdWidth, 5)];
	vram[g850VramAddress(lcdWidth, 5)] = vram[g850VramAddress(lcdWidth, 4)];
	vram[g850VramAddress(lcdWidth, 4)] = vram[g850VramAddress(lcdWidth, 3)];
	vram[g850VramAddress(lcdWidth, 3)] = vram[g850VramAddress(lcdWidth, 2)];
	vram[g850VramAddress(lcdWidth, 2)] = vram[g850VramAddress(lcdWidth, 1)];
	vram[g850VramAddress(lcdWidth, 1)] = vram[g850VramAddress(lcdWidth, 0)];
	vram[g850VramAddress(lcdWidth, 0)] = tmp;

	clearLine(0);
	switch(machine) {
	case MACHINE_E200:
		z80write8(0x790d, (z80read8(0x790d) + 1) % 8);
		z80outport(0x58, (z80read8(0x790d) << 3) | 0xc0);
		break;
	case MACHINE_G815:
		z80write8(0x790d, (z80read8(0x790d) + 1) % 8);
		z80outport(0x50, (z80read8(0x790d) << 3) | 0xc0);
		break;
	case MACHINE_G850:
		clearLine(6);
		clearLine(7);
		z80write8(0x790d, (z80read8(0x790d) + 1) % vramRows);
		z80outport(0x40, (z80read8(0x790d) * 8) % (vramRows * 8) | 0x40);
		break;
	}
}

/*
	下にスクロールする
*/
function scrollDown(pos) {
	var length = lcdWidth - pos[0] * cellWidth;

	for(var r = vramRows - 1; r != pos[0]; r--)
		for(var x = pos[1] * cellWidth; x < lcdWidth * cellWidth; x++)
			vram[lcdAddress(x, r)] = vram[lcdAddress(x, r - 1)];

	clearLine(r);
}

/*
	最初の文字を表示する
*/
function putChar(pos, chr) {
	putPattern(pos, font, chr * 6, cellWidth);
}

/*
	次の文字を表示する
*/
function putCharNext(pos, chr) {
	if(pos[1] < lcdCols - 1) {
		pos[1]++;
		putChar(pos, chr);
		return false;
	} else if(pos[0] < lcdRows - 1) {
		pos[1] = 0;
		pos[0]++;
		putChar(pos, chr);
		return false;
	} else {
		pos[1] = 0;
		pos[0] = lcdRows - 1;
		scrollUp();
		putChar(pos, chr);
		return true;
	}
}

/*
	文字列を表示する
*/
function putString(col, row, text)
{
	var pos = new Uint8Array([row, col]);

	for(var i = 0; i < text.length; i++, pos[1]++)
		putChar(pos, text.charCodeAt(i));
}

/*
	LCD上にドットがあるか調べる
*/
function point(x, y)
{
	if(x < 0 || y < 0 || x >= lcdWidth || y >= lcdHeight)
		return 0;

	return vram[lcdAddress(x, Math.floor(y / 8))];
}

/*
	LCD上に点を描く
*/
function pset(x, y, mode)
{
	if(x < 0 || y < 0 || x >= lcdWidth || y >= lcdHeight)
		return;

	var mask = 1 << (y % 8);

	switch(mode) {
	case 0:
		vram[lcdAddress(x, Math.floor(y / 8))] &= ~mask;
		break;
	case 1:
		vram[lcdAddress(x, Math.floor(y / 8))] |= mask;
		break;
	default:
		vram[lcdAddress(x, Math.floor(y / 8))] ^= mask;
		break;
	}
}

/*
	LCD上に線を描く
*/
function line(x1, y1, x2, y2, mode)
{
	var dx, dx0, dy, dy0, e, x, y, tmp;

	dx0 = x2 - x1; dx = (dx0 > 0 ? dx0: -dx0);
	dy0 = y2 - y1; dy = (dy0 > 0 ? dy0: -dy0);

	if(dx > dy) {
		if(dx0 < 0) {
			tmp = x1; x1 = x2; x2 = tmp;
			tmp = y1; y1 = y2; y2 = tmp;
			dy0 = -dy0;
		}
		for(x = x1, y = y1, e = 0; x <= x2; x++) {
			e += dy;
			if(e > dx) {
				e -= dx;
				y += (dy0 > 0 ? 1: -1);
			}
			pset(x, y, mode);
		}
	} else {
		if(dy0 < 0) {
			tmp = x1; x1 = x2; x2 = tmp;
			tmp = y1; y1 = y2; y2 = tmp;
			dx0 = -dx0;
		}
		for(y = y1, x = x1, e = 0; y <= y2; y++) {
			e += dx;
			if(e > dy) {
				e -= dy;
				x += (dx0 > 0 ? 1: -1);
			}
			pset(x, y, mode);
		}
	}
}

/*
	LCD上に四角を描く
*/
function box(x1, y1, x2, y2, mode) {
	var i, tmp;

	if(x1 > x2) {
		tmp = x1; x1 = x2; x2 = tmp;
	}
	if(y1 > y2) {
		tmp = y1; y1 = y2; y2 = tmp;
	}

	for(i = x1; i <= x2; i++)
		pset(i, y1, mode);
	for(i = y1 + 1; i <= y2 - 1; i++)
		pset(x1, i, mode);
	if(x1 != x2)
		for(i = y1 + 1; i <= y2 - 1; i++)
			pset(x2, i, mode);
	if(y1 != y2)
		for(i = x1; i <= x2; i++)
			pset(i, y2, mode);
}

/*
	LCD上に塗りつぶした四角を描く
*/
function boxfill(x1, y1, x2, y2, mode) {
	for(var j = y1; j <= y2; j++)
		for(var i = x1; i <= x2; i++)
			pset(i, j, mode);
}

/*
	LCD上にパターンを描く
*/
function gprint(x, y, pat) {
	pset(x, y - 7, (pat & 0x01 ? 1: 0));
	pset(x, y - 6, (pat & 0x02 ? 1: 0));
	pset(x, y - 5, (pat & 0x04 ? 1: 0));
	pset(x, y - 4, (pat & 0x08 ? 1: 0));
	pset(x, y - 3, (pat & 0x10 ? 1: 0));
	pset(x, y - 2, (pat & 0x20 ? 1: 0));
	pset(x, y - 1, (pat & 0x40 ? 1: 0));
	pset(x, y - 0, (pat & 0x80 ? 1: 0));
}

/*
	押されているキーを得る(waitなし)
*/
function getKey() {
	var key, i;

	if(keyBreak)
		return GKEY_BREAK;
	for(key = GKEY_OFF - 1; key <= GKEY_CLS - 1; key++)
		if(keyMatrix[Math.floor(key / 8)] & (1 << (key % 8))) {
			for(i = key + 1; i <= GKEY_CLS - 1; i++)
				if(keyMatrix[Math.floor(i / 8)] & (1 << (i % 8)))
					return GKEY_DOUBLE;
			return (key + 1) | (keyShift ? 0x80: 0);
		}

	return GKEY_NONE;
}

/*
	押されているキーを得る(waitあり)
*/
function getKeyWait() {
	if(lastKey != GKEY_NONE) {
		if(getKey() == GKEY_NONE)
			lastKey = GKEY_NONE;
		return GKEY_NONE;
	}

	lastKey = getKey();
	return lastKey;
}

/*
	キーコードをASCIIコードに変換する
*/
function gkeyToAscii(gkey, is_upper) {
	if(is_upper && gkey < 0x49)
		return gkeyToAsciiUpper[gkey];
	else
		return gkeyToAsciiLower[gkey];
}


function buttonHold(gkey)
{
	if (gkey instanceof Uint8Array){
		for( var i=0; i<gkey.length; i++) {
			buttonHold(gkey[i]);
		}
		return ;
	}

    document.activeElement.blur();

	// KeyDown
	if(gkey <= 0) {
		return;
	} else if(gkey <= GKEY_CLS) {
		var k = gkey - 1;

		if(keyMatrix[Math.floor(k / 8)] & (1 << (k % 8)))
			return;

		intIA = true;
		keyMatrix[Math.floor(k / 8)] |= (1 << (k % 8));
	} else if(gkey == GKEY_BREAK) {
		if(keyBreak)
			return;
		intKON = true;
		keyBreak |= 0x80;
	} else if(gkey == GKEY_SHIFT) {
		keyShift |= 0x01;
	} else if(gkey == GKEY_RESET) {
		keyReset = true;
	}
}

function buttonRelease(gkey)
{
	if (gkey instanceof Uint8Array){
		for( var i=0; i<gkey.length; i++) {
			buttonRelease(gkey[i]);
		}
		return ;
	}

    document.activeElement.blur();

	// Set Release Callback
	if(gkey <= 0) {
		return;
	} else if(gkey <= GKEY_CLS) {
		var k = gkey - 1;

		keyMatrix[Math.floor(k / 8)] &= ~(1 << (k % 8));
	} else if(gkey == GKEY_BREAK) {
		keyBreak &= ~0x80;
	} else if(gkey == GKEY_SHIFT) {
		keyShift &= ~0x01;
	} else if(gkey == GKEY_RESET) {
		keyReset = false;
	}
}


/*
	全レジスタを表示する
*/
function iocs_bd03() {
	function hex(val, n) {
		var x = "0000" + val.toString(16);
		return x.substr(x.length - n, n).toUpperCase();
	}

	clearAll();
	putString(0, 0, "PC=" + hex(z80pc, 4) + "  AF=" + hex(z80af[0], 2) + " " + hex(z80af[1], 2));
	putString(0, 1, "SP=" + hex(z80sp, 4) + "  BC=" + hex(z80bc[0], 2) + " " + hex(z80bc[1], 2));
	putString(0, 2, "IX=" + hex(z80ix[0], 2) + hex(z80ix[1], 2) + "  DE=" + hex(z80de[0], 2) + " " + hex(z80de[1], 2));
	putString(0, 3, "IY=" + hex(z80iy[0], 2) + hex(z80iy[1], 2) + "  HL=" + hex(z80hl[0], 2) + " " + hex(z80hl[1], 2));

	if(getKeyWait() == GKEY_NONE)
		return 0;

	return 1000;
}

/*
	少し待つ (PC-G850専用)
*/
function iocs_8aad() {
	return 1500;
}

/*
	ドットの状態を得る (PC-G815専用)
*/
function iocs_02_f9f8() {
	z80af[0] = point(getR16(z80hl), getR16(z80de));
	z80bc[1] = 1 << (getR16(z80de) % 8);
	return 1000;
}

/*
	ドットを描く (PC-G815専用)
*/
function iocs_0d_c76e() {
	pset(getR16(z80hl), getR16(z80de), z80read8(0x7f0f));
	return 1000;
}

/*
	線分を描く (PC-G815専用)
*/
function iocs_0d_c5fc() {
	var x1 = getR16(z80hl);
	var y1 = getR16(z80de);
	var x2 = z80read16(0x7967);
	var y2 = z80read16(0x7969);

	line(x1, y1, x2, y2, z80read8(0x7f0f));
	return 6000;
}

/*
	四角を描く (PC-G815専用)
*/
function iocs_0d_c4a9() {
	var x1 = getR16(z80hl);
	var y1 = getR16(z80de);
	var x2 = z80read16(0x7967);
	var y2 = z80read16(0x7969);

	setR16(z80de, y2);
	box(x1, y1, x2, y2, z80read8(0x7f0f));
	return 8000;
}

/*
	四角を描く (PC-G815専用)
*/
function iocs_0d_c442() {
	var x1 = getR16(z80hl);
	var y1 = getR16(z80de);
	var x2 = z80read16(0x7967);
	var y2 = z80read16(0x7969);

	setR16(z80de, y2);
	box(x1, y1, x2, y2, z80read8(0x777f));
	return 10000;
}

/*
	塗りつぶした四角を描く (PC-G815専用)
*/
function iocs_0d_c532()
{
	var x1 = getR16(z80hl);
	var y1 = getR16(z80de);
	var x2 = z80read16(0x7967);
	var y2 = z80read16(0x7969);

	setR16(z80de, y2);
	boxfill(x1, y1, x2, y2, z80read8(0x7f0f));
	return 10000;
}

/*
	線分を描く (PC-G815専用)
*/
function iocs_0d_c595()
{
	var x1 = getR16(z80hl);
	var y1 = getR16(z80de);
	var x2 = z80read16(0x7967);
	var y2 = z80read16(0x7969);

	line(x1, y1, x2, y2, z80read8(0x777f));
	return 6000;
}

/*
	文字を描く (PC-G815専用)
*/
function iocs_02_f892()
{
	var x = z80read16(0x79db);
	var y = z80read16(0x79dd);

	z80write8(0x79db, z80read8(0x79db) + 1);
	if(z80read8(0x79db) == 0)
		z80write8(0x79db, z80read8(0x79db) + 1);

	setR16(z80hl, x);
	setR16(z80de, y & 0xff80);
	gprint(x, y, z80af[0]);
	return 4000;
}

/*
	グラフィック処理 (PC-G815専用)
*/
function iocs_9490()
{
	var page = z80read8(z80pc + 3);
	var address = z80read16(z80pc + 4);

	z80pc = z80read16(z80sp) - 3;
	z80sp += 2;

	switch(page) {
	case 0x02:
		switch(address) {
		case 0xf892:
			return iocs_02_f892();
		case 0xf9f8:
			return iocs_02_f9f8();
		}
		break;
	case 0x0d:
		switch(address) {
		case 0xc76e:
			return iocs_0d_c76e();
		case 0xc5fc:
			return iocs_0d_c5fc();
		case 0xc4a9:
			return iocs_0d_c4a9();
		case 0xc442:
			return iocs_0d_c442();
		case 0xc532:
			return iocs_0d_c532();
		case 0xc595:
			return iocs_0d_c595();
		}
		break;
	}

	return 1000;
}

/*
	ドットの状態を得る (PC-G850専用)
*/
function iocs_0e_ffca() {
	z80af[0] = point(getR16(z80hl), getR16(z80de));
	z80bc[1] = 1 << (getR16(z80de) % 8);
	return 1000;
}

/*
	ドットを描く (PC-G850専用)
*/
function iocs_0d_ffd0() {
	pset(getR16(z80hl), getR16(z80de), z80read8(0x777f));
	return 1000;
}

/*
	線分を描く (PC-G850専用)
*/
function iocs_0d_ffd3() {
	var x1 = getR16(z80hl);
	var y1 = getR16(z80de);
	var x2 = z80read16(0x7967);
	var y2 = z80read16(0x7969);

	line(x1, y1, x2, y2, z80read8(0x777f));
	return 5000;
}

/*
	四角を描く (PC-G850専用)
*/
function iocs_0d_ffd6() {
	var x1 = getR16(z80hl);
	var y1 = getR16(z80de);
	var x2 = z80read16(0x7967);
	var y2 = z80read16(0x7969);

	setR16(z80de, y2);
	box(x1, y1, x2, y2, z80read8(0x777f));
	return 6000;
}

/*
	塗りつぶした四角を描く (PC-G850専用)
*/
function iocs_0d_ffd9()
{
	var x1 = getR16(z80hl);
	var y1 = getR16(z80de);
	var x2 = z80read16(0x7967);
	var y2 = z80read16(0x7969);

	setR16(z80de, y2);
	boxfill(x1, y1, x2, y2, Z80read8(0x777f));
	return 10000;
}

/*
	文字を描く (PC-G850専用) (subroutineの下請け)
*/
function iocs_0e_ffa3() {
	var x = z80read16(0x79db);
	var y = z80read16(0x79dd);

	z80write8(0x79db, z80read8(0x79db) + 1);
	if(z80read8(0x79db) == 0)
		z80write8(0x79db, z80read8(0x79db) + 1);

	setR16(z80hl, x);
	setR16(z80de, y & 0xff80);
	gprint(x, y, z80af[0]);
	return 3000;
}

/*
	グラフィック処理 (PC-G850専用)
*/
function iocs_bb6b() {
	var page = z80read8(z80pc + 3);
	var address = z80read16(z80pc + 4);

	z80pc = z80read16(z80sp) - 3;
	z80sp += 2;

	switch(page) {
	case 0x0d:
		switch(address) {
		case 0xc76e:
		case 0xffd0:
			return iocs_0d_ffd0();
		case 0xc595:
		case 0xffd3:
			return iocs_0d_ffd3();
		case 0xc442:
		case 0xffd6:
			return iocs_0d_ffd6();
		case 0xc4cb:
		case 0xffd9:
			return iocs_0d_ffd9();
		}
		break;
	case 0x0e:
		switch(address) {
		case 0xca08:
		case 0xffca:
			return iocs_0e_ffca();
		case 0xc92e:
		case 0xffa3:
			return iocs_0e_ffa3();
		}
		break;
	}

	return 1000;
}

/*
	割り込み先 (PC-G850専用)
*/
function iocs_bc37() {
	z80hlt = false;
	z80iff  = 3;
	interruptMask = 0x0f;

	return 1000;
}

/*
	押されているキーのASCIIコードを得る(waitあり) (PC-G850専用)
*/
function iocs_bcc4() {
	var key;

	if((key = gkeyToAscii(getKeyWait(), true)) == GKEY_NONE)
		return 0;

	z80af[0] = key;
	z80af[1] = 0x01 | destroy8();
	z80bc[0] = 0;
	z80bc[1] = destroy8();
	z80hl[0] = destroy8();
	z80hl[1] = destroy8();
	z80bc_d[0] = destroy8();
	z80bc_d[1] = destroy8();
	z80de_d[0] = destroy8();
	z80de_d[1] = destroy8();
	z80hl_d[0] = destroy8();
	z80hl_d[1] = destroy8();

	return 100000;
}

/*
	押されているキーを得る(waitなし)
*/
function iocs_be53() {
	var key = getKey();

	z80af[0] = key;
	if(key) {
		z80af[1] = destroy8() | 0x01;
		z80bc[0] = destroy8();
	} else
		z80af[1] = destroy8() & ~0x01;
	z80bc_d[0] = destroy8();
	z80bc_d[1] = destroy8();
	z80de_d[0] = destroy8();
	z80de_d[1] = destroy8();
	z80hl_d[0] = destroy8();
	z80hl_d[1] = destroy8();

	return 30000;
}

/*
	キーコードをASCIIコードに変換する
*/
function iocs_be56() {
	if(z80read8(0x78f0) & 0x08) {
		z80bc[0] = z80af[0];
		z80af[1] = 0x10;
	} else {
		z80af[0] = gkeyToAscii(z80af[0], z80read8(0x7901) & 0x02);
		z80af[1] = 0x44;
	}

	return 500;
}

/*
	1文字表示する(記号あり)
*/
function iocs_be5f() {
	if(z80de[1] >= vramCols || z80de[0] >= vramRows)
		return 100;

	putChar(z80de, z80af[0]);

	z80af[0] = destroy8();
	z80af[1] = destroy8();
	z80bc[0] = 0;
	z80bc[1] = destroy8();
	z80hl[0] = destroy8();
	z80hl[1] = destroy8();

	return 1800;
}

/*
	1文字表示する(記号なし)
*/
function iocs_be62() {
	if(z80de[1] >= vramCols || z80de[0] >= vramRows)
		return 100;

	putChar(z80de, (z80af[0] >= 0x20 ? z80af[0]: 0x20));

	z80af[0] = destroy8();
	z80af[1] = destroy8();
	z80bc[0] = 0;
	z80bc[1] = destroy8();
	z80hl[0] = destroy8();
	z80hl[1] = destroy8();

	return 1800;
}

/*
	下にスクロールする
*/
function iocs_be65() {
	if(z80de[1] >= vramCols || z80de[0] >= vramRows)
		return 100;

	scrollDown(z80de);

	z80af[0] = destroy8();
	z80af[1] = destroy8();
	z80bc[0] = 0;
	z80bc[1] = 0;
	z80de[0] = destroy8();
	z80de[1] = destroy8();
	z80hl[0] = destroy8();
	z80hl[1] = destroy8();

	return 5000;
}

/*
	押されているキーを得る(waitあり)
*/
function iocs_bcfd() {
	var key;

	if((key = getKeyWait()) == GKEY_NONE)
		return 0;

	z80af[0] = key;
	z80af[1] = destroy8() | 0x01;
	z80bc_d[0] = destroy8();
	z80bc_d[1] = destroy8();
	z80de_d[0] = destroy8();
	z80de_d[1] = destroy8();
	z80hl_d[0] = destroy8();
	z80hl_d[1] = destroy8();

	return 20000;
}

/*
	16進数2桁のキー入力を得る
*/
function iocs_bd09()
{
	/* 未対応 */
	return 100000;
}

/*
	16進数4桁のキー入力を得る
*/
function iocs_bd0f()
{
	/* 未対応 */
	return 100000;
}

/*
	パターンを表示する
*/
function iocs_bfd0() {
	if(z80de[1] >= vramCols || z80de[0] >= vramRows || z80bc[0] == 0)
		return 100;

	putPattern(z80de, ram, getR16(z80hl), z80bc[0]);

	var state = 100 + 170 * z80bc[0];

	z80af[0] = z80read8(getR16(z80hl));
	z80de[1] += z80bc[0];
	setR16(z80hl, getR16(z80hl) + z80bc[0] - 1);
	z80bc[0] = 0;
	z80af[1] = destroy8();

	return state;
}

/*
	上にスクロールする
*/
function iocs_bfeb() {
	scrollUp();

	z80af[0] = 0;
	z80af[1] = 0x44;
	z80bc[0] = 0;
	z80hl[0] = destroy8();
	z80hl[1] = destroy8();

	return 5000;
}

/*
	n個の文字を表示する
*/
function iocs_bfee() {
	if(z80de[1] >= vramCols || z80de[0] >= vramRows || z80bc[0] == 0)
		return 100;

	var state = 100 + 1800 * z80bc[0];

	putChar(z80de, z80af[0]);
	while(--z80bc[0])
		putCharNext(z80de, z80af[0]);

	z80af[0] = 0;
	z80af[1] = destroy8();
	z80hl[0] = destroy8();
	z80hl[1] = destroy8();

	return state;
}

/*
	文字列を表示する
*/
function iocs_bff1() {
	if(z80de[1] >= 24 || z80de[0] >= 6 || z80bc[0] == 0)
		return 100;

	var state = 100 + 1800 * z80bc[0];

	z80bc[1] = 0;
	putChar(z80de, z80read8(getR16(z80hl)));
	while(--z80bc[0])
		if(putCharNext(z80de, z80read8(incR16(z80hl))))
			z80bc[1]++;

	z80af[0] = destroy8();
	z80af[1] = destroy8();

	return state;
}

/*
	起動する
*/
function iocs_bff4() {
	throw new Error("RESTART REQUIRED");
	return 0;
}

/*
	電源を切る
*/
function iocs_c110()
{
	throw new Error("SHUTDOWN");
	return 0;
}

/*
	IOCSをエミュレートする
*/
function z80subroutine(address) {
	if(romBanks > 0)
		return -1;
	if(address < 0x8000)
		return -1;

	switch(address) {
	case 0x0030:
		return iocs_bd03();
	case 0xbe53:
		return iocs_be53();
	case 0xbe56:
		return iocs_be56()
	case 0xbe5f:
		return iocs_be5f();
	case 0xbe62:
		return iocs_be62();
	case 0xbe65:
		return iocs_be65();
	case 0xbcfd:
		return iocs_bcfd();
	case 0xbd03:
		return iocs_bd03();
	case 0xbd09:
		return iocs_bd09();
	case 0xbd0f:
		return iocs_bd0f();
	case 0xbfd0:
		return iocs_bfd0();
	case 0xbfeb:
		return iocs_bfeb();
	case 0xbfee:
		return iocs_bfee();
	case 0xbff1:
		return iocs_bff1();
	case 0xbff4:
		return iocs_bff4();
	case 0xc110:
		return iocs_c110();
	}

	switch(machine) {
	case MACHINE_E200:
		break;
	case MACHINE_G815:
		switch(address) {
		case 0x93cd:
		case 0x9490:
			return iocs_9490();
		}
		break;
	case MACHINE_G850:
		switch(address) {
		case 0x8aad:
			return iocs_8aad();
		case 0x93cb:
		case 0x93cd:
		case 0xbb6b:
			return iocs_bb6b();
		case 0xbc37:
			return iocs_bc37();
		case 0xbcc4:
			return iocs_bcc4();
		}
		break;
	}

	return 1000;
}

/*
	起動をエミュレートする
*/
function boot() {
	z80reset();
	z80sp = 0x7ff6;

	z80outport(0x11, 0);
	z80outport(0x12, 0);
	z80outport(0x14, 0);
	z80outport(0x15, 1);
	z80outport(0x16, 0xff);
	z80outport(0x17, 0xf);
	z80outport(0x18, 0);
	z80outport(0x19, 1);
	z80outport(0x1b, 0);
	z80outport(0x1c, 1);
	timerInterval = 388643
	z80im = 1;

	z80write8(0x0000, 0xc3);
	z80write8(0x0001, 0xf4);
	z80write8(0x0002, 0xbf);
	z80write8(0x0008, 0xc9);
	z80write8(0x0010, 0xc9);
	z80write8(0x0018, 0xc9);
	z80write8(0x0020, 0xc9);
	z80write8(0x0028, 0xc9);
	z80write8(0x0030, 0xc3);
	z80write8(0x0031, 0x03);
	z80write8(0x0032, 0xdb);
	z80write8(0x0038, 0xc9);
	if(arg["machine"] == "g850" || arg["machine"] === undefined) {
		z80write8(0x0038, 0xc3);
		z80write8(0x0039, 0x37);
		z80write8(0x003a, 0xbc);
	}
	z80write8(0x790d, 0);
	z80write8(0x7a9d, Math.floor(Math.random() * 255));
	z80write16(0x7ffe, 0x76e3);

	switch(machine) {
	case MACHINE_E200:
		z80outport(0x58, 0xc0);
		break;
	case MACHINE_G815:
		z80outport(0x50, 0xc0);
		break;
	case MACHINE_G850:
		if(z80read8(0x779c) < 0x07 || z80read8(0x779c) > 0x1f)
			z80write8(0x779c, 0x1f);
		z80outport(0x40, 0x24);
		z80outport(0x40, z80read8(0x790d) + 0x40);
		z80outport(0x40, z80read8(0x779c) + 0x80);
		z80outport(0x40, 0xa0);
		z80outport(0x40, 0xa4);
		z80outport(0x40, 0xa6);
		z80outport(0x40, 0xa9);
		z80outport(0x40, 0xaf);
		z80outport(0x40, 0xc0);
		z80outport(0x40, 0x25);
		z80outport(0x60, 0);
		z80outport(0x61, 0xff);
		z80outport(0x62, 0);
		z80outport(0x64, 0);
		z80outport(0x65, 1);
		z80outport(0x66, 1);
		z80outport(0x67, 0);
		z80outport(0x6b, 4);
		z80outport(0x6c, 0);
		z80outport(0x6d, 0);
		z80outport(0x6e, 4);
		break;
	}
}

/*
	パラメータを得る
*/
function getArg() {
	var scripts = document.getElementsByTagName("script");
	var src = scripts[scripts.length - 1].src;
	var params = src.substr(src.indexOf("?") + 1).split("&");
	var arg = new Array();

	for(var i = 0; i < params.length; i++) {
		var param = params[i].split("=");
		arg[param[0]] = param[1];
	}

	return arg;
}

/* Canvasのコンテキスト */
var canvas;

/* Audioのコンテキスト */
var audio;

/* Audioバッファ */
var audioBuffer;

/* Audio Source */
var audioSource;

/* パラメータ */
var arg = getArg();

/* LCDの倍率 */
var zoom;

/* 幅 */
var width;

/* 高さ */
var height;

/* LCDのイメージデータ */
var lcdImage;

/* LCD濃度の最小値 */
var lcdScaleMin = 0x11;

/* LCD濃度の最大値 */
var lcdScaleMax = 0xee;

/* 1階調あたりのLCD表示回数 */
var lcdCountPerScale;

/* 1表示回あたりのLCD濃度 */
var lcdScalePerPage;

/* LCDの階調数 */
var lcdScales;

/* LCD表示回数カウンタ */
var lcdCount;

/* LCDパターンの数 */
var lcdPages;

/* 描画中のLCDパターンの番号 */
var lcdPage;

/* LCDのパターン */
var lcdPattern;

/* 更新中か? */
var inRun = false;

/* JavaScriptのキーコードからPC-G800のキーコードへの変換 */
var jskeyToGkey = new Array(
	0,	/* 0 */
	0,	/* 1 */
	0,	/* 2 */
	0,	/* 3 */
	0,	/* 4 */
	0,	/* 5 */
	0,	/* 6 */
	0,	/* 7 */
	GKEY_BACKSPACE,	/* 8 BackSpace */
	GKEY_TAB,	/* 9 Tab */
	0,	/* 10 */
	0,	/* 11 */
	0,	/* 12 */
	GKEY_RETURN,	/* 13 Enter */
	0,	/* 14 */
	0,	/* 15 */
	GKEY_SHIFT,	/* 16 Shift */
	GKEY_CAPS,	/* 17 Ctrl */
	GKEY_KANA,	/* 18 Alt */
	GKEY_BREAK,	/* 19 Pause */
	0,	/* 20 */
	0,	/* 21 */
	0,	/* 22 */
	0,	/* 23 */
	0,	/* 24 */
	0,	/* 25 */
	0,	/* 26 */
	0,	/* 27 Escape */
	0,	/* 28 変換 */
	0,	/* 29 無変換 */
	0,	/* 30 */
	0,	/* 31*/
	GKEY_SPACE,	/* 32 Space */
	GKEY_RCM,	/* 33 Page Up */
	GKEY_MPLUS,	/* 34 Page Down */
	0,	/* 35 End */
	GKEY_CLS,	/* 36 Home */
	GKEY_LEFT,	/* 37 ← */
	GKEY_UP,	/* 38 ↑ */
	GKEY_RIGHT,	/* 39 → */
	GKEY_DOWN,	/* 40 ↓ */
	0,	/* 41 */
	0,	/* 42 */
	0,	/* 43 */
	0,	/* 44 */
	GKEY_INSERT,	/* 45 Insert */
	GKEY_BACKSPACE,	/* 46 Delete */
	0,	/* 47 */
	GKEY_0,	/* 48 0 */
	GKEY_1,	/* 49 1 */
	GKEY_2,	/* 50 2 */
	GKEY_3,	/* 51 3 */
	GKEY_4,	/* 52 4 */
	GKEY_5,	/* 53 5 */
	GKEY_6,	/* 54 6 */
	GKEY_7,	/* 55 7 */
	GKEY_8,	/* 56 8 */
	GKEY_9,	/* 57 9 */
	GKEY_ASTER,	/* 58 */
	GKEY_PLUS,	/* 59 */
	0,	/* 60 */
	0,	/* 61 */
	0,	/* 62 */
	0,	/* 63 */
	new Uint8Array([GKEY_SHIFT,GKEY_P]),	/* SHIFT+P */
	GKEY_A,	/* 65 A */
	GKEY_B,	/* 66 B */
	GKEY_C,	/* 67 C */
	GKEY_D,	/* 68 D */
	GKEY_E,	/* 69 E */
	GKEY_F,	/* 70 F */
	GKEY_G,	/* 71 G */
	GKEY_H,	/* 72 H */
	GKEY_I,	/* 73 I */
	GKEY_J,	/* 74 J */
	GKEY_K,	/* 75 K */
	GKEY_L,	/* 76 L */
	GKEY_M,	/* 77 M */
	GKEY_N,	/* 78 N */
	GKEY_O,	/* 79 O */
	GKEY_P,	/* 80 P */
	GKEY_Q,	/* 81 Q */
	GKEY_R,	/* 82 R */
	GKEY_S,	/* 83 S */
	GKEY_T,	/* 84 T */
	GKEY_U,	/* 85 U */
	GKEY_V,	/* 86 V */
	GKEY_W,	/* 87 W */
	GKEY_X,	/* 88 X */
	GKEY_Y,	/* 89 Y */
	GKEY_Z,	/* 90 Z */
	0,	/* 91 左 GUI */
	0,	/* 92 右 GUI */
	0,	/* 93 Menu */
	0,	/* 94 */
	0,	/* 95 */
	GKEY_0,	/* 96 Numpad 0 */
	GKEY_1,	/* 97 Numpad 1 */
	GKEY_2,	/* 98 Numpad 2 */
	GKEY_3,	/* 99 Numpad 3 */
	GKEY_4,	/* 100 Numpad 4 */
	GKEY_5,	/* 101 Numpad 5 */
	GKEY_6,	/* 102 Numpad 6 */
	GKEY_7,	/* 103 Numpad 7 */
	GKEY_8,	/* 104 Numpad 8 */
	GKEY_9,	/* 105 Numpad  9*/
	GKEY_ASTER,	/* 106 Numpad * */
	GKEY_PLUS,	/* 107 Numpad + */
	0,	/* 108 */
	GKEY_MINUS,	/* 109 Numpad - */
	GKEY_PERIOD,	/* 110 Numpad . */
	GKEY_SLASH,	/* 111 Numpad / */
	0,	/* 112 F1 */
	0,	/* 113 F2 */
	0,	/* 114 F3 */
	0,	/* 115 F4 */
	0,	/* 116 F5 */
	0,	/* 117 F6 */
	0,	/* 118 F7 */
	0,	/* 119 F8 */
	0,	/* 120 F9 */
	0,	/* 121 F10 */
	0,	/* 122 F11 */
	0,	/* 123 F12 */
	0,	/* 124 */
	0,	/* 125 */
	0,	/* 126 */
	0,	/* 127 */
	0,	/* 128 */
	0,	/* 129 */
	0,	/* 130 */
	0,	/* 131 */
	0,	/* 132 */
	0,	/* 133 */
	0,	/* 134 */
	0,	/* 135 */
	0,	/* 136 */
	0,	/* 137 */
	0,	/* 138 */
	0,	/* 139 */
	0,	/* 140 */
	0,	/* 141 */
	0,	/* 142 */
	0,	/* 143 */
	0,	/* 144 Num Lock */
	0,	/* 145 Scroll Lock */
	0,	/* 146 */
	0,	/* 147 */
	0,	/* 148 */
	0,	/* 149 */
	0,	/* 150 */
	0,	/* 151 */
	0,	/* 152 */
	0,	/* 153 */
	0,	/* 154 */
	0,	/* 155 */
	0,	/* 156 */
	0,	/* 157 */
	0,	/* 158 */
	0,	/* 159 */
	GKEY_HAT,	/* 160 */
	0,	/* 161 */
	0,	/* 162 */
	0,	/* 163 */
	0,	/* 164 */
	0,	/* 165 */
	0,	/* 166 */
	0,	/* 167 */
	0,	/* 168 */
	0,	/* 169 */
	0,	/* 170 */
	0,	/* 171 */
	0,	/* 172 */
	GKEY_MINUS,	/* 173 */
	0,	/* 174 */
	0,	/* 175 */
	0,	/* 176 */
	0,	/* 177 */
	0,	/* 178 */
	0,	/* 179 */
	0,	/* 180 */
	0,	/* 181 */
	0,	/* 182 */
	0,	/* 183 */
	0,	/* 184 */
	0,	/* 185 */
	GKEY_ASTER,	/* 186 : */
	GKEY_SEMICOLON,	/* 187 ; */
	GKEY_COMMA,	/* 188 , */
	GKEY_MINUS,	/* 189 - */
	GKEY_PERIOD,	/* 190 . */
	GKEY_SLASH,	/* 191 / */
	0,	/* 192 @ */
	0,	/* 193 */
	0,	/* 194 */
	0,	/* 195 */
	0,	/* 196 */
	0,	/* 197 */
	0,	/* 198 */
	0,	/* 199 */
	0,	/* 200 */
	0,	/* 201 */
	0,	/* 202 */
	0,	/* 203 */
	0,	/* 204 */
	0,	/* 205 */
	0,	/* 206 */
	0,	/* 207 */
	0,	/* 208 */
	0,	/* 209 */
	0,	/* 210 */
	0,	/* 211 */
	0,	/* 212 */
	0,	/* 213 */
	0,	/* 214 */
	0,	/* 215 */
	0,	/* 216 */
	0,	/* 217 */
	0,	/* 218 */
	GKEY_LKAKKO,	/* 219 */
	new Uint8Array([GKEY_SHIFT,GKEY_G]),	/* 220 \*/
	GKEY_RKAKKO,	/* 221 */
	GKEY_HAT,	/* 222 */
	0,	/* 223 */
	0,	/* 224 */
	0,	/* 225 */
	0,	/* 226 */
	0,	/* 227 */
	0,	/* 228 */
	0,	/* 229 */
	0,	/* 230 */
	0,	/* 231 */
	0,	/* 232 */
	0,	/* 233 */
	0,	/* 234 */
	0,	/* 235 */
	0,	/* 236 */
	0,	/* 237 */
	0,	/* 238 */
	0,	/* 239 */
	0,	/* 240 */
	0,	/* 241 */
	GKEY_KANA,	/* 242 カタカナ/ひらがな */
	0,	/* 243 */
	0,	/* 244 全角/半角 */
	0,	/* 245 */
	0,	/* 246 */
	0,	/* 247 */
	0,	/* 248 */
	0,	/* 249 */
	0,	/* 250 */
	0,	/* 251 */
	0,	/* 252 */
	0,	/* 253 */
	0,	/* 254 */
	0	/* 255 */
);

/* JavaScriptのキー名とキーコードの対応 */
var nameToJskey = new Array();
nameToJskey["backspace"] = 8;
nameToJskey["tab"] = 9;
nameToJskey["enter"] = 13;
nameToJskey["shift"] = 16;
nameToJskey["ctrl"] = 17;
nameToJskey["alt"] = 18;
nameToJskey["pause"] = 19;
nameToJskey["caps"] = 20;
nameToJskey["escape"] = 27;
nameToJskey["space"] = 32;
nameToJskey["pageup"] = 33;
nameToJskey["pagedown"] = 34;
nameToJskey["end"] = 35;
nameToJskey["home"] = 36;
nameToJskey["left"] = 37;
nameToJskey["up"] = 38;
nameToJskey["right"] = 39;
nameToJskey["down"] = 40;
nameToJskey["insert"] = 45;
nameToJskey["delete"] = 46;
nameToJskey["0"] = 48;
nameToJskey["1"] = 49;
nameToJskey["2"] = 50;
nameToJskey["3"] = 51;
nameToJskey["4"] = 52;
nameToJskey["5"] = 53;
nameToJskey["6"] = 54;
nameToJskey["7"] = 55;
nameToJskey["8"] = 56;
nameToJskey["9"] = 57;
nameToJskey["a"] = 65;
nameToJskey["b"] = 66;
nameToJskey["c"] = 67;
nameToJskey["d"] = 68;
nameToJskey["e"] = 69;
nameToJskey["f"] = 70;
nameToJskey["g"] = 71;
nameToJskey["h"] = 72;
nameToJskey["i"] = 73;
nameToJskey["j"] = 74;
nameToJskey["k"] = 75;
nameToJskey["l"] = 76;
nameToJskey["m"] = 77;
nameToJskey["n"] = 78;
nameToJskey["o"] = 79;
nameToJskey["p"] = 80;
nameToJskey["q"] = 81;
nameToJskey["r"] = 82;
nameToJskey["s"] = 83;
nameToJskey["t"] = 84;
nameToJskey["u"] = 85;
nameToJskey["v"] = 86;
nameToJskey["w"] = 87;
nameToJskey["x"] = 88;
nameToJskey["y"] = 89;
nameToJskey["z"] = 90;
nameToJskey["lgui"] = 91;
nameToJskey["rgui"] = 92;
nameToJskey["menu"] = 93;
nameToJskey["numpad0"] = 96;
nameToJskey["numpad1"] = 97;
nameToJskey["numpad2"] = 98;
nameToJskey["numpad3"] = 99;
nameToJskey["numpad4"] = 100;
nameToJskey["numpad5"] = 101;
nameToJskey["numpad6"] = 102;
nameToJskey["numpad7"] = 103;
nameToJskey["numpad8"] = 104;
nameToJskey["numpad9"] = 105;
nameToJskey["numpad*"] = 106;
nameToJskey["numpad+"] = 107;
nameToJskey["numpad-"] = 109;
nameToJskey["numpad."] = 110;
nameToJskey["numpad/"] = 111;
nameToJskey["f1"] = 112;
nameToJskey["f2"] = 113;
nameToJskey["f3"] = 114;
nameToJskey["f4"] = 115;
nameToJskey["f5"] = 116;
nameToJskey["f6"] = 117;
nameToJskey["f7"] = 118;
nameToJskey["f8"] = 119;
nameToJskey["f9"] = 120;
nameToJskey["f10"] = 121;
nameToJskey["f11"] = 122;
nameToJskey["f12"] = 123;
nameToJskey["numlock"] = 144;
nameToJskey["scrolllock"] = 145;
nameToJskey["semicolon"] = 186;
nameToJskey["equal"] = 187;
nameToJskey[","] = 188;
nameToJskey["-"] = 189;
nameToJskey["."] = 190;
nameToJskey["/"] = 191;
nameToJskey["`"] = 192;
nameToJskey["["] = 219;
nameToJskey["\\"] = 220;
nameToJskey["]"] = 221;
nameToJskey["'"] = 222;

/* PC-G800のキー名とキーコードの対応 */
var nameToGkey = new Array();
nameToGkey["off"] = GKEY_OFF;
nameToGkey["q"] = GKEY_Q;
nameToGkey["w"] = GKEY_W;
nameToGkey["e"] = GKEY_E;
nameToGkey["r"] = GKEY_R;
nameToGkey["t"] = GKEY_T;
nameToGkey["y"] = GKEY_Y;
nameToGkey["u"] = GKEY_U;
nameToGkey["a"] = GKEY_A;
nameToGkey["s"] = GKEY_S;
nameToGkey["d"] = GKEY_D;
nameToGkey["f"] = GKEY_F;
nameToGkey["g"] = GKEY_G;
nameToGkey["h"] = GKEY_H;
nameToGkey["j"] = GKEY_J;
nameToGkey["k"] = GKEY_K;
nameToGkey["z"] = GKEY_Z;
nameToGkey["x"] = GKEY_X;
nameToGkey["c"] = GKEY_C;
nameToGkey["v"] = GKEY_V;
nameToGkey["b"] = GKEY_B;
nameToGkey["n"] = GKEY_N;
nameToGkey["m"] = GKEY_M;
nameToGkey[","] =   GKEY_COMMA;
nameToGkey["basic"] = GKEY_BASIC;
nameToGkey["text"] = GKEY_TEXT;
nameToGkey["capslock"] = GKEY_CAPS;
nameToGkey["kana"] = GKEY_KANA;
nameToGkey["tab"] = GKEY_TAB;
nameToGkey["space"] = GKEY_SPACE;
nameToGkey["down"] = GKEY_DOWN;
nameToGkey["up"] = GKEY_UP;
nameToGkey["left"] = GKEY_LEFT;
nameToGkey["right"] = GKEY_RIGHT;
nameToGkey["ans"] = GKEY_ANS;
nameToGkey["0"] = GKEY_0;
nameToGkey["."] = GKEY_PERIOD;
nameToGkey["="] = GKEY_EQUAL;
nameToGkey["+"] = GKEY_PLUS
nameToGkey["return"] = GKEY_RETURN;
nameToGkey["l"] = GKEY_L;
nameToGkey[";"] = GKEY_SEMICOLON;
nameToGkey["const"] = GKEY_CONST;
nameToGkey["1"] = GKEY_1;
nameToGkey["2"] = GKEY_2;
nameToGkey["3"] = GKEY_3;
nameToGkey["-"] = GKEY_MINUS;
nameToGkey["m+"] = GKEY_MPLUS;
nameToGkey["i"] = GKEY_I;
nameToGkey["o"] = GKEY_O;
nameToGkey["ins"] = GKEY_INSERT;
nameToGkey["4"] = GKEY_4;
nameToGkey["5"] = GKEY_5;
nameToGkey["6"] = GKEY_6;
nameToGkey["*"] = GKEY_ASTER;
nameToGkey["rcm"] = GKEY_RCM;
nameToGkey["p"] = GKEY_P;
nameToGkey["bs"] = GKEY_BACKSPACE;
nameToGkey["pi"] = GKEY_PI;
nameToGkey["7"] = GKEY_7;
nameToGkey["8"] = GKEY_8;
nameToGkey["9"] = GKEY_9;
nameToGkey["/"] =  GKEY_SLASH;
nameToGkey["("] = GKEY_LKAKKO;
nameToGkey["npr"] = GKEY_NPR;
nameToGkey["deg"] = GKEY_DEG;
nameToGkey["sqr"] = GKEY_SQR;
nameToGkey["squ"] = GKEY_SQU;
nameToGkey["^"] = GKEY_HAT;
nameToGkey[")"] = GKEY_RKAKKO;
nameToGkey["rcp"] = GKEY_RCP;
nameToGkey["mdf"] = GKEY_MDF;
nameToGkey["2ndf"] = GKEY_2NDF;
nameToGkey["sin"] = GKEY_SIN;
nameToGkey["cos"] = GKEY_COS;
nameToGkey["ln"] = GKEY_LN;
nameToGkey["log"] = GKEY_LOG;
nameToGkey["tan"] = GKEY_TAN;
nameToGkey["fe"] = GKEY_FE;
nameToGkey["cls"] = GKEY_CLS;
nameToGkey["on"] = GKEY_BREAK;
nameToGkey["shift"] = GKEY_SHIFT;

/*
	キーを押した
*/
function _keyPress(gkey) {
	if(gkey <= 0) {
		return;
	} else if(gkey <= GKEY_CLS) {
		var k = gkey - 1;

		if(keyMatrix[Math.floor(k / 8)] & (1 << (k % 8)))
			return;

		intIA = true;
		keyMatrix[Math.floor(k / 8)] |= (1 << (k % 8));
	} else if(gkey == GKEY_BREAK) {
		if(keyBreak)
			return;

		intKON = true;
		keyBreak |= 0x80;
	} else if(gkey == GKEY_SHIFT) {
		keyShift |= 0x01;
	} else if(gkey == GKEY_RESET) {
		keyReset = true;
	}
}

function keyPress(e) {
    if (document.activeElement.id.substr(0, 4) == "TEXT") {
        return;
    }
    var gkey = jskeyToGkey[e.keyCode];
	//console.log(e.keyCode);
    e.preventDefault();
    if (gkey instanceof Uint8Array) {
    	for(var i=0;i<gkey.length;i++) {
			_keyPress(gkey[i]);
		}
	} else {
		_keyPress(gkey);
	}
}

function _KeyRelease(gkey)
{
	if(gkey <= 0) {
		return;
	} else if(gkey <= GKEY_CLS) {
		var k = gkey - 1;

		keyMatrix[Math.floor(k / 8)] &= ~(1 << (k % 8));
	} else if(gkey == GKEY_BREAK) {
		keyBreak &= ~0x80;
	} else if(gkey == GKEY_SHIFT) {
		keyShift &= ~0x01;
	} else if(gkey == GKEY_RESET) {
		keyReset = false;
	}
}

/*
	キーを離した
*/
function keyRelease(e) {
	var gkey = jskeyToGkey[e.keyCode];
    if (document.activeElement.id.substr(0, 4) == "TEXT") {
        return;
    }
    e.preventDefault();
    if (gkey instanceof Uint8Array) {
    	for(var i=0;i<gkey.length;i++) {
			_KeyRelease(gkey[i]);
		}
	} else {
		_KeyRelease(gkey);
	}
}

var pat = new Uint8Array(6);
var lastpat = new Uint8Array(6);
/*
	1周期分実行する
*/
function run() {
	if(inRun)
		return;
	inRun = true;

	var pitch, dx, dy, x, y, i, j, k, p, q, r, mask, v, screen_x, screen_y, min_x, min_y, max_x, max_y, buf;

	if(wave != null) {
		if(audioSource != null)
			audioSource.stop();

		buf = audioBuffer.getChannelData(0);
		buf.set(wave, 0);
		audioSource = audio.createBufferSource();
		audioSource.buffer = audioBuffer;
		audioSource.connect(audio.destination);
		audioSource.start();

		if(wave[wave.length - 1] > 0)
			wave.set(waveOn);
		else
			wave.set(waveOff);
	}

	if(width > height) {
		dy = pitch = width * 4;
		dx = 4;
		p = 3;
	} else {
		dx = pitch = width * 4;
		dy = -4;
		p = pitch - zoom * 4 + 3;
	}

	min_x = width;
	min_y = height;
	max_x = max_y = 0;

	/* ブレークアドレス */
	bkpt = parseInt(document.getElementById('TEXT_BREAK').value, 16);
	bken  = document.getElementById('BKEN').checked;
	fetch = document.getElementById('FETCH').checked;
	for(k = 0; k < fpsN; k++) {
		/* プログラムを実行する */
		z80execute(clocks / (fps * fpsN),bken,bkpt);

		/* キー割り込み */
		if(intIA) {
			if((interruptMask & INTERRUPT_IA) != 0) {
				interruptType |= INTERRUPT_IA;
				z80int1();
			}
			intIA = false;
		}

		/* キー割り込み(BREAKキー) */
		if(intKON) {
			if((interruptMask & INTERRUPT_KON) != 0) {
				interruptType |= INTERRUPT_KON;
				z80int1();
			}
			intKON = false;
		}

		/* タイマ割り込み */
		if(timerCount-- <= 0) {
			timerCount = Math.floor(fps * timerInterval / 1000 / 1000);

			if((interruptMask & INTERRUPT_1S) != 0) {
				timer ^= 0x01;
				interruptType |= INTERRUPT_1S;
				z80int1();
			}
		}

		/* LCDを更新する */
		for(y = 0; y < lcdHeight; y++) {
			mask = 1 << ((lcdTop + y) % 8);
			r = (Math.floor((lcdTop + y) / 8) * vramWidth) % vram.length;

			q = p;

			for(x = 0; x < lcdWidth; x++) {
				if(lcdScales == 2)
					if(lcdEffectWhite)
						v = lcdScaleMin;
					else if(lcdEffectBlack)
						v = lcdScaleMax;
					else if(lcdEffectReverse)
						v = (vram[r++] & mask ? lcdScaleMin: lcdScaleMax);
					else
						v = (vram[r++] & mask ? lcdScaleMax: lcdScaleMin);
				else {
					if(lcdPattern[lcdPage][y][x])
						lcdCount[y][x]--;
					if(lcdEffectWhite)
						lcdPattern[lcdPage][y][x] = false;
					else if(lcdEffectBlack)
						lcdPattern[lcdPage][y][x] = true;
					else if(lcdEffectReverse)
						lcdPattern[lcdPage][y][x] = ((vram[r++] & mask) == 0);
					else
						lcdPattern[lcdPage][y][x] = ((vram[r++] & mask) != 0);
					if(lcdPattern[lcdPage][y][x])
						lcdCount[y][x]++;
					if(lcdScales == 0)
						v = lcdScaleMin + lcdScalePerPage * lcdCount[y][x];
					else
						v = lcdScaleMin + lcdScalePerPage * (Math.floor(lcdCount[y][x] / lcdCountPerScale) * lcdCountPerScale);
				}

				if(v != lcdImage.data[q]) {
					for(j = q; j != q + pitch * zoom; j += pitch)
						for(i = j; i != j + zoom * 4; i += 4)
							lcdImage.data[i] = v;

					screen_y = Math.floor(((q - 3) / 4) / width);
					screen_x = ((q - 3) / 4) % width;

					if(screen_y < min_y)
						min_y = screen_y;
					if(screen_y > max_y)
						max_y = screen_y;

					if(screen_x < min_x)
						min_x = screen_x;
					if(screen_x > max_x)
						max_x = screen_x;
				}

				if(machine == MACHINE_E200 && x % cellWidth == (cellWidth - 1))
					q += dx * zoom * 2;
				else
					q += dx * zoom;
			}

			if(machine == MACHINE_E200 && y % cellHeight == (cellHeight - 1))
				p += dy * zoom * 2;
			else
				p += dy * zoom;
		}

		lcdPage = (lcdPage + 1) % lcdPages;
	}

	if(min_x <= max_x && min_y <= max_y)
		canvas.putImageData(lcdImage, 0, 0, min_x, min_y, max_x - min_x + zoom, max_y - min_y + zoom);

	// ステータスインジケーター表示
	shift = lcdTop % 8;
	change = false;
	for (i=0;i<6;i++) {	
		p_vram0 = vram[((i + lcdTop / 8 + 0) % 8) * vramWidth + vramWidth - 1];
		p_vram1 = vram[((i + lcdTop / 8 + 1) % 8) * vramWidth + vramWidth - 1];
		pat[i] = p_vram0 >> shift | p_vram1 << (8 - shift);
		if (pat[i] != lastpat[i]) {
			change = true;
		}
	}
	sc = document.getElementById("seglcd");
	if (!z80hlt) {
		segcanvas.clearRect(0, 0, sc.width, sc.height);
		segcanvas.font = String(zoom*3)+"px gothic";
		if (change) {
			I = zoom*4;
			if (pat[0] & 0x02) segcanvas.fillText("RUN", 0, I*1);
			if (pat[0] & 0x08) segcanvas.fillText("PRO", 0, I*1);
			if (pat[0] & 0x40) segcanvas.fillText("TEXT", 0, I*1);
			if (pat[1] & 0x08) segcanvas.fillText("CASL", 0, I*1);
			if (pat[2] & 0x01) segcanvas.fillText("STAT", 0, I*1);
			if (pat[2] & 0x20) segcanvas.fillText("2ndF", 0, I*2);
			if (pat[2] & 0x80) segcanvas.fillText("M", 0, I*3);
			if (pat[3] & 0x04) segcanvas.fillText("CAPS", 0, I*4);
			if (pat[3] & 0x80) segcanvas.fillText("カナ", 0, I*5);
			if (pat[4] & 0x02) segcanvas.fillText("小", 0, I*6);
			degrad = "";
			if (pat[4] & 0x10) degrad += "DE";
			if (pat[4] & 0x40) degrad += "G";
			if (pat[5] & 0x01) degrad += "RAD";
			segcanvas.fillText(degrad, 0, I*7);
			if (pat[5] & 0x04) segcanvas.fillText("CONST", 0, I*8);
			if (pat[5] & 0x10) segcanvas.fillText("PRINT", 0, I*9);
			if (pat[5] & 0x40) segcanvas.fillText("BUSY", 0, I*10);
			if (pat[5] & 0x80) segcanvas.fillText("BATT", 0, I*11);
		}
	} else {
		segcanvas.clearRect(0, 0, sc.width, sc.height);
	}	

	inRun = false;
}

/*
	初期化する
*/
function init() {
	/* 機種を設定する */
	switch(arg["machine"]) {
	case "e200":
		machine = MACHINE_E200;
		clocks = (arg["clocks"] !== undefined ? Number(arg["clocks"]): 4000) * 1000;
		lcdCols = 24;
		lcdRows = 4;
		cellWidth = 5;
		cellHeight = 8;
		vramCols = 24;
		vramRows = 4;
		vramWidth = vramCols * cellWidth + 1;
		vramHeight = vramRows * cellHeight;
		break;
	case "g815":
		machine = MACHINE_G815;
		clocks = (arg["clocks"] !== undefined ? Number(arg["clocks"]): 4000) * 1000;
		lcdCols = 24;
		lcdRows = 4;
		cellWidth = 6;
		cellHeight = 8;
		vramCols = 24;
		vramRows = 4;
		vramWidth = vramCols * cellWidth + 1;
		vramHeight = vramRows * cellHeight;
		break;
	case "g850":
	case undefined:
		machine = MACHINE_G850;
		clocks = (arg["clocks"] !== undefined ? Number(arg["clocks"]): 9000) * 1000;
		lcdCols = 24;
		lcdRows = 6;
		cellWidth = 6;
		cellHeight = 8;
		vramCols = 24;
		vramRows = 8;
		vramWidth = vramCols * cellWidth + 1;
		vramHeight = vramRows * cellHeight;
		break;
	}
	lcdWidth = lcdCols * cellWidth;
	lcdHeight = lcdRows * cellHeight;
	vram = new Uint8Array(vramWidth * vramHeight / 8);

	/* LCDの大きさを設定する */
	zoom = (arg["zoom"] !== undefined ? arg["zoom"]: 1);
	width = lcdWidth * zoom;
	height = lcdHeight * zoom;
	if(machine == MACHINE_E200) {
		width += (lcdCols - 1) * zoom;
		height += (lcdRows - 1) * zoom;
	}

	/* LCDの向きを設定する */
	if(arg["orient"] == "v") {
		var tmp = width;
		width = height;
		height = tmp;
	}

	/* 1秒あたりの更新回数を設定する */
	fps = Number(arg["fps"] !== undefined ? arg["fps"]: 60);
	if(lcdScales != 2 && fps > 60)
		fps = Math.floor(fps / 60) * 60;

	/* LCDの階調数を設定する */
	lcdScales = Number(arg["lcdscales"] !== undefined ? arg["lcdscales"]: 2);
	if(lcdScales != 2 && fps > 60) {
		fpsN = Math.floor(fps / 60);
		fps = fpsN * 60;
	} else
		fpsN = 1;

	/* Canvasを生成する */
	var segwidth = zoom*8;
	document.write("<canvas id=\"lcd\" width=\"" + width + "\" height=\"" + height + "\" style=\"background-color: #b9e3c7\"></canvas>");
	document.write("<canvas id=\"seglcd\" width=\"" + segwidth + "\" height=\"" + height + "\" style=\"background-color: #b9e3c7\"></canvas>");
	canvas = document.getElementById("lcd").getContext("2d");
	segcanvas = document.getElementById("seglcd").getContext("2d");

	/* LCDを初期化する */
	lcdPage = 0;
	lcdPages = Math.floor(fps * fpsN / 8);
	lcdScalePerPage = Math.round((lcdScaleMax - lcdScaleMin) / lcdPages);
	if(lcdScales > 0)
		lcdCountPerScale = Math.floor((lcdPages + 1) / lcdScales);

	lcdPattern = new Array();
	for(var i = 0; i < lcdPages; i++) {
		lcdPattern[i] = new Array();

		for(var y = 0; y < lcdHeight; y++) {
			lcdPattern[i][y] = new Array();

			for(var x = 0; x < lcdWidth; x++)
				lcdPattern[i][y][x] = false;
		}
	}

	lcdCount = new Array();
	for(y = 0; y < lcdHeight; y++) {
		lcdCount[y] = new Array();

		for(x = 0; x < lcdWidth; x++)
			lcdCount[y][x] = 0;
	}

	lcdImage = canvas.createImageData(width, height);
	for(i = 0; i < lcdImage.data.length; i += 4) {
		lcdImage.data[i] =
		lcdImage.data[i + 1] =
		lcdImage.data[i + 2] =
		lcdImage.data[i + 3] = 0;
	}
	canvas.putImageData(lcdImage, 0, 0);

	/* 音声を初期化する */
	wave = null;

	if(arg["buzzer"] == "y") {
		try {
			try {
				audio = new window.AudioContext();
			} catch(e) {
				audio = new window.webkitAudioContext();
			}
		} catch(e2) {
			audio = null;
		}

		if(audio != null) {
			wave = new Float32Array(Math.floor(44100 / fps * 2));
			waveOff = new Float32Array(wave.length);
			waveOn = new Float32Array(wave.length);
			for(i = 0; i < wave.length; i++) {
				waveOff[i] = -1.0;
				waveOn[i] = 1.0;
			}
			wave.set(waveOff);
			audioBuffer = audio.createBuffer(1, wave.length, 44100);
			audioSource = null;
		}
	}

	/* キーバインドを初期化する */
	for(var jskey_name in arg) {
		if(nameToJskey[jskey_name] !== undefined) {
			jskeyToGkey[nameToJskey[jskey_name]] = nameToGkey[arg[jskey_name]];
		}
	}

	/* キー処理コールバックを登録する */
	document.addEventListener("keydown", keyPress, false);
	document.addEventListener("keyup", keyRelease, false);
}

var hex = new HexDecoder(ram);
init();
boot();
try {
	var hexrom ;
	var romfiles = new Array(
		"rom00.ihx",
		"rom01.ihx",
		"rom02.ihx",
		"rom03.ihx",
		"rom04.ihx",
		"rom05.ihx",
		"rom06.ihx",
		"rom07.ihx",
		"rom08.ihx",
		"rom09.ihx",
		"rom0a.ihx",
		"rom0b.ihx",
		"rom0c.ihx",
		"rom0d.ihx",
		"rom0e.ihx",
		"rom0f.ihx",
		"rom10.ihx",
		"rom11.ihx",
		"rom12.ihx",
		"rom13.ihx",
		"rom14.ihx",
		"rom15.ihx"
	);

	/* read from separate ihex file */
	/*
	for(var n=0;n<=0x15;n++){
		rom[n] = new Uint8Array(0x4000);
		hexrom = new HexDecoder(rom[n]);
		hexrom.read(romfiles[n]);
	}
	*/

	/* read from zip ihex */
	for(var n=0;n<=romfiles.length;n++){
		rom[n] = new Uint8Array(0x4000);
	}
	hexrom = new HexDecoder(rom);
	hexrom.readzip("rom.zip",romfiles);

	/* read from ram image */
	hex.read("ram.txt");

	/* read startup app image */
	if(arg["program"] !== undefined) {
		var program = arg["program"].split("|");
		for(var i = 0; i < program.length; i++)
			hex.read(program[i]);
	}
} catch(e) {
	alert("IntelHEXファイルの読み込みに失敗しました. " + e);
}
var start = z80pc = parseInt(arg["start"] === undefined ? "100": arg["start"], 16);
setInterval(function() { run(); }, 1000 / fps);
//run();

function pad00(padstr,s)
{
	var outs = padstr.substr(0,padstr.length - s.length) + s;
	return outs;
}

function memtoihx(start,end)
{
	var adr,sum,outstr,totalstr ;
	totalstr = "";
	for (adr=start;adr<=end;adr+=16)
	{
		/* ヘッダ */
		outstr = ":"

		/* データ長 */
		var datalen = 0x10;
		sum     = datalen
		outstr += pad00("00",datalen.toString(16).toUpperCase());

		/* アドレス */
		sum    += ((adr & 0xFF00) >> 8);
		sum    += (adr & 0x00FF);
		outstr += pad00("0000",adr.toString(16).toUpperCase());

		/* レコードタイプ */
		outstr += "00" ;

		/* データ */
		for (var i=0;i<16;i++){
			sum    += z80read8(adr+i) ;
			outstr += pad00("00",z80read8(adr+i).toString(16).toUpperCase());
		}

		/* チェックサム */
		sum = (~sum + 1) & 0xff;
		outstr += pad00("00",sum.toString(16).toUpperCase());

		/* 改行 */
		outstr += "\r\n";
		totalstr += outstr;
	}
	outstr = ":00000001FF\r\n";
	totalstr += outstr;
	return totalstr;
}

function downloadData(content, filename, mimetype) {
	console.log(content);
    if (arguments.length < 3) {
        mimetype = 'application/octet-stream';
    }

    var url = (window.URL || window.webkitURL).createObjectURL(new Blob([content], { 'type': mimetype }));
    var downloadLink = document.createElement('a');
	downloadLink.download = filename ;
	downloadLink.innerHTML = "My Hidden Link" ;
	downloadLink.href = url;
	/*downloadLink.onclick = destroyClickedElement*/
	downloadLink.style.display = "none";
	document.body.appendChild(downloadLink);
	downloadLink.click();

    /*a.target = '_blank';
    a.download = filename || '';
    a.href = url;
    a.click();*/

}

function loadData()
{
    var input = document.createElement('input');
    input.type = 'file';

    input.onchange = e => {

       // getting a hold of the file reference
       var file = e.target.files[0];

       // setting up the reader
       var reader = new FileReader();
       reader.readAsText(file,'UTF-8');

       // here we tell the reader what to do when it's done reading...
       reader.onload = readerEvent => {
          try {
	          var content = readerEvent.target.result; // this is the content!
	          //console.log( content );
	          var [top,size] = hex.decode(content); // load into ram
	          if ((top != null) && (size != null)) {
		          alert("Intel Hex Load Done\nTOP:"+pad00hex("0000",top)+" SIZE:"+pad00hex("0000",size));
	          } else {
		          alert("Load Error - Can't Load Content");
	          }
          } catch(e) {
		      alert("Load Error - Invalid HEX Format");
          }
       }

    }

    input.click();
}


/* disassemble (mdZ80) */
function disasm(addr,count)
{
	var disasmbuf = new Uint8Array(8);
	for(var i=0;i<count;i++){
		for (var h=0;h<8;h++){
			disasmbuf[h] = z80read8(addr+h);
		}
		r = disasmZ80( disasmbuf , addr , 0 ) ;
		console.log(r.line);
		addr += r.len ;
	}
	return addr;
}

/* memory dump */
function memdump(addr,count)
{
	var i,j;
	for (i = 0; i < count; i+=16 ) {
		var outs = pad00hex("0000",addr+i)+" :";
		for (j = i;j < i+16; j++) {
			outs += (" " + pad00hex("00",z80read8(addr+j)));
		}
		outs += " : " ;
		for (j = i;j < i+16; j++) {
			var v = z80read8(addr+j);
			if ((v > 0x20) && (v < 0x7F)) {
				outs += String.fromCharCode(v);
			} else {
				outs += ".";
			}
		}
		outs += "\r\n" ;
		console.log(outs);
	}
}

// console.log redirect
var oldconsole = console.log
console.log = function () {
  var logger = document.getElementById('TEXT_CONSOLE');
  for (var i = 0; i < arguments.length; i++) {
    if (typeof arguments[i] == 'object') {
        logger.value += (JSON && JSON.stringify ? JSON.stringify(arguments[i], undefined, 2) : arguments[i]);
    } else {
        logger.value += arguments[i];
    }
  }

  // scroll to end
  var pos = logger.value.length;
  logger.setSelectionRange(pos, pos);
  logger.scrollTop = logger.scrollHeight;
}

function consoleonoff()
{
  var logger = document.getElementById('TEXT_CONSOLE');
  if (logger.style.display != ""){
    logger.style.display = "";
  } else {
    logger.style.display = "none";
  }
}

function clearconsole()
{
  var logger = document.getElementById('TEXT_CONSOLE');
  logger.value = "";
}

// mdZ80 にも定義されている
function pad00hex(padstr,num)
{
	var str = num.toString(16).toUpperCase();
	var outs = padstr.substr(0,padstr.length - str.length) + str;
	return outs;
}

// S Z _ H _ P/V N C
const SFLAG = 0x80;
const ZFLAG = 0x40;
const HFLAG = 0x10;
const PVFLAG = 0x04;
const NFLAG = 0x02;
const CFLAG = 0x01;

function z80debug_log() {
 console.log(
 "HALT:" + z80hlt.toString() + " " +
 "BREAK:" + z80break.toString() + " " +
 "IM:" + z80im.toString(16) + " " +
 "IFF:" + z80iff.toString(16) + " " +
 "FLAGS:" +
 (z80af[1]&SFLAG ? "S" : "*") + " " +
 (z80af[1]&ZFLAG ? "Z" : "*") + " " +
 (z80af[1]&HFLAG ? "H" : "*") + " " +
 (z80af[1]&PVFLAG ? "P" : "*") + " " +
 (z80af[1]&NFLAG ? "N" : "*") + " " +
 (z80af[1]&CFLAG ? "C" : "*") + " " +
 "\n" +
 "AF=" + pad00hex("00",z80af[0]) + " " + pad00hex("00",z80af[1]) + " (AF'=" + pad00hex("00",z80af_d[0]) + " " + pad00hex("00",z80af_d[1]) + ") " +
 "BC=" + pad00hex("00",z80bc[0]) + " " + pad00hex("00",z80bc[1]) + " (BC'=" + pad00hex("00",z80bc_d[0]) + " " + pad00hex("00",z80bc_d[1]) + ")\n" +
 "DE=" + pad00hex("00",z80de[0]) + " " + pad00hex("00",z80de[1]) + " (DE'=" + pad00hex("00",z80de_d[0]) + " " + pad00hex("00",z80de_d[1]) + ") " +
 "HL=" + pad00hex("00",z80hl[0]) + " " + pad00hex("00",z80hl[1]) + " (HL'=" + pad00hex("00",z80hl_d[0]) + " " + pad00hex("00",z80hl_d[1]) + ")\n" +
 "PC=" + pad00hex("0000",z80pc) + " " +
 "IX=" + pad00hex("0000",z80ix[0] << 8 | z80ix[1]) + " " +
 "IY=" + pad00hex("0000",z80iy[0] << 8 | z80iy[1]) + " " +
 "SP=" + pad00hex("0000",z80sp) + "\n"
/*
 + "lcdDisabled :"+lcdDisabled.toString()+"\n"+ // LCD OFF
 "lcdTop :"+lcdTop.toString(10)+"\n"+
 "lcdContrast :"+lcdContrast.toString()+"\n"+
 "lcdEffectMirror :"+lcdEffectMirror.toString()+"\n"+
 "lcdEffectBlack :"+lcdEffectBlack.toString()+"\n"+
 "lcdEffectReverse :"+lcdEffectReverse.toString()+"\n"+
 "lcdEffectDark :"+lcdEffectDark.toString()+"\n"+
 "lcdEffectWhite :"+lcdEffectWhite.toString()+"\n"+
 "lcdTrim :"+lcdTrim.toString()+"\n"
 */
 );
}

function poweron_seq()
{
	// Power OFF?
	lcdEffectWhite = false;
	lcdEffectBlack = false;
	if (z80hlt == true) {
		//boot();
		z80reset();
		z80sp = 0x7ff6;
		z80hlt = false;
	}
}

(window.onload = function() {
	var AllButtons = document.getElementsByTagName('button');
	for (var i=0;i<AllButtons.length;i++){
		AllButtons[i].addEventListener('mousedown' , function(e)
		{
			buttonHold(eval(e.target.value));
		});
		AllButtons[i].addEventListener('mouseup' , function(e)
		{
			buttonRelease(eval(e.target.value));
		});
		AllButtons[i].addEventListener('touchstart' , function(e)
		{
			buttonHold(eval(e.target.value));
		});
		AllButtons[i].addEventListener('touchend' , function(e)
		{
			buttonRelease(eval(e.target.value));
		});
	}
})();


/*
	フォントは門真なむさんのk6x8を一部変更して使用しています.

	--- k6x8のライセンス ------------------------------------------------------------------------------------------------------------------
	These fonts are free softwares.
	Unlimited permission is granted to use, copy, and distribute it, with or without modification, either commercially and noncommercially.
	THESE FONTS ARE PROVIDED "AS IS" WITHOUT WARRANTY.

	これらのフォントはフリー（自由な）ソフトウエアです。
	あらゆる改変の有無に関わらず、また商業的な利用であっても、自由にご利用、複製、再配布することができますが、全て無保証とさせていただきます。

	Copyright(C) 2000-2007 Num Kadoma
	---------------------------------------------------------------------------------------------------------------------------------------
*/

/*
	Copyright (c) 2017 maruhiro
	All rights reserved.

	Redistribution and use in source and binary forms,
	with or without modification, are permitted provided that
	the following conditions are met:

	 1. Redistributions of source code must retain the above copyright notice,
	    this list of conditions and the following disclaimer.

	 2. Redistributions in binary form must reproduce the above copyright notice,
	    this list of conditions and the following disclaimer in the documentation
	    and/or other materials provided with the distribution.

	THIS SOFTWARE IS PROVIDED ``AS IS'' AND ANY EXPRESS OR IMPLIED WARRANTIES,
	INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND
	FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL
	THE REGENTS OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
	SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
	PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS;
	OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY,
	WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR
	OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF
	ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/
