import './Header.styles.css';

interface HeaderProps {
  status?: string;
}

export function Header({ status = 'Saved · just now' }: HeaderProps) {
  return (
    <header className="header">
      <span className="header__logo">useMemo</span>
      <span className="header__dot" aria-hidden="true" />
      <span className="header__status" role="status">
        {status}
      </span>
    </header>
  );
}
