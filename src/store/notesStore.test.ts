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
});
