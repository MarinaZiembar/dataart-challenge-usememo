import { Board } from '../components/Board';
import { Dock } from '../components/Dock';
import { Header } from '../components/Header';
import { SmallScreenNotice } from '../components/SmallScreenNotice';
import { TrashZone } from '../components/TrashZone';
import { SUPPORTED_SCREEN_QUERY } from '../constants/screen';
import { useMediaQuery } from '../hooks/useMediaQuery';
import './App.styles.css';

export function App() {
  const isScreenSupported = useMediaQuery(SUPPORTED_SCREEN_QUERY);

  return (
    <div className="app">
      <Header />
      {isScreenSupported ? (
        <>
          <Board />
          <TrashZone />
          <Dock />
        </>
      ) : (
        <SmallScreenNotice />
      )}
    </div>
  );
}
