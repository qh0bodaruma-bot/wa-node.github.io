import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST_DIR = path.resolve(__dirname, '../dist');
const SITE_URL = 'https://www.wa-node.com';

// 手動で追加・確保する主要ページ
const CUSTOM_PAGES = [
  '/', '/about/', '/works/', '/contact/', '/free-guide/', '/pricing/', 
  '/simulator/', '/lp_wizard/', '/seo_check/', '/dx_mental_diagnosis/', 
  '/barrier_free/', '/corporate-mental/', '/mental_care/', '/kdp_books/', 
  '/lp-portfolio/', '/campaign-anniversary/', '/easy-guide/',
  '/en/', '/fr/', '/ai-chat-demo/', '/psychology-demo/'
];

// Sitemapから除外するページ（noindex対象）
const EXCLUDED_PAGES = [
  '404', '500', 'exclusive-monitor',
  '/line_demo', '/demos',
  '/terms', '/privacy', '/cancel-policy', '/tokutei', 
  '/security-policy', '/terms_miniapp', '/counseling-notes', '/thanks',
  '/counseling_liff', '/dx_diagnosis_liff', '/inquiry_liff',
  '/portfolio-lp'
];

function getHtmlFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      getHtmlFiles(filePath, fileList);
    } else if (file.endsWith('.html')) {
      const relativePath = path.relative(DIST_DIR, filePath);
      let urlPath = relativePath.replace(/\\/g, '/');
      if (urlPath === 'index.html') {
        urlPath = '';
      } else if (urlPath.endsWith('/index.html')) {
        urlPath = urlPath.replace('/index.html', '/');
      }
      
      const isExcluded = EXCLUDED_PAGES.some(ex => urlPath.includes(ex.replace(/^\//, '')));
      if (!isExcluded) {
        fileList.push(urlPath.startsWith('/') ? urlPath : '/' + urlPath);
      }
    }
  });
  return fileList;
}

try {
  console.log('Generating sitemap...');
  let pages = getHtmlFiles(DIST_DIR);
  
  CUSTOM_PAGES.forEach(cp => {
    const isExcluded = EXCLUDED_PAGES.some(ex => cp.includes(ex));
    if (!pages.includes(cp) && !isExcluded) {
      pages.push(cp);
    }
  });

  const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map(page => `  <url>
    <loc>${SITE_URL}${page}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${page === '/' ? '1.0' : '0.8'}</priority>
  </url>`).join('\n')}
</urlset>`;

  fs.writeFileSync(path.join(DIST_DIR, 'sitemap.xml'), sitemapContent);
  // robots.txtとの互換性のためindexも作成
  fs.writeFileSync(path.join(DIST_DIR, 'sitemap-index.xml'), sitemapContent);
  
  console.log(`Successfully generated sitemap with ${pages.length} pages.`);
} catch (error) {
  console.error('Error generating sitemap:', error);
  process.exit(1);
}
