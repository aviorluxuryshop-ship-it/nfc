// WebGL scene for the hero ring. Loaded with a dynamic import from HeroRing,
// and uses named imports so the bundler can drop the parts of three.js we
// don't touch.
import {
  CylinderGeometry,
  DoubleSide,
  Group,
  Mesh,
  NoColorSpace,
  PerspectiveCamera,
  Scene,
  ShaderMaterial,
  TextureLoader,
  WebGLRenderer,
} from 'three'

const VERT = /* glsl */ `
  varying vec2 vUv;
  varying float vFront;
  uniform float uRadius;
  void main() {
    vUv = uv;
    vec4 world = modelMatrix * vec4(position, 1.0);
    // 1 on the side facing the camera, 0 at the back.
    vFront = clamp((world.z / uRadius) * 0.5 + 0.5, 0.0, 1.0);
    gl_Position = projectionMatrix * viewMatrix * world;
  }
`

const FRAG = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  varying float vFront;
  uniform sampler2D uMap;
  uniform float uShift;
  uniform float uAspect; // panel width / height

  void main() {
    vec2 uv = vUv;
    if (!gl_FrontFacing) uv.x = 1.0 - uv.x;

    // Rounded corners.
    vec2 p = (vUv - 0.5) * vec2(uAspect, 1.0);
    vec2 b = vec2(uAspect, 1.0) * 0.5 - 0.035;
    float d = length(max(abs(p) - b, 0.0)) - 0.035;
    if (d > 0.0) discard;

    vec2 o = vec2(uShift, 0.0);
    vec3 col = vec3(
      texture2D(uMap, uv + o).r,
      texture2D(uMap, uv).g,
      texture2D(uMap, uv - o).b
    );

    float f = pow(vFront, 1.6);
    float gray = dot(col, vec3(0.299, 0.587, 0.114));
    col = mix(vec3(gray), col, 0.25 + 0.75 * f);
    col *= mix(0.1, 1.0, f);
    if (!gl_FrontFacing) col *= 0.55;

    gl_FragColor = vec4(col, 1.0);
  }
`

type Options = {
  textures: string[]
  reduceMotion: boolean
  onReady: () => void
}

/** Builds the ring inside `host`. Returns a disposer, or null if WebGL is unavailable. */
export function createRingScene(host: HTMLElement, { textures, reduceMotion, onReady }: Options): (() => void) | null {
  let renderer: WebGLRenderer
  try {
    renderer = new WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' })
  } catch {
    return null
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.setClearColor(0x000000, 0)
  renderer.domElement.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;display:block'
  renderer.domElement.setAttribute('aria-hidden', 'true')
  host.appendChild(renderer.domElement)

  const scene = new Scene()
  const camera = new PerspectiveCamera(30, 1, 0.1, 200)
  const ring = new Group()
  const pivot = new Group()
  pivot.add(ring)
  scene.add(pivot)

  const N = textures.length
  const R = 5
  const step = (Math.PI * 2) / N
  const theta = step * 0.84
  const width = R * theta
  const H = width * (4 / 3) // textures are 600×800

  const shift = { value: 0 }
  const loader = new TextureLoader()
  const maxAniso = renderer.capabilities.getMaxAnisotropy()
  const disposables: { dispose: () => void }[] = []
  let loaded = 0
  let disposed = false

  textures.forEach((src, i) => {
    const tex = loader.load(src, () => {
      loaded += 1
      if (loaded === N && !disposed) {
        onReady()
      }
    })
    // Sampled and written as-is (no sRGB decode/encode round trip).
    tex.colorSpace = NoColorSpace
    tex.anisotropy = Math.min(8, maxAniso)
    const geo = new CylinderGeometry(R, R, H, 28, 1, true, i * step - theta / 2, theta)
    const mat = new ShaderMaterial({
      vertexShader: VERT,
      fragmentShader: FRAG,
      side: DoubleSide,
      uniforms: {
        uMap: { value: tex },
        uShift: shift,
        uRadius: { value: R },
        uAspect: { value: width / H },
      },
    })
    ring.add(new Mesh(geo, mat))
    disposables.push(tex, geo, mat)
  })

  // Framing: the ring lives in its own box (the hero's right column on
  // desktop, a band under the text on phones), so it never sits behind text.
  // In squarish boxes the camera looks down a little more, so the ring reads
  // as an ellipse that fills the height too.
  let baseTilt = 0.12
  let baseY = 0
  pivot.rotation.x = baseTilt
  pivot.rotation.z = -0.045

  function resize() {
    const w = host.clientWidth
    const h = host.clientHeight
    if (!w || !h) return
    const aspect = w / h
    camera.aspect = aspect
    const tanHalf = Math.tan((camera.fov * Math.PI) / 360)
    baseTilt = aspect < 1.6 ? 0.28 : 0.12
    // Beside the text (desktop) the ring is drawn large and pushed right so
    // it bleeds off the page edge; alone in a band (phones, tablets) it is
    // centred and only just wider than the screen.
    const sideBySide = host.getBoundingClientRect().left > 40
    const fill = sideBySide ? 1.35 : 1.15
    const distW = R / (fill * tanHalf * aspect)
    // Stay far enough back that the nearest panel, pushed down by the tilt,
    // still fits vertically.
    const drop = R * Math.sin(baseTilt) + H / 2 + 0.3
    const distH = R + drop / (0.9 * tanHalf)
    const dist = Math.max(distW, distH)
    camera.position.set(0, 0, dist)
    camera.lookAt(0, 0, 0)
    camera.updateProjectionMatrix()
    const halfW = tanHalf * dist * aspect
    // Keep the ring's left edge inside the box when it sits next to the text.
    pivot.position.x = sideBySide ? Math.max(0, R - 0.95 * halfW) : 0
    baseY = -tanHalf * dist * 0.04
    renderer.setSize(w, h, false)
  }

  const pointer = { x: 0, y: 0, tx: 0, ty: 0 }
  const onPointer = (e: PointerEvent) => {
    pointer.tx = (e.clientX / window.innerWidth) * 2 - 1
    pointer.ty = (e.clientY / window.innerHeight) * 2 - 1
  }

  let lastScroll = window.scrollY
  let velocity = 0
  let angle = 0
  let running = true
  let raf = 0
  let last = performance.now()

  function render() {
    ring.rotation.y = angle
    const scrollOffset = Math.min(window.scrollY / window.innerHeight, 1.2)
    pivot.position.y = baseY + scrollOffset * 1.2
    renderer.render(scene, camera)
  }

  const tick = (now: number) => {
    raf = requestAnimationFrame(tick)
    if (!running) return
    const dt = Math.min((now - last) / 1000, 0.05)
    last = now

    if (reduceMotion) {
      // Reduced motion: keep a slow, steady turn; no scroll spin, colour
      // split or pointer tilt.
      angle += dt * 0.035
      pivot.rotation.x = baseTilt
      render()
      return
    }

    // Scrolling spins the ring faster and splits the colour channels a touch.
    const y = window.scrollY
    const dy = y - lastScroll
    lastScroll = y
    velocity += (dy * 0.0016 - velocity) * 0.08

    angle += dt * 0.07 + velocity
    shift.value += (Math.min(Math.abs(velocity) * 0.35, 0.012) - shift.value) * 0.12

    pointer.x += (pointer.tx - pointer.x) * 0.04
    pointer.y += (pointer.ty - pointer.y) * 0.04
    pivot.rotation.x = baseTilt + pointer.y * 0.05
    pivot.rotation.z = -0.045 - pointer.x * 0.035

    render()
  }

  const ro = new ResizeObserver(resize)
  ro.observe(host)
  resize()

  // Only animate while the hero is on screen and the tab is visible.
  const io = new IntersectionObserver(([entry]) => {
    running = entry.isIntersecting && document.visibilityState === 'visible'
    last = performance.now()
  })
  io.observe(host)
  const onVisibility = () => {
    running = document.visibilityState === 'visible'
    last = performance.now()
  }
  document.addEventListener('visibilitychange', onVisibility)

  if (!reduceMotion) window.addEventListener('pointermove', onPointer, { passive: true })
  raf = requestAnimationFrame(tick)

  return () => {
    disposed = true
    cancelAnimationFrame(raf)
    ro.disconnect()
    io.disconnect()
    document.removeEventListener('visibilitychange', onVisibility)
    window.removeEventListener('pointermove', onPointer)
    disposables.forEach((d) => d.dispose())
    renderer.dispose()
    renderer.domElement.remove()
  }
}
