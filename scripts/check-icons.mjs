// ビルド結果の HTML に出ているアイコン名が、読み込むアイコン一覧（src/data/materialIconNames.ts）に
// すべて含まれているかを確認する。含まれていないアイコンは、画面に「forum」などの文字で表示されてしまうため。
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const listSource = readFileSync(new URL('../src/data/materialIconNames.ts', import.meta.url), 'utf8');
const listBody = listSource.slice(listSource.indexOf('materialIconNames = ['), listSource.indexOf('] as const'));
const allowed = new Set([...listBody.matchAll(/'([a-z0-9_]+)'/g)].map((m) => m[1]));

const dist = fileURLToPath(new URL('../dist/', import.meta.url));
const missing = new Map();
let pages = 0;

function walk(dir) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) walk(path);
    else if (name.endsWith('.html')) checkPage(path);
  }
}

function checkPage(path) {
  const html = readFileSync(path, 'utf8');
  if (!html.includes('icon_names=')) return;
  pages++;
  for (const m of html.matchAll(/class="[^"]*material-symbols-rounded[^"]*"[^>]*>\s*([a-z0-9_]+)\s*</g)) {
    if (!allowed.has(m[1])) {
      if (!missing.has(m[1])) missing.set(m[1], []);
      missing.get(m[1]).push(path);
    }
  }
}

walk(dist);

if (missing.size) {
  console.error('\nアイコン一覧に無いアイコンが使われています。src/data/materialIconNames.ts に名前を追加してください。');
  for (const [name, files] of missing) console.error(`  ${name}（${files.length}ページ。例：${files[0]}）`);
  process.exit(1);
}
console.log(`icons: ${pages}ページのアイコンはすべて一覧に含まれています（一覧 ${allowed.size}件）`);
