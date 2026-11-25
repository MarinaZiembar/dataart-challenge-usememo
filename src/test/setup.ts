import '@testing-library/jest-dom';
import { installMatchMedia, setScreenMatches } from './matchMedia';

installMatchMedia();

beforeEach(() => setScreenMatches(true));

if (typeof window.PointerEvent === 'undefined') {
  class PointerEventPolyfill extends MouseEvent {
    pointerId: number;

    constructor(type: string, init: PointerEventInit = {}) {
      super(type, init);
      this.pointerId = init.pointerId ?? 1;
    }
  }
  window.PointerEvent = PointerEventPolyfill as unknown as typeof PointerEvent;
}

Element.prototype.setPointerCapture = () => undefined;
Element.prototype.releasePointerCapture = () => undefined;
Element.prototype.hasPointerCapture = () => false;

if (typeof crypto.randomUUID !== 'function') {
  let counter = 0;
  Object.defineProperty(crypto, 'randomUUID', {
    value: () => `00000000-0000-4000-8000-${String(++counter).padStart(12, '0')}`,
  });
}
