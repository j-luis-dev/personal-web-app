## Why

The portfolio currently lives as a monolithic Open Design HTML artifact (~1,480 lines) outside the production Astro repo. Phase 1 ports it into `personal-web-app` with 1:1 visual and behavioral parity so the site can be versioned, built, and deployed on the native stack (Astro 7, TypeScript, Vite) without losing Peachlight Forest design, motion, or the 3D hero.

## What Changes

- Replace the Astro starter homepage (`Welcome.astro` + default `index.astro`) with the Peachlight Forest portfolio
- Extract inline CSS from Open Design `index.html` into `tokens.css` and `portfolio.css`
- Add `PortfolioLayout.astro` and seven section components (TopNav, Hero, Work, Experience, About, Contact, Footer)
- Port `hero-scene.js` to `hero-scene.ts` using npm `three` and `/models/Meshy_AI_Pet.glb`
- Port inline motion scripts to `portfolio-motion.ts` and `contact-form.ts` (client-side validation only)
- **BREAKING:** Default Astro welcome page removed from `/`; root route becomes the portfolio
- Content remains hardcoded in markup (typed `portfolio.ts` is Phase 2, out of scope here)
- GLB compression, i18n, form backend, and Tailwind refactor remain deferred to later phases

## Capabilities

### New Capabilities

- `portfolio-layout`: Root layout, page composition, fonts/meta, scroll-progress shell, replacement of starter homepage
- `portfolio-sections`: Section components with markup parity for Hero, Work, Experience, About, Contact, nav, and footer
- `portfolio-styles`: Peachlight Forest design tokens and portfolio CSS migrated verbatim from Open Design
- `hero-3d-scene`: Client-only Three.js hero with GLB model, particles, lighting, and OrbitControls
- `portfolio-client-motion`: Load intro, scroll reveals, section handoffs, nav scroll-spy, ambient pause, and contact form validation

### Modified Capabilities

- _(none — no existing specs in `openspec/specs/`)_

## Impact

- **Pages:** `src/pages/index.astro` rewritten; `src/components/Welcome.astro` removed after parity confirmed
- **Layouts:** New `PortfolioLayout.astro`; existing `Layout.astro` unused by homepage
- **Styles:** New `tokens.css`, `portfolio.css`; Tailwind `global.css` unchanged
- **Scripts:** New `hero-scene.ts`, `portfolio-motion.ts`, `contact-form.ts` (client-only, no SSR)
- **Assets:** `Meshy_AI_Pet.glb` in `public/models/`; `Iam.png` in `src/assets/`
- **Dependencies:** Add `three` and `@types/three`
- **Source reference:** Open Design project `5834959c-c074-45b8-8b03-f325121d9d1e`
