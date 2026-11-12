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
  status: string;
}

function NowPlayingCard({ track, isLive, progressMs, status }: NowPlayingCardProps) {
  const durationMs = track?.durationMs ?? 0;
  // Progress uses the last server update, rather than simulating playback.
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
          {isLive ? 'Now Playing on Spotify' : track ? 'Recently played on Spotify' : 'Spotify'}
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
            {track?.name ?? status}
          </div>
          {track && (
            <div className={styles.trackMeta}>
              {track.artist} · {track.album}
            </div>
          )}

          {/* Progress bar */}
          {track && <div className={styles.progressBar}>
            <div
              className={styles.progressFill}
              style={{ width: `${progressPct}%` }}
            />
          </div>}

          {/* Times */}
          {track && <div className={styles.progressTimes}>
            <span>{progressDisplay}</span>
            <span>{durationDisplay}</span>
          </div>}
        </div>
      </div>
    </div>
  );
}

interface TrackRowProps {
  track: SpotifyTrack;
  index: number;
}

function TrackRow({ track, index }: TrackRowProps) {
  const hue = RECENT_HUES[index % RECENT_HUES.length];

  return (
    <div className={styles.trackRow}>
      {/* Col 1 — Album art */}
      <div className={styles.trackRowArt}>
        {track.albumArtUrl ? (
          <Frame src={track.albumArtUrl} alt={track.album} style={{ width: '100%', height: '100%' }} />
        ) : (
          <Frame hue={hue} style={{ width: '100%', height: '100%' }} />
        )}
      </div>

      {/* Col 2 — Track name + meta */}
      <div>
        <div className={styles.trackRowName}>{track.name}</div>
        <div className={styles.trackRowMeta}>{track.artist} · {track.album}</div>
      </div>

      {/* Col 3 — Duration */}
      <div className={styles.trackDuration}>
        {formatMs(track.durationMs)}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Main export                                                           */
/* ------------------------------------------------------------------ */

export function MusicSection() {
  const { nowPlaying, recentTracks, topTracks, loading, error } = useSpotify();
  const isLive = nowPlaying != null;

  const displayTrack = nowPlaying ?? recentTracks[0] ?? null;
  const status = loading ? 'Loading Spotify…' : error ?? 'No recent listening activity.';

  // Right-hand list shows the user's top tracks (last ~4 weeks).
  const listTracks = topTracks.slice(0, 4);

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
          <NowPlayingCard track={displayTrack} isLive={isLive} progressMs={nowPlaying?.progressMs ?? 0} status={status} />
        </div>

        {/* Right column */}
        <div>
          <div className={styles.recentLabel}>Top Tracks · Last 4 Weeks</div>
          <div className={styles.trackList}>
            {listTracks.map((track, i) => <TrackRow key={track.id} track={track} index={i} />)}
            {listTracks.length === 0 && (
              <p className={styles.trackRowMeta} role="status">
                {loading ? 'Loading top tracks…' : error ? 'Listening history is unavailable.' : 'No top tracks to share yet.'}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
