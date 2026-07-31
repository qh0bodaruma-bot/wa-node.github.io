/**
 * ビルド済みのdistを走査してsitemap.xmlを生成する。
 *
 * 以前はURLをこのファイルに直書きしていたため、microCMSから増えるブログ記事が
 * 永久に載らなかった。実際に出力されたページから拾う方式に変更している。
 *
 * 収録しないもの:
 *   - noindexを指定しているページ（法務・ユーティリティ系）
 *   - EXCLUDE に列挙したデモ・LIFF・検証用ページ
 * これらは検索結果に出す意図がないため、従来どおり除外する。
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST_DIR = path.resolve(__dirname, '../dist');
const SITE_URL = 'https://www.wa-node.com';

// 検索結果に出す意図がないパス。前方一致で判定する。
const EXCLUDE = [
  '/404',
  '/test-wa',
  '/thanks',
  '/portfolio-lp/',
  '/portfolio-b2b',
  '/grant-chestar',
  '/counseling_liff',
  '/inquiry_liff',
  '/dx_diagnosis_liff',
  '/dx_mental_diagnosis',
  '/mental_care',
  '/corporate-mental',
  '/counseling-notes',
  '/lab/demos/',
];

// 優先度。長い前方一致を優先する。該当しなければ DEFAULT_PRIORITY。
const PRIORITY = [
  ['/', '1.0'],
  ['/about/', '0.9'],
  ['/works/', '0.9'],
  ['/lab/', '0.9'],
  ['/contact/', '0.9'],
  ['/pricing/', '0.9'],
  ['/blog/', '0.8'],
  ['/case-studies/', '0.8'],
  ['/en/', '0.6'],
  ['/fr/', '0.6'],
];
const DEFAULT_PRIORITY = '0.7';

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });
}

function toUrlPath(file) {
  const rel = path.relative(DIST_DIR, file).split(path.sep).join('/');
  return '/' + rel.replace(/index\.html$/, '');
}

function priorityFor(urlPath) {
  let best = null;
  for (const [prefix, value] of PRIORITY) {
    if (urlPath.startsWith(prefix) && (!best || prefix.length > best[0].length)) {
      best = [prefix, value];
    }
  }
  return best ? best[1] : DEFAULT_PRIORITY;
}

const pages = [];
const skipped = { noindex: 0, excluded: 0 };

for (const file of walk(DIST_DIR)) {
  // trailingSlash: 'always' なので、正となるURLは index.html のみ
  if (path.basename(file) !== 'index.html') continue;

  const urlPath = toUrlPath(file);
  // /en /fr 配下も同じ除外条件で判定するため、ロケール接頭辞を外して比べる
  const pathWithoutLocale = urlPath.replace(/^\/(en|fr)(\/|$)/, '/');
  if (
    EXCLUDE.some(
      (prefix) =>
        (urlPath.startsWith(prefix) || pathWithoutLocale.startsWith(prefix)) &&
        pathWithoutLocale !== '/'
    )
  ) {
    skipped.excluded++;
    continue;
  }
  const html = fs.readFileSync(file, 'utf8');
  if (/name="robots"[^>]*content="[^"]*noindex/i.test(html)) {
    skipped.noindex++;
    continue;
  }
  pages.push([urlPath, priorityFor(urlPath)]);
}

pages.sort((a, b) => a[0].localeCompare(b[0]));

// lastmodは、ビルドのたびに全URLを更新済みと通知してしまうため出力しない。
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
  .map(
    ([page, priority]) => `  <url>
    <loc>${SITE_URL}${page}</loc>
    <changefreq>weekly</changefreq>
    <priority>${priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>
`;

// sitemap-index.xml は以前 urlset をそのまま複製していて形式違反だった
const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${SITE_URL}/sitemap.xml</loc>
  </sitemap>
</sitemapindex>
`;

fs.mkdirSync(DIST_DIR, { recursive: true });
fs.writeFileSync(path.join(DIST_DIR, 'sitemap.xml'), sitemap);
fs.writeFileSync(path.join(DIST_DIR, 'sitemap-index.xml'), sitemapIndex);

const blogCount = pages.filter(([p]) => p.startsWith('/blog/')).length;
console.log(
  `sitemap.xml: ${pages.length}件（うちブログ記事 ${blogCount}件）` +
    ` / 除外 ${skipped.excluded}件・noindex ${skipped.noindex}件`
);
