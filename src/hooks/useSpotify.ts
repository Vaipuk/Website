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
  topTracks: SpotifyTrack[];
  loading: boolean;
  error: string | null;
}

const EMPTY: SpotifyData = {
  nowPlaying: null, recentTracks: [], topTracks: [], loading: true, error: null,
};

export function useSpotify(): SpotifyData {
  const [data, setData] = useState<SpotifyData>(EMPTY);

  useEffect(() => {
    const controller = new AbortController();
    let timer: ReturnType<typeof setTimeout> | undefined;

    async function load() {
      try {
        const response = await fetch('/api/spotify', {
          signal: AbortSignal.any([controller.signal, AbortSignal.timeout(12000)]),
        });
        if (!response.ok) throw new Error('Spotify unavailable');
        const result = await response.json() as Omit<SpotifyData, 'loading'>;
        if (!Array.isArray(result.recentTracks) || !Array.isArray(result.topTracks)
          || (result.nowPlaying !== null && typeof result.nowPlaying !== 'object')) {
          throw new Error('Invalid Spotify response');
        }
        if (!controller.signal.aborted) setData({ ...result, loading: false, error: null });
      } catch {
        if (!controller.signal.aborted) {
          setData({ ...EMPTY, loading: false, error: 'Spotify is unavailable right now.' });
        }
      } finally {
        if (!controller.signal.aborted) timer = setTimeout(load, 30000);
      }
    }

    void load();
    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, []);

  return data;
}
