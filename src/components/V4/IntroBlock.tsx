import { BentoTile } from './BentoGrid';
import styles from './IntroBlock.module.css';

export function IntroBlock() {
  return (
    <BentoTile col={2} row={2} className={styles.intro}>
      <div className={styles.top}>
        <div className={styles.avatar}>
          <img src="/profile.png" alt="Vaibhav" onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
          <span className={styles.avatarFallback}>V</span>
        </div>
        <div className={styles.statusPill}>
          <span className={styles.dot} />
          Tempe, AZ
        </div>
      </div>

      <div className={styles.bottom}>
        <h1 className={styles.name}>
          Vaibhav<br />
          <em>Bharadwaj</em>
        </h1>
        <p className={styles.bio}>
          CS &amp; Data Science senior at ASU. Building at the intersection of
          design, data, and machine intelligence.
        </p>
        <div className={styles.tags}>
          {['React', 'TypeScript', 'AI / ML', 'Design'].map(t => (
            <span key={t} className={styles.tag}>{t}</span>
          ))}
        </div>
      </div>
    </BentoTile>
  );
}
