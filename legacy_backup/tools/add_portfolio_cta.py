#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
和-Node 個別ポートフォリオLP 共通CTA挿入スクリプト

使い方:
1. このファイルをサイトのルートに置く
2. components/portfolio-cta.html も同じ構成で置く
3. ターミナルで実行:
   python tools/add_portfolio_cta.py

対象:
portfolio-lp/lp_*.html

処理:
- 既に wanode-portfolio-cta があるファイルはスキップ
- </body> の直前に共通CTAを追加
- 元ファイルのバックアップを .bak として作成
"""

from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CTA_PATH = ROOT / "components" / "portfolio-cta.html"
TARGET_DIR = ROOT / "portfolio-lp"

def main():
    if not CTA_PATH.exists():
        raise FileNotFoundError(f"CTAファイルが見つかりません: {CTA_PATH}")

    if not TARGET_DIR.exists():
        raise FileNotFoundError(f"対象ディレクトリが見つかりません: {TARGET_DIR}")

    cta = CTA_PATH.read_text(encoding="utf-8")
    targets = sorted(TARGET_DIR.glob("lp_*.html"))

    if not targets:
        print("対象ファイルが見つかりませんでした。")
        return

    updated = 0
    skipped = 0

    for path in targets:
        text = path.read_text(encoding="utf-8")

        if "wanode-portfolio-cta" in text:
            print(f"SKIP 既にCTAあり: {path}")
            skipped += 1
            continue

        if "</body>" in text:
            new_text = text.replace("</body>", f"\n{cta}\n</body>", 1)
        else:
            new_text = text + "\n" + cta + "\n"

        backup = path.with_suffix(path.suffix + ".bak")
        if not backup.exists():
            backup.write_text(text, encoding="utf-8")

        path.write_text(new_text, encoding="utf-8")
        print(f"UPDATE: {path}")
        updated += 1

    print(f"\n完了: 更新 {updated} 件 / スキップ {skipped} 件")

if __name__ == "__main__":
    main()
