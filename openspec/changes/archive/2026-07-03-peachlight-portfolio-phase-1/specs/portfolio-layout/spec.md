## ADDED Requirements

### Requirement: Portfolio root layout

The site SHALL provide a `PortfolioLayout.astro` that wraps all portfolio pages with Peachlight Forest document shell, Spanish document language, portfolio meta tags, Google Fonts (Fraunces, DM Sans, JetBrains Mono), portfolio stylesheets, scroll-progress bar markup, and a content slot.

#### Scenario: Layout renders document shell

- **WHEN** any page uses `PortfolioLayout`
- **THEN** the output HTML has `lang="es"`, portfolio title/description meta, font links, `#scroll-progress` element, and imported `tokens.css` plus `portfolio.css`

### Requirement: Homepage composition

The root route (`/`) SHALL compose the portfolio from section components in order: TopNav, Hero, Work, Experience, About, Contact, and Footer inside `PortfolioLayout`.

#### Scenario: Homepage section order

- **WHEN** a user navigates to `/`
- **THEN** sections appear in order Hero → Work → Experience → About → Contact with TopNav above and Footer below

### Requirement: Starter homepage removal

After visual parity is confirmed, the Astro starter welcome page SHALL be removed from the production homepage.

#### Scenario: Welcome component not rendered

- **WHEN** a user loads `/` after Phase 1 completion
- **THEN** `Welcome.astro` content is not displayed and `index.astro` renders only portfolio components
