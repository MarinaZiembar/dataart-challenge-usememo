import { render, screen } from '@testing-library/react';
import { App } from './App';

describe('App', () => {
  it('renders the header and the board', () => {
    render(<App />);

    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByRole('main', { name: 'Notes board' })).toBeInTheDocument();
  });
});
