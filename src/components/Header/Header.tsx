import { useNotesStore } from '../../store/notesStore';
import type { SaveStatus } from '../../types/storage';
import './Header.styles.css';

const STATUS_LABELS: Record<SaveStatus, string> = {
  saved: 'All changes saved',
  saving: 'Saving…',
  quota: 'Storage full · last change not saved',
  unavailable: 'Storage unavailable · changes won’t persist',
};

export function Header() {
  const saveStatus = useNotesStore((state) => state.saveStatus);

  return (
    <header className="header">
      <span className="header__logo">useMemo</span>
      <span className={`header__dot header__dot--${saveStatus}`} aria-hidden="true" />
      <span className="header__status" role="status">
        {STATUS_LABELS[saveStatus]}
      </span>
    </header>
  );
}
