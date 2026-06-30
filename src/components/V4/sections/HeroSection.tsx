import styles from './HeroSection.module.css';
import { Frame } from '../Frame';

export function HeroSection() {
  return (
    <section className={styles.hero} aria-label="Hero">
      {/* Layer 1 — Frame backdrop + gradient overlay */}
      <div className={styles.backdrop} aria-hidden="true">
        <Frame
          hue={20}
          tag="REEL · 01"
          className={styles.frameAbsolute}
        />
        <div className={styles.gradientOverlay} />
      </div>

      {/* Layer 2 — TopNav */}
      <nav className={styles.topNav} aria-label="Site navigation">
        <span className={styles.navBrand}>⏺ Vaibhav Bharadwaj</span>
        <ul className={styles.navLinks} role="list">
          <li><a href="#work" className={styles.navLink}>Work</a></li>
          <li><a href="#about" className={styles.navLink}>About</a></li>
          <li><a href="#gallery" className={styles.navLink}>Gallery</a></li>
          <li><a href="#contact" className={styles.navLink}>Contact</a></li>
        </ul>
        <span className={styles.navLocation}>Tempe, AZ · 72°F</span>
      </nav>

      {/* Layer 3 — Corner marks */}
      <div className={`${styles.corner} ${styles.cornerTL}`} aria-hidden="true" />
      <div className={`${styles.corner} ${styles.cornerTR}`} aria-hidden="true" />
      <div className={`${styles.corner} ${styles.cornerBL}`} aria-hidden="true" />
      <div className={`${styles.corner} ${styles.cornerBR}`} aria-hidden="true" />

      {/* Layer 4 — Content block */}
      <div className={styles.content}>
        <div className={styles.eyebrow}>
          — Computer Science &amp; Data Science · Arizona State University
        </div>

        <h1 className={styles.headline}>
          Vaibhav<br />
          <em className={styles.headlineEm}>Bharadwaj</em>
        </h1>

        <div className={styles.subRow}>
          <p className={styles.tagline}>
            Building things at the intersection of design, data, and machine intelligence.
          </p>

          <div className={styles.scrollIndicator}>
            <div className={styles.scrollLine} aria-hidden="true" />
            <span className={styles.scrollLabel} aria-hidden="true">SCROLL</span>
          </div>
        </div>
      </div>
    </section>
  );
}
