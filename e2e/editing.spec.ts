import { expect, test } from './fixtures';
import { seedNote } from './pages/BoardPage';

test.describe('Editing notes', () => {
  test('edits the text of a note and keeps it after a reload', async ({ boardPage }) => {
    await boardPage.open([seedNote({ id: 'a', text: 'Book dentist' })]);

    await boardPage.note('Book dentist').writeText('Book dentist at 5pm');
    await expect(boardPage.notes).toContainText('Book dentist at 5pm');

    await boardPage.reload();
    await expect(boardPage.notes).toContainText('Book dentist at 5pm');
  });

  test('changes the pattern of a note and keeps it after a reload', async ({ boardPage }) => {
    await boardPage.open([seedNote({ id: 'a', text: 'Patterned', pattern: 'pink-stars' })]);
    const note = boardPage.note('Patterned');

    await note.choosePattern('Sunny daisies');
    await expect(note.root).toHaveAttribute('data-pattern', 'sunny-daisies');

    await boardPage.reload();
    await expect(boardPage.note('Patterned').root).toHaveAttribute('data-pattern', 'sunny-daisies');
  });

  test('creates new notes with the pattern picked in the dock', async ({ boardPage, page }) => {
    await boardPage.open();

    await page.getByRole('button', { name: 'Pattern for new notes: Pink stars' }).click();
    await page.getByRole('radio', { name: 'Half moons' }).click();
    await boardPage.newNoteButton.click();

    await expect(boardPage.noteAt(0).root).toHaveAttribute('data-pattern', 'half-moons');
  });
});
