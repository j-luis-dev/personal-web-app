## ADDED Requirements

### Requirement: Module-by-module migration

CSS layout and typography SHALL be migrated one component group at a time in order: Footer, layout primitives, TopNav, Experience, About, Work, Contact, Hero copy layout.

#### Scenario: Footer migrated first

- **WHEN** R1 Footer migration completes
- **THEN** Footer uses Tailwind for layout and migrated rules are removed from `portfolio.css`

### Requirement: Legacy semantic classes preserved for motion

Classes used by `portfolio-motion.ts`, scroll handoffs, and keyframe animations SHALL NOT be renamed or removed during migration.

#### Scenario: Reveal still works

- **WHEN** a migrated section retains `.reveal` class
- **THEN** IntersectionObserver scroll reveals behave as before

### Requirement: Forest panel decoration preserved

The `.forest-panel` class and its `::before` pseudo-element styling SHALL remain in CSS even when child layout migrates to Tailwind.

#### Scenario: Panel frame visible after Work migration

- **WHEN** Work cards use Tailwind for internal spacing
- **THEN** `.forest-panel` decorative frame still renders

### Requirement: Container name collision resolved

The custom `.container` class SHALL be renamed or replaced before wide Tailwind adoption to avoid conflict with Tailwind's built-in container.

#### Scenario: No container width conflict

- **WHEN** Tailwind is active across the site
- **THEN** site max-width layout matches pre-migration `1120px` container behavior

### Requirement: Incremental CSS deletion

Each migration task SHALL remove CSS rules from `portfolio.css` that are fully replaced by Tailwind utilities for that module.

#### Scenario: portfolio.css shrinks

- **WHEN** R3 completes (Experience + About)
- **THEN** `portfolio.css` line count is lower than pre-refactor baseline

### Requirement: Visual parity per module

Each module migration SHALL preserve visual appearance (spacing, colors, typography, responsive behavior) compared to pre-migration.

#### Scenario: No regression after About migration

- **WHEN** comparing About section before and after R3
- **THEN** layout, photo frame, and skill tags appear identical

### Requirement: Final CSS split

After all modules migrate, remaining motion and decoration rules SHALL be moved to `portfolio-motion.css` and `portfolio.css` SHALL be removed or reduced to imports only.

#### Scenario: Motion CSS isolated

- **WHEN** refactor completes (R6)
- **THEN** keyframes, handoffs, hero ambient, and reveal rules live in `portfolio-motion.css`

### Requirement: No motion system replacement

This migration SHALL NOT introduce `@astroanimate/core`, GSAP, or new animation libraries to replace existing custom motion.

#### Scenario: No new animation dependencies

- **WHEN** CSS refactor is complete
- **THEN** `package.json` has no new animation libraries added for this change
