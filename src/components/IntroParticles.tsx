import { useEffect, useRef } from 'react';
import { attachIntroParticles } from './introParticleField';
import styles from './CinematicIntro.module.css';

export function IntroParticles({ className }: { className: string }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  useEffect(() => attachIntroParticles(canvas.current!), []);
  return <div className={className} aria-hidden="true">
    <canvas ref={canvas} />
    <div className={styles.typography}>
      <span>Vaibhav</span>
      <em>Bharadwaj</em>
    </div>
  </div>;
}
