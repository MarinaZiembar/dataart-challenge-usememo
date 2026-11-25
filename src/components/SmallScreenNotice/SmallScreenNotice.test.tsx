import { render, screen } from '@testing-library/react';
import { SmallScreenNotice } from './SmallScreenNotice';

describe('SmallScreenNotice', () => {
  it('asks to use a computer with a bigger screen', () => {
    render(<SmallScreenNotice />);

    const notice = screen.getByRole('main', { name: 'Grab a bigger screen' });

    expect(notice).toHaveTextContent('useMemo is made for computers.');
    expect(notice).toHaveTextContent('at least 1024 × 768 px');
  });
});
