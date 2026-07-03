## ADDED Requirements

### Requirement: Peachlight Forest design tokens

The site SHALL define Peachlight Forest CSS custom properties in `tokens.css`, including background (`#0B1220`), surface, foreground, accent (`#7ED957`), warm accent, glow, typography stacks, spacing scale, and radius tokens migrated from Open Design `:root`.

#### Scenario: Token variables available globally

- **WHEN** portfolio pages load
- **THEN** CSS variables such as `--bg`, `--accent`, `--font-display`, and `--container` resolve to Peachlight Forest values

### Requirement: Portfolio stylesheet parity

The site SHALL include `portfolio.css` with portfolio rules migrated verbatim from Open Design inline styles, including `.forest-panel`, `.hero`, scrollbar styling, handoff classes, and responsive rules without converting them to Tailwind utilities.

#### Scenario: Forest panel styling applied

- **WHEN** a `.forest-panel` element is rendered
- **THEN** it displays the framed panel appearance matching the Open Design reference

### Requirement: Tailwind isolation

Portfolio custom CSS SHALL NOT use Tailwind `@apply` on portfolio-specific selectors during Phase 1. Tailwind remains limited to the existing `global.css` entry.

#### Scenario: No Tailwind utility mix in portfolio selectors

- **WHEN** portfolio CSS is inspected
- **THEN** `.forest-panel`, `.hero`, `.topnav`, and handoff-related selectors do not depend on Tailwind utility classes
