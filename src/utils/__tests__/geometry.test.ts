import { clamp, clampToBounds, isClick, isOverlapping, rectFromPoints } from '../geometry';

describe('geometry utils', () => {
  it('clamps a value between a minimum and a maximum', () => {
    expect(clamp(5, 10, 20)).toBe(10);
    expect(clamp(25, 10, 20)).toBe(20);
    expect(clamp(15, 10, 20)).toBe(15);
  });

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

  describe('clampToBounds', () => {
    const bounds = { width: 1000, height: 800 };

    it('keeps a rect inside the bounds', () => {
      expect(clampToBounds({ x: 950, y: 750, width: 200, height: 200 }, bounds)).toEqual({
        x: 800,
        y: 600,
        width: 200,
        height: 200,
      });
    });

    it('keeps every other field of the object', () => {
      const rect = { x: -30, y: 900, width: 200, height: 200, text: 'Call Sofi' };

      expect(clampToBounds(rect, bounds)).toEqual({ ...rect, x: 0, y: 600 });
    });
  });

  it('detects a click when the pointer barely moves', () => {
    expect(isClick({ x: 100, y: 100 }, { x: 102, y: 101 })).toBe(true);
    expect(isClick({ x: 100, y: 100 }, { x: 140, y: 101 })).toBe(false);
  });

  it('detects overlapping rects', () => {
    const trash = { x: 800, y: 600, width: 160, height: 120 };

    expect(isOverlapping({ x: 700, y: 550, width: 200, height: 200 }, trash)).toBe(true);
    expect(isOverlapping({ x: 100, y: 100, width: 200, height: 200 }, trash)).toBe(false);
    expect(isOverlapping({ x: 600, y: 600, width: 200, height: 200 }, trash)).toBe(false);
  });
});
