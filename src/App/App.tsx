import { Board } from '../components/Board';
import { Header } from '../components/Header';
import './App.styles.css';

export function App() {
  return (
    <div className="app">
      <Header />
      <Board />
    </div>
  );
}
