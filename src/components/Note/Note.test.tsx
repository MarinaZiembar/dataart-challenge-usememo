import { render, screen } from '@testing-library/react';
import { Note } from './Note';
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

describe('Note', () => {
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
});
