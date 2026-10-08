# B4F Hub

B4F Hub is a React + TypeScript portfolio project designed to showcase my ability to build polished, interactive frontend experiences with clear product thinking and clean UI architecture.

The project presents two connected experiences in one dashboard:

- a community-style feed where users can create posts, like content, and browse updates
- an opportunities board where users can browse listings, save favorites, and move through detail views

It was created as a personal GitHub portfolio project to highlight frontend development, state management, responsive layout design, and real-world UI interactions.

## What this project demonstrates

This app is a strong example of my work in:

- building responsive interfaces with React and TypeScript
- structuring reusable components and shared data models
- implementing client-side state and interaction patterns
- integrating with a local API layer for realistic product behavior
- creating a clean, product-like UI that feels polished and intentional

## Key features

- Community feed with post composition and engagement actions
- Opportunity browsing and filtering
- Saved/favorited state for individual items
- Notification system for user feedback
- Responsive desktop/mobile layout
- Custom UI logic built around real user flows rather than static mock screens

## Tech stack

- React
- TypeScript
- Vite
- Express (local mock API)
- CSS for layout and styling

## Project structure

- `src/components` — reusable UI components for the community and opportunities sections
- `src/hooks` — custom hooks for shared behaviors such as notifications
- `src/types.ts` — application data types used across the app
- `server/` — local mock backend for data and API simulation

## Running locally

```bash
npm install
npm run dev
```

This starts the frontend and the local API together:

- Frontend: `http://localhost:5173`
- API: `http://localhost:3001`

## Portfolio note

This repository is intentionally structured like a portfolio-quality front-end project: it focuses on user experience, clear component separation, and practical interaction design rather than just a bare starter app. It reflects the kind of product thinking and execution I aim to bring to real-world frontend work.

## Future improvements

- add persistent saved state across refreshes
- improve notification timing and UX
- refactor repeated logic into reusable custom hooks
- expand the design system and accessibility polish
