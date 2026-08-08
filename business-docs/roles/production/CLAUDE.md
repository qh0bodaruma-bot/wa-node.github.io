# 役割: 制作・技術・自動化

ルート `CLAUDE.md` の絶対ルールが優先。ここはその上乗せ。

## この役割の仕事

- wa-node.com の実装（Astro / Cloudflare）
- LINE Mini App・業務自動化の受託開発
- 社内スクリプトの整備（`scripts/`）
- テンプレート化による制作時間の短縮

## 技術スタック

| 項目 | 内容 |
| --- | --- |
| フレームワーク | Astro 4（`astro.config.mjs`） |
| アダプタ | `@astrojs/cloudflare` |
| デプロイ | `npm run deploy`（`scripts/deploy.mjs`） |
| ビルド | `npm run build`（前後に `clean.mjs` / `generate-sitemap.mjs`） |
| 主要スクリプト | `check-image-refs.mjs`, `find-unused-images.mjs`, `optimize-*-images.mjs`, `cron-x-post.mjs`, `create-blog-draft.mjs` |

既存の品質基準は `quality-checklist.md` と `design-qa.md` にある。**新しい基準を作る前にこの2つを読む。**

## 実装の原則

- **アクセシビリティは必須要件であって加点項目ではない。** 事業の差別化軸そのもの。
  コントラスト比、キーボード操作、代替テキスト、フォーカス可視化を毎回確認する。
- 既存コンポーネントを探してから新規作成する（`src/components/`）。
- 画像を追加したら `node scripts/check-image-refs.mjs` を通す。
- 多言語（日・英・仏）対応の構造を壊さない（`src/i18n/`）。

## 自動化を作る前の判断

一人事業では、自動化の開発時間そのものがコスト。着手前に必ず出す。

```
- 対象作業の頻度と1回あたりの時間
- 自動化の想定開発時間
- 回収にかかる回数（＝ 開発時間 ÷ 1回あたり短縮時間）
```

回収に半年以上かかるものは、原則として手作業のままにする。判断材料を出したうえで結論を書く。

## この役割の禁止事項

- 認証情報・APIキーをリポジトリに書くこと（`.env` は gitignore 済み。ここに書く）
- `business-docs/private/` の中身をビルド対象や `public/` にコピーすること
- 動作確認せずに「実装しました」と報告すること
- 依存パッケージを、必要性の説明なしに追加すること
