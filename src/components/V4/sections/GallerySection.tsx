import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchGalleryData, getAllPhotosWithTripName } from '../../../data/gallery';
import { Frame } from '../Frame';
import { SectionEyebrow } from '../SectionEyebrow';
import styles from './GallerySection.module.css';

type GalleryPhoto = { src: string; location: string };

export function GallerySection() {
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);

  useEffect(() => {
    fetchGalleryData()
      .then((albums) => {
        const all = getAllPhotosWithTripName(albums);
        // Fisher-Yates shuffle
        for (let i = all.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [all[i], all[j]] = [all[j], all[i]];
        }
        setPhotos(
          all.slice(0, 3).map((p) => ({ src: p.src, location: p.location })),
        );
      })
      .catch(() => setPhotos([]));
  }, []);

  const photoLabel = (photo: GalleryPhoto | undefined): string | undefined => {
    if (!photo) return undefined;
    // "Italy 2024" -> "Italy"
    return photo.location.split(' ')[0];
  };

  return (
    <section className={styles.gallery} id="gallery" aria-label="Gallery">
      <div className={styles.grid}>
        {/* Left column */}
        <div className={styles.left}>
          <SectionEyebrow>Gallery · Reel Three</SectionEyebrow>
          <h2 className={styles.headline}>
            Sometimes<br />
            I <em className={styles.headlineAccent}>take pictures.</em>
          </h2>
          <p className={styles.caption}>
            Cars, light, and the occasional desert sky. A small journal of
            things worth stopping for.
          </p>
          <Link to="/gallery" className={styles.galleryLink}>
            View the gallery ↗
          </Link>
        </div>

        {/* Right column — nested frame grid */}
        <div className={styles.frameGrid}>
          {/* Frame 1 — spans both rows */}
          <Frame
            src={photos[0]?.src}
            hue={20}
            tag="01"
            label={photoLabel(photos[0])}
            className={styles.frameSpan}
          />

          {/* Frame 2 — row 1 */}
          <Frame
            src={photos[1]?.src}
            hue={240}
            tag="02"
            label={photoLabel(photos[1])}
          />

          {/* Frame 3 — row 2 */}
          <Frame
            src={photos[2]?.src}
            hue={40}
            tag="03"
            label={photoLabel(photos[2])}
          />
        </div>
      </div>
    </section>
  );
}
