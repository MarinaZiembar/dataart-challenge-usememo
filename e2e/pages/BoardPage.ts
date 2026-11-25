import { expect, type Locator, type Page } from '@playwright/test';
import { NoteComponent } from './NoteComponent';
import { TrashZone } from './TrashZone';

export const STORAGE_KEY = 'useMemo:notes:v1';

export interface SeedNote {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  text: string;
  pattern: string;
  zIndex: number;
  createdAt: string;
  updatedAt: string;
}

export const seedNote = (overrides: Partial<SeedNote> & Pick<SeedNote, 'id'>): SeedNote => ({
  x: 200,
  y: 160,
  width: 200,
  height: 200,
  text: '',
  pattern: 'pink-stars',
  zIndex: 1,
  createdAt: '2026-11-24T00:00:00.000Z',
  updatedAt: '2026-11-24T00:00:00.000Z',
  ...overrides,
});

export class BoardPage {
  readonly board: Locator;
  readonly notes: Locator;
  readonly saveStatus: Locator;
  readonly newNoteButton: Locator;
  readonly emptyState: Locator;
  readonly smallScreenNotice: Locator;
  readonly trash: TrashZone;
  readonly errors: string[] = [];

  constructor(readonly page: Page) {
    this.board = page.getByRole('main', { name: 'Notes board' });
    this.notes = page.getByRole('article', { name: 'Note' });
    this.saveStatus = page.getByRole('status').first();
    this.newNoteButton = page.getByRole('button', { name: '+ New note' });
    this.emptyState = page.getByRole('heading', { name: 'Your board is empty' });
    this.smallScreenNotice = page.getByRole('main', { name: 'Grab a bigger screen' });
    this.trash = new TrashZone(page);
    page.on('pageerror', (error) => this.errors.push(error.message));
  }

  async open(notes: SeedNote[] = []) {
    await this.page.goto('/');
    await this.page.evaluate(
      ({ key, value }) => (value ? localStorage.setItem(key, value) : localStorage.removeItem(key)),
      { key: STORAGE_KEY, value: notes.length ? JSON.stringify(notes) : '' },
    );
    await this.page.reload();
    await expect(this.board).toBeVisible();
  }

  async openRaw(value: string) {
    await this.page.goto('/');
    await this.page.evaluate(({ key, raw }) => localStorage.setItem(key, raw), {
      key: STORAGE_KEY,
      raw: value,
    });
    await this.page.reload();
  }

  async reload() {
    await this.waitUntilSaved();
    await this.page.reload();
    await expect(this.board).toBeVisible();
  }

  note(text: string) {
    return new NoteComponent(this.page, this.notes.filter({ hasText: text }));
  }

  noteAt(index: number) {
    return new NoteComponent(this.page, this.notes.nth(index));
  }

  async draw(from: { x: number; y: number }, to: { x: number; y: number }) {
    const box = await this.board.boundingBox();
    if (!box) throw new Error('The board is not visible');
    await this.page.mouse.move(box.x + from.x, box.y + from.y);
    await this.page.mouse.down();
    await this.page.mouse.move(box.x + to.x, box.y + to.y, { steps: 8 });
  }

  async drawNote(from: { x: number; y: number }, to: { x: number; y: number }) {
    await this.draw(from, to);
    await this.page.mouse.up();
  }

  async waitUntilSaved() {
    await expect(this.saveStatus).toHaveText('All changes saved');
  }

  async storedNotes(): Promise<SeedNote[]> {
    const raw = await this.page.evaluate((key) => localStorage.getItem(key), STORAGE_KEY);
    return raw ? (JSON.parse(raw) as SeedNote[]) : [];
  }
}
