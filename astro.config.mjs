import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://www.wa-node.com',
  trailingSlash: 'always',
  integrations: [
    sitemap({
      // ページ数を減らしてテスト
      customPages: [
        'https://www.wa-node.com/portfolio-lp/index.html'
      ]
    })
  ],
});
