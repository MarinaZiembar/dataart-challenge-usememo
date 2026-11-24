import { test as base, expect } from '@playwright/test';
import { BoardPage } from './pages/BoardPage';

export const test = base.extend<{ boardPage: BoardPage }>({
  boardPage: async ({ page }, use) => {
    const boardPage = new BoardPage(page);
    await use(boardPage);
    expect(boardPage.errors, 'the page threw no errors').toEqual([]);
  },
});

export { expect };
