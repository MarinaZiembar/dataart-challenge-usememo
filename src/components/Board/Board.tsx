import { useNotesStore } from '../../store/notesStore';
import './Board.styles.css';

export function Board() {
  const isEmpty = useNotesStore((state) => state.notes.length === 0);

  return (
    <main className="board" aria-label="Notes board">
      {isEmpty && (
        <section className="board__empty">
          <h1 className="board__empty-title">Your board is empty</h1>
          <p className="board__empty-text">
            Click “+ New note” or drag anywhere on the board to draw one.
          </p>
        </section>
      )}
    </main>
  );
}
