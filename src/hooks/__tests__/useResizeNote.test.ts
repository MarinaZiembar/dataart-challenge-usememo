import { act, renderHook } from '@testing-library/react';
import { useNotesStore } from '../../store/notesStore';
import { mockBox, pointer, pressEscape } from '../../test/pointer';
import type { Note, NoteId } from '../../types/notes';
import { useResizeNote } from '../useResizeNote';

const note: Note = {
  id: 'note-1' as NoteId,
  x: 100,
  y: 100,
  width: 200,
  height: 200,
  text: 'Resize me',
  pattern: 'half-moons',
  zIndex: 1,
  createdAt: '2026-11-24T00:00:00.000Z',
  updatedAt: '2026-11-24T00:00:00.000Z',
};

const setup = () => {
  const board = document.createElement('main');
  const handle = document.createElement('span');
  board.append(handle);
  document.body.append(board);
  mockBox(board, { left: 0, top: 0, width: 1000, height: 800 });
  const { result } = renderHook(() => useResizeNote(note));
  const at = (x: number, y: number, button = 0) =>
    pointer({ x, y, currentTarget: handle, button });
  return { result, at };
};

const stored = () => useNotesStore.getState().notes[0];

describe('useResizeNote', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    useNotesStore.setState({ notes: [note], drag: null });
  });

  it('previews the size while dragging and commits it on release', () => {
    const { result, at } = setup();
    const down = at(300, 300);

    act(() => result.current.handleProps.onPointerDown(down));
    expect(down.stopPropagation).toHaveBeenCalled();
    expect(result.current.size).toEqual({ width: 200, height: 200 });

    act(() => result.current.handleProps.onPointerMove(at(350, 340)));
    expect(result.current.size).toEqual({ width: 250, height: 240 });
    expect(stored()).toBe(note);

    act(() => result.current.handleProps.onPointerUp(at(350, 340)));
    expect(result.current.size).toBeNull();
    expect(stored()).toMatchObject({ x: 100, y: 100, width: 250, height: 240 });
  });

  it('never goes below the minimum size', () => {
    const { result, at } = setup();

    act(() => result.current.handleProps.onPointerDown(at(300, 300)));
    act(() => result.current.handleProps.onPointerMove(at(100, 100)));

    expect(result.current.size).toEqual({ width: 100, height: 80 });
  });

  it('never goes over the maximum size or out of the board', () => {
    const { result, at } = setup();

    act(() => result.current.handleProps.onPointerDown(at(300, 300)));
    act(() => result.current.handleProps.onPointerMove(at(2000, 2000)));

    expect(result.current.size).toEqual({ width: 600, height: 600 });
  });

  it('ignores buttons other than the main one but still stops the event', () => {
    const { result, at } = setup();
    const down = at(300, 300, 2);

    act(() => result.current.handleProps.onPointerDown(down));

    expect(down.stopPropagation).toHaveBeenCalled();
    expect(result.current.size).toBeNull();
  });

  it('restores the size with Escape', () => {
    const { result, at } = setup();

    act(() => result.current.handleProps.onPointerDown(at(300, 300)));
    act(() => result.current.handleProps.onPointerMove(at(350, 340)));
    act(() => pressEscape());
    act(() => result.current.handleProps.onPointerUp(at(350, 340)));

    expect(result.current.size).toBeNull();
    expect(stored()).toBe(note);
  });

  it('drops the preview when the pointer is cancelled', () => {
    const { result, at } = setup();

    act(() => result.current.handleProps.onPointerDown(at(300, 300)));
    act(() => result.current.handleProps.onPointerMove(at(350, 340)));
    act(() => result.current.handleProps.onPointerCancel());

    expect(result.current.size).toBeNull();
    expect(stored()).toBe(note);
  });

  it('ignores moves and releases without a press', () => {
    const { result, at } = setup();
    const up = at(350, 340);

    act(() => result.current.handleProps.onPointerMove(at(350, 340)));
    act(() => result.current.handleProps.onPointerUp(up));

    expect(up.stopPropagation).toHaveBeenCalled();
    expect(result.current.size).toBeNull();
    expect(stored()).toBe(note);
  });
});
