import React from 'react';
import { Tile } from '../Tile';
import styles from './IntroTile.module.css';

export const IntroTile: React.FC = () => {
    return (
        <Tile colSpan={2} rowSpan={2} className={styles.introTile}>
            <div className={styles.content}>
                {/* Top section with avatar and status */}
                <div className={styles.topRow}>
                    <div className={styles.avatar}>
                        <img src="/profile.png" alt="Profile" className={styles.avatarImage} />
                    </div>
                    <div className={styles.status}>
                        <span className={styles.indicator}></span>
                        <span>Available</span>
                    </div>
                </div>

                {/* Main content - centered */}
                <div className={styles.mainContent}>
                    <h1 className={styles.heading}>Hello, I'm <span className={styles.name}>Vaibhav (V)</span>.</h1>
                    <p className={styles.bio}>
                        Computer Science & Data Science senior at Arizona State University, building <span className={styles.highlight}>data-driven systems</span> to understand human behavior and <span className={styles.highlight}>generative models</span>.
                    </p>
                </div>

                {/* Bottom section - skills/interests */}
                <div className={styles.bottomRow}>
                    <div className={styles.tags}>
                        <span className={styles.tag}>React</span>
                        <span className={styles.tag}>TypeScript</span>
                        <span className={styles.tag}>Design Systems</span>
                        <span className={styles.tag}>AI/ML</span>
                    </div>
                    <div className={styles.location}>
                        <span className={styles.locationIcon}>📍</span>
                        <span>Tempe, AZ</span>
                    </div>
                </div>
            </div>
        </Tile>
    );
};
