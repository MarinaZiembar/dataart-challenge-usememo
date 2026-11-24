import { expect, test } from './fixtures';
import { STORAGE_KEY, seedNote } from './pages/BoardPage';

test.describe('Saving in localStorage', () => {
  test('keeps the whole board after a reload', async ({ boardPage }) => {
    await boardPage.open();
    await boardPage.drawNote({ x: 200, y: 160 }, { x: 440, y: 340 });
    await boardPage.noteAt(0).writeText('Remember the milk');
    await boardPage.noteAt(0).dragBy(100, 50);

    await boardPage.reload();

    const note = boardPage.note('Remember the milk');
    await expect(note.root).toHaveCSS('left', '300px');
    await expect(note.root).toHaveCSS('top', '210px');
    await expect(note.root).toHaveCSS('width', '240px');
    await expect(boardPage.saveStatus).toHaveText('All changes saved');
  });

  test('saves under the versioned key', async ({ boardPage }) => {
    await boardPage.open([seedNote({ id: 'a', text: 'Saved' })]);

    await boardPage.note('Saved').dragBy(100, 0);
    await boardPage.waitUntilSaved();

    const [stored] = await boardPage.storedNotes();
    expect(stored).toMatchObject({ id: 'a', text: 'Saved', x: 300 });
  });

  test('starts with an empty board when the saved data is broken', async ({ boardPage }) => {
    await boardPage.openRaw('{broken');

    await expect(boardPage.emptyState).toBeVisible();
    await expect(boardPage.notes).toHaveCount(0);
  });

  test('ignores invalid notes and keeps the valid ones', async ({ boardPage }) => {
    const valid = seedNote({ id: 'ok', text: 'Valid' });
    await boardPage.openRaw(JSON.stringify([valid, { id: 'bad', pattern: 'plaid' }]));

    await expect(boardPage.notes).toHaveCount(1);
    await expect(boardPage.notes).toContainText('Valid');
  });

  test('warns when the storage is full and the board keeps working', async ({
    boardPage,
    page,
  }) => {
    await page.addInitScript((key) => {
      const setItem = Storage.prototype.setItem;
      Storage.prototype.setItem = function (name: string, value: string) {
        if (name === key && sessionStorage.getItem('full') === 'yes') {
          throw new DOMException('Full', 'QuotaExceededError');
        }
        setItem.call(this, name, value);
      };
    }, STORAGE_KEY);
    await boardPage.open();
    await page.evaluate(() => sessionStorage.setItem('full', 'yes'));

    await boardPage.newNoteButton.click();

    await expect(boardPage.saveStatus).toHaveText('Storage full · last change not saved');
    await boardPage.noteAt(0).dragBy(100, 50);
    await expect(boardPage.notes).toHaveCount(1);
  });
});
