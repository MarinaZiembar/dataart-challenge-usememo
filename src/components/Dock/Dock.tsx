import { useRef, useState } from 'react';
import { NOTE_SIZE, PATTERN_LABELS } from '../../constants/notes';
import { useNotesStore } from '../../store/notesStore';
import { NotePattern } from '../NotePattern';
import { PatternPicker } from '../PatternPicker';
import './Dock.styles.css';

const CASCADE_STEP = 24;
const CASCADE_STEPS = 8;
const SWATCH_SIZE = { width: 22, height: 22 };

export function Dock() {
  const addNote = useNotesStore((state) => state.addNote);
  const newNotePattern = useNotesStore((state) => state.newNotePattern);
  const setNewNotePattern = useNotesStore((state) => state.setNewNotePattern);
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const patternButtonRef = useRef<HTMLButtonElement>(null);

  const onClosePicker = () => {
    setIsPickerOpen(false);
    patternButtonRef.current?.focus();
  };

  const handleNewNote = () => {
    const offset = (useNotesStore.getState().notes.length % CASCADE_STEPS) * CASCADE_STEP;
    const bounds = { width: window.innerWidth, height: window.innerHeight };
    const rect = {
      x: (bounds.width - NOTE_SIZE.default) / 2 + offset,
      y: (bounds.height - NOTE_SIZE.default) / 2 + offset,
      width: NOTE_SIZE.default,
      height: NOTE_SIZE.default,
    };
    addNote(rect, bounds);
  };

  return (
    <nav className="dock" aria-label="Board tools">
      <button type="button" className="dock__button" onClick={handleNewNote}>
        + New note
      </button>
      <span className="dock__divider" aria-hidden="true" />
      <button
        ref={patternButtonRef}
        type="button"
        className="dock__pattern"
        aria-label={`Pattern for new notes: ${PATTERN_LABELS[newNotePattern]}`}
        aria-haspopup="true"
        aria-expanded={isPickerOpen}
        onClick={() => setIsPickerOpen((open) => !open)}
      >
        <span className="dock__swatch">
          <NotePattern pattern={newNotePattern} size={SWATCH_SIZE} zoom={3} />
        </span>
        {PATTERN_LABELS[newNotePattern]}
        <span className="dock__caret" aria-hidden="true">
          ▾
        </span>
      </button>
      {isPickerOpen && (
        <PatternPicker
          className="dock__picker"
          value={newNotePattern}
          onChange={setNewNotePattern}
          onClose={onClosePicker}
          anchorRef={patternButtonRef}
        />
      )}
      <span className="dock__divider" aria-hidden="true" />
      <span className="dock__hint">Tip: drag on the board to draw a note</span>
    </nav>
  );
}
