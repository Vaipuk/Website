import styles from './Equalizer.module.css';

interface EqualizerProps {
  color?: string;  // defaults to var(--v4-accent)
  className?: string;
}

export function Equalizer({ color = 'var(--v4-accent)', className }: EqualizerProps) {
  const heights = [10, 18, 14, 22, 12];

  return (
    <div
      className={`${styles.container} ${className || ''}`}
      aria-hidden="true"
    >
      {heights.map((height, index) => (
        <span
          key={index}
          className={styles.bar}
          style={{
            height: `${height}px`,
            backgroundColor: color,
            animationDuration: `${0.5 + index * 0.13}s`,
          }}
        />
      ))}
    </div>
  );
}
