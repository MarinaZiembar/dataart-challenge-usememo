import type { Point, Rect, Size } from '../types/geometry';

const CLICK_TOLERANCE = 4;

export const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

export const clampToBounds = <T extends Rect>(rect: T, bounds: Size): T => ({
  ...rect,
  x: Math.round(clamp(rect.x, 0, Math.max(0, bounds.width - rect.width))),
  y: Math.round(clamp(rect.y, 0, Math.max(0, bounds.height - rect.height))),
});

export const rectFromPoints = (start: Point, end: Point): Rect => ({
  x: Math.min(start.x, end.x),
  y: Math.min(start.y, end.y),
  width: Math.abs(end.x - start.x),
  height: Math.abs(end.y - start.y),
});

export const isClick = (start: Point, end: Point) =>
  Math.abs(end.x - start.x) < CLICK_TOLERANCE && Math.abs(end.y - start.y) < CLICK_TOLERANCE;

export const isOverlapping = (a: Rect, b: Rect) =>
  a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
