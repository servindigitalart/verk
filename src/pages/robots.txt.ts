// robots.txt con el sitemap en el dominio canónico de cada build (sustituye a public/robots.txt, que fijaba verk.mx).
import type { APIRoute } from 'astro';
export const GET: APIRoute = ({ site }) =>
  new Response(`User-agent: *\nAllow: /\n\nSitemap: ${new URL('sitemap-index.xml', site).href}\n`, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
