import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GridContainer } from '../components/Layout/GridContainer';
import { PhotoTile } from '../components/Tiles/PhotoTile';
import { LocationTile } from '../components/Tiles/LocationTile';
import { GALLERY_DATA, getAllPhotosWithTripName, type LocationAlbum } from '../data/gallery';
import styles from './GalleryPage.module.css';

export const GalleryPage: React.FC = () => {
    const navigate = useNavigate();
    const [selectedLocation, setSelectedLocation] = useState<LocationAlbum | null>(null);

    // Get all images with trip name as location description
    const allImages = getAllPhotosWithTripName();
    // Pick first 5 for hero carousel
    const heroImages = allImages.slice(0, 5);

    const handleLocationClick = (location: LocationAlbum) => {
        setSelectedLocation(location);
    };

    return (
        <div className={styles.page}>
            <header className={styles.header}>
                <button onClick={() => navigate('/')} className={styles.backButton}>← Back to Home</button>
                <h1>Photography</h1>
            </header>

            <GridContainer>
                {/* Hero Carousel - Full Width */}
                <PhotoTile images={heroImages} colSpan={4} rowSpan={2} />

                {/* Location Grid */}
                {GALLERY_DATA.map(location => (
                    <LocationTile
                        key={location.id}
                        name={location.name}
                        coverImage={{ src: location.coverImage, orientation: 'landscape' }}
                        photoCount={location.images.length}
                        colSpan={2}
                        rowSpan={2}
                        onClick={() => handleLocationClick(location)}
                    />
                ))}
            </GridContainer>

            {/* Location Detail Overlay */}
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
                                    <img src={img.src} alt={selectedLocation.name} loading="lazy" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
