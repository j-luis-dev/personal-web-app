## ADDED Requirements

### Requirement: Form field component styles

Form inputs SHALL be styled via `@layer components` in `global.css` using semantic class names `.input` and `.textarea` that preserve existing `contact-form.ts` selectors.

#### Scenario: Input base styles

- **WHEN** a contact form field is rendered with class `input`
- **THEN** it displays full-width with border, background, padding, and border-radius matching pre-cleanup appearance

#### Scenario: Focus state

- **WHEN** user focuses an `.input` or `.textarea`
- **THEN** border color changes to accent and outline uses accent-soft

#### Scenario: Invalid state

- **WHEN** a `.field` has class `is-invalid`
- **THEN** nested `.input` or `.textarea` shows accent-warm border and `.field-error` is visible

### Requirement: Contact link component styles

Contact links SHALL be styled via `@layer components` as `.contact-link` with hover/focus color transition to accent-hover.

#### Scenario: Contact link layout

- **WHEN** Contact section renders email, phone, LinkedIn, GitHub, or location links
- **THEN** each uses `.contact-link` with inline-flex, gap, and 18px SVG sizing

#### Scenario: Legacy contact-link rule removed

- **WHEN** cleanup is complete
- **THEN** `.contact-link` rules are absent from `portfolio.css`

### Requirement: Form success state component

The form success message SHALL use `@layer components` as `.form-success` hidden by default and visible with `.is-visible`.

#### Scenario: Success hidden until submit

- **WHEN** the contact form has not been successfully submitted
- **THEN** `#form-success` has `display: none` (or equivalent hidden utility via component class)

#### Scenario: Success visible after submit

- **WHEN** `contact-form.ts` adds `.is-visible` to `#form-success`
- **THEN** the success message is displayed with surface background and border

### Requirement: Section band styling via utilities

Sections that previously used `.section-band` SHALL apply equivalent Tailwind utilities (`bg-surface border-y border-border`) directly on the `<section>` element.

#### Scenario: Experience and Contact sections

- **WHEN** Experience or Contact sections render
- **THEN** they use Tailwind surface/border utilities and do not include class `section-band`

### Requirement: Tag hover in components layer

Tag hover styles (border-accent, text-fg) SHALL live in the `@layer components` `.tag` definition in `global.css`, not in unlayered `portfolio.css`.

#### Scenario: Tag hover on skills and project cards

- **WHEN** user hovers a `.tag` element
- **THEN** border and text color update without regression to skills reveal animation
