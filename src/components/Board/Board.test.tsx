import { act, fireEvent, render, screen } from '@testing-library/react';
import { Board } from './Board';
import { useNotesStore } from '../../store/notesStore';
import type { Note, NoteId } from '../../domain/note';

const note: Note = {
  id: 'note-1' as NoteId,
  x: 10,
  y: 20,
  width: 200,
  height: 200,
  text: 'Call Sofi',
  pattern: 'sunny-daisies',
  zIndex: 1,
  createdAt: '2026-11-24T00:00:00.000Z',
  updatedAt: '2026-11-24T00:00:00.000Z',
};

const renderBoard = () => {
  render(<Board />);
  const board = screen.getByRole('main', { name: 'Notes board' });
  jest.spyOn(board, 'getBoundingClientRect').mockReturnValue({
    left: 0,
    top: 0,
    width: 1000,
    height: 800,
  } as DOMRect);
  return board;
};

const draw = (board: HTMLElement, from: [number, number], to: [number, number]) => {
  fireEvent.pointerDown(board, { clientX: from[0], clientY: from[1], button: 0, pointerId: 1 });
  fireEvent.pointerMove(board, { clientX: to[0], clientY: to[1], pointerId: 1 });
  fireEvent.pointerUp(board, { clientX: to[0], clientY: to[1], pointerId: 1 });
};

describe('Board', () => {
  beforeEach(() => {
    useNotesStore.setState({ notes: [], drag: null });
  });

  it('shows the empty state when there are no notes', () => {
    render(<Board />);

    expect(screen.getByRole('heading', { name: 'Your board is empty' })).toBeInTheDocument();
  });

  it('hides the empty state when there are notes', () => {
    render(<Board />);

    act(() => useNotesStore.getState().setNotes([note]));

    expect(screen.queryByRole('heading', { name: 'Your board is empty' })).not.toBeInTheDocument();
  });

  it('creates a note with the drawn position and size', () => {
    const board = renderBoard();

    draw(board, [100, 120], [340, 300]);

    const created = screen.getByRole('article', { name: 'Note' });
    expect(created).toHaveStyle({ left: '100px', top: '120px', width: '240px', height: '180px' });
  });

  it('creates the note when drawing in any direction', () => {
    const board = renderBoard();

    draw(board, [340, 300], [100, 120]);

    expect(screen.getByRole('article', { name: 'Note' })).toHaveStyle({
      left: '100px',
      top: '120px',
    });
  });

  it('creates a default note centered on a single click', () => {
    const board = renderBoard();

    draw(board, [300, 300], [300, 300]);

    expect(screen.getByRole('article', { name: 'Note' })).toHaveStyle({
      left: '200px',
      top: '200px',
      width: '200px',
      height: '200px',
    });
  });

  it('shows a preview with the size while drawing', () => {
    const board = renderBoard();

    fireEvent.pointerDown(board, { clientX: 100, clientY: 100, button: 0, pointerId: 1 });
    fireEvent.pointerMove(board, { clientX: 380, clientY: 310, pointerId: 1 });

    expect(screen.getByText('280 × 210')).toBeInTheDocument();
  });

  it('cancels the drawing with Escape', () => {
    const board = renderBoard();

    fireEvent.pointerDown(board, { clientX: 100, clientY: 100, button: 0, pointerId: 1 });
    fireEvent.pointerMove(board, { clientX: 300, clientY: 300, pointerId: 1 });
    fireEvent.keyDown(window, { key: 'Escape' });
    fireEvent.pointerUp(board, { clientX: 300, clientY: 300, pointerId: 1 });

    expect(screen.queryByRole('article', { name: 'Note' })).not.toBeInTheDocument();
  });

  it('does not start drawing from an existing note', () => {
    useNotesStore.setState({ notes: [note] });
    renderBoard();

    const existing = screen.getByRole('article', { name: 'Note' });
    fireEvent.pointerDown(existing, { clientX: 50, clientY: 50, button: 0, pointerId: 1 });
    fireEvent.pointerUp(existing, { clientX: 50, clientY: 50, pointerId: 1 });

    expect(useNotesStore.getState().notes).toHaveLength(1);
  });

  it('does not create a note when clicking outside to finish editing', () => {
    const board = renderBoard();
    const field = document.createElement('textarea');
    document.body.appendChild(field);
    field.focus();

    draw(board, [300, 300], [300, 300]);

    expect(useNotesStore.getState().notes).toHaveLength(0);
    field.remove();
  });
});
