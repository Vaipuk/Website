import { useEffect, useState } from 'react';
import styles from './MusicSection.module.css';
import { Frame } from '../Frame';
import { SectionEyebrow } from '../SectionEyebrow';
import { Equalizer } from '../Equalizer';
import { useSpotify } from '../../../hooks/useSpotify';
import type { SpotifyTrack } from '../../../hooks/useSpotify';

/* ------------------------------------------------------------------ */
/* Helpers                                                              */
/* ------------------------------------------------------------------ */

function formatMs(ms: number): string {
  return `${Math.floor(ms / 60000)}:${String(Math.floor((ms % 60000) / 1000)).padStart(2, '0')}`;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/* ------------------------------------------------------------------ */
/* Sub-components                                                        */
/* ------------------------------------------------------------------ */

const BACKDROP_HUES = [340, 280, 160, 60, 200, 20, 120, 300] as const;
const RECENT_HUES = [280, 160, 60, 200] as const;
const VIBES = ['Disco', 'Indie', 'Pop', 'Dream'] as const;

function Backdrop() {
  return (
    <div className={styles.backdrop} aria-hidden="true">
      {BACKDROP_HUES.map((hue) => (
        <Frame key={hue} hue={hue} className={styles.backdropFrame} />
      ))}
    </div>
  );
}

interface NowPlayingCardProps {
  track: SpotifyTrack | null;
  isLive: boolean;
  progressMs: number;
}

function NowPlayingCard({ track, isLive, progressMs }: NowPlayingCardProps) {
  const durationMs = track?.durationMs ?? 0;
  // Live: use the locally-ticking progress. Recently-played: show a full bar.
  const effectiveProgress = isLive ? progressMs : durationMs;
  const progressPct = durationMs > 0
    ? clamp((effectiveProgress / durationMs) * 100, 0, 100)
    : 0;

  const progressDisplay = formatMs(effectiveProgress);
  const durationDisplay = formatMs(durationMs);

  return (
    <div className={styles.nowPlayingCard}>
      {/* Header row */}
      <div className={styles.nowPlayingHeader}>
        <div className={styles.spotifyDot} aria-label="Spotify">♪</div>
        <span className={styles.nowPlayingLabel}>
          {isLive ? 'Now Playing on Spotify' : 'Recently played on Spotify'}
        </span>
        {isLive && <Equalizer className={styles.equalizerRight} />}
      </div>

      {/* Body row */}
      <div className={styles.nowPlayingBody}>
        {/* Album art */}
        <div className={styles.albumArt}>
          {track?.albumArtUrl ? (
            <Frame src={track.albumArtUrl} alt={track.album} style={{ width: '100%', height: '100%' }} />
          ) : (
            <Frame hue={340} style={{ width: '100%', height: '100%' }} />
          )}
        </div>

        {/* Track info */}
        <div className={styles.trackInfo}>
          <div className={styles.trackTitle}>
            {track?.name ?? 'Not playing'}
          </div>
          {track && (
            <div className={styles.trackMeta}>
              {track.artist} · {track.album}
            </div>
          )}

          {/* Progress bar */}
          <div className={styles.progressBar}>
            <div
              className={styles.progressFill}
              style={{ width: `${progressPct}%` }}
            />
          </div>

          {/* Times */}
          <div className={styles.progressTimes}>
            <span>{progressDisplay}</span>
            <span>{durationDisplay}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

interface TrackRowProps {
  track: SpotifyTrack | undefined;
  index: number;
}

function TrackRow({ track, index }: TrackRowProps) {
  const hue = RECENT_HUES[index % RECENT_HUES.length];
  const vibe = VIBES[index % VIBES.length];

  return (
    <div className={styles.trackRow}>
      {/* Col 1 — Album art */}
      <div className={styles.trackRowArt}>
        {track?.albumArtUrl ? (
          <Frame src={track.albumArtUrl} alt={track.album} style={{ width: '100%', height: '100%' }} />
        ) : (
          <Frame hue={hue} style={{ width: '100%', height: '100%' }} />
        )}
      </div>

      {/* Col 2 — Track name + meta */}
      <div>
        <div className={styles.trackRowName}>{track?.name ?? '—'}</div>
        {track && (
          <div className={styles.trackRowMeta}>{track.artist} · {track.album}</div>
        )}
      </div>

      {/* Col 3 — Vibe pill */}
      <div className={styles.vibePill}>{vibe}</div>

      {/* Col 4 — Duration */}
      <div className={styles.trackDuration}>
        {track ? formatMs(track.durationMs) : '—'}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Main export                                                           */
/* ------------------------------------------------------------------ */

export function MusicSection() {
  const { nowPlaying, recentTracks } = useSpotify();
  const isLive = nowPlaying != null;

  // The card never shows an empty state: fall back to the most recent track.
  const displayTrack = nowPlaying ?? recentTracks[0] ?? null;

  // Avoid showing the most-recent track twice: when idle it occupies the card,
  // so the right-hand list starts one further down.
  const listTracks = isLive ? recentTracks.slice(0, 4) : recentTracks.slice(1, 5);

  // Local live-ticking progress so the bar advances between 25s polls.
  const [progressMs, setProgressMs] = useState(0);

  // Re-sync to Spotify's reported progress whenever the track or poll updates.
  useEffect(() => {
    setProgressMs(nowPlaying?.progressMs ?? 0);
  }, [nowPlaying?.id, nowPlaying?.progressMs]);

  // Advance one second at a time while a track is actively playing.
  useEffect(() => {
    if (!isLive || !nowPlaying) return;
    const duration = nowPlaying.durationMs;
    const id = setInterval(() => {
      setProgressMs((p) => Math.min(p + 1000, duration));
    }, 1000);
    return () => clearInterval(id);
  }, [isLive, nowPlaying?.id, nowPlaying?.durationMs]);

  return (
    <section id="music" className={styles.section}>
      <Backdrop />

      <div className={styles.foreground}>
        {/* Left column */}
        <div>
          <SectionEyebrow>Soundtrack · Reel Four</SectionEyebrow>
          <h2 className={styles.headline}>
            What I've been<br />
            <em className={styles.headlineEm}>listening to.</em>
          </h2>
          <NowPlayingCard track={displayTrack} isLive={isLive} progressMs={progressMs} />
        </div>

        {/* Right column */}
        <div>
          <div className={styles.recentLabel}>Recently Played · Top of the Week</div>
          <div className={styles.trackList}>
            {[0, 1, 2, 3].map((i) => (
              <TrackRow key={i} track={listTracks[i]} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
