import React from 'react'
import { useReveal } from '../../hooks/useReveal'
import styles from './HeroBlock.module.css'

const TAGS = ['React', 'TypeScript', 'AI / ML', 'Design Systems', 'Python']

export const HeroBlock: React.FC = () => {
  const eyebrowRef = useReveal()
  const nameRef = useReveal(100)
  const subRef = useReveal(200)
  const tagsRef = useReveal(300)

  return (
    <section className={styles.hero}>
      <div className={styles.inner}>
        <p ref={eyebrowRef as React.RefObject<HTMLParagraphElement>} className={styles.eyebrow}>
          Computer Science &amp; Data Science · Arizona State University
        </p>
        <h1 ref={nameRef as React.RefObject<HTMLHeadingElement>} className={styles.name}>
          Vaibhav<br /><em>Bharadwaj</em>
        </h1>
        <p ref={subRef as React.RefObject<HTMLParagraphElement>} className={styles.sub}>
          Building things at the intersection of design, data, and machine intelligence.
        </p>
        <div ref={tagsRef as React.RefObject<HTMLDivElement>} className={styles.tags}>
          {TAGS.map(tag => (
            <span key={tag} className={styles.tag}>{tag}</span>
          ))}
        </div>
      </div>
      <div className={styles.scrollCue}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="5" x2="12" y2="19" />
          <polyline points="19 12 12 19 5 12" />
        </svg>
        scroll
      </div>
    </section>
  )
}
