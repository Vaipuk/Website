import assert from 'node:assert/strict';
import { test } from 'node:test';
import { attachIntroParticles, introParticlePose } from '../src/components/introParticleField.ts';

const particle = { x: 80, y: 90, nameX: 240, nameY: 190, startX: -100, startY: 10, bend: 30, delay: 100, depth: 0.5 };

test('the same particles hold VB before moving into exact stationary name endpoints', () => {
  assert.equal(introParticlePose(particle, 0).alpha, 0);
  for (const elapsed of [1050, 1150, 1250]) {
    const pose = introParticlePose(particle, elapsed);
    assert.equal(pose.x, 80);
    assert.equal(pose.y, 90);
    assert.ok(pose.alpha > 0.5);
  }
  for (const elapsed of [1400, 1600, 1800]) {
    const pose = introParticlePose(particle, elapsed);
    assert.ok(pose.x > 80 && pose.x < 240, `the field should be morphing at ${elapsed}ms`);
    assert.ok(pose.y > 90 && pose.y < 190);
    assert.ok(pose.alpha > 0.5, 'the material stays visible throughout the morph');
  }
  for (const elapsed of [1950, 2050, 2100, 2200, 2700]) {
    const pose = introParticlePose(particle, elapsed);
    assert.equal(pose.x, 240);
    assert.equal(pose.y, 190);
  }
  assert.ok(introParticlePose(particle, 2200).alpha > 0);
  assert.equal(introParticlePose(particle, 2300).alpha, 0);
  for (const elapsed of [-100, 0, 1, 1049, 1251, 1949, 2299, 5000]) {
    const pose = introParticlePose(particle, elapsed);
    assert.ok(Object.values(pose).every(Number.isFinite));
    assert.ok(pose.alpha >= 0 && pose.alpha <= 1);
  }
});

test('settled fractional coordinates use the actual target without floating-point drift', () => {
  const pose = introParticlePose({ ...particle, x: 80.3, y: 90.7, nameX: 0.1, nameY: 0.2 }, 1950);
  assert.equal(pose.x, 0.1);
  assert.equal(pose.y, 0.2);
});
type TextDraw = { text: string; x: number; y: number; font: string; left: number; right: number; ascent: number; descent: number };

function setup(width = 1200, height = 800, emptyMask = false) {
  const events = new EventTarget();
  const frames = new Map<number, FrameRequestCallback>();
  let id = 0;
  let cleared = 0;
  let samples = 0;
  const marks: { x: number; y: number; radius: number; alpha: number }[] = [];
  const texts: { source: { draws: TextDraw[] }; x: number; y: number; width: number; height: number; alpha: number }[] = [];
  const masks: { width: number; height: number; draws: TextDraw[] }[] = [];
  const makeMask = () => {
    let maskWidth = 0;
    let maskHeight = 0;
    const mask = {
      draws: [] as TextDraw[],
      get width() { return maskWidth; },
      set width(value: number) { maskWidth = value; mask.draws.length = 0; },
      get height() { return maskHeight; },
      set height(value: number) { maskHeight = value; mask.draws.length = 0; },
    };
    let scale = 1;
    const raster = {
      font: '400 300px Georgia, serif', fillStyle: '#fff',
      setTransform: (ratio: number) => { scale = ratio; },
      clearRect: () => { mask.draws.length = 0; },
      measureText: (text: string) => {
        const size = Number(raster.font.match(/([\d.]+)px/)?.[1]);
        const overhang = raster.font.includes('italic') ? size * 0.08 : 0;
        return { width: text.length * size * 0.52, actualBoundingBoxLeft: overhang,
          actualBoundingBoxRight: text.length * size * 0.52 + overhang,
          actualBoundingBoxAscent: size * 0.75, actualBoundingBoxDescent: size * 0.18 };
      },
      fillText: (text: string, x: number, y: number) => {
        const metrics = raster.measureText(text);
        mask.draws.push({ text, x, y, font: raster.font, left: metrics.actualBoundingBoxLeft,
          right: metrics.actualBoundingBoxRight, ascent: metrics.actualBoundingBoxAscent, descent: metrics.actualBoundingBoxDescent });
      },
      getImageData: () => {
        samples++;
        const pixels = new Uint8ClampedArray(mask.width * mask.height * 4);
        if (!emptyMask) for (const draw of mask.draws) {
          for (let y = Math.max(0, Math.ceil((draw.y - draw.ascent) * scale)); y < Math.min(mask.height, (draw.y + draw.descent) * scale); y++) {
            for (let x = Math.max(0, Math.ceil((draw.x - draw.left) * scale)); x < Math.min(mask.width, (draw.x + draw.right) * scale); x++) pixels[(y * mask.width + x) * 4 + 3] = 255;
          }
        }
        return { data: pixels };
      },
    };
    masks.push(mask);
    return Object.assign(mask, { getContext: () => raster });
  };
  const context = {
    globalAlpha: 1,
    setTransform: () => {}, clearRect: () => { cleared++; marks.length = 0; texts.length = 0; },
    beginPath: () => {}, moveTo: () => {}, lineTo: () => {}, stroke: () => {},
    arc: (x: number, y: number, radius: number) => {
      assert.ok([x, y, radius].every(Number.isFinite));
      marks.push({ x, y, radius, alpha: context.globalAlpha });
    },
    fill: () => {},
    drawImage: (source: { draws: TextDraw[] }, x: number, y: number, drawWidth: number, drawHeight: number) => {
      texts.push({ source, x, y, width: drawWidth, height: drawHeight, alpha: context.globalAlpha });
    },
  };
  const canvas = {
    width: 0, height: 0, dataset: {} as Record<string, string>,
    getContext: () => context,
    ownerDocument: { createElement: makeMask },
  };
  const environment = {
    innerWidth: width, innerHeight: height, devicePixelRatio: 3,
    addEventListener: events.addEventListener.bind(events), removeEventListener: events.removeEventListener.bind(events),
    requestAnimationFrame: (callback: FrameRequestCallback) => { frames.set(++id, callback); return id; },
    cancelAnimationFrame: (frame: number) => { frames.delete(frame); }, performance: { now: () => 0 },
  };
  const cleanup = attachIntroParticles(canvas as unknown as HTMLCanvasElement, environment as unknown as Window);
  return {
    canvas, frames, cleanup, marks, texts, masks,
    get samples() { return samples; }, get cleared() { return cleared; },
    resize: (nextWidth = environment.innerWidth, nextHeight = environment.innerHeight) => {
      environment.innerWidth = nextWidth; environment.innerHeight = nextHeight;
      events.dispatchEvent(new Event('resize'));
    },
    paint: (time: number) => { const callbacks = [...frames.values()]; frames.clear(); callbacks.forEach(callback => callback(time)); },
  };
}

test('crisp lettering resolves at the sampled name geometry only after the points settle', () => {
  const scene = setup();
  assert.equal(scene.canvas.dataset.ready, 'true');
  scene.paint(1950);
  const endpoints = scene.marks.filter(mark => mark.radius < 2).map(({ x, y }) => ({ x, y }));
  assert.equal(endpoints.length, 1100);
  assert.ok(scene.texts.every(text => text.alpha === 0));
  scene.paint(2200);
  assert.equal(scene.texts.length, 1);
  const name = scene.texts[0];
  assert.equal(name.alpha, 0.5);
  assert.deepEqual([name.x, name.y, name.width, name.height], [0, 0, 1200, 800]);
  assert.deepEqual(name.source.draws.map(draw => draw.text), ['Vaibhav', 'Bharadwaj']);
  for (const [index, endpoint] of endpoints.entries()) {
    const line = name.source.draws[index < 550 ? 0 : 1];
    assert.ok(endpoint.x >= line.x - line.left && endpoint.x <= line.x + line.right);
    assert.ok(endpoint.y >= line.y - line.ascent && endpoint.y <= line.y + line.descent);
  }
  const cachedSampling = scene.samples;
  scene.paint(2300);
  assert.equal(scene.texts[0].alpha, 1);
  assert.ok(scene.marks.every(mark => mark.alpha === 0));
  scene.paint(2700);
  assert.equal(scene.texts[0].alpha, 1);
  assert.equal(scene.samples, cachedSampling, 'painting never reads text pixels again');
  scene.cleanup();
});

test('320px name layout fits actual italic ink with side gutters and keeps the phone particle budget', () => {
  const scene = setup(320, 640);
  scene.paint(2200);
  const name = scene.texts[0];
  assert.ok(name);
  for (const draw of name.source.draws) {
    assert.ok(draw.x - draw.left >= 15.9);
    assert.ok(draw.x + draw.right <= 304.1);
    assert.ok(draw.font.includes('Georgia'));
  }
  assert.ok(name.source.draws[1].font.includes('italic'));
  assert.equal(scene.marks.filter(mark => mark.radius < 2).length, 600);
  scene.cleanup();
});

test('sampled endpoints match cached text pixels even when backing dimensions round down', () => {
  const scene = setup(767, 541);
  scene.paint(1950);
  for (const mark of scene.marks.filter(mark => mark.radius < 2)) {
    const pixelX = mark.x * scene.canvas.width / 767;
    const pixelY = mark.y * scene.canvas.height / 541;
    assert.ok(Math.abs(pixelX - Math.round(pixelX)) < 1e-8);
    assert.ok(Math.abs(pixelY - Math.round(pixelY)) < 1e-8);
  }
  scene.cleanup();
});
test('resize keeps deterministic particle identities and the current clock without starting another loop', () => {
  const scene = setup();
  scene.paint(1600);
  const before = scene.marks.map(mark => ({ ...mark }));
  scene.resize(900, 600);
  assert.equal(scene.frames.size, 1);
  scene.resize(1200, 800);
  scene.paint(1600);
  assert.equal(scene.marks.length, before.length);
  scene.marks.forEach((mark, index) => assert.deepEqual(mark, before[index]));
  scene.resize(900, 600);
  scene.paint(2400);
  assert.equal(scene.texts[0]?.alpha, 1, 'resize does not restart VB or the name handoff');
  scene.cleanup();
});

test('the bounded canvas remains alive through the name hold and stops at the existing deadline', () => {
  const scene = setup(4000, 2400);
  assert.ok(scene.canvas.width * scene.canvas.height <= 1800 * 1200);
  assert.ok(scene.masks.every(mask => mask.width * mask.height <= 1800 * 1200));
  assert.equal(scene.frames.size, 1);
  scene.paint(2700);
  assert.equal(scene.texts[0]?.alpha, 1);
  assert.equal(scene.frames.size, 1);
  scene.paint(3600);
  assert.equal(scene.frames.size, 0);
  const clears = scene.cleared;
  scene.resize();
  assert.equal(scene.cleared, clears);
  scene.cleanup();
});

test('cleanup cancels morph work and unavailable or empty Canvas leaves the DOM fallback enabled', () => {
  const scene = setup(390, 844);
  scene.paint(1500);
  scene.cleanup();
  scene.cleanup();
  assert.equal(scene.frames.size, 0);
  const clears = scene.cleared;
  scene.resize();
  assert.equal(scene.cleared, clears);
  const canvas = { getContext: () => null, dataset: {} };
  const cleanup = attachIntroParticles(canvas as unknown as HTMLCanvasElement);
  assert.doesNotThrow(cleanup);
  assert.deepEqual(canvas.dataset, {});
  const empty = setup(320, 640, true);
  assert.deepEqual(empty.canvas.dataset, {});
  assert.equal(empty.frames.size, 0);
  empty.cleanup();
});