import { render, screen } from '@testing-library/react';
import { Header } from './Header';

describe('Header', () => {
  it('shows the app name', () => {
    render(<Header />);

    expect(screen.getByText('useMemo')).toBeInTheDocument();
  });

  it('shows the default saved status', () => {
    render(<Header />);

    expect(screen.getByRole('status')).toHaveTextContent('Saved · just now');
  });

  it('shows a custom status', () => {
    render(<Header status="Offline · saved locally" />);

    expect(screen.getByRole('status')).toHaveTextContent('Offline · saved locally');
  });
});
