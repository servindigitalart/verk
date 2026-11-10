// Google Drive storage with the owner's OAuth refresh token (scope drive.file: the app only
// sees files it created). Layout: VERK Social/AAAA/MM/AAAA-MM-DD/<slot>-<tipo>/…
import { request, sleep } from './http.mjs';

const API = 'https://www.googleapis.com/drive/v3';
const UPLOAD = 'https://www.googleapis.com/upload/drive/v3';
const FOLDER = 'application/vnd.google-apps.folder';

export const publicUrl = (id) => `https://drive.usercontent.google.com/download?id=${encodeURIComponent(id)}&export=download`;

export function createDrive({ clientId, clientSecret, refreshToken, rootId, fetch = globalThis.fetch, wait = sleep }) {
  if (!clientId || !clientSecret || !refreshToken) throw new Error('drive: faltan GOOGLE_OAUTH_CLIENT_ID, _SECRET o _REFRESH_TOKEN');
  let token, tokenExp = 0;

  async function auth() {
    if (token && Date.now() < tokenExp - 60_000) return token;
    const r = await request(fetch, 'https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ client_id: clientId, client_secret: clientSecret, refresh_token: refreshToken, grant_type: 'refresh_token' }).toString(),
    }, { wait, label: 'google token' });
    token = r.access_token;
    tokenExp = Date.now() + (r.expires_in ?? 3600) * 1000;
    return token;
  }

  const call = async (url, init = {}, opts = {}) => request(fetch, url, {
    ...init, headers: { Authorization: `Bearer ${await auth()}`, ...init.headers },
  }, { wait, label: `drive ${init.method ?? 'GET'}`, ...opts });

  const q = (s) => s.replace(/\\/g, '\\\\').replace(/'/g, "\\'");

  async function folder(name, parent) {
    const query = `name='${q(name)}' and '${q(parent)}' in parents and mimeType='${FOLDER}' and trashed=false`;
    const { files = [] } = await call(`${API}/files?q=${encodeURIComponent(query)}&fields=files(id)&pageSize=1`);
    if (files[0]) return files[0].id;
    const { id } = await call(`${API}/files?fields=id`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, mimeType: FOLDER, parents: [parent] }),
    });
    return id;
  }

  async function findFile(name, parent) {
    const query = `name='${q(name)}' and '${q(parent)}' in parents and trashed=false`;
    const { files = [] } = await call(`${API}/files?q=${encodeURIComponent(query)}&fields=files(id)&pageSize=1`);
    return files[0]?.id ?? null;
  }

  return {
    async ensurePath(parts) {
      let id = rootId || await folder('VERK Social', 'root');
      for (const p of parts) id = await folder(p, id);
      return id;
    },
    folder,
    findFile,

    async upload(name, parent, buffer, mimeType) {
      const boundary = `verk${crypto.randomUUID()}`;
      const body = Buffer.concat([
        Buffer.from(`--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n${JSON.stringify({ name, parents: [parent] })}\r\n--${boundary}\r\nContent-Type: ${mimeType}\r\n\r\n`),
        buffer,
        Buffer.from(`\r\n--${boundary}--`),
      ]);
      const { id } = await call(`${UPLOAD}/files?uploadType=multipart&fields=id`, {
        method: 'POST', headers: { 'Content-Type': `multipart/related; boundary=${boundary}` }, body,
      });
      return id;
    },

    async readJson(id) {
      return JSON.parse((await call(`${API}/files/${id}?alt=media`, {}, { as: 'buffer' })).toString('utf8'));
    },

    async writeJson(id, data) {
      await call(`${UPLOAD}/files/${id}?uploadType=media`, {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data, null, 2),
      });
    },

    /** Newest manifests first (drive.file only lists files this app created). */
    async recentManifests(limit = 12) {
      const query = `name='manifest.json' and trashed=false`;
      const { files = [] } = await call(`${API}/files?q=${encodeURIComponent(query)}&orderBy=createdTime desc&pageSize=${limit}&fields=files(id)`);
      const out = [];
      for (const f of files) { try { out.push(await this.readJson(f.id)); } catch { /* unreadable: skip */ } }
      return out;
    },

    async share(id) {
      const { id: permId } = await call(`${API}/files/${id}/permissions?fields=id`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ role: 'reader', type: 'anyone' }),
      });
      return permId;
    },

    async unshare(id, permId) {
      await call(`${API}/files/${id}/permissions/${permId}`, { method: 'DELETE' });
    },
  };
}
