// VERK · arranque de la página. JS inicial: header + Sistemas + Contacto. El hero WebGL se carga aparte (import()
// dinámico) cuando el navegador queda libre, para que nunca compita con el primer render ni con el LCP (el H1).
import { initHeader } from './header.js';
import { initPortfolio } from './portfolio.js';
import { initContactMark } from './contact-mark.js';

initHeader();
initPortfolio();
initContactMark();
// Método: solo los navegadores sin CSS scroll-driven animations cargan el respaldo (no cuenta en el JS inicial)
if (!CSS.supports('animation-timeline: view()')) import('./method-route.js').then((m) => m.initMethodRoute());

const hero = document.querySelector('[data-field]');
if (hero) {
  const go = () => import('../field/index.js').catch((e) => { console.error(e); hero.dataset.fieldOff = 'error'; document.documentElement.classList.remove('mark-pending'); });
  'requestIdleCallback' in window ? requestIdleCallback(go, { timeout: 600 }) : setTimeout(go, 1);
}
