import { memo } from 'react';
import type { Note as NoteModel } from '../../domain/note';
import './Note.styles.css';

interface NoteProps {
  note: NoteModel;
}

export const Note = memo(function Note({ note }: NoteProps) {
  const style = {
    left: note.x,
    top: note.y,
    width: note.width,
    height: note.height,
    zIndex: note.zIndex,
  };

  return (
    <article className="note" style={style} aria-label="Note" data-pattern={note.pattern}>
      <span className="note__tape" aria-hidden="true" />
      <div className="note__paper">
        <p className="note__text">{note.text}</p>
      </div>
    </article>
  );
});
