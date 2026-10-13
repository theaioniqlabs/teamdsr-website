# Phase 2.1 — Website Shell

## Purpose

Reusable website shell only: header, mega menu, mobile accordion menu, search overlay, and enterprise footer. No homepage sections.

## Run locally

Component HTML is loaded via `fetch`, so a static server is required:

```bash
npx --yes serve .
```

Or:

```bash
python -m http.server 5500
```

Then open the served URL (for example `http://localhost:3000` or `http://localhost:5500`).

## Structure

- `index.html` — mount points only (`#site-header`, `#site-search`, `#site-main`, `#site-footer`)
- `js/data/navigation.js` — single source of truth for nav labels/hrefs
- `js/app.js` — loads and initializes shell components
- `components/*` — each folder has `.html`, `.css`, `.js`

## Navigation (desktop)

- Home, Contact → direct links
- About, Solutions, Systems, Projects → mega menu panels

## Mobile (< 1024px)

- Hamburger opens drawer
- Nested items use accordion panels

## Search

- Overlay UI only; submit is prevented until a later phase

## Verify

1. Sticky header turns solid on scroll
2. Desktop mega panels open/close (Esc, outside click)
3. Mobile accordion works; mega hidden
4. Search overlay focus + Esc
5. Footer sitemap + Profile contact details
6. `#site-main` has no homepage section markup

## Status

Awaiting approval before Phase 2.2.
