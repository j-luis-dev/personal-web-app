## 1. Data model

- [x] 1.1 Create `src/data/portfolio.ts` with types: `Project`, `ExperienceEntry`, `NavLink`, `SectionCopy`, `SiteInfo`, etc.
- [x] 1.2 Populate `site`, `nav`, `sections`, `footer` from current Hero, TopNav, Layout, and Footer copy
- [x] 1.3 Populate `projects` (4 cards) from `Work.astro` — include `id`, `tagVariant`, `revealDelay`, optional `href`/`linkLabel`
- [x] 1.4 Populate `experience` (3 timeline + 1 compact) from `Experience.astro`
- [x] 1.5 Populate `about` (bio, education, languages, skills) from `About.astro`
- [x] 1.6 Populate `contact` links and `form.successMessage` from `Contact.astro`

## 2. Component binding

- [x] 2.1 Refactor `PortfolioLayout.astro` to use `site.title` and `site.description`
- [x] 2.2 Refactor `Hero.astro` to use `site` (name lines, eyebrow, role, tagline, CTAs)
- [x] 2.3 Refactor `TopNav.astro` to map `nav.links` and `nav.logoLabel`
- [x] 2.4 Refactor `Work.astro` to `projects.map()` — keep SVG thumbs keyed by `project.id`
- [x] 2.5 Refactor `Experience.astro` to `experience.map()` with `kind: 'timeline' | 'compact'` branches
- [x] 2.6 Refactor `About.astro` to use `about` for copy/skills; keep `Iam.webp` static import
- [x] 2.7 Refactor `Contact.astro` to use `contact` for links and success message; keep form field markup
- [x] 2.8 Refactor `Footer.astro` to use `footer` export

## 3. Validation

- [x] 3.1 Run `pnpm build` — no type or import errors
- [x] 3.2 Visual parity check: compare rendered output to pre-Phase-2 (same copy, links, section order)
- [x] 3.3 Confirm `cv-source.md` is not imported by any component or data module
