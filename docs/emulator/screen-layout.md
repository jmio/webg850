# 画面レイアウトの固定

ウィンドウサイズを変えても、液晶画面・キーボード・デバッグ用 UI の位置関係が
崩れないようにする仕組み。

## 何が問題だったか

もとは `.main1` / `.main2` が `justify-content: space-around` で、幅の制約が無かった。
そのためウィンドウを広げると各セクションが左右に散らばり、液晶とキーボードの
位置関係が変わってしまっていた。

## どう直したか

**全体を固定幅のひとかたまりとして扱い、ウィンドウが狭いときだけ全体を縮小する。**

```html
<div id="deviceWrap">
  <div id="device">
    <div class="main1"> LCD + デバッグ UI </div>
    <div class="main2"> キーボード + テンキー </div>
  </div>
</div>
<textarea id="TEXT_CONSOLE"></textarea>   ← 枠の外
```

```css
#deviceWrap { overflow: hidden; }
#device     { width: max-content; margin: 0; transform-origin: top left; }
.main1, .main2 { display: flex; justify-content: flex-start; align-items: flex-start; gap: 8px; }
```

- `width: max-content` で内容ぴったりの幅に固定する。これ以上広がりも縮みもしない
- `justify-content: flex-start` にして、余った幅を要素間に配らない

縮小と中央寄せは `fitDevice()` が行う。`resize` と `load` で呼ばれる。

```js
var avail = document.documentElement.clientWidth - 16;
var scale = Math.min(1, avail / dev.offsetWidth);
var left  = Math.max(0, (avail - dev.offsetWidth * scale) / 2);
dev.style.transform = "translateX(" + left + "px) scale(" + scale + ")";
wrap.style.height = Math.ceil(dev.offsetHeight * scale) + "px";
```

## 実装上の注意（はまりどころ）

- **`transform` はレイアウトに影響しない。** 縮小しても元の高さのまま場所を取るので、
  親（`#deviceWrap`）の高さを `元の高さ × 倍率` に詰めないと下に大きな空白が残る。
- **`margin: 0 auto` では中央に寄らない。** 要素がウィンドウより広いとき auto マージンは
  0 になるため、狭いウィンドウで左に寄ってしまう。`translateX` で明示的に寄せている。
- **`transform-origin` は `top left`。** `top center` にすると、要素がウィンドウより
  広いときに左へはみ出す。
- **デバッグ窓（`#TEXT_CONSOLE`）は枠の外に置く。** 中に入れると、ENB で開閉するたびに
  全体の幅が変わって倍率が変動してしまう。外に出して `width: 100%` にしてある。
- 倍率が 1 未満のとき、液晶はブラウザによって縮小描画される。ドットの見え方が
  変わるのが気になる場合はウィンドウを広げれば原寸に戻る。

## 全体の幅を決めているもの

`#device` の幅は「一番広い行」で決まる。現状は
**液晶 (608px) + すきま (8px) + デバッグ用の操作パネル (398px) = 1014px** で、
キーボードの行はこれより狭い。

つまり**デバッグパネルの中身が広がると、画面全体の幅が広がって倍率が下がる**。
表のセルに長い文を入れないこと。

実際に起きた例:

| 変更 | `#device` の幅 |
|:--|:--|
| 「BSAVE を bsave.bin へ保存 / LOAD BIN の後に BLOAD で書き戻し」の 1 行 | 1177px |
| 「BSAVE → bsave.bin」「LOAD BIN → BLOAD」の 2 行に短縮 | 1018px |
| さらに 16 進入力欄の幅を固定 | 1014px |

### 16 進入力欄には幅を指定する

`textarea.HEXINPUT` は `cols="6"` だけでは幅がフォント依存になり、
列幅を押し広げたり、逆に列が狭いときにセルからはみ出したりする。
CSS で幅を固定し、`box-sizing: border-box` と `resize: none` を付けてある。

```css
textarea.HEXINPUT {
    width: 56px;
    height: 20px;
    box-sizing: border-box;
    resize: none;
    vertical-align: middle;
}
```

## 動作確認（2026-08-30）

| ウィンドウ幅 | 倍率 | 結果 |
|:--|:--|:--|
| 1920px | 1.0 | 左右の余白が等しく中央に配置 |
| 1280px | 1.0 | 原寸のまま |
| 700px | 0.58 | 全体が縮小され横スクロールなし |
| 400px | 0.33 | 同上 |

- 縮小した状態でもボタンのクリックは正しく届く（`GKEY_7` のボタンを押して確認）
- デバッグ窓を開閉しても倍率は変わらない
