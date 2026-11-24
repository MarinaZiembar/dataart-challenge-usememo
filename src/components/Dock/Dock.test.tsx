import { fireEvent, render, screen } from '@testing-library/react';
import { Dock } from './Dock';
import { useNotesStore } from '../../store/notesStore';

describe('Dock', () => {
  beforeEach(() => {
    useNotesStore.setState({ notes: [], drag: null, newNotePattern: 'pink-stars' });
    Object.defineProperty(window, 'innerWidth', { configurable: true, value: 1440 });
    Object.defineProperty(window, 'innerHeight', { configurable: true, value: 900 });
  });

  it('creates a default note in the middle of the board', () => {
    render(<Dock />);

    fireEvent.click(screen.getByRole('button', { name: '+ New note' }));

    expect(useNotesStore.getState().notes[0]).toMatchObject({
      x: 620,
      y: 350,
      width: 200,
      height: 200,
    });
  });

  it('cascades new notes so they do not cover each other', () => {
    render(<Dock />);
    const button = screen.getByRole('button', { name: '+ New note' });

    fireEvent.click(button);
    fireEvent.click(button);

    expect(useNotesStore.getState().notes[1]).toMatchObject({ x: 644, y: 374 });
  });

  it('shows the pattern used for new notes', () => {
    render(<Dock />);

    expect(
      screen.getByRole('button', { name: 'Pattern for new notes: Pink stars' }),
    ).toHaveAttribute('aria-expanded', 'false');
  });

  it('creates new notes with the pattern picked in the dock', () => {
    render(<Dock />);

    fireEvent.click(screen.getByRole('button', { name: 'Pattern for new notes: Pink stars' }));
    fireEvent.click(screen.getByRole('radio', { name: 'Lavender waves' }));
    fireEvent.click(screen.getByRole('button', { name: '+ New note' }));

    expect(useNotesStore.getState().notes[0]?.pattern).toBe('lavender-waves');
    expect(
      screen.getByRole('button', { name: 'Pattern for new notes: Lavender waves' }),
    ).toHaveFocus();
  });
});
