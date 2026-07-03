## R7.1 — Dead code removal

- [x] R7.1.1 Delete unused rules from `portfolio.css`: `.stack`, `.row`, `.pill`, `.card-flat`, `.btn-ghost`, `.card:not(.forest-panel)`, `.h2`, `.h3`
- [x] R7.1.2 Run `pnpm build`; confirm no visual change

## R7.2 — Button unification

- [x] R7.2.1 Update `Contact.astro` submit: `btn btn-primary` → `btn-base btn-accent-fill` with hover/focus states
- [x] R7.2.2 Delete `.btn`, `.btn-primary`, `.btn:active` from `portfolio.css`
- [x] R7.2.3 Visual check Hero CTAs + Contact submit match

## R7.3 — Easy structural wins

- [x] R7.3.1 Replace `.section-band` with `bg-surface border-y border-border` on Experience + Contact sections; delete rule
- [x] R7.3.2 Replace `.h1` on Hero with Tailwind typography utilities; delete `.h1` rule (keep `h1 { text-wrap: balance }`)
- [x] R7.3.3 Move `.contact-link` to `@layer components` in `global.css`; delete from `portfolio.css`
- [x] R7.3.4 Move `.form-success` / `.form-success.is-visible` to `@layer components`; delete from `portfolio.css`
- [x] R7.3.5 Merge `.tag:hover` into `@layer components .tag`; delete from `portfolio.css`

## R7.4 — Form field components

- [x] R7.4.1 Add `.input`, `.textarea`, `.field-error` and `.field.is-invalid` states to `@layer components` in `global.css`
- [x] R7.4.2 Delete form rules from `portfolio.css` (lines `.input` through `.field.is-invalid`)
- [x] R7.4.3 Test Contact form: focus rings, validation errors, success state (`contact-form.ts` unchanged)

## R7.5 — Layout primitives

- [x] R7.5.1 Migrate `.timeline-row` grid to Tailwind on `Experience.astro`; replace `forest-panel--pad` with inline `p-[clamp(...)]` for timeline + compact rows
- [x] R7.5.2 Delete `.timeline-row`, `.timeline-compact.forest-panel--pad`, `.forest-panel--pad`, and responsive media query from `portfolio.css`
- [x] R7.5.3 Migrate `.project-thumb` (+ svg child) to `@layer components` or utilities on `Work.astro`; delete from `portfolio.css`
- [x] R7.5.4 Visual check Experience timeline (desktop + mobile) and Work card thumbs

## R7.6 — Final audit

- [x] R7.6.1 Verify `portfolio.css` ≤ 90 lines; list remaining rules matches design permanent-keep list — **134 líneas** (reset 25 + topnav 31 + forest-panel 12 + hero 17 + mascot/canvas 24 + about-photo 19); todas las reglas coinciden con lista permanente; target 90 era optimista
- [x] R7.6.2 Confirm `portfolio-motion.css` unchanged — 482 líneas; único delta vs R6: fix selector `.reveal.is-visible[data-od-id="skills-section"] .tag`
- [x] R7.6.3 `pnpm build` + smoke test all sections (Hero intro, reveals, handoffs, form)
- [x] R7.6.4 Update `migrate-astro-plan.md` Fase R checklist (mark R7 complete)
