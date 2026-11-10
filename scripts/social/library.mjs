// Runs docs/creative-prompts literally: extracts each PROMPT block, fills only the ENTRADA
// variables, and parses the fixed output formats of 01, 02 and 03. Captions use library copy only.
import { readFile } from 'node:fs/promises';

const DIR = new URL('../../docs/creative-prompts/', import.meta.url);

export async function readDoc(file) {
  return readFile(new URL(file, DIR), 'utf8');
}

export async function loadPrompt(file) {
  const m = (await readDoc(file)).match(/## PROMPT[^\n]*\n+```text\n([\s\S]*?)\n```/);
  if (!m) throw new Error(`library: ${file} no tiene bloque PROMPT`);
  return m[1];
}

/** Replaces the {{…}} of ENTRADA lines «KEY…: {{…}}» only; the rest of the prompt stays byte-identical. */
export function fill(template, vars) {
  const seen = new Set();
  const out = template.split('\n').map((line) => {
    for (const [key, val] of Object.entries(vars)) {
      if (line.startsWith(key) && /^[^:{]*:\s*\{\{[^}]*\}\}\s*$/.test(line)) {
        seen.add(key);
        return line.replace(/\{\{[^}]*\}\}/, () => val ?? '');
      }
    }
    return line;
  }).join('\n');
  for (const key of Object.keys(vars)) if (!seen.has(key)) throw new Error(`library: la variable ${key} no está en el prompt`);
  return out;
}

export function fillMaster(segmenter, masterText) {
  if (!segmenter.includes('{{DOCUMENTO_MAESTRO}}')) throw new Error('library: 03 sin {{DOCUMENTO_MAESTRO}}');
  return segmenter.replace('{{DOCUMENTO_MAESTRO}}', () => masterText);
}

const clean = (t) => t.replace(/\r/g, '').replace(/\*\*/g, '');

/** «…» → text, «—» or — → null, absent/unquoted → undefined (invalid). */
export function quoted(v) {
  if (v == null) return undefined;
  const m = v.match(/«([^»]*)»/);
  if (m) return m[1].trim() === '—' ? null : m[1].trim();
  return v.trim().startsWith('—') ? null : undefined;
}

const attachLine = (prompt) => prompt.match(/^▶ ADJUNTAR AL GENERADOR:\s*(.*)$/m)?.[1].trim();

// ── 01 · individual ────────────────────────────────────────────────────────
export function parseIndividual(raw) {
  const t = clean(raw);
  const heads = [...t.matchAll(/^[#>\s-]*([1-7])\s*·\s*(LECTURA|CONCEPTO|COPY FINAL|DIRECCIÓN DE ARTE|PROMPT VISUAL FINAL|REFERENCIAS|CONTROL)/gm)];
  const sec = (n) => {
    const i = heads.findIndex((h) => h[1] === String(n));
    if (i < 0) throw new Error(`01: falta la sección ${n}`);
    return t.slice(heads[i].index, heads[i + 1]?.index ?? t.length);
  };
  const c = sec(3);
  const get = (re) => c.match(re)?.[1].trim() ?? null;
  const copy = {
    etiqueta: get(/Etiqueta:\s*«([^»]+)»/i),
    titular: get(/Titular:\s*«([^»]+)»/i),
    secundario: get(/Texto secundario:\s*«([^»]+)»/i),
    cta: get(/CTA:\s*«([^»]+)»/),
    microcopy: get(/microcopy:?\s*«([^»]+)»/i),
  };
  for (const k of ['etiqueta', 'titular', 'secundario']) if (!copy[k]) throw new Error(`01: falta el copy «${k}»`);
  if (copy.microcopy && !copy.cta) throw new Error('01: microcopy sin CTA');

  const s5 = sec(5);
  const fenced = s5.match(/```[a-z]*\n([\s\S]*?)```/);
  const body = fenced ? fenced[1] : s5.split('\n').slice(1).join('\n');
  const start = body.indexOf('▶ ADJUNTAR AL GENERADOR:');
  if (start < 0) throw new Error('01: el prompt visual no empieza con «▶ ADJUNTAR AL GENERADOR»');
  const prompt = body.slice(start).trim();
  for (const must of ['VERK BRAND RULES', 'LOGO REFERENCE', 'ATTACHED FOR THIS IMAGE:', 'USE IN THIS IMAGE:']) {
    if (!prompt.includes(must)) throw new Error(`01: al prompt visual le falta «${must}»`);
  }
  const s4 = sec(4);
  return {
    copy,
    territorio: s4.match(/Territorio:\s*([^\n·]+)/i)?.[1].trim() ?? null,
    superficie: s4.match(/Superficie:\s*([^\n·]+)/i)?.[1].trim() ?? null,
    prompt,
    attach: attachLine(prompt),
    logoUse: prompt.match(/^USE IN THIS IMAGE:\s*(.+)$/m)[1].trim(),
  };
}

// ── 02 · carousel master ───────────────────────────────────────────────────
export function parseMaster(raw) {
  const t = clean(raw);
  const top = t.split(/^##\s*SLIDES\s*$/m)[0];
  const line = (src, label) => src.match(new RegExp(`^-\\s*${label}:[ \\t]*(.*)$`, 'm'))?.[1].trim();
  const total = Number(line(top, 'NÚMERO DE SLIDES')?.match(/\d+/)?.[0]);
  const hook = quoted(line(top, 'HOOK'));
  const cta = quoted(line(top, 'CTA'));
  if (!(total >= 4 && total <= 8)) throw new Error('02: NÚMERO DE SLIDES fuera de 4–8');
  if (!hook) throw new Error('02: HOOK sin «…»');
  if (cta === undefined) throw new Error('02: CTA sin «…» ni «—»');

  const parts = t.split(/^###\s*SLIDE\s+(\d+)\s*\/\s*(\d+)\s*$/m);
  const slides = [];
  for (let i = 1; i < parts.length; i += 3) {
    const n = Number(parts[i]); const body = parts[i + 2].split(/^##\s/m)[0];
    if (Number(parts[i + 1]) !== total) throw new Error(`02: SLIDE ${n} declara un total distinto`);
    const copy = {
      etiqueta: quoted(line(body, 'COPY · ETIQUETA')),
      titular: quoted(line(body, 'COPY · TITULAR')),
      secundario: quoted(line(body, 'COPY · TEXTO SECUNDARIO')),
      microcopy: quoted(line(body, 'COPY · MICROCOPY')),
      cta: quoted(line(body, 'COPY · CTA')),
    };
    for (const [k, v] of Object.entries(copy)) if (v === undefined) throw new Error(`02: SLIDE ${n} sin COPY · ${k} válido`);
    if (!copy.titular || !copy.etiqueta) throw new Error(`02: SLIDE ${n} sin titular o etiqueta`);
    const attach = line(body, 'LOGO · ADJUNTAR'); const logoUse = line(body, 'LOGO · USO');
    if (!attach || !logoUse) throw new Error(`02: SLIDE ${n} sin LOGO · ADJUNTAR o LOGO · USO`);
    slides.push({ n, copy, attach, logoUse, territorio: line(body, 'TERRITORIO') ?? null, superficie: line(body, 'SUPERFICIE') ?? null });
  }
  if (slides.length !== total || slides.some((s, i) => s.n !== i + 1)) throw new Error(`02: se esperaban los slides 1…${total} en orden`);
  if (slides.slice(0, -1).some((s) => s.copy.cta)) throw new Error('02: CTA fuera del último slide');
  if (cta && slides.at(-1).copy.cta !== cta) throw new Error('02: el CTA del último slide no coincide con B · CTA');
  return { tema: line(top, 'TEMA') ?? null, hook, cta, total, slides };
}

// ── 03 · segmenter output, checked against the master (03's verification table, in code) ──
export function parseSegmented(raw, master) {
  const blocks = [...clean(raw).matchAll(/```[a-z]*\n([\s\S]*?)```/g)].map((m) => m[1].trim())
    .filter((b) => b.startsWith('▶ ADJUNTAR AL GENERADOR:'));
  const byN = new Map();
  for (const b of blocks) {
    const m = b.match(/· SLIDE (\d+) \/ (\d+)/);
    if (!m || Number(m[2]) !== master.total || byN.has(Number(m[1]))) throw new Error('03: bloque sin numeración válida o duplicado');
    byN.set(Number(m[1]), b);
  }
  return master.slides.map((s) => {
    const p = byN.get(s.n);
    if (!p) throw new Error(`03: falta el prompt del slide ${s.n}`);
    const none = /^ninguno\b/i.test(s.attach);
    const problems = [];
    if (attachLine(p) !== s.attach) problems.push('▶ ADJUNTAR no es literal');
    if (!p.includes(`ATTACHED FOR THIS IMAGE: ${none ? 'none — do not draw any logo in this image' : s.attach}`)) problems.push('ATTACHED no es literal');
    if (!p.includes(`USE IN THIS IMAGE: ${s.logoUse}`)) problems.push('USE IN THIS IMAGE no es literal');
    for (const [k, v] of Object.entries(s.copy)) if (v && !p.includes(v)) problems.push(`copy «${k}» no es literal`);
    if (p.includes('NO ESPECIFICADO EN EL MAESTRO')) problems.push('campos NO ESPECIFICADO');
    if (problems.length) throw new Error(`03: slide ${s.n}: ${problems.join('; ')}`);
    return p;
  });
}

// ── Captions: only approved library copy, no hashtags, no new words ────────
/** 01 has no caption field: the piece's own copy, in reading order. */
export function captionIndividual(copy) {
  return [copy.titular, copy.secundario, copy.cta && [copy.cta, copy.microcopy].filter(Boolean).join(' · ')]
    .filter(Boolean).join('\n\n');
}

/** 04 §5: «El texto del post sale del maestro (B · HOOK / CTA)». */
export function captionCarousel(master) {
  const last = master.slides.at(-1).copy;
  return [master.hook, master.cta && [master.cta, last.cta && last.microcopy].filter(Boolean).join(' · ')]
    .filter(Boolean).join('\n\n');
}

/** Texts that must appear in the image, as in the approved copy. */
export const expectedTexts = (copy) => Object.values(copy).filter(Boolean);
