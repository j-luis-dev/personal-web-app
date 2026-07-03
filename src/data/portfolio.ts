export type ProjectId = 'mds' | 'tvazteca' | 'occ' | 'asu';

export type Project = {
  id: ProjectId;
  title: string;
  description: string;
  tag: string;
  tagVariant: 'internal' | 'default';
  href?: string;
  linkLabel?: string;
  revealDelay: string;
};

export type ExperienceTimeline = {
  kind: 'timeline';
  id: string;
  period: string;
  company: string;
  role: string;
  detail: string;
  revealDelay: string;
};

export type ExperienceCompactEntry = {
  company: string;
  role: string;
  period: string;
  detail: string;
};

export type ExperienceCompact = {
  kind: 'compact';
  id: string;
  entries: ExperienceCompactEntry[];
  revealDelay: string;
};

export type ExperienceEntry = ExperienceTimeline | ExperienceCompact;

export type NavLink = {
  href: string;
  label: string;
};

export type SectionCopy = {
  eyebrow: string;
  heading: string;
  lead?: string;
};

export const site = {
  title: 'José Luis Jiménez Vázquez · Software Engineer',
  description:
    'José Luis Jiménez Vázquez — Software Engineer · Front-End Architect. Design systems, React, TypeScript.',
  name: { first: 'José Luis', last: 'Jiménez Vázquez' },
  eyebrow: 'Software Engineer · Full Stack',
  role: 'Software Engineer · Front-End Architect',
  tagline:
    'I design UI systems and web/mobile products with React, TypeScript, and design systems.',
  location: 'Mexico City',
  ctas: {
    primary: { href: '#work', label: 'View projects' },
    secondary: { href: '#contact', label: 'Contact' },
  },
} as const;

export const nav = {
  logoLabel: 'Software Engineer',
  links: [
    { href: '#work', label: 'Work' },
    { href: '#experience', label: 'Experience' },
    { href: '#about', label: 'About' },
    { href: '#contact', label: 'Contact' },
  ] satisfies NavLink[],
  cta: { href: '#contact', label: 'Contact' },
} as const;

export const sections = {
  work: {
    eyebrow: 'Selected Work',
    heading: 'Projects where craft meets maintainable code',
  },
  experience: {
    eyebrow: 'Experience',
    heading: 'Building design systems and product UI at scale',
  },
  about: {
    eyebrow: 'About',
    heading: 'Craft visual, maintainable code',
  },
  contact: {
    eyebrow: 'Contact',
    heading: "Let's talk about your next project",
    lead: 'Open to collaborations, design-system work, and frontend architecture roles.',
  },
} as const satisfies Record<string, SectionCopy>;

export const projects: Project[] = [
  {
    id: 'mds',
    title: 'MDS – Design System (Kode Vox)',
    description:
      'shadcn/MUI system, Astro+React docs, custom CLI. ~80% less time on new layouts — from hours to minutes.',
    tag: 'Internal',
    tagVariant: 'internal',
    revealDelay: '0ms',
  },
  {
    id: 'tvazteca',
    title: 'TV Azteca Platform (microfrontends)',
    description:
      'Frontend architecture, Okta SSO/2FA, per-module deployments for thousands of users.',
    tag: 'Internal',
    tagVariant: 'internal',
    revealDelay: '100ms',
  },
  {
    id: 'occ',
    title: 'OCC App',
    description:
      'Maintenance of app + Redarbor shared component library across OCC, Computrabajo, InfoJobs, Pandapé.',
    tag: 'Mobile · Android',
    tagVariant: 'default',
    href: 'https://play.google.com/store/apps/details?id=mx.com.occ&hl=es_MX',
    linkLabel: 'play.google.com →',
    revealDelay: '200ms',
  },
  {
    id: 'asu',
    title: 'ASU – Frontend modernization',
    description:
      'React, TypeScript, Tailwind, Atomic Design, RTK, REST/GraphQL — reduced tech debt and unified design criteria.',
    tag: 'Web · Modernization',
    tagVariant: 'default',
    href: 'https://www.asu.edu',
    linkLabel: 'asu.edu →',
    revealDelay: '300ms',
  },
];

export const experience: ExperienceEntry[] = [
  {
    kind: 'timeline',
    id: 'exp-redarbor',
    period: 'Mar 2026 – Present',
    company: 'Redarbor',
    role: 'UI Mobile Developer',
    detail:
      'Shared component library for OCC, Computrabajo, InfoJobs, and Pandapé — same UI base with per-brand theming.',
    revealDelay: '0ms',
  },
  {
    kind: 'timeline',
    id: 'exp-kodevox',
    period: 'Jun 2024 – Mar 2026',
    company: 'Kode Vox',
    role: 'Front-End Architect / Senior Full-Stack',
    detail:
      'MDS Design System, Astro+React documentation site, custom CLI — ~80% faster layout scaffolding.',
    revealDelay: '80ms',
  },
  {
    kind: 'timeline',
    id: 'exp-webtronic',
    period: '2021 – 2023',
    company: 'Webtronic Labs',
    role: 'Full-Stack Developer',
    detail:
      'ASU platform work — React/TS/Tailwind migration, Atomic Design, RTK, REST/GraphQL APIs.',
    revealDelay: '160ms',
  },
  {
    kind: 'compact',
    id: 'exp-compact',
    entries: [
      {
        company: 'Appmosphera',
        role: 'Frontend',
        period: '2020–2021',
        detail: 'React web + React Native condo admin apps.',
      },
      {
        company: 'DWIT',
        role: 'Junior Engineer',
        period: '2020–2021',
        detail: 'SaaS frontend with React & React Native.',
      },
    ],
    revealDelay: '240ms',
  },
];

export const about = {
  portraitAlt: 'José Luis Jiménez Vázquez — professional portrait',
  bio: "Software engineer focused on frontend and design systems. I've led multi-brand component libraries, documentation in Astro, and microfrontend architectures. I like to connect visual craft with maintainable code.",
  education: {
    label: 'Education',
    value:
      'B.Sc. Computer Systems Engineering — Universidad de América del Norte (2025–2026, CENEVAL based on experience)',
  },
  languages: {
    label: 'Languages',
    value: 'Native Spanish · English B2',
  },
  skills: [
    'JavaScript',
    'TypeScript',
    'React',
    'Next.js',
    'Angular',
    'React Native',
    'Node.js',
    'NestJS',
    'Tailwind',
    'GraphQL',
    'PostgreSQL',
    'Docker',
    'Design Systems',
    'TDD',
    'WCAG',
    'Monorepo',
  ],
} as const;

export const contact = {
  email: 'jluis.jimenezv@proton.me',
  phone: { href: 'tel:+529981891932', display: '(+52) 998 189 1932' },
  linkedin: {
    href: 'https://www.linkedin.com/in/jose-luis-jimenez-91419a1a6/',
    label: 'LinkedIn',
  },
  github: { href: 'https://github.com/j-luis-dev', label: 'GitHub' },
  location: 'Mexico City',
  form: {
    successMessage:
      'Message ready — in production this would reach my inbox. Thanks for reaching out.',
  },
} as const;

export const footer = {
  copyright: '© José Luis Jiménez Vázquez',
  year: 2026,
  meta: 'Mexico City · jluis.jimenezv@proton.me',
} as const;
