## R0 — Tailwind bridge

- [x] R0.1 Add `@theme inline` token bridge to `global.css`
- [x] R0.2 Configure `@layer legacy` and import `portfolio.css` into legacy layer
- [x] R0.3 Import `global.css` in `PortfolioLayout.astro` (after `tokens.css`)
- [x] R0.4 Verify zero visual change: `pnpm build` + manual smoke test

## R1 — Layout primitives + Footer

- [x] R1.1 Resolve `.container` collision → `site-container` or utility equivalent (all components)
- [x] R1.2 Migrate `Footer.astro` layout to Tailwind utilities
- [x] R1.3 Migrate shared layout classes: `.row-between`, `.section` padding (used across components)
- [x] R1.4 Delete migrated rules from `portfolio.css`; visual check Footer + one section

## R2 — Typography + buttons

- [x] R2.1 Migrate `.eyebrow`, `.lead`, `.meta`, `.num` usage to Tailwind (or `@layer components` with `@apply`)
- [x] R2.2 Migrate `.btn`, `.btn-primary`, `.btn-secondary`, `.btn-arrow` in Hero and TopNav
- [x] R2.3 Keep `.topnav nav a::after` underline in CSS; migrate nav flex/spacing only
- [x] R2.4 Delete migrated rules; visual check Hero CTAs + TopNav

## R3 — Experience + About

- [x] R3.1 Migrate `Experience.astro` timeline layout (keep `.timeline-row`, `.forest-panel--pad` decor)
- [x] R3.2 Migrate `About.astro` grid and skills layout (keep `.about-photo` animation CSS)
- [x] R3.3 Delete migrated rules; visual check both sections + scroll reveals

## R4 — Work + Contact

- [x] R4.1 Migrate `Work.astro` grid and card inner layout (keep `.forest-panel`, project thumbs)
- [x] R4.2 Migrate `.tag`, `.tag-internal` to Tailwind or `@layer components`
- [x] R4.3 Migrate `Contact.astro` grid and form field layout (keep validation styles)
- [x] R4.4 Delete migrated rules; visual check Work cards + Contact form

## R5 — Hero copy layout

- [x] R5.1 Migrate `.hero-split`, `.hero-copy`, `.hero-cta` layout to Tailwind
- [x] R5.2 Do NOT migrate `.hero-ambient`, `.hero-orb`, `.hero-handoff-bridge`, `.mascot-stage` decor
- [x] R5.3 Delete migrated hero layout rules only; visual check Hero fullscreen + intro animation

## R6 — CSS cleanup split

- [x] R6.1 Extract remaining rules (keyframes, reveals, handoffs, hero ambient, scrollbar, forest-panel decor) to `portfolio-motion.css`
- [x] R6.2 Remove empty/redundant `portfolio.css` or reduce to re-exports
- [x] R6.3 Update `migrate-astro-plan.md` progress; full §7 checklist pass
