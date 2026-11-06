// VERK · biblioteca GLSL propia (portada de lab/f3-generative-experience/core/glsl.js).
// Cambios de producción: sin zonas de calma rectangulares ni sesgo de densidad hacia la marca (el campo cubre todo el
// hero) y con interacción cromática con la tipografía (TEXT + carga en el canal A del campo).

export const HEAD = `#version 300 es
precision highp float;
precision highp sampler2D;
in vec2 vUv;
`;

// Paleta oficial (doc 21 §7). El fondo es cream: nunca #FFF.
export const PALETTE = `
const vec3 CREAM = vec3(240., 238., 233.)/255.;
const vec3 VIOLET = vec3(107., 106., 244.)/255.;
const vec3 INK = vec3(15.)/255.;
const vec2 AXIS = vec2(.70710678, .70710678);   // eje de las barras del isotipo (abajo-izquierda → arriba-derecha), y hacia arriba
const vec2 NRM = vec2(-.70710678, .70710678);   // normal al eje
`;

// Ruido de gradiente 2D con derivadas analíticas (I. Quilez, «gradient noise derivatives»).
// La derivada exacta permite construir el curl de una función de corriente sin diferencias finitas.
export const NOISE = `
vec2 hash2(vec2 p){ p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3))); return -1. + 2.*fract(sin(p)*43758.5453123); }
// .x = valor, .yz = gradiente
vec3 noised(vec2 p){
  vec2 i = floor(p), f = fract(p);
  vec2 u = f*f*f*(f*(f*6. - 15.) + 10.), du = 30.*f*f*(f*(f - 2.) + 1.);   // quíntica: C2 continua, sin facetas en la derivada
  vec2 ga = hash2(i), gb = hash2(i + vec2(1, 0)), gc = hash2(i + vec2(0, 1)), gd = hash2(i + vec2(1, 1));
  float va = dot(ga, f), vb = dot(gb, f - vec2(1, 0)), vc = dot(gc, f - vec2(0, 1)), vd = dot(gd, f - vec2(1, 1));
  return vec3(va + u.x*(vb - va) + u.y*(vc - va) + u.x*u.y*(va - vb - vc + vd),
              ga + u.x*(gb - ga) + u.y*(gc - ga) + u.x*u.y*(ga - gb - gc + gd) + du*(u.yx*(va - vb - vc + vd) + vec2(vb, vc) - va));
}
float noise(vec2 p){ return noised(p).x; }
// fBm con rotación entre octavas (evita alineaciones de rejilla). .x valor, .yz gradiente acumulado (regla de la cadena).
const mat2 OCT = mat2(1.6, 1.2, -1.2, 1.6);
vec3 fbmd(vec2 p, int oct){
  float a = .5; vec3 s = vec3(0.); mat2 m = mat2(1.);
  for (int i = 0; i < 6; i++){ if (i >= oct) break; vec3 n = noised(p); s += a*vec3(n.x, transpose(m)*n.yz); p = OCT*p; m = OCT*m; a *= .5; }
  return s;
}
float fbm(vec2 p, int oct){ float a = .5, s = 0.; for (int i = 0; i < 6; i++){ if (i >= oct) break; s += a*noise(p); p = OCT*p; a *= .5; } return s; }
// Curl 2D de una función de corriente ψ: v = (∂ψ/∂y, −∂ψ/∂x). Sin divergencia por construcción (Bridson 2007).
vec2 curl(vec3 psi){ return vec2(psi.z, -psi.y); }
`;

// Marca oficial: un SDF por barra (canales R, G, B; A = unión) calculado en CPU desde los paths oficiales.
// Cada barra se lee desplazada por su traslación sobre el eje (respiración, entrada, ráfaga). Fuera de la textura
// se extrapola la distancia (corrección de F2 Presentation). p está en unidades de altura del lienzo.
export const MARK = `
uniform sampler2D uSdf; uniform vec2 uOff[3]; uniform vec3 uPres; uniform float uAspect;
vec4 sdfSamp(vec2 q){ vec2 k = vec2(uAspect, 1.), uv = q/k, c = clamp(uv, 0., 1.); return texture(uSdf, c) + length((uv - c)*k); }
vec3 sdfBars(vec2 p){
  return vec3(sdfSamp(p - uOff[0]).r + (1. - uPres.x)*.6, sdfSamp(p - uOff[1]).g + (1. - uPres.y)*.6, sdfSamp(p - uOff[2]).b + (1. - uPres.z)*.6);
}
float sdfMark(vec2 p){ vec3 d = sdfBars(p); return min(d.x, min(d.y, d.z)); }
`;

// Distancia con signo a los glifos del hero (text.js), en unidades de altura. >0 fuera, <0 dentro de la letra.
export const TEXT = `
uniform sampler2D uText;
float textDist(vec2 uv){ return texture(uText, uv).r; }
`;

// Composición halftone.
// Entrada: uField (RGBA) a baja resolución → R = tono, GB = desplazamiento del material (en p), A = carga cromática.
// La retícula a 45° se lee en coordenadas desplazadas por el material: los puntos viajan con él. Cada punto se estira
// en la dirección del flujo (anisotropía). Color: violeta de marca; las partículas cargadas por las letras, o justo
// detrás de ellas, se desplazan hacia un violeta luminoso y más claro (nunca otro tono: la identidad se conserva).
export const COMPOSITE = HEAD + PALETTE + MARK + TEXT + `
uniform sampler2D uField; uniform float uCell, uAniso, uGap, uDensity, uContrast;
uniform float uChroma, uChromaR, uChromaNear, uTextDensity, uLime;
out vec4 o;
const mat2 R45 = mat2(.70710678, .70710678, -.70710678, .70710678);
const vec3 LUMEN = vec3(146., 145., 252.)/255.;   // violeta luminoso (≈ #9291FC)
const vec3 LILAC = vec3(190., 189., 248.)/255.;   // violeta claro (≈ #BEBDF8): contraste ≥ 9:1 con el texto ink
const vec3 LIME = vec3(191., 234., 0.)/255.;      // modo lima (cursor sobre el isotipo)
const vec3 LIME_LUM = vec3(214., 242., 92.)/255.;
void main(){
  vec2 k = vec2(uAspect, 1.), p = vUv*k;
  vec2 disp = texture(uField, vUv).gb;
  vec2 q = p - disp;
  vec2 g = R45*q/uCell, id = floor(g) + .5, f = g - id;
  vec2 cq = transpose(R45)*(id*uCell);
  vec2 cp = cq + disp;
  vec4 F = texture(uField, cp/k);
  float tone = pow(clamp(F.r, 0., 1.), uContrast)*uDensity;
  tone *= smoothstep(uGap, uGap*2.4, sdfMark(cp));                       // margen limpio alrededor de la marca
  // tipografía: proximidad a la letra (forma del glifo, no su caja) + carga arrastrada por el fluido
  float td = textDist(cp/k);
  float near = 1. - smoothstep(0., uChromaR, td);
  float c = clamp(max(near*uChromaNear, clamp(F.a, 0., 1.)), 0., 1.)*uChroma;
  vec3 base = mix(VIOLET, LIME, uLime), lum = mix(LUMEN, LIME_LUM, uLime), pale = mix(LILAC, mix(LIME, CREAM, .45), uLime);
  vec3 ink = c < .5 ? mix(base, lum, c*2.) : mix(lum, pale, c*2. - 1.);
  tone *= mix(1., uTextDensity, near);
  vec2 v = F.gb; float sp = length(v)/uCell;
  vec2 dir = sp > 1e-4 ? normalize(R45*v) : vec2(1., 0.);
  float st = clamp(sp*uAniso, 0., .9);
  vec2 fl = vec2(dot(f, dir), dot(f, vec2(-dir.y, dir.x)));
  float dist = length(vec2(fl.x/(1. + st), fl.y*(1. + .4*st)));
  float r = sqrt(clamp(tone, 0., 1.))*.58/(1. + .25*st);
  float aa = max(length(fwidth(g))*.7, 1e-3);
  float cov = (1. - smoothstep(r - aa, r + aa, dist))*step(.002, tone);
  o = vec4(mix(CREAM, ink, cov), 1.);
}`;
