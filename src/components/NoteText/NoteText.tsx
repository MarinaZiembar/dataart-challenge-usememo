import { useState, type FocusEvent, type KeyboardEvent } from 'react';
import { MAX_TEXT_LENGTH } from '../../constants/notes';
import './NoteText.styles.css';

interface NoteTextProps {
  text: string;
  isEditing: boolean;
  onSave: (text: string) => void;
}

const moveCaretToEnd = (event: FocusEvent<HTMLTextAreaElement>) => {
  const end = event.currentTarget.value.length;
  event.currentTarget.setSelectionRange(end, end);
};

function NoteTextField({ text, onSave }: Omit<NoteTextProps, 'isEditing'>) {
  const [draft, setDraft] = useState(text);

  const onKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Escape') onSave(draft);
  };

  return (
    <textarea
      className="note-text note-text--editing"
      aria-label="Note text"
      placeholder="Write something…"
      maxLength={MAX_TEXT_LENGTH}
      value={draft}
      autoFocus
      onFocus={moveCaretToEnd}
      onChange={(event) => setDraft(event.target.value)}
      onBlur={() => onSave(draft)}
      onKeyDown={onKeyDown}
    />
  );
}

export function NoteText({ text, isEditing, onSave }: NoteTextProps) {
  if (isEditing) return <NoteTextField text={text} onSave={onSave} />;

  return text ? (
    <p className="note-text">{text}</p>
  ) : (
    <p className="note-text note-text--empty">Double-click to write</p>
  );
}
