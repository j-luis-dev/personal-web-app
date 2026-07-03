## Why

Phase R (`peachlight-css-tailwind-refactor`) completed the Tailwind bridge and migrated layout/typography across all sections, but `portfolio.css` still holds ~255 lines including dead rules, a dual button system (`btn-base` vs `btn btn-primary`), and structural classes that duplicate what Tailwind or `@layer components` already provide. Unlayered legacy CSS overrides Tailwind utilities on conflict, so finishing the migration requires deleting legacy rules—not adding more classes. This cleanup closes the CSS→Tailwind arc to a stable end state (~70 structural lines + `portfolio-motion.css`).

## What Changes

- Remove unused CSS rules (`.stack`, `.row`, `.pill`, `.card-flat`, `.btn-ghost`, `.card:not(.forest-panel)`, unused `.h2`/`.h3`)
- Unify buttons: Contact submit uses `btn-base btn-accent-fill` like Hero/TopNav; delete legacy `.btn`/`.btn-primary`
- Migrate remaining easy structural classes to Tailwind utilities or `@layer components` in `global.css`:
  - `.section-band`, `.h1`, `.contact-link`, `.form-success`
  - `.input`, `.textarea`, `.field-error` (+ invalid state)
  - `.forest-panel--pad` → inline clamp padding (match About/Contact pattern)
  - `.timeline-row`, `.project-thumb`
- Move `.tag:hover` from unlayered `portfolio.css` into `@layer components` `.tag` definition
- **Non-goal:** touch `portfolio-motion.css`, hero shell, topnav `::after`, `.forest-panel` decor, or base reset
- **Non-goal:** deploy, i18n, new features

## Capabilities

### New Capabilities

- `portfolio-css-cleanup`: Dead code removal, button unification, padding consistency, final `portfolio.css` size target
- `portfolio-form-components`: Form field, validation, success state, and contact link styles as `@layer components`

### Modified Capabilities

- _(none — prior phase specs live in archived change; this is a continuation)_

## Impact

- **Shrinking:** `src/styles/portfolio.css` (~255 → ~70 lines structural)
- **Growing slightly:** `src/styles/global.css` (`@layer components` additions)
- **Modified components:** `Hero.astro`, `Experience.astro`, `Contact.astro`, `Work.astro`
- **Unchanged:** `portfolio-motion.css`, motion scripts, `tokens.css`, `portfolio.ts`, 3D hero
