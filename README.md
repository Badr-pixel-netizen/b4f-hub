# B4F Hub — Take-Home Starter Project

This is your starting point for the B4F Hub take-home assessment. It contains:

- a bare React + TypeScript + Vite project (`src/App.tsx` is intentionally minimal — you build
  everything from here)
- a ready-to-run local API (`server/`) with seed data already loaded — **you are not asked to
  build or modify the API**

## Install and run

```bash
npm install
npm run dev
```

This starts BOTH the frontend and the local API together:

- Frontend: `http://localhost:5173`
- Local API: `http://localhost:3001` (already proxied — call it from your code as `/api/...`,
  e.g. `fetch("/api/posts")`, no CORS setup needed)

## What's provided vs. what you build

**Provided (do not need to build):** the local API and its five endpoints, seed data, this
starter's build tooling.

**You build:** all React components, all TypeScript types, all API integration code, all styling,
all state, all filtering/search logic, and the required data-structure behaviors.

See `B4F_HUB_TAKE_HOME_REQUIREMENTS.pdf` for the full assignment and `B4F_HUB_UI_REFERENCE.pdf`
for the interface you should reasonably match.

## Resetting your data

The local API keeps all posts/opportunities in memory. If you want a completely fresh seed data
set at any point, just stop the dev server (Ctrl+C) and run `npm run dev` again.

## Architecture

`App.tsx` is just a shell: `Header`, `main` (holding `CommunitySection` and `OpportunitiesSection`
side by side), `Footer`, and a `NotificationToast` fed by the `useNotificationQueue` hook. Each
section is a self-contained container component that owns its own fetch state (`loading` /
`success` / `error`), does its own `GET`/`POST`/`PATCH` calls, and derives its visible list by
filtering on every render rather than storing a second "filtered" copy of the data. Presentational
pieces (`PostCard`, `ComposeForm`, `PostFilters`, `OpportunityCard`, `OpportunityFilters`) take
plain props and callbacks — all state lives in the two section containers. Shared types live in
`src/types.ts` so both sections agree with what `server/data.js` actually returns.

## Data structure choices

- **Stack — `OpportunitiesSection`'s `historyStack`.** Opening a different opportunity's detail
  while one is already open pushes the id being left behind onto a plain array used as a LIFO
  stack. "Back to previous opportunity" pops the top id and jumps there. Chosen because the
  requirement is explicitly "undo one step at a time, most-recent-first" — the definition of a
  stack.
- **Hash Table — `opportunitiesById` in `OpportunitiesSection`.** Built once per fetch as a plain
  object keyed by id. The history stack only stores bare ids, so turning "the id on top of the
  stack" back into a full opportunity (specifically, to show "Back to <title>") needs an instant
  keyed lookup rather than an `.find()` scan through the array on every render.
- **Hash Set — `savedIds` in `OpportunitiesSection`.** A `Set<number>` of bookmarked ids, toggled
  on/off and checked with `.has()`. Chosen because the only question ever asked of it is
  membership ("is this id saved?"), with no duplicates possible and no ordering to preserve.
- **Queue — `useNotificationQueue`.** A plain array of pending notifications. `notify()` always
  appends to the back; `dismissFront()` always removes from the front; only `queue[0]` is ever
  rendered. Chosen because notifications must display one at a time, in the order they occurred —
  first in, first out.

## A real challenge

Making the desktop layout's two panels scroll independently (Section 15) while the mobile layout
stays a single normally-scrolling page took a second pass: the original starter had the navbar and
footer permanently `position: fixed`, which actually works against the mobile spec (the footer is
supposed to sit in normal document flow on a phone, not stay pinned). Fixed positioning is now
scoped to a `min-width: 701px` media query, and only at that width do `.main-container` get a fixed
height with `.panel` scrolling internally.

## What's next with more time

- Extract the shared fetch/loading/error pattern between `CommunitySection` and
  `OpportunitiesSection` into a custom hook (the Independent Learning Challenge).
- An automatic timeout on notifications, on top of the required manual dismiss.
- Persisting saved opportunities and liked posts across a refresh (currently in-memory only, reset
  on reload, matching what the brief requires).
