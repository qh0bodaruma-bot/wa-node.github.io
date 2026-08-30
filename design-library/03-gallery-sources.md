# 出典ギャラリー台帳・実装技術の実測調査

調査日: 2026-08-20

---

## 1. 基準にするギャラリー（ボス指定 4件）

| サイト | URL | 性格 | このライブラリでの使い方 |
| --- | --- | --- | --- |
| **SANKOU!** | https://sankoudesign.com/ | 国内最大級。**分類軸が最も細かい**（ノーコード・書体・動き量まで） | 分類体系の基礎。「動き・技術」タグをそのまま [02](02-animation-patterns.md) の骨格に採用 |
| **MUUUUU.ORG** | https://muuuuu.org/ | 縦長・情報量の多いサイト中心。**タグごとの掲載件数が公開されている** | トレンドの母数を数値で把握する用途 |
| **ちょうどいいWebデザインギャラリー** | https://choooodoii.com/ | 「なぜ良いのか」を制作者視点で言語化して掲載 | **見た目ではなく理由を学ぶ**。提案書の言い回しの参考 |
| **Web Design Garden** | https://webdesigngarden.com/ | 機能・要素タグ56種、フォント200種以上 | 「この部品をどう作るか」の逆引き |

### 各ギャラリーの分類軸（実測）

| 軸 | SANKOU! | MUUUUU | ちょうどいい | Web Design Garden |
| --- | --- | --- | --- | --- |
| サイト種別 | 12種 | ○ | 13種 | 17種 |
| 業種 | 30種以上 | 40種以上 | 25種 | 40種 |
| テイスト | ○ | ○ | 13種 | 35種 |
| 配色 | 15色以上 | 件数付き | 16種 | 17種 |
| トーン | — | — | **12種**（他になし） | — |
| 書体 | 5系統 | — | — | **200種以上**（他になし） |
| 動き・技術 | **21タグ**（最多） | 13タグ・件数付き | — | 56種の機能タグに内包 |
| ノーコード | **Studio / Framer 独立**（他になし） | — | — | Studio制作 |

【推測】4サイトは重複ではなく**役割が違う**。「探す」は SANKOU!、「件数で流行を測る」は MUUUUU、「言語化を借りる」は ちょうどいい、「部品を逆引き」は Web Design Garden。

---

## 2. 追加で押さえる代表的ギャラリー（実在を HTTP ステータスで確認済み）

### 国内

| サイト | URL | 状態 | 特徴 |
| --- | --- | --- | --- |
| I/O 3000 | https://io3000.com/ | 200 | 国内外混在。ハイセンス寄りのセレクト |
| S5-Style | https://www.s5-style.com/ | 200 | 老舗。ミニマル寄り |
| 81-web.com | https://81-web.com/ | 200 | 日本のサイト専門のリンク集 |
| Web Design Clip | https://webdesignclip.com/ | 200 | 業種別に探しやすい。スマホ版 `[L]` あり |
| Responsive Web Design JP | https://responsive-jp.com/ | 200 | レスポンシブ挙動の確認に特化 |
| bookma! | https://bookma.torch.blue/ | **410 Gone** | 【事実】応答が 410。**リンク集から除外すること** |

### 海外

| サイト | URL | 状態 | 特徴 |
| --- | --- | --- | --- |
| Awwwards | https://www.awwwards.com/ | 200 | 世界標準のアワード。**技術トレンドの震源地** |
| Godly | https://godly.website/ | 200 | 実験的・攻めたサイト中心 |
| One Page Love | https://onepagelove.com/ | 200 | **1ページLP専門。和-NodeのLP制作に最も直結** |
| Refero | https://refero.design/ | 200 | SaaS のUI。画面単位で探せる |
| Mobbin | https://mobbin.com/ | 200 | アプリUI。LINE Mini App の参考 |
| Siteinspire | https://www.siteinspire.com/ | 429 | 稼働中（レート制限で429）。ミニマル・タイポ寄り |
| Land-book | https://land-book.com/ | 403 | 稼働中（bot遮断で403）。SaaS系LP |
| Lapa Ninja | https://lapa.ninja/ | 403 | 稼働中（bot遮断で403）。LP + 無料素材 |

> **403 / 429 はサイトが落ちているのではなく、自動アクセスを弾いているだけ。** ブラウザからは普通に見られる。

---

## 3. 実装技術の実測調査【事実】

掲載サイト **23件** のHTMLを取得し、読み込んでいるライブラリを検出した（2026-08-20 実施）。

### 検出結果

| サイト | 検出されたもの |
| --- | --- |
| シーサイドホテル舞子ビラ神戸 | （検出なし・独自実装） |
| REVIAS (hoyu) | **Astro** |
| MENSHO | Lenis / Swiper / Lottie |
| TWOTONE | **Astro** / Motion |
| Revelatio | **Astro** / GSAP + ScrollTrigger / Lenis / Swiper / Motion / p5.js / marquee |
| TBWA\HAKUHODO | **Astro** / ScrollTrigger / Lottie / Motion / p5.js / marquee |
| 日本タイポグラフィ協会 | p5.js |
| ANDMADE | Next.js / Lenis / **Matter.js（物理演算）** / Motion |
| TRUNK HOTEL CAT STREET | **Astro** / Lenis / Barba.js |
| 4kake | Next.js / Motion / Splitting.js / IntersectionObserver |
| GBSメディカル | Next.js / marquee |
| 神戸ヤクルト販売 採用 | WordPress / Lenis / Splide |
| 福岡女学院大学 受験生応援 | Lenis / Motion |
| WANDY | WordPress |
| 日本ビルシス | WordPress / Splide |
| Milk Network | GSAP / Lenis / Swiper / **three.js** |
| EIGHT DESIGN | Next.js / GSAP / Lenis |
| AI in Design Report | Framer Motion |
| コクヨ新卒採用 | **Astro** / Lottie |
| クボタ水道知識パーク | （検出なし） |
| えふと仙台空港 | **Astro** / WordPress（ヘッドレス） |
| パルシステム「お米で超えてく」 | Swiper |
| KINDAI GRAFFITI | Swiper |

### 集計と示唆

| 技術 | 件数 / 23 | 用途 |
| --- | --- | --- |
| **Lenis**（慣性スクロール） | 8 (35%) | 国内の"良いサイト"での事実上の標準 |
| **Astro** | 7 (30%) | **このリポジトリと同じ** |
| **Motion / Framer Motion** | 7 (30%) | 宣言的なアニメーション |
| Swiper | 5 (22%) | カルーセル |
| Next.js | 4 (17%) | |
| WordPress | 4 (17%) | |
| GSAP (+ScrollTrigger) | 4 (17%) | 複雑なスクロール演出 |
| Lottie | 3 (13%) | |
| p5.js | 3 (13%) | ジェネラティブ表現 |
| Splide | 2 (9%) | 軽量カルーセル（Swiperより小さい） |
| three.js / Matter.js / Barba.js | 各1 | |

**注意（この数字の限界）**: サンプルは23件、かつHTMLソースの文字列検出のみ。JSバンドル内に隠れているライブラリは検出できていないため、**実際の使用率はこれより高い**。傾向を掴む用途に限って使うこと。

### ここから読み取れること【推測】

1. **Astro は"デザインが評価されるサイト"の主流の一角になっている（30%）。**
   このリポジトリの技術選定は、ギャラリー掲載レベルの表現をやるうえで足を引っ張らない。むしろ順当。
2. **jQuery が1件も出てこなかった。** 国内の新規サイトでは完全に世代交代している。
3. **アニメーションは「GSAP一択」ではなくなっている。** Motion（motion.dev）が GSAP と同数以上。
   Motion は Web Animations API ベースで軽く（約 5KB のミニ版あり）、後から入れるならこちら。
4. **Lenis の普及率が高い一方、これは "みんなが使っているから正しい" ではない。**
   キーボード操作を劣化させる副作用がある（[02 の AN-10](02-animation-patterns.md) 参照）。
   アクセシビリティを売る和-Node は、**あえて採用しないこと自体を差別化として説明できる。**

---

## 4. 更新のしかた

四半期に1回、以下を実行して数字を更新する。

```bash
for u in URL1 URL2 URL3; do
  printf "%-50s : " "$u"
  curl -sL --max-time 20 -A "Mozilla/5.0" "$u" \
   | grep -oiE '(gsap|scrolltrigger|lenis|swiper|splide|three\.|barba|lottie|splittype|splitting|matter-js|p5\.|motion|framer|nuxt|_astro|_next|wp-content|view-transition|animation-timeline)' \
   | tr 'A-Z' 'a-z' | sort -u | tr '\n' ' '
  echo ""
done
```

更新時は **数字だけ差し替え、調査日を書き換える**。過去の数字は消してよい（トレンド把握が目的で、履歴に価値はない）。
