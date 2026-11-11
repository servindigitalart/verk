// Instagram Graph API publisher (single image and carousel).
// Flow: container(s) → poll until FINISHED → media_publish. Nothing is published unless every
// container is FINISHED. media_publish is never retried blindly: an ambiguous failure
// (network/5xx) is reconciled against the account's recent media to avoid duplicates.
import { request, sleep, HttpError } from './http.mjs';

export function createInstagram({
  token, userId, version = 'v26.0', fetch = globalThis.fetch, wait = sleep,
  pollMs = 5000, maxPolls = 60, log = () => {},
}) {
  if (!token || !userId) throw new Error('instagram: faltan INSTAGRAM_ACCESS_TOKEN o INSTAGRAM_USER_ID');
  const base = `https://graph.facebook.com/${version}`;

  const call = (path, { method = 'GET', params, retries = 3 } = {}) =>
    request(fetch, `${base}${path}`, {
      method,
      headers: { Authorization: `Bearer ${token}`, ...(params && { 'Content-Type': 'application/x-www-form-urlencoded' }) },
      body: params ? new URLSearchParams(params).toString() : undefined,
    }, { retries, wait, label: `instagram ${method} ${path.split('?')[0]}` });

  async function createContainer(params) {
    const { id } = await call(`/${userId}/media`, { method: 'POST', params });
    if (!id) throw new Error('instagram: el contenedor no devolvió id');
    log(`contenedor ${id} creado`);
    return id;
  }

  async function waitFinished(id) {
    for (let i = 0; i < maxPolls; i++) {
      const { status_code: code, status } = await call(`/${id}?fields=status_code,status`);
      if (code === 'FINISHED') return;
      if (code === 'ERROR' || code === 'EXPIRED') {
        throw new HttpError(`instagram: contenedor ${id} en ${code}${status ? ` — ${status}` : ''}`, { code });
      }
      await wait(pollMs);
    }
    throw new HttpError(`instagram: contenedor ${id} no llegó a FINISHED`, { code: 'TIMEOUT' });
  }

  async function findPublished(caption, sinceMs) {
    const { data = [] } = await call(`/${userId}/media?fields=id,caption,timestamp&limit=10`);
    return data.find((m) => m.caption === caption && Date.parse(m.timestamp) >= sinceMs - 120_000)?.id ?? null;
  }

  async function publish(creationId, caption, startedAt) {
    try {
      const { id } = await call(`/${userId}/media_publish`, { method: 'POST', params: { creation_id: creationId }, retries: 0 });
      return id;
    } catch (e) {
      if (!e.network && e.status && e.status < 500) throw e; // definitive rejection → not published
      for (let i = 0; i < 3; i++) {
        await wait(pollMs * 2);
        const id = await findPublished(caption, startedAt);
        if (id) { log('publicación confirmada por conciliación'); return id; }
      }
      throw new HttpError('instagram: media_publish sin confirmación; no se reintenta para no duplicar', { code: 'UNCONFIRMED' });
    }
  }

  /** After media_publish: the post must exist with the expected type and children. Never throws (the post is
   *  already live; a throw here could lead a caller to publish again). */
  async function verify(mediaId, expectChildren) {
    try {
      const m = await call(`/${mediaId}?fields=id,media_type,permalink,timestamp,children{id}`);
      const children = m.children?.data?.length ?? 0;
      const ok = expectChildren ? m.media_type === 'CAROUSEL_ALBUM' && children === expectChildren : m.media_type === 'IMAGE';
      return { ok, mediaType: m.media_type, children, permalink: m.permalink ?? null, timestamp: m.timestamp ?? null };
    } catch (e) {
      return { ok: false, error: e.message };
    }
  }

  return {
    findPublished,
    verify,

    /** Free preflight: the token works and points at the expected account. */
    async account() {
      const { id, username } = await call(`/${userId}?fields=id,username`);
      return { id, username };
    },

    async publishSingle({ imageUrl, caption, dryRun = false, startedAt = Date.now() }) {
      const id = await createContainer({ image_url: imageUrl, caption });
      await waitFinished(id);
      if (dryRun) return { dryRun: true, containerIds: [id] };
      const mediaId = await publish(id, caption, startedAt);
      return { mediaId, containerIds: [id], verification: await verify(mediaId, 0) };
    },

    async publishCarousel({ imageUrls, caption, dryRun = false, startedAt = Date.now() }) {
      if (!Array.isArray(imageUrls) || imageUrls.length < 2 || imageUrls.length > 10) {
        throw new Error('instagram: un carrusel necesita de 2 a 10 imágenes');
      }
      const children = [];
      for (const url of imageUrls) children.push(await createContainer({ image_url: url, is_carousel_item: 'true' }));
      for (const id of children) await waitFinished(id); // any failure throws before the parent exists
      const parent = await createContainer({ media_type: 'CAROUSEL', children: children.join(','), caption });
      await waitFinished(parent);
      const containerIds = [...children, parent];
      if (dryRun) return { dryRun: true, containerIds };
      const mediaId = await publish(parent, caption, startedAt);
      return { mediaId, containerIds, verification: await verify(mediaId, children.length) };
    },
  };
}
