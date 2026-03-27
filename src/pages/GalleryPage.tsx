import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchGalleryData, type LocationAlbum, type GalleryImage } from '../data/gallery';
import styles from './GalleryPage.module.css';

const R2 = 'https://images.vaipuk.com';

const FALLBACK_LOCATIONS: LocationAlbum[] = [
    {
        id: 'italy-2024',
        name: 'Italy 2024',
        folder: 'Italy-2024',
        coverImage: `${R2}/trips/Italy-2024/cover.JPG`,
        images: [
            { id: 'it-1', src: `${R2}/trips/Italy-2024/DSC00458.JPG`, orientation: 'landscape' },
            { id: 'it-2', src: `${R2}/trips/Italy-2024/DSC00474.JPG`, orientation: 'landscape' },
            { id: 'it-3', src: `${R2}/trips/Italy-2024/DSC00494.JPG`, orientation: 'landscape' },
        ]
    },
    {
        id: 'france-2025',
        name: 'France 2025',
        folder: 'France-2025',
        coverImage: `${R2}/trips/France-2025/cover.JPG`,
        images: [
            { id: 'fr-1', src: `${R2}/trips/France-2025/DSC00458.JPG`, orientation: 'landscape' },
            { id: 'fr-2', src: `${R2}/trips/France-2025/DSC00474.JPG`, orientation: 'landscape' },
            { id: 'fr-3', src: `${R2}/trips/France-2025/DSC00487.JPG`, orientation: 'landscape' },
        ]
    },
    {
        id: 'new-york-2025',
        name: 'New York 2025',
        folder: 'New York-2025',
        coverImage: `${R2}/trips/New%20York-2025/cover.JPG`,
        images: [
            { id: 'ny-1', src: `${R2}/trips/New%20York-2025/DSC00458.JPG`, orientation: 'landscape' },
            { id: 'ny-2', src: `${R2}/trips/New%20York-2025/DSC00487.JPG`, orientation: 'landscape' },
            { id: 'ny-3', src: `${R2}/trips/New%20York-2025/DSC00494.JPG`, orientation: 'landscape' },
        ]
    },
];

interface LightboxState {
    images: GalleryImage[];
    index: number;
}

export const GalleryPage: React.FC = () => {
    const navigate = useNavigate();
    const [locations, setLocations] = useState<LocationAlbum[]>(FALLBACK_LOCATIONS);
    const [selectedLocation, setSelectedLocation] = useState<LocationAlbum | null>(null);
    const [carouselIndex, setCarouselIndex] = useState(0);
    const [lightbox, setLightbox] = useState<LightboxState | null>(null);

    useEffect(() => {
        fetchGalleryData()
            .then(data => { if (data.length > 0) setLocations(data); })
            .catch(() => {});
    }, []);

    // Cover images for top carousel
    const carouselPhotos = locations.map(loc => ({ src: loc.coverImage, name: loc.name }));

    useEffect(() => {
        if (carouselPhotos.length < 2) return;
        const interval = setInterval(() => {
            setCarouselIndex(i => (i + 1) % carouselPhotos.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [carouselPhotos.length]);

    // Lightbox keyboard navigation
    const goLightbox = useCallback((dir: number) => {
        setLightbox(lb => {
            if (!lb) return null;
            const next = (lb.index + dir + lb.images.length) % lb.images.length;
            return { ...lb, index: next };
        });
    }, []);

    useEffect(() => {
        if (!lightbox) return;
        const handler = (e: KeyboardEvent) => {
            if (e.key === 'ArrowRight') goLightbox(1);
            else if (e.key === 'ArrowLeft') goLightbox(-1);
            else if (e.key === 'Escape') setLightbox(null);
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [lightbox, goLightbox]);

    // Close trip modal on escape (when no lightbox open)
    useEffect(() => {
        if (lightbox || !selectedLocation) return;
        const handler = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setSelectedLocation(null);
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [selectedLocation, lightbox]);

    const openLightbox = (images: GalleryImage[], index: number) => {
        setLightbox({ images, index });
    };

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <button className={styles.back} onClick={() => navigate('/')}>← Home</button>
                <h1 className={styles.pageTitle}><em>Photography</em></h1>
                <p className={styles.subtitle}>Places I've been, moments I've kept.</p>
            </div>

            {/* Hero carousel */}
            {carouselPhotos.length > 0 && (
                <div className={styles.heroCarousel}>
                    {carouselPhotos.map((photo, i) => (
                        <div
                            key={photo.src}
                            className={`${styles.heroSlide} ${i === carouselIndex ? styles.active : ''}`}
                        >
                            <img src={photo.src} alt={photo.name} className={styles.heroImg} />
                        </div>
                    ))}
                    <div className={styles.heroOverlay} />
                    <span className={styles.heroLabel}>{carouselPhotos[carouselIndex]?.name}</span>
                    <button
                        className={`${styles.navBtn} ${styles.navPrev}`}
                        onClick={() => setCarouselIndex(i => (i - 1 + carouselPhotos.length) % carouselPhotos.length)}
                    >‹</button>
                    <button
                        className={`${styles.navBtn} ${styles.navNext}`}
                        onClick={() => setCarouselIndex(i => (i + 1) % carouselPhotos.length)}
                    >›</button>
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

            {/* Trip detail overlay — iCloud-style photo grid */}
            {selectedLocation && !lightbox && (
                <div className={styles.tripBackdrop} onClick={() => setSelectedLocation(null)}>
                    <div className={styles.tripModal} onClick={e => e.stopPropagation()}>
                        <div className={styles.tripModalHeader}>
                            <h2 className={styles.tripModalTitle}>{selectedLocation.name}</h2>
                            <button onClick={() => setSelectedLocation(null)} className={styles.modalClose}>Close</button>
                        </div>
                        <div className={styles.photoGrid}>
                            {selectedLocation.images.map((img, idx) => (
                                <button
                                    key={img.id}
                                    className={`${styles.photoThumb} ${img.orientation === 'landscape' ? styles.landscape : styles.portrait}`}
                                    onClick={() => openLightbox(selectedLocation.images, idx)}
                                >
                                    <img src={img.src} alt={selectedLocation.name} loading="lazy" />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Lightbox */}
            {lightbox && (
                <div className={styles.lightbox} onClick={() => setLightbox(null)}>
                    <button className={styles.lbClose} onClick={() => setLightbox(null)}>×</button>
                    <button
                        className={`${styles.lbNav} ${styles.lbPrev}`}
                        onClick={e => { e.stopPropagation(); goLightbox(-1); }}
                    >‹</button>
                    <div className={styles.lbImgWrap} onClick={e => e.stopPropagation()}>
                        <img
                            key={lightbox.images[lightbox.index].src}
                            src={lightbox.images[lightbox.index].src}
                            alt=""
                            className={styles.lbImg}
                        />
                    </div>
                    <button
                        className={`${styles.lbNav} ${styles.lbNext}`}
                        onClick={e => { e.stopPropagation(); goLightbox(1); }}
                    >›</button>
                    <div className={styles.lbCount}>
                        {lightbox.index + 1} / {lightbox.images.length}
                    </div>
                </div>
            )}
        </div>
    );
};
