import { expect, test } from './fixtures';
import { seedNote } from './pages/BoardPage';

test.describe('Notes on the board', () => {
  test('creates a note with the drawn size and position', async ({ boardPage, page }) => {
    await boardPage.open();

    await boardPage.draw({ x: 200, y: 160 }, { x: 440, y: 340 });
    await expect(page.getByText('240 × 180')).toBeVisible();
    await page.mouse.up();

    const note = boardPage.noteAt(0);
    await expect(note.root).toHaveCSS('left', '200px');
    await expect(note.root).toHaveCSS('top', '160px');
    await expect(note.root).toHaveCSS('width', '240px');
    await expect(note.root).toHaveCSS('height', '180px');
    await expect(boardPage.emptyState).toBeHidden();
  });

  test('creates a default note with a single click', async ({ boardPage }) => {
    await boardPage.open();

    await boardPage.drawNote({ x: 500, y: 400 }, { x: 500, y: 400 });

    await expect(boardPage.noteAt(0).root).toHaveCSS('width', '200px');
    await expect(boardPage.noteAt(0).root).toHaveCSS('left', '400px');
  });

  test('moves a note by dragging it', async ({ boardPage }) => {
    await boardPage.open([seedNote({ id: 'a', text: 'Move me', x: 200, y: 160 })]);
    const note = boardPage.note('Move me');

    await note.dragBy(300, 150);

    await expect(note.root).toHaveCSS('left', '500px');
    await expect(note.root).toHaveCSS('top', '310px');
  });

  test('keeps a dragged note inside the board', async ({ boardPage }) => {
    await boardPage.open([seedNote({ id: 'a', text: 'Edge', x: 200, y: 160 })]);
    const note = boardPage.note('Edge');

    await note.dragBy(-600, -600);

    await expect(note.root).toHaveCSS('left', '0px');
    await expect(note.root).toHaveCSS('top', '0px');
  });

  test('resizes a note within the limits and scales its text', async ({ boardPage }) => {
    await boardPage.open([seedNote({ id: 'a', text: 'Grow me', x: 200, y: 160 })]);
    const note = boardPage.note('Grow me');
    await expect(note.root).toHaveCSS('font-size', '16px');

    await note.resizeBy(200, 200);
    await expect(note.root).toHaveCSS('width', '400px');
    await expect(note.root).toHaveCSS('height', '400px');
    await expect(note.root).toHaveCSS('font-size', '24px');

    await note.resizeBy(-600, -600);
    await expect(note.root).toHaveCSS('width', '100px');
    await expect(note.root).toHaveCSS('height', '80px');
    await expect(note.root).toHaveCSS('font-size', '14px');

    await note.resizeBy(900, 900);
    await expect(note.root).toHaveCSS('width', '600px');
    await expect(note.root).toHaveCSS('height', '600px');
  });

  test('deletes a note dropped on the trash zone', async ({ boardPage, page }) => {
    await boardPage.open([seedNote({ id: 'a', text: 'Throw me away' })]);
    const note = boardPage.note('Throw me away');
    const trash = await boardPage.trash.center();

    await note.press();
    await page.mouse.move(trash.x, trash.y, { steps: 10 });
    await expect(boardPage.trash.root).toContainText('Release to delete');
    await page.mouse.up();

    await expect(boardPage.notes).toHaveCount(0);
    await expect(boardPage.trash.root).toContainText('Trash');
  });

  test('keeps a note dropped anywhere else', async ({ boardPage }) => {
    await boardPage.open([seedNote({ id: 'a', text: 'Keep me' })]);

    await boardPage.note('Keep me').dragBy(400, 200);

    await expect(boardPage.notes).toHaveCount(1);
  });

  test('brings an overlapped note to the front', async ({ boardPage }) => {
    await boardPage.open([
      seedNote({ id: 'below', text: 'Below', x: 200, y: 160, zIndex: 1 }),
      seedNote({ id: 'above', text: 'Above', x: 300, y: 260, zIndex: 2 }),
    ]);
    const below = boardPage.note('Below');

    await below.root.click({ position: { x: 40, y: 40 } });

    await expect(below.root).toHaveCSS('z-index', '3');
    await expect(boardPage.note('Above').root).toHaveCSS('z-index', '2');
  });

  test('peels the washi tape off while dragging and sticks it back on drop', async ({
    boardPage,
    page,
  }) => {
    await boardPage.open([seedNote({ id: 'a', text: 'Tape' })]);
    const note = boardPage.note('Tape');
    await expect(note.tape).toBeVisible();

    await note.startDragBy(200, 100);
    await expect(note.tape).toHaveCount(0);

    await page.mouse.up();
    await expect(note.tape).toBeVisible();
  });
});
