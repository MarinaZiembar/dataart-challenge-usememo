import type { Rect } from '../../types/geometry';
import { clampSize } from '../../utils/notes';
import './DrawPreview.styles.css';

interface DrawPreviewProps {
  rect: Rect;
}

export function DrawPreview({ rect }: DrawPreviewProps) {
  const size = clampSize(rect);
  const style = { left: rect.x, top: rect.y, width: rect.width, height: rect.height };

  return (
    <div className="draw-preview" style={style} aria-label="New note preview">
      <span className="draw-preview__size">
        {size.width} × {size.height}
      </span>
    </div>
  );
}
