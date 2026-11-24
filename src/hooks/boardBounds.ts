import type { Size } from '../domain/note';

export const boardBounds = (element: HTMLElement): Size => {
  const board = element.closest('main') ?? document.body;
  const box = board.getBoundingClientRect();
  return { width: box.width, height: box.height };
};
