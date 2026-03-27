import React from 'react'
import { Link } from 'react-router-dom'
import { useReveal } from '../../hooks/useReveal'
import styles from './PagesBlock.module.css'

export const PagesBlock: React.FC = () => {
  const labelRef   = useReveal()
  const galleryRef = useReveal(100)
  const blogRef    = useReveal(200)

  return (
    <section className={styles.pages}>
      <div className="container">
        <span ref={labelRef as React.RefObject<HTMLSpanElement>} className="section-label">Explore</span>
        <div className={styles.grid}>
          <Link
            to="/gallery"
            ref={galleryRef as React.RefObject<HTMLAnchorElement>}
            className={styles.card}
          >
            <div className={styles.cardBg} style={{ background: 'linear-gradient(145deg, #1e2a4a, #0d1525)' }} />
            <div className={styles.cardContent}>
              <span className={styles.cardIcon}>🖼️</span>
              <div>
                <h3 className={styles.cardTitle}>Gallery</h3>
                <p className={styles.cardDesc}>Photos &amp; travels</p>
              </div>
              <span className={styles.cardArrow}>→</span>
            </div>
          </Link>
          <Link
            to="/blog"
            ref={blogRef as React.RefObject<HTMLAnchorElement>}
            className={styles.card}
          >
            <div className={styles.cardBg} style={{ background: 'linear-gradient(145deg, #2a1e1e, #150d0d)' }} />
            <div className={styles.cardContent}>
              <span className={styles.cardIcon}>✍️</span>
              <div>
                <h3 className={styles.cardTitle}>Blog</h3>
                <p className={styles.cardDesc}>Thoughts &amp; writing</p>
              </div>
              <span className={styles.cardArrow}>→</span>
            </div>
          </Link>
        </div>
      </div>
    </section>
  )
}
