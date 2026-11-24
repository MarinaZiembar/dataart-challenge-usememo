import type { Rect } from '../types/geometry';

const toRect = (box: DOMRect): Rect => ({
  x: box.left,
  y: box.top,
  width: box.width,
  height: box.height,
});

export const boardBounds = (element: HTMLElement): Rect =>
  toRect((element.closest('main') ?? document.body).getBoundingClientRect());

export const trashZoneRect = (): Rect | null => {
  const trash = document.querySelector('[data-trash-zone]');
  return trash ? toRect(trash.getBoundingClientRect()) : null;
};
