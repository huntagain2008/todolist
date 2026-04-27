# todolist AGENTS.md file


## Project Goals

- Users can create to-do items.

- Items can be edited, deleted, and marked as complete.

- Items can be filtered by status.

- Priorities and due dates can be set.

- Data persists across refreshes.

## Non-Goals

- No user login or registration.

- No multi-user collaboration.

- No push notifications.

- No complex permission systems.

- No AI-driven automatic planning.

## Technical Constraints

- Frontend: Next.js + TypeScript + Tailwind

- Data Layer: Prisma + SQLite

- Testing: Vitest + Playwright

- Deployment: Supports local execution via Docker.

## Acceptance Criteria

- Core CRUD (Create, Read, Update, Delete) functionality is complete and functional.

- Data persists after refreshing the page.

- Filtering logic is correct.

- Clear feedback is provided for invalid input.

- Tests pass locally.

- The project can be launched with a single command.
