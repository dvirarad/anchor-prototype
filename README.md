# Anchor — Interactive Prototype

Working prototype for the Anchor product (PM home assignment). The app is a single-page React experience demonstrating the core triage discipline: **Schedule, Snooze with re-check date, or Dismiss.**

## Live demo

[Add your Netlify URL here after deploy]

## Stack

- Next.js 14 (App Router)
- React 18
- Tailwind CSS
- lucide-react (icons)
- CSS-only animations (no animation libraries)

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy to Netlify

1. Push this repo to GitHub.
2. Sign in to [Netlify](https://app.netlify.com) → "Add new site" → "Import an existing project" → select this repo.
3. Netlify auto-detects Next.js. Click "Deploy".
4. Done — you'll get a URL like `anchor-prototype.netlify.app`.

## Three views

- **Triage** — daily morning queue with one card at a time. Three forced states.
- **Snoozed** ("Waiting Room") — items that have a return date.
- **Week** — paired North Star Metric (terminal-state rate + coverage), supporting metrics, decision rules.

## Design intent

A todo without a time is a wish. The product doesn't replace the calendar — it feeds it.
