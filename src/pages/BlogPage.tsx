import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../components/V4/v4-tokens.css';
import styles from './BlogPage.module.css';

const BlogPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div data-theme="v4" className={styles.page}>
            <button className={styles.back} onClick={() => navigate('/')}>
                ← Home
            </button>
            <div className={styles.content}>
                <span className={styles.eyebrow}>Journal · Coming Soon</span>
                <h1 className={styles.title}>
                    Thoughts are<br />
                    <em>still forming.</em>
                </h1>
                <p className={styles.sub}>
                    Ideas take time. Writing takes longer. Check back soon.
                </p>
            </div>
        </div>
    );
};

export default BlogPage;
