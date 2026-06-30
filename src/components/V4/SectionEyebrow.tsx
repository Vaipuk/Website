interface SectionEyebrowProps {
  children: React.ReactNode;
  className?: string;
}

export function SectionEyebrow({ children, className }: SectionEyebrowProps) {
  return (
    <div
      className={className}
      style={{
        fontFamily: 'var(--v4-mono)',
        fontSize: '10px',
        color: 'var(--v4-accent)',
        letterSpacing: '0.22em',
        textTransform: 'uppercase',
      }}
    >
      {children}
    </div>
  );
}
