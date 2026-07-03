## ADDED Requirements

### Requirement: Page load intro animation

The site SHALL run a page fade-in and hero stagger sequence (headline → subtitle → CTAs → 3D) using the unified easing `cubic-bezier(0.23, 1, 0.32, 1)`, with text readable before the 3D reveal (~920ms delay).

#### Scenario: Load intro timing

- **WHEN** the homepage loads with motion enabled
- **THEN** body opacity animates in ~400ms and hero text appears before the 3D canvas reveal

### Requirement: Scroll reveals one-shot

Elements with `.reveal` and `.reveal-stagger` SHALL become visible once via IntersectionObserver and MUST NOT re-animate when scrolling back up.

#### Scenario: Reveal fires once

- **WHEN** a reveal target enters the viewport and later leaves
- **THEN** it retains `is-visible` and is not re-observed

### Requirement: Section scroll handoffs

Scrolling SHALL drive CSS custom properties for progress and section transitions: `--scroll-progress`, `--hero-work-bridge`, `--work-wake`, `--about-breathe`, and `--contact-settle`, batched in a single `requestAnimationFrame` per scroll frame.

#### Scenario: Hero to Work handoff

- **WHEN** the user scrolls from Hero toward Work
- **THEN** perceptible gradient bridge and work wake effects activate via the handoff CSS variables

### Requirement: Navigation scroll-spy

TopNav links SHALL highlight the active section based on scroll position, with Contact marked active when the user reaches the bottom of the page.

#### Scenario: Contact active at page bottom

- **WHEN** the user scrolls to the bottom of the page
- **THEN** the Contact nav link receives the active class

### Requirement: Hero ambient pause

When the Hero section leaves the viewport, ambient orbs SHALL pause via an IntersectionObserver toggling `is-paused` on the ambient container.

#### Scenario: Orbs pause off-screen

- **WHEN** Hero is not intersecting the viewport
- **THEN** the hero ambient layer has class `is-paused`

### Requirement: Contact form client validation

The contact form SHALL validate required fields on submit and blur, display field errors, and show a success state on valid submit without sending data to a backend.

#### Scenario: Invalid submit blocked

- **WHEN** a user submits the form with empty required fields
- **THEN** validation errors appear and the success state is not shown

#### Scenario: Valid submit shows success

- **WHEN** a user submits the form with all required fields valid
- **THEN** the submit button disables and the success message becomes visible

### Requirement: Reduced motion fallback

When `prefers-reduced-motion: reduce` is set, motion animations SHALL resolve immediately to their final visible state while scroll-spy navigation MUST remain functional.

#### Scenario: Reduced motion immediate visibility

- **WHEN** reduced motion is preferred
- **THEN** reveal targets have `is-visible` immediately and handoff variables are not animated
