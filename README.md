<p align="center">
  <img src="docs/cover.png" alt="useMemo — Sticky notes that feel like real stationery" width="100%" />
</p>

# useMemo

A single-page sticky notes board built with **React + TypeScript** for the DataArt Front-end Challenge. Create, move, resize and toss notes in the trash — notes look like printed notepads, with a pattern frame and a washi-tape strip.

## Links

| Resource              | Link                                                                                                           |
| --------------------- | -------------------------------------------------------------------------------------------------------------- |
| Live demo (Vercel)    | _Coming soon — deployed from `main`_                                                                           |
| Figma                 | [DataArt Challenge - useMemo](https://www.figma.com/design/pVCvK8DkzvEhO6kNmw5EnQ/DataArt-Challenge---useMemo) |
| Jira board (Sprint 1) | [DCU board](https://marinaziembar-team.atlassian.net/jira/software/projects/DCU/boards/2)                      |
| PRD                   | [DCU-2 · Product requirements](https://marinaziembar-team.atlassian.net/browse/DCU-2)                          |
| RFC                   | [DCU-1 · Technical architecture](https://marinaziembar-team.atlassian.net/browse/DCU-1)                        |
| Architecture          | [ARCHITECTURE.md](ARCHITECTURE.md) _(DCU-19)_                                                                  |

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
- **CI:** GitHub Actions (`.github/workflows/ci.yml`) runs lint, typecheck and the tests with coverage on every push and on pull requests to `development` and `main`.

## Pre-commit checks

Husky runs these checks on every commit:

1. **lint-staged** on staged files: ESLint (`--fix`), Prettier and Jest tests related to the changed files (`--findRelatedTests`).
2. **TypeScript** type-check of the whole project (`npm run typecheck`).

The commit is blocked if any check fails.

## Project structure

```
src/
├── App/                  # Root component
├── components/           # UI components (one folder per component)
│   └── Note/
│       ├── index.ts
│       ├── Note.tsx
│       ├── Note.styles.css
│       └── Note.test.tsx
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
