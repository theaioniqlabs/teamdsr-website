# Phase 2.2 — Visual Language

Visual refinement of the Phase 2.1 shell to match Team DSR Company Profile language.

## What changed

- Expanded design tokens (radius 12–32 + pill, soft elevation shadows, type scale, primary-soft, footer on-dark tokens)
- Header: taller bar, underline hover, solid scrolled state (no glass/blur), pill CTA lift
- Mega menu: floating modular card, descriptions, generous spacing
- Mobile menu: rounded accordion rows, grid `0fr`/`1fr` open animation
- Search: larger field, Esc/Ctrl+K hints, Recent + Suggested placeholders
- Footer: rounded modules, contact channel icons (phone/email/web only), tokenized colors

## What did not change

- Folder structure and architecture
- Navigation IA / routes
- Homepage sections (none)
- Component init APIs

## Verify

Serve the project root, then check:

1. Scrolled header has no blur
2. Mega panels feel like Profile cards
3. Search opens with Ctrl/Cmd+K
4. Footer modules use soft rounded surfaces
5. No homepage content in `#site-main`

## Status

Awaiting approval before Phase 3 (Global Component Library).
