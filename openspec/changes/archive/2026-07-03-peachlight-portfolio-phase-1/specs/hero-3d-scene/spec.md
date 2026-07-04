## ADDED Requirements

### Requirement: Hero 3D canvas client-only execution

The Hero section SHALL render a WebGL canvas (`#hero-3d-canvas`) initialized only on the client via an Astro `<script>` block. Three.js code MUST NOT be imported in Astro component frontmatter to avoid SSR failures.

#### Scenario: Build succeeds without WebGL on server

- **WHEN** `pnpm build` runs
- **THEN** the build completes without Three.js or WebGL errors from server-side rendering

### Requirement: GLB model loading

The hero scene SHALL load `Meshy_AI_Pet.glb` from `/models/Meshy_AI_Pet.glb` using Three.js `GLTFLoader` bundled via npm `three`.

#### Scenario: Model visible in hero

- **WHEN** a user loads the homepage on a WebGL-capable browser
- **THEN** the 3D pet model appears in the hero canvas with warm and rim-green lighting

### Requirement: Particles and controls

The hero scene SHALL render forest-colored particles (80 on desktop, 30 on mobile) and support OrbitControls drag with auto-rotate resuming after release, matching Open Design behavior.

#### Scenario: Drag interaction

- **WHEN** a user drags the 3D model and releases
- **THEN** the model returns to auto-rotate behavior after the ease-back animation

### Requirement: Reduced motion for 3D

When `prefers-reduced-motion: reduce` is set, particle animation SHALL be disabled while manual OrbitControls drag SHALL remain available.

#### Scenario: Reduced motion particles paused

- **WHEN** the user prefers reduced motion
- **THEN** particle drift stops but the user can still drag the model manually
