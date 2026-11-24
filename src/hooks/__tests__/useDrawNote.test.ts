import { act, renderHook } from '@testing-library/react';
import { useNotesStore } from '../../store/notesStore';
import { mockBox, pointer, pressEscape } from '../../test/pointer';
import { useDrawNote } from '../useDrawNote';

const setup = () => {
  const board = document.createElement('main');
  document.body.append(board);
  mockBox(board, { left: 10, top: 20, width: 1000, height: 800 });
  const { result } = renderHook(() => useDrawNote());
  const at = (x: number, y: number, options: { target?: EventTarget; button?: number } = {}) =>
    pointer({ x, y, currentTarget: board, ...options });
  return { result, at, board };
};

describe('useDrawNote', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    useNotesStore.setState({ notes: [], drag: null, newNotePattern: 'pink-stars' });
  });

  it('previews the rectangle while drawing and creates the note on release', () => {
    const { result, at } = setup();

    act(() => result.current.onPointerDown(at(110, 120)));
    expect(result.current.draft).toEqual({ x: 100, y: 100, width: 0, height: 0 });

    act(() => result.current.onPointerMove(at(310, 270)));
    expect(result.current.draft).toEqual({ x: 100, y: 100, width: 200, height: 150 });

    act(() => result.current.onPointerUp(at(310, 270)));
    expect(result.current.draft).toBeNull();
    expect(useNotesStore.getState().notes[0]).toMatchObject({
      x: 100,
      y: 100,
      width: 200,
      height: 150,
    });
  });

  it('draws towards the top left too', () => {
    const { result, at } = setup();

    act(() => result.current.onPointerDown(at(410, 420)));
    act(() => result.current.onPointerMove(at(210, 270)));

    expect(result.current.draft).toEqual({ x: 200, y: 250, width: 200, height: 150 });
  });

  it('creates a default note centered on a single click', () => {
    const { result, at } = setup();

    act(() => result.current.onPointerDown(at(510, 420)));
    act(() => result.current.onPointerUp(at(511, 421)));

    expect(useNotesStore.getState().notes[0]).toMatchObject({
      x: 401,
      y: 301,
      width: 200,
      height: 200,
    });
  });

  it('ignores presses that start on a note', () => {
    const { result, at } = setup();
    const note = document.createElement('article');

    act(() => result.current.onPointerDown(at(110, 120, { target: note })));

    expect(result.current.draft).toBeNull();
  });

  it('ignores buttons other than the main one', () => {
    const { result, at } = setup();

    act(() => result.current.onPointerDown(at(110, 120, { button: 2 })));

    expect(result.current.draft).toBeNull();
  });

  it('does not draw while a note is being edited', () => {
    const { result, at } = setup();
    const textarea = document.createElement('textarea');
    document.body.append(textarea);
    textarea.focus();

    act(() => result.current.onPointerDown(at(110, 120)));

    expect(result.current.draft).toBeNull();
  });

  it('cancels the drawing with Escape', () => {
    const { result, at } = setup();

    act(() => result.current.onPointerDown(at(110, 120)));
    act(() => result.current.onPointerMove(at(310, 270)));
    act(() => pressEscape());
    act(() => result.current.onPointerUp(at(310, 270)));

    expect(result.current.draft).toBeNull();
    expect(useNotesStore.getState().notes).toEqual([]);
  });

  it('cancels the drawing when the pointer is cancelled', () => {
    const { result, at } = setup();

    act(() => result.current.onPointerDown(at(110, 120)));
    act(() => result.current.onPointerCancel());
    act(() => result.current.onPointerUp(at(310, 270)));

    expect(useNotesStore.getState().notes).toEqual([]);
  });

  it('ignores moves and releases without a press', () => {
    const { result, at } = setup();

    act(() => result.current.onPointerMove(at(310, 270)));
    act(() => result.current.onPointerUp(at(310, 270)));

    expect(result.current.draft).toBeNull();
    expect(useNotesStore.getState().notes).toEqual([]);
  });
});
