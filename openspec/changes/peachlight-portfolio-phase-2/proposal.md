## Why

Phase 1 delivered visual parity with hardcoded markup in eight Astro components. Content updates today require editing HTML across multiple files. Phase 2 centralizes all portfolio copy and structured data in `src/data/portfolio.ts` so future edits happen in one typed file without touching presentation markup.

## What Changes

- Add `src/data/portfolio.ts` with TypeScript types and exports for site meta, navigation, section headings, projects, experience, about, contact, and footer
- Refactor **all** content-bearing components to read from `portfolio.ts`: `Hero`, `TopNav`, `Work`, `Experience`, `About`, `Contact`, `Footer`, and `PortfolioLayout` (title/description)
- Keep presentation concerns in components: project SVG thumbs, form field markup, motion classes, `data-od-id` attributes
- **No visible copy changes** — populate `portfolio.ts` from the current live site (Phase 1 paridad), not by auto-importing `cv-source.md`
- **Non-goal:** syncing extra CV entries (Fraktalweb, Freelancer, additional projects) onto the site — that is editorial work for a later phase

## Capabilities

### New Capabilities

- `portfolio-content-data`: Typed content model (`portfolio.ts`) and component data binding without visual regression

### Modified Capabilities

- _(none — new data layer on top of Phase 1 specs)_

## Impact

- **New:** `src/data/portfolio.ts`
- **Modified:** `Hero.astro`, `TopNav.astro`, `Work.astro`, `Experience.astro`, `About.astro`, `Contact.astro`, `Footer.astro`, `PortfolioLayout.astro`
- **Unchanged:** CSS, scripts (`hero-scene.ts`, `portfolio-motion.ts`, `contact-form.ts`), GLB, motion behavior
- **Reference only:** `src/data/cv-source.md` (not parsed at runtime)
