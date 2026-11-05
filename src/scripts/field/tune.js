// VERK · panel de ajuste del hero (solo con ?tune; no forma parte de la carga normal).
// Mueve los parámetros de config.js en vivo y muestra el objeto resultante para copiarlo a config.js.
const SLIDERS = [
  ['chroma.intensity', 'Intensidad cromática', 0, 1, .01],
  ['chroma.radius', 'Radio de interacción (px)', 0, 80, 1],
  ['chroma.response', 'Velocidad de respuesta (1/s)', 0, 8, .1],
  ['chroma.transition', 'Transición de color (s)', .1, 6, .1],
  ['chroma.near', 'Tinte bajo la letra', 0, 1, .01],
  ['chroma.textDensity', 'Densidad bajo la letra', .3, 1.2, .01],
  ['density', 'Densidad de partículas', .3, 1.6, .01],
  ['contrast', 'Contraste del tono', .4, 2.5, .01],
  ['cell', 'Celda de la trama (px)', 4, 14, .5],
  ['speed', 'Velocidad del campo', 0, 2, .05],
  ['cursor', 'Fuerza del cursor', 0, 2, .05],
  ['mark.push', 'Isotipo: desplazamiento (px)', 0, 40, 1],
  ['mark.reach', 'Isotipo: alcance', .3, 2.5, .05],
  ['mark.stiffness', 'Isotipo: rigidez', 10, 200, 1],
  ['mark.damping', 'Isotipo: amortiguamiento', .1, 1.2, .01],
  ['mark.breath', 'Isotipo: respiración (px)', 0, 8, .1],
];
export function tune(api) {
  const get = (k) => k.split('.').reduce((o, p) => o[p], api.cfg);
  const box = document.createElement('div');
  box.setAttribute('style', 'position:fixed;z-index:60;right:12px;bottom:12px;width:300px;max-height:70vh;overflow:auto;padding:12px;border-radius:12px;background:#0F0F0F;color:#F0EEE9;font:11px/1.4 "Geist Mono",monospace');
  box.innerHTML = SLIDERS.map(([k, l, a, b, s]) => `<label style="display:grid;gap:2px;margin-bottom:6px">${l} <output data-o="${k}">${get(k)}</output><input type="range" min="${a}" max="${b}" step="${s}" value="${get(k)}" data-k="${k}"></label>`).join('')
    + '<button type="button" style="margin-top:6px">Copiar config</button>';
  box.addEventListener('input', (e) => {
    const k = e.target.dataset.k; if (!k) return;
    const v = +e.target.value, [a, b] = k.split('.');
    api.set(b ? { [a]: { [b]: v } } : { [a]: v });
    box.querySelector(`[data-o="${k}"]`).textContent = v;
  });
  box.querySelector('button').addEventListener('click', () => navigator.clipboard?.writeText(JSON.stringify(api.cfg, null, 2)));
  document.body.append(box);
}
