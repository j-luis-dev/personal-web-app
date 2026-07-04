## Why

The portfolio currently relies solely on Playwright E2E tests, which require a full build, preview server, and browser for every run. Pure TypeScript logic in `src/lib/` and client scripts has no fast unit-test layer, making regressions in SEO schema helpers, DOM type guards, and motion math harder to catch during development and CI.

## What Changes

- Add Vitest with Astro's `getViteConfig()` so tests reuse the project's Vite/Tailwind/Astro settings
- Introduce unit tests for high-signal pure logic: `buildPersonSchema`, `buildWebSiteSchema`, `client-dom` type guards, and extracted motion helpers
- Split npm scripts: `test:unit` (Vitest), `test:e2e` (Playwright), `test` (both)
- Add a fast Vitest job to CI alongside the existing Playwright workflow
- Keep all existing Playwright E2E tests unchanged — Vitest complements, does not replace, browser testing

## Capabilities

### New Capabilities

- `vitest-unit-testing`: Vitest tooling, unit test conventions, initial test suite, and CI integration for the Astro portfolio

### Modified Capabilities

- _(none — new testing layer; existing Playwright E2E behavior unchanged)_

## Impact

- **New:** `vitest.config.ts`, `src/**/*.test.ts` unit test files, Vitest devDependencies
- **Modified:** `package.json` scripts, `.github/workflows/` (new or extended CI job), optionally `AGENTS.md` testing section
- **Optional refactor:** Extract pure helpers from `portfolio-motion.ts` and `contact-form.ts` for testability without changing runtime behavior
- **Unchanged:** Playwright config, E2E test files, production build output, site behavior
