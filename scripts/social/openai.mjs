// OpenAI: model preflight, image generation/edit, Responses (text and vision) and usage → USD.
import { request, sleep } from './http.mjs';

// USD per 1M tokens, from developers.openai.com/api/docs/pricing (checked 2026-11-10).
export const PRICES_DATE = '2026-11-10';
export const PRICES = {
  'gpt-image-2.6-sunburst': { text: 5, image: 8, cachedImage: 2, output: 30 },
  'gpt-image-2.6-flare': { text: 5, image: 8, cachedImage: 2, output: 30 },
  'gpt-6.1-sol': { input: 2, cached: 0.1, output: 10 },
  'gpt-6.1-terra': { input: 1, cached: 0.05, output: 5 },
};

/** Cost in USD for one call, or null when the model has no price entry (tokens are still recorded). */
export function costUsd(model, u = {}) {
  const p = PRICES[model];
  if (!p) return null;
  const M = 1e6;
  if (p.image != null) {
    const d = u.input_tokens_details ?? {};
    const cached = d.cached_tokens ?? 0;
    const image = Math.max(0, (d.image_tokens ?? 0) - cached);
    const text = d.text_tokens ?? Math.max(0, (u.input_tokens ?? 0) - (d.image_tokens ?? 0));
    return (text * p.text + image * p.image + cached * p.cachedImage + (u.output_tokens ?? 0) * p.output) / M;
  }
  const cached = u.input_tokens_details?.cached_tokens ?? 0;
  return (((u.input_tokens ?? 0) - cached) * p.input + cached * p.cached + (u.output_tokens ?? 0) * p.output) / M;
}

// A spend-limit / quota 429 will not clear by retrying.
const FATAL = new Set(['organization_spend_limit_exceeded', 'project_spend_limit_exceeded', 'insufficient_quota', 'billing_hard_limit_reached']);

export function createOpenAI({ apiKey, fetch = globalThis.fetch, wait = sleep, onUsage = () => {} }) {
  if (!apiKey) throw new Error('openai: falta OPENAI_API_KEY');
  const call = (path, body, opts = {}) => request(fetch, `https://api.openai.com/v1${path}`, {
    method: body ? 'POST' : 'GET',
    headers: { Authorization: `Bearer ${apiKey}`, ...(body && { 'Content-Type': 'application/json' }) },
    body: body ? JSON.stringify(body) : undefined,
  }, { wait, label: `openai ${path.split('/').slice(0, 3).join('/')}`, retryable: (e) => e.retryable && !FATAL.has(e.code), ...opts });

  const record = (step, model, usage) => {
    onUsage({ step, model, usage: usage ?? null, costUsd: usage ? costUsd(model, usage) : null });
  };

  async function image(step, path, body) {
    const r = await call(path, body, { timeoutMs: 600_000, retries: 2 });
    record(step, body.model, r.usage);
    const b64 = r.data?.[0]?.b64_json;
    if (!b64) throw new Error(`openai: ${path} no devolvió imagen`);
    return Buffer.from(b64, 'base64');
  }

  return {
    /** Free check: every model id must exist for this key, or nothing paid runs. */
    async preflight(models) {
      for (const m of models) {
        try { await call(`/models/${encodeURIComponent(m)}`, undefined, { retries: 1 }); }
        catch (e) { throw new Error(`openai: el modelo «${m}» no está disponible para esta clave (${e.status || e.message})`); }
      }
    },

    /** prompt literal + reference PNGs (Buffers). No references → /images/generations. */
    generateImage({ step, model, prompt, references = [], size = '1088x1360', quality = 'high' }) {
      const base = { model, prompt, size, quality, output_format: 'jpeg', n: 1 };
      return references.length
        ? image(step, '/images/edits', { ...base, images: references.map((b) => ({ image_url: `data:image/png;base64,${b.toString('base64')}` })) })
        : image(step, '/images/generations', base);
    },

    /** Responses API. `schema` → structured JSON output (parsed). `image` → JPEG Buffer for vision;
     *  `references` → extra PNG Buffers sent after it (e.g. the official logo files). */
    async respond({ step, model, text, image: img, references = [], schema, effort }) {
      const content = [{ type: 'input_text', text }];
      if (img) content.push({ type: 'input_image', image_url: `data:image/jpeg;base64,${img.toString('base64')}` });
      for (const r of references) content.push({ type: 'input_image', image_url: `data:image/png;base64,${r.toString('base64')}` });
      const r = await call('/responses', {
        model,
        input: [{ role: 'user', content }],
        ...(effort && { reasoning: { effort } }),
        ...(schema && { text: { format: { type: 'json_schema', name: 'out', schema, strict: true } } }),
      }, { timeoutMs: 600_000, retries: 2 });
      record(step, model, r.usage);
      const out = (r.output ?? []).flatMap((o) => o.content ?? []).filter((c) => c.type === 'output_text').map((c) => c.text).join('');
      if (!out) throw new Error(`openai: ${step} sin texto de salida (${r.status ?? 'sin estado'})`);
      return schema ? JSON.parse(out) : out;
    },
  };
}
