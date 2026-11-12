import { defineConfig, loadEnv, type Connect } from 'vite'
import react from '@vitejs/plugin-react'
import { createSpotifyHandler } from './server/spotify.ts'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

export default defineConfig(({ mode }) => {
  const handleSpotify = createSpotifyHandler(loadEnv(mode, process.cwd(), 'SPOTIFY_'))
  const spotifyMiddleware: Connect.NextHandleFunction = (req, res, next) => {
    if (req.url?.split('?')[0] !== '/api/spotify') return next()
    if (req.method !== 'GET') {
      res.writeHead(405, { Allow: 'GET' })
      res.end()
      return
    }
    void handleSpotify().then(async response => {
      res.writeHead(response.status, Object.fromEntries(response.headers))
      res.end(await response.text())
    }).catch(next)
  }
  return {
    // Keep disposable dependencies outside the synced project to avoid Windows directory locks.
    cacheDir: join(tmpdir(), 'vaipuk-website-vite', 'node_modules', '.vite'),
    plugins: [react(), {
      name: 'spotify-api',
      configureServer(server) { server.middlewares.use(spotifyMiddleware) },
      configurePreviewServer(server) { server.middlewares.use(spotifyMiddleware) },
    }],
  }
})
