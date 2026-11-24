import { act, render, screen } from '@testing-library/react';
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

describe('Board', () => {
  beforeEach(() => {
    useNotesStore.setState({ notes: [] });
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
});
