import { DEFAULT_PATTERN, MAX_Z_INDEX, NOTE_FONT_SIZE, NOTE_SIZE } from '../constants/notes';
import type { Point, Rect, Size } from '../types/geometry';
import type { Note, NoteId } from '../types/notes';
import { clamp, clampToBounds } from './geometry';

export const clampSize = ({ width, height }: Size): Size => ({
  width: Math.round(clamp(width, NOTE_SIZE.minWidth, NOTE_SIZE.max)),
  height: Math.round(clamp(height, NOTE_SIZE.minHeight, NOTE_SIZE.max)),
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

export const defaultRectAt = (center: Point): Rect => ({
  x: center.x - NOTE_SIZE.default / 2,
  y: center.y - NOTE_SIZE.default / 2,
  width: NOTE_SIZE.default,
  height: NOTE_SIZE.default,
});

export const noteFontSize = ({ width, height }: Size) => {
  const scale = Math.sqrt(width * height) / NOTE_SIZE.default;
  return Math.round(clamp(NOTE_FONT_SIZE.default * scale, NOTE_FONT_SIZE.min, NOTE_FONT_SIZE.max));
};

export const nextZIndex = (notes: Note[]) =>
  notes.reduce((max, note) => Math.max(max, note.zIndex), 0) + 1;

const normalizeZIndexes = (notes: Note[]) => {
  const order = [...notes].sort((a, b) => a.zIndex - b.zIndex).map((note) => note.id);
  return notes.map((note) => ({ ...note, zIndex: order.indexOf(note.id) + 1 }));
};

export const bringToFront = (notes: Note[], id: NoteId): Note[] => {
  const target = notes.find((note) => note.id === id);
  if (!target) return notes;
  const isOnTop = notes.every((note) => note.id === id || note.zIndex < target.zIndex);
  if (isOnTop) return notes;
  const zIndex = nextZIndex(notes);
  const raised = notes.map((note) => (note.id === id ? { ...note, zIndex } : note));
  return zIndex > MAX_Z_INDEX ? normalizeZIndexes(raised) : raised;
};

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
