## 0. Preparation

- [x] 0.1 Create branch `feat/peachlight-portfolio-migration`
- [x] 0.2 Move `src/assets/Meshy_AI_Pet.glb` to `public/models/Meshy_AI_Pet.glb`
- [x] 0.3 Copy `Iam.png` from Open Design to `src/assets/Iam.png`
- [x] 0.4 Copy `CV-Jimenez Vazquez Jose Luis.md` to `src/data/cv-source.md` (reference only; not wired in Phase 1)
- [x] 0.5 Run `pnpm add three` and `pnpm add -D @types/three`
- [x] 0.6 Verify `pnpm dev` starts cleanly before code changes

## 1. Styles

- [x] 1.1 Extract `:root` block from OD `index.html` into `src/styles/tokens.css`
- [x] 1.2 Extract remaining `<style>` rules into `src/styles/portfolio.css`
- [x] 1.3 Confirm critical classes preserved: `.forest-panel`, `.hero`, `.reveal`, handoff classes, scrollbar rules

## 2. Layout

- [x] 2.1 Create `src/layouts/PortfolioLayout.astro` with `lang="es"`, meta, fonts, `#scroll-progress`, style imports, and slot
- [x] 2.2 Wire `portfolio-motion.ts` script load at end of layout body

## 3. Section components

- [x] 3.1 Create `src/components/TopNav.astro` from OD header markup
- [x] 3.2 Create `src/components/Hero.astro` with ambient orbs, SVG grain filter, hero copy, and `#hero-3d-canvas`
- [x] 3.3 Create `src/components/Work.astro` with `#work` and four project cards
- [x] 3.4 Create `src/components/Experience.astro` with `#experience` timeline (separate from Work/About)
- [x] 3.5 Create `src/components/About.astro` with portrait import from `src/assets/Iam.png`
- [x] 3.6 Create `src/components/Contact.astro` with links and form markup (client validation only)
- [x] 3.7 Create `src/components/Footer.astro` from OD footer markup
- [x] 3.8 Rewrite `src/pages/index.astro` to compose all sections inside `PortfolioLayout`

## 4. Client scripts

- [x] 4.1 Port `hero-scene.js` to `src/scripts/hero-scene.ts` with npm Three imports and `MODEL_URL = '/models/Meshy_AI_Pet.glb'`
- [x] 4.2 Add client `<script>` in `Hero.astro` importing hero-scene (not in frontmatter)
- [x] 4.3 Port inline motion from OD `index.html` to `src/scripts/portfolio-motion.ts` (intro, reveals, nav spy, handoffs, ambient pause)
- [x] 4.4 Port contact form validation to `src/scripts/contact-form.ts` (or integrate into portfolio-motion)
- [x] 4.5 Verify `prefers-reduced-motion` paths for motion and 3D particles

## 5. Validation

- [x] 5.1 Run `pnpm dev` — fix broken asset paths and imports
- [ ] 5.2 Visual check: Hero fullscreen, GLB + particles, load intro timing, scroll reveals one-shot
- [ ] 5.3 Visual check: handoffs Hero→Work→About→Contact, nav Contact active at bottom
- [ ] 5.4 Visual check: About photo, skill tag hover, contact form validation + success state
- [ ] 5.5 Responsive check: no horizontal scroll 360px–1920px
- [x] 5.6 Run `pnpm build` and `pnpm preview` — confirm GLB and assets resolve in production
- [x] 5.7 Confirm no SSR/hydration errors in browser console

## 6. Cleanup

- [ ] 6.1 Remove `src/components/Welcome.astro`
- [ ] 6.2 Remove any unused starter imports or references
