import { BentoTile } from './BentoGrid';
import styles from './ProjectBlock.module.css';

interface ProjectBlockProps {
  title: string;
  tag: string;
  gradient: string;
  to?: string;
}

export function ProjectBlock({ title, tag, gradient, to = '/projects' }: ProjectBlockProps) {
  return (
    <BentoTile col={2} to={to} className={styles.project}>
      <div className={styles.bg} style={{ background: gradient }} />
      <div className={styles.grain} />
      <div className={styles.content}>
        <span className={styles.tag}>{tag}</span>
        <h2 className={styles.title}>{title}</h2>
      </div>
    </BentoTile>
  );
}
