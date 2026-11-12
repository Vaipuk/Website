import { SectionEyebrow } from '../SectionEyebrow';
import { Link } from 'react-router-dom';
import { PROJECTS } from '../../../data/projects';
import styles from './WorkSection.module.css';

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
        <Link to="/projects" className={styles.indexLink}>
          Index <span aria-hidden="true">↗</span>
        </Link>
      </div>

      {/* Project rows */}
      <div className={styles.projectList}>
        {PROJECTS.slice(0, 3).map((project) => (
          <article key={project.id} className={styles.projectRow}>
            {/* Col 1 — index */}
            <span className={styles.projectIndex}>{project.index}</span>

            {/* Col 2 — kind + name */}
            <div className={styles.projectMeta}>
              <div className={styles.projectKind}>{project.kind}</div>
              <h3 className={styles.projectName}>{project.title}</h3>
            </div>

            {/* Col 3 — blurb */}
            <p className={styles.projectBlurb}>{project.description}</p>

            {/* Col 4 — year + read link */}
            <div className={styles.projectActions}>
              <span className={styles.projectYear}>{project.year}</span>
              <Link to={`/projects?project=${project.id}`} className={styles.projectReadLink} aria-label={`Read about ${project.title}`}>
                Read <span aria-hidden="true">→</span>
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
