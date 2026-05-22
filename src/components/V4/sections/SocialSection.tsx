import { Link } from 'react-router-dom';
import styles from './SocialSection.module.css';
import { SectionEyebrow } from '../SectionEyebrow';

/* ------------------------------------------------------------------ */
/* SVG Icons                                                             */
/* ------------------------------------------------------------------ */

function InstagramIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="5"/>
      <circle cx="12" cy="12" r="4"/>
      <circle cx="17.5" cy="6.5" r="0.7" fill="currentColor"/>
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56v-2c-3.2.7-3.87-1.37-3.87-1.37-.52-1.33-1.27-1.69-1.27-1.69-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.75 2.69 1.25 3.34.96.1-.74.4-1.25.72-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.46.11-3.04 0 0 .96-.31 3.15 1.18a10.9 10.9 0 0 1 5.74 0c2.18-1.49 3.14-1.18 3.14-1.18.62 1.58.23 2.75.11 3.04.74.81 1.18 1.84 1.18 3.1 0 4.42-2.7 5.39-5.27 5.68.42.36.78 1.07.78 2.16v3.2c0 .31.21.67.8.56C20.21 21.39 23.5 17.08 23.5 12 23.5 5.65 18.35.5 12 .5z"/>
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.36V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45C23.2 24 24 23.23 24 22.28V1.72C24 .77 23.2 0 22.22 0z"/>
    </svg>
  );
}

function BlogIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19V5a2 2 0 0 1 2-2h10l4 4v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z"/>
      <path d="M14 3v4a2 2 0 0 0 2 2h4"/>
      <path d="M8 13h8M8 17h6"/>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Card data                                                             */
/* ------------------------------------------------------------------ */

type ExternalCardData = {
  kind: 'external';
  platform: string;
  handle: string;
  href: string;
  bg: string;
  chipBg: string;
  ink: string;
  sub: string;
  icon: React.ReactNode;
};

type InternalCardData = {
  kind: 'internal';
  platform: string;
  handle: string;
  to: string;
  bg: string;
  chipBg: string;
  ink: string;
  sub: string;
  icon: React.ReactNode;
};

type CardData = ExternalCardData | InternalCardData;

const CARDS: CardData[] = [
  {
    kind: 'external',
    platform: 'Instagram',
    handle: '@memyselfen_i',
    href: 'https://instagram.com/memyselfen_i',
    bg: 'linear-gradient(135deg, #f9ce34 0%, #ee2a7b 50%, #6228d7 100%)',
    chipBg: 'rgba(255,255,255,0.2)',
    ink: '#fff',
    sub: 'rgba(255,255,255,0.78)',
    icon: <InstagramIcon />,
  },
  {
    kind: 'external',
    platform: 'GitHub',
    handle: '@vaipuk',
    href: 'https://github.com/vaipuk',
    bg: 'linear-gradient(135deg, #1f2328 0%, #0d1117 100%)',
    chipBg: 'rgba(255,255,255,0.08)',
    ink: '#f0f6fc',
    sub: 'rgba(240,246,252,0.65)',
    icon: <GitHubIcon />,
  },
  {
    kind: 'external',
    platform: 'LinkedIn',
    handle: 'vaibhavbharadwaj',
    href: 'https://linkedin.com/in/vaipuk',
    bg: 'linear-gradient(135deg, #0a66c2 0%, #004182 100%)',
    chipBg: 'rgba(255,255,255,0.2)',
    ink: '#fff',
    sub: 'rgba(255,255,255,0.78)',
    icon: <LinkedInIcon />,
  },
  {
    kind: 'internal',
    platform: 'Blog',
    handle: 'vb.xyz/writing',
    to: '/blog',
    bg: 'linear-gradient(135deg, #f4a261 0%, #c8553d 100%)',
    chipBg: 'rgba(255,255,255,0.2)',
    ink: '#fff',
    sub: 'rgba(255,255,255,0.82)',
    icon: <BlogIcon />,
  },
];

/* ------------------------------------------------------------------ */
/* Card component                                                        */
/* ------------------------------------------------------------------ */

function SocialCard({ card }: { card: CardData }) {
  const inner = (
    <>
      <div
        className={styles.chip}
        style={{ background: card.chipBg, color: card.ink }}
      >
        {card.icon}
      </div>
      <div className={styles.textBlock}>
        <div className={styles.platform} style={{ color: card.sub }}>
          {card.platform}
        </div>
        <div className={styles.handle} style={{ color: card.ink }}>
          {card.handle}
        </div>
      </div>
      <span className={styles.arrow} style={{ color: card.ink }} aria-hidden="true">
        ↗
      </span>
    </>
  );

  if (card.kind === 'internal') {
    return (
      <Link
        to={card.to}
        className={styles.card}
        style={{ background: card.bg }}
      >
        {inner}
      </Link>
    );
  }

  return (
    <a
      href={card.href}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.card}
      style={{ background: card.bg }}
    >
      {inner}
    </a>
  );
}

/* ------------------------------------------------------------------ */
/* Main export                                                           */
/* ------------------------------------------------------------------ */

export function SocialSection() {
  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <div>
          <SectionEyebrow>Reel Five · Elsewhere</SectionEyebrow>
          <h2 className={styles.headline}>
            Find me <em className={styles.headlineEm}>on.</em>
          </h2>
        </div>
        <span className={styles.channelCount}>4 channels — same person</span>
      </div>

      <div className={styles.grid}>
        {CARDS.map((card) => (
          <SocialCard key={card.platform} card={card} />
        ))}
      </div>
    </section>
  );
}
