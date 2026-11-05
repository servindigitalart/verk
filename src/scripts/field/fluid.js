// VERK · Fluid Halftone (variante B de F3, aprobada). Simulación de fluido incompresible en GPU
// (Stam 1999 «Stable Fluids»; Harris 2004, GPU Gems cap. 38; vorticity confinement, Fedkiw 2001). Implementación propia.
//   · Velocidad a 128 px de alto (celdas cuadradas), tinte a 320 px. La pantalla nunca simula.
//   · La marca es un obstáculo sólido EN MOVIMIENTO: dentro de cada barra el fluido toma la velocidad de la barra,
//     así la respiración y la respuesta al cursor empujan el fluido de verdad (conexión isotipo ↔ campo).
//   · Fuerzas por barra, moduladas por su respiración: 1 remolino tangente · 2 chorro por su eje · 3 pulso radial.
//   · Tinte en dos canales: R = densidad (las partículas), G = carga cromática. Una partícula que atraviesa una
//     letra se carga (más si el fluido va rápido) y la carga viaja con ella y se disipa en `transition` segundos.
//   · Coste por frame: ~6 pasadas + N iteraciones de Jacobi a 128² y 3 pasadas a 320². N se adapta (24 → 12).
import { HEAD, PALETTE, NOISE, MARK, TEXT } from './glsl.js';

const SIM = HEAD + PALETTE + NOISE + MARK + `
uniform sampler2D uSrc; uniform vec2 uTexel; uniform float uDt, uTime;
out vec4 o;
vec2 P(vec2 uv){ return uv*vec2(uAspect, 1.); }
`;
const CURL = SIM + `
void main(){
  float L = texture(uSrc, vUv - vec2(uTexel.x, 0.)).y, R = texture(uSrc, vUv + vec2(uTexel.x, 0.)).y;
  float B = texture(uSrc, vUv - vec2(0., uTexel.y)).x, T = texture(uSrc, vUv + vec2(0., uTexel.y)).x;
  o = vec4(.5*(R - L - T + B)/uTexel.y, 0., 0., 1.);
}`;
// Fuerzas: vorticity confinement + viento de curl noise + barras + cursor + ráfaga + obstáculo móvil
const FORCE = SIM + `
uniform sampler2D uCurl; uniform float uConf, uWind, uCursor, uBurst, uBurstR, uE;
uniform vec3 uPtr, uBreath, uBarVel; uniform vec2 uPtrVel, uBurstAt;
void main(){
  vec2 v = texture(uSrc, vUv).xy, p = P(vUv);
  float cL = abs(texture(uCurl, vUv - vec2(uTexel.x, 0.)).x), cR = abs(texture(uCurl, vUv + vec2(uTexel.x, 0.)).x);
  float cB = abs(texture(uCurl, vUv - vec2(0., uTexel.y)).x), cT = abs(texture(uCurl, vUv + vec2(0., uTexel.y)).x);
  float c = texture(uCurl, vUv).x;
  vec2 N = vec2(cR - cL, cT - cB); N /= length(N) + 1e-5;
  v += uConf*vec2(N.y, -N.x)*c*uDt;
  v += curl(fbmd(p*1.25 + vec2(uTime*.04, 0.), 3))*uWind*uDt;

  vec3 d = sdfBars(p);
  vec3 dx = (sdfBars(p + vec2(uE, 0.)) - d)/uE, dy = (sdfBars(p + vec2(0., uE)) - d)/uE;
  vec2 g1 = vec2(dx.x, dy.x), g3 = vec2(dx.z, dy.z);
  v += vec2(-g1.y, g1.x)*exp(-max(d.x, 0.)/.035)*.9*(.3 + uBreath.x)*uDt;
  v += AXIS*exp(-max(d.y, 0.)/.03)*.8*(.3 + uBreath.y)*uDt;
  v += g3*sin(uTime*2.6)*exp(-max(d.z, 0.)/.04)*1.1*(.3 + uBreath.z)*uDt;
  // estela de las barras cuando se mueven (cursor/toque/ráfaga): arrastran el fluido cercano por su eje
  vec3 near = exp(-max(d, 0.)/.05);
  v += AXIS*dot(near, uBarVel)*6.*uDt;

  vec2 dc = p - uPtr.xy; float fc = exp(-dot(dc, dc)/.0022)*uPtr.z*uCursor;
  v += clamp(uPtrVel, -4., 4.)*fc*.9;
  vec2 db = p - uBurstAt; float rb = length(db);
  v += (db/(rb + 1e-4))*exp(-pow((rb - uBurstR)/.035, 2.))*uBurst*3.*uDt;

  float dm = min(d.x, min(d.y, d.z));
  if (dm < 0.) v = AXIS*(d.x < 0. ? uBarVel.x : d.y < 0. ? uBarVel.y : uBarVel.z);   // obstáculo móvil
  else if (dm < .012) { vec2 n = normalize(vec2(min(dx.x, min(dx.y, dx.z)), min(dy.x, min(dy.y, dy.z))) + 1e-6); float vn = dot(v, n); if (vn < 0.) v -= vn*n; }
  v /= max(1., length(v)/1.4);
  o = vec4(v, 0., 1.);
}`;
const DIV = SIM + `
void main(){
  float L = texture(uSrc, vUv - vec2(uTexel.x, 0.)).x, R = texture(uSrc, vUv + vec2(uTexel.x, 0.)).x;
  float B = texture(uSrc, vUv - vec2(0., uTexel.y)).y, T = texture(uSrc, vUv + vec2(0., uTexel.y)).y;
  o = vec4(.5*(R - L + T - B)/uTexel.y, 0., 0., 1.);
}`;
const JACOBI = SIM + `
uniform sampler2D uDiv;
void main(){
  float L = texture(uSrc, vUv - vec2(uTexel.x, 0.)).x, R = texture(uSrc, vUv + vec2(uTexel.x, 0.)).x;
  float B = texture(uSrc, vUv - vec2(0., uTexel.y)).x, T = texture(uSrc, vUv + vec2(0., uTexel.y)).x;
  o = vec4((L + R + B + T - texture(uDiv, vUv).x*uTexel.y*uTexel.y)*.25, 0., 0., 1.);
}`;
const SCALE = SIM + `uniform float uK; void main(){ o = texture(uSrc, vUv)*uK; }`;
const GRAD = SIM + `
uniform sampler2D uPressure;
void main(){
  float L = texture(uPressure, vUv - vec2(uTexel.x, 0.)).x, R = texture(uPressure, vUv + vec2(uTexel.x, 0.)).x;
  float B = texture(uPressure, vUv - vec2(0., uTexel.y)).x, T = texture(uPressure, vUv + vec2(0., uTexel.y)).x;
  vec2 v = texture(uSrc, vUv).xy - .5*vec2(R - L, T - B)/uTexel.y;
  if (sdfMark(P(vUv)) < 0.) v = vec2(0.);
  o = vec4(v, 0., 1.);
}`;
const ADVECT = SIM + `
uniform sampler2D uVel; uniform float uDiss;
void main(){
  vec2 back = vUv - uDt*texture(uVel, vUv).xy/vec2(uAspect, 1.);
  o = texture(uSrc, back)/(1. + uDiss*uDt);
}`;
// Tinte: fuentes (bordes de las barras, cursor, ráfaga) + relajación hacia un patrón fBm lento + carga tipográfica
const DYE = SIM + TEXT + `
uniform sampler2D uVel; uniform float uRelax, uBurst, uBurstR, uChargeR, uChargeRate, uChargeDecay;
uniform vec3 uPtr, uBreath, uBarVel; uniform vec2 uBurstAt;
void main(){
  vec2 p = P(vUv);
  vec2 s = texture(uSrc, vUv).xy; float c = s.x, q = s.y;
  vec3 d = sdfBars(p);
  vec3 z = (max(d, 0.) - .03)/.018; vec3 band = exp(-z*z);
  float edge = dot(band, (.35 + .65*uBreath)*(1. + 8.*abs(uBarVel)))*.9;   // las barras emiten más al moverse
  vec2 dc = p - uPtr.xy; float fc = exp(-dot(dc, dc)/.0018)*uPtr.z;
  float ring = exp(-pow((length(p - uBurstAt) - uBurstR)/.03, 2.))*uBurst;
  float base = smoothstep(-.18, .4, fbm(p*1.9 + vec2(uTime*.01, uTime*.015), 4));
  c += (edge*.9 + fc*1.6 + ring)*uDt*3.;
  c = mix(c, base*.8, uRelax*uDt);
  // carga: proporcional a la cercanía a la letra, a la densidad que pasa y a la velocidad del flujo
  float near = 1. - smoothstep(0., uChargeR, textDist(vUv));
  float sp = length(texture(uVel, vUv).xy);
  q += near*smoothstep(.05, .5, c)*(.45 + 2.2*sp)*uChargeRate*uDt;
  q *= exp(-uChargeDecay*uDt);
  o = vec4(clamp(c, 0., 1.4), clamp(q, 0., 1.), 0., 1.);
}`;
const PACK = SIM + `
uniform sampler2D uVel;
void main(){
  vec2 dye = texture(uSrc, vUv).xy; vec2 v = texture(uVel, vUv).xy;
  o = vec4(smoothstep(.06, .9, dye.x)*.8, v*.05, dye.y);
}`;
const INIT_DYE = SIM + `void main(){ vec2 p = P(vUv); o = vec4(smoothstep(-.18, .4, fbm(p*1.9, 4))*.8, 0., 0., 1.); }`;
const CLEAR = SIM + `void main(){ o = vec4(0.); }`;

export default {
  name: 'fluid',
  jacobi: 24,
  async init(ctx) {
    this.p = {};
    for (const [k, src] of Object.entries({ CURL, FORCE, DIV, JACOBI, SCALE, GRAD, ADVECT, DYE, PACK, INIT_DYE, CLEAR })) this.p[k] = await ctx.program(src);
    this.slowFrames = 0;
  },
  resize(ctx, env) {
    ['vel', 'dye', 'pres', 'div', 'curl', 'field'].forEach((k) => this[k]?.dispose());
    const sh = 128, sw = Math.round(sh * env.aspect), dh = 320, dw = Math.round(dh * env.aspect);
    this.vel = ctx.pingpong(sw, sh, { format: 'RG16F' });
    this.pres = ctx.pingpong(sw, sh, { format: 'R16F' });
    this.div = ctx.target(sw, sh, { format: 'R16F' });
    this.curl = ctx.target(sw, sh, { format: 'R16F' });
    this.dye = ctx.pingpong(dw, dh, { format: 'RG16F' });
    this.field = ctx.target(dw, dh, { format: 'RGBA16F' });
    this.reset(ctx, env);
    this.res = { sim: `${sw}×${sh}`, dye: `${dw}×${dh}` };
  },
  reset(ctx, env) {
    ctx.draw(this.p.CLEAR, {}, this.vel.read); ctx.draw(this.p.CLEAR, {}, this.pres.read);
    ctx.draw(this.p.INIT_DYE, { uAspect: env.aspect }, this.dye.read);
  },
  frame(ctx, env, dtIn) {
    const m = env.mark.st, M = env.markU(), C = env.cfg, ch = C.chroma;
    const dt = Math.min(dtIn, 1 / 30);
    if (dt > 0) {
      const common = { ...M, uDt: dt, uTime: env.time };
      const burst = { uBurst: m.burst ?? 0, uBurstR: Math.min(1.2, m.burstT * .5), uBurstAt: m.burstAt };
      ctx.draw(this.p.CURL, { ...common, uSrc: this.vel.read, uTexel: this.vel.texel }, this.curl);
      ctx.step(this.p.FORCE, this.vel, {
        ...common, ...burst, uCurl: this.curl, uConf: 2.5 / 128, uWind: .55, uCursor: C.cursor, uE: 1 / 128,
        uPtr: [m.ptr.x, m.ptr.y, m.ptr.on], uPtrVel: [m.ptr.vx, m.ptr.vy], uBreath: m.breath, uBarVel: m.barVel,
      });
      ctx.draw(this.p.DIV, { ...common, uSrc: this.vel.read, uTexel: this.vel.texel }, this.div);
      ctx.step(this.p.SCALE, this.pres, { uK: .8 });
      for (let i = 0; i < this.jacobi; i++) ctx.step(this.p.JACOBI, this.pres, { ...common, uDiv: this.div });
      ctx.step(this.p.GRAD, this.vel, { ...common, uPressure: this.pres.read });
      ctx.step(this.p.ADVECT, this.vel, { ...common, uVel: this.vel.read, uDiss: .25 });
      ctx.step(this.p.DYE, this.dye, {
        ...common, ...burst, uVel: this.vel.read, uRelax: .35, uPtr: [m.ptr.x, m.ptr.y, m.ptr.on * C.cursor], uBreath: m.breath, uBarVel: m.barVel,
        uText: env.textTex, uChargeR: ch.radius / env.H, uChargeRate: ch.response, uChargeDecay: 1 / Math.max(.05, ch.transition),
      });
      ctx.step(this.p.ADVECT, this.dye, { ...common, uVel: this.vel.read, uDiss: .04 });
      this.slowFrames = dtIn > .022 ? this.slowFrames + 1 : Math.max(0, this.slowFrames - 1);
      if (this.slowFrames > 30 && this.jacobi > 12) { this.jacobi = 12; this.slowFrames = 0; }
    }
    ctx.draw(this.p.PACK, { ...M, uSrc: this.dye.read, uVel: this.vel.read, uTexel: this.dye.texel }, this.field);
    return this.field;
  },
};
