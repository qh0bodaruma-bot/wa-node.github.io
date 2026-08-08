# business-docs — 経営ドキュメント

和-Node の経営相談を、一般論ではなく**自社の数字**に接地させるための置き場。

## 構成

```
business-docs/
├─ README.md              ← このファイル
├─ business-plan.html     ← 事業計画書（2026年5月作成 / 全部が計画値）
├─ company-profile.html   ← 会社概要
├─ context/
│   └─ company-facts.md   ← 変わらない前提（金額を含まない）
├─ roles/                 ← 役割別ルール（3つ）
│   ├─ management/CLAUDE.md
│   ├─ marketing/CLAUDE.md
│   └─ production/CLAUDE.md
└─ private/               ← 【非公開・gitignore済】金額と実績はここだけ
    ├─ README.md
    ├─ plan-summary.md
    ├─ actuals-2026.md    ← 月次実績（最重要・要記入）
    ├─ projects-2026.md   ← 案件別実績（要記入）
    └─ decisions/         ← 意思決定ログ
```

## 公開範囲についての注意

このリポジトリは **GitHub 上で public**。`business-docs/` 配下のファイルは、
サイト（wa-node.com）には出ないが、リポジトリページからは誰でも読める。

- `business-plan.html` — **既に公開済み**（売上計画・経費・所得見込み・住所を含む）。
  意図した公開でなければ、履歴ごと消すか、リポジトリを private にする必要がある。
  GitHub Pages のユーザーサイトを無料枠で使う場合 private にできないため、
  現実的な選択肢は「経営文書を別の private リポジトリに移す」こと。
- `private/` — `.gitignore` 済み。**コミットされないのでバックアップは別途取ること。**

## 使い方

1. 毎月はじめに `private/actuals-2026.md` の前月行を埋める（5分）
2. 案件が終わったら `private/projects-2026.md` に1行追加する
3. 相談するときは、対象に応じて `roles/` の該当フォルダで作業する
4. 決めたことは `private/decisions/` に1ファイル残す

**2 が埋まっていない状態で相談しても、返ってくるのは計画書の再確認にしかならない。**
