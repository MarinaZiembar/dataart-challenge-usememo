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
    useNotesStore.setState({ notes: [], drag: null });
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

  describe('moving', () => {
    const move = (article: HTMLElement, by: [number, number]) => {
      fireEvent.pointerDown(article, { clientX: 100, clientY: 100, button: 0, pointerId: 1 });
      fireEvent.pointerMove(article, { clientX: 100 + by[0], clientY: 100 + by[1], pointerId: 1 });
    };

    it('follows the pointer while dragging', () => {
      const { article } = renderOnBoard();

      move(article, [60, 40]);

      expect(article).toHaveStyle({ transform: 'translate3d(60px, 40px, 0) rotate(-2deg)' });
      expect(article).toHaveClass('note--dragging');
    });

    it('saves the new position on release', () => {
      const { article } = renderOnBoard();

      move(article, [60, 40]);
      fireEvent.pointerUp(article, { clientX: 160, clientY: 140, pointerId: 1 });

      expect(useNotesStore.getState().notes[0]).toMatchObject({ x: 100, y: 100 });
    });

    it('keeps the note inside the board', () => {
      const { article } = renderOnBoard();

      move(article, [5000, 5000]);
      fireEvent.pointerUp(article, { clientX: 5100, clientY: 5100, pointerId: 1 });

      expect(useNotesStore.getState().notes[0]).toMatchObject({ x: 760, y: 620 });
    });

    it('hides the resize handle while dragging', () => {
      const { article } = renderOnBoard();

      move(article, [30, 30]);

      expect(screen.queryByTitle('Resize')).not.toBeInTheDocument();
    });

    it('stays above the other notes while dragging', () => {
      const { article } = renderOnBoard();

      move(article, [30, 30]);

      expect(article).toHaveStyle({ zIndex: '10000' });
    });

    it('peels off the washi tape while dragging', () => {
      const { article } = renderOnBoard();

      move(article, [30, 30]);

      expect(screen.queryByTestId('washi-tape')).not.toBeInTheDocument();
    });

    it('returns to its place with Escape', () => {
      const { article } = renderOnBoard();

      move(article, [60, 40]);
      fireEvent.keyDown(window, { key: 'Escape' });
      fireEvent.pointerUp(article, { clientX: 160, clientY: 140, pointerId: 1 });

      expect(article).not.toHaveClass('note--dragging');
      expect(useNotesStore.getState().notes[0]).toMatchObject({ x: 40, y: 60 });
    });

    it('does not save anything on a simple click', () => {
      const { article } = renderOnBoard();

      fireEvent.pointerDown(article, { clientX: 100, clientY: 100, button: 0, pointerId: 1 });
      fireEvent.pointerUp(article, { clientX: 101, clientY: 100, pointerId: 1 });

      expect(useNotesStore.getState().notes[0]).toEqual(note);
    });

    it('does not start moving from the resize handle', () => {
      const { article, handle } = renderOnBoard();

      fireEvent.pointerDown(handle, { clientX: 300, clientY: 300, button: 0, pointerId: 1 });

      expect(article).not.toHaveClass('note--dragging');
    });
  });

  describe('deleting', () => {
    const renderWithTrash = () => {
      const result = renderOnBoard();
      const trash = document.createElement('div');
      trash.setAttribute('data-trash-zone', '');
      document.body.appendChild(trash);
      jest.spyOn(trash, 'getBoundingClientRect').mockReturnValue({
        left: 800,
        top: 600,
        width: 160,
        height: 120,
      } as DOMRect);
      return result;
    };

    afterEach(() => {
      document.querySelector('[data-trash-zone]')?.remove();
    });

    it('fades while it is over the trash zone', () => {
      const { article } = renderWithTrash();

      fireEvent.pointerDown(article, { clientX: 100, clientY: 100, button: 0, pointerId: 1 });
      fireEvent.pointerMove(article, { clientX: 800, clientY: 600, pointerId: 1 });

      expect(article).toHaveClass('note--over-trash');
      expect(useNotesStore.getState().drag).toEqual({ id: note.id, overTrash: true });
    });

    it('is deleted when released over the trash zone', () => {
      const { article } = renderWithTrash();

      fireEvent.pointerDown(article, { clientX: 100, clientY: 100, button: 0, pointerId: 1 });
      fireEvent.pointerMove(article, { clientX: 800, clientY: 600, pointerId: 1 });
      fireEvent.pointerUp(article, { clientX: 800, clientY: 600, pointerId: 1 });

      expect(useNotesStore.getState().notes).toEqual([]);
      expect(useNotesStore.getState().drag).toBeNull();
    });

    it('is kept when released anywhere else', () => {
      const { article } = renderWithTrash();

      fireEvent.pointerDown(article, { clientX: 100, clientY: 100, button: 0, pointerId: 1 });
      fireEvent.pointerMove(article, { clientX: 300, clientY: 200, pointerId: 1 });
      fireEvent.pointerUp(article, { clientX: 300, clientY: 200, pointerId: 1 });

      expect(useNotesStore.getState().notes).toHaveLength(1);
    });

    it('is deleted with the Delete key when focused', () => {
      const { article } = renderOnBoard();

      article.focus();
      fireEvent.keyDown(article, { key: 'Delete' });

      expect(useNotesStore.getState().notes).toEqual([]);
    });
  });
});
