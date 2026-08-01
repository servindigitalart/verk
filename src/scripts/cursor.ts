/**
 * cursor.ts — Phase 5, "El cursor que es el sistema"
 *
 * The one signature moment (docs/19-momento-wow.md). Idle state is a small
 * neutral dot — never lime, per doc 11 Rule 2 (lime = action only, never
 * decorative/idle). On hover of any interactive element, the dot blooms
 * into the isotipo — the same two shapes as Isotipo.astro — tinted by what
 * the element actually means: lime only for a real action, violet only for
 * an intelligence/AI context, neutral (mix-blend-mode: difference) for
 * everything else. Desktop pointer only — untouched on touch devices.
 */

export function initCursor(): void {
  if (document.querySelector('.verk-cursor')) return;
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const cursor = document.createElement('div');
  cursor.className = 'verk-cursor';
  cursor.setAttribute('aria-hidden', 'true');
  cursor.innerHTML = `
    <span class="verk-cursor-dot"></span>
    <svg class="verk-cursor-mark" viewBox="0 0 100 90" focusable="false">
      <path class="verk-cursor-shape verk-cursor-shape-a" d="M28 12 L62 12 L48 42 L14 42 Z" />
      <path class="verk-cursor-shape verk-cursor-shape-b" d="M52 46 L86 46 L72 76 L38 76 Z" />
    </svg>
  `;
  document.body.appendChild(cursor);
  document.body.classList.add('cursor-ready');

  let targetX = window.innerWidth / 2;
  let targetY = window.innerHeight / 2;
  let x = targetX;
  let y = targetY;

  window.addEventListener('mousemove', (e) => {
    targetX = e.clientX;
    targetY = e.clientY;
  });

  function frame(): void {
    x += (targetX - x) * 0.2;
    y += (targetY - y) * 0.2;
    cursor.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);

  function bind(el: HTMLElement): void {
    const tone = el.dataset.cursorTone || 'default';
    el.addEventListener('mouseenter', () => {
      cursor.dataset.tone = tone;
      cursor.classList.add('is-active');
    });
    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('is-active');
    });
  }

  document.querySelectorAll<HTMLElement>('a, button, [data-cursor]').forEach(bind);
}

document.addEventListener('astro:page-load', initCursor);
