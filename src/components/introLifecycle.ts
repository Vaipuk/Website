export const INTRO_DURATION_MS = 2800;
export const INTRO_SESSION_KEY = 'vaipuk:intro-seen';

export function shouldShowIntro(environment: Window = window): boolean {
  if (environment.location.pathname !== '/' || environment.location.hash ||
      environment.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
  try {
    return environment.sessionStorage.getItem(INTRO_SESSION_KEY) !== '1';
  } catch {
    return true;
  }
}

export function startIntro(onComplete: (focusMain?: boolean) => void, environment: Window = window): () => void {
  const motion = environment.matchMedia('(prefers-reduced-motion: reduce)');
  const body = environment.document.body;
  const overflow = body.style.overflow;
  let cleaned = false;
  try {
    environment.sessionStorage.setItem(INTRO_SESSION_KEY, '1');
  } catch {
    // Blocked storage must never prevent the page from opening.
  }
  body.style.overflow = 'hidden';

  const complete = (focusMain = false) => {
    if (cleaned) return;
    cleanup();
    onComplete(focusMain);
  };
  const onKey = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      complete(true);
    }
  };
  const onMotion = () => { if (motion.matches) complete(); };
  const onNavigate = () => complete();
  const timeout = environment.setTimeout(complete, INTRO_DURATION_MS);

  function cleanup() {
    if (cleaned) return;
    cleaned = true;
    environment.clearTimeout(timeout);
    environment.removeEventListener('keydown', onKey);
    environment.removeEventListener('popstate', onNavigate);
    environment.removeEventListener('hashchange', onNavigate);
    motion.removeEventListener('change', onMotion);
    body.style.overflow = overflow;
  }

  environment.addEventListener('keydown', onKey);
  environment.addEventListener('popstate', onNavigate);
  environment.addEventListener('hashchange', onNavigate);
  motion.addEventListener('change', onMotion);
  if (motion.matches) complete();
  return cleanup;
}
