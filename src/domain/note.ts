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

export interface Note {
  id: NoteId;
  x: number;
  y: number;
  width: number;
  height: number;
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
