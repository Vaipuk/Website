import React from 'react'
import { useReveal } from '../../hooks/useReveal'
import styles from './AboutBlock.module.css'

const SKILLS = ['React', 'TypeScript', 'AI / ML', 'Design Systems', 'Python', 'FastAPI']

export const AboutBlock: React.FC = () => {
  const photoRef  = useReveal()
  const labelRef  = useReveal()
  const headRef   = useReveal(100)
  const bodyRef   = useReveal(200)
  const tagsRef   = useReveal(300)
  const locRef    = useReveal(400)

  return (
    <section className={styles.about}>
      <div className="container">
        <div className={styles.grid}>
          <div ref={photoRef as React.RefObject<HTMLDivElement>} className={styles.photoWrap}>
            <img
              src="/profile.png"
              alt="Vaibhav Bharadwaj"
              className={styles.photo}
            />
            <div className={styles.statusPill}>
              <span className={styles.statusDot} />
              Tempe, AZ
            </div>
          </div>
          <div className={styles.content}>
            <span ref={labelRef as React.RefObject<HTMLSpanElement>} className="section-label">About</span>
            <h2 ref={headRef as React.RefObject<HTMLHeadingElement>} className={styles.heading}>
              Senior student,<br /><em>perpetual builder</em>
            </h2>
            <p ref={bodyRef as React.RefObject<HTMLParagraphElement>} className={styles.body}>
              I'm a CS &amp; Data Science senior at Arizona State University. I spend most of my time
              building interfaces that feel inevitable — products where the technology disappears and
              the experience takes over. Currently obsessed with AI/ML, design systems, and making
              complex things feel simple.
            </p>
            <div ref={tagsRef as React.RefObject<HTMLDivElement>} className={styles.tags}>
              {SKILLS.map(s => (
                <span key={s} className={styles.tag}>{s}</span>
              ))}
            </div>
            <p ref={locRef as React.RefObject<HTMLParagraphElement>} className={styles.location}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              Tempe, AZ · Arizona State University
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
