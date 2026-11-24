import { STORAGE_KEY } from '../../constants/storage';
import type { Note, NoteId } from '../../types/notes';
import { useNotesStore } from '../notesStore';
import { persistNotes } from '../persistNotes';

const note: Note = {
  id: 'note-1' as NoteId,
  x: 10,
  y: 20,
  width: 200,
  height: 200,
  text: 'Call grandma',
  pattern: 'lilac-blooms',
  zIndex: 1,
  createdAt: '2026-11-24T00:00:00.000Z',
  updatedAt: '2026-11-24T00:00:00.000Z',
};

const stored = () => JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null') as Note[] | null;

describe('persistNotes', () => {
  let stop: () => void;

  beforeEach(() => {
    jest.useFakeTimers();
    localStorage.clear();
    useNotesStore.setState({ notes: [], drag: null, saveStatus: 'saved' });
  });

  afterEach(() => {
    stop();
    jest.useRealTimers();
  });

  it('restores the stored notes on start', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([note]));

    stop = persistNotes(localStorage);

    expect(useNotesStore.getState().notes).toEqual([note]);
    expect(useNotesStore.getState().saveStatus).toBe('saved');
  });

  it('saves changes after the delay', () => {
    stop = persistNotes(localStorage, 300);

    useNotesStore.getState().setNotes([note]);

    expect(useNotesStore.getState().saveStatus).toBe('saving');
    expect(stored()).toBeNull();

    jest.advanceTimersByTime(300);

    expect(stored()).toEqual([note]);
    expect(useNotesStore.getState().saveStatus).toBe('saved');
  });

  it('writes once for a burst of changes', () => {
    const setItem = jest.spyOn(Storage.prototype, 'setItem');
    stop = persistNotes(localStorage, 300);

    useNotesStore.getState().setNotes([note]);
    jest.advanceTimersByTime(200);
    useNotesStore.getState().updateText(note.id, 'Call grandma at 6');
    jest.advanceTimersByTime(300);

    expect(setItem).toHaveBeenCalledTimes(1);
    expect(stored()?.[0]?.text).toBe('Call grandma at 6');
    setItem.mockRestore();
  });

  it('ignores changes that do not touch the notes', () => {
    stop = persistNotes(localStorage, 300);

    useNotesStore.getState().startDrag(note.id);

    expect(useNotesStore.getState().saveStatus).toBe('saved');
  });

  it('saves pending changes when the page is hidden', () => {
    stop = persistNotes(localStorage, 300);

    useNotesStore.getState().setNotes([note]);
    window.dispatchEvent(new Event('pagehide'));

    expect(stored()).toEqual([note]);
  });

  it('reports unavailable storage', () => {
    stop = persistNotes(null);

    expect(useNotesStore.getState().saveStatus).toBe('unavailable');
  });

  it('stops saving once stopped', () => {
    persistNotes(localStorage, 300)();
    stop = () => undefined;

    useNotesStore.getState().setNotes([note]);
    jest.advanceTimersByTime(300);

    expect(stored()).toBeNull();
  });
});
