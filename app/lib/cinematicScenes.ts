import * as THREE from "three";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";

export type AnimHandle = {
  stop: () => void;
  setActive: (active: boolean) => void;
};

export type AnimKind = "data" | "ai" | "cloud" | "marketing";

const ACCENT = 0x2563eb;
const ACCENT_LIGHT = 0x8cb4ff;

// Marketing funnel profile — shared by both the dark and light variants. Radius narrows
// from a wide rim at the top down to a thin spout, matching the actual shape of a lead
// generation → conversion funnel rather than an abstract growth line.
const FUNNEL_PROFILE: [number, number][] = [
  [1.6, 1.5],
  [1.35, 1.0],
  [0.95, 0.35],
  [0.5, -0.35],
  [0.18, -1.0],
  [0.1, -1.6],
];

function funnelPointAt(t: number): { r: number; y: number } {
  const clamped = Math.max(0, Math.min(1, t));
  const idx = clamped * (FUNNEL_PROFILE.length - 1);
  const i0 = Math.floor(idx);
  const i1 = Math.min(FUNNEL_PROFILE.length - 1, i0 + 1);
  const frac = idx - i0;
  const [r0, y0] = FUNNEL_PROFILE[i0];
  const [r1, y1] = FUNNEL_PROFILE[i1];
  return { r: r0 + (r1 - r0) * frac, y: y0 + (y1 - y0) * frac };
}

function createFunnelGeometry(): THREE.LatheGeometry {
  const points = FUNNEL_PROFILE.map(([r, y]) => new THREE.Vector2(r, y));
  return new THREE.LatheGeometry(points, 48);
}

function createBaseScene(bloomStrength: number, bloomRadius: number, bloomThreshold: number, canvas: HTMLCanvasElement) {
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
  camera.position.set(0, 0, 5.4);

  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  const bloomPass = new UnrealBloomPass(new THREE.Vector2(1, 1), bloomStrength, bloomRadius, bloomThreshold);
  composer.addPass(bloomPass);
  composer.addPass(new OutputPass());

  const resize = () => {
    const w = canvas.offsetWidth || 1;
    const h = canvas.offsetHeight || 1;
    renderer.setSize(w, h, false);
    composer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    bloomPass.resolution.set(w, h);
  };

  return { renderer, scene, camera, composer, bloomPass, resize };
}

function disposeSceneObjects(scene: THREE.Scene) {
  scene.traverse((obj) => {
    const mesh = obj as THREE.Mesh;
    if (mesh.geometry) mesh.geometry.dispose();
    const mat = mesh.material as THREE.Material | THREE.Material[] | undefined;
    if (Array.isArray(mat)) mat.forEach((m) => m.dispose());
    else mat?.dispose();
  });
}

function disposeAll(scene: THREE.Scene, renderer: THREE.WebGLRenderer, composer: EffectComposer) {
  disposeSceneObjects(scene);
  composer.dispose();
  renderer.dispose();
}

function runLoop(
  canvas: HTMLCanvasElement,
  composer: EffectComposer,
  resize: () => void,
  onFrame: (t: number) => void,
  dispose: () => void
): AnimHandle {
  let active = true;
  let raf = 0;
  let lastW = 0;
  let lastH = 0;
  const startTime = performance.now();

  const frame = (now: number) => {
    if (!active) return;
    const w = canvas.offsetWidth;
    const h = canvas.offsetHeight;
    if (w !== lastW || h !== lastH) {
      lastW = w;
      lastH = h;
      resize();
    }
    // The first rAF timestamp can land fractionally before startTime on some engines —
    // clamp so downstream modulo-indexed animations never see a negative t.
    onFrame(Math.max(0, (now - startTime) * 0.001));
    composer.render();
    raf = requestAnimationFrame(frame);
  };
  raf = requestAnimationFrame(frame);

  return {
    stop: () => {
      active = false;
      cancelAnimationFrame(raf);
      dispose();
    },
    setActive: (next: boolean) => {
      if (next === active) return;
      active = next;
      if (active) raf = requestAnimationFrame(frame);
      else cancelAnimationFrame(raf);
    },
  };
}

// Data — six lines feeding light into a glowing core, slow cinematic tumble.
export function createDataScene(canvas: HTMLCanvasElement): AnimHandle {
  const { renderer, scene, camera, composer, resize } = createBaseScene(1.3, 0.75, 0.1, canvas);

  const group = new THREE.Group();
  scene.add(group);

  const core = new THREE.Mesh(new THREE.IcosahedronGeometry(0.22, 2), new THREE.MeshBasicMaterial({ color: ACCENT }));
  group.add(core);

  const LINE_COUNT = 6;
  const R = 2.3;
  const starts: THREE.Vector3[] = [];
  const pulses: THREE.Mesh[] = [];

  for (let i = 0; i < LINE_COUNT; i++) {
    const theta = (i / LINE_COUNT) * Math.PI * 2;
    const start = new THREE.Vector3(Math.cos(theta) * R, Math.sin(theta) * R * 0.62, (i % 2 === 0 ? 1 : -1) * 0.6);
    starts.push(start);

    const geo = new THREE.BufferGeometry().setFromPoints([start, new THREE.Vector3(0, 0, 0)]);
    const line = new THREE.Line(geo, new THREE.LineBasicMaterial({ color: ACCENT, transparent: true, opacity: 0.32 }));
    group.add(line);

    const pulse = new THREE.Mesh(new THREE.SphereGeometry(0.045, 8, 8), new THREE.MeshBasicMaterial({ color: ACCENT_LIGHT }));
    group.add(pulse);
    pulses.push(pulse);
  }

  const handle = runLoop(
    canvas,
    composer,
    resize,
    (t) => {
      group.rotation.y = t * 0.15;
      group.rotation.x = Math.sin(t * 0.1) * 0.12;
      pulses.forEach((pulse, i) => {
        const offset = (t * 0.35 + i / LINE_COUNT) % 1;
        pulse.position.lerpVectors(starts[i], new THREE.Vector3(0, 0, 0), offset);
      });
      core.scale.setScalar(1 + Math.sin(t * 1.6) * 0.08);
    },
    () => disposeAll(scene, renderer, composer)
  );

  return handle;
}

// AI — a dense volumetric particle cloud with flowing data filaments and glowing energy
// nodes, driven by a custom point-sprite shader (soft circular falloff, additive blending,
// per-particle drift) rather than discrete meshes.
export function createAIScene(canvas: HTMLCanvasElement, intensity = 1): AnimHandle {
  const { renderer, scene, camera, composer, resize } = createBaseScene(
    1.35 * intensity,
    0.85,
    0.05 + (1 - intensity) * 0.25,
    canvas
  );
  camera.fov = 44;
  camera.position.set(0, 0, 7.2);
  camera.updateProjectionMatrix();

  const root = new THREE.Group();
  scene.add(root);

  // Seeded PRNG keeps the particle cloud's shape identical across reloads.
  let seed = 123456789;
  const rand = () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  };

  // Sparse background star-dust — sets the field the network sits in without
  // competing with it for visual weight.
  const PARTICLE_COUNT = 2400;
  const positions = new Float32Array(PARTICLE_COUNT * 3);
  const sizes = new Float32Array(PARTICLE_COUNT);
  const phases = new Float32Array(PARTICLE_COUNT);
  const brightness = new Float32Array(PARTICLE_COUNT);

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const u = rand();
    const v = rand();
    const w = rand();

    const x = (u - 0.5) * 9.5;
    // Thicker in the middle, thinner toward the edges.
    const envelope = 0.55 + 0.85 * Math.sin(Math.PI * Math.min(1, Math.max(0, u)));
    const y = (v - 0.5) * 3.6 * envelope + Math.sin(x * 1.15) * 0.28 + Math.sin(x * 2.4 + w * 3) * 0.12;
    const z = (w - 0.5) * 3.2 + Math.cos(x * 0.95 + v * 2.2) * 0.35;

    const idx = i * 3;
    positions[idx] = x;
    positions[idx + 1] = y;
    positions[idx + 2] = z;

    sizes[i] = 0.9 + rand() * 2.1;
    phases[i] = rand() * Math.PI * 2;
    // A handful of particles become strong bright nodes.
    brightness[i] = (rand() > 0.96 ? 1.6 : 0.2 + rand() * 0.4) * intensity;
  }

  const particleGeometry = new THREE.BufferGeometry();
  particleGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  particleGeometry.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
  particleGeometry.setAttribute("aPhase", new THREE.BufferAttribute(phases, 1));
  particleGeometry.setAttribute("aBrightness", new THREE.BufferAttribute(brightness, 1));

  const particleMaterial = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: {
      uTime: { value: 0 },
      uPixelRatio: { value: Math.min(window.devicePixelRatio, 1.6) },
      uColorA: { value: new THREE.Color(ACCENT) },
      uColorB: { value: new THREE.Color(ACCENT_LIGHT) },
    },
    vertexShader: `
      attribute float aSize;
      attribute float aPhase;
      attribute float aBrightness;
      uniform float uTime;
      uniform float uPixelRatio;
      varying float vBrightness;
      varying float vDepthFade;

      void main() {
        vec3 p = position;
        p.y += sin(uTime * 0.45 + p.x * 1.8 + aPhase) * 0.035;
        p.x += cos(uTime * 0.32 + p.y * 2.1 + aPhase) * 0.025;
        p.z += sin(uTime * 0.38 + p.x * 1.2 + p.y * 1.4) * 0.04;

        vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
        gl_Position = projectionMatrix * mvPosition;

        float depthScale = 13.0 / max(1.0, -mvPosition.z);
        gl_PointSize = aSize * uPixelRatio * depthScale * (0.88 + 0.12 * sin(uTime * 1.6 + aPhase));

        vBrightness = aBrightness;
        vDepthFade = smoothstep(11.0, 3.0, -mvPosition.z);
      }
    `,
    fragmentShader: `
      uniform vec3 uColorA;
      uniform vec3 uColorB;
      varying float vBrightness;
      varying float vDepthFade;

      void main() {
        vec2 p = gl_PointCoord - vec2(0.5);
        float d = length(p);
        if (d > 0.5) discard;

        float alpha = smoothstep(0.5, 0.0, d) * smoothstep(0.5, 0.08, d);
        float hot = smoothstep(0.24, 0.0, d);
        vec3 color = mix(uColorA, uColorB, hot);

        gl_FragColor = vec4(color * vBrightness, alpha * min(1.0, vBrightness) * vDepthFade);
      }
    `,
  });

  const particles = new THREE.Points(particleGeometry, particleMaterial);
  root.add(particles);

  // Constellation network — the dominant structure: nodes scattered through the same
  // elongated band as the star-dust, wired to their nearest neighbors with bright thin
  // lines, so the shape reads as a connected graph rather than a soft cloud.
  const NODE_COUNT = 95;
  const nodePositions: THREE.Vector3[] = [];

  for (let i = 0; i < NODE_COUNT; i++) {
    const u = rand();
    const v = rand();
    const w = rand();
    const x = (u - 0.5) * 8.6;
    const envelope = 0.5 + 0.85 * Math.sin(Math.PI * Math.min(1, Math.max(0, u)));
    const y = (v - 0.5) * 3.0 * envelope + Math.sin(x * 1.1) * 0.25;
    const z = (w - 0.5) * 2.4;
    nodePositions.push(new THREE.Vector3(x, y, z));
  }

  const edgeGroup = new THREE.Group();
  root.add(edgeGroup);
  const edges: { line: THREE.Line; from: THREE.Vector3; to: THREE.Vector3 }[] = [];
  const EDGE_DISTANCE = 1.35;

  for (let i = 0; i < NODE_COUNT; i++) {
    const candidates: { index: number; distance: number }[] = [];
    for (let j = 0; j < NODE_COUNT; j++) {
      if (i === j) continue;
      const distance = nodePositions[i].distanceTo(nodePositions[j]);
      if (distance < EDGE_DISTANCE) candidates.push({ index: j, distance });
    }
    candidates
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 3)
      .forEach(({ index: j, distance }) => {
        if (j < i) return; // avoid duplicate edges
        const geometry = new THREE.BufferGeometry().setFromPoints([nodePositions[i], nodePositions[j]]);
        const opacity = (0.55 - (distance / EDGE_DISTANCE) * 0.35) * intensity;
        const line = new THREE.Line(
          geometry,
          new THREE.LineBasicMaterial({ color: ACCENT, transparent: true, opacity, blending: THREE.AdditiveBlending })
        );
        edgeGroup.add(line);
        edges.push({ line, from: nodePositions[i], to: nodePositions[j] });
      });
  }

  // Node markers — mostly small, a few bright "hub" points for the eye to land on.
  const knots = nodePositions.map((pos, i) => {
    const isHub = i % 11 === 0;
    const mesh = new THREE.Mesh(
      new THREE.SphereGeometry(isHub ? 0.055 : 0.02, 12, 12),
      new THREE.MeshBasicMaterial({
        color: isHub ? ACCENT_LIGHT : ACCENT,
        transparent: true,
        opacity: (isHub ? 0.95 : 0.6) * intensity,
        blending: THREE.AdditiveBlending,
      })
    );
    mesh.position.copy(pos);
    root.add(mesh);
    return { mesh, isHub };
  });

  // A handful of pulses traveling the graph's edges, for a subtle "data flowing" read.
  const PULSE_COUNT = 7;
  const pulses = Array.from({ length: PULSE_COUNT }, (_, i) => {
    const mesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.03, 10, 10),
      new THREE.MeshBasicMaterial({ color: ACCENT_LIGHT, transparent: true, opacity: 0.9 * intensity, blending: THREE.AdditiveBlending })
    );
    root.add(mesh);
    return { mesh, edgeIndex: (i * 13) % Math.max(edges.length, 1), phase: i / PULSE_COUNT, speed: 0.09 + (i % 3) * 0.015 };
  });

  // Foreground dust for parallax depth, added directly to the scene so it doesn't
  // inherit the root group's rotation/breathing.
  const DUST_COUNT = 450;
  const dustPositions = new Float32Array(DUST_COUNT * 3);
  for (let i = 0; i < DUST_COUNT; i++) {
    const idx = i * 3;
    dustPositions[idx] = (rand() - 0.5) * 9.5;
    dustPositions[idx + 1] = (rand() - 0.5) * 5.2;
    dustPositions[idx + 2] = 0.5 + rand() * 2.6;
  }
  const dustGeometry = new THREE.BufferGeometry();
  dustGeometry.setAttribute("position", new THREE.BufferAttribute(dustPositions, 3));
  const dust = new THREE.Points(
    dustGeometry,
    new THREE.PointsMaterial({
      color: ACCENT_LIGHT,
      size: 0.018,
      transparent: true,
      opacity: 0.12 * intensity,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
  );
  scene.add(dust);

  const handle = runLoop(
    canvas,
    composer,
    resize,
    (t) => {
      particleMaterial.uniforms.uTime.value = t;

      root.position.x = Math.sin(t * 0.11) * 0.28;
      root.rotation.y = Math.sin(t * 0.075) * 0.12;
      root.rotation.x = Math.sin(t * 0.06) * 0.045;
      root.rotation.z = Math.sin(t * 0.05) * 0.018;

      const breathe = 1 + Math.sin(t * 0.35) * 0.018;
      root.scale.setScalar(breathe);

      knots.forEach(({ mesh, isHub }, i) => {
        if (!isHub) return;
        const pulse = 1 + Math.sin(t * 1.25 + i * 1.15) * 0.4;
        mesh.scale.setScalar(Math.max(0.6, pulse));
        (mesh.material as THREE.MeshBasicMaterial).opacity = (0.7 + ((Math.sin(t * 1.1 + i * 0.8) + 1) * 0.5) * 0.25) * intensity;
      });

      pulses.forEach((p) => {
        if (!edges.length) return;
        const cycle = t * p.speed + p.phase;
        const edgeStep = Math.floor(cycle) % edges.length;
        const edge = edges[(p.edgeIndex + edgeStep) % edges.length];
        const progress = cycle % 1;
        p.mesh.position.lerpVectors(edge.from, edge.to, progress);
        const fade = Math.sin(progress * Math.PI);
        p.mesh.scale.setScalar(0.5 + fade * 0.9);
        (p.mesh.material as THREE.MeshBasicMaterial).opacity = (0.25 + fade * 0.75) * intensity;
      });

      dust.rotation.y = -t * 0.008;
      dust.position.x = Math.sin(t * 0.045) * 0.22;

      camera.position.x = Math.sin(t * 0.052) * 0.12;
      camera.position.y = Math.cos(t * 0.041) * 0.06;
      camera.lookAt(0, 0, 0);
    },
    () => disposeAll(scene, renderer, composer)
  );

  return handle;
}

// Cloud — a sovereign globe with two tilted orbit rings, camera drifting for parallax.
export function createCloudScene(canvas: HTMLCanvasElement): AnimHandle {
  const { renderer, scene, camera, composer, resize } = createBaseScene(1.1, 0.7, 0.12, canvas);
  camera.position.set(0, 0, 5);

  const group = new THREE.Group();
  scene.add(group);

  const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(1, 32, 32),
    new THREE.MeshBasicMaterial({ color: 0x0d1b33, transparent: true, opacity: 0.9 })
  );
  group.add(sphere);

  const rim = new THREE.Mesh(
    new THREE.SphereGeometry(1.01, 32, 32),
    new THREE.MeshBasicMaterial({ color: ACCENT, wireframe: true, transparent: true, opacity: 0.16 })
  );
  group.add(rim);

  const orbitDefs = [
    { rx: 2.0, ry: 1.5, tiltX: 0.5, tiltZ: 0.2, speed: 0.25, seed: 0 },
    { rx: 2.3, ry: 1.7, tiltX: -0.35, tiltZ: -0.3, speed: -0.18, seed: 3.4 },
  ];

  const orbits = orbitDefs.map((def) => {
    const tiltGroup = new THREE.Group();
    tiltGroup.rotation.x = def.tiltX;
    tiltGroup.rotation.z = def.tiltZ;
    group.add(tiltGroup);

    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(1, 0.008, 8, 96),
      new THREE.MeshBasicMaterial({ color: ACCENT, transparent: true, opacity: 0.4 })
    );
    ring.scale.set(def.rx, def.ry, 1);
    tiltGroup.add(ring);

    const satellite = new THREE.Mesh(new THREE.SphereGeometry(0.045, 12, 12), new THREE.MeshBasicMaterial({ color: 0xffffff }));
    tiltGroup.add(satellite);

    return { satellite, rx: def.rx, ry: def.ry, speed: def.speed, seed: def.seed };
  });

  const handle = runLoop(
    canvas,
    composer,
    resize,
    (t) => {
      group.rotation.y = t * 0.08;
      orbits.forEach((o) => {
        const angle = t * o.speed + o.seed;
        o.satellite.position.set(Math.cos(angle) * o.rx, Math.sin(angle) * o.ry, 0);
      });
      camera.position.x = Math.sin(t * 0.06) * 1.1;
      camera.position.y = Math.sin(t * 0.05) * 0.4;
      camera.lookAt(0, 0, 0);
    },
    () => disposeAll(scene, renderer, composer)
  );

  return handle;
}

// Marketing — a bold ascending growth line with milestone markers and a comet-like pulse
// traveling its length, plus two fainter lines behind it for depth. Reads as literal
// upward growth rather than an abstract shape.
export function createMarketingScene(canvas: HTMLCanvasElement): AnimHandle {
  const { renderer, scene, camera, composer, resize } = createBaseScene(1.3, 0.75, 0.1, canvas);
  camera.fov = 52;
  camera.position.set(0, 0, 6);
  camera.updateProjectionMatrix();
  camera.lookAt(0, 0, 0);

  const group = new THREE.Group();
  scene.add(group);

  const LINE_CONFIGS = [
    { zOffset: 0, amplitude: 1, opacity: 1, radius: 0.028 },
    { zOffset: -0.7, amplitude: 0.7, opacity: 0.35, radius: 0.015 },
    { zOffset: -1.3, amplitude: 0.5, opacity: 0.2, radius: 0.011 },
  ];

  const lines = LINE_CONFIGS.map(({ zOffset, amplitude, opacity, radius }, li) => {
    const SEGMENTS = 10;
    const points: THREE.Vector3[] = [];
    for (let i = 0; i <= SEGMENTS; i++) {
      const f = i / SEGMENTS;
      const x = -4.2 + f * 8.4;
      const climb = f * 2.5 * amplitude;
      const wobble = Math.sin(f * Math.PI * 3 + li) * 0.22 * amplitude - Math.sin(f * Math.PI * 7 + li * 2) * 0.08;
      // Shifted up so the line sits in the lighter upper portion of the section —
      // the closer-look-scrim overlay goes nearly opaque black toward the bottom.
      const y = -0.5 + climb + wobble;
      points.push(new THREE.Vector3(x, y, zOffset));
    }
    const curve = new THREE.CatmullRomCurve3(points);
    const tube = new THREE.Mesh(
      new THREE.TubeGeometry(curve, 140, radius, 8, false),
      new THREE.MeshBasicMaterial({ color: ACCENT, transparent: true, opacity })
    );
    group.add(tube);
    return curve;
  });

  // Milestone markers along the front (brightest) line.
  const MARKERS = [0.15, 0.4, 0.65, 0.9];
  const markers = MARKERS.map((t) => {
    const mesh = new THREE.Mesh(new THREE.SphereGeometry(0.075, 14, 14), new THREE.MeshBasicMaterial({ color: ACCENT_LIGHT }));
    mesh.position.copy(lines[0].getPointAt(Math.min(0.999, Math.max(0.001, t))));
    group.add(mesh);
    return mesh;
  });

  // A comet-like pulse traveling the full length of the front line, on loop.
  const comet = new THREE.Mesh(
    new THREE.SphereGeometry(0.085, 16, 16),
    new THREE.MeshBasicMaterial({ color: ACCENT_LIGHT, transparent: true, opacity: 1 })
  );
  group.add(comet);

  const handle = runLoop(
    canvas,
    composer,
    resize,
    (t) => {
      group.rotation.y = Math.sin(t * 0.05) * 0.1;
      group.position.y = Math.sin(t * 0.12) * 0.06;

      markers.forEach((mesh, i) => {
        const pulse = 1 + Math.sin(t * 1.4 + i * 1.1) * 0.25;
        mesh.scale.setScalar(pulse);
      });

      const progress = (t * 0.09) % 1;
      const safe = Math.min(0.999, Math.max(0.001, progress));
      comet.position.copy(lines[0].getPointAt(safe));
      const fade = progress < 0.05 ? progress / 0.05 : progress > 0.95 ? (1 - progress) / 0.05 : 1;
      (comet.material as THREE.MeshBasicMaterial).opacity = 0.3 + fade * 0.7;
      comet.scale.setScalar(0.7 + fade * 0.5);

      camera.position.x = Math.sin(t * 0.06) * 0.3;
      camera.lookAt(0, 0, 0);
    },
    () => disposeAll(scene, renderer, composer)
  );

  return handle;
}

// ─── Light-background variants — no bloom (reads as a wash on white), real PBR
// shading + studio lighting instead, same setup as WhyAivik's gem. ───

function createLightBaseScene(canvas: HTMLCanvasElement) {
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  // No tone mapping here — ACES filmic (used on the dark/bloom scenes) compresses
  // highlights for HDR overflow, which just desaturates flat colors when there's no
  // bloom to compress. Rendering at true value keeps the blue vivid instead of muddy.
  renderer.toneMapping = THREE.NoToneMapping;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
  camera.position.set(0, 0, 6.2);

  // Kept deliberately dim and blue-tinted rather than white — a strong white key/ambient
  // light mixes with a blue surface and washes it toward pale gray. Emissive blue on the
  // hero materials carries the actual color; these lights only need to define form (shading).
  const key = new THREE.DirectionalLight(0xb3c9f7, 0.85);
  key.position.set(3, 4, 5);
  scene.add(key);
  const fill = new THREE.DirectionalLight(0xdce8ff, 0.5);
  fill.position.set(-4, -2, 3);
  scene.add(fill);
  const rimLight = new THREE.DirectionalLight(ACCENT, 1.3);
  rimLight.position.set(-2, 3, -5);
  scene.add(rimLight);
  scene.add(new THREE.AmbientLight(0xeaf0ff, 0.25));

  const resize = () => {
    const w = canvas.offsetWidth || 1;
    const h = canvas.offsetHeight || 1;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  };

  return { renderer, scene, camera, resize };
}

function runLightLoop(
  canvas: HTMLCanvasElement,
  renderer: THREE.WebGLRenderer,
  scene: THREE.Scene,
  camera: THREE.PerspectiveCamera,
  resize: () => void,
  onFrame: (t: number) => void,
  dispose: () => void
): AnimHandle {
  let active = true;
  let raf = 0;
  let lastW = 0;
  let lastH = 0;
  const startTime = performance.now();

  const frame = (now: number) => {
    if (!active) return;
    const w = canvas.offsetWidth;
    const h = canvas.offsetHeight;
    if (w !== lastW || h !== lastH) {
      lastW = w;
      lastH = h;
      resize();
    }
    // The first rAF timestamp can land fractionally before startTime on some engines —
    // clamp so downstream modulo-indexed animations never see a negative t.
    onFrame(Math.max(0, (now - startTime) * 0.001));
    renderer.render(scene, camera);
    raf = requestAnimationFrame(frame);
  };
  raf = requestAnimationFrame(frame);

  return {
    stop: () => {
      active = false;
      cancelAnimationFrame(raf);
      dispose();
    },
    setActive: (next: boolean) => {
      if (next === active) return;
      active = next;
      if (active) raf = requestAnimationFrame(frame);
      else cancelAnimationFrame(raf);
    },
  };
}

export function createDataSceneLight(canvas: HTMLCanvasElement): AnimHandle {
  const { renderer, scene, camera, resize } = createLightBaseScene(canvas);

  const group = new THREE.Group();
  scene.add(group);

  const core = new THREE.Mesh(
    new THREE.IcosahedronGeometry(0.4, 1),
    new THREE.MeshPhysicalMaterial({
      color: ACCENT,
      emissive: ACCENT,
      emissiveIntensity: 0.85,
      metalness: 0.3,
      roughness: 0.25,
      clearcoat: 0.6,
      clearcoatRoughness: 0.3,
    })
  );
  group.add(core);

  const LINE_COUNT = 6;
  const R = 2.3;
  const starts: THREE.Vector3[] = [];
  const pulses: THREE.Mesh[] = [];

  for (let i = 0; i < LINE_COUNT; i++) {
    const theta = (i / LINE_COUNT) * Math.PI * 2;
    const start = new THREE.Vector3(Math.cos(theta) * R, Math.sin(theta) * R * 0.62, (i % 2 === 0 ? 1 : -1) * 0.6);
    starts.push(start);

    const geo = new THREE.BufferGeometry().setFromPoints([start, new THREE.Vector3(0, 0, 0)]);
    const line = new THREE.Line(geo, new THREE.LineBasicMaterial({ color: ACCENT, transparent: true, opacity: 0.4 }));
    group.add(line);

    const pulse = new THREE.Mesh(
      new THREE.SphereGeometry(0.06, 12, 12),
      new THREE.MeshStandardMaterial({ color: ACCENT, emissive: ACCENT, emissiveIntensity: 0.85, roughness: 0.3 })
    );
    group.add(pulse);
    pulses.push(pulse);
  }

  const handle = runLightLoop(
    canvas,
    renderer,
    scene,
    camera,
    resize,
    (t) => {
      group.rotation.y = t * 0.15;
      group.rotation.x = Math.sin(t * 0.1) * 0.12;
      pulses.forEach((pulse, i) => {
        const offset = (t * 0.35 + i / LINE_COUNT) % 1;
        pulse.position.lerpVectors(starts[i], new THREE.Vector3(0, 0, 0), offset);
      });
      core.scale.setScalar(1 + Math.sin(t * 1.6) * 0.06);
    },
    () => {
      disposeSceneObjects(scene);
      renderer.dispose();
    }
  );

  return handle;
}

// AI — the same constellation-network concept as the dark createAIScene (nodes wired to
// their nearest neighbors, traveling data pulses), rebuilt without additive blending or
// bloom: additive glow adds color onto black to make it brighter, but adds onto white
// does almost nothing (white + anything stays white), so the light variant instead leans
// on solid emissive materials for its "glow," matching the vividness recipe already tuned
// for the other light scenes rather than trying to fake the dark scene's halo directly.
export function createAISceneLight(canvas: HTMLCanvasElement): AnimHandle {
  const { renderer, scene, camera, resize } = createLightBaseScene(canvas);
  camera.position.set(0, 0.1, 6.4);

  const group = new THREE.Group();
  scene.add(group);

  let seed = 987654321;
  const rand = () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  };

  const NODE_COUNT = 70;
  const nodePositions: THREE.Vector3[] = [];
  for (let i = 0; i < NODE_COUNT; i++) {
    const u = rand();
    const v = rand();
    const w = rand();
    const x = (u - 0.5) * 6.4;
    const envelope = 0.5 + 0.85 * Math.sin(Math.PI * Math.min(1, Math.max(0, u)));
    const y = (v - 0.5) * 2.6 * envelope + Math.sin(x * 1.2) * 0.2;
    const z = (w - 0.5) * 1.6;
    nodePositions.push(new THREE.Vector3(x, y, z));
  }

  const edges: { line: THREE.Line; from: THREE.Vector3; to: THREE.Vector3 }[] = [];
  const EDGE_DISTANCE = 1.15;
  for (let i = 0; i < NODE_COUNT; i++) {
    const candidates: { index: number; distance: number }[] = [];
    for (let j = 0; j < NODE_COUNT; j++) {
      if (i === j) continue;
      const distance = nodePositions[i].distanceTo(nodePositions[j]);
      if (distance < EDGE_DISTANCE) candidates.push({ index: j, distance });
    }
    candidates
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 3)
      .forEach(({ index: j, distance }) => {
        if (j < i) return;
        const geometry = new THREE.BufferGeometry().setFromPoints([nodePositions[i], nodePositions[j]]);
        const opacity = 0.5 - (distance / EDGE_DISTANCE) * 0.28;
        const line = new THREE.Line(geometry, new THREE.LineBasicMaterial({ color: ACCENT, transparent: true, opacity }));
        group.add(line);
        edges.push({ line, from: nodePositions[i], to: nodePositions[j] });
      });
  }

  const knots = nodePositions.map((pos, i) => {
    const isHub = i % 9 === 0;
    const mesh = new THREE.Mesh(
      new THREE.SphereGeometry(isHub ? 0.06 : 0.022, 14, 14),
      isHub
        ? new THREE.MeshPhysicalMaterial({
            color: ACCENT,
            emissive: ACCENT,
            emissiveIntensity: 0.9,
            metalness: 0.3,
            roughness: 0.2,
            clearcoat: 0.5,
          })
        : new THREE.MeshBasicMaterial({ color: ACCENT, transparent: true, opacity: 0.75 })
    );
    mesh.position.copy(pos);
    group.add(mesh);
    return { mesh, isHub };
  });

  const PULSE_COUNT = 6;
  const pulses = Array.from({ length: PULSE_COUNT }, (_, i) => {
    const mesh = new THREE.Mesh(new THREE.SphereGeometry(0.032, 10, 10), new THREE.MeshBasicMaterial({ color: ACCENT_LIGHT, transparent: true, opacity: 0.9 }));
    group.add(mesh);
    return { mesh, edgeIndex: (i * 11) % Math.max(edges.length, 1), phase: i / PULSE_COUNT, speed: 0.08 + (i % 3) * 0.015 };
  });

  const handle = runLightLoop(
    canvas,
    renderer,
    scene,
    camera,
    resize,
    (t) => {
      group.rotation.y = Math.sin(t * 0.09) * 0.18;
      group.rotation.x = Math.sin(t * 0.07) * 0.06;

      knots.forEach(({ mesh, isHub }, i) => {
        if (!isHub) return;
        const pulse = 1 + Math.sin(t * 1.2 + i * 1.1) * 0.35;
        mesh.scale.setScalar(Math.max(0.65, pulse));
      });

      pulses.forEach((p) => {
        if (!edges.length) return;
        const cycle = t * p.speed + p.phase;
        const edgeStep = Math.floor(cycle) % edges.length;
        const edge = edges[(p.edgeIndex + edgeStep) % edges.length];
        const progress = cycle % 1;
        p.mesh.position.lerpVectors(edge.from, edge.to, progress);
        const fade = Math.sin(progress * Math.PI);
        p.mesh.scale.setScalar(0.5 + fade * 0.9);
        (p.mesh.material as THREE.MeshBasicMaterial).opacity = 0.3 + fade * 0.7;
      });
    },
    () => {
      disposeSceneObjects(scene);
      renderer.dispose();
    }
  );

  return handle;
}

export function createCloudSceneLight(canvas: HTMLCanvasElement): AnimHandle {
  const { renderer, scene, camera, resize } = createLightBaseScene(canvas);

  const group = new THREE.Group();
  scene.add(group);

  const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(1, 32, 32),
    new THREE.MeshPhysicalMaterial({
      color: ACCENT,
      emissive: ACCENT,
      emissiveIntensity: 0.55,
      metalness: 0.2,
      roughness: 0.3,
      clearcoat: 0.5,
      clearcoatRoughness: 0.3,
    })
  );
  group.add(sphere);

  const rim = new THREE.Mesh(
    new THREE.SphereGeometry(1.01, 32, 32),
    new THREE.MeshBasicMaterial({ color: ACCENT, wireframe: true, transparent: true, opacity: 0.25 })
  );
  group.add(rim);

  const orbitDefs = [
    { rx: 2.0, ry: 1.5, tiltX: 0.5, tiltZ: 0.2, speed: 0.25, seed: 0 },
    { rx: 2.3, ry: 1.7, tiltX: -0.35, tiltZ: -0.3, speed: -0.18, seed: 3.4 },
  ];

  const orbits = orbitDefs.map((def) => {
    const tiltGroup = new THREE.Group();
    tiltGroup.rotation.x = def.tiltX;
    tiltGroup.rotation.z = def.tiltZ;
    group.add(tiltGroup);

    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(1, 0.012, 8, 96),
      new THREE.MeshStandardMaterial({ color: ACCENT, emissive: ACCENT, emissiveIntensity: 0.6, transparent: true, opacity: 0.55, roughness: 0.4 })
    );
    ring.scale.set(def.rx, def.ry, 1);
    tiltGroup.add(ring);

    const satellite = new THREE.Mesh(
      new THREE.SphereGeometry(0.05, 12, 12),
      new THREE.MeshStandardMaterial({ color: ACCENT, emissive: ACCENT, emissiveIntensity: 0.85, roughness: 0.25 })
    );
    tiltGroup.add(satellite);

    return { satellite, rx: def.rx, ry: def.ry, speed: def.speed, seed: def.seed };
  });

  const handle = runLightLoop(
    canvas,
    renderer,
    scene,
    camera,
    resize,
    (t) => {
      group.rotation.y = t * 0.08;
      orbits.forEach((o) => {
        const angle = t * o.speed + o.seed;
        o.satellite.position.set(Math.cos(angle) * o.rx, Math.sin(angle) * o.ry, 0);
      });
      camera.position.x = Math.sin(t * 0.06) * 1.1;
      camera.position.y = Math.sin(t * 0.05) * 0.4;
      camera.lookAt(0, 0, 0);
    },
    () => {
      disposeSceneObjects(scene);
      renderer.dispose();
    }
  );

  return handle;
}

export function createMarketingSceneLight(canvas: HTMLCanvasElement): AnimHandle {
  const { renderer, scene, camera, resize } = createLightBaseScene(canvas);
  camera.position.set(0, 0.1, 5.8);
  camera.lookAt(0, 0, 0);

  const group = new THREE.Group();
  scene.add(group);

  const funnel = new THREE.Mesh(
    createFunnelGeometry(),
    new THREE.MeshPhysicalMaterial({
      color: ACCENT,
      emissive: ACCENT,
      emissiveIntensity: 0.85,
      metalness: 0.2,
      roughness: 0.3,
      clearcoat: 0.5,
      transparent: true,
      opacity: 0.4,
      side: THREE.DoubleSide,
    })
  );
  group.add(funnel);

  [0, 0.35, 0.7, 1].forEach((t) => {
    const { r, y } = funnelPointAt(t);
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(r, 0.01, 8, 64),
      new THREE.MeshStandardMaterial({
        color: ACCENT,
        emissive: ACCENT,
        emissiveIntensity: 0.55,
        transparent: true,
        opacity: 0.6,
        roughness: 0.4,
      })
    );
    ring.rotation.x = Math.PI / 2;
    ring.position.y = y;
    group.add(ring);
  });

  const PARTICLE_COUNT = 26;
  const particles = Array.from({ length: PARTICLE_COUNT }, () => ({
    mesh: new THREE.Mesh(
      new THREE.SphereGeometry(0.04, 12, 12),
      new THREE.MeshStandardMaterial({ color: ACCENT, emissive: ACCENT, emissiveIntensity: 0.85, roughness: 0.25 })
    ),
    phase: Math.random(),
    speed: 0.045 + Math.random() * 0.025,
    angle: Math.random() * Math.PI * 2,
    spin: (Math.random() - 0.5) * 1.5,
  }));
  particles.forEach((p) => group.add(p.mesh));

  const handle = runLightLoop(
    canvas,
    renderer,
    scene,
    camera,
    resize,
    (t) => {
      group.rotation.y = Math.sin(t * 0.06) * 0.15;

      particles.forEach((p) => {
        const progress = (t * p.speed + p.phase) % 1;
        const { r, y } = funnelPointAt(progress);
        const angle = p.angle + t * p.spin * (1 - progress);
        p.mesh.position.set(Math.cos(angle) * r * 0.92, y, Math.sin(angle) * r * 0.92);
        const fade = progress < 0.06 ? progress / 0.06 : progress > 0.92 ? (1 - progress) / 0.08 : 1;
        p.mesh.scale.setScalar(0.5 + fade * 0.7);
      });
    },
    () => {
      disposeSceneObjects(scene);
      renderer.dispose();
    }
  );

  return handle;
}

export const LIGHT_ANIM_MAP: Record<AnimKind, (canvas: HTMLCanvasElement) => AnimHandle> = {
  data: createDataSceneLight,
  ai: createAISceneLight,
  cloud: createCloudSceneLight,
  marketing: createMarketingSceneLight,
};
