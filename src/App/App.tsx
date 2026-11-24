import { Board } from '../components/Board';
import { Dock } from '../components/Dock';
import { Header } from '../components/Header';
import { TrashZone } from '../components/TrashZone';
import './App.styles.css';

export function App() {
  return (
    <div className="app">
      <Header />
      <Board />
      <TrashZone />
      <Dock />
    </div>
  );
}
