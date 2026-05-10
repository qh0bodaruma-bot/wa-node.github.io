import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://www.wa-node.com',
  trailingSlash: 'always',
  integrations: [], // 一時的にsitemapを無効化
});
