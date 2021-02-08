# webg850

本環境は、Firefox ブラウザで SHARP PC-G850 の動作確認、解析等ができるようにしたものです。

オリジナルの g800.js は SHARP PC-G800 系列全般をサポートしていますが、
本環境は SHARP PC-G850 モードでの動作を想定しています。

## ROMの準備

動作には、PC-G850 系のポケコンから取り出した ROM が必要です。

ROM は実機から取り出した内容 (intel hex ファイル) を

rom00.ihx ... rom0f.ihx .. rom15.ihx

の名前で rom.zip の名前で固めたものを webg850v.htm と同じフォルダから読むようにできていますが、
起動時に ROM をロードするコードは g800main.js の init() にあるので、
取り出したファイル名、拡張子等に合わせて修正してください。

## Firefox の準備

ローカルファイルからの起動ができるように、Firefox の設定が必要です。
firefox_localfile.txt を参照して設定してください。

設定が完了したら webg850v.htm を Firefox で開くと起動します。

## 操作
| ボタン/チェックボックス | 機能 |
|:----------------------|:----|
| ENB ボタン| デバッグ出力窓を有効にします|
| CLR ボタン| デバッグ出力窓をクリアします|
| DISASM ボタン| そばの入力窓のアドレスから、COUNT 長ディスアセンブルしてデバッグ出力窓に表示します。|
| DUMP ボタン| そばの入力窓のアドレスから、COUNT 長ダンプリストをデバッグ出力窓に表示します。|
| REGS ボタン| レジスタダンプをデバッグ出力窓に表示します。|
| STEP ボタン| [BKPT] にチェックが入っていてブレーク状態のとき、ステップ実行します。|
| RUN ボタン| [BKPT] にチェックが入っていてブレーク状態のとき、再びブレーク条件が成立するまで実行します。|
| BKPT チェックボックス| ブレーク機能の有効・無効を切り替えます。Z80 の PC が横の入力窓のアドレスに一致するとブレークします。|
| FETCH チェックボックス| ここにチェックがあるとき、入力窓のアドレスのメモリ READ でもブレークします。|
| RAMSAVE ボタン| 0x0040-0x7FFF までの内容を ram.txt というファイルに intex hex 形式で読み出します。このファイルは同梱の起動用 RAM ファイル(ram.txt)を差し替えて利用することで、保存時の環境を起動時にロードできますが、起動用として利用する場合には電源 OFF を押してから、このボタンを押して RAM の内容を保存してください。|
| LOAD IHX ボタン| intel hex 形式のプログラムをロードできます。|




## 本環境では、下記のソフトを改変、もしくはそのまま利用しています。

### エミュレータ本体 (ファイルを分割、改変)
```
g800.js
Copyright (c) 2015 maruhiro
All rights reserved. 

http://ver0.sakura.ne.jp/js/index.html

```

### Z80 ディスアセンブラ (c でかかれたものを js に変換して組み込み)
```
***** Manbow-J Disassembler for Z80 Version 0.06 + 01 ******
Original Programd by Minachun
Reprogrammed by Manbow-J
Patched by RuRuRu

https://github.com/rururutan/mdz80
```

### ZIP ローダ
```
JSZip - A Javascript class for generating and reading zip files
http://stuartk.com/jszip

(c) 2009-2014 Stuart Knightley <stuart [at] stuartk.com>
Dual licenced under the MIT license or GPLv3. See https://raw.github.com/Stuk/jszip/master/LICENSE.markdown.
```