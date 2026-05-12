import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://www.wa-node.com',
  trailingSlash: 'always',
  integrations: [
    sitemap({
      customPages: [
        'https://www.wa-node.com/portfolio-lp/index.html',
        'https://www.wa-node.com/portfolio-lp/demo_business_7.html',
        'https://www.wa-node.com/portfolio-lp/demo_corporate.html',
        'https://www.wa-node.com/portfolio-lp/demo_enterprise_15.html',
        'https://www.wa-node.com/portfolio-lp/demo_lead.html',
        'https://www.wa-node.com/portfolio-lp/demo_local.html',
        'https://www.wa-node.com/portfolio-lp/demo_media.html',
        'https://www.wa-node.com/portfolio-lp/demo_premium_10.html',
        'https://www.wa-node.com/portfolio-lp/demo_profile.html',
        'https://www.wa-node.com/portfolio-lp/lp_beauty.html',
        'https://www.wa-node.com/portfolio-lp/lp_clinic.html',
        'https://www.wa-node.com/portfolio-lp/lp_corporate.html',
        'https://www.wa-node.com/portfolio-lp/lp_ec.html',
        'https://www.wa-node.com/portfolio-lp/lp_event.html',
        'https://www.wa-node.com/portfolio-lp/lp_gym.html',
        'https://www.wa-node.com/portfolio-lp/lp_lawyer.html',
        'https://www.wa-node.com/portfolio-lp/lp_local.html',
        'https://www.wa-node.com/portfolio-lp/lp_realestate.html',
        'https://www.wa-node.com/portfolio-lp/lp_recruit.html',
        'https://www.wa-node.com/portfolio-lp/lp_saas.html',
        'https://www.wa-node.com/portfolio-lp/lp_sekkotsu.html',
        'https://www.wa-node.com/portfolio-lp/lp_seminar.html',
        'https://www.wa-node.com/portfolio-lp/giken-lp/index.html',
        'https://www.wa-node.com/counseling_liff.html',
        'https://www.wa-node.com/dx_diagnosis_liff.html',
        'https://www.wa-node.com/inquiry_liff.html'
      ]
    })
  ],
});
