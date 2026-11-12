import { useEffect, useRef, type CSSProperties } from 'react';
import { IntroParticles } from './IntroParticles';
import { INTRO_DURATION_MS } from './introLifecycle';
import styles from './CinematicIntro.module.css';

const PRINTS = [
  { image: 'DSC00458', x: -34, y: -26, depth: -160, roll: -18, yaw: 18, reveal: 0.12 },
  { image: 'DSC00474', x: -9, y: -34, depth: -370, roll: 10, yaw: -20, reveal: 0.15 },
  { image: 'DSC00494', x: 32, y: -23, depth: -220, roll: 16, yaw: -22, reveal: 0.18 },
  { image: 'cover', x: 37, y: 12, depth: -100, roll: -10, yaw: -18, reveal: 0.13 },
  { image: 'DSC00458', x: 18, y: 30, depth: -260, roll: 12, yaw: 20, reveal: 0.19 },
  { image: 'DSC00494', x: -30, y: 28, depth: -80, roll: 14, yaw: 14, reveal: 0.16 },
  { image: 'cover', x: -39, y: 1, depth: -450, roll: -7, yaw: 24, reveal: 0.21 },
  { image: 'DSC00474', x: 5, y: 36, depth: -550, roll: -14, yaw: 18, reveal: 0.17 },
];

export function CinematicIntro({ onSkip }: { onSkip: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  // Open after page dialogs so the opening stays above deep-linked project details.
  useEffect(() => {
    const element = dialog.current;
    if (element && !element.open) element.showModal();
  }, []);

  return (
    <dialog
      ref={dialog}
      className={styles.intro}
      style={{ '--intro-duration': `${INTRO_DURATION_MS}ms` } as CSSProperties}
      aria-label="Vaibhav Bharadwaj — opening animation"
      data-cinematic-intro=""
    >
      <div className={styles.matte} aria-hidden="true" />
      <div className={styles.exposure} aria-hidden="true" />

      <div className={styles.stage} aria-hidden="true">
        <div className={styles.world}>
          {PRINTS.map((print, index) => (
            <figure
              key={index}
              className={styles.print}
              style={{
                '--x': `${print.x}vw`,
                '--y': `${print.y}vh`,
                '--depth': `${print.depth}px`,
                '--roll': `${print.roll}deg`,
                '--yaw': `${print.yaw}deg`,
                '--reveal-delay': print.reveal,
              } as CSSProperties}
            >
              <div className={styles.imageWindow}>
                <img
                  src={`/thumbnails/trips/Italy-2024/${print.image}.webp`}
                  alt=""
                  width="480"
                  height="320"
                  decoding="async"
                  draggable="false"
                />
              </div>
            </figure>
          ))}
        </div>
      </div>
      <IntroParticles className={styles.particles} />

      <button className={styles.skip} type="button" onClick={onSkip} autoFocus>
        Skip intro <span aria-hidden="true">↗</span>
      </button>
    </dialog>
  );
}
