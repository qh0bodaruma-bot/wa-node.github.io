"""明朝（Shippori Mincho）を、サイトの見出しで使う文字だけに絞った専用ファイルに作り直す。

目的: Google Fonts の分割（約120枚）は、トップの見出し80字ほどでも21ファイル（約300KB）を読み込ませる。
      サイトで使う文字だけを、使うページ単位でまとまるように分割すると、トップは約19KB、主要ページは約25〜45KBで済む。

使い方（dist を作ったあとに実行。結果の woff2 と CSS をコミットする）:
  1. npm run build
  2. python scripts/build-mincho-subset.py --ttf-dir <TTFを置いたフォルダ> --out-dir public/fonts/shippori-mincho-site
       TTF は https://github.com/google/fonts/tree/main/ofl/shipporimincho の
       ShipporiMincho-SemiBold.ttf（太さ600）・ShipporiMincho-Bold.ttf（太さ700）・ShipporiMincho-ExtraBold.ttf（太さ800）。
       見出しの太さ900指定は、一番太い800の字体で表示される。
  3. 必要なパッケージ: pip install fonttools brotli

仕組み:
  - dist の HTML から、明朝で表示される要素（h1・h2、フッターの見出し、ShipporiMincho 等のクラス）の文字を集める。
  - 主要ページ（トップ→料金→制作例→about→相談→コラム→英語トップ→フランス語トップ→デモ詳細・アプリデモ）の順に、そのページで新たに必要な文字を1スライスにまとめ、
    残りは使うページ数の多い順に60字ずつのスライスにする。
  - 作った CSS（src/styles/fonts/shippori-mincho-site.css）は、Google の分割フォントの「後」に宣言する。
    専用ファイルの範囲にない文字は、従来の分割フォントに自動で切り替わる（表示は崩れず、読み込みが増えるだけ）。
    文章を足したあとは、このスクリプトを再実行すると、新しい文字も専用ファイルに入る。

ライセンス: SIL Open Font License 1.1（予約フォント名の指定なし）。加工して再配布してよい。
            ライセンス文は public/fonts/licenses/ShipporiMincho-OFL.txt。
"""
import argparse
import glob
import json
import os
import subprocess
import sys
from html.parser import HTMLParser

CORE_PAGES = ['index.html', 'pricing/index.html', 'works/index.html', 'about/index.html', 'contact/index.html', 'blog/index.html',
              'en/index.html', 'fr/index.html', 'case-studies/line-kintone-demo/index.html', 'mobile-app-demo/index.html',
              'case-studies/line-hubspot-demo/index.html', 'case-studies/line-salesforce-demo/index.html',
              'case-studies/line-spreadsheet-demo/index.html']
CHUNK = 60
TAGS = {'h1', 'h2'}
CLS = ('footer-tagline', 'footer-wordmark', 'ShipporiMincho', 'premium-heading', 'step-title', 'catch-copy')
VOID = {'br', 'img', 'meta', 'link', 'input', 'hr', 'source', 'path', 'circle', 'rect', 'use'}
WEIGHTS = {600: 'SemiBold', 700: 'Bold', 800: 'ExtraBold'}


class Collector(HTMLParser):
    def __init__(self):
        super().__init__()
        self.stack, self.cap, self.chars = [], 0, set()

    def handle_starttag(self, tag, attrs):
        if tag in VOID:
            return
        cl = dict(attrs).get('class', '') or ''
        hit = tag in TAGS or any(c in cl for c in CLS)
        self.stack.append((tag, hit))
        if hit:
            self.cap += 1

    def handle_endtag(self, tag):
        while self.stack:
            t, hit = self.stack.pop()
            if hit:
                self.cap -= 1
            if t == tag:
                break

    def handle_data(self, d):
        if self.cap > 0:
            # 空白（U+0020 など）も対象に含める。入れないと、見出しの空白だけで Google の分割フォントが呼ばれてしまう
            self.chars.update(c for c in d if ord(c) > 0x1F)


def collect(dist):
    pages = {}
    for f in glob.glob(os.path.join(dist, '**', '*.html'), recursive=True):
        rel = os.path.relpath(f, dist).replace(os.sep, '/')
        if rel.startswith('lab/'):
            continue
        p = Collector()
        p.feed(open(f, encoding='utf-8').read())
        pages[rel] = p.chars
    return pages


def make_slices(pages):
    allc = set().union(*pages.values())
    freq = {c: sum(c in v for v in pages.values()) for c in allc}
    slices, used = [], set()
    for k in CORE_PAGES:
        s = pages.get(k, set()) - used
        if s:
            slices.append(sorted(s))
            used |= s
    rest = sorted(allc - used, key=lambda c: (-freq[c], c))
    slices += [sorted(rest[i:i + CHUNK]) for i in range(0, len(rest), CHUNK)]
    return slices


def ranges(chars):
    cps = sorted(ord(c) for c in chars)
    out, start, prev = [], None, None
    for cp in cps:
        if start is None:
            start = prev = cp
        elif cp == prev + 1:
            prev = cp
        else:
            out.append((start, prev))
            start = prev = cp
    if start is not None:
        out.append((start, prev))
    return ', '.join('U+%X' % a if a == b else 'U+%X-%X' % (a, b) for a, b in out)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--dist', default='dist')
    ap.add_argument('--ttf-dir', required=True)
    ap.add_argument('--out-dir', default='public/fonts/shippori-mincho-site')
    ap.add_argument('--css-out', default='src/styles/fonts/shippori-mincho-site.css')
    a = ap.parse_args()

    pages = collect(a.dist)
    slices = make_slices(pages)
    print('pages', len(pages), '| slices', len(slices), '| chars', sum(len(s) for s in slices))
    os.makedirs(a.out_dir, exist_ok=True)
    for f in glob.glob(os.path.join(a.out_dir, '*.woff2')):
        os.remove(f)

    css = ['/* scripts/build-mincho-subset.py で生成。手で編集しない。',
           '   shippori-mincho.css（Google の分割フォント）の「後」に宣言し、サイトで使う文字は専用ファイルから読み込む。',
           '   範囲外の文字は、先に宣言された分割フォントに切り替わる。 */',
           "@import './shippori-mincho.css';"]
    total = {}
    for weight, name in WEIGHTS.items():
        ttf = os.path.join(a.ttf_dir, 'ShipporiMincho-%s.ttf' % name)
        for i, chars in enumerate(slices):
            txt = os.path.join(a.out_dir, '_chars.txt')
            open(txt, 'w', encoding='utf-8').write(''.join(chars))
            fn = 'shippori-mincho-site-%d-%02d.woff2' % (weight, i)
            subprocess.check_call([sys.executable, '-m', 'fontTools.subset', ttf, '--text-file=' + txt, '--flavor=woff2',
                                   '--layout-features=*', '--no-hinting', '--output-file=' + os.path.join(a.out_dir, fn)],
                                  stdout=subprocess.DEVNULL)
            total[weight] = total.get(weight, 0) + os.path.getsize(os.path.join(a.out_dir, fn))
            css.append("@font-face {\n  font-family: 'Shippori Mincho';\n  font-style: normal;\n  font-weight: %d;\n  font-display: swap;\n"
                       "  src: url(/fonts/shippori-mincho-site/%s) format('woff2');\n  unicode-range: %s;\n}" % (weight, fn, ranges(chars)))
        os.remove(txt)
    open(a.css_out, 'w', encoding='utf-8').write('\n'.join(css) + '\n')
    print('woff2 total bytes by weight:', total)
    # 主要ページごとの読み込み量の見積り（その太さ1つぶん）
    sizes = {}
    for weight in WEIGHTS:
        for i in range(len(slices)):
            sizes[(weight, i)] = os.path.getsize(os.path.join(a.out_dir, 'shippori-mincho-site-%d-%02d.woff2' % (weight, i)))
    for k in CORE_PAGES + ['en/pricing/index.html', 'fr/about/index.html', 'case-studies/line-kintone-demo/index.html', 'mobile-app-demo/index.html']:
        if k in pages:
            kb = sum(sizes[(700, i)] for i, s in enumerate(slices) if set(s) & pages[k]) / 1024
            print('  %-45s %5.1f KB（太さ700）' % (k, kb))


if __name__ == '__main__':
    main()
