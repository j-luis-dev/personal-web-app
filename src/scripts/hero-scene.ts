import * as THREE from 'three';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

type ParticleColor = {
  hex: number;
  weight: number;
};

type ParticleUserData = {
  phases: Float32Array;
  speeds: Float32Array;
  basePositions: Float32Array;
};

type HeroSceneHandle = {
  dispose: () => void;
};

const PARTICLE_COLORS: ParticleColor[] = [
  { hex: 0xffd666, weight: 0.6 },
  { hex: 0x7ed957, weight: 0.25 },
  { hex: 0xc5d15f, weight: 0.15 },
];

function visualRandom(): number {
  const buffer = new Uint32Array(1);
  crypto.getRandomValues(buffer);
  return buffer[0] / (0xffffffff + 1);
}

function resolveParticleCount(reducedMotion: boolean, isMobile: boolean): number {
  if (reducedMotion) return 0;
  if (isMobile) return 30;
  return 80;
}

function pickParticleColor(): number {
  const r = visualRandom();
  let acc = 0;
  for (const color of PARTICLE_COLORS) {
    acc += color.weight;
    if (r <= acc) return color.hex;
  }
  return PARTICLE_COLORS[0].hex;
}

function createForestParticles(count: number): THREE.Points {
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const phases = new Float32Array(count);
  const speeds = new Float32Array(count);
  const color = new THREE.Color();

  for (let i = 0; i < count; i += 1) {
    const radius = 0.35 + visualRandom() * 0.55;
    const theta = visualRandom() * Math.PI * 2;
    const phi = Math.acos(2 * visualRandom() - 1) * 0.55 + Math.PI * 0.22;
    positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = radius * Math.cos(phi) * 0.85 - 0.05;
    positions[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);

    color.setHex(pickParticleColor());
    colors[i * 3] = color.r;
    colors[i * 3 + 1] = color.g;
    colors[i * 3 + 2] = color.b;

    phases[i] = visualRandom() * Math.PI * 2;
    speeds[i] = 0.15 + visualRandom() * 0.35;
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const material = new THREE.PointsMaterial({
    size: 0.028,
    vertexColors: true,
    transparent: true,
    opacity: 0.46,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    sizeAttenuation: true,
  });

  const points = new THREE.Points(geometry, material);
  points.frustumCulled = false;
  const userData: ParticleUserData = {
    phases,
    speeds,
    basePositions: positions.slice(),
  };
  points.userData = userData;
  return points;
}

function updateParticles(
  points: THREE.Points,
  elapsed: number,
  reducedMotion: boolean,
): void {
  if (reducedMotion) return;

  const userData = points.userData as ParticleUserData;
  const positionAttr = points.geometry.attributes.position;
  const positions = positionAttr.array as Float32Array;
  const { basePositions: base, phases, speeds } = userData;
  const count = phases.length;

  for (let i = 0; i < count; i += 1) {
    const idx = i * 3;
    const drift = Math.sin(elapsed * speeds[i] + phases[i]);
    const driftX = Math.cos(elapsed * speeds[i] * 0.6 + phases[i] * 1.3);
    positions[idx] = base[idx] + driftX * 0.04;
    positions[idx + 1] = base[idx + 1] + drift * 0.06;
    positions[idx + 2] = base[idx + 2] + Math.sin(elapsed * 0.25 + phases[i]) * 0.03;
  }
  positionAttr.needsUpdate = true;
}

function isMeshNode(node: THREE.Object3D): node is THREE.Mesh {
  return (node as THREE.Mesh).isMesh;
}

function applyForestMaterialTuning(material: THREE.Material): void {
  if ('emissive' in material && material.emissive instanceof THREE.Color) {
    material.emissive.setHex(0x2a2010);
    if ('emissiveIntensity' in material && typeof material.emissiveIntensity === 'number') {
      material.emissiveIntensity = 0.12;
    }
  }
  if ('roughness' in material && typeof material.roughness === 'number') {
    material.roughness = Math.min(material.roughness, 0.82);
  }
}

function configureMeshNode(mesh: THREE.Mesh): void {
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
  for (const material of materials) {
    applyForestMaterialTuning(material);
  }
}

const orbitOffset = new THREE.Vector3();
const orbitSpherical = new THREE.Spherical();

function getAzimuthalAngle(
  camera: THREE.PerspectiveCamera,
  target: THREE.Vector3,
): number {
  orbitOffset.copy(camera.position).sub(target);
  orbitSpherical.setFromVector3(orbitOffset);
  return orbitSpherical.theta;
}

function getPolarAngle(camera: THREE.PerspectiveCamera, target: THREE.Vector3): number {
  orbitOffset.copy(camera.position).sub(target);
  orbitSpherical.setFromVector3(orbitOffset);
  return orbitSpherical.phi;
}

function setOrbitAngles(
  camera: THREE.PerspectiveCamera,
  target: THREE.Vector3,
  azimuth: number,
  polar: number,
): void {
  orbitOffset.copy(camera.position).sub(target);
  orbitSpherical.setFromVector3(orbitOffset);
  orbitSpherical.theta = azimuth;
  orbitSpherical.phi = polar;
  orbitOffset.setFromSpherical(orbitSpherical);
  camera.position.copy(target).add(orbitOffset);
  camera.lookAt(target);
}

export function initHeroScene(canvas: HTMLCanvasElement | null): HeroSceneHandle | null {
  if (!canvas || globalThis.window === undefined) return null;

  const canvasEl = canvas;

  const assetBase = import.meta.env.BASE_URL;

  const reducedMotion = globalThis.window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isMobile = globalThis.window.matchMedia('(max-width: 720px)').matches;
  const particleCount = resolveParticleCount(reducedMotion, isMobile);

  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas: canvasEl, alpha: true, antialias: true });
  } catch {
    canvasEl.setAttribute('aria-label', '3D model unavailable');
    return null;
  }

  renderer.setPixelRatio(Math.min(globalThis.window.devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.42;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
  const controls = new OrbitControls(camera, canvasEl);
  controls.enableDamping = true;
  controls.dampingFactor = 0.07;
  controls.enablePan = false;
  controls.enableZoom = false;
  controls.rotateSpeed = 0.55;
  controls.minPolarAngle = THREE.MathUtils.degToRad(28);
  controls.maxPolarAngle = THREE.MathUtils.degToRad(72);
  controls.autoRotate = !reducedMotion;
  controls.autoRotateSpeed = 0.65;
  controls.target.set(0, 0, 0);

  let isDragging = false;
  let resumeTimer: ReturnType<typeof setTimeout> | null = null;
  let defaultAzimuth = 0;
  let defaultPolar = THREE.MathUtils.degToRad(52);
  let heroInView = true;
  let rafId = 0;

  function pauseAutoRotate(): void {
    controls.autoRotate = false;
    if (resumeTimer) clearTimeout(resumeTimer);
    canvasEl.classList.add('is-dragging');
  }

  function scheduleAutoRotateResume(): void {
    if (resumeTimer) clearTimeout(resumeTimer);
    canvasEl.classList.remove('is-dragging');
    resumeTimer = setTimeout(() => {
      if (reducedMotion || isDragging) return;
      const startAz = getAzimuthalAngle(camera, controls.target);
      const startPol = getPolarAngle(camera, controls.target);
      const startTime = performance.now();
      const duration = 400;

      function easeBack(now: number): void {
        const t = Math.min((now - startTime) / duration, 1);
        const eased = t * (2 - t);
        const delta = Math.atan2(
          Math.sin(startAz - defaultAzimuth),
          Math.cos(startAz - defaultAzimuth),
        );
        setOrbitAngles(
          camera,
          controls.target,
          startAz - delta * eased,
          startPol + (defaultPolar - startPol) * eased,
        );
        controls.update();
        if (t < 1) {
          requestAnimationFrame(easeBack);
        } else {
          controls.autoRotate = true;
        }
      }
      requestAnimationFrame(easeBack);
    }, 320);
  }

  controls.addEventListener('start', () => {
    isDragging = true;
    pauseAutoRotate();
  });
  controls.addEventListener('end', () => {
    isDragging = false;
    scheduleAutoRotateResume();
  });

  function frameModel(object: THREE.Object3D, margin = 1.28): number {
    const box = new THREE.Box3().setFromObject(object);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const maxSize = Math.max(size.x, size.y, size.z);
    const fovRad = (camera.fov * Math.PI) / 180;
    const fitHeight = maxSize / (2 * Math.tan(fovRad / 2));
    const fitWidth = fitHeight / camera.aspect;
    const distance = margin * Math.max(fitHeight, fitWidth);
    camera.position.set(center.x, center.y + maxSize * 0.06, center.z + distance);
    controls.target.copy(center);
    controls.update();
    defaultAzimuth = getAzimuthalAngle(camera, controls.target);
    defaultPolar = getPolarAngle(camera, controls.target);
    camera.near = Math.max(distance / 200, 0.01);
    camera.far = distance * 200;
    camera.updateProjectionMatrix();
    return center.y;
  }

  const hemiLight = new THREE.HemisphereLight(0xffd666, 0x141c2e, 0.48);
  scene.add(hemiLight);

  const ambient = new THREE.AmbientLight(0x2a3548, 0.32);
  scene.add(ambient);

  const keyLight = new THREE.SpotLight(0xffd666, 2.25, 16, Math.PI / 4.8, 0.42, 1.35);
  keyLight.position.set(1.4, 3.6, 2.2);
  keyLight.target.position.set(0, 0.2, 0);
  scene.add(keyLight);
  scene.add(keyLight.target);

  const fillLight = new THREE.PointLight(0xf4f0e8, 0.48, 12);
  fillLight.position.set(-0.6, 1.4, 3);
  scene.add(fillLight);

  const grassFill = new THREE.PointLight(0x7ed957, 0.32, 10);
  grassFill.position.set(-1.6, 0.8, 2.2);
  scene.add(grassFill);

  const rimLight = new THREE.PointLight(0x7ed957, 0.42, 9);
  rimLight.position.set(-2.2, 1.1, -1);
  scene.add(rimLight);

  const particles = particleCount > 0 ? createForestParticles(particleCount) : null;
  if (particles) scene.add(particles);

  let modelRoot: THREE.Object3D | null = null;
  let modelBaseY = 0;
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath(`${assetBase}draco/gltf/`);
  const loader = new GLTFLoader();
  loader.setDRACOLoader(dracoLoader);
  loader.load(
    `${assetBase}models/Meshy_AI_Pet.glb`,
    (gltf) => {
      modelRoot = gltf.scene;
      modelRoot.traverse((child) => {
        if (isMeshNode(child) && child.material) {
          configureMeshNode(child);
        }
      });

      const box = new THREE.Box3().setFromObject(modelRoot);
      const size = box.getSize(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z);
      modelRoot.scale.setScalar(1 / maxDim);

      box.setFromObject(modelRoot);
      const center = box.getCenter(new THREE.Vector3());
      modelRoot.position.set(-center.x, -center.y, -center.z);
      scene.add(modelRoot);

      modelBaseY = modelRoot.position.y;
      frameModel(modelRoot, 1.28);
    },
    undefined,
    () => {
      canvasEl.setAttribute('aria-label', '3D model loading failed');
    },
  );

  function resize(): void {
    const rect = canvasEl.getBoundingClientRect();
    const w = Math.max(rect.width, 280);
    const h = Math.max(rect.height, 280);
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    if (modelRoot) frameModel(modelRoot, 1.28);
    else camera.updateProjectionMatrix();
  }

  const timer = new THREE.Timer();
  timer.connect(document);

  function animate(timestamp?: number): void {
    if (!heroInView) {
      rafId = 0;
      return;
    }

    timer.update(timestamp);
    const t = timer.getElapsed();
    if (modelRoot && !reducedMotion && !isDragging) {
      modelRoot.position.y = modelBaseY + Math.sin(t * 0.8) * 0.025;
    } else if (modelRoot && isDragging) {
      modelRoot.position.y = modelBaseY;
    }

    if (particles) updateParticles(particles, t, reducedMotion);

    controls.update();
    renderer.render(scene, camera);
    rafId = requestAnimationFrame(animate);
  }

  function startLoop(): void {
    if (!rafId && heroInView) {
      rafId = requestAnimationFrame(animate);
    }
  }

  function stopLoop(): void {
    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = 0;
    }
  }

  const heroSection = canvasEl.closest('[data-od-id="hero"]') ?? canvasEl.closest('.hero');
  if (heroSection && 'IntersectionObserver' in globalThis.window) {
    const viewObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          heroInView = entry.isIntersecting;
          if (heroInView) startLoop();
          else stopLoop();
        }
      },
      { threshold: 0.05, rootMargin: '80px 0px' },
    );
    viewObserver.observe(heroSection);
  }

  resize();
  startLoop();

  let resizeTimer: ReturnType<typeof setTimeout> | null = null;
  function onWindowResize(): void {
    if (resizeTimer) clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resize, 120);
  }
  globalThis.window.addEventListener('resize', onWindowResize, { passive: true });

  return {
    dispose(): void {
      stopLoop();
      if (resumeTimer) clearTimeout(resumeTimer);
      if (resizeTimer) clearTimeout(resizeTimer);
      globalThis.window.removeEventListener('resize', onWindowResize);
      timer.disconnect();
      controls.dispose();
      renderer.dispose();
    },
  };
}
