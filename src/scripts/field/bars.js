// VERK · movimiento de las 3 barras del isotipo, sin dependencias de WebGL (lo usan el hero y Contacto).
// Regla de marca (doc 21 §5): las barras SOLO se trasladan sobre su eje de 45°. Nunca rotan ni se deforman.
// Todo se expresa como un desplazamiento escalar por barra, en px CSS a lo largo del eje (+ = arriba-derecha).

const TAU = Math.PI * 2;

// Respiración orgánica: tres senos de periodos inconmensurables (5.2 s, 3.3 s, 8.9 s) con desfase por barra.
// El patrón no se repite de forma perceptible y conserva el ritmo lento de F3. Devuelve −1..1.
export function breath(t, i) {
  return .58 * Math.sin(t * TAU / 5.2 - i * 1.1)
       + .27 * Math.sin(t * TAU / 3.3 + i * 2.3)
       + .15 * Math.sin(t * TAU / 8.9 - i * .7);
}

// Muelles por barra con respuesta al puntero. `centers` en px (sistema de coordenadas del llamador, y hacia abajo).
// El puntero empuja cada barra a lo largo de su eje, alejándola; la fuerza cae con la distancia (gaussiana).
// La velocidad del puntero a lo largo del eje arrastra las barras (acoplamiento tipo fluido).
export function createRig(P) {                              // P se lee en cada paso: ajustable en vivo
  const x = new Float32Array(3), v = new Float32Array(3);
  const AX = Math.SQRT1_2;                                   // eje de las barras en pantalla: (+1, −1)/√2
  return {
    x, v,
    // ptr: { x, y, vx, vy, on } en px y px/s · size: altura del isotipo en px
    step(dt, ptr, centers, size) {
      if (dt <= 0) return false;
      const { reach, push, stiffness, damping } = P;
      const R = reach * size; let moving = false;
      for (let i = 0; i < 3; i++) {
        let target = 0;
        if (ptr.on > .001 && centers[i]) {
          const dx = ptr.x - centers[i][0], dy = ptr.y - centers[i][1];
          const w = ptr.on * Math.exp(-(dx * dx + dy * dy) / (R * R));
          const a = (dx - dy) * AX;                              // componente del puntero a lo largo del eje
          const drag = ((ptr.vx - ptr.vy) * AX) * .012;          // arrastre por la velocidad del puntero
          target = push * w * (-Math.tanh(2.2 * a / R) + Math.max(-1, Math.min(1, drag)));
        }
        const k = stiffness * (1 - i * .14), c = 2 * damping * Math.sqrt(k);   // 1-2-3: cada barra un poco más lenta
        const sub = Math.ceil(dt / (1 / 120));                                // subpasos: estable a cualquier dt
        for (let s = 0, h = dt / sub; s < sub; s++) { v[i] += (k * (target - x[i]) - c * v[i]) * h; x[i] += v[i] * h; }
        x[i] = Math.max(-push * 1.5, Math.min(push * 1.5, x[i]));
        if (Math.abs(v[i]) > .5 || Math.abs(target - x[i]) > .05) moving = true;
      }
      return moving;
    },
  };
}

// Aplica un desplazamiento axial (px CSS) a un <path> del SVG. pxPerVb = px CSS por unidad del viewBox.
export function place(path, px, pxPerVb) {
  const k = px / Math.max(pxPerVb, 1e-3) / Math.SQRT2;
  path.style.transform = `translate(${k.toFixed(2)}px, ${(-k).toFixed(2)}px)`;
}

// Centros de las barras (px, relativos a `origin`) a partir del SVG renderizado: getBBox de cada path oficial.
export function barGeometry(svg, origin) {
  const m = svg.getBoundingClientRect(), o = origin.getBoundingClientRect();
  const [, , vw, vh] = svg.viewBox.baseVal ? [0, 0, svg.viewBox.baseVal.width, svg.viewBox.baseVal.height] : [0, 0, 567, 739];
  const s = Math.min(m.width / vw, m.height / vh);                 // preserveAspectRatio xMidYMid meet
  const ox = m.left - o.left + (m.width - vw * s) / 2, oy = m.top - o.top + (m.height - vh * s) / 2;
  const centers = [...svg.querySelectorAll('path')].map((p) => { const b = p.getBBox(); return [ox + s * (b.x + b.width / 2), oy + s * (b.y + b.height / 2)]; });
  return { s, ox, oy, vw, vh, centers, size: vh * s };
}
