import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Tile } from '../Tile';
import styles from './PhotoTile.module.css';

interface PhotoTileProps {
    images: { src: string, location: string, date: string }[];
    linkTo?: string; // Optional link
    colSpan?: 1 | 2 | 3 | 4;
    rowSpan?: 1 | 2 | 3 | 4;
    autoSlideInterval?: number; // Auto-slide interval in ms (default: 5000)
}

export const PhotoTile: React.FC<PhotoTileProps> = ({
    images,
    linkTo,
    colSpan = 2,
    rowSpan = 2,
    autoSlideInterval = 5000
}) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);

    // Auto-slideshow effect
    useEffect(() => {
        const interval = setInterval(() => {
            setIsTransitioning(true);
            setTimeout(() => {
                setActiveIndex((prev) => (prev + 1) % images.length);
                setIsTransitioning(false);
            }, 500); // Half of the CSS transition duration
        }, autoSlideInterval);

        return () => clearInterval(interval);
    }, [images.length, autoSlideInterval]);

    const currentImage = images[activeIndex];

    const handleDotClick = (e: React.MouseEvent, idx: number) => {
        e.stopPropagation();
        setIsTransitioning(true);
        setTimeout(() => {
            setActiveIndex(idx);
            setIsTransitioning(false);
        }, 500);
    };

    const content = (
        <>
            {/* All images stacked, with opacity transitions */}
            {images.map((image, idx) => (
                <div
                    key={idx}
                    className={`${styles.imageBackground} ${idx === activeIndex && !isTransitioning ? styles.active : ''}`}
                    style={{ backgroundImage: `url(${image.src})` }}
                />
            ))}

            <div className={styles.controls} onClick={e => e.stopPropagation()}>
                <div className={styles.info}>
                    <span>{currentImage.location}</span>
                </div>
                <div className={styles.dots}>
                    {images.map((_, idx) => (
                        <div
                            key={idx}
                            className={`${styles.dot} ${idx === activeIndex ? styles.active : ''}`}
                            onClick={(e) => handleDotClick(e, idx)}
                        />
                    ))}
                </div>
            </div>
        </>
    );

    if (linkTo) {
        return (
            <Tile colSpan={colSpan} rowSpan={rowSpan} className={styles.photoTile} style={{ padding: 0 }}>
                <Link to={linkTo} style={{ display: 'block', width: '100%', height: '100%', textDecoration: 'none' }}>
                    {content}
                </Link>
            </Tile>
        )
    }

    return (
        <Tile colSpan={colSpan} rowSpan={rowSpan} className={styles.photoTile} style={{ padding: 0 }}>
            {content}
        </Tile>
    );
};
