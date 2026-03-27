import React from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './BlogPage.module.css'

export const BlogPage: React.FC = () => {
  const navigate = useNavigate()

  return (
    <div className={styles.page}>
      <button className={styles.back} onClick={() => navigate('/')}>
        ← Home
      </button>
      <div className={styles.content}>
        <h1 className={styles.title}>
          <em>Thoughts are<br />still forming...</em>
        </h1>
        <p className={styles.sub}>
          Ideas take time. Writing takes longer. Check back soon.
        </p>
      </div>
    </div>
  )
}
