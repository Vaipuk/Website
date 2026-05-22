import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchGalleryData, type LocationAlbum } from '../../../data/gallery';
import { Frame } from '../Frame';
import { SectionEyebrow } from '../SectionEyebrow';
import styles from './GallerySection.module.css';

export function GallerySection() {
  const [albums, setAlbums] = useState<LocationAlbum[]>([]);

  useEffect(() => {
    fetchGalleryData()
      .then((data) => setAlbums(data.slice(0, 3)))
      .catch(() => setAlbums([]));
  }, []);

  const albumLabel = (album: LocationAlbum | undefined): string | undefined => {
    if (!album) return undefined;
    // "Chicago 2026" -> "Chicago"
    return album.name.split(' ')[0];
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
            src={albums[0]?.coverImage}
            hue={20}
            tag="01"
            label={albumLabel(albums[0])}
            className={styles.frameSpan}
          />

          {/* Frame 2 — row 1 */}
          <Frame
            src={albums[1]?.coverImage}
            hue={240}
            tag="02"
            label={albumLabel(albums[1])}
          />

          {/* Frame 3 — row 2 */}
          <Frame
            src={albums[2]?.coverImage}
            hue={40}
            tag="03"
            label={albumLabel(albums[2])}
          />
        </div>
      </div>
    </section>
  );
}
