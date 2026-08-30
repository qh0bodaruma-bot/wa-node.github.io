# アニメーションパターンカタログ（AN）

出典: 4ギャラリーの「動き・技術」タグ体系 + 掲載サイト23件のライブラリ実測（[03-gallery-sources.md](03-gallery-sources.md)）

**コードはすべてこのリポジトリ（Astro 4 / 外部アニメーションライブラリ 0件）にそのまま貼れる形で書いてある。**
外部ライブラリが必要なものは `依存` 欄に明記してある。

---

## 0. すべての動きに必ず付ける「停止規則」

`src/styles/global.css:323` に既存の `prefers-reduced-motion` ブロックがある。
**新しい動きを足したら、そのセレクタをこのブロックに必ず追記する。** 追記していない動きは未完成とみなす。

```css
@media (prefers-reduced-motion: reduce) {
  .あなたが追加したクラス { animation: none !important; transition: none !important; transform: none !important; }
}
```

JS側で分岐が必要な場合はこれ。

```js
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (reduce) return; // 動きを付けずに最終状態だけ適用する
```

### Astro ViewTransitions との併用（このサイト固有の落とし穴）

`<ViewTransitions />` 導入済みのため、**ページ遷移時に `DOMContentLoaded` は発火しない**。
初期化関数は必ず `astro:page-load` に紐づける。`BaseLayout.astro` が `astro:after-swap` を使っているのと同じ理由。

```js
function init() { /* ... */ }
document.addEventListener('astro:page-load', init);
```

---

## A. スクロール連動

### AN-01 フェードイン + 上昇【実装済み】
- **依存**: なし（既存）
- **場所**: `src/layouts/BaseLayout.astro:104-152` + `src/styles/global.css:293-320`
- **使い方**: 要素に `class="reveal"` を付けるだけ。`.card` `.section-title` は**自動で対象になる**。
- **除外**: 親に `data-reveal="off"` を付ける（ファーストビュー要素は除外すべき。`design-qa.md` の指摘3参照）。
- **【事実】** 現行の duration は `1.2s`。見出し用 `.reveal-heading` は `0.55s`。

### AN-02 スタッガー（順次遅延）
- **依存**: なし / **コスト**: 5分
- **概要**: 並んだ要素を 60〜100ms ずつずらして出す。カード一覧の定番。

```css
.stagger > * { transition-delay: calc(var(--i, 0) * 80ms); }
```
```astro
{items.map((item, i) => <div class="reveal" style={`--i:${i}`}>...</div>)}
```
> **上限を切ること。** 12個以上並ぶと最後の要素が1秒以上待たされて「壊れている」と見える。
> `--i` は `Math.min(i, 8)` で頭打ちにする。

### AN-03 行ごとのマスクリビール
- **依存**: なし / **コスト**: 15分
- **【事実】採用例**: Revelatio、TBWA\HAKUHODO
- **概要**: 文字が下から「せり上がって現れる」。`overflow: hidden` の親に行を入れて `translateY` する。
- **a11y**: マークアップ上は普通のテキストのまま。スクリーンリーダーへの影響なし。

```css
.line-mask { display: block; overflow: hidden; }
.line-mask > span { display: block; transform: translateY(110%); transition: transform .8s cubic-bezier(.215,.61,.355,1); }
.line-mask > span { transition-delay: calc(var(--i, 0) * 90ms); }
.reveal.active .line-mask > span { transform: translateY(0); }
```
```html
<h2 class="reveal" data-reveal="off">
  <span class="line-mask"><span style="--i:0">技術と人を、</span></span>
  <span class="line-mask"><span style="--i:1">つなぐ。</span></span>
</h2>
```
> 和文は**自分で改行位置を決めて `span` に分ける**。英語圏の自動行分割ライブラリ（SplitType）は日本語の禁則処理を壊す。

### AN-04 一文字ずつリビール
- **依存**: なし（下記は素のJS）/ **コスト**: 20分
- **【事実】採用例**: 4kake（Splitting.js 使用）
- **a11y 重大**: 文字を `<span>` に分割すると**スクリーンリーダーが1文字ずつ読み上げる**。
  必ず親に `aria-label` で元テキストを持たせ、分割後の要素は `aria-hidden="true"` にする。これをやらないなら AN-03 を使う。

```js
function splitChars(el) {
  const text = el.textContent.trim();
  el.setAttribute('aria-label', text);
  el.innerHTML = '';
  const inner = document.createElement('span');
  inner.setAttribute('aria-hidden', 'true');
  [...text].forEach((ch, i) => {
    const s = document.createElement('span');
    s.className = 'char';
    s.style.setProperty('--i', String(i));
    s.textContent = ch === ' ' ? ' ' : ch;
    inner.appendChild(s);
  });
  el.appendChild(inner);
}
```
```css
.char { display: inline-block; opacity: 0; transform: translateY(.4em);
  transition: opacity .5s, transform .5s; transition-delay: calc(var(--i) * 35ms); }
.active .char { opacity: 1; transform: none; }
```

### AN-05 パララックス（背景の速度差）
- **依存**: なし / **コスト**: 20分
- **【事実】** SANKOU!・MUUUUU 両方でタグとして独立（MUUUUU 589件）。動き系では最大母数。
- **実装は2択。CSSで済むほうを優先する。**

**(a) CSSのみ — 固定背景**
```css
.parallax-bg { background-attachment: fixed; background-size: cover; background-position: center; }
@supports (-webkit-touch-callout: none) { .parallax-bg { background-attachment: scroll; } } /* iOS Safariは非対応 */
```

**(b) JS — 速度差**（`scroll` イベントを直接使わず `requestAnimationFrame` で間引く）
```js
let ticking = false;
function onScroll() {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => {
    document.querySelectorAll('[data-parallax]').forEach((el) => {
      const speed = parseFloat(el.dataset.parallax) || 0.2;
      const rect = el.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > innerHeight) return; // 画面外は計算しない
      el.style.transform = `translate3d(0, ${(rect.top * speed).toFixed(2)}px, 0)`;
    });
    ticking = false;
  });
}
addEventListener('scroll', onScroll, { passive: true });
```
> **`passive: true` は必須。** 付けないとスクロール性能が落ちてLCP/INPが悪化する。

### AN-06 スクロール進捗バー
- **依存**: なし（CSSのみ・モダンブラウザ）/ **コスト**: 5分
- **概要**: 記事の読了率をページ上端のバーで示す。ブログ詳細に有効。

```css
@keyframes grow { from { transform: scaleX(0); } to { transform: scaleX(1); } }
.progress-bar {
  position: fixed; top: 0; left: 0; height: 3px; width: 100%; z-index: 100;
  background: var(--action); transform-origin: 0 50%;
  animation: grow linear both;
  animation-timeline: scroll(root block); /* スクロール駆動アニメーション */
}
@supports not (animation-timeline: scroll()) { .progress-bar { display: none; } }
```
> **【事実】** `animation-timeline` は Chrome/Edge 115+ / Safari 26+ で利用可。Firefox は要フラグ。
> 上記のように `@supports not` で非対応環境では**単に出さない**のが正しい。JSフォールバックを書く価値はない。

### AN-07 スティッキー・ピン留めスクロールテリング
- **依存**: なし（`position: sticky` + IntersectionObserver）/ **コスト**: 40分
- **概要**: 左のビジュアルを画面に固定したまま、右のテキストがスクロールし、対応するビジュアルに切り替わる。
- **【推測】適合度: ◎** — 「LINE → 中継 → Salesforce」の連携フローを説明するのに、このサイトで最も効く表現。`LineFlowDiagram.astro` の発展形。

```css
.pin { display: grid; grid-template-columns: 1fr 1fr; gap: 60px; }
.pin__visual { position: sticky; top: 15vh; height: 70vh; }
.pin__step { min-height: 80vh; display: flex; align-items: center; }
@media (max-width: 900px) { .pin { grid-template-columns: 1fr; } .pin__visual { position: static; height: auto; } }
```
```js
const obs = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (!e.isIntersecting) return;
    const id = e.target.dataset.step;
    document.querySelectorAll('.pin__frame').forEach((f) => f.classList.toggle('is-on', f.dataset.step === id));
  });
}, { rootMargin: '-45% 0px -45% 0px' }); // 画面中央を通過した時点で切替
document.querySelectorAll('.pin__step').forEach((el) => obs.observe(el));
```

### AN-08 画像のマスクリビール
- **依存**: なし / **コスト**: 10分
```css
.img-reveal { clip-path: inset(0 0 100% 0); transition: clip-path 1s cubic-bezier(.76,0,.24,1); }
.reveal.active .img-reveal { clip-path: inset(0 0 0 0); }
```

### AN-09 数字のカウントアップ
- **依存**: なし / **コスト**: 15分
- **注意**: 【重要】カウントアップさせる数字は `business-docs/private/actuals-2026.md` に根拠のあるものだけ。
  計画値を実績として動かすのは、ルート `CLAUDE.md` の禁止事項そのもの。

```js
function countUp(el) {
  const target = Number(el.dataset.count);
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) { el.textContent = String(target); return; }
  const dur = 1200, start = performance.now();
  (function tick(now) {
    const p = Math.min((now - start) / dur, 1);
    const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
    el.textContent = Math.round(target * eased).toLocaleString('ja-JP');
    if (p < 1) requestAnimationFrame(tick);
  })(start);
}
```

### AN-10 スムーススクロール（慣性）
- **依存**: **Lenis**（約 5KB gzip）
- **【事実】実測**: サンプル23サイト中 **8サイトが Lenis を使用**（mensho / Revelatio / ANDMADE / TRUNK HOTEL / 神戸ヤクルト / 福岡女学院 / Milk Network / EIGHT DESIGN）。国内の"良いサイト"での事実上の標準。
- **適合度: ×〜△** — 【推測】**採用を推奨しない。**
  - ネイティブスクロールを乗っ取るため、キーボードの `PageDown` / スペース / `Home`・`End` の挙動、ブラウザの検索ハイライトへのジャンプ、支援技術のフォーカス移動が軒並み劣化する。
  - 和-Node はアクセシビリティを売っている。**売り文句と実装が矛盾する。**
  - 現行は `html { scroll-behavior: smooth }`（`global.css:26`）で十分。
  - **やるとしたら**: 顧客案件でクライアントが望んだ場合のみ。その際も `prefers-reduced-motion` で完全に無効化する。

---

## B. ホバー・インタラクション

> **原則**: ホバーで初めて分かる情報を作らない。タッチデバイスにホバーは無い。
> すべての `:hover` 指定に `:focus-visible` を併記する。

### AN-11 下線スライドイン
```css
.u-line { position: relative; }
.u-line::after {
  content: ""; position: absolute; left: 0; bottom: -2px; width: 100%; height: 1px;
  background: currentColor; transform: scaleX(0); transform-origin: 100% 50%;
  transition: transform .35s cubic-bezier(.76,0,.24,1);
}
.u-line:hover::after, .u-line:focus-visible::after { transform: scaleX(1); transform-origin: 0 50%; }
```

### AN-12 ボタンの塗りつぶし
```css
.btn-fill { position: relative; overflow: hidden; isolation: isolate; }
.btn-fill::before {
  content: ""; position: absolute; inset: 0; z-index: -1; background: var(--action-strong);
  transform: translateY(101%); transition: transform .4s cubic-bezier(.76,0,.24,1);
}
.btn-fill:hover::before, .btn-fill:focus-visible::before { transform: translateY(0); }
```

### AN-13 画像ズーム
```css
.zoom-frame { overflow: hidden; border-radius: var(--radius); }
.zoom-frame img { transition: transform .6s cubic-bezier(.215,.61,.355,1); will-change: transform; }
.zoom-frame:hover img, a:focus-visible .zoom-frame img { transform: scale(1.06); }
```

### AN-14 カード浮上
- **【事実】** `--shadow-hover` が `global.css:20` に定義済み。使うだけ。
```css
.card { transition: transform .3s, box-shadow .3s; }
.card:hover, .card:focus-within { transform: translateY(-4px); box-shadow: var(--shadow-hover); }
```

### AN-15 テキストのスワップ（上下入れ替え）
```css
.swap { display: inline-grid; overflow: hidden; }
.swap > span { grid-area: 1/1; transition: transform .35s cubic-bezier(.76,0,.24,1); }
.swap > span:nth-child(2) { transform: translateY(100%); }
.swap:hover > span:nth-child(1) { transform: translateY(-100%); }
.swap:hover > span:nth-child(2) { transform: translateY(0); }
```
> 2つ目の `span` は装飾なので `aria-hidden="true"` を付ける。

### AN-16 マグネットボタン（カーソル追従）
- **依存**: なし / **コスト**: 15分 / **適合度**: △ — LP限定。BtoBコーポレートでは過剰。
```js
document.querySelectorAll('[data-magnet]').forEach((el) => {
  const strength = 0.25;
  el.addEventListener('pointermove', (e) => {
    if (e.pointerType !== 'mouse') return;
    const r = el.getBoundingClientRect();
    el.style.transform = `translate(${(e.clientX - r.left - r.width/2) * strength}px, ${(e.clientY - r.top - r.height/2) * strength}px)`;
  });
  el.addEventListener('pointerleave', () => { el.style.transform = ''; });
});
```

### AN-17 カスタムカーソル
- **適合度**: × — 【推測】OSのカーソル設定（大きさ・色の支援設定）を無視することになる。**アクセシビリティを売る会社が採用してはいけない表現。**

---

## C. ページ遷移・ローディング

### AN-18 View Transitions【実装済み】
- **依存**: なし（Astro標準）/ **場所**: `src/layouts/BaseLayout.astro:103`
- **拡張**: 特定要素を遷移前後で繋げる。
```astro
<img src={hero} transition:name="hero-image" />
```
```css
::view-transition-old(root), ::view-transition-new(root) { animation-duration: .35s; }
@media (prefers-reduced-motion: reduce) {
  ::view-transition-old(root), ::view-transition-new(root) { animation: none; }
}
```

### AN-19 カバー遷移（幕）
- **依存**: **Barba.js** など / **【事実】採用例**: TRUNK HOTEL CAT STREET WEDDING
- **適合度**: × — 【推測】Astro の View Transitions で同等以上のことが**依存ゼロで**できる。ライブラリを足す理由がない。

### AN-20 初回のみローディングアニメーション
- **依存**: なし / **コスト**: 20分
- **【事実】** MUUUUU「ローディング・オープニングアニメーション」181件。
- **適合度**: △ — 【推測】**LCP を意図的に悪化させる表現**。Lighthouse スコアを営業に使うなら採用しない。やるなら 1.2秒 以内かつ初回訪問のみ。

```js
const KEY = 'wn-loaded';
if (sessionStorage.getItem(KEY)) {
  document.documentElement.classList.add('no-loading');
} else {
  addEventListener('load', () => {
    setTimeout(() => document.documentElement.classList.add('loaded'), 900);
    sessionStorage.setItem(KEY, '1');
  });
}
```

---

## D. 常時再生・背景

### AN-21 マーキー（無限横スクロール）
- **依存**: なし / **コスト**: 10分
- **【事実】実測**: Revelatio / TBWA\HAKUHODO / GBSメディカル で使用。
- **a11y**: 【重要】WCAG 2.2 の 2.2.2「一時停止、停止、非表示」に該当。**5秒以上自動で動くものには停止手段が要る。**
  ホバーで止めるだけでは不足（キーボード利用者に届かない）ため `:focus-within` も併記する。

```css
@keyframes marquee { to { transform: translateX(-50%); } }
.marquee { overflow: hidden; }
.marquee__track { display: flex; width: max-content; animation: marquee 30s linear infinite; }
.marquee:hover .marquee__track,
.marquee:focus-within .marquee__track { animation-play-state: paused; }
@media (prefers-reduced-motion: reduce) { .marquee__track { animation: none; } }
```
```html
<!-- 同じ内容を2回並べる。2セット目は aria-hidden -->
<div class="marquee"><div class="marquee__track">
  <ul>…</ul><ul aria-hidden="true">…</ul>
</div></div>
```

### AN-22 グラデーションの流動背景
```css
@keyframes flow { 0%,100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }
.grad-flow {
  background: linear-gradient(120deg, var(--trust), var(--trust-mid), var(--soft), var(--trust));
  background-size: 300% 300%;
  animation: flow 18s ease-in-out infinite;
}
@media (prefers-reduced-motion: reduce) { .grad-flow { animation: none; } }
```
> **この上に文字を置かない**（コントラスト比が時間で変動し、測定できなくなる）。

### AN-23 SVGパスの描画
- **依存**: なし / **適合度**: ◎ — 【推測】**連携フロー図を線が引かれる形で見せる**のはこのサイトの本丸。`LineFlowDiagram.astro` に直接効く。
```css
.draw { stroke-dasharray: var(--len); stroke-dashoffset: var(--len); transition: stroke-dashoffset 1.6s ease-out; }
.reveal.active .draw { stroke-dashoffset: 0; }
```
```js
document.querySelectorAll('.draw').forEach((p) => p.style.setProperty('--len', p.getTotalLength()));
```
- **【事実】** `ContactFormContent.astro:1121` に既に `.consult-roadmap-path` の reduced-motion 対応がある。**同じ手法が既に使われている。**

### AN-24 ドット・グレイン（ノイズ）オーバーレイ
```css
.grain::after {
  content: ""; position: fixed; inset: 0; pointer-events: none; z-index: 1; opacity: .035;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence baseFrequency='.8'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
}
```
> 静止で使う。ちらつかせない（光過敏性発作のリスク）。

### AN-25 Lottie（JSONアニメーション）
- **依存**: `lottie-web` / `@lottiefiles/dotlottie-web`（約 60KB gzip）
- **【事実】実測**: mensho / TBWA\HAKUHODO / コクヨ新卒採用 で使用。MUUUUU タグでは 33件と少数。
- **適合度**: △ — 【推測】60KB の価値があるのは**アニメーション素材を外注で作った場合だけ**。単純な動きなら SVG + CSS(AN-23) で足りる。

### AN-26 Canvas / WebGL 表現
- **依存**: `three.js`（約 150KB gzip）/ `p5.js`（約 250KB）/ `matter-js`（約 30KB）
- **【事実】実測**: Milk Network(three.js) / Revelatio・TBWA\HAKUHODO・日本タイポグラフィ協会(p5.js) / ANDMADE(matter-js 物理演算)
- **【事実】** MUUUUU「WebGL・3D表現が印象的」597件・「ジェネラティブ表現」48件。
- **適合度**: × コーポレート本体 / ○ `lab/` `demos/` — 【推測】技術力の証明としては `lab/` に置く意味がある。トップに置くと LCP が壊れる。

---

## E. UI マイクロインタラクション

### AN-27 アコーディオン（`<details>` ベース）
- **依存**: なし / **適合度**: ◎ — **JSゼロでキーボード操作・スクリーンリーダー対応が完成する。** FAQ は必ずこれ。
```css
details { border-bottom: 1px solid var(--line); }
details summary { cursor: pointer; padding: 20px 0; list-style: none; display: flex; justify-content: space-between; gap: 16px; }
details summary::-webkit-details-marker { display: none; }
details summary::after { content: "＋"; transition: transform .3s; }
details[open] summary::after { transform: rotate(45deg); }
/* 高さアニメーション（Chrome 129+ / Safari 18+） */
details::details-content { block-size: 0; overflow: hidden; transition: block-size .35s, content-visibility .35s allow-discrete; }
details[open]::details-content { block-size: auto; }
@supports not (interpolate-size: allow-keywords) { details::details-content { transition: none; } }
:root { interpolate-size: allow-keywords; }
```
> 非対応ブラウザでは**アニメーションなしで正しく開閉する**。それで十分。

### AN-28 タブ切替（インジケータ移動）
- **【事実】** `ProjectExecutionFlow.astro:556` に `initFlowTabs()` が実装済み。**新規に作らずこれを使う。**
- **a11y**: `role="tablist"` / `aria-selected` / 左右矢印キーでの移動を必ず実装する。

### AN-29 モーダル（`<dialog>` ベース）
```css
dialog { border: none; padding: 0; max-width: min(640px, 92vw); border-radius: var(--radius); }
dialog::backdrop { background: rgba(26,22,20,.5); }
@keyframes pop { from { opacity: 0; transform: translateY(12px) scale(.98); } }
dialog[open] { animation: pop .25s cubic-bezier(.215,.61,.355,1); }
@media (prefers-reduced-motion: reduce) { dialog[open] { animation: none; } }
```
> `showModal()` を使えば**フォーカストラップと `Esc` 閉じがブラウザ標準で付く**。自前実装しない。

### AN-30 ドロワーメニュー
```css
.drawer { position: fixed; inset: 0 0 0 auto; width: min(400px, 86vw); transform: translateX(100%);
  transition: transform .4s cubic-bezier(.76,0,.24,1); background: var(--paper); }
.drawer[data-open="true"] { transform: translateX(0); }
```
```js
// 閉じている間は中身をフォーカス不能にする（これを忘れる実装が非常に多い）
drawer.inert = !isOpen;
document.body.style.overflow = isOpen ? 'hidden' : '';
```

### AN-31 フォームのフォーカス / バリデーション
- **【事実】** `ContactFormContent.astro` に実装あり。
- **原則**: エラーは**色だけで示さない**（色覚特性）。アイコン + テキスト + `aria-invalid` + `aria-describedby` の4点セット。

### AN-32 スケルトン / ローディング状態
```css
@keyframes shimmer { to { background-position: -200% 0; } }
.skeleton { background: linear-gradient(90deg, var(--surface-muted) 25%, var(--surface-strong) 37%, var(--surface-muted) 63%);
  background-size: 200% 100%; animation: shimmer 1.4s linear infinite; border-radius: 8px; }
```
- `AiChatWidget.astro` の応答待ちに有効。`aria-live="polite"` + `aria-busy="true"` を併用する。

### AN-33 トースト通知
- `role="status"` + `aria-live="polite"`。閉じるボタン必須。自動で消すなら最低5秒。

### AN-34 スクロールで色が反転するセクション
- **依存**: なし（IntersectionObserver）/ **コスト**: 15分
```js
const io = new IntersectionObserver((es) => es.forEach((e) => {
  if (e.isIntersecting) document.body.dataset.theme = e.target.dataset.theme || 'light';
}), { rootMargin: '-50% 0px -50% 0px' });
document.querySelectorAll('[data-theme]').forEach((s) => io.observe(s));
```
```css
body { transition: background-color .6s, color .6s; }
body[data-theme="dark"] { background: var(--text); color: var(--white); }
```

---

## 導入判断のまとめ

### 依存ゼロで今すぐ入れられる（推奨順）【推測】
| 順 | ID | 内容 | 効く場所 |
| --- | --- | --- | --- |
| 1 | **AN-23** | SVGパス描画 | `LineFlowDiagram.astro` — 連携フローを「線が引かれる」形で見せる。サービス理解に直結 |
| 2 | **AN-07** | スティッキー・ピン留め | 連携の3ステップ説明。既存IntersectionObserverを流用 |
| 3 | **AN-27** | `<details>` アコーディオン | FAQ。JSゼロでa11y完成 |
| 4 | **AN-02** | スタッガー | 既存 `.reveal` にCSS1行足すだけ |
| 5 | **AN-03** | 行マスクリビール | 見出しの品格。和文でも安全 |

### 採用しないと決めたもの（理由付き）
| ID | 内容 | 不採用理由 |
| --- | --- | --- |
| **AN-10** | Lenis 慣性スクロール | キーボード操作とブラウザ内検索を劣化させる。アクセシビリティ訴求と矛盾 |
| **AN-17** | カスタムカーソル | OSのカーソル支援設定を無効化する |
| **AN-19** | Barba.js 遷移 | Astro View Transitions で依存ゼロで代替可能 |
| **AN-26** | WebGL/Canvas（本体） | LCP破壊。`lab/` `demos/` に限定 |

### 監視すべき数値
動きを足すたびに測る。悪化したら**足した動きを消す**（軽量化で取り返そうとしない）。
- LCP 2.5秒以内 / INP 200ms以内 / CLS 0.1以内
- Lighthouse アクセシビリティ 100
