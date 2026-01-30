import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GridContainer } from '../components/Layout/GridContainer';
import { PhotoTile } from '../components/Tiles/PhotoTile';
import { LocationTile } from '../components/Tiles/LocationTile';
import { GALLERY_DATA, type LocationAlbum } from '../data/gallery';
import styles from './GalleryPage.module.css';

export const GalleryPage: React.FC = () => {
    const navigate = useNavigate();
    const [selectedLocation, setSelectedLocation] = useState<LocationAlbum | null>(null);

    // Collect all images for the hero carousel
    const allImages = GALLERY_DATA.flatMap(loc =>
        loc.images.map(img => ({ ...img, location: loc.name, date: '2024' }))
    );
    // Pick a subset for the hero to keep it manageable
    const heroImages = allImages.slice(0, 5);

    const handleLocationClick = (location: LocationAlbum) => {
        setSelectedLocation(location);
        // In a real app we might route to /gallery/:id, but for now we can do an overlay or inline view
        // The user asked for "tiles further clickable to scroll through pictures in same tile layout"
        // which implies a view change.
    };

    return (
        <div className={styles.page}>
            <header className={styles.header}>
                <button onClick={() => navigate('/')} className={styles.backButton}>← Back to Home</button>
                <h1>Photography</h1>
            </header>

            <GridContainer>
                {/* Hero Carousel - Full Width (4 cols) */}
                <PhotoTile images={heroImages} colSpan={4} rowSpan={2} />

                {/* Location Grid - 2 per row (2 cols each in a 4-col grid) */}
                {GALLERY_DATA.map(location => {
                    // Find cover image
                    const cover = location.images.find(img => img.id === location.coverId) || location.images[0];

                    return (
                        <LocationTile
                            key={location.id}
                            name={location.name}
                            coverImage={cover}
                            photoCount={location.images.length}
                            colSpan={2}
                            rowSpan={2}
                            onClick={() => handleLocationClick(location)}
                        />
                    );
                })}
            </GridContainer>

            {/* Location Detail Overlay (Simple implementation for now) */}
            {selectedLocation && (
                <div className={styles.modalOverlay} onClick={() => setSelectedLocation(null)}>
                    <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h2>{selectedLocation.name}</h2>
                            <button onClick={() => setSelectedLocation(null)} className={styles.closeButton}>×</button>
                        </div>
                        <div className={styles.masonryGrid}>
                            {selectedLocation.images.map(img => (
                                <div
                                    key={img.id}
                                    className={`${styles.masonryItem} ${img.orientation === 'landscape' ? styles.landscape : styles.portrait}`}
                                >
                                    <img src={img.src} alt={img.caption} loading="lazy" />
                                    {img.caption && <div className={styles.caption}>{img.caption}</div>}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
