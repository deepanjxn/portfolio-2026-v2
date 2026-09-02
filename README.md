# Portfolio 2026

Personal product design portfolio for Deepanjan Sen. A minimal, typography-driven site with a Home page (category-filtered project studies/visuals/explainers with single/split view and sticky category controls) and an About page (dark theme with a cursor-following video on fine-pointer devices).

## Tech stack

- [Next.js](https://nextjs.org) (App Router) + React + TypeScript
- CSS Modules for component styles
- [Geist](https://vercel.com/font) + Geist Mono (via `next/font`)
- No UI/icon/animation libraries — native CSS and browser APIs only

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Commands

```bash
npm run dev      # development server
npm run lint     # ESLint
npm run build    # production build
npm run start    # serve the production build
```

## Deploy

Vercel-compatible: push to GitHub and import the repository, or deploy with `vercel`. The site is fully static-friendly (both routes prerender at build time).
