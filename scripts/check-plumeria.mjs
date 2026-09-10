// Read-only release gate for the proposal demo. No dependencies or network.
// Run after `npx --no-install astro build`: node scripts/check-plumeria.mjs
import { readFileSync, existsSync, statSync } from 'node:fs';
import { resolve, join, sep } from 'node:path';
import assert from 'node:assert/strict';

const root = resolve(process.argv[2] || 'dist');
const base = '/lab/demos/plumeria/1a/';
const routes = ['', 'services/', 'housing/', 'housing/1/', 'housing/2/', 'short-stay/', 'home-care/', 'home-nursing/', 'care-management/', 'welfare-equipment/', 'recruit/', 'contact/', 'privacy/', 'important-matters/'];
// Restricted parser for Astro's generated start tags (not arbitrary user HTML).
function tags(html) {
  return [...html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '').matchAll(/<([a-z][\w-]*)\b([^<>]*)>/gi)].map(([, name, text]) => ({
    name: name.toLowerCase(),
    attrs: Object.fromEntries([...text.matchAll(/([^\s=/'">]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g)].map(([, key, a, b, c]) => [key.toLowerCase(), a ?? b ?? c ?? ''])),
  }));
}
function fileFor(pathname) {
  const path = resolve(root, '.' + decodeURIComponent(pathname));
  assert(path.startsWith(root + sep), `Path outside build directory: ${pathname}`);
  return pathname.endsWith('/') ? join(path, 'index.html') : path;
}
const pages = new Map();
for (const route of routes) {
  const path = base + route;
  assert(existsSync(fileFor(path)), `Missing page: ${path}`);
  const html = readFileSync(fileFor(path), 'utf8');
  pages.set(path, { html, tags: tags(html) });
}
const titles = new Set();
let links = 0, assets = 0, forms = 0;
for (const [path, page] of pages) {
  const { html, tags: nodes } = page;
  const title = html.match(/<title>([\s\S]*?)<\/title>/i)?.[1];
  assert(title && !titles.has(title), `Missing/duplicate title: ${path}`);
  titles.add(title);
  assert.equal(nodes.filter(t => t.name === 'h1').length, 1, `One H1 required: ${path}`);
  assert(nodes.some(t => t.name === 'meta' && t.attrs.name === 'description' && t.attrs.content), `Description missing: ${path}`);
  assert(nodes.some(t => t.name === 'meta' && t.attrs.name === 'robots' && t.attrs.content?.includes('noindex')), `Demo must stay noindex: ${path}`);
  assert(nodes.some(t => t.attrs['data-pl-demo'] === 'true'), `Demo telemetry guard missing: ${path}`);
  // 計測は許可する（先方より新サイトのアクセス分析の依頼があるため）。
  // ただし和-Node本体のプロパティへ混入させない。BaseLayout の既定値は本体側のIDのため、
  // PlumeriaLayout で ID の指定が外れると本体へ送信されてしまう。それをここで止める。
  assert(!html.includes('G-B4FD0GJGW5'), `Wa-Node main GA property leaked into demo: ${path}`);
  assert(!html.includes('yfv3qj03ho'), `Wa-Node main Clarity project leaked into demo: ${path}`);
  // 計測が黙って外れることも防ぐ（依頼された分析データを取り逃さないため）。
  assert(html.includes('G-G8XKQBVK7D'), `Plumeria GA property missing: ${path}`);
  assert(html.includes('yfv2ceb9ce'), `Plumeria Clarity project missing: ${path}`);
  const ids = nodes.filter(t => 'id' in t.attrs).map(t => t.attrs.id);
  assert.equal(new Set(ids).size, ids.length, `Duplicate IDs: ${path}`);
  for (const { name, attrs } of nodes) {
    if (name === 'img') assert('alt' in attrs, `Image alt missing: ${path}`);
    if (name === 'a' && attrs.href && !/^(tel:|mailto:)/.test(attrs.href)) {
      const href = attrs.href.replace(/&#(x[\da-f]+|\d+);/gi, (_, code) => String.fromCodePoint(code[0].toLowerCase() === 'x' ? parseInt(code.slice(1), 16) : Number(code))).replaceAll('&amp;', '&');
      const url = new URL(href, 'https://www.wa-node.com' + path);
      assert(['https:', 'http:'].includes(url.protocol), `Unexpected link protocol: ${path}`);
      if (url.origin === 'https://www.wa-node.com' && url.pathname.startsWith(base)) {
        links++;
        assert(pages.has(url.pathname), `Unknown demo route: ${path} -> ${url.pathname}`);
        if (url.hash) assert(pages.get(url.pathname).tags.some(t => t.attrs.id === decodeURIComponent(url.hash.slice(1))), `Broken anchor: ${path} -> ${url.href}`);
      }
    }
    if (['img', 'source', 'link'].includes(name)) {
      const src = attrs.src || attrs['data-src'] || (attrs.rel === 'stylesheet' ? attrs.href : '');
      if (src?.startsWith('/') && !src.startsWith('//')) {
        assets++;
        const local = fileFor(new URL(src, 'https://www.wa-node.com').pathname);
        assert(existsSync(local) && statSync(local).size > 0, `Missing/empty asset: ${path} -> ${src}`);
      }
    }
    if (name === 'form') {
      forms++;
      assert('data-pl-demo-form' in attrs && !attrs.action, `Unexpected live form: ${path}`);
      assert(nodes.some(t => t.name === 'fieldset' && 'disabled' in t.attrs), `No-JS form guard missing: ${path}`);
      assert(nodes.filter(t => t.name === 'button').every(t => t.attrs.type === 'button'), `Submit button in demo: ${path}`);
    }
  }
}
assert.equal(forms, 2, 'Both demo forms must be present');
console.log(`PASS Plumeria: ${pages.size} pages, ${links} internal links/anchors, ${assets} asset references, ${forms} protected demo forms. Noindex OK. Analytics scoped to Plumeria properties (no wa-node leakage).`);
