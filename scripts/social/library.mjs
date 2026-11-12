// Runs docs/creative-prompts literally: extracts each PROMPT block, fills only the ENTRADA
// variables, and parses the fixed output formats of 01, 02 and 03. Captions use library copy only.
import { readFile } from 'node:fs/promises';

const DIR = new URL('../../docs/creative-prompts/', import.meta.url);

export async function readDoc(file) {
  return readFile(new URL(file, DIR), 'utf8');
}

/** A «## <heading>» section of a library document, verbatim (up to the next ## heading). */
export async function docSection(file, heading) {
  const md = await readDoc(file);
  const i = md.indexOf(`## ${heading}`);
  if (i < 0) throw new Error(`library: ${file} no tiene la sección «${heading}»`);
  const end = md.indexOf('\n## ', i + 3);
  return md.slice(i, end < 0 ? md.length : end).trim();
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

// Markdown the model may add around the fixed labels: bold (**, __) and inline code (`x`, never ``` fences).
const clean = (t) => t.replace(/\r/g, '').replace(/\*\*|__/g, '').replace(/(?<!`)`(?!`)/g, '');
const flat = (t) => t.replace(/\s+/g, ' ').trim();

// Quote styles accepted around approved copy. The content requirements do not change: the text must be quoted.
const QUOTES = [/«([^»]*)»/, /“([^”]*)”/, /"([^"]*)"/];

/** «…» / “…” / "…" → text (whitespace collapsed), «—» or — → null, absent/unquoted → undefined (invalid). */
export function quoted(v) {
  if (v == null) return undefined;
  for (const q of QUOTES) {
    const m = v.match(q);
    if (m) return flat(m[1]) === '—' ? null : flat(m[1]);
  }
  return v.trim().startsWith('—') ? null : undefined;
}

const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const SEP = '[ \\t]*[·•\\-–—|:][ \\t]*'; // «COPY · TITULAR», «COPY - TITULAR», «COPY — TITULAR», «COPY: TITULAR»…
const opens = (v) => (v.match(/[«“]/g) ?? []).length - (v.match(/[»”]/g) ?? []).length;

/**
 * Value of a «- LABEL: value» line of the fixed formats (02). Tolerates bullets (-, *, •), separator variants in
 * compound labels and a quoted value that continues on the next lines (a two-line headline).
 */
export function field(src, label) {
  const re = new RegExp(`^[ \\t]*[-*•]?[ \\t]*${label.split(' · ').map(esc).join(SEP)}[ \\t]*:?[ \\t]*(.*)$`, 'mi');
  const m = re.exec(src);
  if (!m) return undefined;
  let v = m[1];
  const next = src.slice(m.index + m[0].length).split('\n').slice(1, 4);
  for (const l of next) { if (opens(v) <= 0) break; v += ` ${l.trim()}`; }
  return v.trim();
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
  // «Label: «…»» with «», “” or "" quotes; the quoted text may span lines (whitespace is collapsed).
  const get = (label, flags = 'i') => {
    const m = c.match(new RegExp(`${label}:?\\s*(?:«([^»]+)»|“([^”]+)”|"([^"]+)")`, flags));
    return m ? flat(m[1] ?? m[2] ?? m[3]) : null;
  };
  const copy = {
    etiqueta: get('Etiqueta'),
    titular: get('Titular'),
    secundario: get('Texto secundario'),
    cta: get('CTA', ''),
    microcopy: get('microcopy'),
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
  const top = t.split(/^#{1,4}\s*SLIDES\s*$/m)[0];
  const line = field;
  const total = Number(line(top, 'NÚMERO DE SLIDES')?.match(/\d+/)?.[0]);
  const hook = quoted(line(top, 'HOOK'));
  const cta = quoted(line(top, 'CTA'));
  if (!(total >= 4 && total <= 8)) throw new Error('02: NÚMERO DE SLIDES fuera de 4–8');
  if (!hook) throw new Error('02: HOOK sin «…»');
  if (cta === undefined) throw new Error('02: CTA sin «…» ni «—»');

  const parts = t.split(/^#{0,4}\s*SLIDE\s+(\d+)\s*\/\s*(\d+)\s*$/m);
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
  // 06 §1 regla 1 / 04 §4: dos slides contiguos nunca comparten superficie.
  const hexOf = (t) => t?.match(/#[0-9a-f]{6}\b/i)?.[0].toUpperCase();
  for (let i = 1; i < slides.length; i++) {
    const [a, b] = [hexOf(slides[i - 1].superficie), hexOf(slides[i].superficie)];
    if (a && a === b) throw new Error(`02: los slides ${i} y ${i + 1} comparten superficie ${a}`);
  }
  return { tema: line(top, 'TEMA') ?? null, hook, cta, total, slides };
}

// ── 03 · segmenter output, checked against the master (03's verification table, in code) ──
export function parseSegmented(raw, master) {
  const blocks = [...clean(raw).matchAll(/```[a-z]*\n([\s\S]*?)```/g)].map((m) => m[1].trim())
    .filter((b) => b.startsWith('▶ ADJUNTAR AL GENERADOR:'));
  const byN = new Map();
  for (const b of blocks) {
    const m = b.match(/·\s*SLIDE\s*(\d+)\s*\/\s*(\d+)/);
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
    for (const [k, v] of Object.entries(s.copy)) if (v && !flat(p).includes(v)) problems.push(`copy «${k}» no es literal`);
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
