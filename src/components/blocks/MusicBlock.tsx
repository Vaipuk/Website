import React from 'react'
import { useReveal } from '../../hooks/useReveal'
import styles from './MusicBlock.module.css'

const TRACKS = [
  { title: 'Blinding Lights', artist: 'The Weeknd', color: '#1a4a6e', playing: true },
  { title: 'Levitating',       artist: 'Dua Lipa',    color: '#4a1a6e', playing: false },
  { title: 'Heat Waves',       artist: 'Glass Animals',color: '#1e3a2f', playing: false },
  { title: 'Watermelon Sugar', artist: 'Harry Styles', color: '#3d1a1a', playing: false },
]

export const MusicBlock: React.FC = () => {
  const leftRef   = useReveal()
  const tracksRef = useReveal(150)

  return (
    <section className={styles.music}>
      <div className="container">
        <div className={styles.inner}>
          <div ref={leftRef as React.RefObject<HTMLDivElement>}>
            <span className="section-label">Music</span>
            <h2 className={styles.heading}>
              What I've been<br /><em>listening to</em>
            </h2>
            <p className={styles.sub}>Recently played on Spotify</p>
          </div>
          <div ref={tracksRef as React.RefObject<HTMLDivElement>} className={styles.trackList}>
            {TRACKS.map((track, i) => (
              <div key={i} className={styles.track}>
                <div className={styles.trackArt} style={{ background: track.color }}>
                  🎵
                </div>
                <div className={styles.trackInfo}>
                  <div className={styles.trackName}>{track.title}</div>
                  <div className={styles.trackArtist}>{track.artist}</div>
                </div>
                {track.playing && (
                  <div className={styles.eq}>
                    <span className={styles.eqBar} />
                    <span className={styles.eqBar} />
                    <span className={styles.eqBar} />
                    <span className={styles.eqBar} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
