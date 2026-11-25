import { MIN_SCREEN } from '../../constants/screen';
import './SmallScreenNotice.styles.css';

const MESSAGE = `useMemo is made for computers. Open it on a laptop or desktop with a screen of at least ${MIN_SCREEN.width} × ${MIN_SCREEN.height} px, or make this window bigger.`;

export function SmallScreenNotice() {
  return (
    <main className="small-screen" aria-labelledby="small-screen-title">
      <div className="small-screen__note">
        <span className="small-screen__tape" aria-hidden="true" />
        <svg className="small-screen__icon" viewBox="0 0 48 48" aria-hidden="true">
          <rect x="5" y="8" width="38" height="25" rx="3" />
          <path d="M18 40h12M24 33v7" />
        </svg>
        <h1 id="small-screen-title" className="small-screen__title">
          Grab a bigger screen
        </h1>
        <p className="small-screen__text">{MESSAGE}</p>
      </div>
    </main>
  );
}
