## Why

Phases 0–2 delivered a working portfolio on ~918 lines of custom CSS (`portfolio.css`). Tailwind 4 is installed but not wired into `PortfolioLayout` — the design system exists twice in parallel without convergence. A phased CSS refactor migrates layout and typography to Tailwind utilities while preserving motion, handoffs, and decorative polish that are impractical to express as utilities.

## What Changes

- Wire Tailwind into the portfolio via `global.css` with `@theme` bridge from Peachlight Forest tokens
- Introduce CSS `@layer` ordering so Tailwind utilities override legacy rules without HTML class-order tricks
- Migrate components module-by-module (Footer → TopNav → Experience → About → Work → Contact → Hero layout only)
- Shrink `portfolio.css` incrementally; extract permanent motion/decoration rules into `portfolio-motion.css` (final step)
- **Non-goal:** 100% utility-first HTML, replacing handoffs/reveals, or touching `portfolio-motion.ts` / `hero-scene.ts`
- **Deferred:** deploy, CI, Lighthouse, `@fontsource` (separate phase)

## Capabilities

### New Capabilities

- `portfolio-tailwind-bridge`: `@theme` mapping, layer setup, `global.css` integration in layout
- `portfolio-css-migration`: Per-module Tailwind migration with visual parity and legacy CSS removal

### Modified Capabilities

- _(none)_

## Impact

- **Modified:** `src/styles/global.css`, `src/layouts/PortfolioLayout.astro`, all section components
- **Shrinking:** `src/styles/portfolio.css` → eventually split into `portfolio-motion.css` + deleted layout rules
- **Unchanged:** `tokens.css` (source of truth for colors), motion scripts, `portfolio.ts`, 3D hero
- **Risk area:** Tailwind preflight vs custom reset; `.container` name collision
