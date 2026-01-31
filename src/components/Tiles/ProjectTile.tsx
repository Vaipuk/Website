import React from 'react';
import { Link } from 'react-router-dom';
import { Tile } from '../Tile';
import styles from './ProjectTile.module.css';

interface ProjectTileProps {
    title: string;
    description: string;
    gradient?: string;
    imageSrc?: string;
    onClick?: () => void;
    linkTo?: string;
}

export const ProjectTile: React.FC<ProjectTileProps> = ({ title, description, gradient, imageSrc, onClick, linkTo }) => {
    const tileContent = (
        <div className={styles.overlay}>
            <div className={styles.content}>
                <h3 className={styles.title}>{title}</h3>
                <p className={styles.description}>{description}</p>
            </div>
        </div>
    );

    if (linkTo) {
        return (
            <Tile
                colSpan={2}
                rowSpan={2}
                className={styles.projectTile}
                style={{
                    background: imageSrc ? `url(${imageSrc}) center/cover` : gradient,
                    cursor: 'pointer',
                    padding: 0
                }}
            >
                <Link to={linkTo} style={{ display: 'block', width: '100%', height: '100%', textDecoration: 'none' }}>
                    {tileContent}
                </Link>
            </Tile>
        );
    }

    return (
        <Tile
            colSpan={2}
            rowSpan={2}
            className={styles.projectTile}
            style={{
                background: imageSrc ? `url(${imageSrc}) center/cover` : gradient,
                cursor: onClick ? 'pointer' : 'default'
            }}
            onClick={onClick}
        >
            {tileContent}
        </Tile>
    );
};
