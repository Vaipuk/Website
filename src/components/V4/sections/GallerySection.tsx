import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchGalleryData, LOCAL_GALLERY } from '../../../data/gallery';
import { Frame } from '../Frame';
import { SectionEyebrow } from '../SectionEyebrow';
import styles from './GallerySection.module.css';

type GalleryPhoto = { src: string; location: string };

export function GallerySection() {
  const [photos, setPhotos] = useState<GalleryPhoto[]>(() =>
    LOCAL_GALLERY.map(album => ({ src: album.coverImage, location: album.name })),
  );

  useEffect(() => {
    fetchGalleryData()
      .then((albums) => {
        setPhotos(albums.slice(0, 3).map(album => ({ src: album.coverImage, location: album.name })));
      })
      .catch(() => {});
  }, []);

  const photoLabel = (photo: GalleryPhoto | undefined): string | undefined => {
    if (!photo) return undefined;
    // "Italy 2024" -> "Italy"
    return photo.location.replace(/\s+\d{4}$/, '');
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
            A few places and moments worth stopping for, from Italy and France
            to New York.
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
            alt={photos[0] ? `Photograph from ${photos[0].location}` : ''}
            hue={20}
            tag="01"
            label={photoLabel(photos[0])}
            className={styles.frameSpan}
          />

          {/* Frame 2 — row 1 */}
          <Frame
            src={photos[1]?.src}
            alt={photos[1] ? `Photograph from ${photos[1].location}` : ''}
            hue={240}
            tag="02"
            label={photoLabel(photos[1])}
          />

          {/* Frame 3 — row 2 */}
          <Frame
            src={photos[2]?.src}
            alt={photos[2] ? `Photograph from ${photos[2].location}` : ''}
            hue={40}
            tag="03"
            label={photoLabel(photos[2])}
          />
        </div>
      </div>
    </section>
  );
}
