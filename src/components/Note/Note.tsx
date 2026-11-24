import { memo } from 'react';
import type { Note as NoteModel } from '../../domain/note';
import { useResizeNote } from '../../hooks/useResizeNote';
import './Note.styles.css';

interface NoteProps {
  note: NoteModel;
}

export const Note = memo(function Note({ note }: NoteProps) {
  const { size, handleProps } = useResizeNote(note);
  const isResizing = size !== null;
  const { width, height } = size ?? note;

  const style = { left: note.x, top: note.y, width, height, zIndex: note.zIndex };

  return (
    <article
      className={isResizing ? 'note note--resizing' : 'note'}
      style={style}
      aria-label="Note"
      data-pattern={note.pattern}
    >
      {!isResizing && <span className="note__tape" data-testid="washi-tape" aria-hidden="true" />}
      <div className="note__paper">
        <p className="note__text">{note.text}</p>
      </div>
      <span className="note__resize" role="presentation" title="Resize" {...handleProps} />
      {isResizing && (
        <span className="note__size">
          {width} × {height}
        </span>
      )}
    </article>
  );
});
