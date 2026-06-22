import { useState, useEffect } from 'react';

export interface SpotifyTrack {
  id: string;
  name: string;
  artist: string;
  album: string;
  albumArtUrl: string | null;
  durationMs: number;
  progressMs?: number;
  isPlaying?: boolean;
}

export interface SpotifyData {
  nowPlaying: SpotifyTrack | null;
  recentTracks: SpotifyTrack[];
  loading: boolean;
  error: string | null;
}

const STATIC_FALLBACK: SpotifyData = {
  nowPlaying: {
    id: 'static-0',
    name: 'Blinding Lights',
    artist: 'The Weeknd',
    album: 'After Hours',
    albumArtUrl: null,
    durationMs: 200000,
    progressMs: 84000,
    isPlaying: true,
  },
  recentTracks: [
    { id: 'static-1', name: 'Levitating', artist: 'Dua Lipa', album: 'Future Nostalgia', albumArtUrl: null, durationMs: 203000 },
    { id: 'static-2', name: 'Heat Waves', artist: 'Glass Animals', album: 'Dreamland', albumArtUrl: null, durationMs: 238000 },
    { id: 'static-3', name: 'Watermelon Sugar', artist: 'Harry Styles', album: 'Fine Line', albumArtUrl: null, durationMs: 174000 },
    { id: 'static-4', name: 'Midnight City', artist: 'M83', album: "Hurry Up, We're Dreaming", albumArtUrl: null, durationMs: 243000 },
  ],
  loading: false,
  error: null,
};

interface SpotifyTokenResponse {
  access_token: string;
  expires_in: number;
}

/** How often to re-poll Spotify for fresh now-playing / recently-played data. */
const POLL_INTERVAL_MS = 25_000;

interface SpotifyCurrentlyPlayingResponse {
  item?: {
    id: string;
    name: string;
    artists: { name: string }[];
    album: {
      name: string;
      images: { url: string }[];
    };
    duration_ms: number;
  } | null;
  progress_ms?: number;
  is_playing?: boolean;
}

interface SpotifyRecentlyPlayedResponse {
  items: {
    track: {
      id: string;
      name: string;
      artists: { name: string }[];
      album: {
        name: string;
        images: { url: string }[];
      };
      duration_ms: number;
    };
  }[];
}

// Module-level token cache, shared across remounts and poll cycles.
// Spotify access tokens last ~1 hour; with 25s polling we must avoid minting
// a new one on every fetch (wasteful + risks rate-limiting).
let cachedToken: { value: string; expiresAt: number } | null = null;

async function getAccessToken(
  clientId: string,
  clientSecret: string,
  refreshToken: string,
): Promise<string> {
  // Reuse cached token until within 60s of expiry.
  if (cachedToken && cachedToken.expiresAt - 60_000 > Date.now()) {
    return cachedToken.value;
  }

  const credentials = btoa(`${clientId}:${clientSecret}`);
  const body = new URLSearchParams({
    grant_type: 'refresh_token',
    refresh_token: refreshToken,
  });

  const res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: body.toString(),
  });

  if (!res.ok) {
    throw new Error(`Token fetch failed: ${res.status}`);
  }

  const data = (await res.json()) as SpotifyTokenResponse;
  cachedToken = {
    value: data.access_token,
    expiresAt: Date.now() + (data.expires_in ?? 3600) * 1000,
  };
  return cachedToken.value;
}

async function fetchNowPlaying(token: string): Promise<SpotifyTrack | null> {
  const res = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (res.status === 204 || res.status === 404) return null;
  if (!res.ok) throw new Error(`Now playing fetch failed: ${res.status}`);

  const data = (await res.json()) as SpotifyCurrentlyPlayingResponse;
  // Treat only an actively-playing track as "now playing". A paused track
  // falls through to the recently-played display, same as an idle player.
  if (!data.item || !data.is_playing) return null;

  return {
    id: data.item.id,
    name: data.item.name,
    artist: data.item.artists[0]?.name ?? 'Unknown Artist',
    album: data.item.album.name,
    albumArtUrl: data.item.album.images[0]?.url ?? null,
    durationMs: data.item.duration_ms,
    progressMs: data.progress_ms,
    isPlaying: data.is_playing,
  };
}

async function fetchRecentTracks(token: string): Promise<SpotifyTrack[]> {
  const res = await fetch('https://api.spotify.com/v1/me/player/recently-played?limit=5', {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) throw new Error(`Recently played fetch failed: ${res.status}`);

  const data = (await res.json()) as SpotifyRecentlyPlayedResponse;

  return data.items.map((item, i) => ({
    id: item.track.id || `recent-${i}`,
    name: item.track.name,
    artist: item.track.artists[0]?.name ?? 'Unknown Artist',
    album: item.track.album.name,
    albumArtUrl: item.track.album.images[0]?.url ?? null,
    durationMs: item.track.duration_ms,
  }));
}

export function useSpotify(): SpotifyData {
  const [data, setData] = useState<SpotifyData>({ ...STATIC_FALLBACK, loading: true });

  useEffect(() => {
    const refreshToken = import.meta.env.VITE_SPOTIFY_REFRESH_TOKEN as string | undefined;

    if (!refreshToken) {
      setData(STATIC_FALLBACK);
      return;
    }

    const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID as string | undefined;
    const clientSecret = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET as string | undefined;

    if (!clientId || !clientSecret) {
      setData(STATIC_FALLBACK);
      return;
    }

    let cancelled = false;

    const load = async () => {
      try {
        const token = await getAccessToken(clientId, clientSecret, refreshToken);
        if (cancelled) return;

        const [nowPlaying, recentTracks] = await Promise.all([
          fetchNowPlaying(token),
          fetchRecentTracks(token),
        ]);
        if (cancelled) return;

        setData({ nowPlaying, recentTracks, loading: false, error: null });
      } catch (err) {
        if (cancelled) return;
        console.warn('[useSpotify] Failed to fetch Spotify data:', err);
        setData({ ...STATIC_FALLBACK, error: String(err) });
      }
    };

    load();
    const intervalId = setInterval(load, POLL_INTERVAL_MS);

    return () => {
      cancelled = true;
      clearInterval(intervalId);
    };
  }, []);

  return data;
}
