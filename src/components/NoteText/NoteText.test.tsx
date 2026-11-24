import { fireEvent, render, screen } from '@testing-library/react';
import { NoteText } from './NoteText';

describe('NoteText', () => {
  it('shows the note text', () => {
    render(<NoteText text="Call Sofi" isEditing={false} onSave={jest.fn()} />);

    expect(screen.getByText('Call Sofi')).toBeInTheDocument();
  });

  it('shows a hint when the note is empty', () => {
    render(<NoteText text="" isEditing={false} onSave={jest.fn()} />);

    expect(screen.getByText('Double-click to write')).toBeInTheDocument();
  });

  it('shows a focused text field with the current text while editing', () => {
    render(<NoteText text="Call Sofi" isEditing onSave={jest.fn()} />);

    const field = screen.getByRole('textbox', { name: 'Note text' });
    expect(field).toHaveValue('Call Sofi');
    expect(field).toHaveFocus();
    expect(field).toHaveAttribute('placeholder', 'Write something…');
    expect(field).toHaveAttribute('maxLength', '1000');
  });

  it('saves the text when the field loses focus', () => {
    const onSave = jest.fn();
    render(<NoteText text="" isEditing onSave={onSave} />);

    const field = screen.getByRole('textbox', { name: 'Note text' });
    fireEvent.change(field, { target: { value: 'Buy oat milk' } });
    fireEvent.blur(field);

    expect(onSave).toHaveBeenCalledWith('Buy oat milk');
  });

  it('saves the text with Escape', () => {
    const onSave = jest.fn();
    render(<NoteText text="" isEditing onSave={onSave} />);

    const field = screen.getByRole('textbox', { name: 'Note text' });
    fireEvent.change(field, { target: { value: 'Water plants' } });
    fireEvent.keyDown(field, { key: 'Escape' });

    expect(onSave).toHaveBeenCalledWith('Water plants');
  });
});
