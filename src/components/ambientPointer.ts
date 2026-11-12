export function attachAmbientPointer(layer: HTMLElement, environment: Window = window): () => void {
  const preference = environment.matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)');
  let frame: number | null = null;
  let x = 0;
  let y = 0;

  const hide = () => {
    if (frame !== null) environment.cancelAnimationFrame(frame);
    frame = null;
    layer.dataset.active = 'false';
  };

  const move = (event: PointerEvent) => {
    if (event.pointerType === 'touch') return;
    x = event.clientX;
    y = event.clientY;
    if (frame !== null) return;
    frame = environment.requestAnimationFrame(() => {
      frame = null;
      layer.style.setProperty('--light-x', `${x}px`);
      layer.style.setProperty('--light-y', `${y}px`);
      layer.dataset.active = 'true';
    });
  };

  const leave = (event: PointerEvent) => { if (!event.relatedTarget) hide(); };
  const disconnect = () => {
    environment.removeEventListener('pointermove', move);
    environment.removeEventListener('pointerout', leave);
    environment.removeEventListener('blur', hide);
    hide();
  };
  const connect = () => {
    disconnect();
    if (!preference.matches) return;
    environment.addEventListener('pointermove', move, { passive: true });
    environment.addEventListener('pointerout', leave);
    environment.addEventListener('blur', hide);
  };

  connect();
  preference.addEventListener('change', connect);
  return () => {
    preference.removeEventListener('change', connect);
    disconnect();
  };
}
