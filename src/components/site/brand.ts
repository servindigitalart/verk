// Marcas oficiales (copias de lab/brand/*.svg en src/assets/brand). Se insertan tal cual: nunca se redibujan.
import isoRaw from '../../assets/brand/isotipo.svg?raw';
import wmRaw from '../../assets/brand/wordmark.svg?raw';
const inner = (s: string) => s.slice(s.indexOf('>', s.indexOf('<svg')) + 1, s.lastIndexOf('</svg>')).trim();
export const ISOTIPO = inner(isoRaw);
export const WORDMARK = inner(wmRaw);
// Marca interna de los botones (sistema de interacción): el isotipo oficial a 0.62 em, decorativo
export const BK = `<svg class="bk" viewBox="0 0 567 739" fill="currentColor" aria-hidden="true">${ISOTIPO}</svg>`;
