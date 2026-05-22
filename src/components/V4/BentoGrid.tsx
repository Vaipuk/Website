import type { CSSProperties, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import styles from './BentoGrid.module.css';

interface BentoGridProps {
  children: ReactNode;
}

interface BentoTileProps {
  col?: 1 | 2 | 3 | 4;
  row?: 1 | 2 | 3;
  className?: string;
  children: ReactNode;
  to?: string;
  href?: string;
  style?: CSSProperties;
}

function buildClass(col: number, row: number, extra?: string) {
  return [
    styles.tile,
    col === 2 ? styles.col2 : col === 3 ? styles.col3 : col === 4 ? styles.col4 : '',
    row === 2 ? styles.row2 : row === 3 ? styles.row3 : '',
    extra ?? '',
  ]
    .filter(Boolean)
    .join(' ');
}

export function BentoGrid({ children }: BentoGridProps) {
  return <div className={styles.grid}>{children}</div>;
}

export function BentoTile({
  col = 1,
  row = 1,
  className,
  children,
  to,
  href,
  style,
}: BentoTileProps) {
  const cls = buildClass(col, row, className);

  if (to) {
    return (
      <Link to={to} className={cls} style={style}>
        {children}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls} style={style}>
        {children}
      </a>
    );
  }

  return (
    <div className={cls} style={style}>
      {children}
    </div>
  );
}
