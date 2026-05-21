// Hero particle field (Serious mode only).
// Inspired by Google Antigravity's auth-success canvas: GPGPU ping-pong
// position texture + anchor reference + mouse-driven steering, with
// 2-octave simplex noise sway. ~4K particles arranged into PIANO logo
// silhouette.

const TEX_SIZE = 64;                // 64 * 64 = 4096 particles
const PARTICLE_COUNT = TEX_SIZE * TEX_SIZE;
const THREE_VERSION = '0.163.0';

const state = {
  active: false,
  starting: false,
  destroying: false,
  three: null,
  GPUComputationRenderer: null,
  scene: null,
  camera: null,
  renderer: null,
  points: null,
  gpu: null,
  positionVar: null,
  resizeObserver: null,
  pointerHandler: null,
  pointerLeaveHandler: null,
  visibilityHandler: null,
  raf: null,
  startTime: 0,
  lastFrame: 0,
  mouse: null,          // THREE.Vector2 in NDC-ish [-1, 1]
  hoverTarget: 0,
  hoverSmoothed: 0,
  canvas: null,
  container: null,
};

const NOISE_GLSL = /* glsl */ `
  // simplex 3D noise — Ashima / Stefan Gustavson (public domain)
  vec4 permute(vec4 x){ return mod(((x*34.0)+1.0)*x, 289.0); }
  vec4 taylorInvSqrt(vec4 r){ return 1.79284291400159 - 0.85373472095314 * r; }
  float snoise(vec3 v){
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + 1.0 * C.xxx;
    vec3 x2 = x0 - i2 + 2.0 * C.xxx;
    vec3 x3 = x0 - 1. + 3.0 * C.xxx;
    i = mod(i, 289.0);
    vec4 p = permute( permute( permute(
              i.z + vec4(0.0, i1.z, i2.z, 1.0))
            + i.y + vec4(0.0, i1.y, i2.y, 1.0))
            + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    float n_ = 1.0/7.0;
    vec3 ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z *ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x = x_ *ns.x + ns.yyyy;
    vec4 y = y_ *ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4( x.xy, y.xy );
    vec4 b1 = vec4( x.zw, y.zw );
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
    vec3 p0 = vec3(a0.xy,h.x);
    vec3 p1 = vec3(a0.zw,h.y);
    vec3 p2 = vec3(a1.xy,h.z);
    vec3 p3 = vec3(a1.zw,h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }
`;

const SIMULATION_SHADER = /* glsl */ `
  uniform sampler2D uPosRefs;
  uniform vec2 uMousePos;
  uniform float uTime;
  uniform float uDeltaTime;
  uniform float uIsHovering;

  void main() {
    vec2 uv = gl_FragCoord.xy / resolution.xy;
    vec4 pFrame = texture2D(uPosition, uv);
    vec2 refPos = texture2D(uPosRefs, uv).xy;

    vec2 pos = pFrame.xy;
    float scale = pFrame.z;

    // Distance from this particle to the mouse pointer.
    vec2 toMouse = uMousePos - pos;
    float mouseDist = length(toMouse);
    // Closer particles feel the pull more strongly.
    float mouseInfluence = smoothstep(0.55, 0.04, mouseDist) * uIsHovering;

    // Target = anchor, but bent toward mouse when hover & close.
    vec2 targetPos = mix(refPos, uMousePos, mouseInfluence * mouseInfluence);

    // Steering — small acceleration, distance-weighted (Antigravity pattern).
    vec2 dir = normalize(targetPos - pos) * 0.014;
    float dist = length(targetPos - pos);
    float strength = smoothstep(0.35, 0.0, dist);
    if (dist > 0.003) pos += dir * strength;

    // Apply only a fraction of the change → inertial smoothing.
    vec2 diff = (pos - pFrame.xy) * 0.22;

    // Scale: in normally, swell when mouse close.
    float targetScale = 0.55 + mouseInfluence * 1.2;
    scale += (targetScale - scale) * 0.08;

    // Use velocity channel for color mixing in the render pass.
    float velocity = mouseInfluence;

    gl_FragColor = vec4(pFrame.xy + diff, scale, velocity);
  }
`;

const RENDER_VERTEX = /* glsl */ `
  uniform sampler2D uPosition;
  uniform float uTime;
  uniform float uPixelRatio;
  uniform float uIsHovering;

  attribute vec2 ref;
  attribute vec3 seed;

  varying float vVelocity;
  varying float vScale;
  varying vec3  vSeed;

  ${NOISE_GLSL}

  void main() {
    vec4 pData = texture2D(uPosition, ref);
    vec2 pos = pData.xy;
    float scale = pData.z;
    float vel = pData.w;

    // 2-octave drift — gives a "school of fish" undulation even at rest.
    // seed.z phases each particle differently so they don't move in lockstep.
    float phase = seed.z * 6.2831853;
    float nx1 = snoise(vec3(pos * 0.45, uTime * 0.15 + phase));
    float ny1 = snoise(vec3(pos * 0.45 + 31.7, uTime * 0.15 + phase));
    float nx2 = snoise(vec3(pos * 1.8, uTime * 0.55 + 13.1));
    float ny2 = snoise(vec3(pos * 1.8 + 71.3, uTime * 0.55));
    pos += vec2(nx1, ny1) * 0.022;
    pos += vec2(nx2, ny2) * 0.008 * (0.6 + uIsHovering);

    vScale = scale;
    vVelocity = vel;
    vSeed = seed;

    vec4 mvPos = modelViewMatrix * vec4(pos, 0.0, 1.0);
    gl_Position = projectionMatrix * mvPos;

    // Heavy-tailed size variance: mostly small dots with a long tail of
    // bigger ones. Power 2.6 keeps the field airy while letting some bold
    // accents punch through (this is what gives Antigravity its sparkle).
    float sizeFactor = pow(seed.x, 2.6) * 5.5 + 0.35;
    gl_PointSize = (scale * sizeFactor + 0.8) * uPixelRatio;
  }
`;

const RENDER_FRAGMENT = /* glsl */ `
  precision mediump float;
  uniform vec3 uColor1;
  uniform vec3 uColor2;
  uniform vec3 uColor3;
  uniform float uAlpha;
  varying float vVelocity;
  varying float vScale;
  varying vec3  vSeed;

  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float dist = length(uv);
    float disc = smoothstep(0.5, 0.36, dist);
    if (disc < 0.01) discard;

    // Base color reacts to mouse velocity (color flows through 3 stops),
    // and seed.y nudges each particle's hue along the same 3-stop ramp so
    // the field is multi-color even at rest — not a single-cyan mosaic.
    float t = clamp(vVelocity * 0.65 + vSeed.y * 0.55, 0.0, 1.0);
    float h = 0.5;
    vec3 col = mix(
      mix(uColor1, uColor2, clamp(t / h, 0.0, 1.0)),
      mix(uColor2, uColor3, clamp((t - h) / (1.0 - h), 0.0, 1.0)),
      step(h, t)
    );

    float a = disc * uAlpha * smoothstep(0.05, 0.25, vScale);
    gl_FragColor = vec4(col, a);
  }
`;

// ---- Anchor distribution --------------------------------------------------

// Radial falloff: points are densest near the center and fade out toward
// the edges, with horizontal bias so the field reads wide across a hero
// section. No figurative shape — just an ambient particle cloud.
function sampleRadialAnchors(count, aspect) {
  const out = new Float32Array(count * 2);
  // World space follows the orthographic camera: x in [-aspect, aspect],
  // y in [-1, 1]. We let the cloud spill slightly past the viewport so the
  // edges fade smoothly rather than cutting hard.
  const RX = aspect * 1.15;
  const RY = 1.15;
  for (let i = 0; i < count; i++) {
    // Bias r toward the center: r = u^bias, bias > 1 → tighter core.
    const u = Math.random();
    const r = Math.pow(u, 1.6);
    const a = Math.random() * Math.PI * 2;
    out[i * 2 + 0] = Math.cos(a) * r * RX;
    out[i * 2 + 1] = Math.sin(a) * r * RY;
  }
  return out;
}

// ---- Three.js wiring ------------------------------------------------------

async function loadThree() {
  if (state.three && state.GPUComputationRenderer) return;
  const [tMod, gpgpuMod] = await Promise.all([
    import(`https://esm.sh/three@${THREE_VERSION}`),
    import(`https://esm.sh/three@${THREE_VERSION}/examples/jsm/misc/GPUComputationRenderer.js`),
  ]);
  state.three = tMod;
  state.GPUComputationRenderer = gpgpuMod.GPUComputationRenderer;
}

function readCssColor(varName, fallback) {
  const v = getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
  return v || fallback;
}

function colorToVec3(hex, THREE) {
  const c = new THREE.Color(hex);
  return new THREE.Vector3(c.r, c.g, c.b);
}

async function init() {
  if (state.active || state.starting || state.destroying) return;
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const container = document.querySelector('.hero');
  const canvas = container && container.querySelector('canvas.hero-particles');
  if (!container || !canvas) return;

  state.starting = true;
  try {
  await loadThree();
  const THREE = state.three;
  const GPUComputationRenderer = state.GPUComputationRenderer;

  state.container = container;
  state.canvas = canvas;

  const rect = container.getBoundingClientRect();
  const width  = Math.max(1, rect.width  | 0);
  const height = Math.max(1, rect.height | 0);
  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: true, premultipliedAlpha: false });
  renderer.setPixelRatio(dpr);
  renderer.setSize(width, height, false);
  renderer.setClearColor(0x000000, 0);

  // Orthographic [-1, 1] world, aspect-corrected by camera left/right.
  const aspect = width / height;
  const camera = new THREE.OrthographicCamera(-aspect, aspect, 1, -1, 0.1, 10);
  camera.position.z = 1;

  const scene = new THREE.Scene();

  // GPGPU
  const gpu = new GPUComputationRenderer(TEX_SIZE, TEX_SIZE, renderer);
  if (renderer.capabilities.isWebGL2 === false) {
    // GPUComputationRenderer falls back automatically in WebGL1.
  }

  const dtPosition = gpu.createTexture();
  const anchors = sampleRadialAnchors(PARTICLE_COUNT, aspect);

  // Seed each particle slightly away from anchor for a satisfying "settle"
  // animation on first paint.
  const data = dtPosition.image.data;
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const ax = anchors[i * 2 + 0];
    const ay = anchors[i * 2 + 1];
    const jitter = 0.35;
    data[i * 4 + 0] = ax + (Math.random() - 0.5) * jitter;
    data[i * 4 + 1] = ay + (Math.random() - 0.5) * jitter;
    data[i * 4 + 2] = 0.0;                              // scale
    data[i * 4 + 3] = 0.0;                              // velocity
  }

  // Anchor (reference) texture — static.
  const refData = new Float32Array(PARTICLE_COUNT * 4);
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    refData[i * 4 + 0] = anchors[i * 2 + 0];
    refData[i * 4 + 1] = anchors[i * 2 + 1];
    refData[i * 4 + 2] = 0;
    refData[i * 4 + 3] = 0;
  }
  const refTex = new THREE.DataTexture(refData, TEX_SIZE, TEX_SIZE, THREE.RGBAFormat, THREE.FloatType);
  refTex.needsUpdate = true;

  const positionVar = gpu.addVariable('uPosition', SIMULATION_SHADER, dtPosition);
  gpu.setVariableDependencies(positionVar, [positionVar]);
  positionVar.material.uniforms.uPosRefs    = { value: refTex };
  positionVar.material.uniforms.uMousePos   = { value: new THREE.Vector2(99, 99) };
  positionVar.material.uniforms.uTime       = { value: 0 };
  positionVar.material.uniforms.uDeltaTime  = { value: 1 / 60 };
  positionVar.material.uniforms.uIsHovering = { value: 0 };

  const initError = gpu.init();
  if (initError !== null) {
    console.warn('[hero-particles] GPGPU init error:', initError);
    return;
  }

  // Render geometry — one vertex per particle, attribute = ref UV into the
  // texture. `seeds` carries 3 random values per particle that the vertex
  // shader uses to vary size, color tint and noise phase — without this,
  // every particle looks identical and the field reads as a flat mosaic.
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(PARTICLE_COUNT * 3);
  const refs = new Float32Array(PARTICLE_COUNT * 2);
  const seeds = new Float32Array(PARTICLE_COUNT * 3);
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const u = (i % TEX_SIZE) / TEX_SIZE + 0.5 / TEX_SIZE;
    const v = ((i / TEX_SIZE) | 0) / TEX_SIZE + 0.5 / TEX_SIZE;
    refs[i * 2 + 0] = u;
    refs[i * 2 + 1] = v;
    seeds[i * 3 + 0] = Math.random();             // size weight
    seeds[i * 3 + 1] = Math.random();             // hue tilt
    seeds[i * 3 + 2] = Math.random() * Math.PI;   // noise phase
  }
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('ref',  new THREE.BufferAttribute(refs,  2));
  geometry.setAttribute('seed', new THREE.BufferAttribute(seeds, 3));

  // Pull brand colors from CSS custom properties (re-read on theme change).
  const c1 = colorToVec3(readCssColor('--logo-rise', '#57D5FF'), THREE);
  const c2 = colorToVec3(readCssColor('--fg',        '#EDEDED'), THREE);
  const c3 = colorToVec3(readCssColor('--logo-fall', '#FF6F8B'), THREE);

  const material = new THREE.ShaderMaterial({
    uniforms: {
      uPosition:    { value: null },
      uTime:        { value: 0 },
      uPixelRatio:  { value: dpr },
      uIsHovering:  { value: 0 },
      uColor1:      { value: c1 },
      uColor2:      { value: c2 },
      uColor3:      { value: c3 },
      uAlpha:       { value: 0.95 },
    },
    vertexShader: RENDER_VERTEX,
    fragmentShader: RENDER_FRAGMENT,
    transparent: true,
    depthTest: false,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  const points = new THREE.Points(geometry, material);
  scene.add(points);

  // Pointer tracking — convert client coords to the orthographic world.
  const mouse = new THREE.Vector2(99, 99); // off-screen until first move
  const onPointerMove = (e) => {
    const r = container.getBoundingClientRect();
    const nx = ((e.clientX - r.left) / r.width)  * 2 - 1;   // -1..1
    const ny = -(((e.clientY - r.top)  / r.height) * 2 - 1); // -1..1
    // Camera left/right is [-aspect, aspect]; top/bottom is [-1, 1].
    mouse.x = nx * camera.right;
    mouse.y = ny;
    state.hoverTarget = 1;
  };
  const onPointerLeave = () => {
    state.hoverTarget = 0;
    // Park the mouse far outside view so any residual hoverSmoothed during
    // the ease-out doesn't keep pulling particles toward a stale position.
    mouse.x = 99;
    mouse.y = 99;
  };
  // Listen on window so particles still respond when pointer is over the
  // SVG that sits on top of the canvas inside hero__figure.
  window.addEventListener('pointermove', onPointerMove, { passive: true });
  container.addEventListener('pointerleave', onPointerLeave);
  state.pointerHandler = onPointerMove;
  state.pointerLeaveHandler = onPointerLeave;

  // Resize handling — keep the canvas matched to its container box.
  const ro = new ResizeObserver(() => {
    const r = container.getBoundingClientRect();
    const w = Math.max(1, r.width  | 0);
    const h = Math.max(1, r.height | 0);
    renderer.setSize(w, h, false);
    const a = w / h;
    camera.left = -a; camera.right = a;
    camera.top = 1;   camera.bottom = -1;
    camera.updateProjectionMatrix();
  });
  ro.observe(container);
  state.resizeObserver = ro;

  // Pause when tab is hidden.
  const onVisibility = () => {
    if (document.hidden) {
      if (state.raf) { cancelAnimationFrame(state.raf); state.raf = null; }
    } else if (state.active && !state.raf) {
      state.lastFrame = performance.now();
      loop();
    }
  };
  document.addEventListener('visibilitychange', onVisibility);
  state.visibilityHandler = onVisibility;

  state.three = THREE;
  state.GPUComputationRenderer = GPUComputationRenderer;
  state.renderer = renderer;
  state.scene = scene;
  state.camera = camera;
  state.points = points;
  state.gpu = gpu;
  state.positionVar = positionVar;
  state.mouse = mouse;
  state.active = true;
  state.startTime = performance.now();
  state.lastFrame = state.startTime;

  loop();
  } catch (err) {
    console.warn('[hero-particles] init failed:', err);
    state.starting = false;
    destroy();
    return;
  }
  state.starting = false;
}

function loop() {
  if (!state.active) return;
  const now = performance.now();
  const dt = Math.min(0.05, (now - state.lastFrame) / 1000);
  state.lastFrame = now;
  const t = (now - state.startTime) / 1000;

  state.hoverSmoothed += (state.hoverTarget - state.hoverSmoothed) * 0.08;

  const simU = state.positionVar.material.uniforms;
  simU.uMousePos.value.copy(state.mouse);
  simU.uTime.value = t;
  simU.uDeltaTime.value = dt;
  simU.uIsHovering.value = state.hoverSmoothed;

  state.gpu.compute();

  const matU = state.points.material.uniforms;
  matU.uPosition.value = state.gpu.getCurrentRenderTarget(state.positionVar).texture;
  matU.uTime.value = t;
  matU.uIsHovering.value = state.hoverSmoothed;

  state.renderer.render(state.scene, state.camera);
  state.raf = requestAnimationFrame(loop);
}

function destroy() {
  if (!state.active && !state.starting) return;
  state.destroying = true;
  state.active = false;
  if (state.raf) { cancelAnimationFrame(state.raf); state.raf = null; }
  if (state.pointerHandler) {
    window.removeEventListener('pointermove', state.pointerHandler);
    state.pointerHandler = null;
  }
  if (state.pointerLeaveHandler && state.container) {
    state.container.removeEventListener('pointerleave', state.pointerLeaveHandler);
    state.pointerLeaveHandler = null;
  }
  if (state.visibilityHandler) {
    document.removeEventListener('visibilitychange', state.visibilityHandler);
    state.visibilityHandler = null;
  }
  if (state.resizeObserver) { state.resizeObserver.disconnect(); state.resizeObserver = null; }
  try { state.points && state.points.geometry.dispose(); } catch (_) {}
  try { state.points && state.points.material.dispose(); } catch (_) {}
  try { state.gpu && state.gpu.dispose && state.gpu.dispose(); } catch (_) {}
  try { state.renderer && state.renderer.dispose(); } catch (_) {}
  // Do NOT call forceContextLoss — we want to reuse this canvas's GL context
  // when the user toggles serious → pixel → serious. forceContextLoss makes
  // the canvas permanently unusable for WebGL.
  state.scene = null;
  state.camera = null;
  state.points = null;
  state.gpu = null;
  state.positionVar = null;
  state.renderer = null;
  state.mouse = null;
  state.canvas = null;
  state.container = null;
  state.destroying = false;
}

function syncToArtMode() {
  const mode = document.documentElement.getAttribute('data-art');
  if (mode === 'serious') {
    init();
  } else {
    destroy();
  }
}

// Boot: watch art-mode attribute and react.
new MutationObserver(syncToArtMode).observe(
  document.documentElement,
  { attributes: true, attributeFilter: ['data-art'] }
);

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', syncToArtMode, { once: true });
} else {
  syncToArtMode();
}
