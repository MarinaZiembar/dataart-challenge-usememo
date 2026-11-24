import { create } from 'zustand';
import type { Note } from '../domain/note';

interface NotesState {
  notes: Note[];
  setNotes: (notes: Note[]) => void;
}

export const useNotesStore = create<NotesState>()((set) => ({
  notes: [],
  setNotes: (notes) => set({ notes }),
}));
