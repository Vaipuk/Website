type IntroParticle = {
  x: number;
  y: number;
  nameX: number;
  nameY: number;
  startX: number;
  startY: number;
  bend: number;
  delay: number;
  depth: number;
};

type Point = { x: number; y: number };
const clamp = (value: number) => Math.max(0, Math.min(1, value));
const noise = (index: number, offset: number) => {
  const value = Math.sin(index * 127.1 + offset * 311.7) * 43758.5453;
  return value - Math.floor(value);
};

export function introParticlePose(particle: IntroParticle, elapsed: number) {
  const time = Math.max(0, elapsed);
  const brightness = 0.55 + particle.depth * 0.4;
  if (time < 1050) {
    const progress = clamp((time - particle.delay) / (1050 - particle.delay));
    const gathered = 1 - (1 - progress) ** 3;
    const curve = Math.sin(progress * Math.PI) * particle.bend;
    return {
      x: particle.startX + (particle.x - particle.startX) * gathered + curve,
      y: particle.startY + (particle.y - particle.startY) * gathered - curve * 0.35,
      alpha: brightness * clamp(time / 220),
    };
  }
  const progress = clamp((time - 1250) / 700);
  const morphed = progress * progress * (3 - 2 * progress);
  const curve = progress > 0 && progress < 1 ? Math.sin(progress * Math.PI) * particle.bend * 0.18 : 0;
  return {
    x: progress === 1 ? particle.nameX : particle.x + (particle.nameX - particle.x) * morphed + curve,
    y: progress === 1 ? particle.nameY : particle.y + (particle.nameY - particle.y) * morphed - curve * 0.35,
    alpha: brightness * (1 - clamp((time - 2100) / 200)),
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
  const nameLayer = canvas.ownerDocument.createElement('canvas');
  const nameInk = nameLayer.getContext('2d');
  if (!ink || !nameInk) return () => {};

  // One local font keeps the sampled strokes and crisp name stable through late web-font loads.
  ink.font = '400 300px Georgia, serif';
  ink.fillStyle = '#fff';
  const markMetrics = ink.measureText('VB');
  ink.fillText('VB', (640 - markMetrics.width) / 2, (400 + markMetrics.actualBoundingBoxAscent - markMetrics.actualBoundingBoxDescent) / 2);
  const markPixels = ink.getImageData(0, 0, 640, 400).data;
  const markSamples: Point[][] = [[], []];
  for (let y = 0; y < 400; y += 2) {
    for (let x = 0; x < 640; x += 2) {
      if (markPixels[(y * 640 + x) * 4 + 3] > 150) markSamples[x < 320 ? 0 : 1].push({ x: x - 320, y: y - 200 });
    }
  }
  if (markSamples.some(samples => !samples.length)) return () => {};

  let width = 0;
  let height = 0;
  let particles: IntroParticle[] = [];
  let frame: number | null = null;
  let stopped = false;
  const started = runtime.performance.now();

  const stop = () => {
    if (stopped) return;
    stopped = true;
    if (frame !== null) runtime.cancelAnimationFrame(frame);
    frame = null;
    runtime.removeEventListener('resize', resize);
    context.clearRect(0, 0, width, height);
    delete canvas.dataset.ready;
  };

  const resize = () => {
    width = Math.max(1, runtime.innerWidth);
    height = Math.max(1, runtime.innerHeight);
    const ratio = Math.min(runtime.devicePixelRatio || 1, 1.5, Math.sqrt(1800 * 1200 / (width * height)));
    canvas.width = nameLayer.width = Math.floor(width * ratio);
    canvas.height = nameLayer.height = Math.floor(height * ratio);
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    nameInk.setTransform(ratio, 0, 0, ratio, 0, 0);

    const lines = ['Vaibhav', 'Bharadwaj'];
    let size = Math.min(208, width * 0.144, height * 0.19);
    const measure = (text: string, index: number) => {
      nameInk.font = `${index ? 'italic ' : ''}400 ${size}px Georgia, serif`;
      return nameInk.measureText(text);
    };
    const widestInk = Math.max(...lines.map((text, index) => {
      const metrics = measure(text, index);
      return metrics.actualBoundingBoxLeft + metrics.actualBoundingBoxRight;
    }));
    size *= Math.min(1, Math.max(1, width - 32) / widestInk);
    lines.forEach((text, index) => {
      const metrics = measure(text, index);
      const x = (width - metrics.actualBoundingBoxLeft - metrics.actualBoundingBoxRight) / 2 + metrics.actualBoundingBoxLeft;
      const y = height * 0.5 + (index ? 0.49 : -0.49) * size + (metrics.actualBoundingBoxAscent - metrics.actualBoundingBoxDescent) / 2;
      nameInk.fillStyle = index ? '#f0855a' : '#f4ece0';
      nameInk.fillText(text, x, y);
    });
    const pixels = nameInk.getImageData(0, 0, nameLayer.width, nameLayer.height).data;
    const nameSamples: Point[][] = [[], []];
    for (let y = 0; y < nameLayer.height; y += 2) {
      for (let x = 0; x < nameLayer.width; x += 2) {
        if (pixels[(y * nameLayer.width + x) * 4 + 3] > 150) nameSamples[y < nameLayer.height * 0.5 ? 0 : 1].push({ x: x * width / nameLayer.width, y: y * height / nameLayer.height });
      }
    }
    if (nameSamples.some(samples => !samples.length)) { stop(); return; }

    const count = width < 640 ? 600 : 1100;
    const scale = Math.min(260, width * 0.36) / markMetrics.width;
    particles = Array.from({ length: count }, (_, index) => {
      const group = index < count / 2 ? 0 : 1;
      const position = (index % (count / 2) + noise(index, 1)) / (count / 2);
      const sample = markSamples[group][Math.min(markSamples[group].length - 1, Math.floor(position * markSamples[group].length))];
      const target = nameSamples[group][Math.min(nameSamples[group].length - 1, Math.floor(position * nameSamples[group].length))];
      const depth = noise(index, 2);
      const x = width * 0.5 + sample.x * scale;
      const y = height * 0.43 + sample.y * scale;
      const side = index % 2 ? 1 : -1;
      const distance = width * (0.3 + depth * 0.7);
      return {
        x, y, nameX: target.x, nameY: target.y, depth,
        startX: x + side * distance,
        startY: y - side * distance * 0.22 + (noise(index, 4) - 0.5) * height * 0.65,
        bend: side * (30 + noise(index, 5) * 110),
        delay: noise(index, 6) * 320,
      };
    });
    canvas.dataset.ready = 'true';
  };

  const paint = (timestamp: number) => {
    frame = null;
    if (stopped) return;
    const elapsed = timestamp - started;
    if (elapsed >= 3600) { stop(); return; }
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
    context.globalCompositeOperation = 'source-over';
    context.globalAlpha = clamp((elapsed - 2100) / 200);
    context.drawImage(nameLayer, 0, 0, width, height);
    frame = runtime.requestAnimationFrame(paint);
  };

  resize();
  if (!stopped) {
    runtime.addEventListener('resize', resize, { passive: true });
    frame = runtime.requestAnimationFrame(paint);
  }
  return stop;
}
