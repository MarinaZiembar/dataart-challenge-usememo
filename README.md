<p align="center">
  <img src="docs/cover.png" alt="useMemo — Sticky notes that feel like real stationery" width="100%" />
</p>

# useMemo

A single-page sticky notes board built with **React + TypeScript** for the DataArt Front-end Challenge. Create, move, resize and toss notes in the trash — notes look like printed notepads, with a pattern frame and a washi-tape strip, and they are saved in your browser so they are still there after a reload.

## Links

| Resource              | Link                                                                                                           |
| --------------------- | -------------------------------------------------------------------------------------------------------------- |
| Live demo (Vercel)    | _Coming soon — deployed from `main`_                                                                           |
| Figma                 | [DataArt Challenge - useMemo](https://www.figma.com/design/pVCvK8DkzvEhO6kNmw5EnQ/DataArt-Challenge---useMemo) |
| Jira board (Sprint 1) | [DCU board](https://marinaziembar-team.atlassian.net/jira/software/projects/DCU/boards/2)                      |
| PRD                   | [DCU-2 · Product requirements](https://marinaziembar-team.atlassian.net/browse/DCU-2)                          |
| RFC                   | [DCU-1 · Technical architecture](https://marinaziembar-team.atlassian.net/browse/DCU-1)                        |
| Architecture          | [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)                                                                   |

## Features

### Core

| #   | Feature                                           | How                                                                           |
| --- | ------------------------------------------------- | ----------------------------------------------------------------------------- |
| F1  | Create a note of a given size at a given position | Drag on an empty part of the board to draw it; a single click creates 200×200 |
| F2  | Change the size of a note by dragging             | Drag the round handle on the bottom-right corner (100×80 to 600×600)          |
| F3  | Move a note by dragging                           | Drag the note anywhere inside the board                                       |
| F4  | Remove a note by dragging it over the trash zone  | Drop it on the trash zone in the bottom-right corner                          |

### Bonus

| #   | Feature                      | How                                                                                       |
| --- | ---------------------------- | ----------------------------------------------------------------------------------------- |
| B1  | Enter and edit text          | Double-click a note (or press Enter on it); click outside or press Esc to finish          |
| B2  | Bring a note to the front    | Press or focus a note and it moves on top of the others                                   |
| B3  | Save to localStorage         | Every change is saved automatically and restored on reload; the header shows the status   |
| B4  | Note patterns _(extra mile)_ | 8 printed patterns; change one from the swatch on a note's corner, or pick it in the dock |

Also: the note text scales with the note (16px on a 200×200 note, between 14px and 24px), and "+ New note" in the dock creates a note in the middle of the screen.

## How to use

| Action                        | Mouse                                             | Keyboard                            |
| ----------------------------- | ------------------------------------------------- | ----------------------------------- |
| Create a note                 | Drag on the empty board, or click “+ New note”    | Tab to “+ New note” and press Enter |
| Move a note                   | Drag it                                           | —                                   |
| Resize a note                 | Drag the handle on its bottom-right corner        | —                                   |
| Edit the text                 | Double-click the note                             | Focus the note and press Enter      |
| Finish editing                | Click outside                                     | Esc                                 |
| Cancel a draw, move or resize | —                                                 | Esc while dragging                  |
| Delete a note                 | Drop it on the trash zone                         | Focus the note and press Delete     |
| Change the pattern            | Hover the note and click the swatch on its corner | Arrow keys in the picker, Enter     |

## Saving

Notes are saved only in the browser's `localStorage` (key `useMemo:notes:v1`); there is no backend. They survive a reload but are not shared between browsers or devices. If the stored data is broken it is ignored and the board starts empty, and if the storage is full or blocked the header shows a warning while the board keeps working.

## Tech stack

- React 19 + TypeScript (strict)
- Vite
- Zustand for state management
- Tailwind CSS v4 with the Figma design tokens as theme variables (`src/styles/tokens.css`)
- Jest + React Testing Library (unit & integration), Playwright (e2e)
- ESLint, Prettier, Husky + lint-staged

No UI component libraries and no drag-and-drop libraries are used.

## Requirements

- Node.js 20 or newer (`.nvmrc` pins 22)
- npm 10+

## Getting started

```bash
git clone https://github.com/MarinaZiembar/dataart-challenge-usememo.git
cd dataart-challenge-usememo
npm install
npm run dev
```

The app runs at http://localhost:5173.

## Scripts

| Command                 | Description                                   |
| ----------------------- | --------------------------------------------- |
| `npm run dev`           | Start the development server                  |
| `npm run build`         | Type-check and build for production (`dist/`) |
| `npm run preview`       | Preview the production build                  |
| `npm run typecheck`     | Run the TypeScript compiler without emitting  |
| `npm run lint`          | Lint the project with ESLint                  |
| `npm run format`        | Format all files with Prettier                |
| `npm test`              | Run unit and integration tests                |
| `npm run test:coverage` | Run tests with a coverage report              |

## Tests and CI

- **Unit tests** cover every pure function, the storage service, the store and the hooks. They live in a `__tests__` folder next to the code (`utils/`, `services/`, `store/`, `hooks/`).
- **Component and integration tests** live next to each component (`Component.test.tsx`). `App.test.tsx` runs the whole app the way `main.tsx` starts it: notes restored from a real `localStorage`, every user flow (create, move, resize, edit, change pattern, bring to front, delete) checked on screen and in storage, plus broken data and a full or blocked storage.
- **Coverage:** `npm run test:coverage` fails if `src/utils`, `src/services`, `src/store` or `src/hooks` drop below 80% (statements, branches, functions and lines).
- **End-to-end:** Playwright tests across Chrome, Firefox and Edge are planned in DCU-20.
- **CI:** GitHub Actions (`.github/workflows/ci.yml`) runs lint, typecheck and the tests with coverage on every push and on pull requests to `development` and `main`.

## Pre-commit checks

Husky runs these checks on every commit:

1. **lint-staged** on staged files: ESLint (`--fix`), Prettier and Jest tests related to the changed files (`--findRelatedTests`).
2. **TypeScript** type-check of the whole project (`npm run typecheck`).

The commit is blocked if any check fails.

## Project structure

```
docs/
├── ARCHITECTURE.md       # Architecture description
└── cover.png             # README cover

src/
├── App/                  # Root component
├── components/           # UI components, one folder per component
│   ├── Board/            # The board, drawing new notes and the empty state
│   ├── Dock/             # “+ New note” and the pattern for new notes
│   ├── DrawPreview/      # Dashed outline while drawing
│   ├── Header/           # Logo and save status
│   ├── Note/             # A note: move, resize, edit, delete
│   │   ├── index.ts
│   │   ├── Note.tsx
│   │   ├── Note.styles.css
│   │   └── Note.test.tsx
│   ├── NotePattern/      # The 8 patterns as inline SVG tiles
│   ├── NotePatternMenu/  # Swatch button on a note that opens the picker
│   ├── NoteText/         # Note text and the text field
│   ├── PatternPicker/    # Popover with the 8 patterns
│   └── TrashZone/        # Drop zone to delete notes
├── constants/            # Product rules, one file per subject
│   ├── notes.ts          # Note sizes, text size, patterns, limits
│   └── storage.ts        # Storage key and save delay
├── hooks/                # Gesture hooks (draw, move, resize) and popover dismiss
│   └── __tests__/
├── services/             # Code that talks to the outside world
│   ├── __tests__/
│   └── notesStorage.ts   # Load and save notes in localStorage
├── store/                # Zustand store
│   ├── __tests__/
│   ├── notesStore.ts     # Notes, drag state and save status
│   └── persistNotes.ts   # Restore on load, debounced save, flush on page hide
├── styles/               # Tailwind theme tokens and global styles
├── test/                 # Jest setup and pointer event helpers
├── types/                # Shared types, one file per subject
│   ├── geometry.ts       # Point, Size, Rect
│   ├── notes.ts          # Note, NoteId, NotePattern
│   └── storage.ts        # SaveStatus
└── utils/                # Pure helper functions, one file per subject
    ├── __tests__/
    │   ├── board.test.ts
    │   ├── geometry.test.ts
    │   ├── notes.test.ts
    │   └── patterns.test.ts
    ├── board.ts          # Board and trash zone rects
    ├── geometry.ts       # clamp, rect from points, click, overlap
    ├── notes.ts          # Create, fit, resize, font size, layers, isNote
    └── patterns.ts       # Star and flower points, pattern view box
```

## Conventions

- **Types, utils and constants:** one file per subject (`notes.ts`, `geometry.ts`…); tests of non-component folders (`utils/`, `services/`, `store/`, `hooks/`) live in a `__tests__` folder inside them.
- **Components:** one folder per component with `index.ts`, `Component.tsx`, `Component.styles.css` and `Component.test.tsx`.
- **Styles:** components use short semantic class names (`header__logo`); each `Component.styles.css` builds them with Tailwind `@apply` (`@reference '../../styles/global.css'`).
- **Code:** simple and readable, no code comments, cyclomatic complexity ≤ 10 (enforced by ESLint).
- **Formatting:** Prettier (`.prettierrc`); VS Code formats on save with the recommended extensions.
- **Commits:** [Conventional Commits](https://www.conventionalcommits.org/) with the Jira key, e.g. `feat(DCU-7): create a note at a given position`.

## Git workflow

- `main` → production, deployed on Vercel.
- `development` → integration branch.
- `feature/DCU-<number>-<short-description>` → one branch per Jira task, opened as a pull request into `development`.

## Browser support

Desktop only (minimum 1024×768) — latest Chrome (Windows & macOS), Firefox and Edge.
