import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchGalleryData, type LocationAlbum, type GalleryImage } from '../data/gallery';
import styles from './GalleryPage.module.css';

const FALLBACK_LOCATIONS: LocationAlbum[] = [
    {
        id: 'italy-2024',
        name: 'Italy 2024',
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
        name: 'France 2025',
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
        name: 'New York 2025',
        folder: 'New York-2025',
        coverImage: '/trips/New%20York-2025/cover.JPG',
        images: [
            { id: 'ny-1', src: '/trips/New%20York-2025/DSC00458.JPG', orientation: 'landscape' },
            { id: 'ny-2', src: '/trips/New%20York-2025/DSC00487.JPG', orientation: 'landscape' },
            { id: 'ny-3', src: '/trips/New%20York-2025/DSC00494.JPG', orientation: 'landscape' },
        ]
    },
];

interface CarouselPhoto {
    src: string;
    tripName: string;
}

export const GalleryPage: React.FC = () => {
    const navigate = useNavigate();
    const [locations, setLocations] = useState<LocationAlbum[]>(FALLBACK_LOCATIONS);
    const [selectedLocation, setSelectedLocation] = useState<LocationAlbum | null>(null);
    const [carouselIndex, setCarouselIndex] = useState(0);

    useEffect(() => {
        fetchGalleryData()
            .then(data => {
                if (data.length > 0) setLocations(data);
            })
            .catch(err => {
                console.warn('Using fallback locations:', err);
            });
    }, []);

    // Collect all photos for the top carousel (cover images from each trip)
    const carouselPhotos: CarouselPhoto[] = locations.map(loc => ({
        src: loc.coverImage,
        tripName: loc.name,
    }));

    // Auto-advance carousel
    useEffect(() => {
        if (carouselPhotos.length < 2) return;
        const interval = setInterval(() => {
            setCarouselIndex(i => (i + 1) % carouselPhotos.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [carouselPhotos.length]);

    const handlePrev = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCarouselIndex(i => (i - 1 + carouselPhotos.length) % carouselPhotos.length);
    };

    const handleNext = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCarouselIndex(i => (i + 1) % carouselPhotos.length);
    };

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <button className={styles.back} onClick={() => navigate('/')}>
                    ← Home
                </button>
                <h1 className={styles.pageTitle}><em>Photography</em></h1>
                <p className={styles.subtitle}>Places I've been, moments I've kept.</p>
            </div>

            {/* Top carousel */}
            {carouselPhotos.length > 0 && (
                <div className={styles.heroCarousel}>
                    {carouselPhotos.map((photo, i) => (
                        <div
                            key={photo.src}
                            className={`${styles.heroSlide} ${i === carouselIndex ? styles.active : ''}`}
                        >
                            <img src={photo.src} alt={photo.tripName} className={styles.heroImg} />
                        </div>
                    ))}
                    <div className={styles.heroOverlay} />
                    <span className={styles.heroLabel}>{carouselPhotos[carouselIndex]?.tripName}</span>
                    <button className={`${styles.navBtn} ${styles.navPrev}`} onClick={handlePrev}>‹</button>
                    <button className={`${styles.navBtn} ${styles.navNext}`} onClick={handleNext}>›</button>
                    <div className={styles.heroDots}>
                        {carouselPhotos.map((_, i) => (
                            <button
                                key={i}
                                className={`${styles.heroDot} ${i === carouselIndex ? styles.activeDot : ''}`}
                                onClick={() => setCarouselIndex(i)}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Trips grid */}
            <div className={styles.tripsSection}>
                <span className={styles.tripsLabel}>All trips</span>
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
            </div>

            {/* Trip detail overlay */}
            {selectedLocation && (
                <div className={styles.modalBackdrop}>
                    <div className={styles.modalHeader}>
                        <span className={styles.modalTitle}>{selectedLocation.name}</span>
                        <button onClick={() => setSelectedLocation(null)} className={styles.modalClose}>Close</button>
                    </div>
                    <div className={styles.modalGrid}>
                        {selectedLocation.images.map((img: GalleryImage) => (
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
