import { useEffect, useRef } from 'react';
import { attachIntroParticles } from './introParticleField';

export function IntroParticles({ className }: { className: string }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  useEffect(() => attachIntroParticles(canvas.current!), []);
  return <canvas ref={canvas} className={className} aria-hidden="true" />;
}
