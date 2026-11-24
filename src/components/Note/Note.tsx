import { memo, type KeyboardEvent } from 'react';
import type { Note as NoteModel, Point } from '../../domain/note';
import { useMoveNote } from '../../hooks/useMoveNote';
import { useResizeNote } from '../../hooks/useResizeNote';
import { useNotesStore } from '../../store/notesStore';
import './Note.styles.css';

interface NoteProps {
  note: NoteModel;
}

const DELETE_KEYS = ['Delete', 'Backspace'];
const DRAGGING_Z_INDEX = 10000;

const classNameFor = (isDragging: boolean, isResizing: boolean, isOverTrash: boolean) => {
  if (isOverTrash) return 'note note--dragging note--over-trash';
  if (isDragging) return 'note note--dragging';
  if (isResizing) return 'note note--resizing';
  return 'note';
};

const transformFor = (offset: Point | null) =>
  offset ? `translate3d(${offset.x}px, ${offset.y}px, 0) rotate(-2deg)` : undefined;

export const Note = memo(function Note({ note }: NoteProps) {
  const { offset, isOverTrash, bodyProps } = useMoveNote(note);
  const { size, handleProps } = useResizeNote(note);
  const isDragging = offset !== null;
  const isResizing = size !== null;
  const { width, height } = size ?? note;

  const style = {
    left: note.x,
    top: note.y,
    width,
    height,
    zIndex: isDragging ? DRAGGING_Z_INDEX : note.zIndex,
    transform: transformFor(offset),
  };

  const onKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.target !== event.currentTarget || !DELETE_KEYS.includes(event.key)) return;
    useNotesStore.getState().removeNote(note.id);
  };

  return (
    <article
      className={classNameFor(isDragging, isResizing, isOverTrash)}
      style={style}
      aria-label="Note"
      tabIndex={0}
      data-pattern={note.pattern}
      onKeyDown={onKeyDown}
      {...bodyProps}
    >
      {!isDragging && !isResizing && (
        <span className="note__tape" data-testid="washi-tape" aria-hidden="true" />
      )}
      <div className="note__paper">
        <p className="note__text">{note.text}</p>
      </div>
      {!isDragging && (
        <span className="note__resize" role="presentation" title="Resize" {...handleProps} />
      )}
      {isResizing && (
        <span className="note__size">
          {width} × {height}
        </span>
      )}
    </article>
  );
});
