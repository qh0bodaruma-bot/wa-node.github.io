/**
 * dist内のHTMLが参照する画像が実在するかを確認する。
 *
 * - 絶対パス(/images/...)と、静的LPが使う相対パス(images/...)の両方を見る
 * - src/href属性とCSSのurl()を対象にする
 * - ファイル名に空白や日本語を含むものがあるため、属性値ごと取り出して判定する
 *
 *   node scripts/check-image-refs.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.resolve(__dirname, '..', 'dist');

const EXT = '(?:png|jpe?g|webp|svg|gif|avif)';
const PATTERNS = [
  new RegExp(`(?:src|href)="([^"]+\\.${EXT})"`, 'gi'),
  new RegExp(`url\\((['"]?)([^'")]+\\.${EXT})\\1\\)`, 'gi'),
];

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const full = path.join(dir, e.name);
    return e.isDirectory() ? walk(full) : [full];
  });
}

const missing = new Map();
let checked = 0;

for (const file of walk(DIST).filter((f) => f.endsWith('.html'))) {
  const html = fs.readFileSync(file, 'utf8');
  for (const re of PATTERNS) {
    for (const m of html.matchAll(re)) {
      const raw = m[2] ?? m[1];
      if (/^(https?:)?\/\//i.test(raw) || raw.startsWith('data:')) continue;
      const ref = decodeURIComponent(raw.split(/[?#]/)[0]);
      // 絶対パスはdist基準、相対パスは参照元HTMLのある場所基準で解決する
      const resolved = ref.startsWith('/')
        ? path.join(DIST, ref)
        : path.resolve(path.dirname(file), ref);
      checked++;
      if (!fs.existsSync(resolved)) {
        const key = ref;
        if (!missing.has(key)) missing.set(key, new Set());
        missing.get(key).add(path.relative(DIST, file));
      }
    }
  }
}

if (missing.size === 0) {
  console.log(`画像参照 ${checked}件: すべて実在`);
} else {
  console.log(`画像参照 ${checked}件中 ${missing.size}種類が不在\n`);
  for (const [ref, files] of [...missing].sort()) {
    console.log(ref);
    for (const f of [...files].slice(0, 3)) console.log(`    ${f}`);
    if (files.size > 3) console.log(`    ...他${files.size - 3}件`);
  }
  process.exitCode = 1;
}
