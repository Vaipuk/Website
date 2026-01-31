import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './BlogPage.module.css';

const BlogPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className={styles.page}>
            <header className={styles.header}>
                <button onClick={() => navigate('/')} className={styles.backButton}>← Back to Home</button>
                <h1>Blog</h1>
            </header>
            <div className={styles.content}>
                <p className={styles.message}>Thoughts are still forming....</p>
            </div>
        </div>
    );
};

export default BlogPage;
