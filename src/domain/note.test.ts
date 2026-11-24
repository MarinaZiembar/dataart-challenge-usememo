import {
  clampSize,
  clampToBounds,
  createNote,
  defaultRectAt,
  fitRect,
  isClick,
  isOverlapping,
  resizeRect,
  nextZIndex,
  noteFontSize,
  rectFromPoints,
  type Note,
} from './note';

describe('note domain', () => {
  describe('rectFromPoints', () => {
    it('builds a rect from top-left to bottom-right', () => {
      expect(rectFromPoints({ x: 10, y: 20 }, { x: 110, y: 220 })).toEqual({
        x: 10,
        y: 20,
        width: 100,
        height: 200,
      });
    });

    it('builds the same rect when drawing upwards to the left', () => {
      expect(rectFromPoints({ x: 110, y: 220 }, { x: 10, y: 20 })).toEqual({
        x: 10,
        y: 20,
        width: 100,
        height: 200,
      });
    });
  });

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

  it('clamps a moved note and keeps its other fields', () => {
    const moved = clampToBounds(
      { ...createNote({ x: 0, y: 0, width: 200, height: 200 }, 1), x: -30, y: 900 },
      {
        width: 1000,
        height: 800,
      },
    );

    expect(moved).toMatchObject({ x: 0, y: 600, zIndex: 1, text: '' });
  });

  it('detects overlapping rects', () => {
    const trash = { x: 800, y: 600, width: 160, height: 120 };

    expect(isOverlapping({ x: 700, y: 550, width: 200, height: 200 }, trash)).toBe(true);
    expect(isOverlapping({ x: 100, y: 100, width: 200, height: 200 }, trash)).toBe(false);
    expect(isOverlapping({ x: 600, y: 600, width: 200, height: 200 }, trash)).toBe(false);
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

  it('detects a click when the pointer barely moves', () => {
    expect(isClick({ x: 100, y: 100 }, { x: 102, y: 101 })).toBe(true);
    expect(isClick({ x: 100, y: 100 }, { x: 140, y: 101 })).toBe(false);
  });

  it('centers the default note on a point', () => {
    expect(defaultRectAt({ x: 300, y: 300 })).toEqual({ x: 200, y: 200, width: 200, height: 200 });
  });

  it('returns the next z-index', () => {
    expect(nextZIndex([])).toBe(1);
    expect(nextZIndex([{ zIndex: 3 }, { zIndex: 7 }] as Note[])).toBe(8);
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
});
