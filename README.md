# 差し替え推奨ファイルセット

前回の総ざらいで見つかった、公開前に直した方がよい点を反映した差し替え版です。

## 主な修正

- `line-mini-app-terms.html` へのリンクを `terms_miniapp.html` に統一
- `sitemap.xml` から `404.html` を削除
- 汎用外部リンクを確認できた実URLへ差し替え
  - LINE: `https://lin.ee/o5QFPwc`
  - ココナラプロフィール: `https://coconala.com/users/2598979`
  - ココナラ Web制作: `https://coconala.com/services/4183139`
  - ココナラ AI・ICT相談: `https://coconala.com/services/4183152`
  - クラウドワークス: `https://crowdworks.jp/public/employees/6953669`
  - ランサーズ: `https://www.lancers.jp/profile/daruma_3_h`
- OGP画像 `ogp.png` を追加
- `components/head-meta.html` の `og:image` / `twitter:image` が実ファイル `ogp.png` を参照するように整理

## 差し替え対象

```txt
/index.html
/pricing.html
/privacy.html
/terms.html
/portfolio-lp/index.html
/lp_wizard.html
/corporate-mental.html
/counseling-notes.html
/terms_miniapp.html
/sitemap.xml
/robots.txt
/404.html
/ogp.png
/components/head-meta.html
```

## 注意

- `line-mini-app-terms.html` は新規で置かず、正規ページは `terms_miniapp.html` に寄せています。
- サーバー上に古い `line-mini-app-terms.html` がある場合は、削除するか、`terms_miniapp.html` へリダイレクトしてください。
- `sitemap.xml` は主要ページのみです。ポートフォリオ個別LPや診断ツールを検索に出したい場合は、実在ページを追加してください。
- 既存の `kdp.html`、`tokutei.html`、`cancel-policy.html`、診断ツール、個別LPは削除しないでください。
