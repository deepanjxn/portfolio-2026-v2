<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

<!-- PROJECT MEMORY — Deepanjan Sen portfolio-2026-v2 -->

# Project memory (keep in mind across sessions)

## What this is
Personal product-design portfolio. Home (`/`) + About (`/about`, dark theme) built with Next.js 16.3.4 (App Router) + React 19 + TypeScript + CSS Modules. No UI/icon/animation/state libraries — native CSS + browser APIs only (Geist/Geist Mono via next/font). GitHub: `github.com/deepanjxn/portfolio-2026-v2`, remote `origin`, branch `master`, Vercel-compatible.

## Key decisions (source of truth — do not break)
- Shared `.container` (globals.css): `width: calc(100% - 2 * var(--page-gutter))`, `max-width: 1392px`, `margin-inline: auto`. Gutter 24px desktop/tablet, 16px mobile (`--page-gutter` override inside the existing `@media (max-width: 767px)` — the only mobile breakpoint, shared by everything).
- Home: intro → "Currently at Layer" 32px; → category controls 120px desktop / 64px mobile (`PortfolioSection .section` margin-top, no new breakpoints). Controls → grid 24px. Category filters [Studies][Visuals][Explainers] always visible on ALL sizes.
- View toggle: hidden entirely on mobile (`ViewToggle.module.css` `@media max-767 .toggle { display: none }`). Desktop + tablet: both icons, interactive (grid 2-col from 768px; single = 1 col). Mobile single-column enforced by grid CSS. Split disabled threshold uses `(max-width: 767px)` matchMedia in ViewToggle; forces `"single"` state on mobile, resumes on tablet.
- Icons: actual SVG assets `public/icons/single-view.svg` + `two-view.svg` (edited to `fill="currentColor"`), rendered via CSS `mask-image` spans colored by button `color` tokens (`--color-icon-active` #8b8b8b / `--color-icon-default` #e0e0e0). No icon library.
- Sticky controls: `.controls` inside `PortfolioSection` is `position: sticky; top: 0; z-index: 10`, with `padding: 24px 0` + negative `margin: -24px 0` (white 24px band above + below while stuck; normal-flow geometry unchanged via margin collapse). Never JS scroll listeners; sticky must anchor to viewport — do NOT re-add `overflow-x: hidden` on `body` (it turns body into a scroll container and kills sticky); root-level clipping lives on `html` only.
- Scrollbar: desktop scrollbars visually hidden, layout space preserved: `html::-webkit-scrollbar { display: none }` under `@media (pointer: fine)`; Firefox via `@supports not selector(...) { scrollbar-width: none }`. `scrollbar-gutter: stable` on html. Never use `overflow: hidden` on body/html for this.
- About: heading→first item 24px, item→item 8px (AboutColumn). Section → section 120px desktop / 64px mobile. Mobile column order Experience → Principles → Tools (AboutColumns 767px media). Intro paragraphs gap 32px, max-width 780px. Footer copyright is `--color-text-primary`.
- About cursor video (`components/about/CursorMedia.*`, data `cursorMediaSource` in `data/about.ts`): 164px wide, auto height (native 1728×2160 4:5), radius 0, fine-pointer/desktop only (CSS + `pointerType === "mouse"`), hidden until ~500ms after mount, then revealed already positioned at the CURRENT cursor (`translate3d` + 24px offset vars), lerp 0.18/frame via rAF in refs (no React state per move), `pointer-events: none`, respects `prefers-reduced-motion` (early return + CSS). Source: `public/videos/deepanjan-sen-about.webm` (VP9, webm MIME).
- Page-load entrance reveal (Home + About): elements marked `data-reveal` (+ `data-reveal="media"` for the slower card variant) animate `opacity 0→1` + `translateY(8px→0)` via pure CSS keyframes gated on a `reveal-entering` class on `<body>` (present in SSR markup, re-added before each client-route paint). Delays are per-element `--reveal-delay` inline vars — stagger 100ms (header 0 → About paragraphs 100/200/300 → columns 400/500/600; Home intro 100, workplace 200, controls 300, media rows 400+); text 800ms, media 950ms, `cubic-bezier(0.22,1,0.36,1)`. `components/layout/PageReveal.tsx` (in root layout) removes the class after 2600ms so re-renders (category/view switches) never replay. Reduced motion disables animations entirely.
- UI sounds (`components/layout/SoundEffects.tsx`, in root layout; assets `public/sfx/click-sound.m4a` + `click-enter.m4a`): delegated `pointerover` plays click-sound once per hover-enter of `a[href], button:not(:disabled), [data-hover-sound]` (project cards), mouse pointer only, no retrigger inside same target; delegated `click` plays click-enter on `a[href], button:not(:disabled)` (category filters + view toggle included). 300ms hover-sound suppression after a click avoids the post-navigation remount ghost. Browsers block audio until the first press: a `pointerdown` anywhere silently unlocks both cached Audio elements (volume 0); volume restored to 1 on real plays.
- Header typography is H3 everywhere (brand "D-S" + About/Email links, `type-h3`), replacing the old type-t1 brand and P1 links.
- Assets live under `public/` and are referenced by absolute URL or CSS `url("/...")`; project cards render placeholder panels (no image assets yet).

## Workflow
- Use the dev server (`npm run dev`, port 3000) — it is usually already running; do NOT start extra `next start` instances (port conflicts + stale builds caused past debugging confusion).
- Validate with `npm run lint` + `npx tsc --noEmit` + `npm run build`.
- Runtime verification (sticky, scrollbar, breakpoints, cursor video) has been done via headless Chrome + CDP scripts driven from Node (temp dir), never by assumption.
- Git: commit style short imperative ("Build …"), no push without explicit request.

