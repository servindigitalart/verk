import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  // Dominio canónico. Netlify define URL con el dominio principal del sitio en cada build (hoy verk-site.netlify.app;
  // cuando se conecte el dominio propio como principal, pasará a ser ese). Fuera de Netlify se usa el dominio previsto,
  // verk.mx, que todavía NO resuelve (2026-11-05): ver docs/24-production-readiness.md.
  site: process.env.CONTEXT === 'production' && process.env.URL ? process.env.URL : 'https://verk.mx',

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
