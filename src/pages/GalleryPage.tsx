import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ModalDialog } from '../components/ModalDialog';
import { fetchGalleryData, LOCAL_GALLERY, type LocationAlbum } from '../data/gallery';
import '../components/V4/v4-tokens.css';
import styles from './GalleryPage.module.css';

export const GalleryPage = () => {
  const [locations, setLocations] = useState<LocationAlbum[]>(LOCAL_GALLERY);
  const [selectedLocation, setSelectedLocation] = useState<LocationAlbum | null>(null);
  const [photoIndex, setPhotoIndex] = useState<number | null>(null);
  const thumbnails = useRef<(HTMLButtonElement | null)[]>([]);
  const backToAlbum = useRef<HTMLButtonElement>(null);
  const lastPhoto = useRef<number | null>(null);
  const viewingPhoto = photoIndex !== null;

  useEffect(() => {
    let active = true;
    fetchGalleryData().then(data => { if (active) setLocations(data); });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (viewingPhoto) backToAlbum.current?.focus();
    else if (lastPhoto.current !== null) thumbnails.current[lastPhoto.current]?.focus();
  }, [viewingPhoto]);

  const closeGallery = () => {
    lastPhoto.current = null;
    setSelectedLocation(null);
    setPhotoIndex(null);
  };

  const showPhoto = (index: number) => {
    lastPhoto.current = index;
    setPhotoIndex(index);
  };

  const goPhoto = (direction: number) => {
    const count = selectedLocation?.images.length ?? 0;
    if (photoIndex === null || count === 0) return;
    showPhoto((photoIndex + direction + count) % count);
  };

  return (
    <div data-theme="v4" className={styles.page}>
      <div className={styles.header}>
        <Link className={styles.back} to="/">← Home</Link>
        <span className={styles.eyebrow}>Gallery · Reel Three</span>
        <h1 className={styles.pageTitle}>Photo<em>graphy.</em></h1>
        <p className={styles.subtitle}>Places I've been, moments I've kept.</p>
      </div>

      <div className={styles.tripsSection}>
        <h2 className={styles.tripsLabel}>All trips</h2>
        <div className={styles.locGrid}>
          {locations.map(location => (
            <button
              key={location.id}
              id={`trip-${location.id}`}
              type="button"
              className={styles.locCard}
              aria-label={`Open ${location.name}, ${location.images.length} photos`}
              aria-haspopup="dialog"
              disabled={location.images.length === 0}
              onClick={() => {
                lastPhoto.current = null;
                setPhotoIndex(null);
                setSelectedLocation(location);
              }}
            >
              <img src={location.coverImage} alt="" className={styles.locImg} loading="lazy" />
              <span className={styles.locOverlay} />
              <span className={styles.locContent}>
                <span className={styles.locName}>{location.name}</span>
                <span className={styles.locCount}>{location.images.length} photos</span>
              </span>
            </button>
          ))}
        </div>
      </div>

      {selectedLocation && (
        <ModalDialog
          className={`${styles.tripModal} ${viewingPhoto ? styles.photoMode : ''}`}
          aria-labelledby="gallery-title"
          fallbackFocusId={`trip-${selectedLocation.id}`}
          onClose={closeGallery}
          onCancel={event => {
            if (viewingPhoto) {
              event.preventDefault();
              setPhotoIndex(null);
            }
          }}
          onKeyDown={event => {
            if (!viewingPhoto) return;
            if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
              event.preventDefault();
              goPhoto(event.key === 'ArrowRight' ? 1 : -1);
            }
          }}
        >
          <div className={styles.tripModalHeader}>
            <h2 id="gallery-title" className={styles.tripModalTitle}>{selectedLocation.name}</h2>
            <button type="button" onClick={closeGallery} className={styles.modalClose}>Close gallery</button>
          </div>

          {photoIndex === null ? (
            <div className={styles.photoGrid}>
              {selectedLocation.images.map((image, index) => (
                <button
                  key={image.id}
                  ref={element => { thumbnails.current[index] = element; }}
                  type="button"
                  className={`${styles.photoThumb} ${image.orientation === 'landscape' ? styles.landscape : styles.portrait}`}
                  aria-label={`View photo ${index + 1} of ${selectedLocation.images.length} from ${selectedLocation.name}`}
                  onClick={() => showPhoto(index)}
                >
                  <img src={image.thumbnail ?? image.src} alt="" loading="lazy" />
                </button>
              ))}
            </div>
          ) : (
            <div className={styles.lightbox}>
              <button
                ref={backToAlbum}
                type="button"
                className={styles.albumBack}
                onClick={() => setPhotoIndex(null)}
              >← All photos</button>
              <figure className={styles.lbImgWrap}>
                <img
                  key={selectedLocation.images[photoIndex].id}
                  src={selectedLocation.images[photoIndex].src}
                  alt={`Photo ${photoIndex + 1} from ${selectedLocation.name}`}
                  className={styles.lbImg}
                />
                <figcaption className={styles.lbCount} aria-live="polite">
                  Photo {photoIndex + 1} of {selectedLocation.images.length}
                </figcaption>
              </figure>
              <div className={styles.lbControls}>
                <button type="button" className={styles.lbNav} onClick={() => goPhoto(-1)} aria-label="Previous photo">
                  <span aria-hidden="true">←</span> Previous
                </button>
                <button type="button" className={styles.lbNav} onClick={() => goPhoto(1)} aria-label="Next photo">
                  Next <span aria-hidden="true">→</span>
                </button>
              </div>
            </div>
          )}
        </ModalDialog>
      )}
    </div>
  );
};
