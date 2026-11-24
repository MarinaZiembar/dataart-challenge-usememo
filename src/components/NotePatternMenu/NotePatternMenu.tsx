import { useRef, useState } from 'react';
import type { NotePattern as NotePatternName } from '../../types/notes';
import { NotePattern } from '../NotePattern';
import { PatternPicker } from '../PatternPicker';
import './NotePatternMenu.styles.css';

interface NotePatternMenuProps {
  pattern: NotePatternName;
  noteRight: number;
  onChange: (pattern: NotePatternName) => void;
}

const PICKER_SPACE = 260;
const BUTTON_SIZE = { width: 24, height: 24 };

export function NotePatternMenu({ pattern, noteRight, onChange }: NotePatternMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const side = noteRight + PICKER_SPACE > window.innerWidth ? 'left' : 'right';

  const onClose = () => {
    setIsOpen(false);
    buttonRef.current?.focus();
  };

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        className={isOpen ? 'note-pattern-menu note-pattern-menu--open' : 'note-pattern-menu'}
        aria-label="Change pattern"
        aria-haspopup="true"
        aria-expanded={isOpen}
        onPointerDown={(event) => event.stopPropagation()}
        onDoubleClick={(event) => event.stopPropagation()}
        onClick={() => setIsOpen((open) => !open)}
      >
        <NotePattern pattern={pattern} size={BUTTON_SIZE} zoom={3} />
      </button>
      {isOpen && (
        <PatternPicker
          className={`note-pattern-menu__picker note-pattern-menu__picker--${side}`}
          value={pattern}
          onChange={onChange}
          onClose={onClose}
          anchorRef={buttonRef}
        />
      )}
    </>
  );
}
