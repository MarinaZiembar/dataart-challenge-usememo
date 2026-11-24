import { useEffect, type RefObject } from 'react';

export const useDismiss = (
  refs: readonly RefObject<HTMLElement | null>[],
  onDismiss: () => void,
) => {
  useEffect(() => {
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (refs.some((ref) => ref.current?.contains(target))) return;
      event.stopPropagation();
      onDismiss();
    };
    document.addEventListener('pointerdown', onPointerDown, true);
    return () => document.removeEventListener('pointerdown', onPointerDown, true);
  }, [refs, onDismiss]);
};
