import { patternViewBox, polarPoint, ringPoints, starPoints } from '../patterns';

describe('patterns utils', () => {
  describe('polarPoint', () => {
    it('moves from the center by the radius at the given angle', () => {
      expect(polarPoint({ x: 10, y: 10 }, 5, 0)).toEqual({ x: 15, y: 10 });
      expect(polarPoint({ x: 10, y: 10 }, 5, 90)).toEqual({ x: 10, y: 15 });
    });
  });

  describe('ringPoints', () => {
    it('spreads the points evenly starting at the top', () => {
      const points = ringPoints({ x: 0, y: 0 }, 4, 4);

      expect(points).toEqual([
        { x: 0, y: -4 },
        { x: 4, y: 0 },
        { x: 0, y: 4 },
        { x: -4, y: 0 },
      ]);
    });

    it('rotates the ring', () => {
      expect(ringPoints({ x: 0, y: 0 }, 4, 4, 90)[0]).toEqual({ x: 4, y: 0 });
    });
  });

  describe('starPoints', () => {
    it('alternates 5 outer and 5 inner points', () => {
      const points = starPoints({ x: 0, y: 0 }, 6, 3).split(' ');

      expect(points).toHaveLength(10);
      expect(points[0]).toBe('0,-6');
    });
  });

  describe('patternViewBox', () => {
    it('maps the short side of the note to 150 units', () => {
      expect(patternViewBox({ width: 200, height: 200 })).toEqual({ width: 150, height: 150 });
      expect(patternViewBox({ width: 400, height: 200 })).toEqual({ width: 300, height: 150 });
      expect(patternViewBox({ width: 100, height: 300 })).toEqual({ width: 150, height: 450 });
    });

    it('zooms in to show fewer tiles', () => {
      expect(patternViewBox({ width: 44, height: 44 }, 2)).toEqual({ width: 75, height: 75 });
    });
  });
});
