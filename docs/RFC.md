# RFC-001: useMemo Sticky Notes – Architecture

> Copy of the RFC kept in Jira: [DCU-1](https://marinaziembar-team.atlassian.net/browse/DCU-1). Reviewers: Frontend Dev, QA.

**Status:** Approved · **Author:** Engineering Manager · **Date:** Sprint 1, Day 1 · **Last updated:** project structure revised (types / constants / utils / services); persistence limited to localStorage

## 1. Summary

Build a single-page web application for sticky notes using **React + TypeScript**, without stock/third-party UI components or drag-and-drop libraries. Notes can be created, resized, moved, deleted via a trash zone, edited, reordered (z-index), themed with a printed pattern, and persisted in the browser's localStorage.

## 2. Goals

- Clean, scalable architecture that is easy to read and review.
- Strict static typing (`strict: true`, no `any`).
- Smooth 60 fps interactions while dragging/resizing.
- Desktop support, minimum resolution 1024x768.
- Browsers: latest Chrome (Win/Mac), Firefox (all platforms), Edge.

## 3. Non-goals

- Mobile/touch-first UX.
- Remote persistence: no REST API, backend or authentication. Notes live only in the browser's localStorage.
- Multi-user collaboration / real-time sync.

## 4. Proposed stack

| Concern                | Choice                                                                                                                                             | Rationale                                                                                 |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| Build tool             | Vite                                                                                                                                               | Fast dev server, simple build instructions                                                |
| Language               | TypeScript (strict)                                                                                                                                | Required; type accuracy is an evaluation criterion                                        |
| UI                     | React 19, function components + hooks                                                                                                              | Required; no stock components                                                             |
| Styling                | Tailwind CSS v4 (`@tailwindcss/vite`) with the Figma tokens as a static theme; semantic classes built with `@apply` in each `Component.styles.css` | Design tokens shared by design and code, readable JSX, no UI kit                          |
| State                  | Zustand (`useNotesStore`)                                                                                                                          | Tiny API, selector subscriptions avoid unnecessary re-renders, easy to test outside React |
| Interactions           | Native Pointer Events + `setPointerCapture`                                                                                                        | Works with mouse in all target browsers, no DnD libraries                                 |
| Persistence            | localStorage through `src/services/notesStorage`, with a load/save contract that never throws                                                      | Storage access isolated in one module; errors reported as a status instead of exceptions  |
| Unit/Integration tests | Jest + React Testing Library                                                                                                                       | Required                                                                                  |
| E2E tests              | Playwright (chromium, firefox, msedge)                                                                                                             | Covers the browser matrix                                                                 |

## 5. Architecture

### 5.1 Project structure

```
src/
├── App/            Root component
├── components/     UI components, one folder per component
├── constants/      Product rules, one file per subject (notes.ts, storage.ts)
├── hooks/          Gesture hooks (useDrawNote, useMoveNote, useResizeNote) and useDismiss
├── services/       Code that talks to the browser storage (notesStorage.ts)
├── store/          Zustand store (notesStore.ts) and persistence wiring (persistNotes.ts)
├── styles/         Tailwind theme tokens and global styles
├── test/           Jest setup
├── types/          Shared types, one file per subject (geometry.ts, notes.ts, storage.ts)
└── utils/          Pure helper functions, one file per subject (geometry.ts, notes.ts, board.ts, patterns.ts)
```

Tests for `utils/`, `services/` and `store/` live in a `__tests__` folder inside each of them; component tests live next to the component.

1. **Types** (`src/types`): `Point`, `Size`, `Rect`, `Note`, `NoteId`, `NotePattern`, `SaveStatus`.
2. **Constants** (`src/constants`): note size limits, text size limits, patterns and their labels, text and z-index limits, storage key and save delay.
3. **Utils** (`src/utils`): pure functions used by the store, the hooks and the components: `clamp`, `clampToBounds`, `rectFromPoints`, `isClick`, `isOverlapping` (geometry); `clampSize`, `fitRect`, `resizeRect`, `noteFontSize`, `nextZIndex`, `bringToFront`, `createNote`, `isNote` (notes); `boardBounds`, `trashZoneRect` (board); `polarPoint`, `ringPoints`, `starPoints`, `patternViewBox` (patterns).
4. **Services** (`src/services`): `notesStorage` (`getStorage`, `loadNotes`, `saveNotes`) for localStorage.
5. **State** (`src/store`): Zustand store `useNotesStore` with the notes, the drag state, the save status and the pattern for new notes; actions call the pure utils. `persistNotes` restores the notes before the first render and saves changes (debounced) through `notesStorage`.
6. **Hooks** (`src/hooks`): `useDrawNote`, `useMoveNote`, `useResizeNote`, `useDismiss`.
7. **UI** (`src/components`): `Header`, `Board`, `Note`, `NoteText`, `NotePattern`, `NotePatternMenu`, `PatternPicker`, `DrawPreview`, `TrashZone`, `Dock`.

### 5.2 Data model

```ts
type Point = { x: number; y: number };
type Size = { width: number; height: number };
type Rect = Point & Size;
type NoteId = string & { readonly __brand: 'NoteId' };
type NotePattern =
  | 'lilac-blooms' | 'pink-stars' | 'lavender-checker' | 'hearts-checker'
  | 'wobbly-grid' | 'lavender-waves' | 'half-moons' | 'sunny-daisies';
interface Note extends Rect {
  id: NoteId;
  text: string;
  pattern: NotePattern; // only visual property the user can change
  zIndex: number;
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
}
type SaveStatus = 'saved' | 'saving' | 'quota' | 'unavailable';
```

### 5.3 Interaction strategy and performance

- During drag/resize, the gesture lives in local component state: the offset is applied with `transform: translate3d()` and the size as a local preview. The store is updated **only on pointerup**, so the rest of the board doesn't re-render on every pointermove.
- A drag only starts once the pointer passes a 4px click tolerance, so clicks and double-clicks never flicker the note.
- `Note` is wrapped in `React.memo` and components read the store through selectors; handlers read `useNotesStore.getState()` instead of subscribing.
- Trash-zone hit test uses `getBoundingClientRect()` intersection on screen coordinates; the shared `drag` state (`{ id, overTrash }`) keeps the note and the trash zone in sync.
- Note text scales with the note: `16px × √(width × height) / 200`, clamped to 14–24px.

### 5.4 Persistence strategy

- localStorage is the only persistence; there is no remote API.
- On load: notes are restored from the versioned key `useMemo:notes:v1` before the first render (no empty-board flash); invalid or duplicated notes are dropped and sizes are fitted to the limits.
- On change: the store updates right away → one debounced (300 ms) write per burst of changes, flushed on `pagehide`.
- Failures (storage full, storage blocked) never throw: they are shown as a non-blocking status in the header and the board keeps working.

### 5.5 Note visual system

- Inspired by printed notepads: the whole note surface is printed with the selected **pattern** (edge to edge) and a centered **off-white paper panel** (flat `#FAF9F6`, no gradient, 1px `#E4E1DA` edge, inset 6.5% so the pattern reads as a thin frame) holds only the note text. Ink text on the panel = 15:1 (AAA).
- Square corners everywhere (note and panel). Motifs are tiled so a square note shows 3×3 tiles; longer notes repeat more tiles instead of stretching them.
- The pattern is the only visual property the user changes. Patterns are inline SVG tiles in `src/components/NotePattern`, mapped by `NotePattern` – no image assets, no runtime fetch.
- A **washi-tape strip** is rendered only while the note is idle; it is hidden during drag, resize-drag and while over the trash zone. Pure CSS, decorative (`aria-hidden`).
- Text lives only inside the paper panel, so it never sits on top of the pattern.

### 5.6 Code conventions

- One folder per UI component: `index.ts`, `Component.tsx`, `Component.styles.css`, `Component.test.tsx`.
- `types/`, `constants/` and `utils/` are split by subject (one file per subject, e.g. `notes.ts`); tests of non-component folders go in `__tests__`.
- Styles: short semantic class names in JSX (`header__logo`); each `Component.styles.css` builds them with Tailwind `@apply` after `@reference '../../styles/global.css'`.
- No code comments; cyclomatic complexity ≤ 10 (ESLint `complexity` rule).
- Pre-commit (Husky + lint-staged): ESLint, Prettier, `jest --findRelatedTests` on staged files and `tsc --noEmit`.
- Git flow: `feature/DCU-<n>-<slug>` → PR to `development` → `main` (production on Vercel). Conventional Commits with the Jira key.

## 6. Alternatives considered

- **HTML5 Drag and Drop API**: rejected – poor control over the drag preview, inconsistent across Firefox, no resize support.
- **Redux Toolkit / useReducer + Context**: rejected – Redux adds boilerplate for this scope; Context re-renders every consumer on each change, while Zustand selectors re-render only what changed.
- **react-dnd / react-rnd**: rejected – the challenge forbids ready-made solutions.

## 7. Risks

- Pointer capture differences across browsers → mitigated by Playwright cross-browser runs.
- Timebox (3–4 h for the core challenge) → bonus features flagged as nice-to-have / extra mile.
- Notes live in one browser only (no sync across devices) → accepted for v1 and stated in the README.

## 8. Open questions

- Should the board be scrollable/infinite or fixed to the viewport? (Decision: fixed to viewport for v1.)
