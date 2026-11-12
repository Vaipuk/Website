type IntroParticle = {
  x: number;
  y: number;
  startX: number;
  startY: number;
  releaseX: number;
  releaseY: number;
  bend: number;
  delay: number;
  depth: number;
};

const clamp = (value: number) => Math.max(0, Math.min(1, value));
const noise = (index: number, offset: number) => {
  const value = Math.sin(index * 127.1 + offset * 311.7) * 43758.5453;
  return value - Math.floor(value);
};

export function introParticlePose(particle: IntroParticle, elapsed: number) {
  const time = Math.max(0, elapsed);
  const brightness = 0.55 + particle.depth * 0.4;
  if (time < 1200) {
    const progress = clamp((time - particle.delay) / (1200 - particle.delay));
    const gathered = 1 - (1 - progress) ** 3;
    const curve = Math.sin(progress * Math.PI) * particle.bend;
    return {
      x: particle.startX + (particle.x - particle.startX) * gathered + curve,
      y: particle.startY + (particle.y - particle.startY) * gathered - curve * 0.35,
      alpha: brightness * clamp(time / 220),
    };
  }
  const released = clamp((time - 1600) / 600);
  return {
    x: particle.x + particle.releaseX * released ** 2,
    y: particle.y + particle.releaseY * released ** 2,
    alpha: brightness * (1 - released) ** 2,
  };
}

export function attachIntroParticles(canvas: HTMLCanvasElement, environment?: Window): () => void {
  const context = canvas.getContext('2d');
  if (!context) return () => {};
  const runtime = environment ?? window;
  const stencil = canvas.ownerDocument.createElement('canvas');
  stencil.width = 640;
  stencil.height = 400;
  const ink = stencil.getContext('2d');
  if (!ink) return () => {};

  ink.font = '400 300px Georgia, serif';
  ink.fillStyle = '#fff';
  const metrics = ink.measureText('VB');
  ink.fillText('VB', (640 - metrics.width) / 2, (400 + metrics.actualBoundingBoxAscent - metrics.actualBoundingBoxDescent) / 2);
  const pixels = ink.getImageData(0, 0, 640, 400).data;
  const samples: { x: number; y: number }[] = [];
  for (let y = 0; y < 400; y += 2) {
    for (let x = 0; x < 640; x += 2) {
      if (pixels[(y * 640 + x) * 4 + 3] > 150) samples.push({ x: x - 320, y: y - 200 });
    }
  }
  if (!samples.length) return () => {};

  let width = 0;
  let height = 0;
  let particles: IntroParticle[] = [];
  let frame: number | null = null;
  let stopped = false;
  const started = runtime.performance.now();

  const resize = () => {
    width = Math.max(1, runtime.innerWidth);
    height = Math.max(1, runtime.innerHeight);
    const ratio = Math.min(runtime.devicePixelRatio || 1, 1.5, Math.sqrt(1800 * 1200 / (width * height)));
    canvas.width = Math.floor(width * ratio);
    canvas.height = Math.floor(height * ratio);
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    const count = width < 640 ? 600 : 1100;
    const scale = Math.min(260, width * 0.36) / metrics.width;
    particles = Array.from({ length: count }, (_, index) => {
      const sample = samples[Math.min(samples.length - 1, Math.floor((index + noise(index, 1)) * samples.length / count))];
      const depth = noise(index, 2);
      const x = width * 0.5 + sample.x * scale;
      const y = height * 0.43 + sample.y * scale;
      const side = index % 2 ? 1 : -1;
      const distance = width * (0.3 + depth * 0.7);
      const angle = Math.atan2(y - height * 0.43, x - width * 0.5) + (noise(index, 3) - 0.5) * 0.8;
      return {
        x, y, depth,
        startX: x + side * distance,
        startY: y - side * distance * 0.22 + (noise(index, 4) - 0.5) * height * 0.65,
        releaseX: Math.cos(angle) * (70 + depth * 240),
        releaseY: Math.sin(angle) * (55 + depth * 180) - 30,
        bend: side * (30 + noise(index, 5) * 110),
        delay: noise(index, 6) * 320,
      };
    });
  };

  const stop = () => {
    stopped = true;
    if (frame !== null) runtime.cancelAnimationFrame(frame);
    frame = null;
    runtime.removeEventListener('resize', resize);
    context.clearRect(0, 0, width, height);
  };

  const paint = (timestamp: number) => {
    frame = null;
    if (stopped) return;
    const elapsed = timestamp - started;
    if (elapsed >= 2200) { stop(); return; }
    context.clearRect(0, 0, width, height);
    context.globalCompositeOperation = 'lighter';
    particles.forEach((particle, index) => {
      const pose = introParticlePose(particle, elapsed);
      const previous = introParticlePose(particle, elapsed - 22);
      const dx = pose.x - previous.x;
      const dy = pose.y - previous.y;
      const distance = Math.hypot(dx, dy);
      context.fillStyle = index % 9 === 0 ? '#ffe5be' : index % 3 === 0 ? '#e8b37d' : '#b97a46';
      if (distance > 1) {
        const length = Math.min(1, 80 / distance);
        context.strokeStyle = context.fillStyle;
        context.lineWidth = 0.5 + particle.depth * 0.8;
        context.globalAlpha = pose.alpha * 0.45;
        context.beginPath();
        context.moveTo(pose.x - dx * length, pose.y - dy * length);
        context.lineTo(pose.x, pose.y);
        context.stroke();
      }
      context.globalAlpha = pose.alpha;
      context.beginPath();
      context.arc(pose.x, pose.y, 0.45 + particle.depth * 0.85, 0, Math.PI * 2);
      context.fill();
      if (index % 12 === 0) {
        context.globalAlpha = pose.alpha * 0.12;
        context.beginPath();
        context.arc(pose.x, pose.y, 3 + particle.depth * 2, 0, Math.PI * 2);
        context.fill();
      }
    });
    frame = runtime.requestAnimationFrame(paint);
  };

  resize();
  runtime.addEventListener('resize', resize, { passive: true });
  frame = runtime.requestAnimationFrame(paint);
  return stop;
}
