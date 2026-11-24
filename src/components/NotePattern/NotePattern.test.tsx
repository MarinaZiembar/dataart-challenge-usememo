import { render } from '@testing-library/react';
import { NotePattern } from './NotePattern';
import { NOTE_PATTERNS } from '../../constants/notes';

const svgOf = (container: HTMLElement) => container.querySelector('svg');

describe('NotePattern', () => {
  it.each(NOTE_PATTERNS)('draws the %s pattern', (pattern) => {
    const { container } = render(
      <NotePattern pattern={pattern} size={{ width: 200, height: 200 }} />,
    );

    expect(svgOf(container)).toHaveAttribute('data-pattern', pattern);
    expect(container.querySelector('pattern rect')).toBeInTheDocument();
  });

  it('is decorative', () => {
    const { container } = render(
      <NotePattern pattern="pink-stars" size={{ width: 200, height: 200 }} />,
    );

    expect(svgOf(container)).toHaveAttribute('aria-hidden', 'true');
  });

  it('keeps the tiles square on a wide note', () => {
    const { container } = render(
      <NotePattern pattern="pink-stars" size={{ width: 400, height: 200 }} />,
    );

    expect(svgOf(container)).toHaveAttribute('viewBox', '0 0 300 150');
  });

  it('zooms in for small swatches', () => {
    const { container } = render(
      <NotePattern pattern="pink-stars" size={{ width: 44, height: 44 }} zoom={2} />,
    );

    expect(svgOf(container)).toHaveAttribute('viewBox', '0 0 75 75');
  });

  it('gives every note its own pattern id', () => {
    const { container } = render(
      <>
        <NotePattern pattern="pink-stars" size={{ width: 200, height: 200 }} />
        <NotePattern pattern="pink-stars" size={{ width: 300, height: 200 }} />
      </>,
    );
    const ids = [...container.querySelectorAll('pattern')].map((pattern) => pattern.id);

    expect(new Set(ids).size).toBe(2);
    expect(container.querySelectorAll('svg > rect')[0]).toHaveAttribute('fill', `url(#${ids[0]})`);
  });
});
