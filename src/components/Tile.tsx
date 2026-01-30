import React from 'react';
import styles from './Tile.module.css';

interface TileProps {
    children?: React.ReactNode;
    colSpan?: 1 | 2 | 3 | 4; // How many columns the tile spans
    rowSpan?: 1 | 2 | 3 | 4; // How many rows the tile spans
    className?: string;
    onClick?: () => void;
    style?: React.CSSProperties;
}

export const Tile: React.FC<TileProps> = ({
    children,
    colSpan = 1,
    rowSpan = 1,
    className = '',
    onClick,
    style
}) => {
    return (
        <div
            className={`${styles.tile} ${className}`}
            style={style}
            onClick={onClick}
            data-colspan={colSpan}
            data-rowspan={rowSpan}
        >
            <div className={styles.content}>
                {children}
            </div>
        </div>
    );
};
