## Context

The portfolio uses `tokens.css` + `portfolio.css` imported in `PortfolioLayout.astro`. `global.css` only contains `@import "tailwindcss"` and is unused. Components rely on semantic classes (`.forest-panel`, `.reveal`, `.hero-orb`) tied to motion JS and complex pseudo-elements.

**Already done (outside this change):** GLB Draco compression (~30 MB → ~2.8 MB), `DRACOLoader` in `hero-scene.ts`.

## Goals / Non-Goals

**Goals:**

- Tailwind utilities for layout, spacing, typography, and simple components (btn, tag)
- `@theme inline` bridge: `bg-bg`, `text-fg`, `font-display`, etc. from existing `:root` tokens
- Module-by-module migration with zero visual regression per module
- End state: `portfolio.css` reduced to motion, handoffs, decoration only (~350 lines est.)

**Non-Goals:**

- Deploy, CI workflows, Lighthouse audits, `@fontsource` (deferred phase)
- Replacing scroll handoffs, reveals, hero orbs, or `forest-panel::before` with Tailwind
- `@astroanimate/core`, GSAP migration
- Changing `portfolio.ts` content or component structure beyond `class` attributes
- HTML class attribute order as override strategy (does not affect CSS cascade)

## Decisions

### 1. Strangler-fig migration (not big-bang rewrite)

**Decision:** Add Tailwind alongside legacy classes; delete CSS rules only when a module is fully covered.

**Pattern:**

```html
<div class="forest-panel flex flex-col gap-5">
  <!-- forest-panel stays for ::before frame; flex/gap from Tailwind -->
</div>
```

### 2. `@layer` for cascade control (not class order in HTML)

**Decision:**

```css
/* global.css */
@import "tailwindcss";
@theme inline { /* bridge tokens */ }
@layer legacy, utilities;
```

Import `portfolio.css` rules into `@layer legacy`. Tailwind utilities sit in `@layer utilities` (default) and win over legacy without `!important`.

**Rejected:** Putting Tailwind classes after legacy classes in `class=""` — same specificity, no effect.

### 3. `@theme` bridge from `tokens.css`

**Decision:** Keep `tokens.css` as single source for color/font values. Map in `global.css`:

```css
@theme inline {
  --color-bg: var(--bg);
  --color-surface: var(--surface);
  --color-fg: var(--fg);
  --color-muted: var(--muted);
  --color-border: var(--border);
  --color-accent: var(--accent);
  --font-display: var(--font-display);
  --font-body: var(--font-body);
  --font-mono: var(--font-mono);
}
```

### 4. Rename `.container` to avoid Tailwind collision

**Decision:** During R1, replace `.container` with `.site-container` in CSS and components, OR use `max-w-[var(--container)] mx-auto px-[var(--gutter)]` utilities and remove the class.

**Rationale:** Tailwind v4 ships a `.container` utility that conflicts.

### 5. Permanent CSS (never migrate to Tailwind)

| Class / file | Reason |
|---|---|
| `.reveal`, `.hero-rise`, `.text-rise`, `.is-visible` | IntersectionObserver + keyframes |
| `.hero-ambient`, `.hero-orb`, `.hero-handoff-bridge` | Pseudo-elements, long animations |
| `.forest-panel::before` | Decorative frame gradient |
| `.work-handoff-glow`, `.about-handoff-bg`, `.contact-handoff-frame` | Scroll CSS variables |
| `html::-webkit-scrollbar-*` | No Tailwind equivalent |
| `.topnav nav a::after` | Underline animation pseudo |
| `@keyframes *` | All keyframe blocks |

### 6. Module migration order

```
R0 bridge → R1 Footer + layout primitives → R2 typography + buttons
         → R3 Experience, About → R4 Work, Contact → R5 Hero copy layout only
         → R6 split portfolio.css → portfolio-motion.css
```

### 7. `@apply` usage

**Decision:** Allowed sparingly for `.btn`, `.tag`, `.eyebrow` if duplicated across 4+ components. Prefer utilities in markup for layout. No `@apply` on motion classes.

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| Preflight breaks body reset | Test R0 visually; scope preflight or layer base carefully |
| Visual regression per module | Screenshot diff or manual §7 checklist per module |
| Partial migration leaves dual systems | Each task must delete migrated CSS rules |
| Scope creep into Hero ambient | R5 limited to `.hero-copy` layout; orbs stay in CSS |

## Migration Plan

1. **R0:** Wire `global.css`, `@theme`, `@layer`, verify no visual change
2. **R1–R5:** One component group per session; build + visual check
3. **R6:** Rename/split remaining CSS to `portfolio-motion.css`; update imports

## Open Questions

- Use `site-container` class name vs pure utilities for max-width — decide in R1 (recommend `site-container` for readability)
