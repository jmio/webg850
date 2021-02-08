// mdZ80.h

// typedef struct _memargstr [
//	ushort staddr;				// 開始アドレス
//	ushort edaddr;				// 終了アドレス
//	int access;					// アクセス方法のフラグ
//	char *comment;				// コメントの内容
//] memargstr;

// typedef struct [
//	int		len;				// 命令長
//	int		index;				// オペランドが参照開始するデータの位置
//	int		nimonic;			// ニーモニック文字列の番号
//	int		op_num;				// オペランド数
//	int		op0_type;			// 第1オペランド
//	int		op1_type;			// 第2オペランド
//	int		acc_type;			// アクセスタイプ(リード/ライト/イン/アウト)
//] disZ80data;

// dis6502str.type = Address Type | Access Type;
// Address Type

const OT_NONE = 0 ;
const OT_REG_A = 1 ; // A Register
const OT_REG_B = 2 ; // B Register
const OT_REG_C = 3 ; // C Register
const OT_REG_D = 4 ; // D Register
const OT_REG_E = 5 ; // E Register
const OT_REG_H = 6 ; // H Register
const OT_REG_L = 7 ; // L Register
const OT_REG_F = 8 ; // F Register
const OT_REG_I = 9 ; // Interrupt Vector
const OT_REG_R = 10 ; // Refresh Counter
const OT_REG_AF = 11 ; // AF  Register
const OT_REG_RAF = 12 ; // AF' Register
const OT_REG_BC = 13 ; // BC  Register
const OT_REG_DE = 14 ; // DE  Register
const OT_REG_HL = 15 ; // HL  Register
const OT_REG_IX = 16 ; // HL  Register
const OT_REG_IXL = 17 ; // HL  Register
const OT_REG_IXH = 18 ; // HL  Register
const OT_REG_IY = 19 ; // HL  Register
const OT_REG_IYL = 20 ; // HL  Register
const OT_REG_IYH = 21 ; // HL  Register
const OT_REG_SP = 22 ; // SP  Register
const OT_PORT_C = 23 ; // PORT (C)
const OT_ABS_BC = 24 ; // ABS (BC)
const OT_ABS_DE = 25 ; // ABS (DE)
const OT_ABS_HL = 26 ; // ABS (HL)
const OT_ABS_IX = 27 ; // ABS (IX)
const OT_ABS_IY = 28 ; // ABS (IY)
const OT_ABS_SP = 29 ; // ABS (SP)
const OT_NZ = 30 ;
const OT_Z = 31 ;
const OT_NC = 32 ;
const OT_C = 33 ;
const OT_PO = 34 ;
const OT_PE = 35 ;
const OT_P = 36 ;
const OT_M = 37 ;
const OT_BIT_0 = 38 ;
const OT_BIT_1 = 39 ;
const OT_BIT_2 = 40 ;
const OT_BIT_3 = 41 ;
const OT_BIT_4 = 42 ;
const OT_BIT_5 = 43 ;
const OT_BIT_6 = 44 ;
const OT_BIT_7 = 45 ;
const OT_IM_0 = 46 ;
const OT_IM_1 = 47 ;
const OT_IM_2 = 48 ;
// hex byte data
const OT_IMM_BYTE = 0x0100 ;
const OT_RST = 0x0101 ;
const OT_IMM_PORT = 0x0102 ;
const OT_UND = 0x0103 ;
const OT_NUL = 0x0104 ;
// hex byte data(byte offset)
const OT_IDX_IX = 0x200 ;
const OT_IDX_IY = 0x201 ;
// hex word data(byte offset)
const OT_REL = 0x400 ;
// hex word data
const OT_IMM_WORD = 0x0800 ;
const OT_ABS = 0x801 ;


const ADT_MASK  = 0xff;

// Access Type
const ACT_NL = 0 ;
const ACT_RD = 1 ;
const ACT_WT = 2 ;
const ACT_OT = 4 ;
const ACT_IN = 8 ;
const ACT_AD = 0x4000 ;
const ACT_CL = 0x8000 ;

const ACT_RW = ( ACT_RD | ACT_WT );
const ACT_IO = ( ACT_IN | ACT_OT ) ;

// Name Type
const NMT_UND = 0 ;
const NMT_NUL = 1 ;
const NMT_LD = 2 ;
const NMT_PUSH = 3 ;
const NMT_POP = 4 ;
const NMT_EX = 5 ;
const NMT_EXX = 6 ;
const NMT_LDI = 7 ;
const NMT_LDIR = 8 ;
const NMT_LDD = 9 ;
const NMT_LDDR = 10 ;
const NMT_CPI = 11 ;
const NMT_CPIR = 12 ;
const NMT_CPD = 13 ;
const NMT_CPDR = 14 ;
const NMT_ADD = 15 ;
const NMT_ADC = 16 ;
const NMT_SUB = 17 ;
const NMT_SBC = 18 ;
const NMT_AND = 19 ;
const NMT_OR = 20 ;
const NMT_XOR = 21 ;
const NMT_CP = 22 ;
const NMT_INC = 23 ;
const NMT_DEC = 24 ;
const NMT_DAA = 25 ;
const NMT_CPL = 26 ;
const NMT_NEG = 27 ;
const NMT_CCF = 28 ;
const NMT_SCF = 29 ;
const NMT_NOP = 30 ;
const NMT_HALT = 31 ;
const NMT_DI = 32 ;
const NMT_EI = 33 ;
const NMT_IM = 34 ;
const NMT_RLCA = 35 ;
const NMT_RLA = 36 ;
const NMT_RRCA = 37 ;
const NMT_RRA = 38 ;
const NMT_RLC = 39 ;
const NMT_RL = 40 ;
const NMT_RRC = 41 ;
const NMT_RR = 42 ;
const NMT_SLA = 43 ;
const NMT_SLL = 44 ;
const NMT_SRA = 45 ;
const NMT_SRL = 46 ;
const NMT_RLD = 47 ;
const NMT_RRD = 48 ;
const NMT_BIT = 49 ;
const NMT_SET = 50 ;
const NMT_RES = 51 ;
const NMT_JP = 52 ;
const NMT_JR = 53 ;
const NMT_DJNZ = 54 ;
const NMT_CALL = 55 ;
const NMT_RET = 56 ;
const NMT_RETI = 57 ;
const NMT_RETN = 58 ;
const NMT_RST = 59 ;
const NMT_IN = 60 ;
const NMT_INI = 61 ;
const NMT_INIR = 62 ;
const NMT_IND = 63 ;
const NMT_INDR = 64 ;
const NMT_OUT = 65 ;
const NMT_OUTI = 66 ;
const NMT_OTIR = 67 ;
const NMT_OUTD = 68 ;
const NMT_OTDR = 69 ;

// MN Type
const INTEL = 0;
const MOTOROLA = 1;
const C_LANG = 2;

// end of MDZ80_H_

/*
 * Minachun Disassembler for Sega mkIII(SMS)
 *
 * (c) Manbow-J / RuRuRu
 */
const nimonic = [
	"db",
	"db",
	"ld",
	"push",
	"pop",
	"ex",
	"exx",
	"ldi",
	"ldir",
	"ldd",
	"lddr",
	"cpi",
	"cpir",
	"cpd",
	"cpdr",
	"add",
	"adc",
	"sub",
	"sbc",
	"and",
	"or",
	"xor",
	"cp",
	"inc",
	"dec",
	"daa",
	"cpl",
	"neg",
	"ccf",
	"scf",
	"nop",
	"halt",
	"di",
	"ei",
	"im",
	"rlca",
	"rla",
	"rrca",
	"rra",
	"rlc",
	"rl",
	"rrc",
	"rr",
	"sla",
	"sll",
	"sra",
	"srl",
	"rld",
	"rrd",
	"bit",
	"set",
	"res",
	"jp",
	"jr",
	"djnz",
	"call",
	"ret",
	"reti",
	"retn",
	"rst",
	"in",
	"ini",
	"inir",
	"ind",
	"indr",
	"out",
	"outi",
	"otir",
	"outd",
	"otdr",
];

const optype0 = [
	"",
	"a",
	"b",
	"c",
	"d",
	"e",
	"h",
	"l",
	"f",
	"i",
	"r",

	"af",
	"af'",
	"bc",
	"de",
	"hl",
	"ix",
	"ixl",
	"ixh",
	"iy",
	"iyl",
	"iyh",
	"sp",

	"(c)",

	"(bc)",
	"(de)",
	"(hl)",
	"(ix)",
	"(iy)",
	"(sp)",

	"nz",
	"z",
	"nc",
	"c",
	"po",
	"pe",
	"p",
	"m",

	"0",
	"1",
	"2",
	"3",
	"4",
	"5",
	"6",
	"7",

	"0",
	"1",
	"2",
];

const disz80 =
[
	[
		// 00-0F
		[  1, 0, NMT_NOP,	0,	OT_NONE,	OT_NONE,	ACT_NL	],
		[  3, 1, NMT_LD,	2,	OT_REG_BC,	OT_IMM_WORD,ACT_RD	],
		[  1, 1, NMT_LD,	2,	OT_ABS_BC,	OT_REG_A,	ACT_WT	],
		[  1, 0, NMT_INC,	1,	OT_REG_BC,	OT_NONE,	ACT_NL	],
		[  1, 0, NMT_INC,	1,	OT_REG_B,	OT_NONE,	ACT_NL	],
		[  1, 0, NMT_DEC,	1,	OT_REG_B,	OT_NONE,	ACT_NL	],
		[  2, 1, NMT_LD,	2,	OT_REG_B,	OT_IMM_BYTE,ACT_NL	],
		[  1, 0, NMT_RLCA,	0,	OT_NONE,	OT_NONE,	ACT_NL	],
		[  1, 0, NMT_EX,	2,	OT_REG_AF,	OT_REG_RAF,	ACT_NL	],
		[  1, 0, NMT_ADD,	2,	OT_REG_HL,	OT_REG_BC,	ACT_NL	],
		[  1, 0, NMT_LD,	2,	OT_REG_A,	OT_ABS_BC,	ACT_RD	],
		[  1, 0, NMT_DEC,	1,	OT_REG_BC,	OT_NONE,	ACT_NL	],
		[  1, 0, NMT_INC,	1,	OT_REG_C,	OT_NONE,	ACT_NL	],
		[  1, 0, NMT_DEC,	1,	OT_REG_C,	OT_NONE,	ACT_NL	],
		[  2, 1, NMT_LD,	2,	OT_REG_C,	OT_IMM_BYTE,ACT_NL	],
		[  1, 0, NMT_RRCA,	0,	OT_NONE,	OT_NONE,	ACT_NL	],
		// 10-1F
		[  2, 1, NMT_DJNZ,	1,	OT_REL,		OT_NONE		,ACT_NL	],
		[  3, 1, NMT_LD,	2,	OT_REG_DE,	OT_IMM_WORD	,ACT_NL	],
		[  1, 0, NMT_LD,	2,	OT_ABS_DE,	OT_REG_A	,ACT_WT	],
		[  1, 0, NMT_INC,	1,	OT_REG_DE,	OT_NONE		,ACT_NL	],
		[  1, 0, NMT_INC,	1,	OT_REG_D,	OT_NONE		,ACT_NL	],
		[  1, 0, NMT_DEC,	1,	OT_REG_D,	OT_NONE		,ACT_NL	],
		[  2, 1, NMT_LD,	2,	OT_REG_D,	OT_IMM_BYTE ,ACT_NL	],
		[  1, 0, NMT_RLA,	0,	OT_NONE,	OT_NONE		,ACT_NL	],
		[  2, 1, NMT_JR,	1,	OT_REL,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_ADD,	2,	OT_REG_HL,	OT_REG_DE	,ACT_NL	],
		[  1, 0, NMT_LD,	2,	OT_REG_A,	OT_ABS_DE	,ACT_RD	],
		[  1, 0, NMT_DEC,	1,	OT_REG_DE,	OT_NONE		,ACT_NL	],
		[  1, 0, NMT_INC,	1,	OT_REG_E,	OT_NONE		,ACT_NL	],
		[  1, 0, NMT_DEC,	1,	OT_REG_E,	OT_NONE		,ACT_NL	],
		[  2, 1, NMT_LD,	2,	OT_REG_E,	OT_IMM_BYTE ,ACT_NL	],
		[  1, 0, NMT_RRA,	0,	OT_NONE,	OT_NONE		,ACT_NL	],
		// 20-2F
		[  2, 1, NMT_JR,	2,	OT_NZ,		OT_REL		,ACT_NL	],
		[  3, 1, NMT_LD,	2,	OT_REG_HL,	OT_IMM_WORD	,ACT_NL	],
		[  3, 1, NMT_LD,	2,	OT_ABS,		OT_REG_HL	,ACT_WT	],
		[  1, 0, NMT_INC,	1,	OT_REG_HL,	OT_NONE		,ACT_NL	],
		[  1, 0, NMT_INC,	1,	OT_REG_H,	OT_NONE		,ACT_NL	],
		[  1, 0, NMT_DEC,	1,	OT_REG_H,	OT_NONE		,ACT_NL	],
		[  2, 1, NMT_LD,	2,	OT_REG_H,	OT_IMM_BYTE ,ACT_NL	],
		[  1, 0, NMT_DAA,	0,	OT_NONE,	OT_NONE		,ACT_NL	],
		[  2, 1, NMT_JR,	2,	OT_Z,		OT_REL		,ACT_NL	],
		[  1, 0, NMT_ADD,	2,	OT_REG_HL,	OT_REG_HL	,ACT_NL	],
		[  3, 1, NMT_LD,	2,	OT_REG_HL,	OT_ABS		,ACT_RD	],
		[  1, 0, NMT_DEC,	1,	OT_REG_HL,	OT_NONE		,ACT_NL	],
		[  1, 0, NMT_INC,	1,	OT_REG_L,	OT_NONE		,ACT_NL	],
		[  1, 0, NMT_DEC,	1,	OT_REG_L,	OT_NONE		,ACT_NL	],
		[  2, 1, NMT_LD,	2,	OT_REG_L,	OT_IMM_BYTE ,ACT_NL	],
		[  1, 0, NMT_CPL,	0,	OT_NONE,	OT_NONE		,ACT_NL	],
		// 30-3F
		[  2, 1, NMT_JR,	2,	OT_NC,		OT_REL		,ACT_NL	],
		[  3, 1, NMT_LD,	2,	OT_REG_SP,	OT_IMM_WORD	,ACT_NL	],
		[  3, 1, NMT_LD,	2,	OT_ABS,		OT_REG_A	,ACT_WT	],
		[  1, 0, NMT_INC,	1,	OT_REG_SP,	OT_NONE		,ACT_NL	],
		[  1, 0, NMT_INC,	1,	OT_ABS_HL,	OT_NONE		,ACT_WT	],
		[  1, 0, NMT_DEC,	1,	OT_ABS_HL,	OT_NONE		,ACT_WT	],
		[  2, 1, NMT_LD,	2,	OT_ABS_HL,	OT_IMM_BYTE ,ACT_NL	],
		[  1, 0, NMT_SCF,	0,	OT_NONE,	OT_NONE		,ACT_NL	],
		[  2, 1, NMT_JR,	2,	OT_C,		OT_REL		,ACT_NL	],
		[  1, 0, NMT_ADD,	2,	OT_REG_HL,	OT_REG_SP	,ACT_NL	],
		[  3, 1, NMT_LD,	2,	OT_REG_A,	OT_ABS		,ACT_RD	],
		[  1, 0, NMT_DEC,	1,	OT_REG_SP,	OT_NONE		,ACT_NL	],
		[  1, 0, NMT_INC,	1,	OT_REG_A,	OT_NONE		,ACT_NL	],
		[  1, 0, NMT_DEC,	1,	OT_REG_A,	OT_NONE		,ACT_NL	],
		[  2, 1, NMT_LD,	2,	OT_REG_A,	OT_IMM_BYTE ,ACT_NL	],
		[  1, 0, NMT_CCF,	0,	OT_NONE,	OT_NONE		,ACT_NL	],
		// 40-4F
		[  1, 0, NMT_LD,	2,	OT_REG_B,	OT_REG_B	,ACT_NL	],
		[  1, 0, NMT_LD,	2,	OT_REG_B,	OT_REG_C	,ACT_NL	],
		[  1, 0, NMT_LD,	2,	OT_REG_B,	OT_REG_D	,ACT_NL	],
		[  1, 0, NMT_LD,	2,	OT_REG_B,	OT_REG_E	,ACT_NL	],
		[  1, 0, NMT_LD,	2,	OT_REG_B,	OT_REG_H	,ACT_NL	],
		[  1, 0, NMT_LD,	2,	OT_REG_B,	OT_REG_L	,ACT_NL	],
		[  1, 0, NMT_LD,	2,	OT_REG_B,	OT_ABS_HL	,ACT_RD	],
		[  1, 0, NMT_LD,	2,	OT_REG_B,	OT_REG_A	,ACT_NL	],
		[  1, 0, NMT_LD,	2,	OT_REG_C,	OT_REG_B	,ACT_NL	],
		[  1, 0, NMT_LD,	2,	OT_REG_C,	OT_REG_C	,ACT_NL	],
		[  1, 0, NMT_LD,	2,	OT_REG_C,	OT_REG_D	,ACT_NL	],
		[  1, 0, NMT_LD,	2,	OT_REG_C,	OT_REG_E	,ACT_NL	],
		[  1, 0, NMT_LD,	2,	OT_REG_C,	OT_REG_H	,ACT_NL	],
		[  1, 0, NMT_LD,	2,	OT_REG_C,	OT_REG_L	,ACT_NL	],
		[  1, 0, NMT_LD,	2,	OT_REG_C,	OT_ABS_HL	,ACT_RD	],
		[  1, 0, NMT_LD,	2,	OT_REG_C,	OT_REG_A	,ACT_NL	],
		// 50-5F
		[  1, 0, NMT_LD,	2,	OT_REG_D,	OT_REG_B	,ACT_NL	],
		[  1, 0, NMT_LD,	2,	OT_REG_D,	OT_REG_C	,ACT_NL	],
		[  1, 0, NMT_LD,	2,	OT_REG_D,	OT_REG_D	,ACT_NL	],
		[  1, 0, NMT_LD,	2,	OT_REG_D,	OT_REG_E	,ACT_NL	],
		[  1, 0, NMT_LD,	2,	OT_REG_D,	OT_REG_H	,ACT_NL	],
		[  1, 0, NMT_LD,	2,	OT_REG_D,	OT_REG_L	,ACT_NL	],
		[  1, 0, NMT_LD,	2,	OT_REG_D,	OT_ABS_HL	,ACT_RD	],
		[  1, 0, NMT_LD,	2,	OT_REG_D,	OT_REG_A	,ACT_NL	],
		[  1, 0, NMT_LD,	2,	OT_REG_E,	OT_REG_B	,ACT_NL	],
		[  1, 0, NMT_LD,	2,	OT_REG_E,	OT_REG_C	,ACT_NL	],
		[  1, 0, NMT_LD,	2,	OT_REG_E,	OT_REG_D	,ACT_NL	],
		[  1, 0, NMT_LD,	2,	OT_REG_E,	OT_REG_E	,ACT_NL	],
		[  1, 0, NMT_LD,	2,	OT_REG_E,	OT_REG_H	,ACT_NL	],
		[  1, 0, NMT_LD,	2,	OT_REG_E,	OT_REG_L	,ACT_NL	],
		[  1, 0, NMT_LD,	2,	OT_REG_E,	OT_ABS_HL	,ACT_RD	],
		[  1, 0, NMT_LD,	2,	OT_REG_E,	OT_REG_A	,ACT_NL	],
		// 60-6F
		[  1, 0, NMT_LD,	2,	OT_REG_H,	OT_REG_B	,ACT_NL	],
		[  1, 0, NMT_LD,	2,	OT_REG_H,	OT_REG_C	,ACT_NL	],
		[  1, 0, NMT_LD,	2,	OT_REG_H,	OT_REG_D	,ACT_NL	],
		[  1, 0, NMT_LD,	2,	OT_REG_H,	OT_REG_E	,ACT_NL	],
		[  1, 0, NMT_LD,	2,	OT_REG_H,	OT_REG_H	,ACT_NL	],
		[  1, 0, NMT_LD,	2,	OT_REG_H,	OT_REG_L	,ACT_NL	],
		[  1, 0, NMT_LD,	2,	OT_REG_H,	OT_ABS_HL	,ACT_RD	],
		[  1, 0, NMT_LD,	2,	OT_REG_H,	OT_REG_A	,ACT_NL	],
		[  1, 0, NMT_LD,	2,	OT_REG_L,	OT_REG_B	,ACT_NL	],
		[  1, 0, NMT_LD,	2,	OT_REG_L,	OT_REG_C	,ACT_NL	],
		[  1, 0, NMT_LD,	2,	OT_REG_L,	OT_REG_D	,ACT_NL	],
		[  1, 0, NMT_LD,	2,	OT_REG_L,	OT_REG_E	,ACT_NL	],
		[  1, 0, NMT_LD,	2,	OT_REG_L,	OT_REG_H	,ACT_NL	],
		[  1, 0, NMT_LD,	2,	OT_REG_L,	OT_REG_L	,ACT_NL	],
		[  1, 0, NMT_LD,	2,	OT_REG_L,	OT_ABS_HL	,ACT_RD	],
		[  1, 0, NMT_LD,	2,	OT_REG_L,	OT_REG_A	,ACT_NL	],
		// 70-7F
		[  1, 0, NMT_LD,	2,	OT_ABS_HL,	OT_REG_B	,ACT_WT	],
		[  1, 0, NMT_LD,	2,	OT_ABS_HL,	OT_REG_C	,ACT_WT	],
		[  1, 0, NMT_LD,	2,	OT_ABS_HL,	OT_REG_D	,ACT_WT	],
		[  1, 0, NMT_LD,	2,	OT_ABS_HL,	OT_REG_E	,ACT_WT	],
		[  1, 0, NMT_LD,	2,	OT_ABS_HL,	OT_REG_H	,ACT_WT	],
		[  1, 0, NMT_LD,	2,	OT_ABS_HL,	OT_REG_L	,ACT_WT	],
		[  1, 0, NMT_HALT,	0,	OT_NONE,	OT_NONE		,ACT_NL	],
		[  1, 0, NMT_LD,	2,	OT_ABS_HL,	OT_REG_A	,ACT_WT	],
		[  1, 0, NMT_LD,	2,	OT_REG_A,	OT_REG_B	,ACT_NL	],
		[  1, 0, NMT_LD,	2,	OT_REG_A,	OT_REG_C	,ACT_NL	],
		[  1, 0, NMT_LD,	2,	OT_REG_A,	OT_REG_D	,ACT_NL	],
		[  1, 0, NMT_LD,	2,	OT_REG_A,	OT_REG_E	,ACT_NL	],
		[  1, 0, NMT_LD,	2,	OT_REG_A,	OT_REG_H	,ACT_NL	],
		[  1, 0, NMT_LD,	2,	OT_REG_A,	OT_REG_L	,ACT_NL	],
		[  1, 0, NMT_LD,	2,	OT_REG_A,	OT_ABS_HL	,ACT_RD	],
		[  1, 0, NMT_LD,	2,	OT_REG_A,	OT_REG_A	,ACT_NL	],
		// 80-8F
		[  1, 0, NMT_ADD,	2,	OT_REG_A,	OT_REG_B	,ACT_NL	],
		[  1, 0, NMT_ADD,	2,	OT_REG_A,	OT_REG_C	,ACT_NL	],
		[  1, 0, NMT_ADD,	2,	OT_REG_A,	OT_REG_D	,ACT_NL	],
		[  1, 0, NMT_ADD,	2,	OT_REG_A,	OT_REG_E	,ACT_NL	],
		[  1, 0, NMT_ADD,	2,	OT_REG_A,	OT_REG_H	,ACT_NL	],
		[  1, 0, NMT_ADD,	2,	OT_REG_A,	OT_REG_L	,ACT_NL	],
		[  1, 0, NMT_ADD,	2,	OT_REG_A,	OT_ABS_HL	,ACT_RD	],
		[  1, 0, NMT_ADD,	2,	OT_REG_A,	OT_REG_A	,ACT_NL	],
		[  1, 0, NMT_ADC,	2,	OT_REG_A,	OT_REG_B	,ACT_NL	],
		[  1, 0, NMT_ADC,	2,	OT_REG_A,	OT_REG_C	,ACT_NL	],
		[  1, 0, NMT_ADC,	2,	OT_REG_A,	OT_REG_D	,ACT_NL	],
		[  1, 0, NMT_ADC,	2,	OT_REG_A,	OT_REG_E	,ACT_NL	],
		[  1, 0, NMT_ADC,	2,	OT_REG_A,	OT_REG_H	,ACT_NL	],
		[  1, 0, NMT_ADC,	2,	OT_REG_A,	OT_REG_L	,ACT_NL	],
		[  1, 0, NMT_ADC,	2,	OT_REG_A,	OT_ABS_HL	,ACT_RD	],
		[  1, 0, NMT_ADC,	2,	OT_REG_A,	OT_REG_A	,ACT_NL	],
		// 90-9F
		[  1, 0, NMT_SUB,	1,	OT_REG_B,	OT_NONE		,ACT_NL	],
		[  1, 0, NMT_SUB,	1,	OT_REG_C,	OT_NONE		,ACT_NL	],
		[  1, 0, NMT_SUB,	1,	OT_REG_D,	OT_NONE		,ACT_NL	],
		[  1, 0, NMT_SUB,	1,	OT_REG_E,	OT_NONE		,ACT_NL	],
		[  1, 0, NMT_SUB,	1,	OT_REG_H,	OT_NONE		,ACT_NL	],
		[  1, 0, NMT_SUB,	1,	OT_REG_L,	OT_NONE		,ACT_NL	],
		[  1, 0, NMT_SUB,	1,	OT_ABS_HL,	OT_NONE		,ACT_RD	],
		[  1, 0, NMT_SUB,	1,	OT_REG_A,	OT_NONE		,ACT_NL	],
		[  1, 0, NMT_SBC,	2,	OT_REG_A,	OT_REG_B	,ACT_NL	],
		[  1, 0, NMT_SBC,	2,	OT_REG_A,	OT_REG_C	,ACT_NL	],
		[  1, 0, NMT_SBC,	2,	OT_REG_A,	OT_REG_D	,ACT_NL	],
		[  1, 0, NMT_SBC,	2,	OT_REG_A,	OT_REG_E	,ACT_NL	],
		[  1, 0, NMT_SBC,	2,	OT_REG_A,	OT_REG_H	,ACT_NL	],
		[  1, 0, NMT_SBC,	2,	OT_REG_A,	OT_REG_L	,ACT_NL	],
		[  1, 0, NMT_SBC,	2,	OT_REG_A,	OT_ABS_HL	,ACT_RD	],
		[  1, 0, NMT_SBC,	2,	OT_REG_A,	OT_REG_A	,ACT_NL	],
		// A0-AF
		[  1, 0, NMT_AND,	1,	OT_REG_B,	OT_NONE		,ACT_NL	],
		[  1, 0, NMT_AND,	1,	OT_REG_C,	OT_NONE		,ACT_NL	],
		[  1, 0, NMT_AND,	1,	OT_REG_D,	OT_NONE		,ACT_NL	],
		[  1, 0, NMT_AND,	1,	OT_REG_E,	OT_NONE		,ACT_NL	],
		[  1, 0, NMT_AND,	1,	OT_REG_H,	OT_NONE		,ACT_NL	],
		[  1, 0, NMT_AND,	1,	OT_REG_L,	OT_NONE		,ACT_NL	],
		[  1, 0, NMT_AND,	1,	OT_ABS_HL,	OT_NONE		,ACT_RD	],
		[  1, 0, NMT_AND,	1,	OT_REG_A,	OT_NONE		,ACT_NL	],
		[  1, 0, NMT_XOR,	1,	OT_REG_B,	OT_NONE		,ACT_NL	],
		[  1, 0, NMT_XOR,	1,	OT_REG_C,	OT_NONE		,ACT_NL	],
		[  1, 0, NMT_XOR,	1,	OT_REG_D,	OT_NONE		,ACT_NL	],
		[  1, 0, NMT_XOR,	1,	OT_REG_E,	OT_NONE		,ACT_NL	],
		[  1, 0, NMT_XOR,	1,	OT_REG_H,	OT_NONE		,ACT_NL	],
		[  1, 0, NMT_XOR,	1,	OT_REG_L,	OT_NONE		,ACT_NL	],
		[  1, 0, NMT_XOR,	1,	OT_ABS_HL,	OT_NONE		,ACT_RD	],
		[  1, 0, NMT_XOR,	1,	OT_REG_A,	OT_NONE		,ACT_NL	],
		// B0-BF
		[  1, 0, NMT_OR,	1,	OT_REG_B,	OT_NONE		,ACT_NL	],
		[  1, 0, NMT_OR,	1,	OT_REG_C,	OT_NONE		,ACT_NL	],
		[  1, 0, NMT_OR,	1,	OT_REG_D,	OT_NONE		,ACT_NL	],
		[  1, 0, NMT_OR,	1,	OT_REG_E,	OT_NONE		,ACT_NL	],
		[  1, 0, NMT_OR,	1,	OT_REG_H,	OT_NONE		,ACT_NL	],
		[  1, 0, NMT_OR,	1,	OT_REG_L,	OT_NONE		,ACT_NL	],
		[  1, 0, NMT_OR,	1,	OT_ABS_HL,	OT_NONE		,ACT_RD	],
		[  1, 0, NMT_OR,	1,	OT_REG_A,	OT_NONE		,ACT_NL	],
		[  1, 0, NMT_CP,	1,	OT_REG_B,	OT_NONE		,ACT_NL	],
		[  1, 0, NMT_CP,	1,	OT_REG_C,	OT_NONE		,ACT_NL	],
		[  1, 0, NMT_CP,	1,	OT_REG_D,	OT_NONE		,ACT_NL	],
		[  1, 0, NMT_CP,	1,	OT_REG_E,	OT_NONE		,ACT_NL	],
		[  1, 0, NMT_CP,	1,	OT_REG_H,	OT_NONE		,ACT_NL	],
		[  1, 0, NMT_CP,	1,	OT_REG_L,	OT_NONE		,ACT_NL	],
		[  1, 0, NMT_CP,	1,	OT_ABS_HL,	OT_NONE		,ACT_RD	],
		[  1, 0, NMT_CP,	1,	OT_REG_A,	OT_NONE		,ACT_NL	],
		// C0-CF
		[  1, 0, NMT_RET,	1,	OT_NZ,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_POP,	1,	OT_REG_BC,	OT_NONE		,ACT_NL	],
		[  3, 1, NMT_JP,	2,	OT_NZ,		OT_IMM_WORD	,ACT_NL	],
		[  3, 1, NMT_JP,	1,	OT_IMM_WORD,OT_NONE		,ACT_NL	],
		[  3, 1, NMT_CALL,	2,	OT_NZ,		OT_IMM_WORD	,ACT_CL	],
		[  1, 0, NMT_PUSH,	1,	OT_REG_BC,	OT_NONE		,ACT_NL	],
		[  2, 1, NMT_ADD,	2,	OT_REG_A,	OT_IMM_BYTE	,ACT_NL	],
		[  1, 0, NMT_RST,	1,	OT_RST,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_RET,	1,	OT_Z,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_RET,	0,	OT_NONE,	OT_NONE		,ACT_NL	],
		[  3, 1, NMT_JP,	2,	OT_Z,		OT_IMM_WORD	,ACT_NL	],
		[ -1, 0, 0,			0,	OT_NONE,	OT_NONE		,ACT_NL	],
		[  3, 1, NMT_CALL,	2,	OT_Z,		OT_IMM_WORD	,ACT_CL	],
		[  3, 1, NMT_CALL,	1,	OT_IMM_WORD,OT_NONE		,ACT_CL	],
		[  2, 1, NMT_ADC,	2,	OT_REG_A,	OT_IMM_BYTE	,ACT_NL	],
		[  1, 0, NMT_RST,	1,	OT_RST,		OT_NONE		,ACT_NL	],
		// D0-DF
		[  1, 0, NMT_RET,	1,	OT_NC,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_POP,	1,	OT_REG_DE,	OT_NONE		,ACT_NL	],
		[  3, 1, NMT_JP,	2,	OT_NC,		OT_IMM_WORD	,ACT_NL	],
		[  2, 1, NMT_OUT,	2,	OT_IMM_PORT,OT_REG_A	,ACT_OT	],
		[  3, 1, NMT_CALL,	2,	OT_NC,		OT_IMM_WORD	,ACT_CL	],
		[  1, 0, NMT_PUSH,	1,	OT_REG_DE,	OT_NONE		,ACT_NL	],
		[  2, 1, NMT_SUB,	1,	OT_IMM_BYTE,OT_NONE		,ACT_NL	],
		[  1, 0, NMT_RST,	1,	OT_RST,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_RET,	1,	OT_C,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_EXX,	0,	OT_NONE,	OT_NONE		,ACT_NL	],
		[  3, 1, NMT_JP,	2,	OT_C,		OT_IMM_WORD	,ACT_NL	],
		[  2, 1, NMT_IN,	2,	OT_REG_A,	OT_IMM_PORT	,ACT_IN	],
		[  3, 1, NMT_CALL,	2,	OT_C,		OT_IMM_WORD	,ACT_CL	],
		[ -2, 0, 0,			0,	OT_NONE,	OT_NONE		,ACT_NL	],
		[  2, 1, NMT_SBC,	2,	OT_REG_A,	OT_IMM_BYTE	,ACT_NL	],
		[  1, 0, NMT_RST,	1,	OT_RST,		OT_NONE		,ACT_NL	],
		// E0-EF
		[  1, 0, NMT_RET,	1,	OT_PO,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_POP,	1,	OT_REG_HL,	OT_NONE		,ACT_NL	],
		[  3, 1, NMT_JP,	2,	OT_PO,		OT_IMM_WORD	,ACT_NL	],
		[  1, 0, NMT_EX,	2,	OT_ABS_SP,	OT_REG_HL	,ACT_RW	],
		[  3, 1, NMT_CALL,	2,	OT_PO,		OT_IMM_WORD	,ACT_CL	],
		[  1, 0, NMT_PUSH,	1,	OT_REG_HL,	OT_NONE		,ACT_NL	],
		[  2, 1, NMT_AND,	1,	OT_IMM_BYTE,OT_NONE		,ACT_NL	],
		[  1, 0, NMT_RST,	1,	OT_RST,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_RET,	1,	OT_PE,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_JP,	1,	OT_ABS_HL,	OT_NONE		,ACT_RD	],
		[  3, 1, NMT_JP,	2,	OT_PE,		OT_IMM_WORD	,ACT_NL	],
		[  1, 0, NMT_EX,	2,	OT_REG_DE,	OT_REG_HL	,ACT_NL	],
		[  3, 1, NMT_CALL,	2,	OT_PE,		OT_IMM_WORD	,ACT_CL	],
		[ -3, 0, 0,			0,	OT_NONE,	OT_NONE		,ACT_NL	],
		[  2, 1, NMT_XOR,	1,	OT_IMM_BYTE,OT_NONE		,ACT_NL	],
		[  1, 0, NMT_RST,	1,	OT_RST,		OT_NONE		,ACT_NL	],
		// F0-FF
		[  1, 0, NMT_RET,	1,	OT_P,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_POP,	1,	OT_REG_AF,	OT_NONE		,ACT_NL	],
		[  3, 1, NMT_JP,	2,	OT_P,		OT_IMM_WORD	,ACT_NL	],
		[  1, 1, NMT_DI,	0,	OT_NONE,	OT_NONE		,ACT_NL	],
		[  3, 1, NMT_CALL,	2,	OT_P,		OT_IMM_WORD	,ACT_CL	],
		[  1, 0, NMT_PUSH,	1,	OT_REG_AF,	OT_NONE		,ACT_NL	],
		[  2, 1, NMT_OR,	1,	OT_IMM_BYTE,OT_NONE		,ACT_NL	],
		[  1, 0, NMT_RST,	1,	OT_RST,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_RET,	1,	OT_M,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_LD,	2,	OT_REG_SP,	OT_REG_HL	,ACT_NL	],
		[  3, 1, NMT_JP,	2,	OT_M,		OT_IMM_WORD	,ACT_NL	],
		[  1, 1, NMT_EI,	0,	OT_NONE,	OT_NONE		,ACT_NL	],
		[  3, 1, NMT_CALL,	2,	OT_M,		OT_IMM_WORD	,ACT_CL	],
		[ -4, 0, 0,			0,	OT_NONE,	OT_NONE		,ACT_NL	],
		[  2, 1, NMT_CP,	1,	OT_IMM_BYTE,OT_NONE		,ACT_NL	],
		[  1, 0, NMT_RST,	1,	OT_RST,		OT_NONE		,ACT_NL	],
	],[
		// CB:00-0F
		[  2, 0, NMT_RLC,	1,	OT_REG_B,	OT_NONE		,ACT_NL	],
		[  2, 0, NMT_RLC,	1,	OT_REG_C,	OT_NONE		,ACT_NL	],
		[  2, 0, NMT_RLC,	1,	OT_REG_D,	OT_NONE		,ACT_NL	],
		[  2, 0, NMT_RLC,	1,	OT_REG_E,	OT_NONE		,ACT_NL	],
		[  2, 0, NMT_RLC,	1,	OT_REG_H,	OT_NONE		,ACT_NL	],
		[  2, 0, NMT_RLC,	1,	OT_REG_L,	OT_NONE		,ACT_NL	],
		[  2, 0, NMT_RLC,	1,	OT_ABS_HL,	OT_NONE		,ACT_RW	],
		[  2, 0, NMT_RLC,	1,	OT_REG_A,	OT_NONE		,ACT_NL	],
		[  2, 0, NMT_RRC,	1,	OT_REG_B,	OT_NONE		,ACT_NL	],
		[  2, 0, NMT_RRC,	1,	OT_REG_C,	OT_NONE		,ACT_NL	],
		[  2, 0, NMT_RRC,	1,	OT_REG_D,	OT_NONE		,ACT_NL	],
		[  2, 0, NMT_RRC,	1,	OT_REG_E,	OT_NONE		,ACT_NL	],
		[  2, 0, NMT_RRC,	1,	OT_REG_H,	OT_NONE		,ACT_NL	],
		[  2, 0, NMT_RRC,	1,	OT_REG_L,	OT_NONE		,ACT_NL	],
		[  2, 0, NMT_RRC,	1,	OT_ABS_HL,	OT_NONE		,ACT_RW	],
		[  2, 0, NMT_RRC,	1,	OT_REG_A,	OT_NONE		,ACT_NL	],
		// CB:10-1F
		[  2, 0, NMT_RL,	1,	OT_REG_B,	OT_NONE		,ACT_NL	],
		[  2, 0, NMT_RL,	1,	OT_REG_C,	OT_NONE		,ACT_NL	],
		[  2, 0, NMT_RL,	1,	OT_REG_D,	OT_NONE		,ACT_NL	],
		[  2, 0, NMT_RL,	1,	OT_REG_E,	OT_NONE		,ACT_NL	],
		[  2, 0, NMT_RL,	1,	OT_REG_H,	OT_NONE		,ACT_NL	],
		[  2, 0, NMT_RL,	1,	OT_REG_L,	OT_NONE		,ACT_NL	],
		[  2, 0, NMT_RL,	1,	OT_ABS_HL,	OT_NONE		,ACT_RW	],
		[  2, 0, NMT_RL,	1,	OT_REG_A,	OT_NONE		,ACT_NL	],
		[  2, 0, NMT_RR,	1,	OT_REG_B,	OT_NONE		,ACT_NL	],
		[  2, 0, NMT_RR,	1,	OT_REG_C,	OT_NONE		,ACT_NL	],
		[  2, 0, NMT_RR,	1,	OT_REG_D,	OT_NONE		,ACT_NL	],
		[  2, 0, NMT_RR,	1,	OT_REG_E,	OT_NONE		,ACT_NL	],
		[  2, 0, NMT_RR,	1,	OT_REG_H,	OT_NONE		,ACT_NL	],
		[  2, 0, NMT_RR,	1,	OT_REG_L,	OT_NONE		,ACT_NL	],
		[  2, 0, NMT_RR,	1,	OT_ABS_HL,	OT_NONE		,ACT_RW	],
		[  2, 0, NMT_RR,	1,	OT_REG_A,	OT_NONE		,ACT_NL	],
		// CB:20-2F
		[  2, 0, NMT_SLA,	1,	OT_REG_B,	OT_NONE		,ACT_NL	],
		[  2, 0, NMT_SLA,	1,	OT_REG_C,	OT_NONE		,ACT_NL	],
		[  2, 0, NMT_SLA,	1,	OT_REG_D,	OT_NONE		,ACT_NL	],
		[  2, 0, NMT_SLA,	1,	OT_REG_E,	OT_NONE		,ACT_NL	],
		[  2, 0, NMT_SLA,	1,	OT_REG_H,	OT_NONE		,ACT_NL	],
		[  2, 0, NMT_SLA,	1,	OT_REG_L,	OT_NONE		,ACT_NL	],
		[  2, 0, NMT_SLA,	1,	OT_ABS_HL,	OT_NONE		,ACT_RW	],
		[  2, 0, NMT_SLA,	1,	OT_REG_A,	OT_NONE		,ACT_NL	],
		[  2, 0, NMT_SRA,	1,	OT_REG_B,	OT_NONE		,ACT_NL	],
		[  2, 0, NMT_SRA,	1,	OT_REG_C,	OT_NONE		,ACT_NL	],
		[  2, 0, NMT_SRA,	1,	OT_REG_D,	OT_NONE		,ACT_NL	],
		[  2, 0, NMT_SRA,	1,	OT_REG_E,	OT_NONE		,ACT_NL	],
		[  2, 0, NMT_SRA,	1,	OT_REG_H,	OT_NONE		,ACT_NL	],
		[  2, 0, NMT_SRA,	1,	OT_REG_L,	OT_NONE		,ACT_NL	],
		[  2, 0, NMT_SRA,	1,	OT_ABS_HL,	OT_NONE		,ACT_RW	],
		[  2, 0, NMT_SRA,	1,	OT_REG_A,	OT_NONE		,ACT_NL	],
		// CB:30-3F
		[  2, 0, NMT_SLL,	1,	OT_REG_B,	OT_NONE		,ACT_NL	],
		[  2, 0, NMT_SLL,	1,	OT_REG_C,	OT_NONE		,ACT_NL	],
		[  2, 0, NMT_SLL,	1,	OT_REG_D,	OT_NONE		,ACT_NL	],
		[  2, 0, NMT_SLL,	1,	OT_REG_E,	OT_NONE		,ACT_NL	],
		[  2, 0, NMT_SLL,	1,	OT_REG_H,	OT_NONE		,ACT_NL	],
		[  2, 0, NMT_SLL,	1,	OT_REG_L,	OT_NONE		,ACT_NL	],
		[  2, 0, NMT_SLL,	1,	OT_ABS_HL,	OT_NONE		,ACT_NL	],
		[  2, 0, NMT_SLL,	1,	OT_REG_A,	OT_NONE		,ACT_NL	],
		[  2, 0, NMT_SRL,	1,	OT_REG_B,	OT_NONE		,ACT_NL	],
		[  2, 0, NMT_SRL,	1,	OT_REG_C,	OT_NONE		,ACT_NL	],
		[  2, 0, NMT_SRL,	1,	OT_REG_D,	OT_NONE		,ACT_NL	],
		[  2, 0, NMT_SRL,	1,	OT_REG_E,	OT_NONE		,ACT_NL	],
		[  2, 0, NMT_SRL,	1,	OT_REG_H,	OT_NONE		,ACT_NL	],
		[  2, 0, NMT_SRL,	1,	OT_REG_L,	OT_NONE		,ACT_NL	],
		[  2, 0, NMT_SRL,	1,	OT_ABS_HL,	OT_NONE		,ACT_RW	],
		[  2, 0, NMT_SRL,	1,	OT_REG_A,	OT_NONE		,ACT_NL	],
		// CB:40-4F
		[  2, 0, NMT_BIT,	2,	OT_BIT_0,	OT_REG_B	,ACT_NL	],
		[  2, 0, NMT_BIT,	2,	OT_BIT_0,	OT_REG_C	,ACT_NL	],
		[  2, 0, NMT_BIT,	2,	OT_BIT_0,	OT_REG_D	,ACT_NL	],
		[  2, 0, NMT_BIT,	2,	OT_BIT_0,	OT_REG_E	,ACT_NL	],
		[  2, 0, NMT_BIT,	2,	OT_BIT_0,	OT_REG_H	,ACT_NL	],
		[  2, 0, NMT_BIT,	2,	OT_BIT_0,	OT_REG_L	,ACT_NL	],
		[  2, 0, NMT_BIT,	2,	OT_BIT_0,	OT_ABS_HL	,ACT_RD	],
		[  2, 0, NMT_BIT,	2,	OT_BIT_0,	OT_REG_A	,ACT_NL	],
		[  2, 0, NMT_BIT,	2,	OT_BIT_1,	OT_REG_B	,ACT_NL	],
		[  2, 0, NMT_BIT,	2,	OT_BIT_1,	OT_REG_C	,ACT_NL	],
		[  2, 0, NMT_BIT,	2,	OT_BIT_1,	OT_REG_D	,ACT_NL	],
		[  2, 0, NMT_BIT,	2,	OT_BIT_1,	OT_REG_E	,ACT_NL	],
		[  2, 0, NMT_BIT,	2,	OT_BIT_1,	OT_REG_H	,ACT_NL	],
		[  2, 0, NMT_BIT,	2,	OT_BIT_1,	OT_REG_L	,ACT_NL	],
		[  2, 0, NMT_BIT,	2,	OT_BIT_1,	OT_ABS_HL	,ACT_RD	],
		[  2, 0, NMT_BIT,	2,	OT_BIT_1,	OT_REG_A	,ACT_NL	],
		// CB:50-5F
		[  2, 0, NMT_BIT,	2,	OT_BIT_2,	OT_REG_B	,ACT_NL	],
		[  2, 0, NMT_BIT,	2,	OT_BIT_2,	OT_REG_C	,ACT_NL	],
		[  2, 0, NMT_BIT,	2,	OT_BIT_2,	OT_REG_D	,ACT_NL	],
		[  2, 0, NMT_BIT,	2,	OT_BIT_2,	OT_REG_E	,ACT_NL	],
		[  2, 0, NMT_BIT,	2,	OT_BIT_2,	OT_REG_H	,ACT_NL	],
		[  2, 0, NMT_BIT,	2,	OT_BIT_2,	OT_REG_L	,ACT_NL	],
		[  2, 0, NMT_BIT,	2,	OT_BIT_2,	OT_ABS_HL	,ACT_RD	],
		[  2, 0, NMT_BIT,	2,	OT_BIT_2,	OT_REG_A	,ACT_NL	],
		[  2, 0, NMT_BIT,	2,	OT_BIT_3,	OT_REG_B	,ACT_NL	],
		[  2, 0, NMT_BIT,	2,	OT_BIT_3,	OT_REG_C	,ACT_NL	],
		[  2, 0, NMT_BIT,	2,	OT_BIT_3,	OT_REG_D	,ACT_NL	],
		[  2, 0, NMT_BIT,	2,	OT_BIT_3,	OT_REG_E	,ACT_NL	],
		[  2, 0, NMT_BIT,	2,	OT_BIT_3,	OT_REG_H	,ACT_NL	],
		[  2, 0, NMT_BIT,	2,	OT_BIT_3,	OT_REG_L	,ACT_NL	],
		[  2, 0, NMT_BIT,	2,	OT_BIT_3,	OT_ABS_HL	,ACT_RD	],
		[  2, 0, NMT_BIT,	2,	OT_BIT_3,	OT_REG_A	,ACT_NL	],
		// CB:60-6F
		[  2, 0, NMT_BIT,	2,	OT_BIT_4,	OT_REG_B	,ACT_NL	],
		[  2, 0, NMT_BIT,	2,	OT_BIT_4,	OT_REG_C	,ACT_NL	],
		[  2, 0, NMT_BIT,	2,	OT_BIT_4,	OT_REG_D	,ACT_NL	],
		[  2, 0, NMT_BIT,	2,	OT_BIT_4,	OT_REG_E	,ACT_NL	],
		[  2, 0, NMT_BIT,	2,	OT_BIT_4,	OT_REG_H	,ACT_NL	],
		[  2, 0, NMT_BIT,	2,	OT_BIT_4,	OT_REG_L	,ACT_NL	],
		[  2, 0, NMT_BIT,	2,	OT_BIT_4,	OT_ABS_HL	,ACT_RD	],
		[  2, 0, NMT_BIT,	2,	OT_BIT_4,	OT_REG_A	,ACT_NL	],
		[  2, 0, NMT_BIT,	2,	OT_BIT_5,	OT_REG_B	,ACT_NL	],
		[  2, 0, NMT_BIT,	2,	OT_BIT_5,	OT_REG_C	,ACT_NL	],
		[  2, 0, NMT_BIT,	2,	OT_BIT_5,	OT_REG_D	,ACT_NL	],
		[  2, 0, NMT_BIT,	2,	OT_BIT_5,	OT_REG_E	,ACT_NL	],
		[  2, 0, NMT_BIT,	2,	OT_BIT_5,	OT_REG_H	,ACT_NL	],
		[  2, 0, NMT_BIT,	2,	OT_BIT_5,	OT_REG_L	,ACT_NL	],
		[  2, 0, NMT_BIT,	2,	OT_BIT_5,	OT_ABS_HL	,ACT_RD	],
		[  2, 0, NMT_BIT,	2,	OT_BIT_5,	OT_REG_A	,ACT_NL	],
		// CB:70-7F
		[  2, 0, NMT_BIT,	2,	OT_BIT_6,	OT_REG_B	,ACT_NL	],
		[  2, 0, NMT_BIT,	2,	OT_BIT_6,	OT_REG_C	,ACT_NL	],
		[  2, 0, NMT_BIT,	2,	OT_BIT_6,	OT_REG_D	,ACT_NL	],
		[  2, 0, NMT_BIT,	2,	OT_BIT_6,	OT_REG_E	,ACT_NL	],
		[  2, 0, NMT_BIT,	2,	OT_BIT_6,	OT_REG_H	,ACT_NL	],
		[  2, 0, NMT_BIT,	2,	OT_BIT_6,	OT_REG_L	,ACT_NL	],
		[  2, 0, NMT_BIT,	2,	OT_BIT_6,	OT_ABS_HL	,ACT_RD	],
		[  2, 0, NMT_BIT,	2,	OT_BIT_6,	OT_REG_A	,ACT_NL	],
		[  2, 0, NMT_BIT,	2,	OT_BIT_7,	OT_REG_B	,ACT_NL	],
		[  2, 0, NMT_BIT,	2,	OT_BIT_7,	OT_REG_C	,ACT_NL	],
		[  2, 0, NMT_BIT,	2,	OT_BIT_7,	OT_REG_D	,ACT_NL	],
		[  2, 0, NMT_BIT,	2,	OT_BIT_7,	OT_REG_E	,ACT_NL	],
		[  2, 0, NMT_BIT,	2,	OT_BIT_7,	OT_REG_H	,ACT_NL	],
		[  2, 0, NMT_BIT,	2,	OT_BIT_7,	OT_REG_L	,ACT_NL	],
		[  2, 0, NMT_BIT,	2,	OT_BIT_7,	OT_ABS_HL	,ACT_RD	],
		[  2, 0, NMT_BIT,	2,	OT_BIT_7,	OT_REG_A	,ACT_NL	],
		// CB:80-8F
		[  2, 0, NMT_RES,	2,	OT_BIT_0,	OT_REG_B	,ACT_NL	],
		[  2, 0, NMT_RES,	2,	OT_BIT_0,	OT_REG_C	,ACT_NL	],
		[  2, 0, NMT_RES,	2,	OT_BIT_0,	OT_REG_D	,ACT_NL	],
		[  2, 0, NMT_RES,	2,	OT_BIT_0,	OT_REG_E	,ACT_NL	],
		[  2, 0, NMT_RES,	2,	OT_BIT_0,	OT_REG_H	,ACT_NL	],
		[  2, 0, NMT_RES,	2,	OT_BIT_0,	OT_REG_L	,ACT_NL	],
		[  2, 0, NMT_RES,	2,	OT_BIT_0,	OT_ABS_HL	,ACT_RD	],
		[  2, 0, NMT_RES,	2,	OT_BIT_0,	OT_REG_A	,ACT_NL	],
		[  2, 0, NMT_RES,	2,	OT_BIT_1,	OT_REG_B	,ACT_NL	],
		[  2, 0, NMT_RES,	2,	OT_BIT_1,	OT_REG_C	,ACT_NL	],
		[  2, 0, NMT_RES,	2,	OT_BIT_1,	OT_REG_D	,ACT_NL	],
		[  2, 0, NMT_RES,	2,	OT_BIT_1,	OT_REG_E	,ACT_NL	],
		[  2, 0, NMT_RES,	2,	OT_BIT_1,	OT_REG_H	,ACT_NL	],
		[  2, 0, NMT_RES,	2,	OT_BIT_1,	OT_REG_L	,ACT_NL	],
		[  2, 0, NMT_RES,	2,	OT_BIT_1,	OT_ABS_HL	,ACT_RD	],
		[  2, 0, NMT_RES,	2,	OT_BIT_1,	OT_REG_A	,ACT_NL	],
		// CB:90-9F
		[  2, 0, NMT_RES,	2,	OT_BIT_2,	OT_REG_B	,ACT_NL	],
		[  2, 0, NMT_RES,	2,	OT_BIT_2,	OT_REG_C	,ACT_NL	],
		[  2, 0, NMT_RES,	2,	OT_BIT_2,	OT_REG_D	,ACT_NL	],
		[  2, 0, NMT_RES,	2,	OT_BIT_2,	OT_REG_E	,ACT_NL	],
		[  2, 0, NMT_RES,	2,	OT_BIT_2,	OT_REG_H	,ACT_NL	],
		[  2, 0, NMT_RES,	2,	OT_BIT_2,	OT_REG_L	,ACT_NL	],
		[  2, 0, NMT_RES,	2,	OT_BIT_2,	OT_ABS_HL	,ACT_RD	],
		[  2, 0, NMT_RES,	2,	OT_BIT_2,	OT_REG_A	,ACT_NL	],
		[  2, 0, NMT_RES,	2,	OT_BIT_3,	OT_REG_B	,ACT_NL	],
		[  2, 0, NMT_RES,	2,	OT_BIT_3,	OT_REG_C	,ACT_NL	],
		[  2, 0, NMT_RES,	2,	OT_BIT_3,	OT_REG_D	,ACT_NL	],
		[  2, 0, NMT_RES,	2,	OT_BIT_3,	OT_REG_E	,ACT_NL	],
		[  2, 0, NMT_RES,	2,	OT_BIT_3,	OT_REG_H	,ACT_NL	],
		[  2, 0, NMT_RES,	2,	OT_BIT_3,	OT_REG_L	,ACT_NL	],
		[  2, 0, NMT_RES,	2,	OT_BIT_3,	OT_ABS_HL	,ACT_RD	],
		[  2, 0, NMT_RES,	2,	OT_BIT_3,	OT_REG_A	,ACT_NL	],
		// CB:A0-AF_3
		[  2, 0, NMT_RES,	2,	OT_BIT_4,	OT_REG_B	,ACT_NL	],
		[  2, 0, NMT_RES,	2,	OT_BIT_4,	OT_REG_C	,ACT_NL	],
		[  2, 0, NMT_RES,	2,	OT_BIT_4,	OT_REG_D	,ACT_NL	],
		[  2, 0, NMT_RES,	2,	OT_BIT_4,	OT_REG_E	,ACT_NL	],
		[  2, 0, NMT_RES,	2,	OT_BIT_4,	OT_REG_H	,ACT_NL	],
		[  2, 0, NMT_RES,	2,	OT_BIT_4,	OT_REG_L	,ACT_NL	],
		[  2, 0, NMT_RES,	2,	OT_BIT_4,	OT_ABS_HL	,ACT_RD	],
		[  2, 0, NMT_RES,	2,	OT_BIT_4,	OT_REG_A	,ACT_NL	],
		[  2, 0, NMT_RES,	2,	OT_BIT_5,	OT_REG_B	,ACT_NL	],
		[  2, 0, NMT_RES,	2,	OT_BIT_5,	OT_REG_C	,ACT_NL	],
		[  2, 0, NMT_RES,	2,	OT_BIT_5,	OT_REG_D	,ACT_NL	],
		[  2, 0, NMT_RES,	2,	OT_BIT_5,	OT_REG_E	,ACT_NL	],
		[  2, 0, NMT_RES,	2,	OT_BIT_5,	OT_REG_H	,ACT_NL	],
		[  2, 0, NMT_RES,	2,	OT_BIT_5,	OT_REG_L	,ACT_NL	],
		[  2, 0, NMT_RES,	2,	OT_BIT_5,	OT_ABS_HL	,ACT_RD	],
		[  2, 0, NMT_RES,	2,	OT_BIT_5,	OT_REG_A	,ACT_NL	],
		// CB:B0-BF
		[  2, 0, NMT_RES,	2,	OT_BIT_6,	OT_REG_B	,ACT_NL	],
		[  2, 0, NMT_RES,	2,	OT_BIT_6,	OT_REG_C	,ACT_NL	],
		[  2, 0, NMT_RES,	2,	OT_BIT_6,	OT_REG_D	,ACT_NL	],
		[  2, 0, NMT_RES,	2,	OT_BIT_6,	OT_REG_E	,ACT_NL	],
		[  2, 0, NMT_RES,	2,	OT_BIT_6,	OT_REG_H	,ACT_NL	],
		[  2, 0, NMT_RES,	2,	OT_BIT_6,	OT_REG_L	,ACT_NL	],
		[  2, 0, NMT_RES,	2,	OT_BIT_6,	OT_ABS_HL	,ACT_RD	],
		[  2, 0, NMT_RES,	2,	OT_BIT_6,	OT_REG_A	,ACT_NL	],
		[  2, 0, NMT_RES,	2,	OT_BIT_7,	OT_REG_B	,ACT_NL	],
		[  2, 0, NMT_RES,	2,	OT_BIT_7,	OT_REG_C	,ACT_NL	],
		[  2, 0, NMT_RES,	2,	OT_BIT_7,	OT_REG_D	,ACT_NL	],
		[  2, 0, NMT_RES,	2,	OT_BIT_7,	OT_REG_E	,ACT_NL	],
		[  2, 0, NMT_RES,	2,	OT_BIT_7,	OT_REG_H	,ACT_NL	],
		[  2, 0, NMT_RES,	2,	OT_BIT_7,	OT_REG_L	,ACT_NL	],
		[  2, 0, NMT_RES,	2,	OT_BIT_7,	OT_ABS_HL	,ACT_RD	],
		[  2, 0, NMT_RES,	2,	OT_BIT_7,	OT_REG_A	,ACT_NL	],
		// CB:C0-CF
		[  2, 0, NMT_SET,	2,	OT_BIT_0,	OT_REG_B	,ACT_NL	],
		[  2, 0, NMT_SET,	2,	OT_BIT_0,	OT_REG_C	,ACT_NL	],
		[  2, 0, NMT_SET,	2,	OT_BIT_0,	OT_REG_D	,ACT_NL	],
		[  2, 0, NMT_SET,	2,	OT_BIT_0,	OT_REG_E	,ACT_NL	],
		[  2, 0, NMT_SET,	2,	OT_BIT_0,	OT_REG_H	,ACT_NL	],
		[  2, 0, NMT_SET,	2,	OT_BIT_0,	OT_REG_L	,ACT_NL	],
		[  2, 0, NMT_SET,	2,	OT_BIT_0,	OT_ABS_HL	,ACT_RW	],
		[  2, 0, NMT_SET,	2,	OT_BIT_0,	OT_REG_A	,ACT_NL	],
		[  2, 0, NMT_SET,	2,	OT_BIT_1,	OT_REG_B	,ACT_NL	],
		[  2, 0, NMT_SET,	2,	OT_BIT_1,	OT_REG_C	,ACT_NL	],
		[  2, 0, NMT_SET,	2,	OT_BIT_1,	OT_REG_D	,ACT_NL	],
		[  2, 0, NMT_SET,	2,	OT_BIT_1,	OT_REG_E	,ACT_NL	],
		[  2, 0, NMT_SET,	2,	OT_BIT_1,	OT_REG_H	,ACT_NL	],
		[  2, 0, NMT_SET,	2,	OT_BIT_1,	OT_REG_L	,ACT_NL	],
		[  2, 0, NMT_SET,	2,	OT_BIT_1,	OT_ABS_HL	,ACT_RW	],
		[  2, 0, NMT_SET,	2,	OT_BIT_1,	OT_REG_A	,ACT_NL	],
		// CB:D0-DF
		[  2, 0, NMT_SET,	2,	OT_BIT_2,	OT_REG_B	,ACT_NL	],
		[  2, 0, NMT_SET,	2,	OT_BIT_2,	OT_REG_C	,ACT_NL	],
		[  2, 0, NMT_SET,	2,	OT_BIT_2,	OT_REG_D	,ACT_NL	],
		[  2, 0, NMT_SET,	2,	OT_BIT_2,	OT_REG_E	,ACT_NL	],
		[  2, 0, NMT_SET,	2,	OT_BIT_2,	OT_REG_H	,ACT_NL	],
		[  2, 0, NMT_SET,	2,	OT_BIT_2,	OT_REG_L	,ACT_NL	],
		[  2, 0, NMT_SET,	2,	OT_BIT_2,	OT_ABS_HL	,ACT_RW	],
		[  2, 0, NMT_SET,	2,	OT_BIT_2,	OT_REG_A	,ACT_NL	],
		[  2, 0, NMT_SET,	2,	OT_BIT_3,	OT_REG_B	,ACT_NL	],
		[  2, 0, NMT_SET,	2,	OT_BIT_3,	OT_REG_C	,ACT_NL	],
		[  2, 0, NMT_SET,	2,	OT_BIT_3,	OT_REG_D	,ACT_NL	],
		[  2, 0, NMT_SET,	2,	OT_BIT_3,	OT_REG_E	,ACT_NL	],
		[  2, 0, NMT_SET,	2,	OT_BIT_3,	OT_REG_H	,ACT_NL	],
		[  2, 0, NMT_SET,	2,	OT_BIT_3,	OT_REG_L	,ACT_NL	],
		[  2, 0, NMT_SET,	2,	OT_BIT_3,	OT_ABS_HL	,ACT_RW	],
		[  2, 0, NMT_SET,	2,	OT_BIT_3,	OT_REG_A	,ACT_NL	],
		// CB:E0-EF
		[  2, 0, NMT_SET,	2,	OT_BIT_4,	OT_REG_B	,ACT_NL	],
		[  2, 0, NMT_SET,	2,	OT_BIT_4,	OT_REG_C	,ACT_NL	],
		[  2, 0, NMT_SET,	2,	OT_BIT_4,	OT_REG_D	,ACT_NL	],
		[  2, 0, NMT_SET,	2,	OT_BIT_4,	OT_REG_E	,ACT_NL	],
		[  2, 0, NMT_SET,	2,	OT_BIT_4,	OT_REG_H	,ACT_NL	],
		[  2, 0, NMT_SET,	2,	OT_BIT_4,	OT_REG_L	,ACT_NL	],
		[  2, 0, NMT_SET,	2,	OT_BIT_4,	OT_ABS_HL	,ACT_RW	],
		[  2, 0, NMT_SET,	2,	OT_BIT_4,	OT_REG_A	,ACT_NL	],
		[  2, 0, NMT_SET,	2,	OT_BIT_5,	OT_REG_B	,ACT_NL	],
		[  2, 0, NMT_SET,	2,	OT_BIT_5,	OT_REG_C	,ACT_NL	],
		[  2, 0, NMT_SET,	2,	OT_BIT_5,	OT_REG_D	,ACT_NL	],
		[  2, 0, NMT_SET,	2,	OT_BIT_5,	OT_REG_E	,ACT_NL	],
		[  2, 0, NMT_SET,	2,	OT_BIT_5,	OT_REG_H	,ACT_NL	],
		[  2, 0, NMT_SET,	2,	OT_BIT_5,	OT_REG_L	,ACT_NL	],
		[  2, 0, NMT_SET,	2,	OT_BIT_5,	OT_ABS_HL	,ACT_RW	],
		[  2, 0, NMT_SET,	2,	OT_BIT_5,	OT_REG_A	,ACT_NL	],
		// CB:F0-FF
		[  2, 0, NMT_SET,	2,	OT_BIT_6,	OT_REG_B	,ACT_NL	],
		[  2, 0, NMT_SET,	2,	OT_BIT_6,	OT_REG_C	,ACT_NL	],
		[  2, 0, NMT_SET,	2,	OT_BIT_6,	OT_REG_D	,ACT_NL	],
		[  2, 0, NMT_SET,	2,	OT_BIT_6,	OT_REG_E	,ACT_NL	],
		[  2, 0, NMT_SET,	2,	OT_BIT_6,	OT_REG_H	,ACT_NL	],
		[  2, 0, NMT_SET,	2,	OT_BIT_6,	OT_REG_L	,ACT_NL	],
		[  2, 0, NMT_SET,	2,	OT_BIT_6,	OT_ABS_HL	,ACT_RW	],
		[  2, 0, NMT_SET,	2,	OT_BIT_6,	OT_REG_A	,ACT_NL	],
		[  2, 0, NMT_SET,	2,	OT_BIT_7,	OT_REG_B	,ACT_NL	],
		[  2, 0, NMT_SET,	2,	OT_BIT_7,	OT_REG_C	,ACT_NL	],
		[  2, 0, NMT_SET,	2,	OT_BIT_7,	OT_REG_D	,ACT_NL	],
		[  2, 0, NMT_SET,	2,	OT_BIT_7,	OT_REG_E	,ACT_NL	],
		[  2, 0, NMT_SET,	2,	OT_BIT_7,	OT_REG_H	,ACT_NL	],
		[  2, 0, NMT_SET,	2,	OT_BIT_7,	OT_REG_L	,ACT_NL	],
		[  2, 0, NMT_SET,	2,	OT_BIT_7,	OT_ABS_HL	,ACT_RW	],
		[  2, 0, NMT_SET,	2,	OT_BIT_7,	OT_REG_A	,ACT_NL	],
	],[
		// DD:00-0F
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  2, 0, NMT_ADD,	2,	OT_REG_IX,	OT_REG_BC	,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		// DD:10-1F
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  2, 0, NMT_ADD,	2,	OT_REG_IX,	OT_REG_DE	,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		// DD:20-2F
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  4, 2, NMT_LD,	2,	OT_REG_IX,	OT_IMM_WORD	,ACT_NL	],
		[  4, 2, NMT_LD,	2,	OT_ABS,		OT_REG_IX	,ACT_WT	],
		[  2, 0, NMT_INC,	1,	OT_REG_IX,	OT_NONE		,ACT_NL	],
		[  2, 0, NMT_INC,	1,	OT_REG_IXH,	OT_NONE		,ACT_NL	],
		[  2, 0, NMT_DEC,	1,	OT_REG_IXH,	OT_NONE		,ACT_NL	],
		[  3, 2, NMT_LD,	2,	OT_REG_IXH,	OT_IMM_BYTE	,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  2, 0, NMT_ADD,	2,	OT_REG_IX,	OT_REG_IX	,ACT_NL	],
		[  4, 2, NMT_LD,	2,	OT_REG_IX,	OT_ABS		,ACT_RD	],
		[  2, 0, NMT_DEC,	1,	OT_REG_IX,	OT_NONE		,ACT_NL	],
		[  2, 0, NMT_INC,	1,	OT_REG_IXL,	OT_NONE		,ACT_NL	],
		[  2, 0, NMT_DEC,	1,	OT_REG_IXL,	OT_NONE		,ACT_NL	],
		[  3, 2, NMT_LD,	2,	OT_REG_IXL,	OT_IMM_BYTE	,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		// DD:30-3F
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  3, 2, NMT_INC,	1,	OT_IDX_IX,	OT_NONE		,ACT_RW	],
		[  3, 2, NMT_DEC,	1,	OT_IDX_IX,	OT_NONE		,ACT_RW	],
		[  4, 2, NMT_LD,	2,	OT_IDX_IX,	OT_IMM_BYTE	,ACT_WT	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  2, 0, NMT_ADD,	2,	OT_REG_IX,	OT_REG_SP	,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		// DD:40-4F
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  2, 0, NMT_LD,	2,	OT_REG_B,	OT_REG_IXH	,ACT_NL	],
		[  2, 0, NMT_LD,	2,	OT_REG_B,	OT_REG_IXL	,ACT_NL	],
		[  3, 2, NMT_LD,	2,	OT_REG_B,	OT_IDX_IX	,ACT_RD	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  2, 0, NMT_LD,	2,	OT_REG_C,	OT_REG_IXH	,ACT_NL	],
		[  2, 0, NMT_LD,	2,	OT_REG_C,	OT_REG_IXL	,ACT_NL	],
		[  3, 2, NMT_LD,	2,	OT_REG_C,	OT_IDX_IX	,ACT_RD	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		// DD:50-5F
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  2, 0, NMT_LD,	2,	OT_REG_D,	OT_REG_IXH	,ACT_NL	],
		[  2, 0, NMT_LD,	2,	OT_REG_D,	OT_REG_IXL	,ACT_NL	],
		[  3, 2, NMT_LD,	2,	OT_REG_D,	OT_IDX_IX	,ACT_RD	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  2, 0, NMT_LD,	2,	OT_REG_E,	OT_REG_IXH	,ACT_NL	],
		[  2, 0, NMT_LD,	2,	OT_REG_E,	OT_REG_IXL	,ACT_NL	],
		[  3, 2, NMT_LD,	2,	OT_REG_E,	OT_IDX_IX	,ACT_RD	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		// DD:60-6F
		[  2, 0, NMT_LD,	2,	OT_REG_IXH,	OT_REG_B	,ACT_NL	],
		[  2, 0, NMT_LD,	2,	OT_REG_IXH,	OT_REG_C	,ACT_NL	],
		[  2, 0, NMT_LD,	2,	OT_REG_IXH,	OT_REG_D	,ACT_NL	],
		[  2, 0, NMT_LD,	2,	OT_REG_IXH,	OT_REG_E	,ACT_NL	],
		[  2, 0, NMT_LD,	2,	OT_REG_IXH,	OT_REG_IXH	,ACT_NL	],
		[  2, 0, NMT_LD,	2,	OT_REG_IXH,	OT_REG_IXL	,ACT_NL	],
		[  3, 2, NMT_LD,	2,	OT_REG_H,	OT_IDX_IX	,ACT_RD	],
		[  2, 0, NMT_LD,	2,	OT_REG_IXH,	OT_REG_A	,ACT_NL	],
		[  2, 0, NMT_LD,	2,	OT_REG_IXH,	OT_REG_B	,ACT_NL	],
		[  2, 0, NMT_LD,	2,	OT_REG_IXH,	OT_REG_C	,ACT_NL	],
		[  2, 0, NMT_LD,	2,	OT_REG_IXH,	OT_REG_D	,ACT_NL	],
		[  2, 0, NMT_LD,	2,	OT_REG_IXL,	OT_REG_E	,ACT_NL	],
		[  2, 0, NMT_LD,	2,	OT_REG_IXL,	OT_REG_IXH	,ACT_NL	],
		[  2, 0, NMT_LD,	2,	OT_REG_IXL,	OT_REG_IXL	,ACT_NL	],
		[  3, 2, NMT_LD,	2,	OT_REG_L,	OT_IDX_IX	,ACT_RD	],
		[  2, 0, NMT_LD,	2,	OT_REG_IXL,	OT_REG_A	,ACT_NL	],
		// DD:70-7F
		[  3, 2, NMT_LD,	2,	OT_IDX_IX,	OT_REG_B	,ACT_WT	],
		[  3, 2, NMT_LD,	2,	OT_IDX_IX,	OT_REG_C	,ACT_WT	],
		[  3, 2, NMT_LD,	2,	OT_IDX_IX,	OT_REG_D	,ACT_WT	],
		[  3, 2, NMT_LD,	2,	OT_IDX_IX,	OT_REG_E	,ACT_WT	],
		[  3, 2, NMT_LD,	2,	OT_IDX_IX,	OT_REG_H	,ACT_WT	],
		[  3, 2, NMT_LD,	2,	OT_IDX_IX,	OT_REG_L	,ACT_WT	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  3, 2, NMT_LD,	2,	OT_IDX_IX,	OT_REG_A	,ACT_WT	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  2, 0, NMT_LD,	2,	OT_REG_A,	OT_REG_IXH	,ACT_NL	],
		[  2, 0, NMT_LD,	2,	OT_REG_A,	OT_REG_IXL	,ACT_NL	],
		[  3, 2, NMT_LD,	2,	OT_REG_A,	OT_IDX_IX	,ACT_RD	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		// DD:80-8F
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  2, 0, NMT_ADD,	2,	OT_REG_A,	OT_REG_IXH	,ACT_NL	],
		[  2, 0, NMT_ADD,	2,	OT_REG_A,	OT_REG_IXL	,ACT_NL	],
		[  3, 2, NMT_ADD,	2,	OT_REG_A,	OT_IDX_IX	,ACT_RD	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  2, 0, NMT_ADC,	2,	OT_REG_A,	OT_REG_IXH	,ACT_NL	],
		[  2, 0, NMT_ADC,	2,	OT_REG_A,	OT_REG_IXL	,ACT_NL	],
		[  3, 2, NMT_ADC,	2,	OT_REG_A,	OT_IDX_IX	,ACT_RD	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		// DD:90-9F
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  2, 0, NMT_SUB,	2,	OT_REG_A,	OT_REG_IXH	,ACT_NL	],
		[  2, 0, NMT_SUB,	2,	OT_REG_A,	OT_REG_IXL	,ACT_NL	],
		[  3, 2, NMT_SUB,	1,	OT_IDX_IX,	OT_NONE		,ACT_RD	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  2, 0, NMT_SBC,	2,	OT_REG_A,	OT_REG_IXH	,ACT_NL	],
		[  2, 0, NMT_SBC,	2,	OT_REG_A,	OT_REG_IXL	,ACT_NL	],
		[  3, 2, NMT_SBC,	2,	OT_REG_A,	OT_IDX_IX	,ACT_RD	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		// DD:A0-AF
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  2, 0, NMT_AND,	1,	OT_REG_IXH,	OT_NONE		,ACT_NL	],
		[  2, 0, NMT_AND,	1,	OT_REG_IXL,	OT_NONE		,ACT_NL	],
		[  3, 2, NMT_AND,	1,	OT_IDX_IX,	OT_NONE		,ACT_RD	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  2, 0, NMT_XOR,	1,	OT_REG_IXH,	OT_NONE		,ACT_NL	],
		[  2, 0, NMT_XOR,	1,	OT_REG_IXL,	OT_NONE		,ACT_NL	],
		[  3, 2, NMT_XOR,	1,	OT_IDX_IX,	OT_NONE		,ACT_RD	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		// DD:B0-BF
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  2, 0, NMT_OR,	1,	OT_REG_IXH,	OT_NONE		,ACT_NL	],
		[  2, 0, NMT_OR,	1,	OT_REG_IXL,	OT_NONE		,ACT_NL	],
		[  3, 2, NMT_OR,	1,	OT_IDX_IX,	OT_NONE		,ACT_RD	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  2, 0, NMT_CP,	1,	OT_REG_IXH,	OT_NONE		,ACT_NL	],
		[  2, 0, NMT_CP,	1,	OT_REG_IXL,	OT_NONE		,ACT_NL	],
		[  3, 2, NMT_CP,	1,	OT_IDX_IX,	OT_NONE		,ACT_RD	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		// DD:C0-CF
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[ -5, 0, NMT_UND,	0,	OT_NONE,	OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		// DD:D0-DF
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		// DD:E0-EF
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  2, 0, NMT_POP,	1,	OT_REG_IX,	OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  2, 0, NMT_EX,	2,	OT_ABS_SP,	OT_REG_IX	,ACT_RW	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  2, 0, NMT_PUSH,	1,	OT_REG_IX,	OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  2, 0, NMT_JP,	1,	OT_ABS_IX,	OT_NONE		,ACT_RD	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		// DD:F0-FF
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  2, 0, NMT_LD,	2,	OT_REG_SP,	OT_REG_IX	,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
	],[
		// ED:00-0F
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		// ED:10-1F
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		// ED:20-2F
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		// ED:30-3F
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		// ED:40-4F
		[  2, 0, NMT_IN,	2,	OT_REG_B,	OT_PORT_C	,ACT_IN	],
		[  2, 0, NMT_OUT,	2,	OT_PORT_C,	OT_REG_B	,ACT_OT	],
		[  2, 0, NMT_SBC,	2,	OT_REG_HL,	OT_REG_BC	,ACT_NL	],
		[  4, 2, NMT_LD,	2,	OT_ABS,		OT_REG_BC	,ACT_WT	],
		[  2, 0, NMT_NEG,	0,	OT_NONE,	OT_NONE		,ACT_NL	],
		[  2, 0, NMT_RETN,	0,	OT_NONE,	OT_NONE		,ACT_NL	],
		[  2, 0, NMT_IM,	1,	OT_IM_0,	OT_NONE		,ACT_NL	],
		[  2, 0, NMT_LD,	2,	OT_REG_I,	OT_REG_A	,ACT_NL	],
		[  2, 0, NMT_IN,	2,	OT_REG_C,	OT_PORT_C	,ACT_IN	],
		[  2, 0, NMT_OUT,	2,	OT_PORT_C,	OT_REG_C	,ACT_OT	],
		[  2, 0, NMT_ADC,	2,	OT_REG_HL,	OT_REG_BC	,ACT_NL	],
		[  4, 2, NMT_LD,	2,	OT_REG_BC,	OT_ABS		,ACT_RD	],
		[  2, 0, NMT_NEG,	1,	OT_NONE,	OT_NONE		,ACT_NL	],
		[  2, 0, NMT_RETI,	0,	OT_NONE,	OT_NONE		,ACT_NL	],
		[  2, 0, NMT_IM,	1,	OT_IM_0,	OT_NONE		,ACT_NL	],
		[  2, 0, NMT_LD,	2,	OT_REG_R,	OT_REG_A	,ACT_NL	],
		// ED:50-5F
		[  2, 0, NMT_IN,	2,	OT_REG_D,	OT_PORT_C	,ACT_IN	],
		[  2, 0, NMT_OUT,	2,	OT_PORT_C,	OT_REG_D	,ACT_OT	],
		[  2, 0, NMT_SBC,	2,	OT_REG_HL,	OT_REG_DE	,ACT_NL	],
		[  4, 2, NMT_LD,	2,	OT_ABS,		OT_REG_DE	,ACT_WT	],
		[  2, 0, NMT_NEG,	0,	OT_NONE,	OT_NONE		,ACT_NL	],
		[  2, 0, NMT_RETN,	0,	OT_NONE,	OT_NONE		,ACT_NL	],
		[  2, 0, NMT_IM,	1,	OT_IM_1,	OT_NONE		,ACT_NL	],
		[  2, 0, NMT_LD,	2,	OT_REG_A,	OT_REG_I	,ACT_NL	],
		[  2, 0, NMT_IN,	2,	OT_REG_E,	OT_PORT_C	,ACT_IN	],
		[  2, 0, NMT_OUT,	2,	OT_PORT_C,	OT_REG_E	,ACT_OT	],
		[  2, 0, NMT_ADC,	2,	OT_REG_HL,	OT_REG_DE	,ACT_NL	],
		[  4, 2, NMT_LD,	2,	OT_REG_DE,	OT_ABS		,ACT_RD	],
		[  2, 0, NMT_NEG,	0,	OT_NONE,	OT_NONE		,ACT_NL	],
		[  2, 0, NMT_RETN,	0,	OT_NONE,	OT_NONE		,ACT_NL	],
		[  2, 0, NMT_IM,	1,	OT_IM_2,	OT_NONE		,ACT_NL	],
		[  2, 0, NMT_LD,	2,	OT_REG_A,	OT_REG_R	,ACT_NL	],
		// ED:60-6F
		[  2, 0, NMT_IN,	2,	OT_REG_H,	OT_PORT_C	,ACT_IN	],
		[  2, 0, NMT_OUT,	2,	OT_PORT_C,	OT_REG_H	,ACT_OT	],
		[  2, 0, NMT_SBC,	2,	OT_REG_HL,	OT_REG_HL	,ACT_NL	],
		[  4, 2, NMT_LD,	2,	OT_ABS,		OT_REG_HL	,ACT_WT	],
		[  2, 0, NMT_NEG,	0,	OT_NONE,	OT_NONE		,ACT_NL	],
		[  2, 0, NMT_RETN,	0,	OT_NONE,	OT_NONE		,ACT_NL	],
		[  2, 0, NMT_IM,	1,	OT_IM_0,	OT_NONE		,ACT_NL	],
		[  2, 0, NMT_RRD,	0,	OT_NONE,	OT_NONE		,ACT_NL	],
		[  2, 0, NMT_IN,	2,	OT_REG_L,	OT_PORT_C	,ACT_IN	],
		[  2, 0, NMT_OUT,	2,	OT_PORT_C,	OT_REG_L	,ACT_OT	],
		[  2, 0, NMT_ADC,	2,	OT_REG_HL,	OT_REG_HL	,ACT_NL	],
		[  4, 2, NMT_LD,	2,	OT_REG_HL,	OT_ABS		,ACT_RD	],
		[  2, 0, NMT_NEG,	0,	OT_NONE,	OT_NONE		,ACT_NL	],
		[  2, 0, NMT_RETN,	0,	OT_NONE,	OT_NONE		,ACT_NL	],
		[  2, 0, NMT_IM,	1,	OT_IM_0,	OT_NONE		,ACT_NL	],
		[  2, 0, NMT_RLD,	0,	OT_NONE,	OT_NONE		,ACT_NL	],
		// ED:70-7F
		[  2, 0, NMT_IN,	2,	OT_REG_F,	OT_PORT_C	,ACT_IN	],
		[  2, 0, NMT_OUT,	2,	OT_PORT_C,	OT_BIT_0	,ACT_OT	],
		[  2, 0, NMT_SBC,	2,	OT_REG_HL,	OT_REG_SP	,ACT_NL	],
		[  4, 2, NMT_LD,	2,	OT_ABS,		OT_REG_SP	,ACT_WT	],
		[  2, 0, NMT_NEG,	0,	OT_NONE,	OT_NONE		,ACT_NL	],
		[  2, 0, NMT_RETN,	0,	OT_NONE,	OT_NONE		,ACT_NL	],
		[  2, 0, NMT_IM,	1,	OT_IM_1,	OT_NONE		,ACT_NL	],
		[  1, 0, NMT_NOP,	0,	OT_NONE,	OT_NONE,	ACT_NL	],
		[  2, 0, NMT_IN,	2,	OT_REG_A,	OT_PORT_C	,ACT_IN	],
		[  2, 0, NMT_OUT,	2,	OT_PORT_C,	OT_REG_A	,ACT_OT	],
		[  2, 0, NMT_ADC,	2,	OT_REG_HL,	OT_REG_SP	,ACT_NL	],
		[  4, 2, NMT_LD,	2,	OT_REG_SP,	OT_ABS		,ACT_RD	],
		[  2, 0, NMT_NEG,	0,	OT_NONE,	OT_NONE		,ACT_NL	],
		[  2, 0, NMT_RETN,	0,	OT_NONE,	OT_NONE		,ACT_NL	],
		[  2, 0, NMT_IM,	1,	OT_IM_2,	OT_NONE		,ACT_NL	],
		[  1, 0, NMT_NOP,	0,	OT_NONE,	OT_NONE,	ACT_NL	],
		// ED:80-8F
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		// ED:90-9F
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		// ED:A0-AF
		[  2, 0, NMT_LDI,	0,	OT_NONE,	OT_NONE		,ACT_RW	],
		[  2, 0, NMT_CPI,	0,	OT_NONE,	OT_NONE		,ACT_RD	],
		[  2, 0, NMT_INI,	0,	OT_NONE,	OT_NONE		,ACT_IN	],
		[  2, 0, NMT_OUTI,	0,	OT_NONE,	OT_NONE		,ACT_OT	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  2, 0, NMT_LDD,	0,	OT_NONE,	OT_NONE		,ACT_RW	],
		[  2, 0, NMT_CPD,	0,	OT_NONE,	OT_NONE		,ACT_RD	],
		[  2, 0, NMT_IND,	0,	OT_NONE,	OT_NONE		,ACT_IN	],
		[  2, 0, NMT_OUTD,	0,	OT_NONE,	OT_NONE		,ACT_OT	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		// ED:B0-BF
		[  2, 0, NMT_LDIR,	0,	OT_NONE,	OT_NONE		,ACT_RW	],
		[  2, 0, NMT_CPIR,	0,	OT_NONE,	OT_NONE		,ACT_RD	],
		[  2, 0, NMT_INIR,	0,	OT_NONE,	OT_NONE		,ACT_IN	],
		[  2, 0, NMT_OTIR,	0,	OT_NONE,	OT_NONE		,ACT_OT	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  2, 0, NMT_LDDR,	0,	OT_NONE,	OT_NONE		,ACT_RW	],
		[  2, 0, NMT_CPDR,	0,	OT_NONE,	OT_NONE		,ACT_RD	],
		[  2, 0, NMT_INDR,	0,	OT_NONE,	OT_NONE		,ACT_IN	],
		[  2, 0, NMT_OTDR,	0,	OT_NONE,	OT_NONE		,ACT_OT	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		// ED:C0-CF
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		// ED:D0-DF
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		// ED:E0-EF
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		// ED:F0-FF
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
	],[
		// FD:00-0F
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  2, 0, NMT_ADD,	2,	OT_REG_IY,	OT_REG_BC	,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		// FD:10-1F
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  2, 0, NMT_ADD,	2,	OT_REG_IY,	OT_REG_DE	,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		// FD:20-2F
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  4, 2, NMT_LD,	2,	OT_REG_IY,	OT_IMM_WORD	,ACT_NL	],
		[  4, 2, NMT_LD,	2,	OT_ABS,		OT_REG_IY	,ACT_WT	],
		[  2, 0, NMT_INC,	1,	OT_REG_IY,	OT_NONE		,ACT_NL	],
		[  2, 0, NMT_INC,	1,	OT_REG_IYH,	OT_NONE		,ACT_NL	],
		[  2, 0, NMT_DEC,	1,	OT_REG_IYH,	OT_NONE		,ACT_NL	],
		[  3, 2, NMT_LD,	2,	OT_REG_IYH,	OT_IMM_BYTE	,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  2, 0, NMT_ADD,	2,	OT_REG_IY,	OT_REG_IY	,ACT_NL	],
		[  4, 2, NMT_LD,	2,	OT_REG_IY,	OT_ABS		,ACT_RD	],
		[  2, 0, NMT_DEC,	1,	OT_REG_IY,	OT_NONE		,ACT_NL	],
		[  2, 0, NMT_INC,	1,	OT_REG_IYL,	OT_NONE		,ACT_NL	],
		[  2, 0, NMT_DEC,	1,	OT_REG_IYL,	OT_NONE		,ACT_NL	],
		[  3, 2, NMT_LD,	2,	OT_REG_IYL,	OT_IMM_BYTE	,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		// FD:30-,ACT_NL	3F
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  3, 2, NMT_INC,	1,	OT_IDX_IY,	OT_NONE		,ACT_RW	],
		[  3, 2, NMT_DEC,	1,	OT_IDX_IY,	OT_NONE		,ACT_RW	],
		[  4, 2, NMT_LD,	2,	OT_IDX_IY,	OT_IMM_BYTE	,ACT_WT	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  2, 0, NMT_ADD,	2,	OT_REG_IY,	OT_REG_SP	,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		// FD:40-4F
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  2, 0, NMT_LD,	2,	OT_REG_B,	OT_REG_IYH	,ACT_NL	],
		[  2, 0, NMT_LD,	2,	OT_REG_B,	OT_REG_IYL	,ACT_NL	],
		[  3, 2, NMT_LD,	2,	OT_REG_B,	OT_IDX_IY	,ACT_RD	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  2, 0, NMT_LD,	2,	OT_REG_C,	OT_REG_IYH	,ACT_NL	],
		[  2, 0, NMT_LD,	2,	OT_REG_C,	OT_REG_IYL	,ACT_NL	],
		[  3, 2, NMT_LD,	2,	OT_REG_C,	OT_IDX_IY	,ACT_RD	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		// FD:50-5F
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  2, 0, NMT_LD,	2,	OT_REG_D,	OT_REG_IYH	,ACT_NL	],
		[  2, 0, NMT_LD,	2,	OT_REG_D,	OT_REG_IYL	,ACT_NL	],
		[  3, 2, NMT_LD,	2,	OT_REG_D,	OT_IDX_IY	,ACT_RD	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  2, 0, NMT_LD,	2,	OT_REG_E,	OT_REG_IYH	,ACT_NL	],
		[  2, 0, NMT_LD,	2,	OT_REG_E,	OT_REG_IYL	,ACT_NL	],
		[  3, 2, NMT_LD,	2,	OT_REG_E,	OT_IDX_IY	,ACT_RD	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		// FD:60-6F
		[  2, 0, NMT_LD,	2,	OT_REG_IYH,	OT_REG_B	,ACT_NL	],
		[  2, 0, NMT_LD,	2,	OT_REG_IYH,	OT_REG_C	,ACT_NL	],
		[  2, 0, NMT_LD,	2,	OT_REG_IYH,	OT_REG_D	,ACT_NL	],
		[  2, 0, NMT_LD,	2,	OT_REG_IYH,	OT_REG_E	,ACT_NL	],
		[  2, 0, NMT_LD,	2,	OT_REG_IYH,	OT_REG_IYH	,ACT_NL	],
		[  2, 0, NMT_LD,	2,	OT_REG_IYH,	OT_REG_IYL	,ACT_NL	],
		[  3, 2, NMT_LD,	2,	OT_REG_H,	OT_IDX_IY	,ACT_RD	],
		[  2, 0, NMT_LD,	2,	OT_REG_IYH,	OT_REG_A	,ACT_NL	],	// IYH
		[  2, 0, NMT_LD,	2,	OT_REG_IYL,	OT_REG_B	,ACT_NL	],
		[  2, 0, NMT_LD,	2,	OT_REG_IYL,	OT_REG_C	,ACT_NL	],
		[  2, 0, NMT_LD,	2,	OT_REG_IYL,	OT_REG_D	,ACT_NL	],
		[  2, 0, NMT_LD,	2,	OT_REG_IYL,	OT_REG_E	,ACT_NL	],
		[  2, 0, NMT_LD,	2,	OT_REG_IYL,	OT_REG_IYH	,ACT_NL	],
		[  2, 0, NMT_LD,	2,	OT_REG_IYL,	OT_REG_IYL	,ACT_NL	],
		[  3, 2, NMT_LD,	2,	OT_REG_L,	OT_IDX_IY	,ACT_RD	],
		[  2, 0, NMT_LD,	2,	OT_REG_IYL,	OT_REG_A	,ACT_NL	],
		// FD:70-7F
		[  3, 2, NMT_LD,	2,	OT_IDX_IY,	OT_REG_B	,ACT_WT	],
		[  3, 2, NMT_LD,	2,	OT_IDX_IY,	OT_REG_C	,ACT_WT	],
		[  3, 2, NMT_LD,	2,	OT_IDX_IY,	OT_REG_D	,ACT_WT	],
		[  3, 2, NMT_LD,	2,	OT_IDX_IY,	OT_REG_E	,ACT_WT	],
		[  3, 2, NMT_LD,	2,	OT_IDX_IY,	OT_REG_H	,ACT_WT	],
		[  3, 2, NMT_LD,	2,	OT_IDX_IY,	OT_REG_L	,ACT_WT	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  3, 2, NMT_LD,	2,	OT_IDX_IY,	OT_REG_A	,ACT_WT	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  2, 0, NMT_LD,	2,	OT_REG_A,	OT_REG_IYH	,ACT_NL	],	// IYH
		[  2, 0, NMT_LD,	2,	OT_REG_A,	OT_REG_IYL	,ACT_NL	],	// IYL
		[  3, 2, NMT_LD,	2,	OT_REG_A,	OT_IDX_IY	,ACT_RD	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		// FD:80-8F
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  2, 0, NMT_AND,	2,	OT_REG_A,	OT_REG_IYH	,ACT_NL	],
		[  2, 0, NMT_AND,	2,	OT_REG_A,	OT_REG_IYL	,ACT_NL	],
		[  3, 2, NMT_ADD,	2,	OT_REG_A,	OT_IDX_IY	,ACT_RD	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  2, 0, NMT_ADC,	2,	OT_REG_A,	OT_REG_IYH	,ACT_NL	],
		[  2, 0, NMT_ADC,	2,	OT_REG_A,	OT_REG_IYL		,ACT_NL	],
		[  3, 2, NMT_ADC,	2,	OT_REG_A,	OT_IDX_IY	,ACT_RD	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		// FD:90-9F
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  2, 0, NMT_SUB,	2,	OT_REG_A,	OT_REG_IYH	,ACT_NL	],
		[  2, 0, NMT_SUB,	2,	OT_REG_A,	OT_REG_IYL	,ACT_NL	],
		[  3, 2, NMT_SUB,	1,	OT_IDX_IY,	OT_NONE		,ACT_RD	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  2, 0, NMT_SBC,	2,	OT_REG_A,	OT_REG_IYH	,ACT_NL	],
		[  2, 0, NMT_SBC,	2,	OT_REG_A,	OT_REG_IYH	,ACT_NL	],
		[  3, 2, NMT_SBC,	2,	OT_REG_A,	OT_IDX_IY	,ACT_RD	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		// FD:A0-AF
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  2, 0, NMT_AND,	1,	OT_REG_IYH,	OT_NONE		,ACT_NL	],
		[  2, 0, NMT_AND,	1,	OT_REG_IYL,	OT_NONE		,ACT_NL	],
		[  3, 2, NMT_AND,	1,	OT_IDX_IY,	OT_NONE		,ACT_RD	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  2, 0, NMT_XOR,	1,	OT_REG_IYH,	OT_NONE		,ACT_NL	],
		[  2, 0, NMT_XOR,	1,	OT_REG_IYL,	OT_NONE		,ACT_NL	],
		[  3, 2, NMT_XOR,	1,	OT_IDX_IY,	OT_NONE		,ACT_RD	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		// FD:B0-BF
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  2, 0, NMT_OR,	1,	OT_REG_IYH,	OT_NONE		,ACT_NL	],
		[  2, 0, NMT_OR,	1,	OT_REG_IYL,	OT_NONE		,ACT_NL	],
		[  3, 2, NMT_OR,	1,	OT_IDX_IY,	OT_NONE		,ACT_RD	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  2, 0, NMT_CP,	1,	OT_REG_IYH,	OT_NONE		,ACT_NL	],
		[  2, 0, NMT_CP,	1,	OT_REG_IYL,	OT_NONE		,ACT_NL	],
		[  3, 2, NMT_CP,	1,	OT_IDX_IY,	OT_NONE		,ACT_RD	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		// FD:C0-CF
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[ -6, 0, NMT_UND,	0,	OT_NONE,	OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		// FD:D0-DF
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		// FD:E0-EF
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  2, 0, NMT_POP,	1,	OT_REG_IY,	OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  2, 0, NMT_EX,	2,	OT_ABS_SP,	OT_REG_IY	,ACT_WT	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  2, 0, NMT_PUSH,	1,	OT_REG_IY,	OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  2, 2, NMT_JP,	1,	OT_ABS_IY,	OT_NONE		,ACT_RD	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		// FD:F0-FF
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  2, 0, NMT_LD,	2,	OT_REG_SP,	OT_REG_IY	,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
	],[
		// DD CB xx :00-0F
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  4, 2, NMT_RLC,	1,	OT_IDX_IX,	OT_NONE		,ACT_RW	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  4, 2, NMT_RRC,	1,	OT_IDX_IX,	OT_NONE		,ACT_RW	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		// DD CB xx :10-1F
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  4, 2, NMT_RL,	1,	OT_IDX_IX,	OT_NONE		,ACT_RW	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  4, 2, NMT_RR,	1,	OT_IDX_IX,	OT_NONE		,ACT_RW	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		// DD CB xx :20-2F
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  4, 2, NMT_SLA,	1,	OT_IDX_IX,	OT_NONE		,ACT_RW	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  4, 2, NMT_SRA,	1,	OT_IDX_IX,	OT_NONE		,ACT_RW	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		// DD CB xx :30-3F
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  4, 2, NMT_SRL,	1,	OT_IDX_IX,	OT_NONE		,ACT_RW	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		// DD CB xx :40-4F
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  4, 2, NMT_BIT,	2,	OT_BIT_0,	OT_IDX_IX	,ACT_RD	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  4, 2, NMT_BIT,	2,	OT_BIT_1,	OT_IDX_IX	,ACT_RD	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		// DD CB xx :50-5F
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  4, 2, NMT_BIT,	2,	OT_BIT_2,	OT_IDX_IX	,ACT_RD	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  4, 2, NMT_BIT,	2,	OT_BIT_3,	OT_IDX_IX	,ACT_RD	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		// DD CB xx :60-6F
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  4, 2, NMT_BIT,	2,	OT_BIT_4,	OT_IDX_IX	,ACT_RD	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  4, 2, NMT_BIT,	2,	OT_BIT_5,	OT_IDX_IX	,ACT_RD	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		// DD CB xx :70-7F
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  4, 2, NMT_BIT,	2,	OT_BIT_6,	OT_IDX_IX	,ACT_RD	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  4, 2, NMT_BIT,	2,	OT_BIT_7,	OT_IDX_IX	,ACT_RD	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		// DD CB xx :80-8F
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  4, 2, NMT_RES,	2,	OT_BIT_0,	OT_IDX_IX	,ACT_RW	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  4, 2, NMT_RES,	2,	OT_BIT_1,	OT_IDX_IX	,ACT_RW	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		// DD CB xx :90-9F
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  4, 2, NMT_RES,	2,	OT_BIT_2,	OT_IDX_IX	,ACT_RW	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  4, 2, NMT_RES,	2,	OT_BIT_3,	OT_IDX_IX	,ACT_RW	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		// DD CB xx :A0-AF
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  4, 2, NMT_RES,	2,	OT_BIT_4,	OT_IDX_IX	,ACT_RW	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  4, 2, NMT_RES,	2,	OT_BIT_5,	OT_IDX_IX	,ACT_RW	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		// DD CB xx :B0-BF
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  4, 2, NMT_RES,	2,	OT_BIT_6,	OT_IDX_IX	,ACT_RW	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  4, 2, NMT_RES,	2,	OT_BIT_7,	OT_IDX_IX	,ACT_RW	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		// DD CB xx :C0-CF
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  4, 2, NMT_SET,	2,	OT_BIT_0,	OT_IDX_IX	,ACT_RW	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  4, 2, NMT_SET,	2,	OT_BIT_1,	OT_IDX_IX	,ACT_RW	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		// DD CB xx :D0-DF
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  4, 2, NMT_SET,	2,	OT_BIT_2,	OT_IDX_IX	,ACT_RW	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  4, 2, NMT_SET,	2,	OT_BIT_3,	OT_IDX_IX	,ACT_RW	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		// DD CB xx :E0-EF
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  4, 2, NMT_SET,	2,	OT_BIT_4,	OT_IDX_IX	,ACT_RW	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  4, 2, NMT_SET,	2,	OT_BIT_5,	OT_IDX_IX	,ACT_RW	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		// DD CB xx :F0-FF
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  4, 2, NMT_SET,	2,	OT_BIT_6,	OT_IDX_IX	,ACT_RW	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  4, 2, NMT_SET,	2,	OT_BIT_7,	OT_IDX_IX	,ACT_RW	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
	],[
		// FD CB xx :00-0F
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  4, 2, NMT_RLC,	1,	OT_IDX_IY,	OT_NONE		,ACT_RW	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  4, 2, NMT_RRC,	1,	OT_IDX_IY,	OT_NONE		,ACT_RW	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		// FD CB xx :10-1F
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  4, 2, NMT_RL,	1,	OT_IDX_IY,	OT_NONE		,ACT_RW	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  4, 2, NMT_RR,	1,	OT_IDX_IY,	OT_NONE		,ACT_RW	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		// FD CB xx :20-2F
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  4, 2, NMT_SLA,	1,	OT_IDX_IY,	OT_NONE		,ACT_RW	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  4, 2, NMT_SRA,	1,	OT_IDX_IY,	OT_NONE		,ACT_RW	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		// FD CB xx :30-3F
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  4, 2, NMT_SRL,	1,	OT_IDX_IY,	OT_NONE		,ACT_RW	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		// FD CB xx :40-4F
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  4, 2, NMT_BIT,	2,	OT_BIT_0,	OT_IDX_IY	,ACT_RD	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  4, 2, NMT_BIT,	2,	OT_BIT_1,	OT_IDX_IY	,ACT_RD	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		// FD CB xx :50-5F
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  4, 2, NMT_BIT,	2,	OT_BIT_2,	OT_IDX_IY	,ACT_RD	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  4, 2, NMT_BIT,	2,	OT_BIT_3,	OT_IDX_IY	,ACT_RD	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		// FD CB xx :60-6F
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  4, 2, NMT_BIT,	2,	OT_BIT_4,	OT_IDX_IY	,ACT_RD	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  4, 2, NMT_BIT,	2,	OT_BIT_5,	OT_IDX_IY	,ACT_RD	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		// FD CB xx :70-7F
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  4, 2, NMT_BIT,	2,	OT_BIT_6,	OT_IDX_IY	,ACT_RD	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  4, 2, NMT_BIT,	2,	OT_BIT_7,	OT_IDX_IY	,ACT_RD	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		// FD CB xx :80-8F
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  4, 2, NMT_SET,	2,	OT_BIT_0,	OT_IDX_IY	,ACT_RW	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  4, 2, NMT_SET,	2,	OT_BIT_1,	OT_IDX_IY	,ACT_RW	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		// FD CB xx :90-9F
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  4, 2, NMT_SET,	2,	OT_BIT_2,	OT_IDX_IY	,ACT_RW	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  4, 2, NMT_SET,	2,	OT_BIT_3,	OT_IDX_IY	,ACT_RW	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		// FD CB xx :A0-AF
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  4, 2, NMT_SET,	2,	OT_BIT_4,	OT_IDX_IY	,ACT_RW	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  4, 2, NMT_SET,	2,	OT_BIT_5,	OT_IDX_IY	,ACT_RW	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		// FD CB xx :B0-BF
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  4, 2, NMT_SET,	2,	OT_BIT_6,	OT_IDX_IY	,ACT_RW	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  4, 2, NMT_SET,	2,	OT_BIT_7,	OT_IDX_IY	,ACT_RW	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		// FD CB xx :C0-CF
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  4, 2, NMT_RES,	2,	OT_BIT_0,	OT_IDX_IY	,ACT_RW	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  4, 2, NMT_RES,	2,	OT_BIT_1,	OT_IDX_IY	,ACT_RW	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		// FD CB xx :D0-DF
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  4, 2, NMT_RES,	2,	OT_BIT_2,	OT_IDX_IY	,ACT_RW	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  4, 2, NMT_RES,	2,	OT_BIT_3,	OT_IDX_IY	,ACT_RW	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		// FD CB xx :E0-EF
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  4, 2, NMT_RES,	2,	OT_BIT_4,	OT_IDX_IY	,ACT_RW	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  4, 2, NMT_RES,	2,	OT_BIT_5,	OT_IDX_IY	,ACT_RW	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		// FD CB xx :F0-FF
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  4, 2, NMT_RES,	2,	OT_BIT_6,	OT_IDX_IY	,ACT_RW	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
		[  4, 2, NMT_RES,	2,	OT_BIT_7,	OT_IDX_IY	,ACT_RW	],
		[  1, 0, NMT_UND,	1,	OT_UND,		OT_NONE		,ACT_NL	],
	]
];

function pad00hex(padstr,num)
{
	var str = num.toString(16).toUpperCase();
	var outs = padstr.substr(0,padstr.length - str.length) + str;
	return outs;
}

function make_byte(num)
{
	return "0x" + pad00hex("00",num);
}

function make_word(num)
{
	return "0x" + pad00hex("0000",num);
}

function make_ofs_byte(num)
{
	var outs = "";
	if (num > 0x80) {
		outs += "-0x" ;
		num = (num ^ 0xFF)+1;
	} else {
		outs += "+0x"
	}

	make_byte(num);
}

function getOPdata( buf , addr )
{
	var	ofstbl = [ 0, 1, 3 ];
	var	n = 0, ofs = 0;

	while( disz80[n][buf[addr+ofstbl[ofs]]][0] < 0 ) { // 0 = len
		n = -disz80[n][buf[addr+ofstbl[ofs]]][0];
		ofs++;
	}

	return disz80[n][buf[addr+ofstbl[ofs]]];
}

function disasmZ80( buf , base , addr )
{
	var i;
	var outs = pad00hex("0000",base+addr)+" :";
	var data = getOPdata(buf,addr);
	var datalen = data[0];

	// write instruction binary data
	for (i = 0; i < datalen; i++ ) {
		outs += (" " + pad00hex("00",buf[addr+i]));
	}
	switch( datalen ) {
	case 4:
		outs += "\t" ;
		break;
	default:
		outs += "\t\t" ;
		break;
	}

	// write nimonic
	// typedef struct [
	//	int		[0]len;				// 命令長
	//	int		[1]index;				// オペランドが参照開始するデータの位置
	//	int		[2]nimonic;			// ニーモニック文字列の番号
	//	int		[3]op_num;				// オペランド数
	//	int		[4]op0_type;			// 第1オペランド
	//	int		[5]op1_type;			// 第2オペランド
	//	int		[6]acc_type;			// アクセスタイプ(リード/ライト/イン/アウト)
	//] disZ80data;
	outs += nimonic[data[2]] + "\t" ;
	var line = 32;
	var data_op_num = data[3];
	if( data_op_num != 0 ) {
		var op_type = 4;
		var ofs = data[1];
		var temp;
		for( i = 0; i < data_op_num; i++ ) {
			if( i != 0 ) {
				outs += ",";
				line++;
			}
			if( data[op_type] < OT_IMM_BYTE ) {
				outs += optype0[data[op_type]];
				line += optype0[data[op_type]].length;
				op_type++;
			} else {
				switch( data[op_type] ) {
				case OT_NUL:
					temp = make_byte( buf[addr+ofs] );
					line += temp.length;
					outs += temp;
					ofs++;
					break;
				case OT_IMM_BYTE:
				case OT_UND:
					temp = make_byte( buf[addr+ofs] );
					line += temp.length;
					outs += temp;
					ofs++;
					op_type++;
					break;
				case OT_IMM_PORT:
					temp= "(" + make_byte( buf[addr+ofs] ) + ")" ;
					line += temp.length;
					outs += temp;
					ofs++;
					op_type++;
					break;
				case OT_RST:
					temp = make_byte( buf[addr]-0xc7 );
					line += temp.length;
					outs += temp;
					op_type++;
					break;
				case OT_IDX_IX:
					temp = "(ix" + make_ofs_byte( buf[addr+ofs] ) + ")";
					line += temp.length;
					outs += temp;
					ofs++;
					op_type++;
					break;
				case OT_IDX_IY:
					temp = "(iy" + make_ofs_byte( buf[addr+ofs] ) + ")";
					line += temp.length;
					outs += temp;
					ofs++;
					op_type++;
					break;
				case OT_REL:
					var rel = buf[addr+ofs];
					if( rel >= 0x80 ) rel -= 0x100;
					temp = make_word( base+addr+rel+2 );
					line += temp.length;
					outs += temp;
					ofs++;
                    op_type++;
					break;
				case OT_IMM_WORD:
					temp = make_word((buf[addr+ofs+1]<<8)+buf[addr+ofs] );
					line += temp.length;
					outs += temp;
					ofs += 2;
                    op_type++;
					break;
				case OT_ABS:
					temp = "(" + make_word((buf[addr+ofs+1]<<8)+buf[addr+ofs] ) + ")";
					line += temp.length;
					outs += temp;
					ofs += 2;
                    op_type++;
					break;
				}
			}
		}
	}
	while( line < 48 ) {
		outs += "\t";
		line += 8;
	}

	outs += ";\r\n";
	var obj = new Object();
	obj.line = outs;
	obj.len  = datalen;
	return obj;
}

