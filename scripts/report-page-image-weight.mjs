/**
 * ビルド済みHTML 1ページあたりの画像総量を出す。
 * 遅延読み込み(loading="lazy")の有無も併記する。
 *
 *   node scripts/report-page-image-weight.mjs [しきい値MB]
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.resolve(__dirname, '..', 'dist');
const threshold = Number(process.argv[2] ?? 1) * 1048576;

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const full = path.join(dir, e.name);
    return e.isDirectory() ? walk(full) : [full];
  });
}

const IMG_TAG = /<img\b[^>]*>/gi;
const SRC = /\bsrc="([^"]+\.(?:png|jpe?g|webp|svg|gif))"/i;
const CSS_URL = /url\((['"]?)(\/[^'")]+\.(?:png|jpe?g|webp|svg|gif))\1\)/gi;

const rows = [];

for (const file of walk(DIST).filter((f) => f.endsWith('.html'))) {
  const html = fs.readFileSync(file, 'utf8');
  const seen = new Map(); // ref -> lazyかどうか

  for (const tag of html.match(IMG_TAG) ?? []) {
    const m = tag.match(SRC);
    if (!m) continue;
    const ref = decodeURIComponent(m[1]);
    if (!ref.startsWith('/')) continue;
    const lazy = /loading="lazy"/i.test(tag);
    seen.set(ref, (seen.get(ref) ?? true) && lazy);
  }
  for (const m of html.matchAll(CSS_URL)) {
    const ref = decodeURIComponent(m[2]);
    if (!seen.has(ref)) seen.set(ref, false); // 背景画像は遅延不可
  }

  let total = 0;
  let eager = 0;
  for (const [ref, lazy] of seen) {
    const p = path.join(DIST, ref);
    if (!fs.existsSync(p)) continue;
    const size = fs.statSync(p).size;
    total += size;
    if (!lazy) eager += size;
  }
  if (total >= threshold) {
    rows.push({ page: path.relative(DIST, file), total, eager, count: seen.size });
  }
}

rows.sort((a, b) => b.total - a.total);
console.log('  合計      即時読込   枚数  ページ');
for (const r of rows) {
  console.log(
    `${(r.total / 1048576).toFixed(2).padStart(6)}MB ${(r.eager / 1048576).toFixed(2).padStart(7)}MB ${String(r.count).padStart(5)}  ${r.page}`
  );
}
if (rows.length === 0) console.log(`(しきい値 ${(threshold / 1048576).toFixed(1)}MB を超えるページなし)`);
