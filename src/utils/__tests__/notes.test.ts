import type { Note, NoteId } from '../../types/notes';
import {
  bringToFront,
  clampSize,
  createNote,
  defaultRectAt,
  fitRect,
  isNote,
  nextZIndex,
  noteFontSize,
  resizeRect,
} from '../notes';

describe('notes utils', () => {
  describe('clampSize', () => {
    it('raises a size below the minimum', () => {
      expect(clampSize({ width: 30, height: 10 })).toEqual({ width: 100, height: 80 });
    });

    it('limits a size above the maximum', () => {
      expect(clampSize({ width: 900, height: 700 })).toEqual({ width: 600, height: 600 });
    });

    it('keeps a valid size', () => {
      expect(clampSize({ width: 240, height: 180 })).toEqual({ width: 240, height: 180 });
    });
  });

  describe('fitRect', () => {
    const bounds = { width: 1000, height: 800 };

    it('keeps the note inside the board', () => {
      expect(fitRect({ x: 950, y: 750, width: 200, height: 200 }, bounds)).toEqual({
        x: 800,
        y: 600,
        width: 200,
        height: 200,
      });
    });

    it('moves a note with negative coordinates back to the board', () => {
      expect(fitRect({ x: -40, y: -10, width: 200, height: 200 }, bounds)).toEqual({
        x: 0,
        y: 0,
        width: 200,
        height: 200,
      });
    });
  });

  describe('resizeRect', () => {
    const rect = { x: 100, y: 100, width: 200, height: 200 };
    const bounds = { width: 1000, height: 800 };

    it('applies the new size and keeps the position', () => {
      expect(resizeRect(rect, { width: 320, height: 240 }, bounds)).toEqual({
        x: 100,
        y: 100,
        width: 320,
        height: 240,
      });
    });

    it('respects the minimum and maximum size', () => {
      expect(resizeRect(rect, { width: 10, height: 10 }, bounds)).toMatchObject({
        width: 100,
        height: 80,
      });
      expect(resizeRect(rect, { width: 900, height: 900 }, bounds)).toMatchObject({
        width: 600,
        height: 600,
      });
    });

    it('stops at the board edges', () => {
      expect(
        resizeRect({ ...rect, x: 700, y: 600 }, { width: 500, height: 500 }, bounds),
      ).toMatchObject({ width: 300, height: 200 });
    });
  });

  it('centers the default note on a point', () => {
    expect(defaultRectAt({ x: 300, y: 300 })).toEqual({ x: 200, y: 200, width: 200, height: 200 });
  });

  describe('noteFontSize', () => {
    it('uses 16px for the default 200 × 200 note', () => {
      expect(noteFontSize({ width: 200, height: 200 })).toBe(16);
    });

    it('grows with the note', () => {
      expect(noteFontSize({ width: 260, height: 260 })).toBe(21);
    });

    it('never goes below 14px', () => {
      expect(noteFontSize({ width: 100, height: 80 })).toBe(14);
    });

    it('never goes above 24px', () => {
      expect(noteFontSize({ width: 600, height: 600 })).toBe(24);
    });
  });

  it('returns the next z-index', () => {
    expect(nextZIndex([])).toBe(1);
    expect(nextZIndex([{ zIndex: 3 }, { zIndex: 7 }] as Note[])).toBe(8);
  });

  describe('bringToFront', () => {
    const stack = (zIndexes: number[]) =>
      zIndexes.map((zIndex, index) => ({ id: `note-${index}` as NoteId, zIndex }) as Note);

    it('puts the note above all the others', () => {
      const notes = bringToFront(stack([1, 2, 3]), 'note-0' as NoteId);

      expect(notes.map((note) => note.zIndex)).toEqual([4, 2, 3]);
    });

    it('returns the same list when the note is already on top', () => {
      const notes = stack([1, 2, 3]);

      expect(bringToFront(notes, 'note-2' as NoteId)).toBe(notes);
    });

    it('returns the same list for an unknown note', () => {
      const notes = stack([1, 2]);

      expect(bringToFront(notes, 'missing' as NoteId)).toBe(notes);
    });

    it('renumbers the layers when they grow too much', () => {
      const notes = bringToFront(stack([998, 999, 1000]), 'note-0' as NoteId);

      expect(notes.map((note) => note.zIndex)).toEqual([3, 1, 2]);
    });
  });

  it('creates a note with the given rect and defaults', () => {
    const now = new Date('2026-11-24T12:00:00.000Z');
    const note = createNote({ x: 10, y: 20, width: 200, height: 150 }, 4, now);

    expect(note).toMatchObject({
      x: 10,
      y: 20,
      width: 200,
      height: 150,
      text: '',
      pattern: 'pink-stars',
      zIndex: 4,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    });
    expect(note.id).toEqual(expect.any(String));
  });

  describe('isNote', () => {
    const note = createNote({ x: 0, y: 0, width: 200, height: 200 }, 1);

    it('accepts a valid note', () => {
      expect(isNote(note)).toBe(true);
    });

    it.each([
      ['null', null],
      ['a string', 'note'],
      ['a missing id', { ...note, id: undefined }],
      ['a non numeric position', { ...note, x: '10' }],
      ['an infinite size', { ...note, width: Infinity }],
      ['an unknown pattern', { ...note, pattern: 'plaid' }],
      ['a text over the limit', { ...note, text: 'a'.repeat(1001) }],
    ])('rejects %s', (_, value) => {
      expect(isNote(value)).toBe(false);
    });
  });
});
