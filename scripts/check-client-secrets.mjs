import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
import { loadEnv } from 'vite';

const env = loadEnv('production', process.cwd(), '');
const assets = await readdir('dist/assets');
const javascript = (await Promise.all(assets.filter(file => file.endsWith('.js')).map(file => readFile(`dist/assets/${file}`, 'utf8')))).join('\n');
for (const key of ['SPOTIFY_CLIENT_SECRET', 'SPOTIFY_REFRESH_TOKEN', 'VITE_SPOTIFY_CLIENT_SECRET', 'VITE_SPOTIFY_REFRESH_TOKEN']) {
  if (env[key]) assert.ok(!javascript.includes(env[key]), `Private ${key} must not appear in browser JavaScript`);
}
assert.ok(!javascript.includes('accounts.spotify.com/api/token'), 'Browser JavaScript must not refresh private Spotify tokens');
console.log('Browser bundle checked: no configured Spotify secrets or token exchange.');
