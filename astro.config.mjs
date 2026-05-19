import { defineConfig, passthroughImageService } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
export default defineConfig({
  site: 'https://www.wa-node.com',
  trailingSlash: 'always',
  output: 'hybrid',
  adapter: cloudflare(),
  image: {
    service: passthroughImageService()
  },
  integrations: [],
  i18n: {
    defaultLocale: 'ja',
    locales: ['ja', 'en', 'fr'],
    routing: {
      prefixDefaultLocale: false
    }
  }
});
