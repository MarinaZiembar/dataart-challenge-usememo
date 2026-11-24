export const NOTE_PATTERNS = [
  'lilac-blooms',
  'pink-stars',
  'lavender-checker',
  'hearts-checker',
  'wobbly-grid',
  'lavender-waves',
  'half-moons',
  'sunny-daisies',
] as const;

export type NotePattern = (typeof NOTE_PATTERNS)[number];

export type NoteId = string & { readonly __brand: 'NoteId' };

export interface Point {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export type Rect = Point & Size;

export interface Note extends Rect {
  id: NoteId;
  text: string;
  pattern: NotePattern;
  zIndex: number;
  createdAt: string;
  updatedAt: string;
}

export const NOTE_SIZE = {
  minWidth: 100,
  minHeight: 80,
  max: 600,
  default: 200,
} as const;

export const DEFAULT_PATTERN: NotePattern = 'pink-stars';

const CLICK_TOLERANCE = 4;

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

export const clampSize = ({ width, height }: Size): Size => ({
  width: Math.round(clamp(width, NOTE_SIZE.minWidth, NOTE_SIZE.max)),
  height: Math.round(clamp(height, NOTE_SIZE.minHeight, NOTE_SIZE.max)),
});

export const clampToBounds = (rect: Rect, bounds: Size): Rect => ({
  ...rect,
  x: Math.round(clamp(rect.x, 0, Math.max(0, bounds.width - rect.width))),
  y: Math.round(clamp(rect.y, 0, Math.max(0, bounds.height - rect.height))),
});

export const fitRect = (rect: Rect, bounds: Size): Rect =>
  clampToBounds({ ...rect, ...clampSize(rect) }, bounds);

export const resizeRect = (rect: Rect, size: Size, bounds: Size): Rect => {
  const clamped = clampSize(size);
  return {
    ...rect,
    width: Math.max(NOTE_SIZE.minWidth, Math.min(clamped.width, bounds.width - rect.x)),
    height: Math.max(NOTE_SIZE.minHeight, Math.min(clamped.height, bounds.height - rect.y)),
  };
};

export const rectFromPoints = (start: Point, end: Point): Rect => ({
  x: Math.min(start.x, end.x),
  y: Math.min(start.y, end.y),
  width: Math.abs(end.x - start.x),
  height: Math.abs(end.y - start.y),
});

export const isClick = (start: Point, end: Point) =>
  Math.abs(end.x - start.x) < CLICK_TOLERANCE && Math.abs(end.y - start.y) < CLICK_TOLERANCE;

export const defaultRectAt = (center: Point): Rect => ({
  x: center.x - NOTE_SIZE.default / 2,
  y: center.y - NOTE_SIZE.default / 2,
  width: NOTE_SIZE.default,
  height: NOTE_SIZE.default,
});

export const nextZIndex = (notes: Note[]) =>
  notes.reduce((max, note) => Math.max(max, note.zIndex), 0) + 1;

export const createId = () => crypto.randomUUID() as NoteId;

export const createNote = (rect: Rect, zIndex: number, now = new Date()): Note => ({
  ...rect,
  id: createId(),
  text: '',
  pattern: DEFAULT_PATTERN,
  zIndex,
  createdAt: now.toISOString(),
  updatedAt: now.toISOString(),
});
