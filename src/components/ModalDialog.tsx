import { useEffect, useRef } from 'react';
import type { ComponentPropsWithoutRef } from 'react';

type ModalDialogProps = ComponentPropsWithoutRef<'dialog'> & {
  fallbackFocusId?: string;
};

export function ModalDialog({ fallbackFocusId, ...props }: ModalDialogProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const opener = useRef<Element | null | undefined>(undefined);

  useEffect(() => {
    const dialog = ref.current!;
    if (opener.current === undefined) opener.current = document.activeElement;
    const overflow = document.body.style.overflow;
    if (!dialog.open) dialog.showModal();
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = overflow;
      const target = opener.current instanceof HTMLElement && opener.current !== document.body && opener.current.isConnected
        ? opener.current
        : fallbackFocusId ? document.getElementById(fallbackFocusId) : null;
      target?.focus();
    };
  }, [fallbackFocusId]);

  return <dialog ref={ref} {...props} />;
}
