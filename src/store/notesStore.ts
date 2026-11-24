import { create } from 'zustand';
import type { Point, Rect, Size } from '../types/geometry';
import type { Note, NoteId } from '../types/notes';
import type { SaveStatus } from '../types/storage';
import { clampToBounds } from '../utils/geometry';
import { bringToFront, createNote, fitRect, nextZIndex } from '../utils/notes';

interface Drag {
  id: NoteId;
  overTrash: boolean;
}

interface NotesState {
  notes: Note[];
  drag: Drag | null;
  saveStatus: SaveStatus;
  setNotes: (notes: Note[]) => void;
  addNote: (rect: Rect, bounds: Size) => void;
  resizeNote: (id: NoteId, size: Size) => void;
  moveNote: (id: NoteId, position: Point, bounds: Size) => void;
  removeNote: (id: NoteId) => void;
  updateText: (id: NoteId, text: string) => void;
  bringToFront: (id: NoteId) => void;
  startDrag: (id: NoteId) => void;
  setOverTrash: (overTrash: boolean) => void;
  endDrag: () => void;
  setSaveStatus: (saveStatus: SaveStatus) => void;
}

export const useNotesStore = create<NotesState>()((set) => ({
  notes: [],
  drag: null,
  saveStatus: 'saved',
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
  removeNote: (id) => set((state) => ({ notes: state.notes.filter((note) => note.id !== id) })),
  updateText: (id, text) =>
    set((state) => ({
      notes: state.notes.map((note) =>
        note.id === id && note.text !== text
          ? { ...note, text, updatedAt: new Date().toISOString() }
          : note,
      ),
    })),
  bringToFront: (id) =>
    set((state) => {
      const notes = bringToFront(state.notes, id);
      return notes === state.notes ? state : { notes };
    }),
  startDrag: (id) => set({ drag: { id, overTrash: false } }),
  setOverTrash: (overTrash) =>
    set((state) =>
      state.drag && state.drag.overTrash !== overTrash
        ? { drag: { ...state.drag, overTrash } }
        : state,
    ),
  endDrag: () => set({ drag: null }),
  setSaveStatus: (saveStatus) =>
    set((state) => (state.saveStatus === saveStatus ? state : { saveStatus })),
}));
