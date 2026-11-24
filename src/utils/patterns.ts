import { PATTERN_VIEW_SIZE } from '../constants/notes';
import type { Point, Size } from '../types/geometry';

const round = (value: number) => Math.round(value * 100) / 100;

const toRadians = (degrees: number) => (degrees * Math.PI) / 180;

export const polarPoint = (center: Point, radius: number, degrees: number): Point => ({
  x: round(center.x + radius * Math.cos(toRadians(degrees))),
  y: round(center.y + radius * Math.sin(toRadians(degrees))),
});

export const ringPoints = (center: Point, radius: number, count: number, rotation = 0) =>
  Array.from({ length: count }, (_, index) =>
    polarPoint(center, radius, rotation - 90 + (index * 360) / count),
  );

export const starPoints = (center: Point, outer: number, inner: number, rotation = 0) =>
  Array.from({ length: 10 }, (_, index) =>
    polarPoint(center, index % 2 === 0 ? outer : inner, rotation - 90 + index * 36),
  )
    .map(({ x, y }) => `${x},${y}`)
    .join(' ');

export const patternViewBox = ({ width, height }: Size, zoom = 1): Size => {
  const scale = PATTERN_VIEW_SIZE / zoom / Math.max(1, Math.min(width, height));
  return { width: round(width * scale), height: round(height * scale) };
};
