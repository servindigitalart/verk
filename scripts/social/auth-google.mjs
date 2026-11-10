#!/usr/bin/env node
// One-time, local: obtains the Google Drive refresh token (scope drive.file) with a loopback
// OAuth flow (PKCE + state) and writes it into the local, git-ignored .env. It never prints it.
//   node --env-file=.env scripts/social/auth-google.mjs
import http from 'node:http';
import { randomBytes, createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';

const ENV = new URL('../../.env', import.meta.url);
const { GOOGLE_OAUTH_CLIENT_ID: id, GOOGLE_OAUTH_CLIENT_SECRET: secret } = process.env;
if (!id || !secret) throw new Error('Define GOOGLE_OAUTH_CLIENT_ID y GOOGLE_OAUTH_CLIENT_SECRET en .env');

const b64url = (b) => b.toString('base64url');
const verifier = b64url(randomBytes(32));
const state = b64url(randomBytes(16));

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://127.0.0.1');
  if (url.pathname !== '/') return res.writeHead(404).end();
  try {
    if (url.searchParams.get('state') !== state) throw new Error('state inválido');
    if (!url.searchParams.get('code')) throw new Error(url.searchParams.get('error') ?? 'sin código');
    const r = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code: url.searchParams.get('code'), client_id: id, client_secret: secret,
        redirect_uri: redirect, grant_type: 'authorization_code', code_verifier: verifier,
      }),
    });
    const t = await r.json();
    if (!t.refresh_token) throw new Error(`Google no devolvió refresh token (${t.error ?? r.status})`);
    let env = '';
    try { env = await readFile(ENV, 'utf8'); } catch { /* new file */ }
    const line = `GOOGLE_OAUTH_REFRESH_TOKEN=${t.refresh_token}`;
    env = /^GOOGLE_OAUTH_REFRESH_TOKEN=.*$/m.test(env) ? env.replace(/^GOOGLE_OAUTH_REFRESH_TOKEN=.*$/m, () => line) : `${env.replace(/\n?$/, '\n')}${line}\n`;
    await writeFile(ENV, env, { mode: 0o600 });
    res.end('Listo. Puedes cerrar esta pestaña.');
    console.log('Refresh token guardado en .env (GOOGLE_OAUTH_REFRESH_TOKEN). Súbelo a GitHub con:\n  grep ^GOOGLE_OAUTH_REFRESH_TOKEN= .env | cut -d= -f2- | gh secret set GOOGLE_OAUTH_REFRESH_TOKEN');
  } catch (e) {
    res.writeHead(400).end('Error. Revisa la terminal.');
    console.error(`error: ${e.message}`);
    process.exitCode = 1;
  } finally {
    server.close();
  }
});

let redirect;
server.listen(0, '127.0.0.1', () => {
  redirect = `http://127.0.0.1:${server.address().port}/`;
  const auth = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  auth.search = new URLSearchParams({
    client_id: id, redirect_uri: redirect, response_type: 'code', scope: 'https://www.googleapis.com/auth/drive.file',
    access_type: 'offline', prompt: 'consent', state, code_challenge: b64url(createHash('sha256').update(verifier).digest()), code_challenge_method: 'S256',
  });
  console.log(`Abre esta URL en el navegador y autoriza con tu cuenta de Google:\n\n${auth}\n`);
});
