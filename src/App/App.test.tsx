import { act, fireEvent, render, screen } from '@testing-library/react';
import { App } from './App';
import { SAVE_DELAY, STORAGE_KEY } from '../constants/storage';
import { persistNotes } from '../store/persistNotes';
import { useNotesStore } from '../store/notesStore';
import type { Note, NoteId } from '../types/notes';

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

let stopPersisting: () => void = () => undefined;

const seed = (notes: Note[]) => localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));

const stored = () => JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]') as Note[];

const startApp = (storage: Storage | null = localStorage) => {
  stopPersisting = persistNotes(storage);
  const view = render(<App />);
  const board = screen.getByRole('main', { name: 'Notes board' });
  mockRect(board, 0, 0, 1440, 900);
  mockRect(screen.getByRole('region', { name: 'Trash' }), 1252, 752, 160, 120);
  return { board, ...view };
};

const reloadApp = (unmount: () => void) => {
  unmount();
  stopPersisting();
  useNotesStore.setState({ notes: [], drag: null });
  return startApp();
};

const finishSaving = () =>
  act(() => {
    jest.advanceTimersByTime(SAVE_DELAY);
  });

const saveStatus = () => screen.getByRole('status');

const noteWithText = (text: string) => screen.getByText(text).closest('article') as HTMLElement;

const drag = (element: HTMLElement, from: [number, number], to: [number, number]) => {
  fireEvent.pointerDown(element, { clientX: from[0], clientY: from[1], button: 0, pointerId: 1 });
  fireEvent.pointerMove(element, { clientX: to[0], clientY: to[1], pointerId: 1 });
  fireEvent.pointerUp(element, { clientX: to[0], clientY: to[1], pointerId: 1 });
};

describe('App', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    localStorage.clear();
    useNotesStore.setState({
      notes: [],
      drag: null,
      saveStatus: 'saved',
      newNotePattern: 'pink-stars',
    });
  });

  afterEach(() => {
    stopPersisting();
    jest.restoreAllMocks();
    jest.useRealTimers();
  });

  it('renders the header, the board, the trash zone and the dock', () => {
    startApp();

    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByRole('main', { name: 'Notes board' })).toBeInTheDocument();
    expect(screen.getByRole('region', { name: 'Trash' })).toBeInTheDocument();
    expect(screen.getByRole('navigation', { name: 'Board tools' })).toBeInTheDocument();
  });

  describe('loading', () => {
    it('restores the saved notes and shows they are saved', () => {
      seed([note]);

      startApp();

      expect(noteWithText('Book dentist')).toHaveStyle({ left: '40px', top: '60px' });
      expect(saveStatus()).toHaveTextContent('All changes saved');
    });

    it('starts with an empty board when the saved data is broken', () => {
      localStorage.setItem(STORAGE_KEY, '{broken');

      startApp();

      expect(screen.getByRole('heading', { name: 'Your board is empty' })).toBeInTheDocument();
      expect(screen.queryByRole('article', { name: 'Note' })).not.toBeInTheDocument();
    });
  });

  describe('creating', () => {
    it('draws a note on the board and saves it', () => {
      const { board } = startApp();

      drag(board, [100, 120], [340, 300]);

      expect(screen.getByRole('article', { name: 'Note' })).toHaveStyle({
        left: '100px',
        top: '120px',
        width: '240px',
        height: '180px',
      });
      expect(saveStatus()).toHaveTextContent('Saving…');

      finishSaving();

      expect(saveStatus()).toHaveTextContent('All changes saved');
      expect(stored()[0]).toMatchObject({ x: 100, y: 120, width: 240, height: 180 });
    });

    it('creates a note from the dock with the pattern picked there', () => {
      startApp();

      fireEvent.click(screen.getByRole('button', { name: 'Pattern for new notes: Pink stars' }));
      fireEvent.click(screen.getByRole('radio', { name: 'Sunny daisies' }));
      fireEvent.click(screen.getByRole('button', { name: '+ New note' }));
      finishSaving();

      expect(screen.getByRole('article', { name: 'Note' })).toHaveAttribute(
        'data-pattern',
        'sunny-daisies',
      );
      expect(stored()[0]?.pattern).toBe('sunny-daisies');
    });
  });

  describe('editing', () => {
    it('moves a note, saves the new position and sticks the washi tape back on drop', () => {
      seed([note]);
      startApp();
      const article = noteWithText('Book dentist');

      fireEvent.pointerDown(article, { clientX: 100, clientY: 100, button: 0, pointerId: 1 });
      fireEvent.pointerMove(article, { clientX: 300, clientY: 250, pointerId: 1 });
      expect(screen.queryByTestId('washi-tape')).not.toBeInTheDocument();

      fireEvent.pointerUp(article, { clientX: 300, clientY: 250, pointerId: 1 });
      finishSaving();

      expect(article).toHaveStyle({ left: '240px', top: '210px' });
      expect(screen.getByTestId('washi-tape')).toBeInTheDocument();
      expect(stored()[0]).toMatchObject({ x: 240, y: 210 });
    });

    it('resizes a note, scales its text and saves the new size', () => {
      seed([note]);
      startApp();

      drag(screen.getByTitle('Resize'), [240, 260], [440, 460]);
      finishSaving();

      expect(noteWithText('Book dentist')).toHaveStyle({
        width: '400px',
        height: '400px',
        fontSize: '24px',
      });
      expect(stored()[0]).toMatchObject({ width: 400, height: 400 });
    });

    it('edits the text of a note and saves it', () => {
      seed([note]);
      startApp();

      fireEvent.doubleClick(noteWithText('Book dentist'));
      const field = screen.getByRole('textbox', { name: 'Note text' });
      fireEvent.change(field, { target: { value: 'Book dentist at 5pm' } });
      fireEvent.blur(field);
      finishSaving();

      expect(screen.getByText('Book dentist at 5pm')).toBeInTheDocument();
      expect(stored()[0]?.text).toBe('Book dentist at 5pm');
    });

    it('changes the pattern of a note and saves it', () => {
      seed([note]);
      startApp();

      fireEvent.click(screen.getByRole('button', { name: 'Change pattern' }));
      fireEvent.click(screen.getByRole('radio', { name: 'Lavender checker' }));
      finishSaving();

      const article = noteWithText('Book dentist');
      expect(article).toHaveAttribute('data-pattern', 'lavender-checker');
      expect(article.querySelector('svg[data-pattern="lavender-checker"]')).toBeInTheDocument();
      expect(stored()[0]?.pattern).toBe('lavender-checker');
    });

    it('brings an overlapped note to the front and keeps the order after a reload', () => {
      seed([
        { ...note, id: 'below' as NoteId, text: 'Below', zIndex: 1 },
        { ...note, id: 'above' as NoteId, text: 'Above', zIndex: 2 },
      ]);
      const { unmount } = startApp();

      drag(noteWithText('Below'), [100, 100], [100, 100]);
      finishSaving();
      reloadApp(unmount);

      expect(noteWithText('Below')).toHaveStyle({ zIndex: '3' });
      expect(noteWithText('Above')).toHaveStyle({ zIndex: '2' });
    });
  });

  describe('deleting', () => {
    it('deletes a note dropped on the trash zone and removes it from storage', () => {
      seed([note]);
      startApp();
      const article = noteWithText('Book dentist');

      fireEvent.pointerDown(article, { clientX: 100, clientY: 100, button: 0, pointerId: 1 });
      fireEvent.pointerMove(article, { clientX: 1300, clientY: 780, pointerId: 1 });

      expect(screen.getByText('Release to delete')).toBeInTheDocument();

      fireEvent.pointerUp(article, { clientX: 1300, clientY: 780, pointerId: 1 });
      finishSaving();

      expect(screen.queryByRole('article', { name: 'Note' })).not.toBeInTheDocument();
      expect(screen.getByText('Trash')).toBeInTheDocument();
      expect(stored()).toEqual([]);
    });

    it('keeps a note dropped anywhere else', () => {
      seed([note]);
      startApp();

      drag(noteWithText('Book dentist'), [100, 100], [700, 400]);
      finishSaving();

      expect(screen.getByRole('article', { name: 'Note' })).toBeInTheDocument();
      expect(stored()).toHaveLength(1);
    });
  });

  describe('saving problems', () => {
    it('warns when the storage is full and the board keeps working', () => {
      startApp();
      jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new DOMException('Full', 'QuotaExceededError');
      });

      fireEvent.click(screen.getByRole('button', { name: '+ New note' }));
      finishSaving();

      expect(saveStatus()).toHaveTextContent('Storage full · last change not saved');
      expect(screen.getByRole('article', { name: 'Note' })).toBeInTheDocument();
    });

    it('warns when the storage is blocked and the board keeps working', () => {
      startApp(null);

      fireEvent.click(screen.getByRole('button', { name: '+ New note' }));
      finishSaving();

      expect(saveStatus()).toHaveTextContent('Storage unavailable · changes won’t persist');
      expect(screen.getByRole('article', { name: 'Note' })).toBeInTheDocument();
    });
  });
});
