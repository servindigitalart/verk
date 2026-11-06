// VERK · arranque de la página.
//   Inicial (≈ 8 KB gzip): header, navegación espacial, Sistemas (visor + panel).
//   Diferido: el hero WebGL (requestIdleCallback) y cada pieza de sección cuando su sección se acerca al viewport
//   (Servicios, Método, Contacto, footer). Sin JS, todas las secciones quedan en su estado final y legibles.
import { initHeader } from './header.js';
import { initPortfolio } from './portfolio.js';
import { initTravel } from './travel.js';

initHeader();
initPortfolio();
initTravel();
addEventListener('touchstart', () => {}, { passive: true });   // :active inmediato en iOS (respuesta táctil de los botones)

const whenNear = (sel, load) => {
  const el = document.querySelector(sel); if (!el) return;
  const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { io.disconnect(); load(); } }, { rootMargin: '700px 0px' });
  io.observe(el);
};
whenNear('[data-svc]', () => import('./services.js').then((m) => m.initServices()));
whenNear('.steps', () => import('./method-route.js').then((m) => m.initMethodRoute()));
whenNear('[data-contact]', () => import('./contact.js').then((m) => m.initContact()));
whenNear('[data-foot]', () => import('./footer-field.js').then((m) => m.initFooterField()));

const hero = document.querySelector('[data-field]');
if (hero) {
  const go = () => import('../field/index.js').catch((e) => { console.error(e); hero.dataset.fieldOff = 'error'; document.documentElement.classList.remove('mark-pending'); });
  'requestIdleCallback' in window ? requestIdleCallback(go, { timeout: 600 }) : setTimeout(go, 1);
}
