# デザインパターンカタログ（DP）

出典: SANKOU!・MUUUUU.ORG・ちょうどいいWebデザインギャラリー・Web Design Garden の分類軸と掲載サイト実物（詳細は [03-gallery-sources.md](03-gallery-sources.md)）

**表記ルール**
`【事実】` = ギャラリーのタグ体系または掲載サイト実物に根拠あり / `【推測】` = こちらの評価・推論

**適合度** = 和-Node（BtoB・LINE連携・アクセシビリティ訴求）で使えるか
◎ 積極採用 / ○ 条件付き / △ デモ・LP限定 / × 使わない

---

## 0. ギャラリー横断の分類軸（統合版）

【事実】4ギャラリーのタグを突き合わせると、分類軸は6つに集約できる。新規ページを起こすときはこの6軸を先に埋めてから作る。

| 軸 | 選択肢（代表） |
| --- | --- |
| **サイト種別** | コーポレート / ブランド / 採用 / LP / 商品紹介 / 特設 / EC / オウンドメディア / ポートフォリオ / 周年 / 多言語 |
| **テイスト** | スタイリッシュ / ミニマル・シンプル / 高級感・エレガント / かっこいい / かわいい / ポップ / レトロ / ユニーク / 堅実・信頼感 |
| **配色** | ホワイト / ブラック / ブルー / グレー / ベージュ / グリーン / ゴールド / カラフル / モノトーン |
| **トーン** | 明るい / 鮮やか / くすんだ / 渋い / 柔らかい |
| **書体** | 明朝系 / ゴシック系 / 丸ゴシック / デザイン書体 / 手書き |
| **動き量** | ほぼ動きなし / やや動きあり / 印象的・細やか / ダイナミック・没入感 |

**和-Node の現在地**【事実】`src/styles/global.css:1-24` と `design-qa.md` より
コーポレート / 堅実・信頼感＋エレガント / ホワイト＋ディープティール(`--trust: #0f4c5c`)＋アクションレッド(`--action: #c7352f`) / 落ち着いたトーン / 明朝(Shippori Mincho)＋ゴシック(Outfit) / やや動きあり

---

## 1. ヒーロー（ファーストビュー）

### DP-01 フルスクリーンビジュアル + スクロールヒント
- **概要**: `100svh` の写真/動画を敷き、中央または左下にコピー。下端にスクロール誘導。
- **【事実】採用例**: シーサイドホテル舞子ビラ神戸、TRUNK HOTEL CAT STREET WEDDING（SANKOU!「高級感」タグ）
- **効く場面**: ホテル・ウェディング・ブランド。**ビジュアルが商材そのもの**のとき。
- **適合度**: △ — 【推測】BtoBでは「何の会社か」が1画面目で分からず離脱を招く。LP限定。
- **実装メモ**: `height: 100svh`（`100vh` はモバイルでアドレスバー分ずれる）。文字と写真のコントラスト比 4.5:1 を確保するため必ずオーバーレイを敷く。

```css
.hero-full { position: relative; min-height: 100svh; display: grid; place-items: center; }
.hero-full::before {
  content: ""; position: absolute; inset: 0;
  background: linear-gradient(180deg, rgba(0,0,0,.15), rgba(0,0,0,.55));
}
.hero-full > * { position: relative; z-index: 1; }
```

### DP-02 分割ヒーロー（左テキスト / 右ビジュアル）
- **概要**: 左に見出し・リード・CTA、右に画像。グリッド2分割。
- **【事実】採用例**: 和-Node 現行トップ（`design-qa.md` 記載の構成）、GBSメディカル
- **適合度**: ◎ — **現行採用中**。BtoBで最も外さない。
- **実装メモ**: モバイルは1カラムに落とす。`design-qa.md` の指摘3のとおり、**モバイルで1画面をヒーローが占有しない**ようにリード文を短く保つ。

### DP-03 タイポグラフィ主役ヒーロー
- **概要**: 画像を使わず、巨大な見出しだけで構成。余白と文字組みで勝負。
- **【事実】採用例**: 日本タイポグラフィ協会、TBWA\HAKUHODO、Revelatio（MUUUUU「スタイリッシュ」）
- **効く場面**: 素材写真が用意できないとき。**画像調達コストゼロで強い一枚が作れる**のが最大の利点。
- **適合度**: ○ — 【推測】和-Nodeの明朝見出しと相性が良い。`about.astro` `tech-stack.astro` の下層ヒーローに向く。
- **実装メモ**: `clamp()` で滑らかに縮小。行間を詰める（`line-height: 1.1`）が、和文は `1.25` 未満にすると濁点が潰れるので注意。

```css
.hero-type h1 {
  font-family: 'Shippori Mincho', serif;
  font-size: clamp(2.4rem, 8vw, 6rem);
  line-height: 1.25;
  letter-spacing: 0.02em;
  font-feature-settings: "palt" 1; /* 和文の詰め。大きい文字ほど効く */
}
```

### DP-04 動画背景ヒーロー
- **【事実】** MUUUUU.ORG「動画が印象的」1,165件 — 全タグ中でも最大級の母数。
- **適合度**: △ — 【推測】自社では素材コストが合わない。ただし**顧客提案の引き出し**としては需要が大きい。
- **実装メモ**: `<video muted playsinline autoplay loop preload="metadata" poster>` は必須。`prefers-reduced-motion` では静止画(poster)にフォールバックさせる。モバイルは動画を読ませない（通信量）。

### DP-05 スプリット・キャッチコピー（コピーを画面いっぱいに分割配置）
- **概要**: 短いコピーを2〜3行に分け、行ごとに位置をずらす（左端／中央／右端）。
- **【事実】採用例**: 4kake、ANDMADE Inc.
- **適合度**: ○ — LP・特設向き。

---

## 2. 全体レイアウト

### DP-06 均等グリッド（カード整列）
- **概要**: `repeat(auto-fit, minmax())` で崩れないカード一覧。
- **【事実】** MUUUUU.ORG「グリッド」1,144件。
- **適合度**: ◎ — **現行採用中**（`.card` 系クラスが `BaseLayout.astro` の reveal 対象になっている）。

```css
.grid-auto { display: grid; gap: 24px; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); }
```

### DP-07 エディトリアル / 非対称レイアウト
- **概要**: グリッドを意図的に外し、余白の量で視線を誘導する。雑誌的。
- **【事実】採用例**: IDEE INC.、アーティゾン美術館（Web Design Garden「エレガント」）
- **適合度**: ○ — 【推測】ブログ記事詳細・事例紹介に向く。ナビゲーション性が落ちるので一覧ページには使わない。

### DP-08 スティッキー見出し + スクロールする本文
- **概要**: 左カラムの見出しを `position: sticky` で固定し、右カラムだけスクロールさせる。
- **適合度**: ◎ — 【推測】`case-studies/` の事例ページ、`pricing.astro` の料金比較に効く。JS不要。

```css
.sticky-split { display: grid; grid-template-columns: minmax(240px, 1fr) 2fr; gap: 64px; align-items: start; }
.sticky-split__head { position: sticky; top: 100px; } /* global.css の scroll-padding-top: 80px と揃える */
@media (max-width: 900px) {
  .sticky-split { grid-template-columns: 1fr; }
  .sticky-split__head { position: static; }
}
```

### DP-09 横スクロールセクション
- **【事実】** MUUUUU.ORG「横スクロールが印象的」125件 / ちょうどいい「八 by PRESS BUTTER SAND」
- **適合度**: △ — 【推測】マウスホイールを乗っ取る実装はアクセシビリティ上こちらの主張と矛盾する。
  **やるなら CSS の `scroll-snap` によるネイティブ横スクロールに限る**（キーボード操作が生きる）。

```css
.hscroll { display: flex; gap: 20px; overflow-x: auto; scroll-snap-type: x mandatory; -webkit-overflow-scrolling: touch; }
.hscroll > * { flex: 0 0 min(78vw, 340px); scroll-snap-align: start; }
```

### DP-10 ジグザグ（交互配置）
- **概要**: 画像とテキストを左右交互に並べる。
- **適合度**: ◎ — サービス説明の定番。`LineFlowDiagram.astro` 周辺と相性が良い。

### DP-11 罫線グリッド（枠線を見せる）
- **概要**: 影を使わず、細い罫線でセルを区切る。設計図・仕様書のような硬質さが出る。
- **【事実】** Web Design Garden「シンプル」タグ / コクヨ新卒採用
- **適合度**: ◎ — 【推測】**BtoB技術会社に最も合う。和-Nodeはシャドウ（`--shadow`）多用が現状なので、罫線版のバリエーションを持つ価値が高い。**

```css
.rule-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); border-top: 1px solid var(--line); border-left: 1px solid var(--line); }
.rule-grid > * { border-right: 1px solid var(--line); border-bottom: 1px solid var(--line); padding: 32px; }
```

### DP-12 大きな余白 + 小さな文字（高級感）
- **概要**: セクション余白を `160px` 級に広げ、本文を `0.95rem` 前後に抑える。
- **【事実】** SANKOU!「高級感」「上品」タグの共通構造。
- **適合度**: ○ — 【推測】和-Node現行は `.section { padding: 80px 0 }`。倍にすると"格"は上がるが、**BtoBでは情報密度が落ちてスクロール疲れを招く**。ブランドページ限定。

---

## 3. ナビゲーション

### DP-13 スクロールで変化するヘッダー
- **概要**: 初期は透明・大きめ → スクロールで白背景・薄い影・高さ縮小。
- **適合度**: ◎ — 定番。`Header.astro` に実装済みか要確認。
- **a11y**: 高さが変わるので `scroll-padding-top` をスクロール後の高さに合わせる。

### DP-14 フルスクリーンオーバーレイメニュー
- **概要**: ハンバーガー→画面全面のメニュー。
- **適合度**: ○ — **`inert` / フォーカストラップ / `Esc` で閉じる** の3点を実装しないなら採用しない。

### DP-15 サイドナビ + 追従目次
- **概要**: 長文ページの右または左に現在地ハイライト付き目次。
- **適合度**: ◎ — 【推測】ブログ・`barrier_free.astro` のような長文ページで離脱を明確に下げる。IntersectionObserverで現在地判定でき、既存の仕組みを流用できる。

### DP-16 モバイル固定ボトムCTA
- **概要**: 画面下に「LINEで相談」を常時固定。
- **適合度**: ◎ — 【推測】LINE連携が主力サービスである以上、最も費用対効果が高い1つ。
- **注意**: `env(safe-area-inset-bottom)` を入れないとiPhoneのホームバーに被る。フッターに到達したら隠す配慮も必要。

```css
.cta-fixed { position: fixed; left: 0; right: 0; bottom: 0; z-index: 50;
  padding: 12px 16px calc(12px + env(safe-area-inset-bottom)); background: var(--paper);
  border-top: 1px solid var(--line); }
@media (min-width: 768px) { .cta-fixed { display: none; } }
```

### DP-17 メガメニュー
- **適合度**: △ — 現状のページ数（40超）なら理屈は合うが、【推測】BtoBでは「サービスは1本」と見せたほうが強い。今は不要。

---

## 4. コンテンツ・ブロック

| ID | パターン | 概要 | 適合度 |
| --- | --- | --- | --- |
| **DP-18** | 数字で見る（統計） | 実績数値を大きく3〜4個 | ○（**実データがある項目だけ**。`business-docs/private/actuals-2026.md` に根拠がない数字は絶対に載せない） |
| **DP-19** | タイムライン / プロセスフロー | 導入までの流れをステップ表示 | ◎ 現行 `ProjectExecutionFlow.astro` `ConsultationFlow.astro` |
| **DP-20** | 料金比較テーブル | 横スクロール可・スマホは縦積み | ◎ `pricing.astro` |
| **DP-21** | FAQ アコーディオン | `<details>` ベースが最良 | ◎（後述 AN-28） |
| **DP-22** | 実績カルーセル | 横並びスライダー | ○（Splide/Swiper なしで `scroll-snap` 実装を優先） |
| **DP-23** | Before / After トグル | 導入前後を切替表示 | ◎ **現行実装あり**（`design-qa.md` に `aria-pressed` `data-phase` の記載） |
| **DP-24** | ロゴ帯（導入企業） | 実績ロゴを横一列 | ×（**掲載許諾のない企業ロゴは載せない**。BtoBで最も訴訟リスクが高い箇所） |
| **DP-25** | 大型フッター（サイトマップ型） | 全ページリンク＋会社情報 | ◎ 多言語3言語のこのサイトでは必須級 |
| **DP-26** | 用語のインライン解説 | 専門語にホバー/タップで注釈 | ◎ **現行実装あり**（`GlossaryEnhancer.astro`） |

---

## 5. 配色パターン

【事実】MUUUUU.ORG のカラー別掲載数: ホワイト系 2,262 / ブラック系 1,255 / ブルー系 1,204 / グレー系 1,017 / ベージュ系 931

| ID | 配色 | 構成 | 印象 | 適合度 |
| --- | --- | --- | --- | --- |
| **DP-27** | ホワイト基調 + 1アクセント | 白90% + 差し色10% | 清潔・誠実 | ◎ **現行**（白 + `--trust` + `--action`） |
| **DP-28** | ダークテーマ | 黒/濃紺背景 + 明色文字 | 先進・高級 | ○ `tech-stack.astro` `lab/` のみ |
| **DP-29** | ベージュ / ヌード | 生成り + 茶 | やわらかい・ナチュラル | △（`--accent: #8a5a32` と接続可） |
| **DP-30** | 深いブルーグリーン + ゴールド | 濃ティール + くすみ金 | 信頼 + 品格 | ◎ **現行そのもの**（`--trust: #0f4c5c` / `--gold-muted: #8c6b1f`） |
| **DP-31** | カラフル / ポップ | 4色以上を面で使う | 親しみ・元気 | ×（BtoBの信頼訴求と真逆） |
| **DP-32** | グラデーション | 2色間の連続変化 | 現代的 | ○ 面積を小さく。**文字にかけない**（コントラスト比が測定不能になる） |

### コントラスト検証は必須
`business-docs/roles/production/CLAUDE.md` の通り、アクセシビリティは加点項目ではない。
- 本文: 4.5:1 以上 / 大見出し(24px以上 or 18.66px太字): 3:1 以上
- **`--muted: #524a44` on `--bg: #ffffff`** は現行で確保済み（コメントに「視認性向上」の記載あり）
- 新しい色を足したら必ず測る。測っていない色は使わない。

---

## 6. タイポグラフィ

| ID | パターン | 使いどころ | 現行 |
| --- | --- | --- | --- |
| 明朝見出し + ゴシック本文 | 品格を出しつつ可読性を保つ王道 | ◎ **現行**（Shippori Mincho + Outfit） |
| ゴシック統一 | 硬質・technical | tech系下層ページ |
| 縦書き（`writing-mode: vertical-rl`） | 和のブランド表現 | △ スマホで破綻しやすい |
| 極太ゴシック大見出し | インパクト・採用サイト | LP限定 |

### 和文で必ず入れる指定

```css
:where(h1, h2, h3, .lead) {
  font-feature-settings: "palt" 1;   /* 約物の詰め */
  line-break: strict;                 /* 禁則処理 */
  overflow-wrap: anywhere;            /* 長い英単語のはみ出し防止 */
}
```
【事実】`line-break: strict` は既に `ContactFormContent.astro:1118` で使われている。全体に展開する価値がある。

---

## 7. まだこのサイトに無く、入れる価値が高い順（【推測】）

1. **DP-16 モバイル固定ボトムCTA** — LINE相談への導線。実装コスト最小、効果最大。
2. **DP-15 追従目次** — 長文ページの離脱対策。既存IntersectionObserverを流用できる。
3. **DP-11 罫線グリッド** — シャドウ一辺倒からの脱却。BtoBらしい硬質さが出る。
4. **DP-08 スティッキー見出し** — 事例・料金ページの読みやすさ。CSSのみ。

いずれも**JSライブラリ追加ゼロ**で実装できる。
