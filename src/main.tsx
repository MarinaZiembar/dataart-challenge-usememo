import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import { getStorage } from './services/notesStorage';
import { persistNotes } from './store/persistNotes';
import './styles/global.css';

persistNotes(getStorage());

const root = document.getElementById('root');

if (root) {
  createRoot(root).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}
