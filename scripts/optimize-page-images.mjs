/**
 * 実績カード・コンセプト画像の軽量化。
 *
 * 対象はいずれも1024x1024だが、表示は works の .card-visual が高さ160px、
 * kdp_books の .concept-img も横幅数百px程度。2x相当の800pxまで縮小してWebP化する。
 * 元ファイルは image-src/ へ退避して残す（image-src はビルド対象外）。
 *
 * og:image に使う ogp-*.png は、WebP非対応のSNSクローラがあるため対象外。
 *
 *   node scripts/optimize-page-images.mjs [--dry]
 */
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const KEEP_DIR = path.join(ROOT, 'image-src');

const TARGETS = [
  'images/works-kdp.png',
  'images/works-accessibility.png',
  'images/works-mental.png',
  'images/works-seo.png',
  'images/works-system.png',
  'images/works-psy-demo.png',
  'images/art-therapy.png',
];

const TARGET_WIDTH = 800;
const QUALITY = 80;
const dryRun = process.argv.includes('--dry');

const pageFiles = [];
(function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (full.endsWith('.astro')) pageFiles.push(full);
  }
})(path.join(ROOT, 'src'));

let before = 0;
let after = 0;
const rewrites = [];

for (const rel of TARGETS) {
  const src = path.join(ROOT, 'public', rel);
  if (!fs.existsSync(src)) {
    console.log(`見つからない: ${rel}`);
    continue;
  }
  const originalSize = fs.statSync(src).size;
  const buffer = await sharp(src)
    .resize({ width: TARGET_WIDTH, withoutEnlargement: true })
    .webp({ quality: QUALITY })
    .toBuffer();
  const meta = await sharp(buffer).metadata();

  before += originalSize;
  after += buffer.length;
  console.log(
    `${(originalSize / 1048576).toFixed(2)}MB -> ${(buffer.length / 1024).toFixed(0)}KB  ${rel}`
  );

  if (dryRun) continue;

  const out = src.replace(/\.png$/i, '.webp');
  fs.writeFileSync(out, buffer);
  const keep = path.join(KEEP_DIR, rel);
  fs.mkdirSync(path.dirname(keep), { recursive: true });
  fs.renameSync(src, keep);

  rewrites.push({
    from: '/' + rel,
    to: '/' + rel.replace(/\.png$/i, '.webp'),
    width: meta.width,
    height: meta.height,
  });
}

if (!dryRun) {
  let touched = 0;
  for (const file of pageFiles) {
    let content = fs.readFileSync(file, 'utf8');
    const original = content;
    for (const r of rewrites) {
      // src属性を差し替えつつ、幅・高さと遅延読み込みを付与する
      content = content.replaceAll(
        `<img src="${r.from}"`,
        `<img src="${r.to}" width="${r.width}" height="${r.height}" loading="lazy" decoding="async"`
      );
      content = content.replaceAll(r.from, r.to);
    }
    if (content !== original) {
      fs.writeFileSync(file, content);
      touched++;
    }
  }
  console.log(`\n参照を更新したファイル: ${touched}件`);
}

console.log(
  `${TARGETS.length}枚: ${(before / 1048576).toFixed(1)}MB -> ${(after / 1048576).toFixed(2)}MB` +
    (dryRun ? '（--dry のため書き込みなし）' : '')
);
