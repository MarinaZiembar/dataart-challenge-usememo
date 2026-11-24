import { expect, test } from './fixtures';
import { seedNote } from './pages/BoardPage';

test.describe('Keyboard', () => {
  test('cancels a drag with Escape', async ({ boardPage, page }) => {
    await boardPage.open([seedNote({ id: 'a', text: 'Stay', x: 200, y: 160 })]);
    const note = boardPage.note('Stay');

    await note.startDragBy(300, 200);
    await page.keyboard.press('Escape');
    await page.mouse.up();

    await expect(note.root).toHaveCSS('left', '200px');
    await expect(note.root).toHaveCSS('top', '160px');
  });

  test('deletes the focused note with Delete', async ({ boardPage, page }) => {
    await boardPage.open([seedNote({ id: 'a', text: 'Delete me' })]);

    await boardPage.note('Delete me').root.focus();
    await page.keyboard.press('Delete');

    await expect(boardPage.notes).toHaveCount(0);
  });

  test('edits the focused note with Enter', async ({ boardPage, page }) => {
    await boardPage.open([seedNote({ id: 'a', text: 'Draft' })]);
    const note = boardPage.note('Draft');

    await note.root.focus();
    await page.keyboard.press('Enter');
    await expect(note.textField).toBeFocused();
    await page.keyboard.type(' v2');
    await page.keyboard.press('Escape');

    await expect(boardPage.notes).toContainText('Draft v2');
  });

  test('creates a note from the dock with the keyboard', async ({ boardPage, page }) => {
    await boardPage.open();

    await boardPage.newNoteButton.focus();
    await page.keyboard.press('Enter');

    await expect(boardPage.notes).toHaveCount(1);
  });
});

test.describe('Minimum resolution', () => {
  test.use({ viewport: { width: 1024, height: 768 } });

  test('fits 1024 × 768 without scrolling and keeps the tools on screen', async ({
    boardPage,
    page,
  }) => {
    await boardPage.open([seedNote({ id: 'a', text: 'Small screen', x: 700, y: 450 })]);

    const overflow = await page.evaluate(() => ({
      x: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      y: document.documentElement.scrollHeight - document.documentElement.clientHeight,
    }));
    expect(overflow).toEqual({ x: 0, y: 0 });

    for (const element of [boardPage.newNoteButton, boardPage.trash.root, boardPage.saveStatus]) {
      await expect(element).toBeInViewport({ ratio: 1 });
    }
    await boardPage.drawNote({ x: 100, y: 120 }, { x: 300, y: 300 });
    await expect(boardPage.notes).toHaveCount(2);
  });
});
