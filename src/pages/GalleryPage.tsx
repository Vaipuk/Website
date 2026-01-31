import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GridContainer } from '../components/Layout/GridContainer';
import { PhotoTile } from '../components/Tiles/PhotoTile';
import { LocationTile } from '../components/Tiles/LocationTile';
import { fetchGalleryData, getAllPhotosWithTripName, type LocationAlbum } from '../data/gallery';
import styles from './GalleryPage.module.css';

// Fallback locations if R2 fetch fails
const FALLBACK_LOCATIONS: LocationAlbum[] = [
    {
        id: 'italy-2024',
        name: 'Italy • 2024',
        folder: 'Italy-2024',
        coverImage: '/trips/Italy-2024/cover.JPG',
        images: [
            { id: 'it-1', src: '/trips/Italy-2024/DSC00458.JPG', orientation: 'landscape' },
            { id: 'it-2', src: '/trips/Italy-2024/DSC00474.JPG', orientation: 'landscape' },
            { id: 'it-3', src: '/trips/Italy-2024/DSC00494.JPG', orientation: 'landscape' },
        ]
    },
    {
        id: 'france-2025',
        name: 'France • 2025',
        folder: 'France-2025',
        coverImage: '/trips/France-2025/cover.JPG',
        images: [
            { id: 'fr-1', src: '/trips/France-2025/DSC00458.JPG', orientation: 'landscape' },
            { id: 'fr-2', src: '/trips/France-2025/DSC00474.JPG', orientation: 'landscape' },
            { id: 'fr-3', src: '/trips/France-2025/DSC00487.JPG', orientation: 'landscape' },
        ]
    },
    {
        id: 'new-york-2025',
        name: 'New York • 2025',
        folder: 'New York-2025',
        coverImage: '/trips/New%20York-2025/cover.JPG',
        images: [
            { id: 'ny-1', src: '/trips/New%20York-2025/DSC00458.JPG', orientation: 'landscape' },
            { id: 'ny-2', src: '/trips/New%20York-2025/DSC00487.JPG', orientation: 'landscape' },
            { id: 'ny-3', src: '/trips/New%20York-2025/DSC00494.JPG', orientation: 'landscape' },
        ]
    },
];

export const GalleryPage: React.FC = () => {
    const navigate = useNavigate();
    const [locations, setLocations] = useState<LocationAlbum[]>(FALLBACK_LOCATIONS);
    const [selectedLocation, setSelectedLocation] = useState<LocationAlbum | null>(null);

    // Try to fetch gallery data from R2 manifest
    useEffect(() => {
        fetchGalleryData()
            .then(data => {
                if (data.length > 0) {
                    setLocations(data);
                }
            })
            .catch(err => {
                console.warn('Using local fallback locations:', err);
            });
    }, []);

    // Get images for hero carousel
    const heroImages = getAllPhotosWithTripName(locations).slice(0, 5);

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
                {heroImages.length > 0 && (
                    <PhotoTile images={heroImages} colSpan={4} rowSpan={2} />
                )}

                {/* Location Grid */}
                {locations.map(location => (
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
