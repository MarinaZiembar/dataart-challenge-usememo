import { useEffect, useRef, useState, type PointerEvent } from 'react';
import { clampToBounds, isClick, type Note, type Point, type Size } from '../domain/note';
import { useNotesStore } from '../store/notesStore';
import { boardBounds } from './boardBounds';

interface Gesture {
  start: Point;
  bounds: Size;
}

export function useMoveNote(note: Note) {
  const moveNote = useNotesStore((state) => state.moveNote);
  const gesture = useRef<Gesture | null>(null);
  const [offset, setOffset] = useState<Point | null>(null);

  const isDragging = offset !== null;

  useEffect(() => {
    if (!isDragging) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      gesture.current = null;
      setOffset(null);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isDragging]);

  const positionAt = (event: PointerEvent, { start, bounds }: Gesture): Point => {
    const moved = {
      ...note,
      x: note.x + event.clientX - start.x,
      y: note.y + event.clientY - start.y,
    };
    const { x, y } = clampToBounds(moved, bounds);
    return { x, y };
  };

  const onPointerDown = (event: PointerEvent<HTMLElement>) => {
    if (event.button !== 0) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    gesture.current = {
      start: { x: event.clientX, y: event.clientY },
      bounds: boardBounds(event.currentTarget),
    };
    setOffset({ x: 0, y: 0 });
  };

  const onPointerMove = (event: PointerEvent<HTMLElement>) => {
    if (!gesture.current) return;
    const position = positionAt(event, gesture.current);
    setOffset({ x: position.x - note.x, y: position.y - note.y });
  };

  const onPointerUp = (event: PointerEvent<HTMLElement>) => {
    if (!gesture.current) return;
    const { start, bounds } = gesture.current;
    const end = { x: event.clientX, y: event.clientY };
    if (!isClick(start, end)) moveNote(note.id, positionAt(event, gesture.current), bounds);
    gesture.current = null;
    setOffset(null);
  };

  const onPointerCancel = () => {
    gesture.current = null;
    setOffset(null);
  };

  return {
    offset,
    bodyProps: { onPointerDown, onPointerMove, onPointerUp, onPointerCancel },
  };
}
