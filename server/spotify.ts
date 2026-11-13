export interface SpotifyEnv {
  SPOTIFY_CLIENT_ID?: string;
  SPOTIFY_CLIENT_SECRET?: string;
  SPOTIFY_REFRESH_TOKEN?: string;
}

interface DisplayTrack {
  id: string;
  name: string;
  artist: string;
  album: string;
  albumArtUrl: string | null;
  durationMs: number;
  progressMs?: number;
  isPlaying?: boolean;
}

interface DisplayData {
  nowPlaying: DisplayTrack | null;
  recentTracks: DisplayTrack[];
  topTracks: DisplayTrack[];
  error: string | null;
}

const UNAVAILABLE: DisplayData = {
  nowPlaying: null, recentTracks: [], topTracks: [], error: 'Spotify is unavailable right now.',
};

function record(value: unknown): Record<string, unknown> | null {
  return value !== null && typeof value === 'object' ? value as Record<string, unknown> : null;
}

function displayTrack(value: unknown): DisplayTrack | null {
  const track = record(value);
  const album = record(track?.album);
  if (!track || !album || typeof track.id !== 'string' || typeof track.name !== 'string'
    || typeof album.name !== 'string' || typeof track.duration_ms !== 'number'
    || !Number.isFinite(track.duration_ms) || track.duration_ms < 0 || !Array.isArray(track.artists)) return null;
  const artist = track.artists.map(artist => record(artist)?.name).filter(name => typeof name === 'string').join(', ');
  const image = Array.isArray(album.images) ? record(album.images[0])?.url : null;
  return {
    id: track.id, name: track.name, artist: artist || 'Unknown artist', album: album.name,
    albumArtUrl: typeof image === 'string' && image.startsWith('https://') ? image : null,
    durationMs: track.duration_ms,
  };
}

export function createSpotifyHandler(env: SpotifyEnv, fetcher: typeof fetch = fetch, now = Date.now) {
  let token: { value: string; expiresAt: number } | null = null;
  let cached: { data: DisplayData; status: number; expiresAt: number; failure?: string } | null = null;
  let pending: Promise<void> | null = null;
  let recent: DisplayTrack[] | null = null;
  let top: { tracks: DisplayTrack[]; expiresAt: number } | null = null;

  async function load() {
    let retryMs = 15000;
    // Which step failed, for the X-Spotify-Failure header: path, status and Spotify's error code only, never a secret.
    let failure = 'network';
    async function request(url: string, init: RequestInit = {}, allowIdle = false): Promise<unknown> {
      const response = await fetcher(url, { ...init, signal: AbortSignal.timeout(5000) });
      if (allowIdle && (response.status === 204 || response.status === 404)) return null;
      if (!response.ok) {
        if (response.status === 401) token = null;
        if (response.status === 429) {
          const seconds = Number(response.headers.get('retry-after'));
          if (Number.isFinite(seconds)) retryMs = Math.min(300000, Math.max(15000, seconds * 1000));
        }
        const code = record(await response.json().catch(() => null))?.error;
        failure = `${new URL(url).pathname} ${response.status}${typeof code === 'string' && /^[a-z_]+$/.test(code) ? ` ${code}` : ''}`;
        throw new Error('Spotify request failed');
      }
      return response.json();
    }

    try {
      if (!token || token.expiresAt - 60000 <= now()) {
        const result = record(await request('https://accounts.spotify.com/api/token', {
          method: 'POST',
          headers: {
            Authorization: `Basic ${btoa(`${env.SPOTIFY_CLIENT_ID}:${env.SPOTIFY_CLIENT_SECRET}`)}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({ grant_type: 'refresh_token', refresh_token: env.SPOTIFY_REFRESH_TOKEN! }).toString(),
        }));
        if (typeof result?.access_token !== 'string' || typeof result.expires_in !== 'number'
          || !Number.isFinite(result.expires_in) || result.expires_in <= 0) throw new Error('Invalid token response');
        token = { value: result.access_token, expiresAt: now() + result.expires_in * 1000 };
      }
      const headers = { Authorization: `Bearer ${token.value}` };
      // Spotify rate-limits endpoints separately, so one failure must not blank the others:
      // each list keeps its last good value, and top tracks (a 4-week window) refresh hourly.
      const topFresh = top !== null && top.expiresAt > now();
      const [playingResult, recentResult, topResult] = await Promise.allSettled([
        request('https://api.spotify.com/v1/me/player/currently-playing', { headers }, true),
        request('https://api.spotify.com/v1/me/player/recently-played?limit=1', { headers }),
        topFresh ? null : request('https://api.spotify.com/v1/me/top/tracks?time_range=short_term&limit=4', { headers }),
      ]);
      const playing = playingResult.status === 'fulfilled' ? record(playingResult.value) : null;
      const playingOk = playingResult.status === 'fulfilled' && (playingResult.value === null || playing !== null);
      const recentItems = recentResult.status === 'fulfilled' ? record(recentResult.value)?.items : null;
      const topItems = topResult.status === 'fulfilled' ? record(topResult.value)?.items : null;
      if (Array.isArray(recentItems)) {
        recent = recentItems.map(item => displayTrack(record(item)?.track)).filter(track => track !== null).slice(0, 1);
      }
      if (Array.isArray(topItems)) {
        top = { tracks: topItems.map(displayTrack).filter(track => track !== null).slice(0, 4), expiresAt: now() + 3600000 };
      }
      if (!playingOk && !recent && !top) throw new Error('Spotify unavailable');
      const failed = !playingOk || !Array.isArray(recentItems) || (!topFresh && !Array.isArray(topItems));
      const current = playing?.is_playing === true ? displayTrack(playing.item) : null;
      const progress = typeof playing?.progress_ms === 'number' && Number.isFinite(playing.progress_ms)
        ? Math.max(0, Math.min(playing.progress_ms, current?.durationMs ?? 0)) : 0;
      cached = {
        status: 200, expiresAt: now() + (failed ? Math.max(30000, retryMs) : 30000),
        data: {
          nowPlaying: current ? { ...current, progressMs: progress, isPlaying: true } : null,
          recentTracks: recent ?? [],
          topTracks: top?.tracks ?? [],
          // A part with no data at all is reported, so the page never shows it as an empty history.
          error: !playingOk || !recent || !top ? UNAVAILABLE.error : null,
        },
      };
    } catch {
      cached = { data: UNAVAILABLE, status: 503, expiresAt: now() + retryMs, failure };
    }
  }

  // shortcut: cache is per worker instance; add shared storage only if real traffic needs it.
  return async (): Promise<Response> => {
    if (!env.SPOTIFY_CLIENT_ID?.trim() || !env.SPOTIFY_CLIENT_SECRET?.trim() || !env.SPOTIFY_REFRESH_TOKEN?.trim()) {
      return Response.json(UNAVAILABLE, { status: 503, headers: { 'Cache-Control': 'no-store', 'X-Spotify-Failure': 'config' } });
    }
    if (!cached || cached.expiresAt <= now()) {
      pending ??= load().finally(() => { pending = null; });
      await pending;
    }
    return Response.json(cached!.data, {
      status: cached!.status,
      headers: cached!.status === 200
        ? { 'Cache-Control': 'public, max-age=15, s-maxage=30' }
        : { 'Cache-Control': 'no-store', 'X-Spotify-Failure': cached!.failure ?? 'unknown' },
    });
  };
}
