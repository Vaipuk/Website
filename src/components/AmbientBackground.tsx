import { useEffect, useRef } from 'react';
import { attachAmbientPointer } from './ambientPointer';
import styles from './AmbientBackground.module.css';

export function AmbientBackground() {
  const layer = useRef<HTMLDivElement>(null);
  useEffect(() => attachAmbientPointer(layer.current!), []);

  return (
    <div ref={layer} className={styles.layer} aria-hidden="true">
      <div className={styles.light} />
      <div className={styles.halo} />
    </div>
  );
}
