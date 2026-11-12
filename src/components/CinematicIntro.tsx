import { useEffect, useRef } from 'react';
import styles from './CinematicIntro.module.css';

export function CinematicIntro({ onSkip }: { onSkip: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (!dialog.current!.open) dialog.current!.showModal();
  }, []);

  return (
    <dialog ref={dialog} className={styles.intro} aria-label="Opening animation" data-cinematic-intro="">
      <div className={`${styles.shutter} ${styles.top}`} aria-hidden="true" />
      <div className={`${styles.shutter} ${styles.bottom}`} aria-hidden="true" />
      <div className={styles.film} aria-hidden="true">
        <div className={styles.registration} />
        <div className={styles.beam} />
        <div className={styles.title}>
          <span>Vaibhav</span>
          <span className={styles.surname}>Bharadwaj</span>
        </div>
      </div>
      <button className={styles.skip} type="button" onClick={onSkip} autoFocus>
        Skip intro
      </button>
    </dialog>
  );
}
