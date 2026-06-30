import { SectionEyebrow } from '../SectionEyebrow';
import styles from './AboutSection.module.css';

export function AboutSection() {
  return (
    <section className={styles.about} id="about" aria-label="About">
      <div className={styles.grid}>
        {/* Left column */}
        <div className={styles.left}>
          <SectionEyebrow>About · Chapter One</SectionEyebrow>
          <h2 className={styles.headline}>
            Senior student,<br />
            <em className={styles.headlineAccent}>perpetual builder.</em>
          </h2>
        </div>

        {/* Right column */}
        <div className={styles.right}>
          <p className={styles.bio}>
            CS &amp; Data Science senior at Arizona State. I spend most of my
            time building interfaces that feel inevitable — products where the
            technology disappears and the experience takes over. Currently
            obsessed with AI/ML, design systems, and making complex things feel
            simple.
          </p>

          <div className={styles.stats}>
            <div className={styles.stat}>
              <p className={styles.statNumber}>B.S. 2026</p>
              <span className={styles.statLabel}>Graduating</span>
            </div>
            <div className={styles.stat}>
              <p className={styles.statNumber}>12+</p>
              <span className={styles.statLabel}>Shipped projects</span>
            </div>
            <div className={styles.stat}>
              <p className={styles.statNumber}>Tempe</p>
              <span className={styles.statLabel}>Based in AZ</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
