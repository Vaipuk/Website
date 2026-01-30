import React from 'react';
import { Tile } from '../Tile';
import styles from './ProjectTile.module.css';

interface ProjectTileProps {
    title: string;
    description: string;
    gradient?: string;
    imageSrc?: string;
    onClick?: () => void;
}

export const ProjectTile: React.FC<ProjectTileProps> = ({ title, description, gradient, imageSrc, onClick }) => {
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
            <div className={styles.overlay}>
                <div className={styles.content}>
                    <h3 className={styles.title}>{title}</h3>
                    <p className={styles.description}>{description}</p>
                </div>
            </div>
        </Tile>
    );
};
