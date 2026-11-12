import { BentoTile } from './BentoGrid';
import styles from './ContactBlock.module.css';

export function ContactBlock() {
  return (
    <BentoTile col={2} row={2} className={styles.contact}>
      <h2 className={styles.heading}>
        Say <em>hello</em>
      </h2>
      <p className={styles.description}>Have a project in mind? Let’s connect on LinkedIn.</p>
      <a href="https://linkedin.com/in/vaipuk" target="_blank" rel="noopener noreferrer" className={styles.btn}>
        Message on LinkedIn →
      </a>
    </BentoTile>
  );
}
