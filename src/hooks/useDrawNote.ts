import { useEffect, useRef, useState, type PointerEvent } from 'react';
import {
  defaultRectAt,
  isClick,
  rectFromPoints,
  type Point,
  type Rect,
  type Size,
} from '../domain/note';
import { useNotesStore } from '../store/notesStore';

interface Gesture {
  origin: Point;
  start: Point;
  bounds: Size;
}

const isEditingText = () => document.activeElement instanceof HTMLTextAreaElement;

const toLocal = (event: PointerEvent, origin: Point): Point => ({
  x: event.clientX - origin.x,
  y: event.clientY - origin.y,
});

export function useDrawNote() {
  const addNote = useNotesStore((state) => state.addNote);
  const gesture = useRef<Gesture | null>(null);
  const [draft, setDraft] = useState<Rect | null>(null);

  const cancel = () => {
    gesture.current = null;
    setDraft(null);
  };

  const isDrawing = draft !== null;

  useEffect(() => {
    if (!isDrawing) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      gesture.current = null;
      setDraft(null);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isDrawing]);

  const onPointerDown = (event: PointerEvent<HTMLElement>) => {
    if (event.target !== event.currentTarget || event.button !== 0 || isEditingText()) return;
    const box = event.currentTarget.getBoundingClientRect();
    const origin = { x: box.left, y: box.top };
    const start = toLocal(event, origin);
    event.currentTarget.setPointerCapture(event.pointerId);
    gesture.current = { origin, start, bounds: { width: box.width, height: box.height } };
    setDraft({ ...start, width: 0, height: 0 });
  };

  const onPointerMove = (event: PointerEvent<HTMLElement>) => {
    if (!gesture.current) return;
    setDraft(rectFromPoints(gesture.current.start, toLocal(event, gesture.current.origin)));
  };

  const onPointerUp = (event: PointerEvent<HTMLElement>) => {
    if (!gesture.current) return;
    const { start, origin, bounds } = gesture.current;
    const end = toLocal(event, origin);
    addNote(isClick(start, end) ? defaultRectAt(end) : rectFromPoints(start, end), bounds);
    cancel();
  };

  return { draft, onPointerDown, onPointerMove, onPointerUp, onPointerCancel: cancel };
}
