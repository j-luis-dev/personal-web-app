## Context

`peachlight-css-tailwind-refactor` (Phase R) established:
- `global.css` with `@theme inline`, `@utility site-container`, `@layer components` (eyebrow, lead, btn-base, tag)
- Unlayered imports of `portfolio.css` + `portfolio-motion.css` at end of `global.css`

**Critical constraint:** unlayered `portfolio.css` wins over Tailwind utilities on specificity ties. Migration = **delete legacy rule + add replacement**, never add utilities alone.

**Current `portfolio.css` inventory (~255 lines):**
| Bucket | Lines | Action |
|--------|-------|--------|
| Dead code | ~45 | Delete |
| Migratable structural | ~110 | Tailwind or `@layer components` |
| Permanent structural | ~70 | Keep (reset, topnav, forest-panel, hero, mascot, about-photo base) |
| `portfolio-motion.css` | 462 | Do not touch |

**Inconsistencies to fix:**
- Hero/TopNav: `btn-base btn-accent-fill` | Contact: `btn btn-primary`
- Experience: `forest-panel--pad` | About/Contact: `p-[clamp(...)]` inline

## Goals / Non-Goals

**Goals:**

- Reduce `portfolio.css` to ~70 lines of permanent structural CSS
- Single button component system (`btn-base` + variants)
- Consistent panel padding via Tailwind clamp utilities
- Form styles in `@layer components` (keeps `contact-form.ts` selectors `.input`, `.textarea`, `.field-error` working)
- Zero visual regression per task group

**Non-Goals:**

- Migrating `portfolio-motion.css` (motion, handoffs, scrollbar, hero orbs)
- Introducing `@layer legacy` retroactively (current unlayered approach works; don't refactor architecture)
- Base reset migration to Tailwind preflight
- `@theme` expansion (radius, gaps) unless needed during migration

## Decisions

### 1. Task order: dead code → unify → easy wins → forms → layout primitives

**Rationale:** Dead code removal is zero-risk and shrinks file before edits. Button unification before form migration avoids two button systems during form work.

### 2. Form styles → `@layer components`, not inline utilities

**Pattern:**

```css
@layer components {
  .input { @apply w-full rounded-[var(--radius)] border border-border bg-bg px-3.5 py-[11px] text-[15px] text-fg; }
  .input:focus { @apply border-accent outline-2 outline-[var(--accent-soft)]; }
  .field.is-invalid .input { @apply border-[var(--accent-warm)]; }
}
```

**Rationale:** `contact-form.ts` queries `.input`, `.textarea`, `.field-error` by class name. Keeping semantic class names avoids JS changes.

**Alternative rejected:** Pure utility classes on inputs — would require updating `contact-form.ts` and duplicates focus/invalid styles across fields.

### 3. `.section-band` → utilities on section elements

Replace class with `bg-surface border-y border-border` on Experience and Contact `<section>` tags. Delete `.section-band` rule.

### 4. `.h1` → utilities on Hero only

Hero is the sole consumer. Use `font-display text-[length:var(--fs-h1)] leading-[1.04] tracking-[-0.02em] m-0`. Delete `.h1` rule; keep generic `h1, h2, h3, h4 { text-wrap: balance }` in reset.

### 5. `.timeline-row` → Tailwind grid in Experience.astro

```html
class="grid grid-cols-[140px_1fr] gap-[var(--gap-lg)] items-start max-[720px]:grid-cols-1 max-[720px]:gap-[var(--gap-xs)]"
```

Delete `.timeline-row` and responsive media query from CSS.

### 6. `.project-thumb` → `@layer components` or utilities on Work.astro

Aspect ratio + border + grid center. Move `.project-thumb svg` child rule into same component block or `@layer components .project-thumb`.

### 7. `.tag:hover` merge into existing `.tag` in `global.css`

Delete standalone `.tag:hover` from `portfolio.css`; add hover states to `@layer components .tag`:

```css
.tag { @apply ... hover:border-accent hover:text-fg; }
```

### 8. End-state `portfolio.css` contents (keep list)

```
Reset (html, body, img, a, button, p, h1-h4 text-wrap)
.topnav + nav a + ::after
.forest-panel (no --pad modifier)
.hero shell + .hero > .site-container
.mascot-stage + #hero-3d-canvas
.about-photo base (motion hooks in portfolio-motion.css)
```

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| Unlayered CSS overrides new `@layer components` | Delete legacy rule in same PR as component addition |
| Form focus ring regression | Visual check Contact form focus + invalid states |
| Timeline breakpoint mismatch | Copy exact `720px` breakpoint from current CSS |
| `.tag` hover tied to skills reveal in motion.css | Only move color/border hover; keep opacity/transform in motion.css |
| `btn-accent-fill` on `<button>` vs `<a>` | Contact uses `<button>` — verify `color: var(--bg)` applies (no `a.btn-accent-fill` rule needed) |

## Migration Plan

1. **R7.1** Dead code deletion — `pnpm build`, no visual change expected
2. **R7.2** Button unification — Contact only
3. **R7.3** Section band + h1 + contact-link + form-success
4. **R7.4** Form components in global.css
5. **R7.5** Timeline + forest-panel--pad + project-thumb
6. **R7.6** Final audit: count lines, `pnpm build`, smoke all sections

**Rollback:** git revert per task group; each group is independently revertible.

## Open Questions

- _(none blocking — `site-container` naming is settled from Phase R)_
