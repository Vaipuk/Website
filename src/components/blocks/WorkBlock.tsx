import React from 'react'
import { Link } from 'react-router-dom'
import { useReveal } from '../../hooks/useReveal'
import styles from './WorkBlock.module.css'

const PREVIEW_PROJECTS = [
  {
    id: 'tensor-aurora',
    title: 'Tensor Aurora',
    label: 'Design System · React',
    gradient: 'linear-gradient(145deg, #1e3a5f, #0d1f3c)',
  },
  {
    id: 'neural-canvas',
    title: 'Neural Canvas',
    label: 'AI · Python · PyTorch',
    gradient: 'linear-gradient(145deg, #3d1e1e, #1f0d0d)',
  },
  {
    id: 'data-forge',
    title: 'Data Forge',
    label: 'Data Pipeline · Go',
    gradient: 'linear-gradient(145deg, #1e3a2f, #0d1f18)',
  },
]

export const WorkBlock: React.FC = () => {
  const headerRef = useReveal()
  const card1Ref  = useReveal(100)
  const card2Ref  = useReveal(200)
  const card3Ref  = useReveal(300)
  const cardRefs  = [card1Ref, card2Ref, card3Ref]

  return (
    <section className={styles.work}>
      <div className="container">
        <div ref={headerRef as React.RefObject<HTMLDivElement>} className={styles.header}>
          <h2 className={styles.title}>Selected Work</h2>
          <Link to="/projects" className={styles.viewAll}>View all →</Link>
        </div>
        <div className={styles.grid}>
          {PREVIEW_PROJECTS.map((p, i) => (
            <Link
              key={p.id}
              to="/projects"
              ref={cardRefs[i] as React.RefObject<HTMLAnchorElement>}
              className={styles.card}
            >
              <div className={styles.cardBg} style={{ background: p.gradient }} />
              <div className={styles.cardContent}>
                <span className={styles.cardLabel}>{p.label}</span>
                <h3 className={styles.cardTitle}>{p.title}</h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
