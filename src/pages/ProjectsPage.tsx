import { Link, useSearchParams } from 'react-router-dom';
import { ModalDialog } from '../components/ModalDialog';
import { PROJECTS, getProjectFromSearch } from '../data/projects';
import '../components/V4/v4-tokens.css';
import styles from './ProjectsPage.module.css';

export const ProjectsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const selected = getProjectFromSearch(searchParams.toString());
  const closeProject = () => {
    const next = new URLSearchParams(searchParams);
    next.delete('project');
    setSearchParams(next, { replace: true });
  };

  return (
    <div data-theme="v4" className={styles.page}>
      <div className={styles.inner}>
        <Link className={styles.back} to="/">← Home</Link>
        <span className={styles.eyebrow}>Selected Work · The Index</span>
        <h1 className={styles.pageTitle}>Pro<em>jects.</em></h1>
        <p className={styles.subtitle}>Experiments, tools, and things I built to learn something.</p>

        <div className={styles.projectList}>
          {PROJECTS.map(project => (
            <article key={project.id} className={styles.projectRow}>
              <span className={styles.projectIndex}>{project.index}</span>
              <div className={styles.projectMeta}>
                <div className={styles.projectKind}>{project.kind}</div>
                <h2 className={styles.projectName}>{project.title}</h2>
              </div>
              <p className={styles.projectBlurb}>{project.description}</p>
              <div className={styles.projectActions}>
                <span className={styles.projectYear}>{project.year}</span>
                <button
                  id={`project-${project.id}`}
                  type="button"
                  className={styles.projectView}
                  aria-label={`Read about ${project.title}`}
                  aria-haspopup="dialog"
                  onClick={() => setSearchParams({ project: project.id })}
                >
                  Read <span aria-hidden="true">→</span>
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>

      {selected && (
        <ModalDialog
          className={styles.panel}
          aria-labelledby="project-title"
          fallbackFocusId={`project-${selected.id}`}
          onClose={closeProject}
        >
          <div className={styles.panelAccent} style={{ background: selected.gradient }} />
          <button type="button" className={styles.panelClose} onClick={closeProject} aria-label="Close project">×</button>
          <div className={styles.panelBody}>
            <span className={styles.panelKind}>{selected.kind} · {selected.year}</span>
            <h2 id="project-title" className={styles.panelTitle}>{selected.title}</h2>
            <p className={styles.panelDesc}>{selected.description}</p>
            <p className={styles.panelDetails}>{selected.details}</p>
            <div className={styles.panelTags}>
              {selected.tags.map(tag => <span key={tag} className={styles.tag}>{tag}</span>)}
            </div>
            {selected.caseStudy?.map(section => (
              <section key={section.title} className={styles.caseSection}>
                <h3>{section.title}</h3>
                <p>{section.text}</p>
              </section>
            ))}
            <a className={styles.profileLink} href="https://github.com/vaipuk" target="_blank" rel="noopener noreferrer">
              Visit my GitHub profile <span aria-hidden="true">↗</span>
            </a>
          </div>
        </ModalDialog>
      )}
    </div>
  );
};
