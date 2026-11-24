import { SAVE_DELAY } from '../constants/storage';
import { loadNotes, saveNotes } from '../services/notesStorage';
import { useNotesStore } from './notesStore';

export const persistNotes = (storage: Storage | null, delay = SAVE_DELAY) => {
  const { setNotes, setSaveStatus } = useNotesStore.getState();
  setNotes(loadNotes(storage));
  setSaveStatus(storage ? 'saved' : 'unavailable');

  let timer: ReturnType<typeof setTimeout> | undefined;

  const flush = () => {
    if (timer === undefined) return;
    clearTimeout(timer);
    timer = undefined;
    setSaveStatus(saveNotes(useNotesStore.getState().notes, storage));
  };

  const unsubscribe = useNotesStore.subscribe((state, previous) => {
    if (state.notes === previous.notes) return;
    clearTimeout(timer);
    timer = setTimeout(flush, delay);
    if (storage) setSaveStatus('saving');
  });

  window.addEventListener('pagehide', flush);

  return () => {
    flush();
    unsubscribe();
    window.removeEventListener('pagehide', flush);
  };
};
