// VERK · capa WebGL2 propia, sin dependencias. Portada de lab/f3-generative-experience/core/gl.js (sin cambios de comportamiento).
// Todo se crea dentro de `init()` de cada escena, de modo que restaurar el contexto = volver a llamar a `init()`.

const BPP = { RGBA32F: 16, RG32F: 8, R32F: 4, RGBA16F: 8, RG16F: 4, R16F: 2, RGBA8: 4 };

export function createGL(canvas) {
  const gl = canvas.getContext('webgl2', { antialias: false, alpha: false, depth: false, stencil: false, premultipliedAlpha: false, powerPreference: 'default' });
  if (!gl) return null;
  const ctx = { gl, canvas, ext: {}, targets: new Set(), lost: false };

  ctx.reset = () => {
    // extensiones y geometría: se repite tras restaurar el contexto
    ctx.ext = {
      colorFloat: gl.getExtension('EXT_color_buffer_float'),       // render a R16F/RG16F/RGBA16F y 32F
      floatLinear: gl.getExtension('OES_texture_float_linear'),    // filtrado lineal de texturas 32F
      parallel: gl.getExtension('KHR_parallel_shader_compile'),
      timer: gl.getExtension('EXT_disjoint_timer_query_webgl2'),
      lose: gl.getExtension('WEBGL_lose_context'),
    };
    ctx.targets.clear(); ctx.warm = null;
    const vao = gl.createVertexArray(); gl.bindVertexArray(vao);
    const b = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, b);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW); // un triángulo cubre la pantalla
    gl.enableVertexAttribArray(0); gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    gl.disable(gl.DEPTH_TEST); gl.disable(gl.BLEND);
  };
  ctx.reset();

  // ── programas ──
  // Compilación sin bloquear: con KHR_parallel_shader_compile se espera COMPLETION_STATUS (F2 medía ~0.6 s bloqueado sin ella).
  ctx.program = async (fs, vs = VS) => {
    const sh = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); return s; };
    const p = gl.createProgram(), a = sh(gl.VERTEX_SHADER, vs), f = sh(gl.FRAGMENT_SHADER, fs);
    gl.attachShader(p, a); gl.attachShader(p, f); gl.bindAttribLocation(p, 0, 'aPos'); gl.linkProgram(p);
    if (ctx.ext.parallel) while (!gl.isContextLost() && !gl.getProgramParameter(p, ctx.ext.parallel.COMPLETION_STATUS_KHR)) await new Promise((r) => setTimeout(r, 8));
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
      const log = gl.getShaderInfoLog(f) || gl.getShaderInfoLog(a) || gl.getProgramInfoLog(p);
      throw new Error(`shader: ${log}\n${numbered(fs, log)}`);
    }
    const u = {};
    for (let i = 0, n = gl.getProgramParameter(p, gl.ACTIVE_UNIFORMS); i < n; i++) {
      const info = gl.getActiveUniform(p, i);
      u[info.name.replace(/\[0\]$/, '')] = { loc: gl.getUniformLocation(p, info.name), type: info.type, size: info.size };
    }
    // Sin la extensión, el driver compila de verdad en el primer uso y el hilo principal espera al GPU en la siguiente
    // llamada síncrona (medido: ~750 ms en UNA tarea para los 12 programas del fluido). Se fuerza aquí la compilación
    // de este programa con un dibujo de 1 px + lectura, y se cede el hilo: una tarea corta por programa.
    if (!ctx.ext.parallel) {
      ctx.warm ??= (() => { const t = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, t); gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, null); const fb = gl.createFramebuffer(); gl.bindFramebuffer(gl.FRAMEBUFFER, fb); gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, t, 0); return fb; })();
      gl.bindFramebuffer(gl.FRAMEBUFFER, ctx.warm); gl.viewport(0, 0, 1, 1); gl.useProgram(p); gl.drawArrays(gl.TRIANGLES, 0, 3);
      gl.readPixels(0, 0, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array(4)); gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    }
    await new Promise((r) => setTimeout(r, 0));
    return { p, u };
  };

  // Uniforms por tipo reflejado: el llamador pasa números, arrays o render targets, sin declarar tipos dos veces.
  const setUniforms = (prog, values) => {
    let unit = 0;
    for (const k in values) {
      const u = prog.u[k], v = values[k];
      if (!u || v === undefined) continue;
      switch (u.type) {
        case gl.FLOAT: u.size > 1 ? gl.uniform1fv(u.loc, v) : gl.uniform1f(u.loc, v); break;
        case gl.FLOAT_VEC2: gl.uniform2fv(u.loc, v); break;
        case gl.FLOAT_VEC3: gl.uniform3fv(u.loc, v); break;
        case gl.FLOAT_VEC4: gl.uniform4fv(u.loc, v); break;
        case gl.INT: case gl.BOOL: gl.uniform1i(u.loc, v); break;
        case gl.SAMPLER_2D:
          gl.activeTexture(gl.TEXTURE0 + unit); gl.bindTexture(gl.TEXTURE_2D, v.tex ?? v); gl.uniform1i(u.loc, unit++); break;
        default: throw new Error(`uniform ${k}: tipo ${u.type} no soportado`);
      }
    }
  };

  // ── texturas y render targets ──
  const FMT = () => ({
    RGBA32F: [gl.RGBA32F, gl.RGBA, gl.FLOAT], RG32F: [gl.RG32F, gl.RG, gl.FLOAT], R32F: [gl.R32F, gl.RED, gl.FLOAT],
    RGBA16F: [gl.RGBA16F, gl.RGBA, gl.HALF_FLOAT], RG16F: [gl.RG16F, gl.RG, gl.HALF_FLOAT], R16F: [gl.R16F, gl.RED, gl.HALF_FLOAT],
    RGBA8: [gl.RGBA8, gl.RGBA, gl.UNSIGNED_BYTE],
  });
  ctx.texture = (w, h, { format = 'RGBA16F', filter = 'linear', data = null } = {}) => {
    const [internal, fmt, type] = FMT()[format];
    const tex = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, tex);
    const f = filter === 'linear' ? gl.LINEAR : gl.NEAREST;
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, f); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, f);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    // Los datos Float32Array se aceptan también para formatos 16F (WebGL2 convierte al subir)
    gl.texImage2D(gl.TEXTURE_2D, 0, internal, w, h, 0, fmt, data && type === gl.HALF_FLOAT ? gl.FLOAT : type, data);
    return { tex, w, h, format, bytes: w * h * BPP[format] };
  };
  ctx.target = (w, h, opts = {}) => {
    const t = ctx.texture(w, h, opts);
    t.fbo = gl.createFramebuffer(); gl.bindFramebuffer(gl.FRAMEBUFFER, t.fbo);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, t.tex, 0);
    t.ok = gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE;
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    if (!t.ok) throw new Error(`render target ${opts.format ?? 'RGBA16F'} ${w}×${h} no soportado`);
    t.texel = [1 / w, 1 / h];
    t.dispose = () => { gl.deleteTexture(t.tex); gl.deleteFramebuffer(t.fbo); ctx.targets.delete(t); };
    ctx.targets.add(t);
    return t;
  };
  // Ping-pong: se lee de `read` y se escribe en `write`; swap() intercambia. Base de toda simulación iterativa.
  ctx.pingpong = (w, h, opts = {}) => {
    const pp = { read: ctx.target(w, h, opts), write: ctx.target(w, h, opts), w, h };
    pp.texel = pp.read.texel;
    pp.swap = () => { [pp.read, pp.write] = [pp.write, pp.read]; };
    pp.dispose = () => { pp.read.dispose(); pp.write.dispose(); };
    return pp;
  };

  // ── dibujo: un triángulo a pantalla completa hacia un target (o la pantalla) ──
  ctx.draw = (prog, uniforms, target = null) => {
    gl.bindFramebuffer(gl.FRAMEBUFFER, target ? target.fbo : null);
    gl.viewport(0, 0, target ? target.w : canvas.width, target ? target.h : canvas.height);
    gl.useProgram(prog.p); setUniforms(prog, uniforms);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  };
  // Atajo para un paso de ping-pong: escribe en `write` leyendo de `read` (bajo el nombre `src`) y alterna.
  ctx.step = (prog, pp, uniforms = {}) => { ctx.draw(prog, { ...uniforms, uSrc: pp.read, uTexel: pp.texel }, pp.write); pp.swap(); };

  ctx.memory = () => { let b = 0; for (const t of ctx.targets) b += t.bytes; return b; };
  return ctx;
}

// Vértice común: el triángulo a pantalla completa y uv en [0,1]
export const VS = `#version 300 es
layout(location = 0) in vec2 aPos; out vec2 vUv;
void main(){ vUv = aPos*.5 + .5; gl_Position = vec4(aPos, 0., 1.); }`;

function numbered(src, log) {
  const line = Number(/ERROR: \d+:(\d+)/.exec(log)?.[1]);
  if (!line) return '';
  return src.split('\n').slice(Math.max(0, line - 3), line + 2).map((l, i) => `${Math.max(1, line - 2) + i}: ${l}`).join('\n');
}
