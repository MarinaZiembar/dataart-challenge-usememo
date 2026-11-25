# Changelog

All notable changes to this project are documented here. The project follows [Semantic Versioning](https://semver.org/).

## [1.0.1] – 2026-11-24

### Fixed

- **Small screens:** below 1024×768 the app shows only the header and a notice asking to open useMemo on a computer, instead of a board that doesn't fit. The board comes back with the saved notes as soon as the window is big enough.
- **Loading notes:** the storage helpers now take care of a missing storage or an empty value themselves, so loading reads in one line without extra checks.

## [1.0.0] – 2026-11-24

First release of useMemo, the result of Sprint 1 of the DataArt Front-end Challenge. Live at [usememo-three.vercel.app](https://usememo-three.vercel.app).

### Core features

- **Create** a note of a chosen size at a chosen position by drawing on the board; a single click creates a 200×200 note (DCU-7).
- **Resize** a note by dragging its corner, between 100×80 and 600×600 (DCU-8).
- **Move** a note by dragging it, always inside the board (DCU-9).
- **Delete** a note by dropping it on the trash zone, or with the Delete key (DCU-10).

### Bonus features

- **Text:** write and edit the text of a note; the text scales with the note from 14 to 24px (DCU-11).
- **Bring to front:** the note you press or focus moves on top of the others (DCU-12).
- **Saving:** notes are saved in `localStorage` and restored on reload, with the save status in the header (DCU-13).
- **Patterns:** 8 printed patterns, chosen per note or for new notes in the dock (DCU-14).

### Quality

- Unit tests for utils, services, store and hooks, with 80% coverage enforced (DCU-17).
- Integration tests that run the whole app with `localStorage` (DCU-18).
- Playwright end-to-end tests in Chrome, Firefox and Edge, at 1440×900 and 1024×768 (DCU-20).
- GitHub Actions on every push: lint, typecheck, tests with coverage and e2e.

### Docs

- [Architecture](docs/ARCHITECTURE.md), [RFC](docs/RFC.md), [PRD](docs/PRD.md) and a complete README (DCU-19, DCU-21).
