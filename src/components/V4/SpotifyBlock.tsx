import { useState, useEffect } from 'react';
import { BentoTile } from './BentoGrid';
import styles from './SpotifyBlock.module.css';

const TRACKS = [
  { title: 'Midnight City',          artist: 'M83',            color: '#1a4a6e' },
  { title: 'Instant Crush',          artist: 'Daft Punk',       color: '#111827' },
  { title: 'The Less I Know',        artist: 'Tame Impala',     color: '#1e2d3d' },
  { title: 'Starboy',                artist: 'The Weeknd',      color: '#2a1535' },
  { title: 'Fluorescent Adolescent', artist: 'Arctic Monkeys',  color: '#1e3a2f' },
];

function SpotifyIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="#1DB954">
      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
    </svg>
  );
}

export function SpotifyBlock() {
  const [playingIdx, setPlayingIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(
      () => setPlayingIdx(() => Math.floor(Math.random() * 3)),
      4500
    );
    return () => clearInterval(t);
  }, []);

  const displayTracks = TRACKS.slice(0, 3);

  return (
    <BentoTile col={2} row={2} className={styles.spotify}>
      <div className={styles.header}>
        <div className={styles.logo}>
          <SpotifyIcon />
          <span>Spotify</span>
        </div>
        <span className={styles.sub}>Recently played</span>
      </div>

      <p className={styles.headline}>
        What I've been<br />
        <em>listening to</em>
      </p>

      <div className={styles.tracks}>
        {displayTracks.map((track, i) => (
          <div key={i} className={`${styles.track} ${i === playingIdx ? styles.playing : ''}`}>
            <div className={styles.art} style={{ background: track.color }}>
              <span className={styles.artNote}>♪</span>
            </div>
            <div className={styles.info}>
              <div className={styles.trackName}>{track.title}</div>
              <div className={styles.artist}>{track.artist}</div>
            </div>
            {i === playingIdx && (
              <div className={styles.eq} aria-hidden>
                <span className={styles.bar} />
                <span className={styles.bar} />
                <span className={styles.bar} />
              </div>
            )}
          </div>
        ))}
      </div>
    </BentoTile>
  );
}
