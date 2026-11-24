import { render, screen } from '@testing-library/react';
import { DrawPreview } from './DrawPreview';

describe('DrawPreview', () => {
  it('outlines the area being drawn', () => {
    render(<DrawPreview rect={{ x: 100, y: 120, width: 240, height: 180 }} />);

    expect(screen.getByLabelText('New note preview')).toHaveStyle({
      left: '100px',
      top: '120px',
      width: '240px',
      height: '180px',
    });
  });

  it('shows the size the note will have', () => {
    render(<DrawPreview rect={{ x: 0, y: 0, width: 240, height: 180 }} />);

    expect(screen.getByText('240 × 180')).toBeInTheDocument();
  });

  it('shows the clamped size for very small areas', () => {
    render(<DrawPreview rect={{ x: 0, y: 0, width: 20, height: 10 }} />);

    expect(screen.getByText('100 × 80')).toBeInTheDocument();
  });
});
