import { act, renderHook } from '@testing-library/react';
import { useNotesStore } from '../../store/notesStore';
import { mockBox, pointer, pressEscape } from '../../test/pointer';
import type { Note, NoteId } from '../../types/notes';
import { useMoveNote } from '../useMoveNote';

const note: Note = {
  id: 'note-1' as NoteId,
  x: 100,
  y: 100,
  width: 200,
  height: 200,
  text: 'Move me',
  pattern: 'pink-stars',
  zIndex: 1,
  createdAt: '2026-11-24T00:00:00.000Z',
  updatedAt: '2026-11-24T00:00:00.000Z',
};

const setup = ({ withTrash = true } = {}) => {
  const board = document.createElement('main');
  const element = document.createElement('article');
  board.append(element);
  document.body.append(board);
  mockBox(board, { left: 0, top: 0, width: 1000, height: 800 });
  if (withTrash) {
    const trash = document.createElement('div');
    trash.setAttribute('data-trash-zone', '');
    document.body.append(trash);
    mockBox(trash, { left: 800, top: 640, width: 160, height: 120 });
  }
  const { result } = renderHook(() => useMoveNote(note));
  const at = (x: number, y: number, options: { target?: EventTarget; button?: number } = {}) =>
    pointer({ x, y, currentTarget: element, ...options });
  return { result, at, element };
};

const stored = () => useNotesStore.getState().notes[0];

describe('useMoveNote', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    useNotesStore.setState({ notes: [note], drag: null });
  });

  it('follows the pointer and commits the position on release', () => {
    const { result, at } = setup();

    act(() => result.current.bodyProps.onPointerDown(at(150, 150)));
    act(() => result.current.bodyProps.onPointerMove(at(250, 200)));

    expect(result.current.offset).toEqual({ x: 100, y: 50 });
    expect(useNotesStore.getState().drag).toEqual({ id: note.id, overTrash: false });

    act(() => result.current.bodyProps.onPointerUp(at(250, 200)));

    expect(result.current.offset).toBeNull();
    expect(useNotesStore.getState().drag).toBeNull();
    expect(stored()).toMatchObject({ x: 200, y: 150 });
  });

  it('does not start a drag inside the click tolerance', () => {
    const { result, at } = setup();

    act(() => result.current.bodyProps.onPointerDown(at(150, 150)));
    act(() => result.current.bodyProps.onPointerMove(at(152, 151)));
    act(() => result.current.bodyProps.onPointerUp(at(152, 151)));

    expect(result.current.offset).toBeNull();
    expect(useNotesStore.getState().drag).toBeNull();
    expect(stored()).toBe(note);
  });

  it('keeps the note inside the board', () => {
    const { result, at } = setup();

    act(() => result.current.bodyProps.onPointerDown(at(150, 150)));
    act(() => result.current.bodyProps.onPointerMove(at(2000, -500)));

    expect(result.current.offset).toEqual({ x: 700, y: -100 });
  });

  it('marks the note over the trash zone and deletes it on release', () => {
    const { result, at } = setup();

    act(() => result.current.bodyProps.onPointerDown(at(150, 150)));
    act(() => result.current.bodyProps.onPointerMove(at(850, 650)));

    expect(useNotesStore.getState().drag).toEqual({ id: note.id, overTrash: true });
    expect(result.current.isOverTrash).toBe(true);

    act(() => result.current.bodyProps.onPointerUp(at(850, 650)));

    expect(useNotesStore.getState().notes).toEqual([]);
  });

  it('never marks the note over the trash when there is no trash zone', () => {
    const { result, at } = setup({ withTrash: false });

    act(() => result.current.bodyProps.onPointerDown(at(150, 150)));
    act(() => result.current.bodyProps.onPointerMove(at(850, 650)));

    expect(useNotesStore.getState().drag?.overTrash).toBe(false);
  });

  it('does not start from the text field', () => {
    const { result, at, element } = setup();
    const textarea = document.createElement('textarea');
    element.append(textarea);

    act(() => result.current.bodyProps.onPointerDown(at(150, 150, { target: textarea })));
    act(() => result.current.bodyProps.onPointerMove(at(250, 200)));

    expect(result.current.offset).toBeNull();
  });

  it('ignores buttons other than the main one', () => {
    const { result, at } = setup();

    act(() => result.current.bodyProps.onPointerDown(at(150, 150, { button: 2 })));
    act(() => result.current.bodyProps.onPointerMove(at(250, 200)));

    expect(result.current.offset).toBeNull();
  });

  it('cancels the drag with Escape and leaves the note where it was', () => {
    const { result, at } = setup();

    act(() => result.current.bodyProps.onPointerDown(at(150, 150)));
    act(() => result.current.bodyProps.onPointerMove(at(250, 200)));
    act(() => pressEscape());
    act(() => result.current.bodyProps.onPointerUp(at(250, 200)));

    expect(result.current.offset).toBeNull();
    expect(useNotesStore.getState().drag).toBeNull();
    expect(stored()).toBe(note);
  });

  it('stops the drag when the pointer is cancelled', () => {
    const { result, at } = setup();

    act(() => result.current.bodyProps.onPointerDown(at(150, 150)));
    act(() => result.current.bodyProps.onPointerMove(at(250, 200)));
    act(() => result.current.bodyProps.onPointerCancel());

    expect(result.current.offset).toBeNull();
    expect(useNotesStore.getState().drag).toBeNull();
    expect(stored()).toBe(note);
  });
});
