import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchGalleryData, type LocationAlbum } from '../data/gallery';
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

    return (
        <div className={styles.page}>
            <button className={styles.back} onClick={() => navigate('/')}>
                ← Home
            </button>

            <h1 className={styles.pageTitle}><em>Gallery</em></h1>

            <div className={styles.locGrid}>
                {locations.map(loc => (
                    <div
                        key={loc.id}
                        className={styles.locCard}
                        onClick={() => setSelectedLocation(loc)}
                    >
                        <img src={loc.coverImage} alt={loc.name} className={styles.locImg} />
                        <div className={styles.locOverlay} />
                        <div className={styles.locContent}>
                            <span className={styles.locName}>{loc.name}</span>
                            <span className={styles.locCount}>{loc.images.length} photos</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Location Detail Overlay */}
            {selectedLocation && (
                <div className={styles.modalBackdrop}>
                    <div className={styles.modalHeader}>
                        <span className={styles.modalTitle}>{selectedLocation.name}</span>
                        <button onClick={() => setSelectedLocation(null)} className={styles.modalClose}>Close</button>
                    </div>
                    <div className={styles.modalGrid}>
                        {selectedLocation.images.map(img => (
                            <img
                                key={img.id}
                                src={img.src}
                                alt={selectedLocation.name}
                                loading="lazy"
                                className={`${styles.modalImg} ${img.orientation === 'landscape' ? styles.landscape : ''}`}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
