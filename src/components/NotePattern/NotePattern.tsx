import { memo, useId } from 'react';
import type { Size } from '../../types/geometry';
import type { NotePattern as NotePatternName } from '../../types/notes';
import { patternViewBox } from '../../utils/patterns';
import { PATTERN_TILES } from './tiles';
import './NotePattern.styles.css';

interface NotePatternProps {
  pattern: NotePatternName;
  size: Size;
  zoom?: number;
}

export const NotePattern = memo(function NotePattern({
  pattern,
  size,
  zoom = 1,
}: NotePatternProps) {
  const id = `note-pattern-${useId().replace(/[^\w-]/g, '')}`;
  const tile = PATTERN_TILES[pattern];
  const view = patternViewBox(size, zoom);

  return (
    <svg
      className="note-pattern"
      viewBox={`0 0 ${view.width} ${view.height}`}
      preserveAspectRatio="none"
      aria-hidden="true"
      data-pattern={pattern}
    >
      <defs>
        <pattern
          id={id}
          width={tile.size.width}
          height={tile.size.height}
          patternUnits="userSpaceOnUse"
        >
          <rect width={tile.size.width} height={tile.size.height} fill={tile.background} />
          {tile.motifs}
        </pattern>
      </defs>
      <rect width={view.width} height={view.height} fill={`url(#${id})`} />
    </svg>
  );
});
