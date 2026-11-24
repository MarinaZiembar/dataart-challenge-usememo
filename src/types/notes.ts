import type { Rect } from './geometry';

export type NotePattern =
  | 'lilac-blooms'
  | 'pink-stars'
  | 'lavender-checker'
  | 'hearts-checker'
  | 'wobbly-grid'
  | 'lavender-waves'
  | 'half-moons'
  | 'sunny-daisies';

export type NoteId = string & { readonly __brand: 'NoteId' };

export interface Note extends Rect {
  id: NoteId;
  text: string;
  pattern: NotePattern;
  zIndex: number;
  createdAt: string;
  updatedAt: string;
}
