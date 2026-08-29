#!/usr/bin/env python3
"""解析用のローカル HTTP サーバ。

file:// を避けることで Firefox 固有の設定 (security.fileuri.strict_origin_policy) が
不要になり、ブラウザを選ばずにエミュレータを動かせる。

ブラウザがキャッシュした古い g800main.js を掴み続けると、コードを直しても
反映されずに悩むことになるため、すべてのレスポンスでキャッシュを禁止する。

    python tools/serve.py [ポート番号]      (既定 8850)
    → http://127.0.0.1:8850/webg850v.htm
"""

import os
import sys
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


class NoCacheHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=ROOT, **kwargs)

    def end_headers(self):
        self.send_header("Cache-Control", "no-store, must-revalidate")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        super().end_headers()

    def send_header(self, keyword, value):
        # SimpleHTTPRequestHandler が付ける Last-Modified は
        # 条件付きリクエストでの 304 を誘発するので落とす
        if keyword.lower() == "last-modified":
            return
        super().send_header(keyword, value)

    def log_message(self, fmt, *args):
        pass


def main():
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8850
    server = ThreadingHTTPServer(("127.0.0.1", port), NoCacheHandler)
    print("serving %s at http://127.0.0.1:%d/webg850v.htm" % (ROOT, port))
    server.serve_forever()


if __name__ == "__main__":
    main()
