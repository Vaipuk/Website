import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './BlogPage.module.css';

const BlogPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className={styles.container}>
            <button className={styles.backButton} onClick={() => navigate('/')}>
                ← Back
            </button>
            <div className={styles.content}>
                <p className={styles.message}>Thoughts are still forming....</p>
            </div>
        </div>
    );
};

export default BlogPage;
