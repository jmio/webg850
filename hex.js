/*
	Intel HEXファイルデコーダー コンストラクタ
*/
HexDecoder = function(buffer) {
	this.size = null;
	this.top = null;
	this.buffer = buffer;
};

/*
	Intel HEXファイルをメモリに書き込む
*/
HexDecoder.prototype._decode = function(hex, buf, off) {
	var top = 0xffff;
	var bottom = 0;
	var r = 0;
	var sum;
	var len;
	var address_h;
	var address_l;
	var address;
	var i;
	var val;

	if(off === undefined)
		off = 0;

	for(;;) {
		/* レコード先頭文字を得る */
		if(hex.charAt(r) != ":")
			throw new Error("ファイルの形式が不正です");
		r++;

		/* データ長を得る */
		sum = len = parseInt(hex.substr(r, 2), 16); r += 2;
		if(len == 0)
			return;

		/* オフセットレコードを得る */
		address_h = parseInt(hex.substr(r, 2), 16); r += 2;
		sum += address_h;
		address_l = parseInt(hex.substr(r, 2), 16); r += 2;
		sum += address_l;
		address = address_h << 8 | address_l;

		/* レコードタイプを得る */
		switch(parseInt(hex.substr(r, 2), 16)) {
		case 0x00: /* データレコード */
			break;
		case 0x01: /* エンドレコード */
			return;
		default: /* その他(未対応) */
			throw new Error("未対応の形式です");
		}
		r += 2;

		/* データを得る */
		for(i = address + off; i < address + off + len; i++) {
			val = parseInt(hex.substr(r, 2), 16); r += 2;
			sum += val;

			if(buf != null)
				buf[i] = val;
		}

		/* サムをチェックする */
		sum = (~sum + 1) & 0xff;
		/*
		if(sum != parseInt(hex.substr(r, 2), 16))
			throw new Error("チェックサムが合いません");
		*/
		r += 2;

		/* 先頭とサイズを得る */
		if(top > address + off)
			top = address + off;
		if(bottom < address + off)
			bottom = address + off + len ;
		this.top = top;
		this.size = bottom - top;

		/* 次の行まで移動する */
		while(r < hex.length && (hex.charAt(r) == "\r" || hex.charAt(r) == "\n"))
			r++;
	}
};

/*
	Intel HEXファイルの先頭とファイルサイズを得る
*/
HexDecoder.prototype.check = function(hex) {
	var tmp = this.buffer;
	this._decode(hex,tmp);
	this.buffer = tmp;
};

/*
	Intel HEXファイルをメモリに書き込む
*/
HexDecoder.prototype.decode = function(hex, address) {
	if(address === undefined)
		this._decode(hex,this.buffer);
	else {
		this.check(hex,this.buffer);
		this._decode(hex,this.buffer, address - this.top);
	}
	return [this.top , this.size];
};

/*
	Intel HEXファイルをサーバから読み込む
*/
HexDecoder.prototype.read = function(url, address) {
	this._hexDecoderHttp = new XMLHttpRequest();
	this._hexDecoderHttp.open("GET", url, false);
	this._hexDecoderHttp.send(null);
	this.decode(this._hexDecoderHttp.responseText, address);
};

/*
	ZIP 化された Intel HEXファイルをメモリに書き込む
*/
HexDecoder.prototype.decodezip = function(data, filelist) {
	// Zip archive
	var zip=new JSZip(data);
	for (var i=0;i<filelist.length;i++){
		var ihex=zip.file(filelist[i]).asText();
		this._decode(ihex,this.buffer[i]);
	}
};

/*
	Intel HEX ZIP ファイルをサーバから読み込む
*/
HexDecoder.prototype.readzip = function(url, filelist) {
	this._hexDecoderHttp = new XMLHttpRequest();
	this._hexDecoderHttp.open("GET", url, false);
	this._hexDecoderHttp.overrideMimeType('text\/plain; charset=x-user-defined');
	this._hexDecoderHttp.send(null);
	this.decodezip(this._hexDecoderHttp.response, filelist);
};
