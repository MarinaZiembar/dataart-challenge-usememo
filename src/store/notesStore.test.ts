import { useNotesStore } from './notesStore';
import type { Note, NoteId } from '../domain/note';

const note: Note = {
  id: 'note-1' as NoteId,
  x: 10,
  y: 20,
  width: 200,
  height: 200,
  text: 'Ship it before Friday!',
  pattern: 'pink-stars',
  zIndex: 1,
  createdAt: '2026-11-24T00:00:00.000Z',
  updatedAt: '2026-11-24T00:00:00.000Z',
};

const bounds = { width: 1000, height: 800 };

describe('notesStore', () => {
  beforeEach(() => {
    useNotesStore.setState({ notes: [] });
  });

  it('starts with an empty board', () => {
    expect(useNotesStore.getState().notes).toEqual([]);
  });

  it('replaces the notes with setNotes', () => {
    useNotesStore.getState().setNotes([note]);

    expect(useNotesStore.getState().notes).toEqual([note]);
  });

  it('adds a note with the given position and size', () => {
    useNotesStore.getState().addNote({ x: 40, y: 60, width: 240, height: 180 }, bounds);

    expect(useNotesStore.getState().notes[0]).toMatchObject({
      x: 40,
      y: 60,
      width: 240,
      height: 180,
      zIndex: 1,
    });
  });

  it('clamps the size and keeps the note inside the board', () => {
    useNotesStore.getState().addNote({ x: 990, y: 790, width: 20, height: 20 }, bounds);

    expect(useNotesStore.getState().notes[0]).toMatchObject({
      x: 900,
      y: 720,
      width: 100,
      height: 80,
    });
  });

  it('places every new note on top of the others', () => {
    useNotesStore.getState().setNotes([note]);
    useNotesStore.getState().addNote({ x: 0, y: 0, width: 200, height: 200 }, bounds);

    expect(useNotesStore.getState().notes[1]?.zIndex).toBe(2);
  });

  it('resizes only the given note', () => {
    const other = { ...note, id: 'note-2' as NoteId };
    useNotesStore.getState().setNotes([note, other]);

    useNotesStore.getState().resizeNote(note.id, { width: 320, height: 240 });

    const [resized, untouched] = useNotesStore.getState().notes;
    expect(resized).toMatchObject({ width: 320, height: 240, x: 10, y: 20 });
    expect(resized?.updatedAt).not.toBe(note.updatedAt);
    expect(untouched).toEqual(other);
  });

  it('moves a note and keeps it inside the board', () => {
    useNotesStore.getState().setNotes([note]);

    useNotesStore.getState().moveNote(note.id, { x: 300, y: 250 }, bounds);
    expect(useNotesStore.getState().notes[0]).toMatchObject({ x: 300, y: 250 });

    useNotesStore.getState().moveNote(note.id, { x: 2000, y: -50 }, bounds);
    expect(useNotesStore.getState().notes[0]).toMatchObject({ x: 800, y: 0 });
  });
});
