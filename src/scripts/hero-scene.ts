import * as THREE from 'three';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

var PARTICLE_COLORS = [
  { hex: 0xffd666, weight: 0.6 },
  { hex: 0x7ed957, weight: 0.25 },
  { hex: 0xc5d15f, weight: 0.15 },
];

function pickParticleColor() {
  var r = Math.random();
  var acc = 0;
  for (var i = 0; i < PARTICLE_COLORS.length; i += 1) {
    acc += PARTICLE_COLORS[i].weight;
    if (r <= acc) return PARTICLE_COLORS[i].hex;
  }
  return PARTICLE_COLORS[0].hex;
}

function createForestParticles(count) {
  var geometry = new THREE.BufferGeometry();
  var positions = new Float32Array(count * 3);
  var colors = new Float32Array(count * 3);
  var phases = new Float32Array(count);
  var speeds = new Float32Array(count);
  var color = new THREE.Color();

  for (var i = 0; i < count; i += 1) {
    var radius = 0.35 + Math.random() * 0.55;
    var theta = Math.random() * Math.PI * 2;
    var phi = Math.acos(2 * Math.random() - 1) * 0.55 + Math.PI * 0.22;
    positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = radius * Math.cos(phi) * 0.85 - 0.05;
    positions[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);

    color.setHex(pickParticleColor());
    colors[i * 3] = color.r;
    colors[i * 3 + 1] = color.g;
    colors[i * 3 + 2] = color.b;

    phases[i] = Math.random() * Math.PI * 2;
    speeds[i] = 0.15 + Math.random() * 0.35;
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  var material = new THREE.PointsMaterial({
    size: 0.028,
    vertexColors: true,
    transparent: true,
    opacity: 0.46,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    sizeAttenuation: true,
  });

  var points = new THREE.Points(geometry, material);
  points.frustumCulled = false;
  points.userData.phases = phases;
  points.userData.speeds = speeds;
  points.userData.basePositions = positions.slice();
  return points;
}

function updateParticles(points, elapsed, reducedMotion) {
  if (!points || reducedMotion) return;
  var positions = points.geometry.attributes.position.array;
  var base = points.userData.basePositions;
  var phases = points.userData.phases;
  var speeds = points.userData.speeds;
  var count = phases.length;

  for (var i = 0; i < count; i += 1) {
    var idx = i * 3;
    var drift = Math.sin(elapsed * speeds[i] + phases[i]);
    var driftX = Math.cos(elapsed * speeds[i] * 0.6 + phases[i] * 1.3);
    positions[idx] = base[idx] + driftX * 0.04;
    positions[idx + 1] = base[idx + 1] + drift * 0.06;
    positions[idx + 2] = base[idx + 2] + Math.sin(elapsed * 0.25 + phases[i]) * 0.03;
  }
  points.geometry.attributes.position.needsUpdate = true;
}

export function initHeroScene(canvas) {
  if (!canvas) return null;

  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var isMobile = window.matchMedia('(max-width: 720px)').matches;
  var particleCount = reducedMotion ? 0 : isMobile ? 30 : 80;

  var renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
  } catch (err) {
    canvas.setAttribute('aria-label', '3D model unavailable');
    return null;
  }

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.42;

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
  var controls = new OrbitControls(camera, canvas);
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

  var isDragging = false;
  var resumeTimer = null;
  var defaultAzimuth = 0;
  var defaultPolar = THREE.MathUtils.degToRad(52);
  var heroInView = true;
  var rafId = 0;

  function pauseAutoRotate() {
    controls.autoRotate = false;
    clearTimeout(resumeTimer);
    canvas.classList.add('is-dragging');
  }

  function scheduleAutoRotateResume() {
    clearTimeout(resumeTimer);
    canvas.classList.remove('is-dragging');
    resumeTimer = setTimeout(function () {
      if (reducedMotion || isDragging) return;
      var startAz = controls.getAzimuthalAngle();
      var startPol = controls.getPolarAngle();
      var startTime = performance.now();
      var duration = 400;

      function easeBack(now) {
        var t = Math.min((now - startTime) / duration, 1);
        var eased = t * (2 - t);
        var delta = Math.atan2(
          Math.sin(startAz - defaultAzimuth),
          Math.cos(startAz - defaultAzimuth)
        );
        controls.setAzimuthalAngle(startAz - delta * eased);
        controls.setPolarAngle(startPol + (defaultPolar - startPol) * eased);
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

  controls.addEventListener('start', function () {
    isDragging = true;
    pauseAutoRotate();
  });
  controls.addEventListener('end', function () {
    isDragging = false;
    scheduleAutoRotateResume();
  });

  function frameModel(object, margin) {
    var box = new THREE.Box3().setFromObject(object);
    var size = box.getSize(new THREE.Vector3());
    var center = box.getCenter(new THREE.Vector3());
    var maxSize = Math.max(size.x, size.y, size.z);
    var fovRad = (camera.fov * Math.PI) / 180;
    var fitHeight = maxSize / (2 * Math.tan(fovRad / 2));
    var fitWidth = fitHeight / camera.aspect;
    var distance = (margin || 1.28) * Math.max(fitHeight, fitWidth);
    camera.position.set(center.x, center.y + maxSize * 0.06, center.z + distance);
    controls.target.copy(center);
    controls.update();
    defaultAzimuth = controls.getAzimuthalAngle();
    defaultPolar = controls.getPolarAngle();
    camera.near = Math.max(distance / 200, 0.01);
    camera.far = distance * 200;
    camera.updateProjectionMatrix();
    return center.y;
  }

  var hemiLight = new THREE.HemisphereLight(0xffd666, 0x141c2e, 0.48);
  scene.add(hemiLight);

  var ambient = new THREE.AmbientLight(0x2a3548, 0.32);
  scene.add(ambient);

  var keyLight = new THREE.SpotLight(0xffd666, 2.25, 16, Math.PI / 4.8, 0.42, 1.35);
  keyLight.position.set(1.4, 3.6, 2.2);
  keyLight.target.position.set(0, 0.2, 0);
  scene.add(keyLight);
  scene.add(keyLight.target);

  var fillLight = new THREE.PointLight(0xf4f0e8, 0.48, 12);
  fillLight.position.set(-0.6, 1.4, 3);
  scene.add(fillLight);

  var grassFill = new THREE.PointLight(0x7ed957, 0.32, 10);
  grassFill.position.set(-1.6, 0.8, 2.2);
  scene.add(grassFill);

  var rimLight = new THREE.PointLight(0x7ed957, 0.42, 9);
  rimLight.position.set(-2.2, 1.1, -1);
  scene.add(rimLight);

  var particles = particleCount > 0 ? createForestParticles(particleCount) : null;
  if (particles) scene.add(particles);

  var modelRoot = null;
  var modelBaseY = 0;
  var dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath('/draco/gltf/');
  var loader = new GLTFLoader();
  loader.setDRACOLoader(dracoLoader);
  loader.load(
    '/models/Meshy_AI_Pet.glb',
    function (gltf) {
      modelRoot = gltf.scene;
      modelRoot.traverse(function (child) {
        if (child.isMesh && child.material) {
          child.castShadow = true;
          child.receiveShadow = true;
          var mats = Array.isArray(child.material) ? child.material : [child.material];
          mats.forEach(function (mat) {
            if (mat.emissive) {
              mat.emissive.setHex(0x2a2010);
              mat.emissiveIntensity = 0.12;
            }
            if (mat.roughness !== undefined) mat.roughness = Math.min(mat.roughness, 0.82);
          });
        }
      });

      var box = new THREE.Box3().setFromObject(modelRoot);
      var size = box.getSize(new THREE.Vector3());
      var maxDim = Math.max(size.x, size.y, size.z);
      modelRoot.scale.setScalar(1 / maxDim);

      box.setFromObject(modelRoot);
      var center = box.getCenter(new THREE.Vector3());
      modelRoot.position.set(-center.x, -center.y, -center.z);
      scene.add(modelRoot);

      modelBaseY = modelRoot.position.y;
      frameModel(modelRoot, 1.28);
    },
    undefined,
    function () {
      canvas.setAttribute('aria-label', '3D model loading failed');
    }
  );

  function resize() {
    var rect = canvas.getBoundingClientRect();
    var w = Math.max(rect.width, 280);
    var h = Math.max(rect.height, 280);
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    if (modelRoot) frameModel(modelRoot, 1.28);
    else camera.updateProjectionMatrix();
  }

  var clock = new THREE.Clock();

  function animate() {
    rafId = requestAnimationFrame(animate);
    if (!heroInView) return;

    var t = clock.getElapsedTime();
    if (modelRoot && !reducedMotion && !isDragging) {
      modelRoot.position.y = modelBaseY + Math.sin(t * 0.8) * 0.025;
    } else if (modelRoot && isDragging) {
      modelRoot.position.y = modelBaseY;
    }

    if (particles) updateParticles(particles, t, reducedMotion);

    controls.update();
    renderer.render(scene, camera);
  }

  function startLoop() {
    if (!rafId) animate();
  }

  function stopLoop() {
    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = 0;
    }
  }

  var heroSection = canvas.closest('[data-od-id="hero"]') || canvas.closest('.hero');
  if (heroSection && 'IntersectionObserver' in window) {
    var viewObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          heroInView = entry.isIntersecting;
          if (heroInView) startLoop();
          else stopLoop();
        });
      },
      { threshold: 0.05, rootMargin: '80px 0px' }
    );
    viewObserver.observe(heroSection);
  }

  resize();
  startLoop();

  var resizeTimer = null;
  function onWindowResize() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resize, 120);
  }
  window.addEventListener('resize', onWindowResize, { passive: true });

  return {
    dispose: function () {
      stopLoop();
      clearTimeout(resumeTimer);
      clearTimeout(resizeTimer);
      window.removeEventListener('resize', onWindowResize);
      controls.dispose();
      renderer.dispose();
    },
  };
}

var canvasEl = document.getElementById('hero-3d-canvas');
if (canvasEl) initHeroScene(canvasEl);
