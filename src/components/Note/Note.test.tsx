import { fireEvent, render, screen } from '@testing-library/react';
import { Note } from './Note';
import { useNotesStore } from '../../store/notesStore';
import type { Note as NoteModel, NoteId } from '../../domain/note';

const note: NoteModel = {
  id: 'note-1' as NoteId,
  x: 40,
  y: 60,
  width: 240,
  height: 180,
  text: 'Ship it before Friday!',
  pattern: 'pink-stars',
  zIndex: 3,
  createdAt: '2026-11-24T00:00:00.000Z',
  updatedAt: '2026-11-24T00:00:00.000Z',
};

const renderOnBoard = (model: NoteModel = note) => {
  useNotesStore.setState({ notes: [model] });
  render(
    <main>
      <Note note={model} />
    </main>,
  );
  jest.spyOn(screen.getByRole('main'), 'getBoundingClientRect').mockReturnValue({
    left: 0,
    top: 0,
    width: 1000,
    height: 800,
  } as DOMRect);
  return {
    article: screen.getByRole('article', { name: 'Note' }),
    handle: screen.getByTitle('Resize'),
  };
};

const drag = (handle: HTMLElement, by: [number, number]) => {
  fireEvent.pointerDown(handle, { clientX: 300, clientY: 300, button: 0, pointerId: 1 });
  fireEvent.pointerMove(handle, { clientX: 300 + by[0], clientY: 300 + by[1], pointerId: 1 });
};

describe('Note', () => {
  beforeEach(() => {
    useNotesStore.setState({ notes: [] });
  });

  it('is placed at its position with its size and layer', () => {
    render(<Note note={note} />);

    expect(screen.getByRole('article', { name: 'Note' })).toHaveStyle({
      left: '40px',
      top: '60px',
      width: '240px',
      height: '180px',
      zIndex: '3',
    });
  });

  it('shows its text', () => {
    render(<Note note={note} />);

    expect(screen.getByText('Ship it before Friday!')).toBeInTheDocument();
  });

  it('exposes its pattern for styling', () => {
    render(<Note note={note} />);

    expect(screen.getByRole('article', { name: 'Note' })).toHaveAttribute(
      'data-pattern',
      'pink-stars',
    );
  });

  describe('resizing', () => {
    it('previews the new size while dragging the handle', () => {
      const { article, handle } = renderOnBoard();

      drag(handle, [60, 40]);

      expect(article).toHaveStyle({ width: '300px', height: '220px' });
      expect(screen.getByText('300 × 220')).toBeInTheDocument();
    });

    it('saves the new size on release', () => {
      const { handle } = renderOnBoard();

      drag(handle, [60, 40]);
      fireEvent.pointerUp(handle, { clientX: 360, clientY: 340, pointerId: 1 });

      expect(useNotesStore.getState().notes[0]).toMatchObject({ width: 300, height: 220 });
    });

    it('does not go below the minimum size', () => {
      const { article, handle } = renderOnBoard();

      drag(handle, [-500, -500]);

      expect(article).toHaveStyle({ width: '100px', height: '80px' });
    });

    it('does not grow past the board', () => {
      const { article, handle } = renderOnBoard({ ...note, x: 800, y: 700 });

      drag(handle, [300, 300]);

      expect(article).toHaveStyle({ width: '200px', height: '100px' });
    });

    it('hides the washi tape while resizing', () => {
      const { handle } = renderOnBoard();

      drag(handle, [10, 10]);

      expect(screen.queryByTestId('washi-tape')).not.toBeInTheDocument();
    });

    it('restores the original size with Escape', () => {
      const { article, handle } = renderOnBoard();

      drag(handle, [60, 40]);
      fireEvent.keyDown(window, { key: 'Escape' });
      fireEvent.pointerUp(handle, { clientX: 360, clientY: 340, pointerId: 1 });

      expect(article).toHaveStyle({ width: '240px', height: '180px' });
      expect(useNotesStore.getState().notes[0]).toMatchObject({ width: 240, height: 180 });
    });

    it('does not move the note', () => {
      const { article, handle } = renderOnBoard();

      drag(handle, [60, 40]);

      expect(article).toHaveStyle({ left: '40px', top: '60px' });
    });
  });
});
