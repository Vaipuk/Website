import assert from 'node:assert/strict';
import { test } from 'node:test';
import { attachAmbientPointer } from '../src/components/ambientPointer.ts';

function setup(enabled = true) {
  const events = new EventTarget();
  const preference = Object.assign(new EventTarget(), { matches: enabled });
  const frames = new Map<number, FrameRequestCallback>();
  const properties = new Map<string, string>();
  const layer = { dataset: {} as Record<string, string>, style: { setProperty: (name: string, value: string) => properties.set(name, value) } };
  let id = 0;
  const environment = {
    addEventListener: events.addEventListener.bind(events),
    removeEventListener: events.removeEventListener.bind(events),
    matchMedia: () => preference,
    requestAnimationFrame: (callback: FrameRequestCallback) => { frames.set(++id, callback); return id; },
    cancelAnimationFrame: (frame: number) => { frames.delete(frame); },
  };
  const cleanup = attachAmbientPointer(layer as unknown as HTMLElement, environment as unknown as Window);
  return {
    layer, properties, frames, cleanup,
    move: (x: number, y: number, pointerType = 'mouse') => events.dispatchEvent(Object.assign(new Event('pointermove'), { clientX: x, clientY: y, pointerType })),
    leave: () => events.dispatchEvent(Object.assign(new Event('pointerout'), { relatedTarget: null })),
    blur: () => events.dispatchEvent(new Event('blur')),
    setEnabled: (value: boolean) => { preference.matches = value; preference.dispatchEvent(new Event('change')); },
    paint: () => { const callbacks = [...frames.values()]; frames.clear(); callbacks.forEach(callback => callback(0)); },
  };
}

test('pointer light paints the latest position once per frame without an idle loop', () => {
  const light = setup();
  light.move(120, 240);
  light.move(160, 280);
  assert.equal(light.frames.size, 1);
  light.paint();
  assert.equal(light.properties.get('--light-x'), '160px');
  assert.equal(light.properties.get('--light-y'), '280px');
  assert.equal(light.layer.dataset.active, 'true');
  assert.equal(light.frames.size, 0);
  light.cleanup();
});

test('leaving, blurring, and cleanup hide the light and cancel pending work', () => {
  const light = setup();
  light.move(20, 40);
  light.leave();
  assert.equal(light.frames.size, 0);
  assert.equal(light.layer.dataset.active, 'false');
  light.move(40, 60);
  light.paint();
  light.blur();
  assert.equal(light.layer.dataset.active, 'false');
  light.move(80, 100);
  light.cleanup();
  light.move(90, 120);
  assert.equal(light.frames.size, 0);
  assert.equal(light.layer.dataset.active, 'false');
});

test('reduced-motion or coarse-pointer preferences prevent work, including after a live change', () => {
  const light = setup(false);
  light.move(20, 30);
  assert.equal(light.frames.size, 0);
  light.setEnabled(true);
  light.move(20, 30, 'touch');
  assert.equal(light.frames.size, 0);
  light.move(20, 30);
  assert.equal(light.frames.size, 1);
  light.setEnabled(false);
  assert.equal(light.frames.size, 0);
  assert.equal(light.layer.dataset.active, 'false');
  light.move(100, 200);
  assert.equal(light.frames.size, 0);
  light.cleanup();
});
