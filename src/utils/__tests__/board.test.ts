import { boardBounds, trashZoneRect } from '../board';

const box = (left: number, top: number, width: number, height: number) =>
  ({ left, top, width, height }) as DOMRect;

describe('board utils', () => {
  afterEach(() => {
    document.body.innerHTML = '';
    jest.restoreAllMocks();
  });

  it('returns the rect of the board that contains the element', () => {
    document.body.innerHTML = '<main><article></article></main>';
    const board = document.querySelector('main') as HTMLElement;
    jest.spyOn(board, 'getBoundingClientRect').mockReturnValue(box(10, 20, 1000, 800));

    expect(boardBounds(document.querySelector('article') as HTMLElement)).toEqual({
      x: 10,
      y: 20,
      width: 1000,
      height: 800,
    });
  });

  it('returns the rect of the trash zone', () => {
    document.body.innerHTML = '<div data-trash-zone></div>';
    const trash = document.querySelector('[data-trash-zone]') as HTMLElement;
    jest.spyOn(trash, 'getBoundingClientRect').mockReturnValue(box(1252, 752, 160, 120));

    expect(trashZoneRect()).toEqual({ x: 1252, y: 752, width: 160, height: 120 });
  });

  it('returns null when there is no trash zone', () => {
    expect(trashZoneRect()).toBeNull();
  });
});
