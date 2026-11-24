import { useEffect, useId, useRef, useState, type KeyboardEvent, type RefObject } from 'react';
import { NOTE_PATTERNS, PATTERN_LABELS } from '../../constants/notes';
import { useDismiss } from '../../hooks/useDismiss';
import type { NotePattern as NotePatternName } from '../../types/notes';
import { NotePattern } from '../NotePattern';
import './PatternPicker.styles.css';

interface PatternPickerProps {
  value: NotePatternName;
  onChange: (pattern: NotePatternName) => void;
  onClose: () => void;
  anchorRef: RefObject<HTMLElement | null>;
  className?: string;
}

const COLUMNS = 4;
const SWATCH_SIZE = { width: 44, height: 44 };
const KEY_STEPS: Record<string, number> = {
  ArrowRight: 1,
  ArrowLeft: -1,
  ArrowDown: COLUMNS,
  ArrowUp: -COLUMNS,
};

const stepFrom = (pattern: NotePatternName, step: number) => {
  const count = NOTE_PATTERNS.length;
  return NOTE_PATTERNS[(NOTE_PATTERNS.indexOf(pattern) + step + count) % count] ?? pattern;
};

export function PatternPicker({
  value,
  onChange,
  onClose,
  anchorRef,
  className = '',
}: PatternPickerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const [hovered, setHovered] = useState<NotePatternName | null>(null);
  useDismiss([ref, anchorRef], onClose);

  useEffect(() => {
    ref.current?.querySelector<HTMLElement>('[aria-checked="true"]')?.focus();
  }, []);

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') {
      event.stopPropagation();
      onClose();
      return;
    }
    const step = KEY_STEPS[event.key];
    if (step === undefined) return;
    event.preventDefault();
    const next = stepFrom(value, step);
    onChange(next);
    ref.current?.querySelector<HTMLElement>(`[data-value="${next}"]`)?.focus();
  };

  return (
    <div
      ref={ref}
      className={`pattern-picker ${className}`}
      onKeyDown={onKeyDown}
      onPointerDown={(event) => event.stopPropagation()}
      onDoubleClick={(event) => event.stopPropagation()}
    >
      <span className="pattern-picker__title" id={titleId}>
        Pattern
      </span>
      <div className="pattern-picker__swatches" role="radiogroup" aria-labelledby={titleId}>
        {NOTE_PATTERNS.map((pattern) => (
          <button
            key={pattern}
            type="button"
            role="radio"
            className="pattern-picker__swatch"
            aria-checked={pattern === value}
            aria-label={PATTERN_LABELS[pattern]}
            tabIndex={pattern === value ? 0 : -1}
            data-value={pattern}
            onClick={() => {
              onChange(pattern);
              onClose();
            }}
            onMouseEnter={() => setHovered(pattern)}
            onMouseLeave={() => setHovered(null)}
          >
            <NotePattern pattern={pattern} size={SWATCH_SIZE} zoom={2} />
          </button>
        ))}
      </div>
      <span className="pattern-picker__label">{PATTERN_LABELS[hovered ?? value]}</span>
    </div>
  );
}
