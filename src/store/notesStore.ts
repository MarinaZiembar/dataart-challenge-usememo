import { create } from 'zustand';
import { createNote, fitRect, nextZIndex, type Note, type Rect, type Size } from '../domain/note';

interface NotesState {
  notes: Note[];
  setNotes: (notes: Note[]) => void;
  addNote: (rect: Rect, bounds: Size) => void;
}

export const useNotesStore = create<NotesState>()((set) => ({
  notes: [],
  setNotes: (notes) => set({ notes }),
  addNote: (rect, bounds) =>
    set((state) => ({
      notes: [...state.notes, createNote(fitRect(rect, bounds), nextZIndex(state.notes))],
    })),
}));
