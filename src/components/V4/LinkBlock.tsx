import type { ReactNode } from 'react';
import { BentoTile } from './BentoGrid';
import styles from './LinkBlock.module.css';

interface LinkBlockProps {
  name: string;
  handle: string;
  icon: ReactNode;
  iconBg: string;
  to?: string;
  href?: string;
}

export function LinkBlock({ name, handle, icon, iconBg, to, href }: LinkBlockProps) {
  return (
    <BentoTile to={to} href={href} className={styles.link}>
      <div className={styles.icon} style={{ background: iconBg }}>
        {icon}
      </div>
      <div className={styles.footer}>
        <div>
          <span className={styles.name}>{name}</span>
          <span className={styles.handle}>{handle}</span>
        </div>
        <span className={styles.arrow}>↗</span>
      </div>
    </BentoTile>
  );
}
