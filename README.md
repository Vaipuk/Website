# Vaibhav's website

React, TypeScript and Vite portfolio with a photo gallery, selected projects and a server-side Spotify display endpoint.

## Local development

Use Node.js 24 or newer. Install the locked dependencies with `npm ci`, then run `npm run dev`.

Copy `.env.example` to the ignored `.env.local` file. The contact form uses `VITE_WEB3FORMS_ACCESS_KEY`, a public form access key. Spotify is optional: without its server credentials, the music section says that Spotify is unavailable instead of showing sample songs.

The Vite development and preview servers both provide `GET /api/spotify`. Restart the server after changing local environment values. `npm run build` creates the static site in `dist`; `npm run preview` serves that build with the local API middleware.

## Spotify credentials

Set these **server-only** variables in `.env.local` for local development and as encrypted environment variables for the Cloudflare Pages Functions runtime:

```text
SPOTIFY_CLIENT_ID
SPOTIFY_CLIENT_SECRET
SPOTIFY_REFRESH_TOKEN
```

The Spotify app needs `user-read-currently-playing`, `user-read-recently-played` and `user-top-read` permissions. Its authorized account is the account displayed publicly by this site. Refresh tokens must come from that account's authorization grant. Never put Spotify credentials in a variable beginning with `VITE_`; that prefix is reserved for public browser configuration.

For a new authorization, add `http://127.0.0.1:8888/callback` to the Spotify app's allowed redirect URIs, set the client ID and secret in `.env.local`, and run `node --env-file=.env.local scripts/spotify-auth.mjs`. Follow the printed authorization URL yourself. The helper prints the new refresh token; save it only in the ignored local file and encrypted deployment settings.

**Existing credentials need rotation:** the previous version included `VITE_SPOTIFY_CLIENT_SECRET` and `VITE_SPOTIFY_REFRESH_TOKEN` in its browser bundle. Revoke the previous authorization, rotate the client secret and obtain a new refresh token before enabling the new endpoint. Remove the old `VITE_SPOTIFY_*` values from local and deployment settings. This code change cannot revoke credentials or remove copies of an already published bundle.

`/api/spotify` returns only allowlisted track display fields, never credentials, tokens or raw Spotify errors. It shares concurrent requests, caches successful results for 30 seconds per worker, reuses access tokens, and limits each upstream request to five seconds. Errors are briefly cached to avoid repeated requests; Spotify rate-limit delays are respected up to five minutes. Missing configuration and API failures return HTTP 503 with empty music data. A valid idle account returns HTTP 200 with its actual recent/top tracks, which may be empty.

## Cloudflare Pages deployment

Use the repository's Cloudflare Pages Git integration with build command `npm run build` and output directory `dist`. The root `functions/api/spotify.ts` file supplies the endpoint through [Pages Functions routing](https://developers.cloudflare.com/pages/functions/routing/). It imports the shared implementation in `server/spotify.ts`.

Configure the three unprefixed Spotify variables as secrets in the correct Pages environment, then create a new deployment so the Function receives them. See [Cloudflare's environment-variable instructions](https://developers.cloudflare.com/pages/functions/bindings/#environment-variables). Production and preview environments have separate settings. Do not upload only `dist` through the dashboard: the API also needs the repository's `functions` and `server` code packaged by the Pages deployment process.

Spotify remains unavailable on a purely static host unless that host also supplies `/api/spotify`. The contact form's public Web3Forms key must be present at build time if the form should work. Deploying and rotating credentials are owner actions; this repository does neither automatically.

## Checks

```text
node --test tests/*.test.ts
npm run lint
npm run build
```

The Spotify tests use controlled upstream responses and make no real Spotify requests. They cover missing secrets, public-data filtering, idle playback, malformed responses, failures, request sharing, caching, token reuse and rate limiting.

The build also generates route-specific HTML metadata for share previews and checks the browser bundle against configured Spotify secrets. `.node-version` selects Node 24 for supported build hosts. Vite's disposable dependency cache lives in the system temporary directory to avoid file locks in the synced Windows project folder.

Gallery previews in `public/thumbnails` are generated from the checked-in originals with `python scripts/generate-thumbnails.py` (requires Pillow). The full-size files are loaded by the lightbox. Known albums remain available from local files if the remote manifest or image service is unavailable. The social card can be regenerated on Windows with `python scripts/generate-social-preview.py` (Pillow and the installed Georgia/Consolas fonts).
