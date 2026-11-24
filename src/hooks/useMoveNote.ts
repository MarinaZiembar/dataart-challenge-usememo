import { useEffect, useRef, useState, type PointerEvent } from 'react';
import {
  clampToBounds,
  isClick,
  isOverlapping,
  type Note,
  type Point,
  type Rect,
} from '../domain/note';
import { useNotesStore } from '../store/notesStore';
import { boardBounds, trashZoneRect } from './boardBounds';

interface Gesture {
  start: Point;
  board: Rect;
  trash: Rect | null;
}

export function useMoveNote(note: Note) {
  const isOverTrash = useNotesStore((state) => state.drag?.id === note.id && state.drag.overTrash);
  const gesture = useRef<Gesture | null>(null);
  const [offset, setOffset] = useState<Point | null>(null);

  const isDragging = offset !== null;

  const stop = () => {
    gesture.current = null;
    setOffset(null);
    useNotesStore.getState().endDrag();
  };

  useEffect(() => {
    if (!isDragging) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      gesture.current = null;
      setOffset(null);
      useNotesStore.getState().endDrag();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isDragging]);

  const positionAt = (event: PointerEvent, { start, board }: Gesture): Point => {
    const moved = {
      ...note,
      x: note.x + event.clientX - start.x,
      y: note.y + event.clientY - start.y,
    };
    const { x, y } = clampToBounds(moved, board);
    return { x, y };
  };

  const overTrashAt = (position: Point, { board, trash }: Gesture) => {
    if (!trash) return false;
    return isOverlapping({ ...note, x: board.x + position.x, y: board.y + position.y }, trash);
  };

  const onPointerDown = (event: PointerEvent<HTMLElement>) => {
    if (event.button !== 0) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    gesture.current = {
      start: { x: event.clientX, y: event.clientY },
      board: boardBounds(event.currentTarget),
      trash: trashZoneRect(),
    };
    setOffset({ x: 0, y: 0 });
    useNotesStore.getState().startDrag(note.id);
  };

  const onPointerMove = (event: PointerEvent<HTMLElement>) => {
    if (!gesture.current) return;
    const position = positionAt(event, gesture.current);
    setOffset({ x: position.x - note.x, y: position.y - note.y });
    useNotesStore.getState().setOverTrash(overTrashAt(position, gesture.current));
  };

  const onPointerUp = (event: PointerEvent<HTMLElement>) => {
    if (!gesture.current) return;
    const { removeNote, moveNote } = useNotesStore.getState();
    const position = positionAt(event, gesture.current);
    const hasMoved = !isClick(gesture.current.start, { x: event.clientX, y: event.clientY });
    if (overTrashAt(position, gesture.current)) removeNote(note.id);
    else if (hasMoved) moveNote(note.id, position, gesture.current.board);
    stop();
  };

  return {
    offset,
    isOverTrash,
    bodyProps: { onPointerDown, onPointerMove, onPointerUp, onPointerCancel: stop },
  };
}
