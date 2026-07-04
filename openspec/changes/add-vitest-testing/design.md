## Context

The Peachlight portfolio (Astro 7, Tailwind v4, Three.js hero) currently has four Playwright E2E tests in `tests/example.spec.ts`. They validate homepage title, skip link, contact form validation, and nav scroll — all requiring `pnpm build && pnpm preview` plus Chromium.

Pure TypeScript in `src/lib/seo.ts` and `src/scripts/client-dom.ts` has no unit coverage. Motion math in `portfolio-motion.ts` (`clampHandoff`, `smoothHandoff`) is private and untested. Astro's official testing guide recommends Vitest with `getViteConfig()` for unit tests alongside browser E2E.

## Goals / Non-Goals

**Goals:**

- Fast, CI-friendly unit test layer via Vitest
- Reuse Astro/Vite config through `getViteConfig()`
- Cover high-signal pure logic: SEO schemas, DOM type guards, motion math
- Clear script split: `test:unit`, `test:e2e`, `test`
- CI runs Vitest before or alongside Playwright

**Non-Goals:**

- Replace or reduce Playwright E2E coverage
- Test Three.js / `hero-scene.ts` with Vitest
- Astro Container API component rendering tests (experimental; defer to a follow-up)
- Test `getOgImageSrc` (depends on `astro:assets`; mock complexity not worth it now)
- Refactor contact form validation beyond minimal extraction if E2E already covers UX
- Content collection schema tests (no `content.config.ts` in repo yet)

## Decisions

### 1. Vitest config via Astro `getViteConfig()`

**Decision:** Create `vitest.config.ts` using:

```ts
import { getViteConfig } from 'astro/config';

export default getViteConfig({
  test: {
    include: ['src/**/*.test.ts'],
    environment: 'happy-dom',
  },
});
```

**Rationale:** Official Astro pattern; inherits Tailwind Vite plugin and ESM/TS settings. No duplicate Vite config.

**Alternative considered:** Standalone `vitest.config.ts` without Astro helper — rejected because `astro:assets` and path aliases would break if we add image-related tests later.

### 2. DOM environment: `happy-dom`

**Decision:** Use `happy-dom` as the Vitest test environment for `client-dom.ts` tests.

**Rationale:** Lighter and faster than `jsdom`; sufficient for `instanceof` checks on DOM nodes.

**Alternative considered:** `node` environment only — rejected for DOM type guard tests.

### 3. Test file colocation

**Decision:** Place tests next to source as `*.test.ts` under `src/` (e.g. `src/lib/seo.test.ts`).

**Rationale:** Matches Astro Vitest starter; easy to find when editing modules. E2E stays in `tests/`.

**Alternative considered:** Top-level `test/` directory — rejected to keep unit tests colocated with implementation.

### 4. Extract motion helpers for testability

**Decision:** Move `clampHandoff` and `smoothHandoff` from `portfolio-motion.ts` to `src/lib/motion.ts` (or export from the same file) and import them in the motion script.

**Rationale:** Pure functions with no DOM dependency; trivial to unit test. Zero runtime behavior change.

**Alternative considered:** Test via Playwright only — rejected; unit tests give instant feedback on math regressions.

### 5. npm scripts

**Decision:**

| Script | Command |
|--------|---------|
| `test:unit` | `vitest run` |
| `test:unit:watch` | `vitest` |
| `test:e2e` | `playwright test` |
| `test` | `pnpm test:unit && pnpm test:e2e` |

**Rationale:** Preserves existing `pnpm test` as full suite; allows fast iteration with `test:unit:watch`.

**Alternative considered:** Rename `test` to `test:e2e` only — rejected; would break muscle memory; combined `test` is better default for CI parity.

### 6. CI: separate Vitest job

**Decision:** Add `.github/workflows/vitest.yml` (or extend `playwright.yml` with a `unit` job that runs first). Prefer a dedicated workflow file for clarity and faster parallel CI.

**Rationale:** Vitest completes in seconds without browser install; fail-fast on logic bugs before expensive Playwright run.

**Alternative considered:** Single job running both sequentially — acceptable but parallel jobs reduce total wall time.

### 7. Dependencies

**Decision:** Add `vitest` and `happy-dom` as devDependencies. No `@vitest/coverage-v8` in initial scope.

**Rationale:** Minimal footprint; coverage can be added later if needed.

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| `contact-form.ts` runs `initContactForm()` at import | Do not unit test the module init path in phase 1; E2E covers form UX. If needed later, guard init with `import.meta.vitest` |
| `getOgImageSrc` untested | Acceptable non-goal; schema builders cover SEO contract |
| Duplicate coverage (form validation in E2E + potential unit) | Start with SEO + motion + type guards only; avoid redundant form unit tests unless validation is extracted |
| Astro Container API churn | Explicitly out of scope for this change |

## Migration Plan

1. Add Vitest config and devDependencies
2. Add unit tests and optional motion helper extraction
3. Update `package.json` scripts
4. Add CI workflow
5. Update `AGENTS.md` testing table (optional, during apply)
6. Verify `pnpm test` passes locally and in CI

**Rollback:** Remove `vitest.config.ts`, test files, devDependencies, and CI workflow; restore `test` script to `playwright test` only.

## Open Questions

- _(none blocking — reasonable defaults chosen above)_
