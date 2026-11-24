import { NOTE_SIZE } from '../../domain/note';
import { useNotesStore } from '../../store/notesStore';
import './Dock.styles.css';

const CASCADE_STEP = 24;
const CASCADE_STEPS = 8;

export function Dock() {
  const addNote = useNotesStore((state) => state.addNote);

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
      <span className="dock__hint">Tip: drag on the board to draw a note</span>
    </nav>
  );
}
