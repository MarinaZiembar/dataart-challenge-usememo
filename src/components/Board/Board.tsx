import { useDrawNote } from '../../hooks/useDrawNote';
import { useNotesStore } from '../../store/notesStore';
import { DrawPreview } from '../DrawPreview';
import { Note } from '../Note';
import './Board.styles.css';

export function Board() {
  const notes = useNotesStore((state) => state.notes);
  const { draft, ...handlers } = useDrawNote();

  return (
    <main className="board" aria-label="Notes board" {...handlers}>
      {notes.length === 0 && !draft && (
        <section className="board__empty">
          <h1 className="board__empty-title">Your board is empty</h1>
          <p className="board__empty-text">
            Click “+ New note” or drag anywhere on the board to draw one.
          </p>
        </section>
      )}
      {notes.map((note) => (
        <Note key={note.id} note={note} />
      ))}
      {draft && <DrawPreview rect={draft} />}
    </main>
  );
}
