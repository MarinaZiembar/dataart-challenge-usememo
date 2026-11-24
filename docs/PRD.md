# PRD: useMemo – Sticky Notes

> Copy of the PRD kept in Jira: [DCU-2](https://marinaziembar-team.atlassian.net/browse/DCU-2). It is the source of truth for scope during Sprint 1.

## 1. Problem statement

Users need a fast, visual space to jot down ideas and arrange them freely, like physical sticky notes on a wall.

## 2. Objective

Ship a desktop single-page app that lets users create, arrange, resize, edit and discard sticky notes with direct manipulation, and keep them across sessions in their browser.

## 3. Target users and context

- Desktop users (min. 1024x768) on latest Chrome, Firefox or Edge.
- Evaluators of the DataArt challenge, who will focus on architecture, performance, code quality, static typing accuracy and usability.

## 4. Scope

### Must have (core – at least 3 of 4 required; we commit to all 4)

| #   | Requirement                                                   |
| --- | ------------------------------------------------------------- |
| F1  | Create a new note of a specified size at a specified position |
| F2  | Change note size by dragging                                  |
| F3  | Move a note by dragging                                       |
| F4  | Remove a note by dragging it over a predefined trash zone     |

### Nice to have

| #   | Requirement                                                                     |
| --- | ------------------------------------------------------------------------------- |
| B1  | Enter/edit note text                                                            |
| B2  | Bring a note to front when overlapping                                          |
| B3  | Save notes to localStorage and restore them on page load (the only persistence) |

### Extra mile

| #   | Requirement                                                                                                                                                                                                                                             |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| B4  | Note themes: every note is printed with a user-selectable **pattern** (8 patterns) around a centered aged off-white paper panel that holds the text. Each pattern has its own color palette, which covers the challenge's "different note colors" bonus |

### Out of scope

Saving notes to a REST API or any backend, authentication, sharing, sync across devices, mobile layout.

## 5. User stories

- As a user, I want to draw a rectangle on the board to create a note of that size at that position.
- As a user, I want to drag a note's corner to resize it.
- As a user, I want to drag a note to move it around.
- As a user, I want to drop a note on the trash zone to delete it.
- As a user, I want to type in a note so I can capture my ideas.
- As a user, I want the note I interact with to come to the front.
- As a user, I want my notes to still be there when I reload the page.
- As a user, I want to pick a pattern for each note to organize my notes visually.

## 6. UX principles

- Direct manipulation, no modals for core actions.
- Notes look like real stationery: a printed pattern frame, an aged-paper panel for the text and a small decorative strip of washi tape on top while the note is resting.
- Clear affordances: grab cursor on notes, resize cursor on the handle, trash zone highlights when a note hovers it.
- Note text scales with the note size (14–24px, 16px on a standard note) so it stays readable.
- The header always shows whether changes are saved, being saved or could not be saved (storage full or blocked).
- Keyboard: `Esc` cancels an in-progress drag; `Delete` removes the focused note (accessibility fallback).

## 7. Success metrics

- All core features working in Chrome, Firefox and Edge (Playwright green).
- ≥ 80% unit/integration coverage on `src/utils`, `src/services`, `src/store` and `src/hooks`.
- No dropped frames noticeable while dragging 50 notes.
- Zero `any` and zero TypeScript errors in strict mode.

## 8. Deliverables

- Source code repository with build instructions.
- Short architecture description (2–3 paragraphs, English): [ARCHITECTURE.md](ARCHITECTURE.md).
- Figma file "DataArt Challenge - useMemo" (moodboard includes a competitive analysis of Miro, Mural, Confluence Whiteboards and FigJam).
- Client demo with PowerPoint presentation.
- Project user/technical manual.

## 9. Timeline

Sprint 1 – 15 days. Design days 1–3, core development days 2–8, bonus features days 7–10, QA days 9–12, documentation and demo days 12–15.
