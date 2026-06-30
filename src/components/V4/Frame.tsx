import type { CSSProperties, ReactNode } from 'react';
import styles from './Frame.module.css';

export interface FrameProps {
  hue?: number;
  src?: string;
  alt?: string;
  tag?: string;
  label?: string;
  style?: CSSProperties;
  className?: string;
  children?: ReactNode;
}

export function Frame({
  hue = 220,
  src,
  alt = '',
  tag,
  label,
  style,
  className,
  children,
}: FrameProps) {
  const gradient = src
    ? undefined
    : [
        `radial-gradient(120% 80% at 20% 20%, oklch(60% 0.12 ${hue} / 0.55), transparent 60%)`,
        `radial-gradient(100% 80% at 80% 100%, oklch(30% 0.08 ${hue + 40} / 0.55), transparent 60%)`,
        `repeating-linear-gradient(${hue}deg, rgba(255,255,255,0.035) 0 1px, transparent 1px 7px)`,
        `linear-gradient(180deg, oklch(22% 0.03 ${hue}) 0%, oklch(10% 0.02 ${hue}) 100%)`,
      ].join(', ');

  return (
    <div
      className={`${styles.frame}${className ? ` ${className}` : ''}`}
      style={{ background: gradient, ...style }}
    >
      {src && <img src={src} alt={alt} className={styles.img} />}
      <div className={styles.vignette} aria-hidden="true" />
      <div className={styles.grain} aria-hidden="true" />
      {tag && <span className={styles.tag}>{tag}</span>}
      {label && <span className={styles.label}>{label}</span>}
      {children}
    </div>
  );
}
