import { useEffect, useRef, useState, type PointerEvent } from 'react';
import type { Point, Rect } from '../types/geometry';
import type { Note } from '../types/notes';
import { clampToBounds, isClick, isOverlapping } from '../utils/geometry';
import { useNotesStore } from '../store/notesStore';
import { boardBounds, trashZoneRect } from '../utils/board';

interface Gesture {
  start: Point;
  board: Rect;
  trash: Rect | null;
  started: boolean;
}

const isFromTextField = (event: PointerEvent) =>
  event.target instanceof HTMLElement && event.target.closest('textarea') !== null;

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
    if (event.button !== 0 || isFromTextField(event)) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    gesture.current = {
      start: { x: event.clientX, y: event.clientY },
      board: boardBounds(event.currentTarget),
      trash: trashZoneRect(),
      started: false,
    };
  };

  const onPointerMove = (event: PointerEvent<HTMLElement>) => {
    const current = gesture.current;
    if (!current) return;
    if (!current.started && isClick(current.start, { x: event.clientX, y: event.clientY })) return;
    if (!current.started) useNotesStore.getState().startDrag(note.id);
    current.started = true;
    const position = positionAt(event, current);
    setOffset({ x: position.x - note.x, y: position.y - note.y });
    useNotesStore.getState().setOverTrash(overTrashAt(position, current));
  };

  const onPointerUp = (event: PointerEvent<HTMLElement>) => {
    const current = gesture.current;
    if (!current) return;
    const { removeNote, moveNote } = useNotesStore.getState();
    const position = positionAt(event, current);
    if (current.started && overTrashAt(position, current)) removeNote(note.id);
    else if (current.started) moveNote(note.id, position, current.board);
    stop();
  };

  return {
    offset,
    isOverTrash,
    bodyProps: { onPointerDown, onPointerMove, onPointerUp, onPointerCancel: stop },
  };
}
