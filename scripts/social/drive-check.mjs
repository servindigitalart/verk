#!/usr/bin/env node
// E2 · Drive connection check (free Google APIs only; no OpenAI, no Instagram).
// Creates VERK Social/_pruebas/e2-<date>/, uploads a JPEG, verifies it, shares it by link, checks the anonymous
// download (real JPEG bytes, not HTML), removes the permission and checks anonymous access stops.
// Prints only check names and results (logs may be public): no tokens, no file ids.
//   node --env-file=.env scripts/social/drive-check.mjs
import { createHash } from 'node:crypto';
import sharp from 'sharp';
import { createDrive, publicUrl } from './drive.mjs';
import { parseLogoUse, applyLogo, TOKENS } from './logo.mjs';
import { checkImage } from './validate.mjs';

const env = process.env;
const SCOPE = 'https://www.googleapis.com/auth/drive.file';
const hash = (algo, b) => createHash(algo).update(b).digest('hex');
const isJpeg = (b) => b.length > 3 && b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff;
let failed = 0;
const check = (name, ok, info = '') => { if (!ok) failed++; console.log(`${ok ? 'ok  ' : 'FAIL'} ${name}${info ? ` — ${info}` : ''}`); };

async function anon(url) {
  const r = await fetch(url, { redirect: 'follow', signal: AbortSignal.timeout(30_000) });
  const b = Buffer.from(await r.arrayBuffer());
  return { status: r.status, host: new URL(r.url).host, type: r.headers.get('content-type') ?? '', bytes: b };
}

const t = await (await fetch('https://oauth2.googleapis.com/token', {
  method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  body: new URLSearchParams({ client_id: env.GOOGLE_OAUTH_CLIENT_ID ?? '', client_secret: env.GOOGLE_OAUTH_CLIENT_SECRET ?? '', refresh_token: env.GOOGLE_OAUTH_REFRESH_TOKEN ?? '', grant_type: 'refresh_token' }),
})).json();
check('refresh token válido', Boolean(t.access_token), t.error ?? '');
if (!t.access_token) process.exit(1);
check('scope concedido = solo drive.file', t.scope === SCOPE, t.scope);
const auth = { Authorization: `Bearer ${t.access_token}` };

const drive = createDrive({ clientId: env.GOOGLE_OAUTH_CLIENT_ID, clientSecret: env.GOOGLE_OAUTH_CLIENT_SECRET, refreshToken: env.GOOGLE_OAUTH_REFRESH_TOKEN, rootId: env.DRIVE_ROOT_FOLDER_ID || undefined });

const base = await sharp({ create: { width: 1080, height: 1350, channels: 3, background: TOKENS.cream } }).jpeg().toBuffer();
const { buffer: img } = await applyLogo(base, await parseLogoUse('wordmark, left edge at x 48, vertically centered at y 1257, 220 px wide, ink #0F0F0F'));
check('imagen de prueba válida para Instagram (JPEG 1080×1350, ≤ 8 MB)', (await checkImage(img)).length === 0);

const date = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
const folderId = await drive.ensurePath(['_pruebas', `e2-${date}`]);
const fileId = await drive.upload('e2-test.jpg', folderId, img, 'image/jpeg');
check('carpeta y subida', Boolean(folderId && fileId), `VERK Social/_pruebas/e2-${date}/e2-test.jpg`);

const meta = await (await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?fields=mimeType,size,md5Checksum`, { headers: auth })).json();
check('MIME en Drive = image/jpeg', meta.mimeType === 'image/jpeg', meta.mimeType);
check('tamaño en Drive = local', Number(meta.size) === img.length, `${meta.size} B`);
check('MD5 en Drive = local', meta.md5Checksum === hash('md5', img));

const dl = Buffer.from(await (await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`, { headers: auth })).arrayBuffer());
check('descarga autenticada idéntica (SHA-256)', hash('sha256', dl) === hash('sha256', img));

const url = publicUrl(fileId);
const before = await anon(url);
check('privado: sin acceso anónimo', !isJpeg(before.bytes), `${before.status} ${before.host} ${before.type.split(';')[0]}`);

const perm = await drive.share(fileId);
try {
  let pub;
  for (let i = 0; i < 4; i++) { pub = await anon(url); if (isJpeg(pub.bytes)) break; await new Promise((r) => setTimeout(r, 3000)); }
  check('compartido: descarga anónima con bytes JPEG reales', isJpeg(pub.bytes), `${pub.status} ${pub.host} ${pub.type}`);
  check('compartido: bytes idénticos (SHA-256)', hash('sha256', pub.bytes) === hash('sha256', img));
} finally {
  await drive.unshare(fileId, perm);
}
const after = await anon(url);
check('permiso retirado: sin acceso anónimo', !isJpeg(after.bytes), `${after.status} ${after.host} ${after.type.split(';')[0]}`);

console.log(failed ? `\n${failed} comprobación(es) fallida(s)` : '\nE2 Drive: todo correcto');
process.exitCode = failed ? 1 : 0;
