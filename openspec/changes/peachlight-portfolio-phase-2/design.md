## Context

Phase 1 is complete: Peachlight Forest portfolio renders at `/` with hardcoded content. `cv-source.md` exists as a human-readable CV but contains **more** entries than the portfolio displays (e.g. Fraktalweb, Freelancer, Redarbor component library as separate project). The live site intentionally shows a curated subset.

`About.astro` now uses `Iam.webp` (not `Iam.png` from the original plan).

## Goals / Non-Goals

**Goals:**

- Single typed source for all user-visible strings and structured lists
- Zero visual/copy regression vs current Phase 1 site
- Edit portfolio content by changing `portfolio.ts` only

**Non-Goals:**

- Auto-sync or parse `cv-source.md` at build time
- Add CV entries not currently on the site
- i18n, Content Collections, Astro `<Image />`, form backend (Phase 3)
- Move project SVG thumbnails into data (stay in `Work.astro` keyed by `project.id`)
- Change CSS, motion, or component structure beyond `{data.map(...)}` loops
- Create a separate `portfolio.types.ts` unless `portfolio.ts` exceeds ~200 lines

## Decisions

### 1. Population source: live site, not CV file

**Decision:** Copy strings from current components into `portfolio.ts`. Use `cv-source.md` only as a human reference when manually updating content later.

**Rationale:** CV ≠ portfolio layout. Auto-import would change visible copy and scope.

### 2. Expanded data model (gap fix vs original plan)

**Decision:** Model all content touchpoints, not only Work/Experience/About/Contact:

| Export | Feeds |
|--------|--------|
| `site` | Hero name lines, role, tagline, eyebrow, location, document title/description |
| `nav` | TopNav links and logo label |
| `sections` | Eyebrow + heading per section (work, experience, about, contact) + contact lead |
| `projects` | Work cards |
| `experience` | Timeline rows + compact row |
| `about` | Bio, education, languages, skills[], portrait alt |
| `contact` | Links + form success message |
| `footer` | Copyright line, meta line |

**Gap in original plan:** Hero, TopNav, Footer, and Layout meta were omitted from Paso 2.2.

### 3. Project card shape

**Decision:**

```ts
type Project = {
  id: 'mds' | 'tvazteca' | 'occ' | 'asu';
  title: string;
  description: string;
  tag: string;
  tagVariant: 'internal' | 'default';
  href?: string;
  linkLabel?: string;
  revealDelay: string;
};
```

SVG thumbs remain a `Record<Project['id'], ...>` or `switch` inside `Work.astro` — not in data.

**Overlap avoided:** Original plan's `tags: string[]` does not match UI (single tag badge per card).

### 4. Experience entry types

**Decision:** Discriminated union:

```ts
type ExperienceTimeline = {
  kind: 'timeline';
  id: string;
  period: string;
  company: string;
  role: string;
  detail: string;
  revealDelay: string;
};

type ExperienceCompact = {
  kind: 'compact';
  id: string;
  entries: { company: string; role: string; period: string; detail: string }[];
  revealDelay: string;
};
```

Replaces a single HTML blob for Appmosphera/DWIT — still renders the same output.

### 5. Portrait asset

**Decision:** Keep `import portrait from '../assets/Iam.webp'` in `About.astro`. Only `about.portraitAlt` lives in data.

**Rationale:** Astro requires static imports for asset hashing. Phase 3 can migrate to `<Image />`.

### 6. Form labels and validation messages

**Decision:** Keep form field labels and error strings in `Contact.astro` markup for Phase 2. Only move `contact.successMessage` and link data to `portfolio.ts`.

**Rationale:** Form i18n is Phase 3; moving 6+ form strings adds little value now.

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| Accidental copy drift during refactor | Populate `portfolio.ts` from components first; diff before/after |
| CV confusion ("why isn't Fraktalweb on site?") | Document in plan: curated portfolio ≠ full CV |
| `revealDelay` / `--rise-i` lost in maps | Include delay/index in data or preserve order via array index |
| Hero split name lines | `site.name: { first, last }` not a single string |

## Migration Plan

1. Create `portfolio.ts` types + data (from live components)
2. Refactor Layout → Hero → TopNav → sections → Footer (top-down)
3. `pnpm build` + visual spot-check §7 checklist
4. Leave `cv-source.md` unchanged

## Open Questions

- None blocking — proceed with live-site copy as source of truth
