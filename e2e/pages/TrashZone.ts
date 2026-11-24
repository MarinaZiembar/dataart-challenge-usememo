import type { Locator, Page } from '@playwright/test';

export class TrashZone {
  readonly root: Locator;

  constructor(page: Page) {
    this.root = page.getByRole('region', { name: 'Trash' });
  }

  async center() {
    const box = await this.root.boundingBox();
    if (!box) throw new Error('The trash zone is not visible');
    return { x: box.x + box.width / 2, y: box.y + box.height / 2 };
  }
}
