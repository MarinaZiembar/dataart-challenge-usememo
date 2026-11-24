import { memo } from 'react';
import type { Note as NoteModel, Point } from '../../domain/note';
import { useMoveNote } from '../../hooks/useMoveNote';
import { useResizeNote } from '../../hooks/useResizeNote';
import './Note.styles.css';

interface NoteProps {
  note: NoteModel;
}

const classNameFor = (isDragging: boolean, isResizing: boolean) => {
  if (isDragging) return 'note note--dragging';
  if (isResizing) return 'note note--resizing';
  return 'note';
};

const transformFor = (offset: Point | null) =>
  offset ? `translate3d(${offset.x}px, ${offset.y}px, 0) rotate(-2deg)` : undefined;

export const Note = memo(function Note({ note }: NoteProps) {
  const { offset, bodyProps } = useMoveNote(note);
  const { size, handleProps } = useResizeNote(note);
  const isDragging = offset !== null;
  const isResizing = size !== null;
  const { width, height } = size ?? note;

  const style = {
    left: note.x,
    top: note.y,
    width,
    height,
    zIndex: note.zIndex,
    transform: transformFor(offset),
  };

  return (
    <article
      className={classNameFor(isDragging, isResizing)}
      style={style}
      aria-label="Note"
      data-pattern={note.pattern}
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
