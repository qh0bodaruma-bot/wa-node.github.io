// Google Fonts の CSS とフォントファイル（woff2）を取得し、自サイトから配信できる形で保存する。
// 閲覧者の通信を Google のサーバーへ送らないため、フォントは public/fonts/ から配信する。
// アイコン一覧（src/data/materialIconNames.ts）や書体を変えたら `npm run fetch-fonts` で取り直す。
import { existsSync, mkdirSync, readdirSync, readFileSync, unlinkSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

// woff2 と unicode-range の分割を返してもらうため、最近のブラウザの User-Agent を送る。
const USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36';

const root = new URL('../', import.meta.url);

export function readIconNames() {
  const source = readFileSync(new URL('src/data/materialIconNames.ts', root), 'utf8');
  const body = source.slice(source.indexOf('materialIconNames = ['), source.indexOf('] as const'));
  return [...body.matchAll(/'([a-z0-9_]+)'/g)].map((m) => m[1]).sort();
}

// アイコン一覧の内容から作る識別子。check-icons.mjs が、取得済みのアイコンが最新かを確かめるのに使う。
export function iconListHash(names) {
  return createHash('sha256').update(names.join(',')).digest('hex').slice(0, 16);
}

const iconNames = readIconNames();

const families = [
  {
    slug: 'outfit',
    query: 'family=Outfit:wght@400;700;800&display=swap',
    cssOut: 'public/fonts/outfit.css',
  },
  {
    slug: 'material-symbols-rounded',
    query: `family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,400,0..1,0&icon_names=${iconNames.join(',')}&display=block`,
    cssOut: 'public/fonts/material-symbols-rounded.css',
    header: `/* icon-list-hash: ${iconListHash(iconNames)} */\n`,
  },
  {
    slug: 'shippori-mincho',
    query: 'family=Shippori+Mincho:wght@600;700;800&display=swap',
    cssOut: 'src/styles/fonts/shippori-mincho.css',
  },
];

async function fetchText(url) {
  const res = await fetch(url, { headers: { 'User-Agent': USER_AGENT } });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return res.text();
}

async function fetchFamily({ slug, query, cssOut, header = '' }) {
  const css = await fetchText(`https://fonts.googleapis.com/css2?${query}`);
  const fontDir = fileURLToPath(new URL(`public/fonts/${slug}/`, root));
  // 古いファイルを消してから取り直す。日本語を含むパスでは Node 24 の rmSync({ recursive }) が
  // 異常終了したため、ファイルを1つずつ消す。
  if (existsSync(fontDir)) for (const name of readdirSync(fontDir)) unlinkSync(join(fontDir, name));
  mkdirSync(fontDir, { recursive: true });

  const urls = [...new Set([...css.matchAll(/url\((https:\/\/fonts\.gstatic\.com\/[^)]+)\)/g)].map((m) => m[1]))];
  let localCss = css;
  let bytes = 0;
  for (const [i, url] of urls.entries()) {
    const res = await fetch(url, { headers: { 'User-Agent': USER_AGENT } });
    if (!res.ok) throw new Error(`${res.status} ${url}`);
    const data = Buffer.from(await res.arrayBuffer());
    // アイコンの部分フォントは URL に拡張子がない（font?kit=...）ため、CSS の format() から決める。
    const format = css.slice(css.indexOf(url)).match(/format\('([a-z0-9]+)'\)/)?.[1];
    const ext = /\.(woff2|woff|ttf|otf)$/.exec(url)?.[1] ?? (format === 'truetype' ? 'ttf' : format ?? 'woff2');
    const name = `${slug}-${String(i).padStart(3, '0')}.${ext}`;
    writeFileSync(join(fontDir, name), data);
    bytes += data.length;
    localCss = localCss.replaceAll(url, `/fonts/${slug}/${name}`);
  }

  const outPath = fileURLToPath(new URL(cssOut, root));
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, `/* scripts/fetch-fonts.mjs で生成。手で編集しない。 */\n${header}${localCss}`);
  console.log(`${slug}: ${urls.length} ファイル、${(bytes / 1024).toFixed(0)} KB → ${cssOut}`);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  for (const family of families) await fetchFamily(family);
}
