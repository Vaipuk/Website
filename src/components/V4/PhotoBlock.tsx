import { useState, useEffect } from 'react';
import { BentoTile } from './BentoGrid';
import { fetchTrips, getRandomImages, type GalleryImage } from '../../data/galleryConfig';
import styles from './PhotoBlock.module.css';

const FALLBACK: GalleryImage[] = [
  { src: '/trips/Italy-2024/cover.JPG', location: 'Italy • 2024', date: '' },
  { src: '/trips/France-2025/cover.JPG', location: 'France • 2025', date: '' },
  { src: '/trips/New%20York-2025/cover.JPG', location: 'New York • 2025', date: '' },
];

export function PhotoBlock() {
  const [images, setImages] = useState<GalleryImage[]>(FALLBACK);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    fetchTrips()
      .then(trips => { if (trips.length > 0) setImages(getRandomImages(trips, 5)); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % images.length), 3500);
    return () => clearInterval(t);
  }, [images.length]);

  return (
    <BentoTile col={2} row={2} to="/gallery" className={styles.photo}>
      {images.map((img, i) => (
        <div
          key={i}
          className={`${styles.slide} ${i === idx ? styles.active : ''}`}
          style={{ backgroundImage: `url(${img.src})` }}
        />
      ))}
      <div className={styles.overlay} />
      <span className={styles.heading}>Gallery</span>
      <div className={styles.footer}>
        <span className={styles.label}>{images[idx]?.location ?? ''}</span>
        <div className={styles.dots}>
          {images.map((_, i) => (
            <span
              key={i}
              className={`${styles.dot} ${i === idx ? styles.activeDot : ''}`}
            />
          ))}
        </div>
      </div>
    </BentoTile>
  );
}
