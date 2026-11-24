import { STORAGE_KEY } from '../../constants/storage';
import type { Note, NoteId } from '../../types/notes';
import { getStorage, loadNotes, saveNotes } from '../notesStorage';

const note: Note = {
  id: 'note-1' as NoteId,
  x: 10,
  y: 20,
  width: 200,
  height: 200,
  text: 'Water the plants',
  pattern: 'sunny-daisies',
  zIndex: 1,
  createdAt: '2026-11-24T00:00:00.000Z',
  updatedAt: '2026-11-24T00:00:00.000Z',
};

const failingStorage = (error: unknown) =>
  ({
    getItem: () => {
      throw error;
    },
    setItem: () => {
      throw error;
    },
  }) as unknown as Storage;

describe('notesStorage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('getStorage', () => {
    it('returns localStorage when it is available', () => {
      expect(getStorage()).toBe(window.localStorage);
    });

    it('returns null when localStorage throws', () => {
      const spy = jest.spyOn(window, 'localStorage', 'get').mockImplementation(() => {
        throw new DOMException('Denied', 'SecurityError');
      });

      expect(getStorage()).toBeNull();
      spy.mockRestore();
    });
  });

  describe('loadNotes', () => {
    it('returns an empty list when nothing is stored', () => {
      expect(loadNotes(localStorage)).toEqual([]);
    });

    it('returns an empty list without storage', () => {
      expect(loadNotes(null)).toEqual([]);
    });

    it('restores the stored notes', () => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([note]));

      expect(loadNotes(localStorage)).toEqual([note]);
    });

    it('ignores corrupted data', () => {
      localStorage.setItem(STORAGE_KEY, '{not json');

      expect(loadNotes(localStorage)).toEqual([]);
    });

    it('ignores data that is not a list', () => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ notes: [note] }));

      expect(loadNotes(localStorage)).toEqual([]);
    });

    it('drops invalid and duplicated notes', () => {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify([note, { ...note, text: 'Copy' }, { ...note, id: 'note-2', x: 'left' }]),
      );

      expect(loadNotes(localStorage)).toEqual([note]);
    });

    it('fits stored sizes to the size limits', () => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([{ ...note, width: 20, height: 900 }]));

      expect(loadNotes(localStorage)[0]).toMatchObject({ width: 100, height: 600 });
    });

    it('returns an empty list when reading fails', () => {
      expect(loadNotes(failingStorage(new Error('Denied')))).toEqual([]);
    });
  });

  describe('saveNotes', () => {
    it('writes the notes and reports saved', () => {
      expect(saveNotes([note], localStorage)).toBe('saved');
      expect(JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '')).toEqual([note]);
    });

    it('reports quota when the storage is full', () => {
      const storage = failingStorage(new DOMException('Full', 'QuotaExceededError'));

      expect(saveNotes([note], storage)).toBe('quota');
    });

    it('reports unavailable on any other error', () => {
      expect(saveNotes([note], failingStorage(new Error('Denied')))).toBe('unavailable');
    });

    it('reports unavailable without storage', () => {
      expect(saveNotes([note], null)).toBe('unavailable');
    });
  });
});
