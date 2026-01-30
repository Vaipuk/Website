import React, { useEffect } from 'react';
import styles from './ProjectOverlay.module.css';

interface ProjectOverlayProps {
    isOpen: boolean;
    onClose: () => void;
    project: {
        title: string;
        description: string;
        gradient: string;
    } | null;
}

export const ProjectOverlay: React.FC<ProjectOverlayProps> = ({ isOpen, onClose, project }) => {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen]);

    if (!isOpen || !project) return null;

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.panel} onClick={e => e.stopPropagation()}>
                <button className={styles.closeButton} onClick={onClose}>&times;</button>

                <div className={styles.header} style={{ background: project.gradient }}>
                    <h1 className={styles.title}>{project.title}</h1>
                </div>

                <div className={styles.content}>
                    <p className={styles.description}>{project.description}</p>

                    <div className={styles.section}>
                        <h3>About the project</h3>
                        <p>
                            This is a standard detail view for the project.
                            Here is where you can talk about the tech stack, the challenges, and the outcome.
                        </p>
                        <p>
                            The design follows the "Claude" aesthetic with serif headings and warm dark backgrounds.
                        </p>
                    </div>

                    <div className={styles.tags}>
                        <span className={styles.tag}>React</span>
                        <span className={styles.tag}>TypeScript</span>
                        <span className={styles.tag}>Design</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
