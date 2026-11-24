import { useEffect, useRef, useState, type PointerEvent } from 'react';
import type { Point, Size } from '../types/geometry';
import type { Note } from '../types/notes';
import { resizeRect } from '../utils/notes';
import { useNotesStore } from '../store/notesStore';
import { boardBounds } from '../utils/board';

interface Gesture {
  start: Point;
  bounds: Size;
}

export function useResizeNote(note: Note) {
  const resizeNote = useNotesStore((state) => state.resizeNote);
  const gesture = useRef<Gesture | null>(null);
  const [size, setSize] = useState<Size | null>(null);

  const isResizing = size !== null;

  useEffect(() => {
    if (!isResizing) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      gesture.current = null;
      setSize(null);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isResizing]);

  const sizeAt = (event: PointerEvent, { start, bounds }: Gesture): Size => {
    const next = {
      width: note.width + event.clientX - start.x,
      height: note.height + event.clientY - start.y,
    };
    const { width, height } = resizeRect(note, next, bounds);
    return { width, height };
  };

  const onPointerDown = (event: PointerEvent<HTMLElement>) => {
    event.stopPropagation();
    if (event.button !== 0) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    gesture.current = {
      start: { x: event.clientX, y: event.clientY },
      bounds: boardBounds(event.currentTarget),
    };
    setSize({ width: note.width, height: note.height });
  };

  const onPointerMove = (event: PointerEvent<HTMLElement>) => {
    if (!gesture.current) return;
    setSize(sizeAt(event, gesture.current));
  };

  const onPointerUp = (event: PointerEvent<HTMLElement>) => {
    event.stopPropagation();
    if (!gesture.current) return;
    resizeNote(note.id, sizeAt(event, gesture.current));
    gesture.current = null;
    setSize(null);
  };

  const onPointerCancel = () => {
    gesture.current = null;
    setSize(null);
  };

  return {
    size,
    handleProps: { onPointerDown, onPointerMove, onPointerUp, onPointerCancel },
  };
}
