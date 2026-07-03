## ADDED Requirements

### Requirement: Tailwind integrated in portfolio layout

The portfolio layout SHALL import `global.css` containing Tailwind v4 alongside existing `tokens.css`.

#### Scenario: Tailwind available in components

- **WHEN** any portfolio page renders
- **THEN** Tailwind utility classes in component markup produce expected styles

### Requirement: Theme bridge from Peachlight Forest tokens

`global.css` SHALL define `@theme inline` mapping design tokens from `tokens.css` to Tailwind theme variables (colors, fonts).

#### Scenario: Semantic color utilities

- **WHEN** a component uses `bg-bg` or `text-fg`
- **THEN** colors match `--bg` and `--fg` from `tokens.css`

### Requirement: CSS layer ordering

Legacy portfolio rules SHALL live in `@layer legacy` (or equivalent) so Tailwind `@layer utilities` overrides them without `!important`.

#### Scenario: Utility overrides legacy layout

- **WHEN** a migrated element has both a legacy class and a conflicting Tailwind utility
- **THEN** the Tailwind utility wins

### Requirement: No visual change in bridge phase

Completing the bridge phase (R0) SHALL NOT alter visible styling compared to pre-refactor state.

#### Scenario: R0 smoke test

- **WHEN** R0 is complete and no component markup has changed
- **THEN** the site looks identical to before R0
