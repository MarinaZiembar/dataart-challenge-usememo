import { createRef } from 'react';
import { renderHook } from '@testing-library/react';
import { useDismiss } from '../useDismiss';

const setup = () => {
  const inside = document.createElement('div');
  const anchor = document.createElement('button');
  const outside = document.createElement('div');
  document.body.append(inside, anchor, outside);
  const insideRef = createRef<HTMLElement>();
  const anchorRef = createRef<HTMLElement>();
  Object.assign(insideRef, { current: inside });
  Object.assign(anchorRef, { current: anchor });
  const refs = [insideRef, anchorRef];
  const onDismiss = jest.fn();
  const hook = renderHook(() => useDismiss(refs, onDismiss));
  return { inside, anchor, outside, onDismiss, ...hook };
};

const press = (element: Element) =>
  element.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));

describe('useDismiss', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('dismisses on a press outside every ref', () => {
    const { outside, onDismiss } = setup();

    press(outside);

    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it('keeps it open on a press inside any ref', () => {
    const { inside, anchor, onDismiss } = setup();
    const child = document.createElement('span');
    inside.append(child);

    press(child);
    press(anchor);

    expect(onDismiss).not.toHaveBeenCalled();
  });

  it('does not pass the outside press on to the page', () => {
    const { outside } = setup();
    const onPagePress = jest.fn();
    outside.addEventListener('pointerdown', onPagePress);

    press(outside);

    expect(onPagePress).not.toHaveBeenCalled();
  });

  it('stops listening once unmounted', () => {
    const { outside, onDismiss, unmount } = setup();

    unmount();
    press(outside);

    expect(onDismiss).not.toHaveBeenCalled();
  });
});
