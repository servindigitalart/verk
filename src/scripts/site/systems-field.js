// VERK · Sistemas · «Isolíneas»: campo topográfico procedural ligado al scroll (lenguaje propio de la sección; no es el
// halftone del hero ni el residuo del footer). Un relieve de ruido fBm se dibuja como curvas de nivel finas:
//   · el desplazamiento vertical hace avanzar el terreno (la sección se recorre como un mapa)
//   · el proyecto activo (la fila más cercana al centro del viewport) levanta una cresta: las curvas se concentran a su
//     altura y se tiñen con el color dominante de su logo, que se interpola al pasar al siguiente proyecto
//   · líneas de 1 px (cada 5.ª, «maestra», algo más visible), opacidad baja: el texto siempre manda
// WebGL2, un solo pase a pantalla completa sobre un lienzo fijo del tamaño del viewport (sticky). Se dibuja solo con la
// sección visible, a ~30 fps, a DPR ≤ 1 (≤ .75 en móvil). Reduced-motion o sin WebGL2: el fondo ink de siempre.
const FS = `#version 300 es
precision highp float;
uniform vec2 uRes; uniform float uT, uScroll, uFocus, uK; uniform vec3 uAcc;
out vec4 o;
vec2 h2(vec2 p){ p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3))); return -1. + 2.*fract(sin(p)*43758.5453); }
float gn(vec2 p){ vec2 i = floor(p), f = fract(p), u = f*f*(3. - 2.*f);
  return mix(mix(dot(h2(i), f), dot(h2(i + vec2(1, 0)), f - vec2(1, 0)), u.x), mix(dot(h2(i + vec2(0, 1)), f - vec2(0, 1)), dot(h2(i + vec2(1, 1)), f - vec2(1, 1)), u.x), u.y); }
float fbm(vec2 p){ float a = .5, s = 0.; mat2 m = mat2(1.6, 1.2, -1.2, 1.6); for (int i = 0; i < 4; i++){ s += a*gn(p); p = m*p; a *= .5; } return s; }
const vec3 INK = vec3(15.)/255.; const vec3 CREAM = vec3(240., 238., 233.)/255.;
void main(){
  vec2 uv = gl_FragCoord.xy/uRes.y;                       // unidades de alto, y hacia arriba
  float fy = 1. - uFocus;                                  // altura del proyecto activo (0 abajo, 1 arriba)
  vec2 p = uv*1.35 + vec2(uT*.012, -uScroll*2.4 + uT*.006);
  float d = uv.y - fy, ridge = exp(-d*d*7.);
  float h = fbm(p) + .38*ridge*(.65 + .35*sin(uv.x*3.1 + uT*.25));
  float k = h*uK, f = abs(fract(k) - .5), w = fwidth(k);
  float line = 1. - smoothstep(0., w*1.05, .5 - f);       // curva de nivel de ~1 px (f = .5 sobre la curva)
  float major = step(4.5, mod(floor(k + .5), 5.));
  // luminancia mínima del acento sobre ink: los colores oscuros se aclaran hacia cream
  float lum = dot(uAcc, vec3(.2126, .7152, .0722));
  vec3 acc = mix(uAcc, CREAM, clamp(.45 - lum, 0., .45));
  vec3 c = mix(CREAM*.55, acc, ridge*.9);
  float a = line*(.10 + .12*major + .30*ridge);
  o = vec4(mix(INK, c, a), 1.);
}`;
const VS = `#version 300 es
in vec2 a; void main(){ gl_Position = vec4(a, 0., 1.); }`;

export function initSystemsField() {
  const sec = document.querySelector('[data-sys]'), host = sec?.querySelector('.sys-field');
  if (!host || matchMedia('(prefers-reduced-motion: reduce)').matches || navigator.connection?.saveData) return null;
  const cv = document.createElement('canvas'); const gl = cv.getContext('webgl2', { antialias: false, alpha: false, depth: false, powerPreference: 'default' });
  if (!gl) return null;
  host.append(cv);
  const sh = (t, src) => { const s = gl.createShader(t); gl.shaderSource(s, src); gl.compileShader(s); return s; };
  const pr = gl.createProgram(); gl.attachShader(pr, sh(gl.VERTEX_SHADER, VS)); gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, FS)); gl.bindAttribLocation(pr, 0, 'a'); gl.linkProgram(pr);
  if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) { cv.remove(); return null; }
  gl.useProgram(pr);
  const b = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, b); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(0); gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
  const U = Object.fromEntries(['uRes', 'uT', 'uScroll', 'uFocus', 'uK', 'uAcc'].map((n) => [n, gl.getUniformLocation(pr, n)]));
  const rows = [...sec.querySelectorAll('.ix-row')];
  const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);
  const acc = hex(rows[0]?.dataset.accent ?? '#6B6AF4'), tgt = [...acc];
  let W = 1, H = 1, visible = false, raf = 0, last = 0, t = 0, scroll = 0, focus = .5, focusT = .5, lastDraw = 0, lost = false;
  const mobile = matchMedia('(max-width: 767px)');
  const resize = () => {
    const dpr = Math.min(devicePixelRatio || 1, 1) * (mobile.matches ? .75 : 1);
    W = innerWidth; H = innerHeight; cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
    gl.viewport(0, 0, cv.width, cv.height);
  };
  // proyecto activo: la fila más cercana al centro del viewport; su altura y su color guían el campo
  const read = () => {
    const r = sec.getBoundingClientRect();
    scroll = Math.min(1, Math.max(0, -r.top / Math.max(1, r.height - H)));
    let best = null, bd = 1e9;
    for (const row of rows) { const q = row.getBoundingClientRect(), c = q.top + q.height / 2, dd = Math.abs(c - H * .5); if (dd < bd) { bd = dd; best = [row, c]; } }
    if (best) { focusT = Math.min(1.2, Math.max(-.2, best[1] / H)); const a = hex(best[0].dataset.accent ?? '#6B6AF4'); tgt[0] = a[0]; tgt[1] = a[1]; tgt[2] = a[2]; }
  };
  const draw = () => {
    gl.uniform2f(U.uRes, cv.width, cv.height); gl.uniform1f(U.uT, t); gl.uniform1f(U.uScroll, scroll);
    gl.uniform1f(U.uFocus, focus); gl.uniform1f(U.uK, mobile.matches ? 11 : 15); gl.uniform3fv(U.uAcc, acc);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  };
  const frame = (now) => {
    raf = 0;
    const dt = last && now - last < 200 ? (now - last) / 1000 : 1 / 30; last = now; t += dt;
    focus += (focusT - focus) * (1 - Math.exp(-dt * 4));
    for (let i = 0; i < 3; i++) acc[i] += (tgt[i] - acc[i]) * (1 - Math.exp(-dt * 3));
    if (now - lastDraw > 32) { lastDraw = now; draw(); }                       // ~30 fps: la deriva es lenta
    if (visible && !document.hidden && !lost) raf = requestAnimationFrame(frame);
  };
  const wake = () => { if (!raf && visible && !document.hidden && !lost) { last = 0; raf = requestAnimationFrame(frame); } };
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) { read(); wake(); } }).observe(sec);
  addEventListener('scroll', () => visible && read(), { passive: true });
  addEventListener('resize', () => { resize(); read(); }, { passive: true });
  document.addEventListener('visibilitychange', wake);
  cv.addEventListener('webglcontextlost', (e) => { e.preventDefault(); lost = true; cancelAnimationFrame(raf); raf = 0; });
  resize(); read(); focus = focusT;
  return { destroy: () => { cancelAnimationFrame(raf); cv.remove(); } };
}
