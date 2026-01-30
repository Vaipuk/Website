// src/components/Layout/GridContainer.tsx
import React from 'react';
import styles from './GridContainer.module.css';

interface GridContainerProps {
    children: React.ReactNode;
}

export const GridContainer: React.FC<GridContainerProps> = ({ children }) => {
    return (
        <div className={styles.container}>
            <div className={styles.grid}>
                {children}
            </div>
        </div>
    );
};
