/**
 * One-time Spotify OAuth helper — auto-captures the redirect.
 * Run: SPOTIFY_CLIENT_ID=xxx SPOTIFY_CLIENT_SECRET=yyy node scripts/spotify-auth.mjs
 * On Windows PowerShell:
 *   $env:SPOTIFY_CLIENT_ID="xxx"; $env:SPOTIFY_CLIENT_SECRET="yyy"; node scripts/spotify-auth.mjs
 *
 * Steps:
 *   1. Add http://127.0.0.1:8888/callback as a redirect URI in Spotify Dashboard
 *      (127.0.0.1, NOT localhost — Spotify requires the loopback IP)
 *   2. Run this script with your credentials as env vars (see above)
 *   3. Script auto-captures the code and prints your refresh_token
 *   4. Copy VITE_SPOTIFY_REFRESH_TOKEN=... into your .env file
 */

import http from 'http';

const CLIENT_ID     = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const REDIRECT_URI  = 'http://127.0.0.1:8888/callback';

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error('Error: Set SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET as environment variables.');
  console.error('PowerShell: $env:SPOTIFY_CLIENT_ID="..."; $env:SPOTIFY_CLIENT_SECRET="..."; node scripts/spotify-auth.mjs');
  process.exit(1);
}
const SCOPES        = 'user-read-currently-playing user-read-recently-played';

const authUrl =
  'https://accounts.spotify.com/authorize?' +
  new URLSearchParams({
    client_id:     CLIENT_ID,
    response_type: 'code',
    redirect_uri:  REDIRECT_URI,
    scope:         SCOPES,
  }).toString();

console.log('\n── Spotify Auth ─────────────────────────────────────────────');
console.log('\nOpen this URL in your browser:\n');
console.log('   ' + authUrl);
console.log('\nWaiting for Spotify to redirect back...\n');

const code = await new Promise((resolve, reject) => {
  const server = http.createServer((req, res) => {
    const url = new URL(req.url, 'http://127.0.0.1:8888');
    const code = url.searchParams.get('code');
    const error = url.searchParams.get('error');

    if (error) {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end('<h2>Authorization denied.</h2><p>You can close this tab.</p>');
      server.close();
      reject(new Error('Authorization denied: ' + error));
      return;
    }

    if (code) {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end('<h2>Done! You can close this tab.</h2><p>Go back to your terminal.</p>');
      server.close();
      resolve(code);
    }
  });

  server.listen(8888, '127.0.0.1', () => {});
  server.on('error', reject);
});

console.log('Got authorization code. Exchanging for tokens...\n');

const resp = await fetch('https://accounts.spotify.com/api/token', {
  method: 'POST',
  headers: {
    'Content-Type':  'application/x-www-form-urlencoded',
    'Authorization': 'Basic ' + Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64'),
  },
  body: new URLSearchParams({
    grant_type:   'authorization_code',
    code,
    redirect_uri: REDIRECT_URI,
  }).toString(),
});

const data = await resp.json();

if (!resp.ok) {
  console.error('Spotify returned an error:', data);
  process.exit(1);
}

console.log('── Success! ─────────────────────────────────────────────────');
console.log('\nAdd this line to your .env file:\n');
console.log(`VITE_SPOTIFY_REFRESH_TOKEN=${data.refresh_token}`);
console.log('\n─────────────────────────────────────────────────────────────\n');
