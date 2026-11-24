import { useNotesStore } from '../../store/notesStore';
import './TrashZone.styles.css';

type TrashState = 'idle' | 'active' | 'hover';

const LABELS: Record<TrashState, string> = {
  idle: 'Trash',
  active: 'Drop here to delete',
  hover: 'Release to delete',
};

export function TrashZone() {
  const state = useNotesStore((store): TrashState => {
    if (!store.drag) return 'idle';
    return store.drag.overTrash ? 'hover' : 'active';
  });

  return (
    <div
      className={`trash-zone trash-zone--${state}`}
      data-trash-zone
      role="region"
      aria-label="Trash"
      aria-live="polite"
    >
      <svg
        className="trash-zone__icon"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path className="trash-zone__lid" d="M4 7h16M9 7V4h6v3" />
        <path d="M6 7l1 13h10l1-13M10 11v6M14 11v6" />
      </svg>
      <span className="trash-zone__label">{LABELS[state]}</span>
    </div>
  );
}
