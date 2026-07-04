## ADDED Requirements

### Requirement: Unused portfolio CSS rules removed

The system SHALL delete CSS rules from `portfolio.css` that have no references in `src/components/` or `src/scripts/`.

#### Scenario: Dead layout utilities removed

- **WHEN** the cleanup is complete
- **THEN** `.stack`, `.row`, `.pill`, `.card-flat`, `.btn-ghost`, and `.card:not(.forest-panel)` rules are absent from `portfolio.css`

#### Scenario: Unused heading rules removed

- **WHEN** components use Tailwind for h2/h3 styling
- **THEN** `.h2` and `.h3` selector blocks are absent from `portfolio.css`

### Requirement: Single button component system

All interactive buttons in portfolio components SHALL use `btn-base` with variant classes (`btn-accent-fill` or border/ghost utilities). Legacy `.btn` and `.btn-primary` classes SHALL NOT appear in component markup or `portfolio.css`.

#### Scenario: Contact submit uses unified button

- **WHEN** the Contact form submit button is rendered
- **THEN** it uses `btn-base btn-accent-fill` (or equivalent variant) matching Hero CTA styling

#### Scenario: Legacy button CSS removed

- **WHEN** the cleanup is complete
- **THEN** `.btn`, `.btn-primary`, and `.btn:active` rules are absent from `portfolio.css`

### Requirement: Consistent forest-panel padding

Panel padding SHALL use Tailwind clamp utilities inline on components. The `.forest-panel--pad` modifier class SHALL NOT be used in markup or CSS.

#### Scenario: Experience panels use inline padding

- **WHEN** Experience timeline rows are rendered
- **THEN** padding is applied via Tailwind utilities (e.g. `p-[clamp(...)]`) not `forest-panel--pad`

### Requirement: portfolio.css size target

After cleanup, `portfolio.css` SHALL contain only permanent structural rules (reset, topnav, forest-panel shell, hero shell, mascot-stage, about-photo base, canvas) and SHALL NOT exceed 90 lines.

#### Scenario: Line count within target

- **WHEN** cleanup tasks R7.1–R7.6 are complete
- **THEN** `portfolio.css` is at most 90 lines

#### Scenario: Motion CSS unchanged

- **WHEN** cleanup is complete
- **THEN** `portfolio-motion.css` line count is unchanged from pre-cleanup baseline
