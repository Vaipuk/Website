import { SectionEyebrow } from '../SectionEyebrow';
import styles from './WorkSection.module.css';

interface Project {
  n: string;
  kind: string;
  name: string;
  year: string;
  blurb: string;
}

const PROJECTS: Project[] = [
  {
    n: '01',
    kind: 'Design System · React',
    name: 'Tensor Aurora',
    year: '2026',
    blurb:
      'A living component library with motion primitives, color tokens, and a WYSIWYG theme editor.',
  },
  {
    n: '02',
    kind: 'AI · Python · PyTorch',
    name: 'Neural Canvas',
    year: '2025',
    blurb:
      'Sketch-to-image pipeline fine-tuned for editorial illustration, shipped as a Figma plugin.',
  },
  {
    n: '03',
    kind: 'Data Pipeline · Go',
    name: 'Data Forge',
    year: '2025',
    blurb:
      'Real-time ingest + transform engine powering dashboards for a 40-person research lab.',
  },
];

export function WorkSection() {
  return (
    <section className={styles.work} id="work" aria-label="Selected Work">
      {/* Header row */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <SectionEyebrow>Selected Work · Reel Two</SectionEyebrow>
          <h2 className={styles.headline}>
            Three <em className={styles.headlineAccent}>experiments</em>,<br />
            one thesis.
          </h2>
        </div>
        <a href="/projects" className={styles.indexLink}>
          Index <span aria-hidden="true">↗</span>
        </a>
      </div>

      {/* Project rows */}
      <div className={styles.projectList}>
        {PROJECTS.map((project) => (
          <article key={project.n} className={styles.projectRow}>
            {/* Col 1 — index */}
            <span className={styles.projectIndex}>{project.n}</span>

            {/* Col 2 — kind + name */}
            <div className={styles.projectMeta}>
              <div className={styles.projectKind}>{project.kind}</div>
              <h3 className={styles.projectName}>{project.name}</h3>
            </div>

            {/* Col 3 — blurb */}
            <p className={styles.projectBlurb}>{project.blurb}</p>

            {/* Col 4 — year + read link */}
            <div className={styles.projectActions}>
              <span className={styles.projectYear}>{project.year}</span>
              <a href="#" className={styles.projectReadLink}>
                Read <span aria-hidden="true">→</span>
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
