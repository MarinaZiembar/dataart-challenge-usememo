import { fireEvent, render, screen } from '@testing-library/react';
import { App } from './App';
import { useNotesStore } from '../store/notesStore';
import type { Note, NoteId } from '../domain/note';

const note: Note = {
  id: 'note-1' as NoteId,
  x: 40,
  y: 60,
  width: 200,
  height: 200,
  text: 'Book dentist',
  pattern: 'half-moons',
  zIndex: 1,
  createdAt: '2026-11-24T00:00:00.000Z',
  updatedAt: '2026-11-24T00:00:00.000Z',
};

const mockRect = (element: HTMLElement, left: number, top: number, width: number, height: number) =>
  jest
    .spyOn(element, 'getBoundingClientRect')
    .mockReturnValue({ left, top, width, height } as DOMRect);

describe('App', () => {
  beforeEach(() => {
    useNotesStore.setState({ notes: [], drag: null });
  });

  it('renders the header, the board, the trash zone and the dock', () => {
    render(<App />);

    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByRole('main', { name: 'Notes board' })).toBeInTheDocument();
    expect(screen.getByRole('region', { name: 'Trash' })).toBeInTheDocument();
    expect(screen.getByRole('navigation', { name: 'Board tools' })).toBeInTheDocument();
  });

  it('deletes a note dropped on the trash zone', () => {
    useNotesStore.setState({ notes: [note] });
    render(<App />);
    mockRect(screen.getByRole('main', { name: 'Notes board' }), 0, 0, 1440, 900);
    mockRect(screen.getByRole('region', { name: 'Trash' }), 1252, 752, 160, 120);
    const article = screen.getByRole('article', { name: 'Note' });

    fireEvent.pointerDown(article, { clientX: 100, clientY: 100, button: 0, pointerId: 1 });
    fireEvent.pointerMove(article, { clientX: 1300, clientY: 780, pointerId: 1 });

    expect(screen.getByText('Release to delete')).toBeInTheDocument();

    fireEvent.pointerUp(article, { clientX: 1300, clientY: 780, pointerId: 1 });

    expect(screen.queryByRole('article', { name: 'Note' })).not.toBeInTheDocument();
    expect(screen.getByText('Trash')).toBeInTheDocument();
  });
});
