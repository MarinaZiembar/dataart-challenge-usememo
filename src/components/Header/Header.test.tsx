import { act, render, screen } from '@testing-library/react';
import { Header } from './Header';
import { useNotesStore } from '../../store/notesStore';

describe('Header', () => {
  beforeEach(() => {
    useNotesStore.setState({ saveStatus: 'saved' });
  });

  it('shows the app name', () => {
    render(<Header />);

    expect(screen.getByText('useMemo')).toBeInTheDocument();
  });

  it('shows the saved status by default', () => {
    render(<Header />);

    expect(screen.getByRole('status')).toHaveTextContent('All changes saved');
  });

  it.each([
    ['saving', 'Saving…'],
    ['quota', 'Storage full · last change not saved'],
    ['unavailable', 'Storage unavailable · changes won’t persist'],
  ] as const)('shows the %s status', (saveStatus, label) => {
    render(<Header />);

    act(() => useNotesStore.setState({ saveStatus }));

    expect(screen.getByRole('status')).toHaveTextContent(label);
  });
});
