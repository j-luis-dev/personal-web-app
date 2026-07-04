## 1. Vitest setup

- [x] 1.1 Add `vitest` and `happy-dom` as devDependencies
- [x] 1.2 Create `vitest.config.ts` using Astro `getViteConfig()` with `include: ['src/**/*.test.ts']` and `environment: 'happy-dom'`
- [x] 1.3 Update `package.json` scripts: `test:unit`, `test:unit:watch`, `test:e2e`, and `test` (unit then e2e)

## 2. Unit tests

- [x] 2.1 Add `src/lib/seo.test.ts` covering `buildPersonSchema` and `buildWebSiteSchema` field shape and values
- [x] 2.2 Add `src/scripts/client-dom.test.ts` covering `isHTMLElement`, `isFormFieldInput`, and `isSubmitButton`
- [x] 2.3 Extract `clampHandoff` and `smoothHandoff` to `src/lib/motion.ts` and import them in `portfolio-motion.ts`
- [x] 2.4 Add `src/lib/motion.test.ts` covering clamp boundaries and smooth-step endpoints

## 3. CI and docs

- [x] 3.1 Add `.github/workflows/vitest.yml` running `pnpm test:unit` on push/PR to `main` and `master`
- [x] 3.2 Update `AGENTS.md` testing section to document Vitest unit tests alongside Playwright E2E

## 4. Validation

- [x] 4.1 Run `pnpm test:unit` — all unit tests pass
- [x] 4.2 Run `pnpm test:e2e` — existing Playwright specs pass unchanged
- [x] 4.3 Run `pnpm test` — full suite passes locally
