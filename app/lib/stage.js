/* stagecraft 1.2 — the WebGL stage that sits behind a page.
   Canonical copy: ~/.claude/skills/stagecraft/assets/stage.js
   Vendored copies carry this header. If a project's copy disagrees with the
   canonical one, the canonical one wins — check before editing a local copy.

   Framework-agnostic on purpose. It knows nothing about scrollcraft, GSAP,
   Vue or React. It takes three numbers — progress, velocity, intensity — and
   draws. Whatever drives the page pushes those in, or it reads the scroll
   itself.

   Two passes into every frame:
     1. a fullscreen quad running a domain-warped fbm that reads as contour
        lines on a depth surface,
     2. an optional rosette of overlapping circles as real line geometry,
        moving along a keyframed path down the page.

   Usage:
     import { createStage } from "./stage.js";
     const stage = createStage({ palette: { accent: "#c9a84c" } });
     // ... later
     stage.destroy();
*/

import * as THREE from "three";

const FIELD_VERT = /* glsl */ `
  void main() { gl_Position = vec4(position.xy, 0.0, 1.0); }
`;

const FIELD_FRAG = /* glsl */ `
  uniform vec2  uRes;
  uniform float uTime;
  uniform float uScroll;
  uniform float uVel;
  uniform vec2  uMouse;
  uniform float uIntensity;
  uniform vec3  uInk;
  uniform vec3  uAccent;
  uniform float uBands;
  uniform float uLineWidth;
  uniform float uGlow;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i),                 hash(i + vec2(1.0, 0.0)), u.x),
               mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
  }

  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    mat2 m = mat2(1.6, 1.2, -1.2, 1.6);
    for (int i = 0; i < 5; i++) {
      v += a * noise(p);
      p = m * p;
      a *= 0.5;
    }
    return v;
  }

  void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * uRes) / uRes.y;

    // Scroll velocity shears the field. This is the whole reason the page
    // feels connected to the scroll rather than decorated by it.
    uv.x += uVel * 0.30 * uv.y;
    uv += uMouse * 0.045;

    vec2 p = uv * 1.55;
    p.y -= uScroll * 2.6;
    float t = uTime * 0.045;

    vec2 q = vec2(fbm(p + t), fbm(p + vec2(3.2, 1.3)));
    vec2 r = vec2(fbm(p + 2.0 * q + vec2(1.7, 9.2) + 0.35 * t),
                  fbm(p + 2.0 * q + vec2(8.3, 2.8) + 0.28 * t));
    float f = fbm(p + 2.6 * r);

    float d = abs(fract(f * uBands + uVel * 1.1) - 0.5);
    float line = 1.0 - smoothstep(0.0, uLineWidth + abs(uVel) * 0.03, d);

    float vig = smoothstep(1.30, 0.12, length(uv * vec2(0.70, 1.0)));

    vec3 col = uInk;
    col += uAccent * line * vig * (0.07 + 0.20 * uIntensity);
    col += uAccent * pow(f, 3.0) * vig * uGlow * uIntensity;

    // Grain. Without it the dark field bands badly on 8-bit displays.
    col += (hash(gl_FragCoord.xy + fract(uTime)) - 0.5) * 0.022;

    gl_FragColor = vec4(col, 1.0);
  }
`;

const MARK_VERT = /* glsl */ `
  uniform float uTime;
  uniform float uVel;
  varying float vDist;

  void main() {
    vec3 p = position;
    float d = length(p.xy);
    vDist = d;
    p.z += sin(d * 7.0 - uTime * 0.9) * (0.02 + abs(uVel) * 0.30);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`;

const MARK_FRAG = /* glsl */ `
  uniform float uOpacity;
  uniform vec3  uAccent;
  varying float vDist;

  void main() {
    // Fade the outer rings so the mark dissolves instead of ending on an edge.
    float a = smoothstep(1.05, 0.34, vDist) * uOpacity * 0.16;
    if (a <= 0.001) discard;
    gl_FragColor = vec4(uAccent, a);
  }
`;

/* Default journey for the mark: [progress, x, y, scale, opacity], linear
   between keys with a smoothstep ease. Data, so retuning the whole path is one
   edit rather than six. */
const DEFAULT_PATH = [
  [0.0, 0.0, 0.05, 1.75, 0.9],
  [0.16, 1.35, 0.55, 1.05, 0.42],
  [0.42, -1.5, -0.3, 0.85, 0.3],
  [0.68, 1.4, 0.2, 0.95, 0.32],
  [0.88, 0.0, 0.0, 1.6, 0.75],
  [1.0, 0.0, 0.0, 1.9, 0.85],
];

function samplePath(path, t) {
  let a = path[0];
  let b = path[path.length - 1];
  for (let i = 0; i < path.length - 1; i++) {
    if (t >= path[i][0] && t <= path[i + 1][0]) {
      a = path[i];
      b = path[i + 1];
      break;
    }
  }
  const span = b[0] - a[0] || 1;
  const k = Math.min(1, Math.max(0, (t - a[0]) / span));
  const e = k * k * (3 - 2 * k);
  return [
    a[1] + (b[1] - a[1]) * e,
    a[2] + (b[2] - a[2]) * e,
    a[3] + (b[3] - a[3]) * e,
    a[4] + (b[4] - a[4]) * e,
  ];
}

/* A rosette: N circles whose centres sit on a circle, each circle `ratio`
   times the centre radius. Supersolid's mark is N=39, ratio=1.3. */
function buildRosette(n, ratio, segments) {
  const centreR = 1 / (1 + ratio); // normalise so the outer radius is 1
  const circleR = centreR * ratio;
  const pts = [];
  for (let i = 0; i < n; i++) {
    const ang = (i / n) * Math.PI * 2;
    const cx = Math.cos(ang) * centreR;
    const cy = Math.sin(ang) * centreR;
    for (let s = 0; s < segments; s++) {
      const t0 = (s / segments) * Math.PI * 2;
      const t1 = ((s + 1) / segments) * Math.PI * 2;
      pts.push(cx + Math.cos(t0) * circleR, cy + Math.sin(t0) * circleR, 0);
      pts.push(cx + Math.cos(t1) * circleR, cy + Math.sin(t1) * circleR, 0);
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
  return geo;
}

/* three parses a CSS colour into its LINEAR working space. These shaders write
   straight to gl_FragColor, which the browser reads as sRGB, so the uniforms
   need the sRGB components back — otherwise every colour renders about half as
   bright. Measured on djinn-site before the fix: asking for rgb(0,140,60) drew
   rgb(2,69,13), and rgb(200,200,200) drew rgb(149,149,149).

   `setClearColor` is not affected: `Color.getHex()` already defaults to sRGB. */
const _c = new THREE.Color();
const _rgb = { r: 0, g: 0, b: 0 };

function srgbTriple(input) {
  _c.set(input).getRGB(_rgb, THREE.SRGBColorSpace);
  return [_rgb.r, _rgb.g, _rgb.b];
}

export function createStage(opts = {}) {
  const {
    canvas: givenCanvas,
    mount = typeof document !== "undefined" ? document.body : null,
    palette = {},
    intensity: initialIntensity = 0.5,
    dpr: dprCap = 1.5,
    mark: markOpts = {},
    field: fieldOpts = {},
    autoScroll = true,
    autoPointer = true,
    groundVar = null,
    reduced = typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  } = opts;

  if (typeof window === "undefined") return null;

  const ink = new THREE.Color(palette.ink ?? "#07070a");
  const accent = new THREE.Color(palette.accent ?? "#c9a84c");
  const inkRGB = srgbTriple(ink);
  const accentRGB = srgbTriple(accent);

  const canvas = givenCanvas ?? document.createElement("canvas");
  if (!givenCanvas) {
    // Explicit size is not optional. A canvas is a replaced element: with
    // `inset: 0` and `width: auto` the box resolves to the *drawing buffer*
    // size, so a DPR-scaled buffer renders larger than the window and the
    // whole scene sits off-centre.
    Object.assign(canvas.style, {
      position: "fixed",
      inset: "0",
      width: "100%",
      height: "100%",
      zIndex: "0",
      pointerEvents: "none",
    });
    canvas.setAttribute("aria-hidden", "true");
    mount?.appendChild(canvas);
  }

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: false,
      alpha: false,
      powerPreference: "high-performance",
    });
  } catch {
    // No WebGL. The page still reads; its own background carries it.
    canvas.style.display = "none";
    return { canvas, destroyed: true, setProgress() {}, setVelocity() {},
             setIntensity() {}, setPointer() {}, render() {}, start() {},
             stop() {}, resize() {}, destroy() {} };
  }

  renderer.setClearColor(ink.getHex(), 1);
  renderer.autoClear = false;

  const fieldScene = new THREE.Scene();
  const fieldCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const fu = {
    uRes: { value: new THREE.Vector2(1, 1) },
    uTime: { value: 0 },
    uScroll: { value: 0 },
    uVel: { value: 0 },
    uMouse: { value: new THREE.Vector2(0, 0) },
    uIntensity: { value: initialIntensity },
    uInk: { value: new THREE.Vector3(...inkRGB) },
    uAccent: { value: new THREE.Vector3(...accentRGB) },
    uBands: { value: fieldOpts.bands ?? 9.0 },
    uLineWidth: { value: fieldOpts.lineWidth ?? 0.022 },
    uGlow: { value: fieldOpts.glow ?? 0.045 },
  };
  const fieldMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(2, 2),
    new THREE.ShaderMaterial({
      vertexShader: FIELD_VERT,
      fragmentShader: FIELD_FRAG,
      uniforms: fu,
      depthTest: false,
      depthWrite: false,
    }),
  );
  // The vertex shader writes clip space directly, so three's frustum test is
  // meaningless here and can throw the whole quad away.
  fieldMesh.frustumCulled = false;
  fieldScene.add(fieldMesh);

  let markScene = null;
  let markCam = null;
  let mark = null;
  let mu = null;
  const path = markOpts.path ?? DEFAULT_PATH;

  if (markOpts !== false) {
    markScene = new THREE.Scene();
    markCam = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    markCam.position.z = 5;
    mu = {
      uTime: { value: 0 },
      uVel: { value: 0 },
      uOpacity: { value: 0.9 },
      uAccent: { value: new THREE.Vector3(...accentRGB) },
    };
    mark = new THREE.LineSegments(
      buildRosette(markOpts.n ?? 39, markOpts.ratio ?? 1.3, markOpts.segments ?? 100),
      new THREE.ShaderMaterial({
        vertexShader: MARK_VERT,
        fragmentShader: MARK_FRAG,
        uniforms: mu,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    );
    mark.frustumCulled = false;
    markScene.add(mark);
  }

  function resize() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    // The fbm is five octaves; at 3x on a retina panel it costs more than the
    // whole rest of the page put together.
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, dprCap));
    renderer.setSize(w, h, false);
    const r = renderer.getPixelRatio();
    fu.uRes.value.set(w * r, h * r);
    if (markCam) {
      markCam.aspect = w / h;
      markCam.updateProjectionMatrix();
    }
  }
  resize();
  window.addEventListener("resize", resize, { passive: true });

  // Targets written from outside; the render loop eases toward them.
  const target = { progress: 0, velocity: 0, intensity: initialIntensity, mx: 0, my: 0 };
  let progress = 0;
  let velocity = 0;
  let intensity = initialIntensity;
  let mx = 0;
  let my = 0;

  function onPointer(e) {
    target.mx = (e.clientX / window.innerWidth) * 2 - 1;
    target.my = -((e.clientY / window.innerHeight) * 2 - 1);
  }
  if (autoPointer) window.addEventListener("pointermove", onPointer, { passive: true });

  // Reading a computed custom property forces a style recalc, so the ground
  // colour is sampled every 10th frame rather than every frame.
  let groundTick = 0;
  function sampleGround(force = false) {
    if (!groundVar) return;
    if (!force && groundTick++ % 10 !== 0) return;
    const raw = getComputedStyle(document.documentElement).getPropertyValue(groundVar).trim();
    if (!raw) return;
    try {
      fu.uInk.value.set(...srgbTriple(raw));
      renderer.setClearColor(_c.getHex(), 1);
    } catch {
      /* not a colour this frame; keep the last one */
    }
  }

  let lastY = window.scrollY;
  function readScroll() {
    if (!autoScroll) return;
    const y = window.scrollY;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    target.progress = max > 0 ? Math.min(1, Math.max(0, y / max)) : 0;
    // px/frame. /45 puts a hard flick near 1.0, which is what the shader's
    // shear term is tuned against.
    const raw = (y - lastY) / 45;
    lastY = y;
    target.velocity = Math.max(-1, Math.min(1, raw));
  }

  const clock = new THREE.Clock();
  let raf = 0;
  let running = false;

  function render(dt = 0, forceGround = false) {
    if (reduced) {
      // No parallax and no shear: a scroll-linked background is exactly what
      // reduced motion asks us not to do.
      target.progress = 0;
      target.velocity = 0;
    } else {
      readScroll();
    }
    sampleGround(forceGround);

    mx += (target.mx - mx) * 0.06;
    my += (target.my - my) * 0.06;
    velocity += (target.velocity - velocity) * 0.12;
    intensity += (target.intensity - intensity) * 0.05;
    progress = target.progress;
    // Lenis and native scroll both stop reporting once the page settles, so
    // the target has to decay here or the field stays sheared.
    target.velocity *= 0.92;

    const time = clock.elapsedTime;
    fu.uTime.value = time;
    fu.uScroll.value = progress;
    fu.uVel.value = velocity;
    fu.uMouse.value.set(mx, my);
    fu.uIntensity.value = intensity;

    if (mark) {
      const [x, y, s, o] = samplePath(path, progress);
      mark.position.set(x, y, 0);
      mark.scale.setScalar(s);
      mu.uOpacity.value = o;
      mu.uTime.value = time;
      mu.uVel.value = velocity;
      mu.uAccent.value.copy(fu.uAccent.value);
      mark.rotation.z += dt * 0.05 + velocity * 0.06;
      mark.rotation.x += (my * 0.22 - mark.rotation.x) * 0.04;
      mark.rotation.y += (mx * 0.22 - mark.rotation.y) * 0.04;
    }

    renderer.clear();
    renderer.render(fieldScene, fieldCam);
    if (markScene) {
      renderer.clearDepth();
      renderer.render(markScene, markCam);
    }
  }

  function frame() {
    raf = requestAnimationFrame(frame);
    if (document.hidden) return;
    render(Math.min(clock.getDelta(), 0.05));
  }

  function start() {
    if (running || reduced) return;
    running = true;
    frame();
  }

  function stop() {
    running = false;
    cancelAnimationFrame(raf);
  }

  // Draw one frame now. Waiting for the first rAF leaves the canvas cleared to
  // flat ink, which is exactly what a backgrounded tab shows forever.
  render(0, true);
  start();

  /* Reduced motion stops the animation, not the page. scrollcraft keeps
     interpolating --sc-canvas as it drifts between acts ("fewer and gentler,
     not zero"), so a stage that drew once would freeze the whole page ground
     at whatever colour it had on load. Redraw one frame per scroll event —
     the colour changes, nothing moves. */
  let staticScroll = null;
  if (reduced && groundVar) {
    staticScroll = () => render(0, true);
    window.addEventListener("scroll", staticScroll, { passive: true });
  }

  return {
    canvas,
    /** 0..1 down the page. */
    setProgress(v) { target.progress = Math.min(1, Math.max(0, v)); },
    /** -1..1. Lenis: velocity / 45. */
    setVelocity(v) { target.velocity = Math.max(-1, Math.min(1, v)); },
    /** 0..1 — how loud the field is. Keep ONE writer for this. */
    setIntensity(v) { target.intensity = Math.min(1, Math.max(0, v)); },
    /** Pointer in clip space, -1..1. */
    setPointer(x, y) { target.mx = x; target.my = y; },
    /** Swap the accent at runtime, e.g. on a theme change. */
    setAccent(hex) {
      fu.uAccent.value.set(...srgbTriple(hex));
    },
    reduced,
    render,
    start,
    stop,
    resize,
    destroy() {
      stop();
      window.removeEventListener("resize", resize);
      if (staticScroll) window.removeEventListener("scroll", staticScroll);
      if (autoPointer) window.removeEventListener("pointermove", onPointer);
      fieldMesh.geometry.dispose();
      fieldMesh.material.dispose();
      if (mark) {
        mark.geometry.dispose();
        mark.material.dispose();
      }
      renderer.dispose();
      if (!givenCanvas) canvas.remove();
    },
  };
}
