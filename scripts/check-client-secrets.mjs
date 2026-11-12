import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
import { loadEnv } from 'vite';

const env = loadEnv('production', process.cwd(), '');
const publicFiles = (await readdir('dist', { recursive: true })).filter(file => /\.(html|js|css|map)$/.test(file));
const publicCode = (await Promise.all(publicFiles.map(file => readFile(`dist/${file}`, 'utf8')))).join('\n');
for (const key of ['SPOTIFY_CLIENT_SECRET', 'SPOTIFY_REFRESH_TOKEN', 'VITE_SPOTIFY_CLIENT_SECRET', 'VITE_SPOTIFY_REFRESH_TOKEN']) {
  if (env[key]) assert.ok(!publicCode.includes(env[key]), `Private ${key} must not appear in public site files`);
}
assert.ok(!publicCode.includes('accounts.spotify.com/api/token'), 'Browser JavaScript must not refresh private Spotify tokens');
assert.ok(!/mailto:|\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i.test(publicCode), 'Public site files must not expose direct email addresses or mail links');
console.log('Public site files checked: no private credentials, token exchange, or direct email addresses.');
