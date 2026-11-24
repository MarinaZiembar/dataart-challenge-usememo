import type { PointerEvent } from 'react';

interface PointerInit {
  x: number;
  y: number;
  currentTarget: HTMLElement;
  target?: EventTarget;
  button?: number;
}

interface Box {
  left: number;
  top: number;
  width: number;
  height: number;
}

export const pointer = ({
  x,
  y,
  currentTarget,
  target = currentTarget,
  button = 0,
}: PointerInit) =>
  ({
    clientX: x,
    clientY: y,
    button,
    pointerId: 1,
    target,
    currentTarget,
    stopPropagation: jest.fn(),
  }) as unknown as PointerEvent<HTMLElement>;

export const mockBox = (element: Element, box: Box) =>
  jest.spyOn(element, 'getBoundingClientRect').mockReturnValue(box as DOMRect);

export const pressEscape = () =>
  window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
