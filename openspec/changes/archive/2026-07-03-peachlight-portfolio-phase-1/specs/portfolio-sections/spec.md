## ADDED Requirements

### Requirement: Section markup parity

Each portfolio section SHALL preserve the HTML structure, IDs, and `data-od-id` attributes from the Open Design source so CSS selectors and client scripts continue to work.

#### Scenario: Critical section IDs present

- **WHEN** the homepage is rendered
- **THEN** elements with IDs `work`, `experience`, `about`, and `contact` exist and Hero retains `data-od-id="hero"`

### Requirement: Work section displays projects

The Work section SHALL render project cards for MDS, TV Azteca, OCC App, and ASU with `.forest-panel` styling and hardcoded copy matching the Open Design source.

#### Scenario: Work grid visible

- **WHEN** a user scrolls to `#work`
- **THEN** four project cards are displayed in the established grid layout with tags and descriptions

### Requirement: Experience section displays employment timeline

The Experience section SHALL remain a separate section (`#experience`) with a chronological timeline of Redarbor, Kode Vox, Webtronic, and compact Appmosphera/DWIT entries — not merged into Work or About.

#### Scenario: Experience timeline rows

- **WHEN** a user scrolls to `#experience`
- **THEN** timeline rows with dates, company names, roles, and details are visible

### Requirement: About section displays portrait and profile

The About section SHALL display the portrait from `src/assets/Iam.png`, bio, education, languages, and skill tags with existing Peachlight Forest styling.

#### Scenario: About portrait loads

- **WHEN** the About section is in view
- **THEN** the portrait image renders with alt text and `.about-photo` styling

### Requirement: Contact section with client-side form

The Contact section SHALL display contact links (email, phone, LinkedIn, GitHub) and a contact form with field markup and IDs required by the client validation script. Form submission SHALL NOT call an external backend in Phase 1.

#### Scenario: Contact form markup ready for validation

- **WHEN** the Contact section is rendered
- **THEN** form fields, submit button, and success message container exist with the same IDs/classes as the Open Design source

### Requirement: Top navigation links

TopNav SHALL link to in-page anchors for Work, Experience, About, and Contact and reflect active state via scroll-spy behavior driven by client motion script.

#### Scenario: Nav anchor targets exist

- **WHEN** a user clicks a TopNav link
- **THEN** the page scrolls to the corresponding section ID
