// Shared HTTP helper: JSON/binary responses, bounded retries on 429/5xx/network,
// errors that never contain credentials (tokens travel in headers/bodies, never URLs).

export class HttpError extends Error {
  constructor(message, { status = 0, code, body, retryable = false } = {}) {
    super(message);
    this.name = 'HttpError';
    this.status = status;
    this.code = code;
    this.body = body;
    this.retryable = retryable;
  }
}

export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function errorInfo(body) {
  const e = body?.error;
  if (!e) return { msg: typeof body === 'string' ? body.slice(0, 200) : '', code: undefined };
  if (typeof e === 'string') return { msg: body.error_description || e, code: e };
  return { msg: String(e.message ?? '').slice(0, 300), code: e.code ?? e.type ?? e.status };
}

/**
 * @param {typeof fetch} fetchFn
 * @param {{ retries?: number, wait?: (ms:number)=>Promise<void>, label?: string,
 *           as?: 'json'|'buffer', timeoutMs?: number,
 *           retryable?: (err: HttpError) => boolean }} opts
 */
export async function request(fetchFn, url, init = {}, opts = {}) {
  const { retries = 3, wait = sleep, label = 'request', as = 'json', timeoutMs = 120_000 } = opts;
  for (let attempt = 0; ; attempt++) {
    let err;
    try {
      const res = await fetchFn(url, { ...init, signal: AbortSignal.timeout(timeoutMs) });
      if (res.ok && as === 'buffer') return Buffer.from(await res.arrayBuffer());
      const text = await res.text();
      let body = text;
      try { body = text ? JSON.parse(text) : {}; } catch { /* plain text */ }
      if (res.ok) return body;
      const { msg, code } = errorInfo(body);
      err = new HttpError(`${label}: HTTP ${res.status}${code ? ` ${code}` : ''}${msg ? ` — ${msg}` : ''}`, {
        status: res.status, code, body, retryable: res.status === 429 || res.status >= 500,
      });
    } catch (e) {
      if (e instanceof HttpError) throw e;
      err = new HttpError(`${label}: ${e.name === 'TimeoutError' ? 'timeout' : 'network error'}`, { retryable: true });
      err.network = true;
    }
    if (opts.retryable) err.retryable = opts.retryable(err);
    if (!err.retryable || attempt >= retries) throw err;
    await wait(1000 * 2 ** attempt);
  }
}
