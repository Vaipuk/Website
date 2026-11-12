import { SectionEyebrow } from '../SectionEyebrow';
import styles from './AboutSection.module.css';

export function AboutSection() {
  return (
    <section className={styles.about} id="about" aria-label="About">
      <div className={styles.grid}>
        {/* Left column */}
        <div className={styles.left}>
          <SectionEyebrow>About · Behind the work</SectionEyebrow>
          <h2 className={styles.headline}>
            Curious by nature,<br />
            <em className={styles.headlineAccent}>a builder by habit.</em>
          </h2>
        </div>

        {/* Right column */}
        <div className={styles.right}>
          <p className={styles.bio}>
            I’m Vaibhav, a builder based in Tempe, Arizona. I’m interested in
            AI/ML, data science, and interfaces that make complex ideas easier
            to use. This is where I share my projects, photographs, and the
            things I’m exploring.
          </p>
        </div>
      </div>
    </section>
  );
}
