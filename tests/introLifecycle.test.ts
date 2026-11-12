import assert from 'node:assert/strict';
import { test } from 'node:test';
import { shouldShowIntro, startIntro } from '../src/components/introLifecycle.ts';

function setup() {
  const events = new EventTarget();
  const motion = Object.assign(new EventTarget(), { matches: false });
  const stored = new Map<string, string>();
  const timers = new Map<number, { callback: () => void; delay: number }>();
  let nextTimer = 0;
  const body = { style: { overflow: 'auto' } };
  const environment = {
    location: { pathname: '/', hash: '' },
    document: { body },
    matchMedia: () => motion,
    sessionStorage: { getItem: (key: string) => stored.get(key) ?? null, setItem: (key: string, value: string) => stored.set(key, value) },
    addEventListener: events.addEventListener.bind(events),
    removeEventListener: events.removeEventListener.bind(events),
    setTimeout: (callback: () => void, delay: number) => { timers.set(++nextTimer, { callback, delay }); return nextTimer; },
    clearTimeout: (id: number) => { timers.delete(id); },
  };
  return {
    environment, window: environment as unknown as Window, motion, stored, timers, body,
    escape: () => events.dispatchEvent(Object.assign(new Event('keydown', { cancelable: true }), { key: 'Escape' })),
    navigate: (event: 'popstate' | 'hashchange') => events.dispatchEvent(new Event(event)),
    complete: () => { const pending = [...timers.values()]; timers.clear(); pending.forEach(timer => timer.callback()); },
  };
}

test('every fresh load is eligible including refreshes, previously seen sessions, routes and anchors', () => {
  const intro = setup();
  assert.equal(shouldShowIntro(intro.window), true);
  assert.equal(shouldShowIntro(intro.window), true);
  assert.equal(intro.stored.size, 0);
  intro.environment.location.hash = '#contact';
  assert.equal(shouldShowIntro(intro.window), true);
  intro.environment.location.hash = '';
  intro.environment.location.pathname = '/projects';
  assert.equal(shouldShowIntro(intro.window), true);
  intro.environment.location.pathname = '/';
  intro.motion.matches = true;
  assert.equal(shouldShowIntro(intro.window), false);
  intro.motion.matches = false;
  intro.stored.set('vaipuk:intro-seen', '1');
  assert.equal(shouldShowIntro(intro.window), true);
});

test('the intro completes once within its time budget and restores scrolling', () => {
  const intro = setup();
  let completed = 0;
  const cleanup = startIntro(() => completed++, intro.window);
  assert.equal(intro.stored.size, 0);
  assert.equal(intro.body.style.overflow, 'hidden');
  assert.equal([...intro.timers.values()][0]?.delay, 3600);
  intro.complete();
  assert.equal(completed, 1);
  assert.equal(intro.body.style.overflow, 'auto');
  assert.equal(shouldShowIntro(intro.window), true);
  intro.escape();
  intro.complete();
  assert.equal(completed, 1);
  cleanup();
});

test('Escape finishes early and cancels the pending completion', () => {
  const intro = setup();
  let completed = 0;
  let focusMain: boolean | undefined;
  startIntro((skipped?: boolean) => { completed++; focusMain = skipped; }, intro.window);
  intro.escape();
  assert.equal(completed, 1);
  assert.equal(focusMain, true);
  assert.equal(intro.timers.size, 0);
  assert.equal(intro.body.style.overflow, 'auto');
});

test('reduced motion and browser navigation release an active intro immediately', () => {
  for (const action of ['motion', 'popstate', 'hashchange'] as const) {
    const intro = setup();
    let completed = 0;
    startIntro(() => completed++, intro.window);
    if (action === 'motion') {
      intro.motion.matches = true;
      intro.motion.dispatchEvent(new Event('change'));
    } else intro.navigate(action);
    assert.equal(completed, 1, action);
    assert.equal(intro.timers.size, 0, action);
    assert.equal(intro.body.style.overflow, 'auto', action);
  }
});

test('StrictMode-style cleanup and replay leave exactly one active timer and no leaked scroll lock', () => {
  const intro = setup();
  let completed = 0;
  startIntro(() => completed++, intro.window)();
  assert.equal(intro.timers.size, 0);
  assert.equal(intro.body.style.overflow, 'auto');
  const cleanup = startIntro(() => completed++, intro.window);
  intro.complete();
  assert.equal(completed, 1);
  cleanup();
  intro.navigate('popstate');
  assert.equal(completed, 1);
  assert.equal(intro.body.style.overflow, 'auto');
});

test('blocked session storage cannot crash or trap the intro', () => {
  const intro = setup();
  Object.defineProperty(intro.environment, 'sessionStorage', { get() { throw new Error('Storage blocked'); } });
  assert.equal(shouldShowIntro(intro.window), true);
  let completed = 0;
  startIntro(() => completed++, intro.window);
  intro.complete();
  assert.equal(completed, 1);
  assert.equal(intro.body.style.overflow, 'auto');
});
