## Context

The Peachlight Forest portfolio was built iteratively in Open Design as a single `index.html` (~1,482 lines) with inline CSS, a separate `hero-scene.js`, and client-side motion scripts. The destination repo `personal-web-app` is an Astro 7 starter with React and Tailwind 4 configured but only renders `Welcome.astro` today.

Phase 1 scope is **visual and behavioral parity only** — no typed content layer (`portfolio.ts`), no i18n, no form backend, no GLB optimization. Decisions are documented in `migrate-astro-plan.md` at repo root.

**Open Design source:** `/Users/jose/Documents/proyects/open-design/.od/projects/5834959c-c074-45b8-8b03-f325121d9d1e`

## Goals / Non-Goals

**Goals:**

- Render the same portfolio at `/` using Astro components and extracted CSS/TS modules
- Preserve Peachlight Forest tokens, motion handoffs, scroll reveals, 3D hero, and contact form UX
- Pass `pnpm dev`, `pnpm build`, and `pnpm preview` without SSR/WebGL errors
- Keep Work, Experience, and About as three distinct sections

**Non-Goals:**

- `portfolio.ts` data layer (Phase 2)
- i18n ES/EN routing (Phase 3)
- Form backend (Formspree/Resend) (Phase 3)
- GLB Draco compression, Git LFS, or CDN hosting (Phase 4)
- Rewriting portfolio CSS to Tailwind utilities
- Replacing custom motion with `@astroanimate/core` or GSAP
- Astro `<Image />` optimization for portrait (Phase 3)

## Decisions

### 1. CSS: verbatim extraction, not Tailwind migration

**Decision:** Split Open Design inline `<style>` into `tokens.css` (`:root` block) and `portfolio.css` (everything else). Import both in `PortfolioLayout.astro`.

**Rationale:** ~900 lines of polished CSS with handoff variables and `.forest-panel` polish. Rewriting to Tailwind risks specificity regressions and delays parity.

**Alternative rejected:** Utility-first Tailwind rewrite — high risk, low value for Phase 1.

### 2. React: Astro-only for Phase 1

**Decision:** No React islands. Pure `.astro` components with client `<script>` tags for Three.js and motion.

**Rationale:** Source has no React. Form validation is ~50 lines of vanilla JS.

**Alternative rejected:** React island for contact form — unnecessary dependency surface.

### 3. Three.js via npm, client scripts only

**Decision:** `pnpm add three @types/three`. Port `hero-scene.js` → `hero-scene.ts`. Load via `<script>` in `Hero.astro`, never in frontmatter.

**Rationale:** Vite bundles addons; eliminates CDN importmap. Astro `<script>` defaults to client-only, preventing SSR crashes.

**Alternative rejected:** CDN importmap — works in OD but inconsistent with Vite bundling and offline dev.

### 4. GLB in `public/models/`

**Decision:** Serve `Meshy_AI_Pet.glb` at `/models/Meshy_AI_Pet.glb` from `public/models/`. Move from current `src/assets/` location.

**Rationale:** Static assets >10MB should not pass through Vite's asset pipeline. `public/` serves files as-is.

**Alternative deferred:** CDN URL via env — Phase 4.

### 5. Preserve `data-od-id` attributes

**Decision:** Keep `data-od-id` on Hero, ambient layers, and motion targets alongside standard `id` attributes.

**Rationale:** Motion script in OD queries `[data-od-id="hero"]`. Renaming breaks handoffs without benefit in Phase 1.

### 6. Motion split: `portfolio-motion.ts` + `contact-form.ts`

**Decision:** Extract inline `<script>` from `index.html` into two TS modules. `PortfolioLayout` loads `portfolio-motion.ts`; contact validation can live in the same file or a separate module imported from it.

**Rationale:** Matches plan structure; keeps form logic testable and isolated.

### 7. Content hardcoded in components

**Decision:** Copy markup verbatim into section components. No `portfolio.ts` until Phase 2.

**Rationale:** Separates "does it look right?" from "is data structured?" — reduces Phase 1 failure modes.

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| GLB 30 MB slows git/deploy | Accepted for Phase 1; optimize in Phase 4 |
| CSS regression during extraction | Copy verbatim first; visual diff against OD |
| Three.js SSR crash | Never import hero-scene in frontmatter |
| Tailwind/global.css conflicts | Portfolio styles in separate files; no `@apply` on portfolio selectors |
| Component split breaks handoff IO | Preserve section IDs and `data-od-id`; smoke test scroll handoffs |
| Missing `Iam.png` blocks About | Copy from OD in Fase 0 prep task |

## Migration Plan

1. **Prep (Fase 0):** Branch, move GLB, copy assets, install `three`
2. **Styles:** Extract CSS files
3. **Layout + components:** Build from OD markup bottom-up (Hero last among sections due to SVG grain + canvas)
4. **Scripts:** Port hero-scene and motion
5. **Validate:** `pnpm dev` → visual checklist §7 of migrate plan → `pnpm build` → `pnpm preview`
6. **Cleanup:** Remove `Welcome.astro` and starter references
7. **Rollback:** Revert branch; starter page restored from git

## Open Questions

- Deploy target (Vercel/Netlify/CF Pages) — affects GLB caching strategy in Phase 4 only
- Whether to keep unused `Layout.astro` or remove in cleanup (low impact; can delete or leave)
