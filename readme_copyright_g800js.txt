* 概要 *

g800.jsはウェブブラウザ上で動作するSHARP ポケットコンピュータ PC-G850/G815/E200
のエミュレータです. マシン語のプログラムのみ実行できます. HTML5対応ブラウザが必
要です.


* 使い方 *

通常のJavaScriptの外部ファイルのプログラムの呼び出しと同様に, HTML文書内で

<script type="text/javascript" src="g800main.js"></script>

のように記述する.


* 設定 *

CGIのようなURLパラメータで設定を変更できる.
パラメータは大文字と小文字を区別する.

例:

<script type="text/javascript" src="g800main.js?zoom=3&program=prog.hex&start=100"></script>

有効なパラメータの一覧:

machine
    エミュレートする機種を設定する. (省略時はPC-G850)
    g850ならばPC-G850, g815ならばPC-G815, e200ならばPC-E200をエミュレートする.

program
    読み込むプログラムのURLを設定する. (必須)
    形式はIntelHEXである. 複数のプログラムを読み込む場合は, |でURLを区切る.

start
    実行開始アドレスを設定する. (省略時は100)
    値は16進数である.

clocks
    CPUのクロック周波数を設定する. (省略可)
    単位はkHzである.

zoom
    LCDの倍率を設定する. (省略時は拡大なし)

orient
    LCDの向きを設定する. (省略時は横)
    vのとき横, hのとき縦になる.

fps
    LCDの更新周期を設定する. (省略時は60Hz)

lcdscales
    LCDの階調数を設定し残像をエミュレートする. (省略時は2=残像なし)
    0のとき最大となる.

buzzer
    ブザーの有無 (省略時は使用しない)
    yにするとブザーを使用する.

<ブラウザのキー>=<ポケコンのキー> とするとキーの割り当てができる.
ブラウザのキー
    backspace tab enter shift ctrl alt pause caps escape space pageup pagedown
    end home left up right down insert delete 0 1 2 3 4 5 6 7 8 9 a b c d e f
    g h i j k l m n o p q r s t u v w x y z lgui rgui menu numpad0 numpad1
    numpad2 numpad3 numpad4 numpad5 numpad6 numpad7 numpad8 numpad9 numpad*
    numpad+ numpad- numpad. numpad/ f1 f2 f3 f4 f5 f6 f7 f8 f9 f10 f11 f12
    numlock scrolllock semicolon equal , - . / ` [ \ ] '

ポケコンのキー
    0 1 2 3 4 5 6 7 8 9 a b c d e f g h i j k l m n o p q r s t u v w x y z
    ; + - * / = . rcm m+ return basic text const ans off on 2ndf sin cos tan
    fe cls npr deg ln log rcp mdf pi sqr squ ^ ( ) tab bs caps kana ins space
    left right up down shift


* ライセンス *

フォントは門真なむさんのk6x8を一部変更して使用しています.

--- k6x8のライセンス ------------------------------------------------------------------------------------------------------------------
These fonts are free softwares.
Unlimited permission is granted to use, copy, and distribute it, with or without modification, either commercially and noncommercially.
THESE FONTS ARE PROVIDED "AS IS" WITHOUT WARRANTY.

これらのフォントはフリー（自由な）ソフトウエアです。
あらゆる改変の有無に関わらず、また商業的な利用であっても、自由にご利用、複製、再配布することができますが、全て無保証とさせていただきます。

Copyright(C) 2000-2007 Num Kadoma
---------------------------------------------------------------------------------------------------------------------------------------

--- g800.jsのライセンス ------------------------------------------------------
Copyright (c) 2015 maruhiro
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
------------------------------------------------------------------------------
