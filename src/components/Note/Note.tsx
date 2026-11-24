import { memo, useState, type KeyboardEvent } from 'react';
import { noteFontSize, type Note as NoteModel, type Point } from '../../domain/note';
import { useMoveNote } from '../../hooks/useMoveNote';
import { useResizeNote } from '../../hooks/useResizeNote';
import { NoteText } from '../NoteText';
import { useNotesStore } from '../../store/notesStore';
import './Note.styles.css';

interface NoteProps {
  note: NoteModel;
}

const DELETE_KEYS = ['Delete', 'Backspace'];
const DRAGGING_Z_INDEX = 10000;

interface NoteState {
  isDragging: boolean;
  isResizing: boolean;
  isOverTrash: boolean;
  isEditing: boolean;
}

const classNameFor = ({ isDragging, isResizing, isOverTrash, isEditing }: NoteState) => {
  if (isOverTrash) return 'note note--dragging note--over-trash';
  if (isDragging) return 'note note--dragging';
  if (isResizing) return 'note note--resizing';
  if (isEditing) return 'note note--editing';
  return 'note';
};

const transformFor = (offset: Point | null) =>
  offset ? `translate3d(${offset.x}px, ${offset.y}px, 0) rotate(-2deg)` : undefined;

export const Note = memo(function Note({ note }: NoteProps) {
  const { offset, isOverTrash, bodyProps } = useMoveNote(note);
  const { size, handleProps } = useResizeNote(note);
  const isDragging = offset !== null;
  const isResizing = size !== null;
  const [isEditing, setIsEditing] = useState(false);
  const { width, height } = size ?? note;

  const style = {
    left: note.x,
    top: note.y,
    width,
    height,
    zIndex: isDragging ? DRAGGING_Z_INDEX : note.zIndex,
    transform: transformFor(offset),
    fontSize: noteFontSize({ width, height }),
  };

  const onKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.target !== event.currentTarget) return;
    if (event.key === 'Enter') {
      event.preventDefault();
      setIsEditing(true);
    }
    if (DELETE_KEYS.includes(event.key)) useNotesStore.getState().removeNote(note.id);
  };

  const onSaveText = (text: string) => {
    useNotesStore.getState().updateText(note.id, text);
    setIsEditing(false);
  };

  return (
    <article
      className={classNameFor({ isDragging, isResizing, isOverTrash, isEditing })}
      style={style}
      aria-label="Note"
      tabIndex={0}
      data-pattern={note.pattern}
      onKeyDown={onKeyDown}
      onDoubleClick={() => setIsEditing(true)}
      onPointerDownCapture={() => useNotesStore.getState().bringToFront(note.id)}
      onFocus={() => useNotesStore.getState().bringToFront(note.id)}
      {...bodyProps}
    >
      {!isDragging && !isResizing && (
        <span className="note__tape" data-testid="washi-tape" aria-hidden="true" />
      )}
      <div className="note__paper">
        <NoteText text={note.text} isEditing={isEditing} onSave={onSaveText} />
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
