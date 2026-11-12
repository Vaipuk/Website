import assert from 'node:assert/strict';
import { test } from 'node:test';
import { attachIntroParticles, introParticlePose } from '../src/components/introParticleField.ts';

const particle = { x: 80, y: 90, startX: -100, startY: 10, releaseX: 100, releaseY: -50, bend: 30, delay: 100, depth: 0.5 };

test('particles gather precisely into the mark, hold, then disperse and disappear', () => {
  assert.equal(introParticlePose(particle, 0).alpha, 0);
  for (const elapsed of [1200, 1400, 1600]) {
    const pose = introParticlePose(particle, elapsed);
    assert.equal(pose.x, 80);
    assert.equal(pose.y, 90);
    assert.ok(pose.alpha > 0.5);
  }
  const departing = introParticlePose(particle, 1900);
  assert.ok(departing.x > 80);
  assert.ok(departing.y < 90);
  assert.ok(departing.alpha > 0 && departing.alpha < 0.5);
  assert.equal(introParticlePose(particle, 2200).alpha, 0);
  for (const elapsed of [-100, 0, 1, 100, 1199, 1601, 2199, 5000]) {
    const pose = introParticlePose(particle, elapsed);
    assert.ok(Object.values(pose).every(Number.isFinite));
    assert.ok(pose.alpha >= 0 && pose.alpha <= 1);
  }
});

function setup(width = 1200, height = 800) {
  const events = new EventTarget();
  const frames = new Map<number, FrameRequestCallback>();
  let id = 0;
  let marks = 0;
  let cleared = 0;
  const pixels = new Uint8ClampedArray(640 * 400 * 4);
  for (let y = 150; y < 250; y += 2) {
    for (let x = 220; x < 420; x += 2) pixels[(y * 640 + x) * 4 + 3] = 255;
  }
  const raster = {
    measureText: () => ({ width: 400, actualBoundingBoxAscent: 220, actualBoundingBoxDescent: 10 }),
    fillText: () => {},
    getImageData: () => ({ data: pixels }),
  };
  const context = {
    setTransform: () => {}, clearRect: () => { cleared++; },
    beginPath: () => {}, moveTo: () => {}, lineTo: () => {}, stroke: () => {},
    arc: (x: number, y: number, radius: number) => { assert.ok([x, y, radius].every(Number.isFinite)); marks++; },
    fill: () => {},
  };
  const canvas = {
    width: 0, height: 0,
    getContext: () => context,
    ownerDocument: { createElement: () => ({ getContext: () => raster }) },
  };
  const environment = {
    innerWidth: width, innerHeight: height, devicePixelRatio: 3,
    addEventListener: events.addEventListener.bind(events),
    removeEventListener: events.removeEventListener.bind(events),
    requestAnimationFrame: (callback: FrameRequestCallback) => { frames.set(++id, callback); return id; },
    cancelAnimationFrame: (frame: number) => { frames.delete(frame); },
    performance: { now: () => 0 },
  };
  const cleanup = attachIntroParticles(canvas as unknown as HTMLCanvasElement, environment as unknown as Window);
  return {
    canvas, frames, cleanup,
    get marks() { return marks; },
    get cleared() { return cleared; },
    resize: () => events.dispatchEvent(new Event('resize')),
    paint: (time: number) => { const callbacks = [...frames.values()]; frames.clear(); callbacks.forEach(callback => callback(time)); },
  };
}

test('the canvas limits backing pixels, paints the mark, and stops all work after 2.2 seconds', () => {
  const scene = setup(4000, 2400);
  assert.ok(scene.canvas.width * scene.canvas.height <= 1800 * 1200);
  assert.equal(scene.frames.size, 1);
  scene.paint(1300);
  assert.ok(scene.marks >= 1000);
  assert.equal(scene.frames.size, 1);
  scene.paint(2200);
  assert.equal(scene.frames.size, 0);
  const clears = scene.cleared;
  scene.resize();
  assert.equal(scene.cleared, clears);
  scene.cleanup();
});

test('unmount cancels pending animation and removes resize work; missing canvas contexts do nothing', () => {
  const scene = setup(390, 844);
  scene.paint(1400);
  assert.ok(scene.marks >= 500 && scene.marks <= 700);
  scene.cleanup();
  assert.equal(scene.frames.size, 0);
  const clears = scene.cleared;
  scene.resize();
  assert.equal(scene.cleared, clears);
  const cleanup = attachIntroParticles({ getContext: () => null } as unknown as HTMLCanvasElement);
  assert.doesNotThrow(cleanup);
});
