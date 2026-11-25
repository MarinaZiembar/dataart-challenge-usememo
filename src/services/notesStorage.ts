import { STORAGE_KEY } from '../constants/storage';
import type { Note } from '../types/notes';
import type { SaveStatus } from '../types/storage';
import { clampSize, isNote } from '../utils/notes';

const QUOTA_ERRORS = ['QuotaExceededError', 'NS_ERROR_DOM_QUOTA_REACHED'];

export const getStorage = (): Storage | null => {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
};

const parse = (raw: string | null): unknown => {
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

const readRaw = (storage: Storage | null) => {
  if (!storage) return null;
  try {
    return storage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
};

export const loadNotes = (storage: Storage | null): Note[] => {
  const data = parse(readRaw(storage));
  if (!Array.isArray(data)) return [];
  const ids = new Set<string>();
  return data.filter(isNote).flatMap((note) => {
    if (ids.has(note.id)) return [];
    ids.add(note.id);
    return [{ ...note, ...clampSize(note) }];
  });
};

const isQuotaError = (error: unknown) =>
  error instanceof DOMException && QUOTA_ERRORS.includes(error.name);

export const saveNotes = (notes: Note[], storage: Storage | null): SaveStatus => {
  if (!storage) return 'unavailable';
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(notes));
    return 'saved';
  } catch (error) {
    return isQuotaError(error) ? 'quota' : 'unavailable';
  }
};
