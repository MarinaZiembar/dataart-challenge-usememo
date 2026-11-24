import { create } from 'zustand';
import {
  clampToBounds,
  createNote,
  fitRect,
  nextZIndex,
  type Note,
  type NoteId,
  type Point,
  type Rect,
  type Size,
} from '../domain/note';

interface NotesState {
  notes: Note[];
  setNotes: (notes: Note[]) => void;
  addNote: (rect: Rect, bounds: Size) => void;
  resizeNote: (id: NoteId, size: Size) => void;
  moveNote: (id: NoteId, position: Point, bounds: Size) => void;
}

export const useNotesStore = create<NotesState>()((set) => ({
  notes: [],
  setNotes: (notes) => set({ notes }),
  addNote: (rect, bounds) =>
    set((state) => ({
      notes: [...state.notes, createNote(fitRect(rect, bounds), nextZIndex(state.notes))],
    })),
  resizeNote: (id, size) =>
    set((state) => ({
      notes: state.notes.map((note) =>
        note.id === id ? { ...note, ...size, updatedAt: new Date().toISOString() } : note,
      ),
    })),
  moveNote: (id, position, bounds) =>
    set((state) => ({
      notes: state.notes.map((note) =>
        note.id === id
          ? {
              ...clampToBounds({ ...note, ...position }, bounds),
              updatedAt: new Date().toISOString(),
            }
          : note,
      ),
    })),
}));
