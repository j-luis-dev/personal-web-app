## ADDED Requirements

### Requirement: Vitest configured with Astro Vite settings

The project SHALL provide a `vitest.config.ts` that uses Astro's `getViteConfig()` helper so unit tests inherit the same Vite, Tailwind, and Astro configuration as the application build.

#### Scenario: Unit test runner starts without custom transpiler config

- **WHEN** a developer runs `pnpm test:unit`
- **THEN** Vitest executes using the Astro-derived Vite config without additional Babel or ts-jest setup

### Requirement: Unit and E2E test scripts are separated

`package.json` SHALL expose distinct scripts for unit tests and E2E tests, plus a combined entry point.

#### Scenario: Run unit tests only

- **WHEN** a developer runs `pnpm test:unit`
- **THEN** only Vitest unit tests execute and Playwright is not invoked

#### Scenario: Run all tests

- **WHEN** a developer runs `pnpm test`
- **THEN** unit tests run first, followed by Playwright E2E tests

### Requirement: SEO schema helpers have unit tests

Pure functions in `src/lib/seo.ts` (`buildPersonSchema`, `buildWebSiteSchema`) SHALL have Vitest coverage asserting JSON-LD shape and key field values.

#### Scenario: Person schema includes required fields

- **WHEN** `buildPersonSchema` is called with a canonical URL and image source
- **THEN** the returned object includes `@type: Person`, name, jobTitle, url, image, and sameAs links

#### Scenario: WebSite schema includes site metadata

- **WHEN** `buildWebSiteSchema` is called with a canonical URL
- **THEN** the returned object includes `@type: WebSite`, name, description, url, and `inLanguage: en`

### Requirement: DOM type guards have unit tests

Exported type guard functions in `src/scripts/client-dom.ts` SHALL have Vitest coverage using a DOM test environment (`happy-dom` or equivalent).

#### Scenario: HTMLElement guard narrows correctly

- **WHEN** `isHTMLElement` is called with an `HTMLElement` and with a non-HTMLElement node
- **THEN** it returns `true` for the element and `false` otherwise

### Requirement: Motion math helpers are testable

Scroll handoff math used by `portfolio-motion.ts` SHALL be available as pure exported functions (in the motion module or a shared lib) with Vitest coverage for boundary and interpolation behavior.

#### Scenario: Clamp respects min and max

- **WHEN** the clamp helper receives values below the minimum, above the maximum, and within range
- **THEN** it returns the minimum, maximum, and input value respectively

#### Scenario: Smooth handoff endpoints

- **WHEN** the smooth-step helper receives `0` and `1`
- **THEN** it returns `0` and `1` respectively

### Requirement: CI runs unit tests on push and pull request

GitHub Actions SHALL run Vitest on the same branch triggers as Playwright (`main`, `master`, pull requests) as a separate fast job or step before E2E tests.

#### Scenario: CI unit test job passes on clean branch

- **WHEN** a pull request is opened against `main`
- **THEN** the Vitest job completes successfully when all unit tests pass

### Requirement: Playwright E2E tests remain unchanged

Existing Playwright tests in `tests/` and `playwright.config.ts` SHALL continue to run without modification to test assertions or configuration as part of this change.

#### Scenario: E2E suite still validates homepage

- **WHEN** `pnpm test:e2e` runs after Vitest is added
- **THEN** all existing Playwright specs pass with the same expectations as before
