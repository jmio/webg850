/*
 * calib.h - 時間軸の較正
 *
 * 実機の BSAVE が実際に出しているパルス幅を測り、そこから送出側の
 * タイミング定数を決める。エミュレータから 9/8 換算で推定した値に
 * 頼らずに済ませるのが目的。
 *
 * 統計は割り込みハンドラの中で直接積む（エッジのリングバッファを
 * 経由しない）。こうしておくと送出でビジーウェイトしている最中でも
 * 並行して測れるので、自分が出した波形を D3→D2 のジャンパで読み返す
 * 自己検証（SELFTEST）にも同じ仕組みが使える。
 */
#pragma once

#include <Arduino.h>

/* 統計の採取を始める / 止める */
void calArm(void);
void calDisarm(void);

/* ポーリング方式のときに主ループから呼ぶ */
void calPoll(void);

/* 採取した結果を出力する */
void calReport(void);

/* CAL コマンド: 指定時間だけ測って結果を出す */
void calRun(uint32_t timeout_ms);
