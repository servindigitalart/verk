#!/usr/bin/env node
// One-time, local: obtains the Google Drive refresh token (scope drive.file only) for the existing
// Web OAuth client, with authorization code + PKCE (S256) + random state, and writes it into the
// local, git-ignored .env (mode 0600). It never prints or logs the token.
//   node --env-file=.env scripts/social/auth-google.mjs
// The redirect URI must be registered exactly in the Web client («Authorized redirect URIs»).
import http from 'node:http';
import { execFile } from 'node:child_process';
import { randomBytes, createHash } from 'node:crypto';
import { readFile, writeFile, rename, chmod } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const ENV = fileURLToPath(new URL('../../.env', import.meta.url));
const SCOPE = 'https://www.googleapis.com/auth/drive.file';
const TIMEOUT_MS = 5 * 60_000;
const KEY = 'GOOGLE_OAUTH_REFRESH_TOKEN';

const { GOOGLE_OAUTH_CLIENT_ID: id, GOOGLE_OAUTH_CLIENT_SECRET: secret } = process.env;
const redirect = process.env.GOOGLE_OAUTH_REDIRECT_URI || 'http://localhost:8765/oauth2callback';

function fail(msg) {
  console.error(`error: ${msg}`);
  process.exit(1);
}

if (!id || !secret) fail('define GOOGLE_OAUTH_CLIENT_ID y GOOGLE_OAUTH_CLIENT_SECRET en .env');
const cb = new URL(redirect);
if (cb.protocol !== 'http:' || !['localhost', '127.0.0.1'].includes(cb.hostname) || !cb.port) {
  fail('GOOGLE_OAUTH_REDIRECT_URI debe ser http://localhost:<puerto>/<ruta> (o 127.0.0.1)');
}

const b64url = (b) => b.toString('base64url');
const verifier = b64url(randomBytes(32));
const state = b64url(randomBytes(16));

/** Replaces or appends KEY in .env atomically (temp file + rename), mode 0600. */
async function saveToken(token) {
  let env = '';
  try { env = await readFile(ENV, 'utf8'); } catch (e) { if (e.code !== 'ENOENT') throw e; }
  const line = `${KEY}=${token}`;
  const re = new RegExp(`^${KEY}=.*$`, 'm');
  env = re.test(env) ? env.replace(re, () => line) : `${env}${env && !env.endsWith('\n') ? '\n' : ''}${line}\n`;
  const tmp = `${ENV}.tmp-${process.pid}`;
  await writeFile(tmp, env, { mode: 0o600 });
  await rename(tmp, ENV);
  await chmod(ENV, 0o600);
}

let done = false;
async function handle(req, res) {
  const url = new URL(req.url, redirect);
  if (url.pathname !== cb.pathname || done) return res.writeHead(404).end();
  done = true; // one callback only, success or failure
  const page = (status, text) => res.writeHead(status, { 'Content-Type': 'text/plain; charset=utf-8' }).end(text);
  try {
    if (url.searchParams.get('state') !== state) throw new Error('state no coincide; respuesta rechazada');
    const error = url.searchParams.get('error');
    if (error) throw new Error(`Google rechazó la autorización (${error})`);
    const code = url.searchParams.get('code');
    if (!code) throw new Error('la respuesta no trae código de autorización');

    const r = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ code, client_id: id, client_secret: secret, redirect_uri: redirect, grant_type: 'authorization_code', code_verifier: verifier }),
      signal: AbortSignal.timeout(30_000),
    });
    let t = {};
    try { t = await r.json(); } catch { /* non-JSON */ }
    if (!r.ok) throw new Error(`el canje del código falló (HTTP ${r.status}${t.error ? ` ${t.error}` : ''}${t.error_description ? ` — ${t.error_description}` : ''})`);
    if (!t.refresh_token) throw new Error('Google no devolvió refresh token');
    const granted = (t.scope ?? '').split(' ').filter(Boolean);
    if (granted.length !== 1 || granted[0] !== SCOPE) throw new Error(`permisos inesperados (${granted.join(', ') || 'ninguno'}); se esperaba solo drive.file`);

    await saveToken(t.refresh_token); // only reached when every check passed
    page(200, 'Listo. Autorización completada; puedes cerrar esta pestaña.');
    console.log(`Refresh token guardado en .env (${KEY}), permisos 0600. No se mostró.`);
    console.log(`Para GitHub:  grep ^${KEY}= .env | cut -d= -f2- | gh secret set ${KEY}`);
  } catch (e) {
    page(400, 'La autorización no se completó. Revisa la terminal.');
    console.error(`error: ${e.message}. .env no se modificó.`);
    process.exitCode = 1;
  } finally {
    shutdown();
  }
}

const servers = [];
let timer;
function shutdown() {
  clearTimeout(timer);
  for (const s of servers) s.close();
}

async function listen(host) {
  const s = http.createServer(handle);
  await new Promise((resolve, reject) => s.once('error', reject).listen(Number(cb.port), host, resolve));
  servers.push(s);
}

// «localhost» may resolve to IPv4 or IPv6: listen on both loopbacks, never on external interfaces.
try { await listen('127.0.0.1'); } catch (e) { fail(`no se pudo abrir el puerto ${cb.port} (${e.code})`); }
if (cb.hostname === 'localhost') await listen('::1').catch(() => {});

timer = setTimeout(() => {
  console.error(`error: no se completó la autorización en ${TIMEOUT_MS / 60_000} min. .env no se modificó.`);
  process.exitCode = 1;
  shutdown();
}, TIMEOUT_MS);

const auth = new URL('https://accounts.google.com/o/oauth2/v2/auth');
auth.search = new URLSearchParams({
  client_id: id, redirect_uri: redirect, response_type: 'code', scope: SCOPE,
  access_type: 'offline', prompt: 'consent', state,
  code_challenge: b64url(createHash('sha256').update(verifier).digest()), code_challenge_method: 'S256',
});
console.log('Abriendo el navegador para autorizar con tu cuenta de Google…');
console.log(`Si no se abre, copia este enlace:\n\n${auth}\n`);
if (process.platform === 'darwin') execFile('open', [auth.href], (e) => e && console.error('no se pudo abrir el navegador; usa el enlace de arriba'));
