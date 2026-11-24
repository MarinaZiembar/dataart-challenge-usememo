import { createRef, useState } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { PatternPicker } from './PatternPicker';
import type { NotePattern } from '../../types/notes';

const StatefulPicker = ({ onChange }: { onChange: (pattern: NotePattern) => void }) => {
  const [value, setValue] = useState<NotePattern>('pink-stars');
  const [anchorRef] = useState(() => createRef<HTMLButtonElement>());
  return (
    <PatternPicker
      value={value}
      onChange={(pattern) => {
        onChange(pattern);
        setValue(pattern);
      }}
      onClose={jest.fn()}
      anchorRef={anchorRef}
    />
  );
};

const renderPicker = (value: Parameters<typeof PatternPicker>[0]['value'] = 'pink-stars') => {
  const onChange = jest.fn();
  const onClose = jest.fn();
  const anchorRef = createRef<HTMLButtonElement>();
  render(
    <>
      <button ref={anchorRef} type="button">
        Anchor
      </button>
      <PatternPicker value={value} onChange={onChange} onClose={onClose} anchorRef={anchorRef} />
    </>,
  );
  return { onChange, onClose };
};

describe('PatternPicker', () => {
  it('lists the 8 patterns and marks the selected one', () => {
    renderPicker();

    expect(screen.getAllByRole('radio')).toHaveLength(8);
    expect(screen.getByRole('radio', { name: 'Pink stars' })).toBeChecked();
    expect(screen.getByRole('radiogroup', { name: 'Pattern' })).toBeInTheDocument();
  });

  it('focuses the selected pattern when it opens', () => {
    renderPicker('half-moons');

    expect(screen.getByRole('radio', { name: 'Half moons' })).toHaveFocus();
  });

  it('selects a pattern on click and closes', () => {
    const { onChange, onClose } = renderPicker();

    fireEvent.click(screen.getByRole('radio', { name: 'Sunny daisies' }));

    expect(onChange).toHaveBeenCalledWith('sunny-daisies');
    expect(onClose).toHaveBeenCalled();
  });

  it('moves the selection and the focus with the arrow keys', () => {
    const onChange = jest.fn();
    render(<StatefulPicker onChange={onChange} />);

    fireEvent.keyDown(document.activeElement as Element, { key: 'ArrowRight' });
    fireEvent.keyDown(document.activeElement as Element, { key: 'ArrowDown' });
    fireEvent.keyDown(document.activeElement as Element, { key: 'ArrowLeft' });

    expect(onChange.mock.calls).toEqual([['lavender-checker'], ['half-moons'], ['lavender-waves']]);
    expect(screen.getByRole('radio', { name: 'Lavender waves' })).toBeChecked();
    expect(screen.getByRole('radio', { name: 'Lavender waves' })).toHaveFocus();
  });

  it('wraps around at the ends', () => {
    const { onChange } = renderPicker('lilac-blooms');

    fireEvent.keyDown(screen.getByRole('radio', { name: 'Lilac blooms' }), { key: 'ArrowLeft' });

    expect(onChange).toHaveBeenCalledWith('sunny-daisies');
  });

  it('shows the name of the hovered pattern', () => {
    renderPicker();

    fireEvent.mouseEnter(screen.getByRole('radio', { name: 'Wobbly grid' }));

    expect(screen.getByText('Wobbly grid', { selector: 'span' })).toBeInTheDocument();
  });

  it('closes with Escape', () => {
    const { onClose } = renderPicker();

    fireEvent.keyDown(screen.getByRole('radio', { name: 'Pink stars' }), { key: 'Escape' });

    expect(onClose).toHaveBeenCalled();
  });

  it('closes when pressing outside, but not on its anchor', () => {
    const { onClose } = renderPicker();

    fireEvent.pointerDown(screen.getByRole('button', { name: 'Anchor' }));
    expect(onClose).not.toHaveBeenCalled();

    fireEvent.pointerDown(document.body);
    expect(onClose).toHaveBeenCalled();
  });

  it('only closes on an outside press, without passing it on', () => {
    const onBoardPointerDown = jest.fn();
    const anchorRef = createRef<HTMLButtonElement>();
    render(
      <div data-testid="board" onPointerDown={onBoardPointerDown}>
        <PatternPicker
          value="pink-stars"
          onChange={jest.fn()}
          onClose={jest.fn()}
          anchorRef={anchorRef}
        />
      </div>,
    );

    fireEvent.pointerDown(screen.getByTestId('board'));

    expect(onBoardPointerDown).not.toHaveBeenCalled();
  });
});
