/**
 * KDP書影の軽量化。
 *
 * 表示サイズは .book-3d-wrap の 220x310px なので、2x相当の幅440pxまで縮小し
 * WebPに変換する。元のPNGは image-src/ へ退避して残す（image-src はビルド対象外）。
 *
 *   node scripts/optimize-kdp-images.mjs          … 変換を実行
 *   node scripts/optimize-kdp-images.mjs --dry    … 変換結果の見積もりだけ表示
 */
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const SRC_DIR = path.join(ROOT, 'public', 'images', 'KDP');
const KEEP_DIR = path.join(ROOT, 'image-src', 'KDP');

const TARGET_WIDTH = 440;
const QUALITY = 82;
const dryRun = process.argv.includes('--dry');

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });
}

const targets = walk(SRC_DIR).filter((f) => /\.png$/i.test(f));
let before = 0;
let after = 0;

for (const file of targets) {
  const rel = path.relative(SRC_DIR, file);
  const out = file.replace(/\.png$/i, '.webp');
  const originalSize = fs.statSync(file).size;

  const buffer = await sharp(file)
    .resize({ width: TARGET_WIDTH, withoutEnlargement: true })
    .webp({ quality: QUALITY })
    .toBuffer();

  before += originalSize;
  after += buffer.length;
  console.log(
    `${(originalSize / 1048576).toFixed(2)}MB -> ${(buffer.length / 1024).toFixed(0)}KB  ${rel}`
  );

  if (dryRun) continue;

  fs.writeFileSync(out, buffer);
  // 元のPNGはビルド対象外の image-src へ移す
  const keep = path.join(KEEP_DIR, rel);
  fs.mkdirSync(path.dirname(keep), { recursive: true });
  fs.renameSync(file, keep);
}

console.log(
  `\n${targets.length}枚: ${(before / 1048576).toFixed(1)}MB -> ${(after / 1048576).toFixed(1)}MB` +
    (dryRun ? '（--dry のため書き込みなし）' : '')
);
