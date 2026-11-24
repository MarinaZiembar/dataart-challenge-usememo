import type { NotePattern } from '../types/notes';

export const NOTE_PATTERNS: readonly NotePattern[] = [
  'lilac-blooms',
  'pink-stars',
  'lavender-checker',
  'hearts-checker',
  'wobbly-grid',
  'lavender-waves',
  'half-moons',
  'sunny-daisies',
];

export const DEFAULT_PATTERN: NotePattern = 'pink-stars';

export const NOTE_SIZE = {
  minWidth: 100,
  minHeight: 80,
  max: 600,
  default: 200,
} as const;

export const NOTE_FONT_SIZE = {
  min: 14,
  default: 16,
  max: 24,
} as const;

export const MAX_TEXT_LENGTH = 1000;

export const MAX_Z_INDEX = 1000;

export const PATTERN_LABELS: Record<NotePattern, string> = {
  'lilac-blooms': 'Lilac blooms',
  'pink-stars': 'Pink stars',
  'lavender-checker': 'Lavender checker',
  'hearts-checker': 'Hearts checker',
  'wobbly-grid': 'Wobbly grid',
  'lavender-waves': 'Lavender waves',
  'half-moons': 'Half moons',
  'sunny-daisies': 'Sunny daisies',
};

export const PATTERN_VIEW_SIZE = 150;
