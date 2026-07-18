import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST_DIR = path.resolve(__dirname, '../dist');
const SITE_URL = 'https://www.wa-node.com';

// Search-focused sitemap. Demo subpages, mental-care pages, and noindex legal/utility pages are intentionally omitted.
const PAGES = [
  ['/', '1.0'],
  ['/about/', '0.9'],
  ['/works/', '0.9'],
  ['/lab/', '0.9'],
  ['/lab/cases/service-lp/', '0.8'],
  ['/contact/', '0.9'],
  ['/pricing/', '0.9'],
  ['/free-guide/', '0.8'],
  ['/psychology-demo/', '0.8'],
  ['/ai-chat-demo/', '0.8'],
  ['/simulator/', '0.8'],
  ['/lp_wizard/', '0.8'],
  ['/seo_check/', '0.8'],
  ['/easy-guide/', '0.8'],
  ['/tech-stack/', '0.8'],
  ['/lp-portfolio/', '0.8'],
  ['/salon-reservation-demo/', '0.8'],
  ['/demos/', '0.8'],
  ['/campaign-anniversary/', '0.8'],
  ['/anniversary-speed/', '0.7'],
  ['/anniversary-automation/', '0.7'],
  ['/anniversary-premium/', '0.7'],
  ['/barrier_free/', '0.6'],
  ['/kdp_books/', '0.6'],
  ['/en/', '0.7'],
  ['/en/about/', '0.6'],
  ['/en/works/', '0.6'],
  ['/en/contact/', '0.6'],
  ['/en/pricing/', '0.6'],
  ['/en/ai-chat-demo/', '0.6'],
  ['/en/psychology-demo/', '0.6'],
  ['/en/simulator/', '0.6'],
  ['/en/tech-stack/', '0.6'],
  ['/en/demos/', '0.6'],
  ['/en/lp-portfolio/', '0.6'],
  ['/en/barrier_free/', '0.5'],
  ['/en/kdp_books/', '0.5'],
  ['/fr/', '0.7'],
  ['/fr/about/', '0.6'],
  ['/fr/works/', '0.6'],
  ['/fr/contact/', '0.6'],
  ['/fr/pricing/', '0.6'],
  ['/fr/ai-chat-demo/', '0.6'],
  ['/fr/psychology-demo/', '0.6'],
  ['/fr/simulator/', '0.6'],
  ['/fr/tech-stack/', '0.6'],
  ['/fr/demos/', '0.6'],
  ['/fr/lp-portfolio/', '0.6'],
  ['/fr/barrier_free/', '0.5'],
  ['/fr/kdp_books/', '0.5'],
];

const lastmod = new Date().toISOString().split('T')[0];
const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${PAGES.map(([page, priority]) => `  <url>
    <loc>${SITE_URL}${page}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${priority}</priority>
  </url>`).join('\n')}
</urlset>
`;

fs.mkdirSync(DIST_DIR, { recursive: true });
fs.writeFileSync(path.join(DIST_DIR, 'sitemap.xml'), sitemapContent);
fs.writeFileSync(path.join(DIST_DIR, 'sitemap-index.xml'), sitemapContent);

console.log(`Successfully generated sitemap with ${PAGES.length} pages.`);
