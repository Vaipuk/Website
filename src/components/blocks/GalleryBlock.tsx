import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useReveal } from '../../hooks/useReveal'
import { fetchGalleryData, type LocationAlbum } from '../../data/gallery'
import styles from './GalleryBlock.module.css'

export const GalleryBlock: React.FC = () => {
  const labelRef   = useReveal()
  const textRef    = useReveal(100)
  const carouselRef = useReveal(200)
  const navigate = useNavigate()

  const [albums, setAlbums] = useState<LocationAlbum[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    fetchGalleryData()
      .then(data => { if (data.length > 0) setAlbums(data) })
      .catch(() => {})
  }, [])

  useEffect(() => {
    if (albums.length < 2) return
    const interval = setInterval(() => {
      setCurrentIndex(i => (i + 1) % albums.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [albums.length])

  const currentAlbum = albums[currentIndex]

  return (
    <section className={styles.gallery}>
      <div className="container">
        <div className={styles.inner}>
          <div className={styles.textSide}>
            <span ref={labelRef as React.RefObject<HTMLSpanElement>} className="section-label">Photography</span>
            <h2 ref={textRef as React.RefObject<HTMLHeadingElement>} className={styles.heading}>
              Sometimes I<br /><em>take pictures</em>
            </h2>
            <button className={styles.cta} onClick={() => navigate('/gallery')}>
              View gallery →
            </button>
          </div>

          <div
            ref={carouselRef as React.RefObject<HTMLDivElement>}
            className={styles.carousel}
            onClick={() => navigate('/gallery')}
          >
            {albums.length === 0 ? (
              <div className={styles.placeholder} />
            ) : (
              albums.map((album, i) => (
                <div
                  key={album.id}
                  className={`${styles.slide} ${i === currentIndex ? styles.active : ''}`}
                >
                  <img src={album.coverImage} alt={album.name} className={styles.slideImg} />
                </div>
              ))
            )}
            {currentAlbum && (
              <span className={styles.carouselLabel}>{currentAlbum.name}</span>
            )}
            {albums.length > 1 && (
              <div className={styles.dots}>
                {albums.map((_, i) => (
                  <span
                    key={i}
                    className={`${styles.dot} ${i === currentIndex ? styles.activeDot : ''}`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
