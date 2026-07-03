# Plan de migración — Peachlight Forest Portfolio → Astro (`personal-web-app`)

> **Intent:** Portar el portafolio actual (HTML monolítico en Open Design) al repositorio `personal-web-app`, conservando diseño Peachlight Forest, motion, assets y contenido del CV, usando el stack nativo del repo (Astro 7, TypeScript, Tailwind 4, React 19 opcional).

**Origen:** `/Users/jose/Documents/proyects/open-design/.od/projects/5834959c-c074-45b8-8b03-f325121d9d1e`  
**Destino:** `/Users/jose/Documents/proyects/personal-web-app`  
**Alcance aprobado:** Fases 0 + 1 + 2 ✅ completadas · **Siguiente:** Fase R (refactor CSS → Tailwind)

**Estado (2026-07-03):**
- Fases 0, 1, 2: **completas** (`portfolio.ts`, componentes, motion, paridad visual)
- GLB Draco: **hecho** (~30 MB → ~2.8 MB, `DRACOLoader` en `hero-scene.ts`)
- Tailwind: instalado pero **no conectado** a `PortfolioLayout` (`global.css` sin importar)
- Deploy / CI / Lighthouse: **diferido** (Fase 5)

---

## 1. Resumen ejecutivo

| Aspecto | Estado actual (Open Design) | Estado destino (Astro) |
|---|---|---|
| Entrada | `index.html` (~1.480 líneas) | `src/pages/index.astro` + componentes |
| 3D Hero | `hero-scene.js` + Three.js vía importmap/CDN | `src/scripts/hero-scene.ts` + `pnpm add three` |
| Estilos | CSS custom inline en `<style>` | `tokens.css` + `portfolio.css` → **Fase R:** Tailwind + `portfolio-motion.css` |
| Motion | Inline `<script>` (load intro, reveals, handoffs) | `src/scripts/portfolio-motion.ts` |
| Assets | `Iam.png`, `Meshy_AI_Pet.glb`, CV `.md` | `src/assets/` + `public/models/` |
| Contenido | Hardcoded en HTML | `src/data/portfolio.ts` ✅ |
| Starter Astro | — | `Welcome.astro` (eliminar tras migración) |

**Principio rector:** Migrar por **capas**, no reescribir de golpe. Primero paridad visual 1:1; después modularizar datos y optimizar build.

---

## 2. Inventario del artefacto origen

### 2.1 Archivos a migrar

| Archivo | Tamaño aprox. | Rol |
|---|---|---|
| `index.html` | ~60 KB | Layout, CSS, markup, motion JS inline |
| `hero-scene.js` | ~10 KB | Three.js: GLB, partículas, luces, OrbitControls |
| `Iam.png` | 143 KB | Retrato About |
| `Meshy_AI_Pet.glb` | 29.8 MB | Personaje 3D Hero |
| `CV-Jimenez Vazquez Jose Luis.md` | 7 KB | Fuente de verdad para copy estructurado |

### 2.2 Sistemas ya implementados (preservar)

**Diseño Peachlight Forest**
- Tokens: `#0B1220`, `#141C2E`, `#F4F0E8`, `#7ED957`, `#FFD666`, `#FF8A5C`
- Tipografía: Fraunces (display), DM Sans (body), JetBrains Mono (meta)
- Clase `.forest-panel` (paneles tipo cuadro del Hero)
- Scrollbar vertical custom
- Hero fullscreen (`100svh - nav`)

**Motion — Fase 1 (load + text)**
- Page fade-in 400ms
- Nav fade-down
- Hero stagger: headline → subtitle → CTAs → 3D (500ms text, 420ms 3D @ 920ms)
- Scroll reveals one-shot (IntersectionObserver + disconnect)
- Easing unificado: `cubic-bezier(0.23, 1, 0.32, 1)`

**Motion — Fase 2 (handoffs)**
- Barra de progreso scroll 2px `#7ED957`
- Hero → Work: gradient bridge + wake background
- Work → About: breathe transform
- About → Contact: settle overlay
- Scroll batched en un solo `requestAnimationFrame`

**Motion — Fase 3 (Hero ambiente)**
- Orbs CSS con grain SVG (2–3 orbs, drift 20–40s)
- Gradiente ambiental radial
- Partículas Three.js (80 desktop / 30 mobile)
- Luces warm + rim green en `hero-scene.js`
- Headline text-shadow sutil

**Motion — micro**
- Card hover lift, nav underline, skill tags (hover sin delay)
- About photo breathe + hover
- OrbitControls drag con ease-back al soltar
- `prefers-reduced-motion`: estado final inmediato; drag 3D manual OK

**Secciones (orden)**
1. Hero — José Luis Jiménez Vázquez, tagline, CTAs, 3D pet  
2. Work — MDS, TV Azteca, OCC, ASU  
3. Experience — Redarbor, Kode Vox, Webtronic, compact Appmosphera/DWIT  
4. About — `Iam.png`, bio, education, languages, skills  
5. Contact — email, tel, LinkedIn, GitHub, formulario con validación  

### 2.3 Work vs Experience vs About (decisión: mantener las 3)

Son **tres secciones distintas** en el HTML actual — no fusionar en la migración:

```
┌─────────────────────────────────────────────────────────────────┐
│  WORK (#work)          EXPERIENCE (#experience)    ABOUT        │
│  "Selected Work"       "Experience"                "About"      │
├─────────────────────────────────────────────────────────────────┤
│  Qué construiste       Dónde trabajaste            Quién eres   │
│  (proyectos/casos)     (timeline laboral)          (bio + foto) │
├─────────────────────────────────────────────────────────────────┤
│  Cards en grid         Filas cronológicas          Retrato,     │
│  MDS, TV Azteca,       Redarbor → Kode Vox →      educación,  │
│  OCC App, ASU          Webtronic + compact         idiomas,   │
│                        Appmosphera/DWIT              skills     │
└─────────────────────────────────────────────────────────────────┘
```

| Sección | Nav link | Componente Astro | Contenido Fase 2 |
|---|---|---|---|
| Work | `#work` | `Work.astro` | `projects[]` — entregables destacados |
| Experience | `#experience` | `Experience.astro` | `experience[]` — empleos con fechas y rol |
| About | `#about` | `About.astro` | `about` — bio, educación, idiomas, skills |

**Decisión:** mantener `#experience` como sección separada con su propio componente y entrada en el nav (si el HTML original la incluye en navegación).

---

## 3. Stack destino (`personal-web-app`)

```json
// package.json (actual)
{
  "astro": "^7.0.5",
  "@astrojs/react": "^6.0.0",
  "@astroanimate/core": "^0.1.2",
  "tailwindcss": "^4.3.2",
  "react": "^19.2.7"
}
```

### 3.1 Decisiones de arquitectura

| Tema | Decisión | Razón |
|---|---|---|
| **CSS** | Mantener CSS custom del portafolio; Tailwind solo en `global.css` base | Preserva polish sin reescribir 1.400+ líneas a utilidades |
| **React** | No obligatorio en Fase 1 | Astro puro basta; React island solo si el formulario crece |
| **Three.js** | Dependencia npm (`three`) | Vite bundlea; elimina importmap/CDN |
| **Hero 3D** | Island o `<script type="module">` con guard SSR | WebGL no debe ejecutarse en servidor |
| **@astroanimate/core** | Fase 3 opcional | Motion custom ya funciona; no reemplazar OrbitControls/handoffs |
| **TypeScript** | Sí en scripts y data | Alineado con repo y `tsconfig.json` |

### 3.2 Dependencias a añadir

```bash
cd /Users/jose/Documents/proyects/personal-web-app
pnpm add three
pnpm add -D @types/three   # recomendado
```

**GLB (hecho):**
- Draco ~2.8 MB en `public/models/Meshy_AI_Pet.glb` + `public/draco/gltf/`
- Git LFS / CDN externo — solo si deploy (Fase 5) lo requiere

---

## 4. Estructura de carpetas objetivo

```
personal-web-app/
├── public/
│   └── models/
│       └── Meshy_AI_Pet.glb          # Draco ~2.8 MB ✅
│   └── draco/gltf/                   # DRACOLoader decoder ✅
├── src/
│   ├── assets/
│   │   └── Iam.webp                  # import optimizado Astro (Fase 3)
│   ├── content/                      # Fase 3 opcional
│   │   └── config.ts
│   ├── data/
│   │   ├── portfolio.ts              # Fase 2 ✅
│   │   └── cv-source.md              # referencia (no runtime)
│   ├── layouts/
│   │   └── PortfolioLayout.astro     # <html>, fonts, meta, progress bar shell
│   ├── pages/
│   │   └── index.astro               # compone secciones
│   ├── components/
│   │   ├── TopNav.astro
│   │   ├── Hero.astro                # ambient stack + canvas + copy
│   │   ├── Work.astro
│   │   ├── Experience.astro
│   │   ├── About.astro
│   │   ├── Contact.astro
│   │   └── Footer.astro
│   ├── styles/
│   │   ├── tokens.css                # :root Peachlight Forest
│   │   ├── portfolio.css             # resto del CSS (desde index.html)
│   │   └── global.css                # Tailwind entry (existente)
│   └── scripts/
│       ├── hero-scene.ts             # port de hero-scene.js
│       ├── portfolio-motion.ts       # nav spy, reveals, handoffs, intro classes
│       └── contact-form.ts           # validación formulario
├── astro.config.mjs
└── package.json
```

**Eliminar tras Fase 1:**
- `src/components/Welcome.astro`
- Referencias al starter en `index.astro`

---

## 5. Fases de implementación

### Fase 0 — Preparación (30 min)

- [ ] Crear rama `feat/peachlight-portfolio-migration` en `personal-web-app`
- [ ] Assets:
  - [x] `Meshy_AI_Pet.glb` — ya en repo (`src/assets/`); **mover** a `public/models/Meshy_AI_Pet.glb`
  - [ ] `Iam.png` → `src/assets/Iam.png` (copiar desde OD)
  - [ ] `CV-Jimenez Vazquez Jose Luis.md` → `src/data/cv-source.md` (referencia Fase 2)
- [ ] Instalar `three` + `@types/three`
- [ ] Verificar `pnpm dev` arranca sin errores antes de tocar código

---

### Fase 1 — Paridad visual (1–2 sesiones)

Objetivo: `pnpm dev` muestra el mismo sitio que `index.html` actual.

#### Paso 1.1 — Extraer CSS

1. Copiar bloque `:root` de `index.html` → `src/styles/tokens.css`
2. Copiar resto de reglas `<style>` → `src/styles/portfolio.css`
3. Importar en `PortfolioLayout.astro`:

```astro
---
import '../styles/tokens.css';
import '../styles/portfolio.css';
---
```

4. **No** mezclar utilidades Tailwind en selectores `.forest-panel`, `.hero`, etc.

#### Paso 1.2 — Layout base

`PortfolioLayout.astro` debe incluir:
- `<html lang="es">`
- Meta title/description
- Google Fonts (Fraunces, DM Sans, JetBrains Mono) — o `@fontsource` en Fase 5
- `#scroll-progress` bar (markup del HTML actual)
- `<slot />` para contenido
- Script module al final: `portfolio-motion.ts`

#### Paso 1.3 — Componentizar secciones

| Componente | Contenido del HTML actual | Notas |
|---|---|---|
| `TopNav.astro` | `<header class="topnav">` | IDs `#work`, `#about`, etc. intactos |
| `Hero.astro` | `.hero`, ambient orbs, `.hero-split`, canvas | `id="hero-3d-canvas"` |
| `Work.astro` | `#work`, project cards | `.forest-panel` en cards |
| `Experience.astro` | `#experience` | timeline rows |
| `About.astro` | `#about`, photo, skills | `import portrait from '../assets/Iam.png'` |
| `Contact.astro` | `#contact`, links, form | IDs para form script |
| `Footer.astro` | footer | — |

`index.astro`:

```astro
---
import PortfolioLayout from '../layouts/PortfolioLayout.astro';
import TopNav from '../components/TopNav.astro';
import Hero from '../components/Hero.astro';
// ...
---
<PortfolioLayout>
  <TopNav />
  <main>
    <Hero />
    <Work />
    <Experience />
    <About />
    <Contact />
  </main>
  <Footer />
</PortfolioLayout>
```

#### Paso 1.4 — Portar `hero-scene.js` → `hero-scene.ts`

1. Renombrar a TypeScript; tipar refs DOM mínimas
2. Cambiar ruta GLB:

```ts
const MODEL_URL = '/models/Meshy_AI_Pet.glb';
```

3. Importar Three desde npm:

```ts
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
```

4. Cargar en `Hero.astro`:

```astro
<canvas id="hero-3d-canvas" aria-hidden="true"></canvas>

<script>
  import '../scripts/hero-scene.ts';
</script>
```

**SSR guard:** el script solo corre en cliente (Astro `<script>` default). No importar `hero-scene.ts` en frontmatter.

#### Paso 1.5 — Portar motion inline → `portfolio-motion.ts`

Extraer del `<script>` final de `index.html`:

| Módulo lógico | Funciones |
|---|---|
| Load intro | `document.body.classList.add('is-loaded')` timing |
| Scroll reveals | IntersectionObserver, `.reveal`, `.text-rise` |
| Nav scroll-spy | `updateNav`, bottom fix para `#contact` |
| Handoffs | `updateHandoffs`, CSS vars `--work-wake`, etc. |
| Hero ambient pause | IO en `#hero` para orbs + hero-scene |
| Contact form | validación + success state |

Patrón de init:

```ts
function initPortfolioMotion() {
  if (typeof window === 'undefined') return;
  // ...
}
initPortfolioMotion();
```

#### Paso 1.6 — SVG grain filter

El filtro `#hero-grain` vive en markup del Hero — incluir el `<svg>` hidden en `Hero.astro` (mismo que HTML actual).

#### Paso 1.7 — Smoke test Fase 1

```bash
pnpm dev
pnpm build
pnpm preview
```

Checklist rápido — ver §7 completo.

---

### Fase 2 — Datos tipados del CV (½–1 sesión)

Objetivo: actualizar contenido editando un solo archivo (`portfolio.ts`) **sin cambiar copy visible** respecto a Fase 1.

**Fuente de población:** componentes actuales (sitio en vivo), **no** import automático de `cv-source.md`. El CV tiene más entradas (Fraktalweb, Freelancer, proyectos extra) que el portafolio curado — añadirlas es trabajo editorial, no Fase 2.

**Retrato:** `About.astro` usa `Iam.webp` (import estático se mantiene en el componente; solo `portraitAlt` va a data).

#### Paso 2.1 — `src/data/portfolio.ts`

```ts
export const site = {
  title: 'José Luis Jiménez Vázquez · Software Engineer',
  description: '…',
  name: { first: 'José Luis', last: 'Jiménez Vázquez' },
  eyebrow: 'Software Engineer · Full Stack',
  role: 'Software Engineer · Front-End Architect',
  tagline: 'I design UI systems and web/mobile products with React, TypeScript, and design systems.',
  location: 'Mexico City',
};

export const nav = {
  logoLabel: 'Software Engineer',
  links: [
    { href: '#work', label: 'Work' },
    { href: '#experience', label: 'Experience' },
    { href: '#about', label: 'About' },
    { href: '#contact', label: 'Contact' },
  ],
};

export const sections = {
  work: { eyebrow: 'Selected Work', heading: 'Projects where craft meets maintainable code' },
  experience: { eyebrow: 'Experience', heading: 'Building design systems and product UI at scale' },
  about: { eyebrow: 'About', heading: 'Craft visual, maintainable code' },
  contact: {
    eyebrow: 'Contact',
    heading: "Let's talk about your next project",
    lead: 'Open to collaborations, design-system work, and frontend architecture roles.',
  },
};

export const projects = [
  {
    id: 'mds',
    title: 'MDS – Design System (Kode Vox)',
    description: '…',
    tag: 'Internal',
    tagVariant: 'internal' as const,
    revealDelay: '0ms',
  },
  // tvazteca, occ (href + linkLabel), asu
];

export const experience = [
  { kind: 'timeline' as const, id: 'redarbor', period: '…', company: '…', role: '…', detail: '…', revealDelay: '0ms' },
  // kodevox, webtronic
  { kind: 'compact' as const, id: 'compact', entries: [{ company: 'Appmosphera', … }, { company: 'DWIT', … }], revealDelay: '240ms' },
];

export const about = {
  portraitAlt: '…',
  bio: '…',
  education: { label: 'Education', value: '…' },
  languages: { label: 'Languages', value: '…' },
  skills: ['JavaScript', 'TypeScript', /* …16 tags actuales */],
};

export const contact = {
  email: 'jluis.jimenezv@proton.me',
  phone: { href: 'tel:+529981891932', display: '(+52) 998 189 1932' },
  linkedin: { href: '…', label: 'LinkedIn' },
  github: { href: '…', label: 'GitHub' },
  location: 'Mexico City',
  form: { successMessage: 'Message ready — …' },
};

export const footer = {
  copyright: '© José Luis Jiménez Vázquez',
  year: 2026,
  meta: 'Mexico City · jluis.jimenezv@proton.me',
};
```

**Qué NO va en `portfolio.ts` (Fase 2):**
- SVG thumbs de proyectos → quedan en `Work.astro` keyed por `project.id`
- Labels/errores del formulario → quedan en markup (i18n en Fase 3)
- Import del retrato → queda en `About.astro`

#### Paso 2.2 — Refactor componentes (lista completa)

| Componente | Export(s) | Notas |
|---|---|---|
| `PortfolioLayout.astro` | `site.title`, `site.description` | meta tags |
| `Hero.astro` | `site` | nombre en 2 líneas, CTAs |
| `TopNav.astro` | `nav` | **omitido en plan original** |
| `Work.astro` | `projects`, `sections.work` | `.map()` + thumbs por `id` |
| `Experience.astro` | `experience`, `sections.experience` | union `timeline` \| `compact` |
| `About.astro` | `about`, `sections.about` | skills `.map()` |
| `Contact.astro` | `contact`, `sections.contact` | links + success message |
| `Footer.astro` | `footer`, `site` | **omitido en plan original** |

#### Paso 2.3 — Validar paridad

Diff visual: sitio pre-Fase-2 vs post-Fase-2 — **mismo copy y URLs**, no comparar contra `cv-source.md`.

**OpenSpec:** change `peachlight-portfolio-phase-2` ✅

---

### Fase R — Refactor CSS → Tailwind (próxima — ~3–5 sesiones)

Objetivo: migrar layout y tipografía a Tailwind **sin perder polish** de motion, handoffs ni decoración. Estrategia **strangler-fig** módulo por módulo.

**OpenSpec:** change `peachlight-css-tailwind-refactor`

#### Principios

| Hacer | No hacer |
|-------|----------|
| `@theme` bridge desde `tokens.css` | 100% utility-first en todo el sitio |
| `@layer legacy` + utilities (cascade correcta) | Orden de clases en `class=""` como override |
| Mantener `.forest-panel`, `.reveal`, `.hero-orb` en CSS | Reemplazar handoffs/reveals con GSAP o `@astroanimate` |
| Borrar reglas CSS al migrar cada módulo | Big-bang rewrite de `portfolio.css` |

#### R0 — Puente Tailwind (~30 min)

- [x] `@theme inline` en `global.css` (colores/fuentes Peachlight Forest)
- [x] Import unlayered `portfolio.css` + `portfolio-motion.css` vía `global.css` (sustituye `@layer legacy` — evita regresión preflight)
- [x] Importar `global.css` en `PortfolioLayout.astro`
- [x] Cero cambio visual

#### R1 — Layout + Footer

- [x] Resolver colisión `.container` → `site-container` o utilities
- [x] Migrar `Footer.astro`, `.row-between`, `.section` padding
- [x] Eliminar reglas migradas de `portfolio.css`

#### R2 — Tipografía + botones

- [x] `.eyebrow`, `.lead`, `.meta` → Tailwind o `@layer components`
- [x] `.btn-*` en Hero / TopNav
- [x] Nav `::after` underline **queda en CSS**

#### R3 — Experience + About

- [x] Layout timeline y grid About → Tailwind
- [x] `.about-photo` breathe animation **queda en CSS** (`portfolio-motion.css`)

#### R4 — Work + Contact

- [x] Grid cards, `.tag` → Tailwind
- [x] `.forest-panel` decor **queda en CSS** (`portfolio-motion.css`)

#### R5 — Hero copy layout

- [x] `.hero-split`, `.hero-copy`, `.hero-cta` → Tailwind
- [x] `.hero-ambient`, orbs, handoff bridge **quedan en CSS** (`portfolio-motion.css`)

#### R6 — Split CSS final

- [x] Mover reglas permanentes a `portfolio-motion.css` (~515 líneas)
- [x] `portfolio.css` reducido a polish estructural (~254 líneas)
- [x] Checklist §7 completo

#### CSS permanente (nunca a Tailwind)

```
.reveal, .hero-rise, .text-rise, .is-visible
.hero-ambient, .hero-orb, .hero-handoff-bridge
.forest-panel::before, handoff vars (--work-wake, etc.)
html::-webkit-scrollbar-*, @keyframes *
.topnav nav a::after
```

---

### Fase 3 — Integración Astro nativa (post Fase R)

- [ ] Content Collections para proyectos/lab posts futuros
- [ ] `@astroanimate/core` en elementos nuevos (no reemplazar handoffs existentes)
- [ ] **i18n ES/EN** — Astro i18n routing; hoy `lang="es"` + tagline EN se mantiene tal cual en Fases 1–2
- [ ] View Transitions API para navegación multi-página futura
- [ ] Optimización imagen: `<Image />` de Astro para `Iam.webp`
- [ ] SEO: `astro-seo` o meta Open Graph
- [ ] **Formulario contacto** — conectar backend (Formspree, Resend, etc.); Fases 1–2 solo validación client-side + success state (comportamiento actual)

---

### Fase 5 — Deploy y performance (diferido)

- [x] **GLB Draco:** comprimido ~2.8 MB + `DRACOLoader` + `public/draco/gltf/` ✅
- [ ] Elegir host (Vercel / Netlify / Cloudflare Pages) + `site` en `astro.config`
- [ ] CI: `pnpm build` en GitHub Actions (hoy solo Playwright boilerplate)
- [ ] Lighthouse: LCP hero, CLS photo About
- [ ] Preload fonts / migrar a `@fontsource`
- [ ] Git LFS — no necesario a ~2.8 MB GLB
- [ ] CDN externo para GLB — solo si deploy lo requiere

**Nota:** El refactor Tailwind vive en **Fase R**, no aquí.

---

### ~~Fase 4~~ (renumerada → Fase 5)

La antigua Fase 4 mezclaba deploy + refactor Tailwind. Separadas:
- **Fase R** = refactor CSS → Tailwind
- **Fase 5** = deploy + performance

---

## 6. Mapa de migración técnica

### 6.1 HTML → Astro

| Origen | Destino | Cambio |
|---|---|---|
| `data-od-id="…"` | `id` o `data-section` | Opcional; útil para tests |
| Inline `<style>` | `tokens.css` + `portfolio.css` | Mismo CSS, archivos separados |
| Inline `<script>` | `portfolio-motion.ts`, `contact-form.ts` | ES modules |
| Importmap Three CDN | `import from 'three'` | Bundled by Vite |
| `src="Iam.png"` | `import { Image } from 'astro:assets'` | Optimización Fase 3 |
| `src="Meshy_AI_Pet.glb"` | `/models/Meshy_AI_Pet.glb` | `public/` |

### 6.2 Clases CSS críticas (no renombrar en Fase 1)

```
.forest-panel, .hero, .hero-ambient, .hero-orb, .mascot-stage,
.text-rise, .hero-rise, .reveal, .is-visible, .is-loaded,
.work-handoff-glow, .about-handoff-bg, .contact-handoff-frame,
#scroll-progress, .topnav, .project-card, .timeline-row, .about-photo
```

### 6.3 Variables CSS de handoffs (JS escribe, CSS consume)

```
--scroll-progress
--hero-work-bridge
--work-wake
--about-breathe
--contact-settle
```

---

## 7. Checklist de validación

### Visual / funcional

- [x] Hero ocupa viewport completo; Work no visible al load
- [x] GLB carga y se ve iluminado (partículas + orbs)
- [x] Drag 3D funciona; auto-rotate resume tras soltar
- [x] Load intro ~1.0–1.2s; texto legible antes que 3D
- [x] Scroll reveals one-shot (no re-animate al subir)
- [x] Handoffs Hero→Work→About→Contact perceptibles
- [x] Nav Contact activo al fondo de página
- [x] Skill tags hover instantáneo (últimas tags)
- [x] About photo animación breathe + frame cuadrado
- [x] Formulario contacto valida y muestra success
- [x] Sin scroll horizontal (360px → 1920px)
- [x] Scrollbar Peachlight Forest visible

### Accesibilidad

- [x] `prefers-reduced-motion`: sin animaciones; contenido visible
- [x] CTAs clicables durante intro
- [x] Canvas `aria-hidden`; copy navegable por teclado
- [x] Contraste texto sobre `#0B1220`

### Build

- [x] `pnpm build` exitoso
- [ ] `pnpm preview` — GLB y assets resuelven en producción
- [x] No errores hydration / SSR en consola

---

## 8. Riesgos y mitigaciones

| Riesgo | Impacto | Mitigación |
|---|---|---|
| **GLB 30 MB** | Repo lento, deploy pesado | ✅ Draco ~2.8 MB (hecho) |
| **Three.js en SSR** | Crash build | Scripts solo en `<script>` cliente; no import en frontmatter |
| **Tailwind vs custom CSS** | Especificidad rota | `@layer legacy` + bridge `@theme`; migrar por módulo (Fase R) |
| **Duplicar motion** | Jank, bugs | No añadir `@astroanimate` encima del motion existente |
| **Pérdida de polish** | Regresión visual | Migrar CSS verbatim antes de refactorizar |
| **Node 22 vs 24** | Astro OK en 22.12+ | Repo ya declara `>=22.12.0`; no subir a 24 sin probar |
| **Fuentes externas** | FOUT / privacidad | Migrar a `@fontsource` en Fase 5 |

---

## 9. Qué NO hacer

**Durante Fases 0–2 (completadas):** no reescribir a Tailwind — ✅ respetado.

**Durante Fase R (refactor CSS):**

- No migrar motion, handoffs, hero orbs, ni `forest-panel::before` a Tailwind
- No usar orden de clases en HTML como estrategia de override
- No reemplazar handoffs con GSAP o `@astroanimate/core`
- No big-bang: borrar CSS solo cuando el módulo esté migrado

**Diferido a Fase 3:** i18n, Image, SEO, form backend, Content Collections.

**Diferido a Fase 5:** deploy, CI build, Lighthouse, `@fontsource`.

---

## 10. Estimación de esfuerzo

| Fase | Esfuerzo | Entregable | Estado |
|---|---|---|---|
| Fase 0 | 30 min | Rama, assets, deps | ✅ |
| Fase 1 | 4–8 h | Paridad visual en Astro | ✅ |
| Fase 2 | 2–3 h | `portfolio.ts` | ✅ |
| **Fase R** | **3–5 h** | **Tailwind + `portfolio-motion.css`** | **✅ Completo** |
| Fase 3 | 4–6 h | i18n, Image, SEO, form backend | pendiente |
| Fase 5 | 2–4 h | Deploy, CI, Lighthouse, fonts | diferido |

**Total hasta MVP+estilos (Fase 0–2 + R):** ~2–3 días enfocados.

---

## 11. Orden de ejecución recomendado (checklist para el agente)

```
✅ 0.x  Preparación
✅ 1.x  Paridad visual
✅ 2.x  portfolio.ts
✅ R0   Tailwind bridge (@theme + global.css)
✅ R1   Footer + layout primitives + site-container
✅ R2   Typography + buttons
✅ R3   Experience + About
✅ R4   Work + Contact
✅ R5   Hero copy layout
✅ R6   portfolio-motion.css split + §7 validation
□ 3.x  i18n, Image, SEO (después de R)
□ 5.x  Deploy + performance (al final)
```

---

## 12. Decisiones tomadas

| Tema | Decisión | Fase |
|---|---|---|
| **Alcance MVP** | Fases 0 + 1 + 2 | ✅ Completo |
| **GLB** | `Meshy_AI_Pet.glb` en `public/models/` | ✅ |
| **GLB Draco** | ~2.8 MB + DRACOLoader | ✅ Hecho |
| **CSS refactor** | Fase R — strangler-fig por módulo, `@layer` | **→ Ahora** |
| **Deploy** | Vercel / Netlify / CF Pages | Fase 5 (diferido) |
| **Experience** | Sección separada Work/About | ✅ |
| **Formulario backend** | Formspree/Resend | Fase 3 |
| **Idioma** | i18n ES/EN | Fase 3 |
| **Fase 2 data source** | Componentes actuales; `cv-source.md` referencia | ✅ |
| **Motion (GSAP, @astroanimate)** | No reemplazar handoffs | Permanente en CSS |

### Preguntas aún abiertas

- [x] **Deploy host:** Vercel, Netlify, Cloudflare Pages — Fase 5
- [x] **`site-container` vs utilities** para max-width — `site-container` @utility en R1

---

## 13. Próximo paso

Fases 0–2 y **Fase R** completas. Siguiente: **Fase 3** (integración Astro nativa).

```
/openspec:apply peachlight-portfolio-phase-2
```

O pedir: **"implementa Fase 3"** — Content Collections, i18n, `<Image />`, SEO, form backend.

Deploy (Fase 5) queda para después.

---

*Actualizado: 2026-07-03 · Peachlight Forest portfolio · Open Design → Astro migration*
