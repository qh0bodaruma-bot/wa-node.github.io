import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST_DIR = path.resolve(__dirname, '../dist');
const SITE_URL = 'https://www.wa-node.com';

// 手動で追加するページ（publicにあるものや、確実に含めたい主要ページ）
const CUSTOM_PAGES = [
  '/',
  '/about/',
  '/works/',
  '/contact/',
  '/free-guide/',
  '/psychology-demo/',
  '/pricing/',
  '/simulator/',
  '/lp_wizard/',
  '/ai-chat-demo/',
  '/seo_check/',
  '/dx_mental_diagnosis/',
  '/barrier_free/',
  '/corporate-mental/',
  '/mental_care/',
  '/kdp_books/',
  '/demos/',
  '/line_demo/',
  '/lp-portfolio/',
  '/campaign-anniversary/',
  '/portfolio-lp/index.html',
  '/portfolio-lp/demo_business_7.html',
  '/portfolio-lp/demo_corporate.html',
  '/portfolio-lp/demo_enterprise_15.html',
  '/portfolio-lp/demo_lead.html',
  '/portfolio-lp/demo_local.html',
  '/portfolio-lp/demo_media.html',
  '/portfolio-lp/demo_premium_10.html',
  '/portfolio-lp/demo_profile.html',
  '/portfolio-lp/lp_beauty.html',
  '/portfolio-lp/lp_clinic.html',
  '/portfolio-lp/lp_corporate.html',
  '/portfolio-lp/lp_ec.html',
  '/portfolio-lp/lp_event.html',
  '/portfolio-lp/lp_gym.html',
  '/portfolio-lp/lp_lawyer.html',
  '/portfolio-lp/lp_local.html',
  '/portfolio-lp/lp_realestate.html',
  '/portfolio-lp/lp_recruit.html',
  '/portfolio-lp/lp_saas.html',
  '/portfolio-lp/lp_sekkotsu.html',
  '/portfolio-lp/lp_seminar.html',
  '/portfolio-lp/giken-lp/index.html',
  '/counseling_liff.html',
  '/dx_diagnosis_liff.html',
  '/inquiry_liff.html'
];

function getHtmlFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      getHtmlFiles(filePath, fileList);
    } else if (file.endsWith('.html')) {
      const relativePath = path.relative(DIST_DIR, filePath);
      // index.html はディレクトリ名として扱う（trailingSlash対応）
      let urlPath = relativePath.replace(/\\/g, '/');
      if (urlPath === 'index.html') {
        urlPath = '';
      } else if (urlPath.endsWith('/index.html')) {
        urlPath = urlPath.replace('/index.html', '/');
      }
      
      // 除外するページ
      if (!urlPath.includes('404') && !urlPath.includes('500')) {
        fileList.push(urlPath.startsWith('/') ? urlPath : '/' + urlPath);
      }
    }
  });
  return fileList;
}

try {
  console.log('Generating sitemap...');
  let pages = getHtmlFiles(DIST_DIR);
  
  // CUSTOM_PAGESを追加（重複排除）
  CUSTOM_PAGES.forEach(cp => {
    if (!pages.includes(cp)) {
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
