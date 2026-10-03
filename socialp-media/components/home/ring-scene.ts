// WebGL scene for the hero ring, written against the raw WebGL API. The scene
// is 14 curved photo panels, one shader and a camera, so a 3D library would
// be ~130 KB of script to parse on every phone for very little. Loaded with a
// dynamic import from HeroRing once the page is idle.

const VERT = /* glsl */ `
  attribute vec3 position;
  attribute vec2 uv;
  uniform mat4 modelMatrix;
  uniform mat4 viewMatrix;
  uniform mat4 projectionMatrix;
  uniform float uRadius;
  varying vec2 vUv;
  varying float vFront;
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
    // Textures are uploaded top row first, so v runs downwards in the image.
    vec2 uv = vec2(vUv.x, 1.0 - vUv.y);
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

// --- 4×4 matrices, column-major (as WebGL expects) ---------------------------

type Mat4 = Float32Array

function multiply(a: Mat4, b: Mat4): Mat4 {
  const out = new Float32Array(16)
  for (let c = 0; c < 4; c++) {
    for (let r = 0; r < 4; r++) {
      out[c * 4 + r] = a[r] * b[c * 4] + a[4 + r] * b[c * 4 + 1] + a[8 + r] * b[c * 4 + 2] + a[12 + r] * b[c * 4 + 3]
    }
  }
  return out
}

const translation = (x: number, y: number, z: number): Mat4 => new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, x, y, z, 1])

function rotationX(a: number): Mat4 {
  const c = Math.cos(a)
  const s = Math.sin(a)
  return new Float32Array([1, 0, 0, 0, 0, c, s, 0, 0, -s, c, 0, 0, 0, 0, 1])
}

function rotationY(a: number): Mat4 {
  const c = Math.cos(a)
  const s = Math.sin(a)
  return new Float32Array([c, 0, -s, 0, 0, 1, 0, 0, s, 0, c, 0, 0, 0, 0, 1])
}

function rotationZ(a: number): Mat4 {
  const c = Math.cos(a)
  const s = Math.sin(a)
  return new Float32Array([c, s, 0, 0, -s, c, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1])
}

function perspective(fovDeg: number, aspect: number, near: number, far: number): Mat4 {
  const f = 1 / Math.tan((fovDeg * Math.PI) / 360)
  const nf = 1 / (near - far)
  return new Float32Array([f / aspect, 0, 0, 0, 0, f, 0, 0, 0, 0, (far + near) * nf, -1, 0, 0, 2 * far * near * nf, 0])
}

// --- Scene ---------------------------------------------------------------------

type Options = {
  textures: string[]
  reduceMotion: boolean
  onReady: () => void
}

const FOV = 30
const R = 5
const SEGMENTS = 28 // per panel, around the curve

/** Builds the ring inside `host`. Returns a disposer, or null if WebGL is unavailable. */
export function createRingScene(host: HTMLElement, { textures, reduceMotion, onReady }: Options): (() => void) | null {
  const canvas = document.createElement('canvas')
  const attrs: WebGLContextAttributes = { antialias: true, alpha: true, premultipliedAlpha: true, depth: true, failIfMajorPerformanceCaveat: true }
  const gl2 = canvas.getContext('webgl2', attrs)
  const ctx = (gl2 ?? canvas.getContext('webgl', attrs)) as WebGLRenderingContext | null
  if (!ctx) return null
  const gl: WebGLRenderingContext = ctx
  // WebGL 1 can't mipmap the non-power-of-two photos; it samples them plainly.
  const mipmaps = Boolean(gl2)

  const program = buildProgram(gl)
  if (!program) return null

  canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;display:block'
  canvas.setAttribute('aria-hidden', 'true')
  host.appendChild(canvas)

  // Geometry: N open cylinder segments, one per photo, in a single buffer.
  // Each panel is a strip of SEGMENTS quads; v = 1 along the top edge.
  const N = textures.length
  const step = (Math.PI * 2) / N
  const theta = step * 0.84
  const width = R * theta
  const H = width * (4 / 3) // textures are 3:4
  const vertsPerPanel = (SEGMENTS + 1) * 2
  const idxPerPanel = SEGMENTS * 6
  const positions = new Float32Array(N * vertsPerPanel * 3)
  const uvs = new Float32Array(N * vertsPerPanel * 2)
  const indices = new Uint16Array(N * idxPerPanel)
  for (let i = 0; i < N; i++) {
    const start = i * step - theta / 2
    const base = i * vertsPerPanel
    for (let row = 0; row < 2; row++) {
      for (let x = 0; x <= SEGMENTS; x++) {
        const u = x / SEGMENTS
        const a = start + u * theta
        const k = base + row * (SEGMENTS + 1) + x
        positions.set([R * Math.sin(a), row === 0 ? H / 2 : -H / 2, R * Math.cos(a)], k * 3)
        uvs.set([u, 1 - row], k * 2)
      }
    }
    for (let x = 0; x < SEGMENTS; x++) {
      const a = base + x
      const b = base + SEGMENTS + 1 + x
      const c = b + 1
      const d = a + 1
      // Counter-clockwise from outside, so the outward face is the front face.
      indices.set([a, b, d, b, c, d], i * idxPerPanel + x * 6)
    }
  }

  const posBuf = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, posBuf)
  gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW)
  const posLoc = gl.getAttribLocation(program, 'position')
  gl.enableVertexAttribArray(posLoc)
  gl.vertexAttribPointer(posLoc, 3, gl.FLOAT, false, 0, 0)

  const uvBuf = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, uvBuf)
  gl.bufferData(gl.ARRAY_BUFFER, uvs, gl.STATIC_DRAW)
  const uvLoc = gl.getAttribLocation(program, 'uv')
  gl.enableVertexAttribArray(uvLoc)
  gl.vertexAttribPointer(uvLoc, 2, gl.FLOAT, false, 0, 0)

  const idxBuf = gl.createBuffer()
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, idxBuf)
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW)

  const u = {
    model: gl.getUniformLocation(program, 'modelMatrix'),
    view: gl.getUniformLocation(program, 'viewMatrix'),
    projection: gl.getUniformLocation(program, 'projectionMatrix'),
    radius: gl.getUniformLocation(program, 'uRadius'),
    map: gl.getUniformLocation(program, 'uMap'),
    shift: gl.getUniformLocation(program, 'uShift'),
    aspect: gl.getUniformLocation(program, 'uAspect'),
  }
  gl.useProgram(program)
  gl.uniform1f(u.radius, R)
  gl.uniform1f(u.aspect, width / H)
  gl.uniform1i(u.map, 0)
  gl.activeTexture(gl.TEXTURE0)
  gl.enable(gl.DEPTH_TEST)
  gl.depthFunc(gl.LEQUAL)
  gl.disable(gl.CULL_FACE) // both sides are drawn; the shader darkens the inside
  gl.disable(gl.BLEND)
  gl.clearColor(0, 0, 0, 0)

  // Photos decode off the main thread (img.decode) and are uploaded one per
  // frame, so the GPU upload never lands as one long task.
  const aniso =
    gl.getExtension('EXT_texture_filter_anisotropic') ||
    gl.getExtension('WEBKIT_EXT_texture_filter_anisotropic') ||
    gl.getExtension('MOZ_EXT_texture_filter_anisotropic')
  const panelTex: (WebGLTexture | null)[] = new Array(N).fill(null)
  const pending: { i: number; img: HTMLImageElement }[] = []
  let settled = 0
  let disposed = false
  const settle = () => {
    settled += 1
    if (settled === N && !disposed) onReady()
  }

  textures.forEach((src, i) => {
    const img = new Image()
    img.decoding = 'async'
    img.src = src
    img
      .decode()
      .then(() => {
        if (!disposed) pending.push({ i, img })
      })
      // A photo that fails to load leaves its panel empty.
      .catch(settle)
  })

  function upload({ i, img }: { i: number; img: HTMLImageElement }) {
    const tex = gl.createTexture()
    gl.bindTexture(gl.TEXTURE_2D, tex)
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false)
    // Use the pixels as stored, without the browser's colour-profile conversion.
    gl.pixelStorei(gl.UNPACK_COLORSPACE_CONVERSION_WEBGL, gl.NONE)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
    if (mipmaps) {
      gl.generateMipmap(gl.TEXTURE_2D)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR)
    } else {
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    }
    if (aniso) {
      const max = gl.getParameter(aniso.MAX_TEXTURE_MAX_ANISOTROPY_EXT) as number
      gl.texParameterf(gl.TEXTURE_2D, aniso.TEXTURE_MAX_ANISOTROPY_EXT, Math.min(8, max))
    }
    panelTex[i] = tex
    settle()
  }

  // Camera and framing: the ring lives in its own box (the hero's right column
  // on desktop, a band under the text on phones), so it never sits behind text.
  // In squarish boxes the camera looks down a little more, so the ring reads as
  // an ellipse that fills the height too.
  let baseTilt = 0.12
  let baseY = 0
  let pivotX = 0
  let tiltX = baseTilt
  let tiltZ = -0.045

  function resize() {
    const w = host.clientWidth
    const h = host.clientHeight
    if (!w || !h) return
    const aspect = w / h
    const tanHalf = Math.tan((FOV * Math.PI) / 360)
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
    const halfW = tanHalf * dist * aspect
    // Keep the ring's left edge inside the box when it sits next to the text.
    pivotX = sideBySide ? Math.max(0, R - 0.95 * halfW) : 0
    baseY = -tanHalf * dist * 0.04

    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    canvas.width = Math.round(w * dpr)
    canvas.height = Math.round(h * dpr)
    gl.viewport(0, 0, canvas.width, canvas.height)
    gl.uniformMatrix4fv(u.projection, false, perspective(FOV, aspect, 0.1, 200))
    gl.uniformMatrix4fv(u.view, false, translation(0, 0, -dist))
  }

  const pointer = { x: 0, y: 0, tx: 0, ty: 0 }
  const onPointer = (e: PointerEvent) => {
    pointer.tx = (e.clientX / window.innerWidth) * 2 - 1
    pointer.ty = (e.clientY / window.innerHeight) * 2 - 1
  }

  let lastScroll = window.scrollY
  let velocity = 0
  let angle = 0
  let shift = 0
  let running = true
  let raf = 0
  let last = performance.now()

  function render() {
    const scrollOffset = Math.min(window.scrollY / window.innerHeight, 1.2)
    // pivot: translate · rotX · rotZ (three.js "XYZ" order); ring spins in it.
    const pivot = multiply(multiply(translation(pivotX, baseY + scrollOffset * 1.2, 0), rotationX(tiltX)), rotationZ(tiltZ))
    gl.uniformMatrix4fv(u.model, false, multiply(pivot, rotationY(angle)))
    gl.uniform1f(u.shift, shift)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    for (let i = 0; i < N; i++) {
      const tex = panelTex[i]
      if (!tex) continue
      gl.bindTexture(gl.TEXTURE_2D, tex)
      gl.drawElements(gl.TRIANGLES, idxPerPanel, gl.UNSIGNED_SHORT, i * idxPerPanel * 2)
    }
  }

  const tick = (now: number) => {
    raf = requestAnimationFrame(tick)
    const next = pending.shift()
    if (next) upload(next)
    if (!running) return
    const dt = Math.min((now - last) / 1000, 0.05)
    last = now

    if (reduceMotion) {
      // Reduced motion: keep a slow, steady turn; no scroll spin, colour
      // split or pointer tilt.
      angle += dt * 0.035
      tiltX = baseTilt
      render()
      return
    }

    // Scrolling spins the ring faster and splits the colour channels a touch.
    const y = window.scrollY
    const dy = y - lastScroll
    lastScroll = y
    velocity += (dy * 0.0016 - velocity) * 0.08

    angle += dt * 0.07 + velocity
    shift += (Math.min(Math.abs(velocity) * 0.35, 0.012) - shift) * 0.12

    pointer.x += (pointer.tx - pointer.x) * 0.04
    pointer.y += (pointer.ty - pointer.y) * 0.04
    tiltX = baseTilt + pointer.y * 0.05
    tiltZ = -0.045 - pointer.x * 0.035

    render()
  }

  const ro = new ResizeObserver(() => {
    resize()
    render()
  })
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

  // If the GPU drops the context, stop drawing; the panel simply goes blank.
  const onLost = () => {
    running = false
    cancelAnimationFrame(raf)
  }
  canvas.addEventListener('webglcontextlost', onLost)

  if (!reduceMotion) window.addEventListener('pointermove', onPointer, { passive: true })
  raf = requestAnimationFrame(tick)

  return () => {
    disposed = true
    cancelAnimationFrame(raf)
    ro.disconnect()
    io.disconnect()
    document.removeEventListener('visibilitychange', onVisibility)
    window.removeEventListener('pointermove', onPointer)
    canvas.removeEventListener('webglcontextlost', onLost)
    panelTex.forEach((t) => t && gl.deleteTexture(t))
    gl.deleteBuffer(posBuf)
    gl.deleteBuffer(uvBuf)
    gl.deleteBuffer(idxBuf)
    gl.deleteProgram(program)
    gl.getExtension('WEBGL_lose_context')?.loseContext()
    canvas.remove()
  }
}

function buildProgram(gl: WebGLRenderingContext): WebGLProgram | null {
  const compile = (type: number, src: string) => {
    const s = gl.createShader(type)
    if (!s) return null
    gl.shaderSource(s, src)
    gl.compileShader(s)
    return s
  }
  const vs = compile(gl.VERTEX_SHADER, VERT)
  const fs = compile(gl.FRAGMENT_SHADER, FRAG)
  const program = gl.createProgram()
  if (!vs || !fs || !program) return null
  gl.attachShader(program, vs)
  gl.attachShader(program, fs)
  gl.linkProgram(program)
  gl.deleteShader(vs)
  gl.deleteShader(fs)
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    gl.deleteProgram(program)
    return null
  }
  return program
}
