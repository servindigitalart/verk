import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  // Update to confirmed domain before deployment
  site: 'https://verk.mx',

  // Static output — deploys as prebuilt HTML/CSS/JS to Netlify.
  // If SSR or server functions (contact form, etc.) are added later,
  // switch output to 'server' and add @astrojs/netlify as adapter.
  integrations: [sitemap()],

  // Image optimization — uses Sharp under the hood
  image: {
    service: {
      entrypoint: 'astro/assets/services/sharp',
    },
  },

  // i18n: deferred to V1.5
  // When adding bilingual support:
  // i18n: {
  //   defaultLocale: 'es',
  //   locales: ['es', 'en'],
  //   routing: { prefixDefaultLocale: false },
  // },

  // vite config reserved for future additions (GSAP externalization, etc.)

});
