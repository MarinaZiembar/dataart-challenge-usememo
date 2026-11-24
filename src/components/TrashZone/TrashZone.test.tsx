import { act, render, screen } from '@testing-library/react';
import { TrashZone } from './TrashZone';
import { useNotesStore } from '../../store/notesStore';
import type { NoteId } from '../../domain/note';

describe('TrashZone', () => {
  beforeEach(() => {
    useNotesStore.setState({ notes: [], drag: null });
  });

  it('is idle when no note is being dragged', () => {
    render(<TrashZone />);

    expect(screen.getByRole('region', { name: 'Trash' })).toHaveClass('trash-zone--idle');
    expect(screen.getByText('Trash')).toBeInTheDocument();
  });

  it('invites to drop while a note is being dragged', () => {
    render(<TrashZone />);

    act(() => useNotesStore.getState().startDrag('note-1' as NoteId));

    expect(screen.getByRole('region', { name: 'Trash' })).toHaveClass('trash-zone--active');
    expect(screen.getByText('Drop here to delete')).toBeInTheDocument();
  });

  it('asks to release when the note is over it', () => {
    render(<TrashZone />);

    act(() => {
      useNotesStore.getState().startDrag('note-1' as NoteId);
      useNotesStore.getState().setOverTrash(true);
    });

    expect(screen.getByRole('region', { name: 'Trash' })).toHaveClass('trash-zone--hover');
    expect(screen.getByText('Release to delete')).toBeInTheDocument();
  });

  it('goes back to idle when the drag ends', () => {
    render(<TrashZone />);

    act(() => {
      useNotesStore.getState().startDrag('note-1' as NoteId);
      useNotesStore.getState().endDrag();
    });

    expect(screen.getByRole('region', { name: 'Trash' })).toHaveClass('trash-zone--idle');
  });
});
