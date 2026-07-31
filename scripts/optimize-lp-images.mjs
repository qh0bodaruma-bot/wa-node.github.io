/**
 * ポートフォリオLPのビジュアル軽量化。
 *
 * これらはAstro側では .lp-visual（高さ200px）のサムネイルだが、
 * public/portfolio-lp/*.html の静的デモLPでは背景画像として全幅表示される。
 * 縮小すると静的LP側が甘くなるため、寸法は1024pxのまま WebP 化だけ行う。
 * 元ファイルは image-src/ へ退避して残す（image-src はビルド対象外）。
 *
 *   node scripts/optimize-lp-images.mjs [--dry]
 */
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const SRC_DIR = path.join(ROOT, 'public', 'portfolio-lp', 'images');
const KEEP_DIR = path.join(ROOT, 'image-src', 'portfolio-lp', 'images');

const QUALITY = 78;
const dryRun = process.argv.includes('--dry');

const targets = fs
  .readdirSync(SRC_DIR, { withFileTypes: true })
  .filter((e) => e.isFile() && /\.(png|jpe?g)$/i.test(e.name))
  .map((e) => e.name);

let before = 0;
let after = 0;
const rewrites = [];

for (const name of targets) {
  const src = path.join(SRC_DIR, name);
  const originalSize = fs.statSync(src).size;
  const buffer = await sharp(src).webp({ quality: QUALITY }).toBuffer();

  before += originalSize;
  after += buffer.length;
  console.log(`${(originalSize / 1024).toFixed(0)}KB -> ${(buffer.length / 1024).toFixed(0)}KB  ${name}`);

  if (dryRun) continue;

  const outName = name.replace(/\.(png|jpe?g)$/i, '.webp');
  fs.writeFileSync(path.join(SRC_DIR, outName), buffer);
  fs.mkdirSync(KEEP_DIR, { recursive: true });
  fs.renameSync(src, path.join(KEEP_DIR, name));
  rewrites.push({ from: name, to: outName });
}

if (!dryRun) {
  // .astro と public 配下の静的HTML/CSS/JS の参照をまとめて差し替える
  const files = [];
  (function walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (entry.name === 'node_modules' || entry.name === 'dist') continue;
        walk(full);
      } else if (/\.(astro|html|css|js)$/i.test(entry.name)) {
        files.push(full);
      }
    }
  })(ROOT);

  let touched = 0;
  for (const file of files) {
    let content = fs.readFileSync(file, 'utf8');
    const original = content;
    for (const r of rewrites) {
      // images/hero_xxx.png の形でしか参照されないためファイル名で置換して差し支えない
      content = content.replaceAll(`images/${r.from}`, `images/${r.to}`);
    }
    if (content !== original) {
      fs.writeFileSync(file, content);
      touched++;
    }
  }
  console.log(`\n参照を更新したファイル: ${touched}件`);
}

console.log(
  `${targets.length}枚: ${(before / 1048576).toFixed(2)}MB -> ${(after / 1048576).toFixed(2)}MB` +
    (dryRun ? '（--dry のため書き込みなし）' : '')
);
