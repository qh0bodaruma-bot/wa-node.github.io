/**
 * public配下にあるが、どこからも参照されていない画像を洗い出す。
 *
 * 参照元は src と public の .astro/.html/.css/.js/.ts/.json/.md、および scripts。
 * 絶対パス・相対パスの双方を拾い、ファイル名単位でも突き合わせる（動的組み立て対策）。
 *
 *   node scripts/find-unused-images.mjs           … 一覧表示のみ
 *   node scripts/find-unused-images.mjs --archive … image-src/ へ退避する
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const PUBLIC = path.join(ROOT, 'public');
const ARCHIVE = path.join(ROOT, 'image-src', '_unused');

const IMG_EXT = /\.(png|jpe?g|webp|svg|gif|avif|ico)$/i;
const TEXT_EXT = /\.(astro|html|css|js|cjs|mjs|ts|tsx|json|md|xml|txt)$/i;
const SKIP_DIRS = new Set(['node_modules', 'dist', '.git', 'image-src']);

// 参照が静的解析で追えないもの。誤って消さないよう常に使用中とみなす。
const ALWAYS_KEEP = [/^favicon\.ico$/i, /^apple-touch-icon\.png$/i, /^og/i, /^icon-/i, /manifest/i];

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (SKIP_DIRS.has(entry.name)) continue;
      walk(path.join(dir, entry.name), out);
    } else {
      out.push(path.join(dir, entry.name));
    }
  }
  return out;
}

const allFiles = walk(ROOT);
const images = allFiles.filter((f) => f.startsWith(PUBLIC) && IMG_EXT.test(f));
const textFiles = allFiles.filter((f) => TEXT_EXT.test(f) && !f.startsWith(path.join(PUBLIC, 'images')));

// 全テキストを連結して一括検索する（数十MB程度なので問題ない）
let haystack = '';
for (const f of textFiles) {
  try {
    haystack += fs.readFileSync(f, 'utf8') + '\n';
  } catch {
    /* バイナリ混入は無視 */
  }
}

const unused = [];
for (const img of images) {
  const rel = path.relative(PUBLIC, img).split(path.sep).join('/');
  const base = path.basename(img);
  if (ALWAYS_KEEP.some((re) => re.test(base))) continue;

  // フルパス・パス末尾・ファイル名のいずれかで参照されていれば使用中とみなす
  const encoded = encodeURI(rel);
  const hit =
    haystack.includes(rel) ||
    haystack.includes(encoded) ||
    haystack.includes(base) ||
    haystack.includes(encodeURIComponent(base));
  if (!hit) unused.push({ img, rel, size: fs.statSync(img).size });
}

unused.sort((a, b) => b.size - a.size);
for (const u of unused) {
  console.log(`${(u.size / 1048576).toFixed(2).padStart(6)}MB  ${u.rel}`);
}
const total = unused.reduce((a, b) => a + b.size, 0);
console.log(`\n未参照 ${unused.length}件 / ${(total / 1048576).toFixed(1)}MB`);

if (process.argv.includes('--archive')) {
  for (const u of unused) {
    const dest = path.join(ARCHIVE, u.rel);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.renameSync(u.img, dest);
  }
  console.log(`image-src/_unused/ へ退避しました（削除はしていません）`);
}
