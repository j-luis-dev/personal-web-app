## ADDED Requirements

### Requirement: Centralized portfolio content module

The site SHALL expose all user-facing portfolio copy and structured lists from `src/data/portfolio.ts` with TypeScript types.

#### Scenario: Single file content update

- **WHEN** a developer changes a project description in `portfolio.ts`
- **THEN** the Work section reflects the new description after rebuild without editing `Work.astro` markup

### Requirement: Site and document metadata

`portfolio.ts` SHALL export `site` (name lines, role, tagline, eyebrow, location, title, description) consumed by `Hero.astro` and `PortfolioLayout.astro`.

#### Scenario: Document title from data

- **WHEN** the homepage is built
- **THEN** the `<title>` and meta description match values from `site` in `portfolio.ts`

### Requirement: Navigation content from data

`portfolio.ts` SHALL export `nav` with logo label and section links consumed by `TopNav.astro`.

#### Scenario: Nav links match data

- **WHEN** TopNav renders
- **THEN** link labels and `href` anchors match the `nav` export

### Requirement: Section headings from data

`portfolio.ts` SHALL export `sections` with eyebrow, heading, and optional lead text for work, experience, about, and contact sections.

#### Scenario: Work section heading from data

- **WHEN** the Work section renders
- **THEN** eyebrow and h2 text match `sections.work`

### Requirement: Projects list drives Work cards

`portfolio.ts` SHALL export `projects` array driving `Work.astro` card iteration. Project SVG thumbnails MAY remain in the component keyed by `project.id`.

#### Scenario: Four project cards from array

- **WHEN** Work section renders
- **THEN** the number and order of cards match the `projects` array

### Requirement: Experience list with timeline and compact entries

`portfolio.ts` SHALL export `experience` array supporting timeline rows and a compact multi-employer row matching current site structure.

#### Scenario: Compact row renders multiple employers

- **WHEN** Experience section renders the compact entry
- **THEN** Appmosphera and DWIT appear in one row as today

### Requirement: About content from data

`portfolio.ts` SHALL export `about` with bio, education, languages, skills array, and portrait alt text. Portrait file import remains in `About.astro`.

#### Scenario: Skills from array

- **WHEN** About section renders skills
- **THEN** skill tags are generated from `about.skills` in order

### Requirement: Contact and footer from data

`portfolio.ts` SHALL export `contact` (links, success message) and `footer` (copyright, meta line) consumed by `Contact.astro` and `Footer.astro`.

#### Scenario: Contact email from data

- **WHEN** Contact section renders
- **THEN** the mailto link and visible email match `contact.email`

### Requirement: Visual parity preserved

Refactoring to data SHALL NOT change visible copy, link URLs, section order, or CSS class structure compared to the Phase 1 site.

#### Scenario: No copy regression

- **WHEN** comparing Phase 1 and Phase 2 builds side by side
- **THEN** all visible text and links are identical

### Requirement: CV source file not parsed at runtime

`src/data/cv-source.md` SHALL remain a reference document and MUST NOT be imported or parsed by application code in Phase 2.

#### Scenario: No CV markdown import

- **WHEN** the site builds
- **THEN** no module imports `cv-source.md` for content rendering
