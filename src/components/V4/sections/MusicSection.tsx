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
  nowPlaying: SpotifyTrack | null;
}

function NowPlayingCard({ nowPlaying }: NowPlayingCardProps) {
  const progressPct = nowPlaying?.progressMs != null && nowPlaying.durationMs > 0
    ? clamp((nowPlaying.progressMs / nowPlaying.durationMs) * 100, 0, 100)
    : 42;

  const progressDisplay = nowPlaying?.progressMs != null ? formatMs(nowPlaying.progressMs) : '1:24';
  const durationDisplay = nowPlaying?.durationMs != null ? formatMs(nowPlaying.durationMs) : '3:20';

  return (
    <div className={styles.nowPlayingCard}>
      {/* Header row */}
      <div className={styles.nowPlayingHeader}>
        <div className={styles.spotifyDot} aria-label="Spotify">♪</div>
        <span className={styles.nowPlayingLabel}>Now Playing on Spotify</span>
        <Equalizer className={styles.equalizerRight} />
      </div>

      {/* Body row */}
      <div className={styles.nowPlayingBody}>
        {/* Album art */}
        <div className={styles.albumArt}>
          {nowPlaying?.albumArtUrl ? (
            <Frame src={nowPlaying.albumArtUrl} alt={nowPlaying.album} style={{ width: '100%', height: '100%' }} />
          ) : (
            <Frame hue={340} style={{ width: '100%', height: '100%' }} />
          )}
        </div>

        {/* Track info */}
        <div className={styles.trackInfo}>
          <div className={styles.trackTitle}>
            {nowPlaying?.name ?? 'Not playing'}
          </div>
          {nowPlaying && (
            <div className={styles.trackMeta}>
              {nowPlaying.artist} · {nowPlaying.album}
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
          <NowPlayingCard nowPlaying={nowPlaying} />
        </div>

        {/* Right column */}
        <div>
          <div className={styles.recentLabel}>Recently Played · Top of the Week</div>
          <div className={styles.trackList}>
            {[0, 1, 2, 3].map((i) => (
              <TrackRow key={i} track={recentTracks[i]} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
