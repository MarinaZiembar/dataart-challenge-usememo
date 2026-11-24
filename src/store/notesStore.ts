import { create } from 'zustand';
import {
  createNote,
  fitRect,
  nextZIndex,
  type Note,
  type NoteId,
  type Rect,
  type Size,
} from '../domain/note';

interface NotesState {
  notes: Note[];
  setNotes: (notes: Note[]) => void;
  addNote: (rect: Rect, bounds: Size) => void;
  resizeNote: (id: NoteId, size: Size) => void;
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
}));
