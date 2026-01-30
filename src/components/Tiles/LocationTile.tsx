import React from 'react';
import { Tile } from '../Tile';
import type { GalleryImage } from '../../data/gallery';
import styles from './LocationTile.module.css';

interface LocationTileProps {
    name: string;
    coverImage: GalleryImage;
    photoCount: number;
    onClick: () => void;
    colSpan?: 1 | 2 | 3 | 4;
    rowSpan?: 1 | 2 | 3 | 4;
}

export const LocationTile: React.FC<LocationTileProps> = ({ name, coverImage, photoCount, onClick, colSpan = 1, rowSpan = 1 }) => {
    return (
        <Tile
            colSpan={colSpan}
            rowSpan={rowSpan}
            className={styles.locationTile}
            onClick={onClick}
            style={{
                backgroundImage: `url(${coverImage.src})`,
                cursor: 'pointer'
            }}
        >
            <div className={styles.overlay}>
                <div className={styles.content}>
                    <h3 className={styles.name}>{name}</h3>
                    <span className={styles.count}>{photoCount} Photos</span>
                </div>
            </div>
        </Tile>
    );
};
