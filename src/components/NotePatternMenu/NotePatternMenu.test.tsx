import { fireEvent, render, screen } from '@testing-library/react';
import { NotePatternMenu } from './NotePatternMenu';

const renderMenu = (noteRight = 300) => {
  const onChange = jest.fn();
  render(<NotePatternMenu pattern="pink-stars" noteRight={noteRight} onChange={onChange} />);
  return { onChange, button: screen.getByRole('button', { name: 'Change pattern' }) };
};

describe('NotePatternMenu', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'innerWidth', { configurable: true, value: 1440 });
  });

  it('opens and closes the picker from its button', () => {
    const { button } = renderMenu();

    fireEvent.click(button);
    expect(button).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('radiogroup', { name: 'Pattern' })).toBeInTheDocument();

    fireEvent.click(button);
    expect(screen.queryByRole('radiogroup')).not.toBeInTheDocument();
  });

  it('changes the pattern and gives the focus back to the button', () => {
    const { onChange, button } = renderMenu();

    fireEvent.click(button);
    fireEvent.click(screen.getByRole('radio', { name: 'Half moons' }));

    expect(onChange).toHaveBeenCalledWith('half-moons');
    expect(screen.queryByRole('radiogroup')).not.toBeInTheDocument();
    expect(button).toHaveFocus();
  });

  it('opens the picker on the right of the note when there is room', () => {
    const { button } = renderMenu(300);

    fireEvent.click(button);

    expect(screen.getByRole('radiogroup').parentElement).toHaveClass(
      'note-pattern-menu__picker--right',
    );
  });

  it('opens the picker on the left of a note near the right edge', () => {
    const { button } = renderMenu(1300);

    fireEvent.click(button);

    expect(screen.getByRole('radiogroup').parentElement).toHaveClass(
      'note-pattern-menu__picker--left',
    );
  });

  it('does not start a drag or an edit from the button', () => {
    const onPointerDown = jest.fn();
    const onDoubleClick = jest.fn();
    render(
      <div onPointerDown={onPointerDown} onDoubleClick={onDoubleClick}>
        <NotePatternMenu pattern="pink-stars" noteRight={300} onChange={jest.fn()} />
      </div>,
    );
    const button = screen.getByRole('button', { name: 'Change pattern' });

    fireEvent.pointerDown(button);
    fireEvent.doubleClick(button);

    expect(onPointerDown).not.toHaveBeenCalled();
    expect(onDoubleClick).not.toHaveBeenCalled();
  });
});
