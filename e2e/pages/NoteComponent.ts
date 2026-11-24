import type { Locator, Page } from '@playwright/test';

interface Point {
  x: number;
  y: number;
}

const GRAB_OFFSET = { x: 24, y: 40 };
const STEPS = 8;

export class NoteComponent {
  readonly tape: Locator;
  readonly resizeHandle: Locator;
  readonly textField: Locator;

  constructor(
    private readonly page: Page,
    readonly root: Locator,
  ) {
    this.tape = root.getByTestId('washi-tape');
    this.resizeHandle = root.getByTitle('Resize');
    this.textField = root.getByRole('textbox', { name: 'Note text' });
  }

  async box() {
    const box = await this.root.boundingBox();
    if (!box) throw new Error('The note is not visible');
    return box;
  }

  async grabPoint(): Promise<Point> {
    const box = await this.box();
    return { x: box.x + GRAB_OFFSET.x, y: box.y + GRAB_OFFSET.y };
  }

  async press() {
    const start = await this.grabPoint();
    await this.page.mouse.move(start.x, start.y);
    await this.page.mouse.down();
    return start;
  }

  async startDragBy(dx: number, dy: number) {
    const start = await this.press();
    await this.page.mouse.move(start.x + dx, start.y + dy, { steps: STEPS });
  }

  async dragBy(dx: number, dy: number) {
    await this.startDragBy(dx, dy);
    await this.page.mouse.up();
  }

  async resizeBy(dx: number, dy: number) {
    await this.root.hover();
    const handle = await this.resizeHandle.boundingBox();
    if (!handle) throw new Error('The resize handle is not visible');
    const start = { x: handle.x + handle.width / 2, y: handle.y + handle.height / 2 };
    await this.page.mouse.move(start.x, start.y);
    await this.page.mouse.down();
    await this.page.mouse.move(start.x + dx, start.y + dy, { steps: STEPS });
    await this.page.mouse.up();
  }

  async writeText(text: string) {
    await this.root.dblclick();
    await this.textField.fill(text);
    await this.textField.press('Escape');
  }

  async choosePattern(name: string) {
    await this.root.hover();
    await this.root.getByRole('button', { name: 'Change pattern' }).click();
    await this.page.getByRole('radio', { name }).click();
  }
}
