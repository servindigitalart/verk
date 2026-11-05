// VERK · glifos ⏳ → ↗ como SVG en línea. Ni Neue Haas ni el subconjunto latino de Geist Mono los incluyen: el navegador
// buscaba una fuente de respaldo del sistema y esa búsqueda costaba 250–475 ms de layout con CPU ×4 (la primera vez que
// aparecía cada glifo: al cargar la página y al abrir el panel). Mismo significado, sin búsqueda de fuentes.
const svg = (d, label) => `<svg class="gl" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"${label ? ` role="img" aria-label="${label}"` : ' aria-hidden="true"'}><path d="${d}"/></svg>`;
export const ICON = {
  '⏳': svg('M4 1.5h8M4 14.5h8M5 1.5c0 4 6 3.5 6 6.5s-6 2.5-6 6.5M11 1.5c0 4-6 3.5-6 6.5s6 2.5 6 6.5', 'pendiente'),
  '→': svg('M2 8h11M9 4l4 4-4 4'),
  '↗': svg('M4 12 12 4M6 4h6v6'),
};
export const esc = (s = '') => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
// Sustituye los glifos en HTML ya escapado
export const iconize = (html) => html.replace(/⏳|→|↗/g, (g) => ICON[g]);
// Texto plano → HTML seguro con iconos
export const t = (s) => iconize(esc(s));
