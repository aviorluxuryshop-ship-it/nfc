/*
 * VELMO — usage film: a kid spills orange juice on a coloured T-shirt, mom
 * washes it with one VELMO sheet in three steps, it comes out fresh. 32 s,
 * same engine as film.js (pure seek(t), rendered by render.js --page usage.html).
 *
 * Copy is the site's own (lib/i18n, data/products); no new claims.
 *   0–4 the spill · 4–8 mom + box · 8–16 three steps · 16–20 inside the drum
 *   20–24 the clean tee · 24–28 celebration · 28–32 end card
 */
;(() => {
  const Q = new URLSearchParams(location.search)
  const W = +(Q.get('w') || 1920)
  const H = +(Q.get('h') || 1080)
  const LANG = Q.get('lang') === 'en' ? 'en' : 'tr'
  const V = H > W
  const k = V ? W / 1080 : H / 1080
  const DUR = 32

  const COPY = {
    tr: {
      calm: 'Panik yok.',
      enough: 'Bir yaprak yeter.',
      steps: ['Yaprağı makineye koyun', 'Çamaşırları ekleyin', 'Makineyi çalıştırın'],
      noMeasure: 'Ölçmek yok. Dökülme yok.',
      dissolve: 'Suyla temas edince hızla çözünür.',
      fresh: 'Taze, canlı ve temiz.',
      colours: 'Renkleri canlı tutar.',
      forColour: 'Renkli çamaşırlar için.',
      endLine: 'Bir yaprak. Bir yıkama.',
      eyebrow: 'Renkli çamaşırlar için deterjan yaprağı',
      cta: 'Kokunu Seç, Satın Al',
      madeIn: 'Türkiye’de üretildi',
    },
    en: {
      calm: 'No panic.',
      enough: 'One sheet is enough.',
      steps: ['Put a sheet in the machine', 'Add your laundry', 'Start the machine'],
      noMeasure: 'No measuring. No spills.',
      dissolve: 'Dissolves fast as soon as it meets water.',
      fresh: 'Fresh, vibrant and clean.',
      colours: 'Keeps colours bright.',
      forColour: 'Made for coloured laundry.',
      endLine: 'One sheet. One wash.',
      eyebrow: 'Detergent sheets for coloured laundry',
      cta: 'Pick Your Scent',
      madeIn: 'Made in Türkiye',
    },
  }
  const c = COPY[LANG]

  const C = {
    ink: '#16214A', inkSoft: '#454E70', inkMute: '#767D97',
    paper: '#FCFBF8', cream: '#F5F1E9', deep: '#ECE6DA', line: '#E6E0D4',
    lav: '#6E4FA8', lavSoft: '#EEE8F6', lavDeep: '#45306E',
    bah: '#3E8A60', bahSoft: '#E7F2EA', bahDeep: '#245338',
    nar: '#D9701A', narSoft: '#FCEEDC', narDeep: '#87420A',
    leaf: '#2E7A47', blue: '#3C7FC2', coral: '#F28BA8',
  }
  const RIBBON = ['#6E4FA8', '#8466C6', '#7FB2E5', '#9FD08E', '#F8DB76', '#F7AE62', '#F28BA8']
  const SCENTS = [
    { slug: 'lavanta', main: C.lav, soft: C.lavSoft, deep: C.lavDeep, bg: ['#F1ECF9', '#D9CCF0'] },
    { slug: 'bahar', main: C.bah, soft: C.bahSoft, deep: C.bahDeep, bg: ['#EAF4EC', '#C9E4D2'] },
    { slug: 'narenciye', main: C.nar, soft: C.narSoft, deep: C.narDeep, bg: ['#FDF1E2', '#F8D3A6'] },
  ]
  const GRAD = `linear-gradient(95deg, ${C.lav} 0%, #B05FA0 45%, ${C.nar} 100%)`

  // ── math ──────────────────────────────────────────────────────────────
  const clamp = (v, a = 0, b = 1) => (v < a ? a : v > b ? b : v)
  const mix = (a, b, p) => a + (b - a) * p
  const E = {
    lin: (x) => x,
    in2: (x) => x * x,
    in3: (x) => x * x * x,
    out2: (x) => 1 - (1 - x) ** 2,
    out3: (x) => 1 - (1 - x) ** 3,
    out4: (x) => 1 - (1 - x) ** 4,
    out5: (x) => 1 - (1 - x) ** 5,
    io2: (x) => (x < 0.5 ? 2 * x * x : 1 - (-2 * x + 2) ** 2 / 2),
    io3: (x) => (x < 0.5 ? 4 * x ** 3 : 1 - (-2 * x + 2) ** 3 / 2),
    io4: (x) => (x < 0.5 ? 8 * x ** 4 : 1 - (-2 * x + 2) ** 4 / 2),
    outExpo: (x) => (x >= 1 ? 1 : 1 - 2 ** (-10 * x)),
    ioExpo: (x) => (x <= 0 ? 0 : x >= 1 ? 1 : x < 0.5 ? 2 ** (20 * x - 10) / 2 : (2 - 2 ** (-20 * x + 10)) / 2),
    outBack: (x) => 1 + 2.70158 * (x - 1) ** 3 + 1.70158 * (x - 1) ** 2,
    outBackSoft: (x) => 1 + 2.1 * (x - 1) ** 3 + 1.1 * (x - 1) ** 2,
    outBounce: (x) => {
      const n = 7.5625, d = 2.75
      if (x < 1 / d) return n * x * x
      if (x < 2 / d) return n * (x -= 1.5 / d) * x + 0.75
      if (x < 2.5 / d) return n * (x -= 2.25 / d) * x + 0.9375
      return n * (x -= 2.625 / d) * x + 0.984375
    },
  }
  const P = (t, a, b, e = E.out3) => e(clamp((t - a) / (b - a)))
  function rng(seed) {
    return () => {
      seed |= 0
      seed = (seed + 0x6d2b79f5) | 0
      let r = Math.imul(seed ^ (seed >>> 15), 1 | seed)
      r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r
      return ((r ^ (r >>> 14)) >>> 0) / 4294967296
    }
  }

  // ── DOM helpers ───────────────────────────────────────────────────────
  const stage = document.getElementById('stage')
  stage.style.width = W + 'px'
  stage.style.height = H + 'px'
  const px = (v) => `${(v * k).toFixed(2)}px`

  function el(html, parent = stage) {
    const tpl = document.createElement('template')
    tpl.innerHTML = html.trim()
    const n = tpl.content.firstElementChild
    parent.appendChild(n)
    return n
  }
  /** Anchor point (ax, ay) of n at (x, y); rotation and scale happen about it. */
  function put(n, x, y, o = {}) {
    const { ax = 0.5, ay = 0.5, s = 1, sx, sy, r = 0, a, pre = '' } = o
    n.style.transformOrigin = `${ax * 100}% ${ay * 100}%`
    n.style.transform = `translate3d(${x.toFixed(2)}px,${y.toFixed(2)}px,0) translate(${-ax * 100}%,${-ay * 100}%) ${pre} rotate(${r.toFixed(3)}deg) scale(${(sx ?? s).toFixed(4)},${(sy ?? s).toFixed(4)})`
    if (a !== undefined) n.style.opacity = clamp(a).toFixed(3)
  }
  const words = (text, cls = '', style = '') =>
    text.split(' ').map((w) => `<span class="m"><span class="mi ${cls}" style="${style}">${w}</span></span>`).join(' ')
  const letters = (text) => [...text].map((ch) => `<span class="m"><span class="mi">${ch}</span></span>`).join('')
  /** Masked rise of every .mi inside n, one after another. */
  function rise(n, t, t0, { dur = 0.75, stagger = 0.07, e = E.out4, tilt = 5, out } = {}) {
    n.querySelectorAll('.mi').forEach((w, i) => {
      const p = P(t, t0 + i * stagger, t0 + i * stagger + dur, e)
      let y = (1 - p) * 118
      if (out) y -= P(t, out + i * 0.03, out + i * 0.03 + 0.45, E.in3) * 118
      w.style.transform = `translate3d(0,${y.toFixed(2)}%,0) rotate(${((1 - p) * tilt).toFixed(2)}deg)`
    })
  }
  /** Long lines (English runs longer) shrink to fit `max` px once fonts are in. */
  const fits = []
  const fit = (n, max) => (fits.push([n, max]), n)
  const svgIcon = (name, color, size, sw = 2) =>
    BRAND.icons[name].replace('<svg', `<svg width="${size}" height="${size}" style="color:${color};display:block" `).replace(/stroke-width="2"/, `stroke-width="${sw}"`)
  const brandSvg = (key, style) => BRAND[key].replace('<svg', `<svg style="display:block;${style}"`)

  function layer(bg = 'transparent') {
    const n = el(`<div class="layer" style="background:${bg}"><div class="cam"></div></div>`)
    return [n, n.firstElementChild]
  }
  function glow(parent, color, size, alpha = 0.55) {
    return el(
      `<div class="glow" style="width:${px(size)};height:${px(size)};background:radial-gradient(circle, ${color} 0%, transparent 68%);opacity:${alpha}"></div>`,
      parent,
    )
  }
  function bubbles(parent, n, seed, { min = 26, max = 96, speed = [60, 150], area = [0, 1] } = {}) {
    const r = rng(seed)
    const list = []
    for (let i = 0; i < n; i++) {
      const size = mix(min, max, r() ** 1.6) * k
      const node = el(`<div class="bubble" style="width:${size}px;height:${size}px"><i class="rim"></i><i class="body"></i></div>`, parent)
      list.push({ node, size, x: mix(area[0], area[1], r()) * W, sp: mix(speed[0], speed[1], r()) * k, ph: r() * 10, wob: mix(10, 34, r()) * k, f: mix(0.6, 1.4, r()), rot: r() * 360 })
    }
    return (t, alpha = 1) => {
      for (const b of list) {
        const span = H + b.size * 2
        const y = H + b.size - (((t + b.ph) * b.sp) % span)
        const x = b.x + Math.sin((t + b.ph) * b.f * 1.7) * b.wob
        const edge = clamp((y + b.size) / (H * 0.25)) * clamp((H + b.size - y) / (H * 0.12))
        put(b.node, x, y, { s: 1 + Math.sin(t * 2.3 + b.ph) * 0.04, r: b.rot + t * 20, a: alpha * edge })
      }
    }
  }
  const clipNone = (n) => (n.style.clipPath = 'none')
  const clipCircle = (n, x, y, r) => (n.style.clipPath = `circle(${Math.max(0, r).toFixed(1)}px at ${x.toFixed(1)}px ${y.toFixed(1)}px)`)
  const clipPoly = (n, pts) => (n.style.clipPath = `polygon(${pts.map(([x, y]) => `${x.toFixed(1)}px ${y.toFixed(1)}px`).join(',')})`)
  const FAR = Math.hypot(W, H)

  // A sheet of the real proportions (11 × 28 cm).
  function sheet(parent, h, cls = '') {
    const w = (h * 11) / 28
    const n = el(`<div class="sheet ${cls}" style="width:${w}px;height:${h}px"><div class="sheen"></div></div>`, parent)
    return { n, w, h, sheen: n.firstElementChild }
  }

  // ── the rainbow ribbon wipe (the box's ribbon, swept across the frame) ──
  const RW = (V ? 0.62 : 0.4) * W
  const SLOPE = Math.tan((16 * Math.PI) / 180)
  const wipeSvg = el(`<svg class="layer" style="z-index:50;pointer-events:none" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${RIBBON.map((col) => `<polygon fill="${col}"/>`).join('')}</svg>`)
  const wipeStripes = [...wipeSvg.children]
  /** p∈[0,1] sweeps the ribbon across; returns the x of the boundary at mid-height. */
  function wipe(t, t0, t1, dir, incoming, outgoing) {
    const sw = RW / 7
    const ext = (H / 2) * SLOPE
    let mid = null
    wipeStripes.forEach((s, i) => {
      const j = dir > 0 ? i : 6 - i
      const p = P(t, t0 + j * 0.004, t1 + j * 0.004, E.io3)
      const c0 = dir > 0 ? mix(-RW - ext - 40, W + ext + 40, p) : mix(W + ext + 40, -RW - ext - 40, p)
      const left = dir > 0 ? c0 + (6 - i) * sw : c0 + i * sw
      const x0 = left - sw * 0.25
      const x1 = left + sw * 1.25
      s.setAttribute('points', `${x0 - ext},${H + 2} ${x1 - ext},${H + 2} ${x1 + ext},-2 ${x0 + ext},-2`)
      if (i === 3) mid = (x0 + x1) / 2
    })
    const active = t >= t0 - 0.01 && t <= t1 + 0.2
    wipeSvg.style.display = active ? '' : 'none'
    if (!active) return
    const top = mid + ext
    const bot = mid - ext
    const leftSide = [[-10, -10], [top, -10], [bot, H + 10], [-10, H + 10]]
    const rightSide = [[top, -10], [W + 10, -10], [W + 10, H + 10], [bot, H + 10]]
    const inc = dir > 0 ? leftSide : rightSide
    const out = dir > 0 ? rightSide : leftSide
    incoming.forEach((n) => clipPoly(n, inc))
    outgoing.forEach((n) => clipPoly(n, out))
  }

  const scenes = []
  const scene = (a, b, node, update) => scenes.push({ a, b, node, update })

  // ═════════════════════════════════════════════════════════════════════
  // Drawing kit: SVG worlds with a camera, two characters, props
  // ═════════════════════════════════════════════════════════════════════
  const NS = 'http://www.w3.org/2000/svg'
  function sv(parent, markup) {
    const g = document.createElementNS(NS, 'g')
    g.innerHTML = markup.trim()
    let first = null
    for (const n of [...g.childNodes]) {
      if (n.nodeType === 1 && !first) first = n
      parent.appendChild(n)
    }
    return first
  }
  const tf = (n, s) => n.setAttribute('transform', s)
  const show = (n, on) => (n.style.display = on ? '' : 'none')
  const f2 = (v) => (+v).toFixed(2)

  /** A full-frame SVG whose content lives in 1920×1080 "world" units, framed by a camera. */
  function world(parent) {
    const svg = el(`<svg class="layer" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><defs></defs><g></g></svg>`, parent)
    const g = svg.lastElementChild
    const base = V ? W / 1080 : W / 1920
    return {
      svg,
      g,
      defs: svg.firstElementChild,
      cam(cx, cy, z = 1) {
        const s = base * z
        tf(g, `translate(${f2(W / 2 - cx * s)} ${f2(H / 2 - cy * s)}) scale(${s.toFixed(5)})`)
      },
      /** world → screen px (for HTML overlays that follow something in the world) */
      toScreen(cx, cy, z, x, y) {
        const s = base * z
        return [W / 2 + (x - cx) * s, H / 2 + (y - cy) * s]
      },
    }
  }

  /** Two-bone IK: elbow/knee position for a limb from S reaching for T. */
  function ik(S, T, l1, l2, bend) {
    let dx = T[0] - S[0]
    let dy = T[1] - S[1]
    let d = Math.hypot(dx, dy) || 1
    const dmax = l1 + l2 - 0.5
    const dmin = Math.abs(l1 - l2) + 0.5
    if (d > dmax) (dx *= dmax / d), (dy *= dmax / d), (d = dmax)
    if (d < dmin) (dx *= dmin / d), (dy *= dmin / d), (d = dmin)
    const a = Math.acos(clamp((l1 * l1 + d * d - l2 * l2) / (2 * l1 * d), -1, 1)) * bend
    const ux = dx / d
    const uy = dy / d
    return [
      [S[0] + l1 * (ux * Math.cos(a) - uy * Math.sin(a)), S[1] + l1 * (ux * Math.sin(a) + uy * Math.cos(a))],
      [S[0] + dx, S[1] + dy],
    ]
  }
  const rot = ([x, y], [px, py], deg) => {
    const a = (deg * Math.PI) / 180
    const c = Math.cos(a)
    const s = Math.sin(a)
    return [px + (x - px) * c - (y - py) * s, py + (x - px) * s + (y - py) * c]
  }
  /** A soft blob outline (stains, puddles). */
  function blob(cx, cy, r, seed, n = 14, jag = 0.45) {
    const R = rng(seed)
    const pts = Array.from({ length: n }, (_, i) => {
      const a = (i / n) * Math.PI * 2
      const rr = r * (1 - jag / 2 + jag * R())
      return [cx + Math.cos(a) * rr, cy + Math.sin(a) * rr]
    })
    const mid = (p, q) => [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2]
    let d = `M ${mid(pts[n - 1], pts[0]).map(f2).join(' ')}`
    for (let i = 0; i < n; i++) d += ` Q ${pts[i].map(f2).join(' ')} ${mid(pts[i], pts[(i + 1) % n]).map(f2).join(' ')}`
    return d + ' Z'
  }
  /** Natural blinking: how closed the eyes are at t (0 open … 1 shut). */
  const blinkAt = (t, seed) => {
    const ph = (t + seed) % 3.1
    return ph < 0.15 ? Math.sin((Math.PI * ph) / 0.15) : 0
  }
  /** Brand art inside SVG, with its ids made unique per copy. */
  let uid = 0
  function brandIn(key, x, y, w) {
    const n = ++uid
    let s = BRAND[key]
    const ids = [...s.matchAll(/id="([^"]+)"/g)].map((m) => m[1])
    for (const id of ids) s = s.split(`id="${id}"`).join(`id="${id}u${n}"`).split(`url(#${id})`).join(`url(#${id}u${n})`)
    const vb = s.match(/viewBox="([^"]+)"/)[1].split(' ').map(Number)
    const h = (w * vb[3]) / vb[2]
    return s.replace('<svg ', `<svg x="${f2(x - w / 2)}" y="${f2(y - h / 2)}" width="${f2(w)}" height="${f2(h)}" `)
  }
  const star = (r) => `M 0 ${-r} Q ${r * 0.18} ${-r * 0.18} ${r} 0 Q ${r * 0.18} ${r * 0.18} 0 ${r} Q ${-r * 0.18} ${r * 0.18} ${-r} 0 Q ${-r * 0.18} ${-r * 0.18} 0 ${-r} Z`

  // ── the kid ──────────────────────────────────────────────────────────
  const KC = { skin: '#F6C9A4', shade: '#E7AE85', hair: '#5A3A28', tee: '#79B3EA', teeShade: '#5E9BD6', pants: '#3E5C99', shoe: '#F28BA8', mouth: '#7A3B2E', stain: '#D9832C' }
  const STRIPES = ['#8466C6', '#F28BA8', '#F8DB76', '#9FD08E', '#F7AE62']
  const TEE = 'M -30 -258 Q 0 -250 30 -258 L 60 -246 Q 66 -240 66 -228 L 64 -128 Q 64 -114 52 -114 L -52 -114 Q -64 -114 -64 -128 L -66 -228 Q -66 -240 -60 -246 Z'
  const TANK = 'M -24 -258 L -42 -258 Q -46 -210 -62 -194 L -64 -128 Q -64 -114 -52 -114 L 52 -114 Q 64 -114 64 -128 L 62 -194 Q 46 -210 42 -258 L 24 -258 Q 0 -226 -24 -258 Z'
  const stainMarkup = (cx, cy, r, seed) =>
    `<path d="${blob(cx, cy, r, seed)}" fill="${KC.stain}" opacity=".9"/><path d="${blob(cx + 4, cy + 3, r * 0.55, seed + 5)}" fill="#B9661A" opacity=".45"/>` +
    [[-1.25, -0.6, 0.18], [1.3, -0.35, 0.14], [0.9, 1.15, 0.16], [-0.8, 1.2, 0.12], [-1.5, 0.5, 0.1]].map(([dx, dy, rr]) => `<circle cx="${f2(cx + dx * r)}" cy="${f2(cy + dy * r)}" r="${f2(r * rr)}" fill="${KC.stain}" opacity=".85"/>`).join('')

  function kid(parent) {
    const id = `kid${++uid}`
    const stripes = STRIPES.map((col, i) => `<rect x="-70" y="${-216 + i * 4.6}" width="140" height="4.9" fill="${col}"/>`).join('')
    const g = sv(
      parent,
      `<g>
        <defs><clipPath id="${id}c"><path d="${TEE}"/></clipPath></defs>
        <g class="lg">
          <path class="lgL" fill="none" stroke="${KC.pants}" stroke-width="32" stroke-linecap="round" stroke-linejoin="round"/>
          <path class="lgR" fill="none" stroke="${KC.pants}" stroke-width="32" stroke-linecap="round" stroke-linejoin="round"/>
          <ellipse class="shL" rx="24" ry="12" fill="${KC.shoe}"/><ellipse class="shR" rx="24" ry="12" fill="${KC.shoe}"/>
        </g>
        <g class="bd">
          <rect x="-62" y="-146" width="124" height="34" rx="14" fill="${KC.pants}"/>
          <g class="tee">
            <path d="${TEE}" fill="${KC.tee}"/>
            <path d="M 30 -256 L 60 -246 Q 66 -240 66 -228 L 64 -128 Q 64 -114 52 -114 L 40 -114 Q 52 -180 30 -256 Z" fill="${KC.teeShade}" opacity=".5"/>
            <g clip-path="url(#${id}c)">${stripes}</g>
            <g class="stain" opacity="0">${stainMarkup(10, -196, 30, 3)}</g>
            <path d="M -30 -258 Q 0 -236 30 -258" fill="none" stroke="${KC.teeShade}" stroke-width="6" stroke-linecap="round"/>
          </g>
          <g class="tank" style="display:none"><path d="${TANK}" fill="#FFFFFF"/><path d="M 40 -256 Q 46 -210 62 -194 L 64 -128 Q 64 -114 52 -114 L 44 -114 Q 52 -190 40 -256 Z" fill="#E4EAF2"/></g>
          <path class="arL" fill="none" stroke="${KC.skin}" stroke-width="21" stroke-linecap="round" stroke-linejoin="round"/>
          <path class="arR" fill="none" stroke="${KC.skin}" stroke-width="21" stroke-linecap="round" stroke-linejoin="round"/>
          <path class="slL" fill="none" stroke="${KC.tee}" stroke-width="31" stroke-linecap="round"/>
          <path class="slR" fill="none" stroke="${KC.tee}" stroke-width="31" stroke-linecap="round"/>
          <circle class="hdL" r="13" fill="${KC.skin}"/><circle class="hdR" r="13" fill="${KC.skin}"/>
          <g class="hd">
            <rect x="-13" y="-278" width="26" height="26" rx="8" fill="${KC.shade}"/>
            <circle cx="-72" cy="-330" r="15" fill="${KC.skin}"/><circle cx="72" cy="-330" r="15" fill="${KC.skin}"/>
            <circle cx="-72" cy="-330" r="7" fill="${KC.shade}"/><circle cx="72" cy="-330" r="7" fill="${KC.shade}"/>
            <circle cx="0" cy="-332" r="76" fill="${KC.skin}"/>
            <path d="M -78 -330 C -84 -392 -40 -424 4 -422 C 52 -420 84 -392 78 -330 C 70 -350 58 -362 40 -366 C 30 -352 10 -352 0 -362 C -12 -350 -36 -350 -44 -364 C -60 -360 -72 -348 -78 -330 Z" fill="${KC.hair}"/>
            <circle cx="-14" cy="-420" r="18" fill="${KC.hair}"/><circle cx="12" cy="-428" r="16" fill="${KC.hair}"/><circle cx="32" cy="-414" r="13" fill="${KC.hair}"/>
            <g class="eyL"><ellipse rx="9" ry="11" fill="#2A1B14"/><circle cx="3" cy="-4" r="3.2" fill="#fff"/></g>
            <g class="eyR"><ellipse rx="9" ry="11" fill="#2A1B14"/><circle cx="3" cy="-4" r="3.2" fill="#fff"/></g>
            <path class="eyC" d="M -36 -326 Q -26 -316 -16 -326 M 16 -326 Q 26 -316 36 -326" fill="none" stroke="#2A1B14" stroke-width="4.5" stroke-linecap="round" style="display:none"/>
            <path class="brL" d="M -38 -352 Q -26 -360 -14 -352" fill="none" stroke="${KC.hair}" stroke-width="5" stroke-linecap="round"/>
            <path class="brR" d="M 14 -352 Q 26 -360 38 -352" fill="none" stroke="${KC.hair}" stroke-width="5" stroke-linecap="round"/>
            <circle cx="-46" cy="-300" r="12" fill="#F4978E" opacity=".45"/><circle cx="46" cy="-300" r="12" fill="#F4978E" opacity=".45"/>
            <path d="M -5 -312 Q 0 -306 5 -312" fill="none" stroke="${KC.shade}" stroke-width="3" stroke-linecap="round"/>
            <g class="mo">
              <path data-m="smile" d="M -15 -296 Q 0 -282 15 -296" fill="none" stroke="${KC.mouth}" stroke-width="5" stroke-linecap="round"/>
              <g data-m="grin"><path d="M -20 -298 Q 0 -266 20 -298 Z" fill="${KC.mouth}"/><path d="M -16 -297 L 16 -297 L 14 -292 L -14 -292 Z" fill="#fff"/><path d="M -10 -281 Q 0 -274 10 -281 Q 0 -286 -10 -281 Z" fill="#E46D6D"/></g>
              <ellipse data-m="o" cx="0" cy="-289" rx="9" ry="12" fill="${KC.mouth}"/>
              <path data-m="sheep" d="M -14 -291 Q -7 -297 0 -291 Q 7 -285 14 -291" fill="none" stroke="${KC.mouth}" stroke-width="4.5" stroke-linecap="round"/>
              <path data-m="bliss" d="M -19 -297 Q 0 -279 19 -297" fill="none" stroke="${KC.mouth}" stroke-width="5" stroke-linecap="round"/>
            </g>
          </g>
        </g>
      </g>`,
    )
    const q = (s) => g.querySelector(s)
    const r = {
      g, lg: q('.lg'), bd: q('.bd'), hd: q('.hd'), tee: q('.tee'), tank: q('.tank'), stain: q('.stain'),
      arL: q('.arL'), arR: q('.arR'), slL: q('.slL'), slR: q('.slR'), hdL: q('.hdL'), hdR: q('.hdR'),
      lgL: q('.lgL'), lgR: q('.lgR'), shL: q('.shL'), shR: q('.shR'),
      eyL: q('.eyL'), eyR: q('.eyR'), eyC: q('.eyC'), brL: q('.brL'), brR: q('.brR'), mouths: [...g.querySelectorAll('[data-m]')],
    }
    /**
     * o: x, y (feet, world), s, lean, head, headDy, look [dx,dy], mouth, eyes ('open'|'wide'|'closed'), blink,
     *    brow (dy; negative = raised), worried, hands {L,R} world points, feet {L,R} local, outfit, stain, legs
     */
    r.pose = (o) => {
      const s = o.s || 1
      const lean = o.lean || 0
      tf(g, `translate(${f2(o.x)} ${f2(o.y)}) scale(${s})`)
      tf(r.bd, `rotate(${f2(lean)} 0 -120)`)
      tf(r.hd, `translate(0 ${f2(o.headDy || 0)}) rotate(${f2(o.head || 0)} 0 -262)`)
      show(r.lg, o.legs !== false)
      const tee = (o.outfit || 'tee') === 'tee'
      show(r.tee, tee)
      show(r.tank, !tee)
      show(r.slL, tee)
      show(r.slR, tee)
      r.stain.setAttribute('opacity', clamp(o.stain || 0).toFixed(3))
      if (o.stain > 0) tf(r.stain, `translate(10 -196) scale(${f2(0.35 + 0.65 * clamp(o.stain))}) translate(-10 196)`)
      // world hand targets → body-local (undo position, scale and lean)
      const local = (p) => rot([(p[0] - o.x) / s, (p[1] - o.y) / s], [0, -120], -lean)
      const hands = o.hands || {}
      const arm = (side, S, def, bend, ar, sl, hd) => {
        const T = hands[side] ? local(hands[side]) : def
        const [E, Hh] = ik(S, T, 58, 54, bend)
        ar.setAttribute('d', `M ${f2(S[0])} ${f2(S[1])} L ${f2(E[0])} ${f2(E[1])} L ${f2(Hh[0])} ${f2(Hh[1])}`)
        sl.setAttribute('d', `M ${f2(S[0])} ${f2(S[1])} L ${f2(S[0] + (E[0] - S[0]) * 0.42)} ${f2(S[1] + (E[1] - S[1]) * 0.42)}`)
        tf(hd, `translate(${f2(Hh[0])} ${f2(Hh[1])})`)
      }
      arm('L', [-56, -242], [-74, -140], 1, r.arL, r.slL, r.hdL)
      arm('R', [56, -242], [74, -140], -1, r.arR, r.slR, r.hdR)
      const feet = o.feet || {}
      const leg = (side, Hp, def, bend, path, shoe) => {
        const T = feet[side] || def
        const [Kn, F] = ik(Hp, T, 56, 56, bend)
        path.setAttribute('d', `M ${f2(Hp[0])} ${f2(Hp[1])} L ${f2(Kn[0])} ${f2(Kn[1])} L ${f2(F[0])} ${f2(F[1])}`)
        tf(shoe, `translate(${f2(F[0] + (side === 'L' ? -4 : 4))} ${f2(F[1] + 6)})`)
      }
      leg('L', [-22, -122], [-24, -12], 1, r.lgL, r.shL)
      leg('R', [22, -122], [24, -12], -1, r.lgR, r.shR)
      const [lx, ly] = o.look || [0, 0]
      const b = clamp(o.blink || 0)
      const wide = o.eyes === 'wide' ? 1.18 : 1
      tf(r.eyL, `translate(${f2(-26 + lx)} ${f2(-326 + ly)}) scale(${wide} ${f2(Math.max(0.08, (1 - b) * wide))})`)
      tf(r.eyR, `translate(${f2(26 + lx)} ${f2(-326 + ly)}) scale(${wide} ${f2(Math.max(0.08, (1 - b) * wide))})`)
      const closed = o.eyes === 'closed'
      show(r.eyL, !closed)
      show(r.eyR, !closed)
      show(r.eyC, closed)
      const by = o.brow || 0
      const w = o.worried ? 9 : 0
      tf(r.brL, `translate(0 ${f2(by)}) rotate(${-w} -26 -352)`)
      tf(r.brR, `translate(0 ${f2(by)}) rotate(${w} 26 -352)`)
      r.mouths.forEach((m) => show(m, m.dataset.m === (o.mouth || 'smile')))
    }
    return r
  }

  // ── the mom ──────────────────────────────────────────────────────────
  const MC = { skin: '#EDB48C', shade: '#D99A70', hair: '#3B2618', top: '#8466C6', topShade: '#6E4FA8', pants: '#E6D7BD', shoe: '#4A3427', mouth: '#7A3B2E' }
  const TOP = 'M -26 -492 Q 0 -480 26 -492 L 66 -478 Q 78 -472 78 -456 L 72 -318 Q 72 -300 56 -300 L -56 -300 Q -72 -300 -72 -318 L -78 -456 Q -78 -472 -66 -478 Z'
  function mom(parent) {
    const g = sv(
      parent,
      `<g>
        <g class="lg">
          <path class="lgL" fill="none" stroke="${MC.pants}" stroke-width="50" stroke-linecap="round" stroke-linejoin="round"/>
          <path class="lgR" fill="none" stroke="${MC.pants}" stroke-width="50" stroke-linecap="round" stroke-linejoin="round"/>
          <ellipse class="shL" rx="34" ry="14" fill="${MC.shoe}"/><ellipse class="shR" rx="34" ry="14" fill="${MC.shoe}"/>
        </g>
        <g class="bd">
          <rect x="-68" y="-330" width="136" height="44" rx="16" fill="${MC.pants}"/>
          <path d="M 30 -600 C 92 -612 112 -540 98 -480 C 92 -448 70 -452 74 -486 C 78 -530 62 -560 30 -576 Z" fill="${MC.hair}"/>
          <circle cx="44" cy="-596" r="9" fill="#F8DB76"/>
          <path d="${TOP}" fill="${MC.top}"/>
          <path d="M 26 -490 L 66 -478 Q 78 -472 78 -456 L 72 -318 Q 72 -300 56 -300 L 46 -300 Q 60 -400 26 -490 Z" fill="${MC.topShade}" opacity=".55"/>
          <rect x="-72" y="-318" width="144" height="18" rx="8" fill="${MC.topShade}"/>
          <path d="M -20 -491 L 0 -458 L 20 -491 Q 0 -484 -20 -491 Z" fill="${MC.skin}"/>
          <path class="arL" fill="none" stroke="${MC.top}" stroke-width="30" stroke-linecap="round" stroke-linejoin="round"/>
          <path class="arR" fill="none" stroke="${MC.top}" stroke-width="30" stroke-linecap="round" stroke-linejoin="round"/>
          <circle class="hdL" r="17" fill="${MC.skin}"/><circle class="hdR" r="17" fill="${MC.skin}"/>
          <g class="hd">
            <rect x="-11" y="-512" width="22" height="28" rx="8" fill="${MC.shade}"/>
            <circle cx="-57" cy="-556" r="11" fill="${MC.skin}"/><circle cx="57" cy="-556" r="11" fill="${MC.skin}"/>
            <circle cx="-57" cy="-540" r="4.5" fill="#F8DB76"/><circle cx="57" cy="-540" r="4.5" fill="#F8DB76"/>
            <circle cx="0" cy="-560" r="58" fill="${MC.skin}"/>
            <path d="M -61 -556 C -68 -612 -30 -642 4 -640 C 42 -638 68 -612 61 -556 C 56 -584 38 -602 12 -606 C -8 -590 -36 -584 -61 -556 Z" fill="${MC.hair}"/>
            <g class="eyL"><ellipse rx="6.5" ry="8" fill="#2A1B14"/><circle cx="2" cy="-3" r="2.3" fill="#fff"/></g>
            <g class="eyR"><ellipse rx="6.5" ry="8" fill="#2A1B14"/><circle cx="2" cy="-3" r="2.3" fill="#fff"/></g>
            <path class="eyC" d="M -27 -556 Q -20 -549 -13 -556 M 13 -556 Q 20 -549 27 -556" fill="none" stroke="#2A1B14" stroke-width="3.5" stroke-linecap="round" style="display:none"/>
            <path class="brL" d="M -29 -576 Q -20 -582 -11 -577" fill="none" stroke="${MC.hair}" stroke-width="4" stroke-linecap="round"/>
            <path class="brR" d="M 11 -577 Q 20 -582 29 -576" fill="none" stroke="${MC.hair}" stroke-width="4" stroke-linecap="round"/>
            <circle cx="-34" cy="-533" r="9" fill="#F08A80" opacity=".4"/><circle cx="34" cy="-533" r="9" fill="#F08A80" opacity=".4"/>
            <path d="M -4 -542 Q 0 -536 4 -542" fill="none" stroke="${MC.shade}" stroke-width="3" stroke-linecap="round"/>
            <g class="mo">
              <path data-m="smile" d="M -15 -528 Q 0 -514 15 -528" fill="none" stroke="${MC.mouth}" stroke-width="4.5" stroke-linecap="round"/>
              <g data-m="grin"><path d="M -17 -530 Q 0 -505 17 -530 Z" fill="${MC.mouth}"/><path d="M -13 -529 L 13 -529 L 11 -525 L -11 -525 Z" fill="#fff"/></g>
              <ellipse data-m="talk" cx="0" cy="-524" rx="7" ry="6" fill="${MC.mouth}"/>
            </g>
          </g>
        </g>
      </g>`,
    )
    const q = (s) => g.querySelector(s)
    const r = {
      g, bd: q('.bd'), hd: q('.hd'), lg: q('.lg'), arL: q('.arL'), arR: q('.arR'), hdL: q('.hdL'), hdR: q('.hdR'),
      lgL: q('.lgL'), lgR: q('.lgR'), shL: q('.shL'), shR: q('.shR'), eyL: q('.eyL'), eyR: q('.eyR'), eyC: q('.eyC'),
      brL: q('.brL'), brR: q('.brR'), mouths: [...g.querySelectorAll('[data-m]')],
    }
    r.pose = (o) => {
      const s = o.s || 1
      const lean = o.lean || 0
      tf(g, `translate(${f2(o.x)} ${f2(o.y)}) scale(${s})`)
      tf(r.bd, `rotate(${f2(lean)} 0 -304)`)
      tf(r.hd, `rotate(${f2(o.head || 0)} 0 -500)`)
      const local = (p) => rot([(p[0] - o.x) / s, (p[1] - o.y) / s], [0, -304], -lean)
      const hands = o.hands || {}
      const arm = (side, S, def, bend, ar, hd) => {
        const T = hands[side] ? local(hands[side]) : def
        const [E, Hh] = ik(S, T, 122, 114, bend)
        ar.setAttribute('d', `M ${f2(S[0])} ${f2(S[1])} L ${f2(E[0])} ${f2(E[1])} L ${f2(Hh[0])} ${f2(Hh[1])}`)
        tf(hd, `translate(${f2(Hh[0])} ${f2(Hh[1])})`)
      }
      arm('L', [-62, -468], [-92, -270], 1, r.arL, r.hdL)
      arm('R', [62, -468], [92, -270], -1, r.arR, r.hdR)
      const feet = o.feet || {}
      const leg = (side, Hp, def, bend, path, shoe) => {
        const T = feet[side] || def
        const [Kn, F] = ik(Hp, T, 146, 146, bend)
        path.setAttribute('d', `M ${f2(Hp[0])} ${f2(Hp[1])} L ${f2(Kn[0])} ${f2(Kn[1])} L ${f2(F[0])} ${f2(F[1])}`)
        tf(shoe, `translate(${f2(F[0] + (side === 'L' ? -6 : 6))} ${f2(F[1] + 8)})`)
      }
      leg('L', [-26, -304], [-30, -14], 1, r.lgL, r.shL)
      leg('R', [26, -304], [30, -14], -1, r.lgR, r.shR)
      const [lx, ly] = o.look || [0, 0]
      const b = clamp(o.blink || 0)
      tf(r.eyL, `translate(${f2(-20 + lx)} ${f2(-556 + ly)}) scale(1 ${f2(Math.max(0.08, 1 - b))})`)
      tf(r.eyR, `translate(${f2(20 + lx)} ${f2(-556 + ly)}) scale(1 ${f2(Math.max(0.08, 1 - b))})`)
      const closed = o.eyes === 'closed'
      show(r.eyL, !closed)
      show(r.eyR, !closed)
      show(r.eyC, closed)
      tf(r.brL, `translate(0 ${f2(o.brow || 0)})`)
      tf(r.brR, `translate(0 ${f2(o.brow || 0)})`)
      r.mouths.forEach((m) => show(m, m.dataset.m === (o.mouth || 'smile')))
    }
    return r
  }
  /** Walking feet for a front-facing character: alternate lifts and a little stride. */
  const walkFeet = (ph, stride, lift, fx, fy = -14) => ({
    L: [-fx + Math.sin(ph) * stride, fy - Math.max(0, Math.sin(ph)) * lift],
    R: [fx - Math.sin(ph) * stride, fy - Math.max(0, -Math.sin(ph)) * lift],
  })

  // ── props ────────────────────────────────────────────────────────────
  const TEE_FLAT = 'M -36 -64 Q 0 -50 36 -64 L 74 -42 L 58 -6 L 42 -16 L 42 62 Q 42 70 34 70 L -34 70 Q -42 70 -42 62 L -42 -16 L -58 -6 L -74 -42 Z'
  function teeProp(parent, color = KC.tee, stripes = true, stained = color === KC.tee) {
    const id = `tp${++uid}`
    const sh = color === KC.tee ? KC.teeShade : 'rgba(22,33,74,.12)'
    return sv(
      parent,
      `<g>
        <defs><clipPath id="${id}"><path d="${TEE_FLAT}"/></clipPath></defs>
        <path d="${TEE_FLAT}" fill="${color}"/>
        <path d="M 20 -60 L 36 -64 L 74 -42 L 58 -6 L 42 -16 L 42 62 Q 42 70 34 70 L 24 70 Q 36 0 20 -60 Z" fill="${sh}" opacity=".45"/>
        ${stripes ? `<g clip-path="url(#${id})">${STRIPES.map((col, i) => `<rect x="-80" y="${-26 + i * 4.6}" width="160" height="4.9" fill="${col}"/>`).join('')}</g>` : ''}
        <g class="stain">${stained ? stainMarkup(6, -10, 28, 3) : ''}</g>
        <path d="M -36 -64 Q 0 -42 36 -64" fill="none" stroke="${sh}" stroke-width="6" stroke-linecap="round"/>
      </g>`,
    )
  }
  const SOCK = 'M -14 -44 L 14 -44 L 14 14 Q 14 26 28 26 L 36 26 Q 48 26 48 40 Q 48 54 34 54 L -2 54 Q -16 54 -16 38 Z'
  const sockProp = (parent, color = '#F7AE62') => sv(parent, `<g><path d="${SOCK}" fill="${color}"/><rect x="-14" y="-44" width="28" height="12" fill="#fff" opacity=".7"/></g>`)
  const sheetProp = (parent) =>
    sv(parent, `<g><rect x="-21" y="-53" width="42" height="106" rx="4" fill="#FFFFFF" stroke="#E2DACB" stroke-width="2"/>${[0, 1, 2, 3, 4, 5].map((i) => `<circle cx="${-10 + (i % 3) * 10}" cy="${-30 + Math.floor(i / 3) * 40}" r="1.6" fill="#E6E0D3"/>`).join('')}</g>`)
  const sparkles = (parent, n, color = '#FFFFFF') => Array.from({ length: n }, () => sv(parent, `<path d="${star(16)}" fill="${color}"/>`))

  // ── the washing machine (front-loader, world units, body x 640–1120, y 380–900) ──
  function machine(w) {
    const p = `m${++uid}`
    sv(
      w.defs,
      `<linearGradient id="${p}b" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFFFFF"/><stop offset="1" stop-color="#EEF1F6"/></linearGradient>
       <linearGradient id="${p}c" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#F4F6FA"/><stop offset=".5" stop-color="#C9D1DC"/><stop offset="1" stop-color="#E9EDF3"/></linearGradient>
       <radialGradient id="${p}g" cx=".4" cy=".35" r=".8"><stop offset="0" stop-color="#9EC3E6" stop-opacity=".55"/><stop offset="1" stop-color="#2D4A6E" stop-opacity=".75"/></radialGradient>
       <radialGradient id="${p}d" cx=".5" cy=".45" r=".6"><stop offset="0" stop-color="#7C8798"/><stop offset="1" stop-color="#3E4757"/></radialGradient>
       <clipPath id="${p}k"><circle cx="880" cy="680" r="128"/></clipPath>`,
    )
    const holes = Array.from({ length: 24 }, (_, i) => {
      const a = (i / 24) * Math.PI * 2
      return `<circle cx="${f2(880 + Math.cos(a) * 112)}" cy="${f2(680 + Math.sin(a) * 112)}" r="4" fill="#2B3240" opacity=".45"/>`
    }).join('')
    const g = sv(
      w.g,
      `<g>
        <ellipse cx="880" cy="908" rx="280" ry="18" fill="#16214A" opacity=".1"/>
        <rect x="672" y="888" width="44" height="20" rx="6" fill="#9AA3B2"/><rect x="1044" y="888" width="44" height="20" rx="6" fill="#9AA3B2"/>
        <g class="sk">
          <rect x="640" y="380" width="480" height="520" rx="32" fill="url(#${p}b)"/>
          <rect x="1092" y="394" width="18" height="492" rx="9" fill="#E2E7EF"/>
          <rect x="640" y="468" width="480" height="5" fill="#E3E8EF"/>
          <rect x="668" y="400" width="130" height="50" rx="11" fill="#F2F5F9" stroke="#DCE2EA" stroke-width="3"/>
          <rect x="700" y="420" width="66" height="8" rx="4" fill="#D3DAE4"/>
          <rect x="830" y="402" width="150" height="46" rx="12" fill="#1E2A4A"/>
          <circle cx="860" cy="425" r="13" fill="none" stroke="#33426A" stroke-width="5"/>
          <path class="prog" fill="none" stroke="#7FB2E5" stroke-width="5" stroke-linecap="round"/>
          <path class="chk" d="M 853 425 L 858 431 L 868 418" fill="none" stroke="#9FD08E" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" opacity="0"/>
          <rect class="led" x="884" y="417" width="80" height="16" rx="5" fill="#2A3A62"/>
          <rect class="ledOn" x="884" y="417" width="0" height="16" rx="5" fill="#7FB2E5" opacity=".85"/>
          <circle cx="1025" cy="425" r="21" fill="url(#${p}c)" stroke="#C3CAD5" stroke-width="2"/>
          <line class="knob" x1="1025" y1="425" x2="1025" y2="410" stroke="#6B7484" stroke-width="4" stroke-linecap="round"/>
          <circle class="glow" cx="1083" cy="425" r="17" fill="none" stroke="#B9A6F2" stroke-width="6" opacity="0"/>
          <g class="btn"><circle cx="1083" cy="425" r="17" fill="#6E4FA8"/><path d="M 1078 416 L 1091 425 L 1078 434 Z" fill="#fff"/></g>
          <g class="open">
            <circle cx="880" cy="680" r="152" fill="#4A5363"/>
            <circle cx="880" cy="680" r="132" fill="url(#${p}d)"/>
            ${holes}
            <g class="pile"></g>
          </g>
          <g class="door">
            <circle cx="880" cy="680" r="176" fill="url(#${p}c)"/>
            <circle cx="880" cy="680" r="152" fill="#F3F5F9"/>
            <circle cx="880" cy="680" r="140" fill="#D5DCE6"/>
            <g clip-path="url(#${p}k)">
              <circle cx="880" cy="680" r="130" fill="#56627A"/>
              <g class="inside"></g>
              <path class="wtr" fill="#5E9BD6" opacity=".55"/>
              <circle cx="880" cy="680" r="130" fill="url(#${p}g)"/>
            </g>
            <path d="M 790 600 A 120 120 0 0 1 906 562" fill="none" stroke="#fff" stroke-width="10" stroke-linecap="round" opacity=".75"/>
            <path d="M 968 752 A 120 120 0 0 1 944 772" fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round" opacity=".55"/>
            <rect x="1046" y="646" width="16" height="68" rx="8" fill="#C3CAD5"/>
          </g>
        </g>
      </g>`,
    )
    const q = (s) => g.querySelector(s)
    const m = { g, sk: q('.sk'), door: q('.door'), open: q('.open'), pile: q('.pile'), inside: q('.inside'), wtr: q('.wtr'), prog: q('.prog'), chk: q('.chk'), ledOn: q('.ledOn'), knob: q('.knob'), glow: q('.glow'), btn: q('.btn') }
    // clothes inside: seen through the glass when closed, in the drum mouth when open
    const inTee = teeProp(m.inside)
    const inTee2 = teeProp(m.inside, '#9FD08E', false)
    const inSock = sockProp(m.inside)
    const pTee = teeProp(m.pile)
    const pTee2 = teeProp(m.pile, '#9FD08E', false)
    m.set = (o) => {
      const op = clamp(o.door || 0)
      const sx = mix(1, 0.15, E.io2(op))
      tf(m.door, `translate(704 680) scale(${f2(sx)} 1) skewY(${f2(-7 * op)}) translate(-704 -680)`)
      show(m.open, op > 0.01)
      show(m.pile, (o.items || 0) > 0)
      // contents through the glass
      const n = o.items || 0
      show(inTee, n >= 1)
      show(inTee2, n >= 2)
      show(inSock, n >= 3)
      const ang = o.spin || 0
      const stain = o.stain ?? 1
      inTee.querySelector('.stain').setAttribute('opacity', stain.toFixed(3))
      pTee.querySelector('.stain').setAttribute('opacity', stain.toFixed(3))
      tf(inTee, `rotate(${f2(ang)} 880 680) translate(842 720) rotate(${f2(-20 + ang * 0.4)}) scale(.62)`)
      tf(inTee2, `rotate(${f2(ang)} 880 680) translate(930 700) rotate(${f2(25 - ang * 0.3)}) scale(.55)`)
      tf(inSock, `rotate(${f2(ang)} 880 680) translate(888 752) rotate(${f2(60 + ang * 0.5)}) scale(.62)`)
      tf(pTee, `translate(862 742) rotate(-12) scale(.62)`)
      tf(pTee2, `translate(926 752) rotate(14) scale(.55)`)
      show(pTee, o.pile ? o.pile.tee : n >= 1)
      show(pTee2, o.pile ? o.pile.tee2 : n >= 2)
      const lvl = clamp(o.water || 0)
      if (lvl > 0) {
        const y = mix(820, 700, lvl)
        let d = `M 740 ${f2(y)}`
        for (let x = 740; x <= 1020; x += 10) d += ` L ${x} ${f2(y + Math.sin(x / 22 + (o.t || 0) * 7) * 5)}`
        m.wtr.setAttribute('d', d + ' L 1020 830 L 740 830 Z')
      } else m.wtr.setAttribute('d', '')
      const pr = clamp(o.progress || 0)
      if (pr > 0.001) {
        const a0 = -Math.PI / 2
        const a1 = a0 + pr * Math.PI * 2 * 0.999
        m.prog.setAttribute('d', `M ${f2(860 + 13 * Math.cos(a0))} ${f2(425 + 13 * Math.sin(a0))} A 13 13 0 ${pr > 0.5 ? 1 : 0} 1 ${f2(860 + 13 * Math.cos(a1))} ${f2(425 + 13 * Math.sin(a1))}`)
      } else m.prog.setAttribute('d', '')
      m.chk.setAttribute('opacity', o.check ? 1 : 0)
      m.ledOn.setAttribute('width', f2(80 * clamp(o.led || 0)))
      tf(m.knob, `rotate(${f2(o.knob || 0)} 1025 425)`)
      const pr2 = clamp(o.press || 0)
      tf(m.btn, `translate(1083 425) scale(${f2(1 - 0.18 * Math.sin(Math.PI * pr2))}) translate(-1083 -425)`)
      m.glow.setAttribute('opacity', f2(pr2 > 0 ? (1 - pr2) * 0.9 : 0))
      m.glow.setAttribute('r', f2(17 + pr2 * 22))
      const sh = o.shake || 0
      tf(m.sk, `translate(${f2(Math.sin((o.t || 0) * 71) * 2.2 * sh)} ${f2(Math.sin((o.t || 0) * 53 + 1) * 1.2 * sh)})`)
    }
    return m
  }

  // ── on-screen copy: bottom captions and step chips ────────────────────
  function caption(text, { dark = false, size = 1 } = {}) {
    const color = dark ? '#FFFFFF' : C.ink
    const glowCol = dark ? 'rgba(10,20,45,.55)' : 'rgba(255,255,255,.9)'
    const n = el(`<div class="abs serif nowrap" style="display:none;z-index:60;font-size:${(V ? 70 : 74) * k * size}px;color:${color};text-shadow:0 0 ${28 * k}px ${glowCol},0 2px ${10 * k}px ${glowCol}">${words(text)}</div>`)
    fit(n, W * 0.88)
    return n
  }
  /** Captions run on the film clock, not their scene's: shown between t0 and t1 (words rise in, then drop away). */
  const cues = []
  const cue = (n, t0, t1, y) => cues.push({ n, t0, t1, y })
  function runCues(t) {
    for (const { n, t0, t1, y } of cues) {
      const on = t > t0 - 0.05 && t < t1 + 0.5
      n.style.display = on ? '' : 'none'
      if (!on) continue
      put(n, W / 2, y, {})
      rise(n, t, t0, { dur: 0.6, stagger: 0.06, out: t1 })
    }
  }
  const STEP = [C.lav, C.bah, C.nar]
  const chips = c.steps.map((txt, i) =>
    el(
      `<div class="abs pill" style="display:none;z-index:60;font:700 ${34 * k}px Figtree;color:${C.ink};background:rgba(255,255,255,.92);box-shadow:0 ${10 * k}px ${30 * k}px -${12 * k}px rgba(22,33,74,.35);padding:${10 * k}px ${26 * k}px ${10 * k}px ${10 * k}px;gap:${16 * k}px">
        <span style="display:flex;align-items:center;justify-content:center;width:${48 * k}px;height:${48 * k}px;border-radius:50%;background:${STEP[i]};color:#fff;font-weight:800">${i + 1}</span><span>${txt}</span>
      </div>`,
    ),
  )
  chips.forEach((n) => fit(n, W * (V ? 0.86 : 0.5)))
  function chipsAt(t, starts, end) {
    chips.forEach((n, i) => {
      const t0 = starts[i]
      const on = t > t0 - 0.05 && t < end + 0.4
      n.style.display = on ? '' : 'none'
      if (!on) return
      const p = P(t, t0, t0 + 0.5, E.outBack)
      const active = t < (starts[i + 1] ?? end)
      const out = P(t, end, end + 0.35, E.in3)
      const x = V ? W / 2 : W * 0.045
      const y = V ? H * (0.075 + i * 0.062) : H * (0.1 + i * 0.09)
      put(n, x - (V ? 0 : (1 - p) * 60 * k), y - out * 30 * k, { ax: V ? 0.5 : 0, s: mix(0.8, 1, p) * (active ? 1 : 0.94), a: P(t, t0, t0 + 0.2) * (active ? 1 : 0.55) * (1 - out) })
    })
  }

  // ═════════════════════════════════════════════════════════════════════
  // 1–2 · Kitchen: the spill (0–4), mom arrives (4–8)
  // ═════════════════════════════════════════════════════════════════════
  const KIT = {}
  {
    const [L] = layer('#FBE9D3')
    const w = world(L)
    const p = 'kt'
    sv(
      w.defs,
      `<linearGradient id="${p}w" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF6EA"/><stop offset="1" stop-color="#FBE3C6"/></linearGradient>
       <linearGradient id="${p}f" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#EBCB9F"/><stop offset="1" stop-color="#D9AE80"/></linearGradient>
       <linearGradient id="${p}s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#BFE0FF"/><stop offset="1" stop-color="#FFF1DA"/></linearGradient>
       <radialGradient id="${p}l" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#FFF4CF" stop-opacity=".75"/><stop offset="1" stop-color="#FFF4CF" stop-opacity="0"/></radialGradient>
       <linearGradient id="${p}r" x1="0" y1="0" x2="1" y2="0">${RIBBON.map((col, i) => `<stop offset="${i / 6}" stop-color="${col}"/>`).join('')}</linearGradient>`,
    )
    const planks = Array.from({ length: 30 }, (_, i) => `<path d="M ${-900 + i * 140} 766 L ${-900 + i * 140 - 60} 2300" stroke="#CFA170" stroke-width="3" opacity=".35"/>`).join('')
    sv(
      w.g,
      `<g>
        <rect x="-1000" y="-1200" width="3920" height="1960" fill="url(#${p}w)"/>
        <rect x="-1000" y="686" width="3920" height="7" fill="url(#${p}r)" opacity=".55"/>
        <rect x="-1000" y="750" width="3920" height="16" fill="#FFFFFF"/>
        <rect x="-1000" y="766" width="3920" height="1600" fill="url(#${p}f)"/>${planks}
        <rect x="226" y="136" width="508" height="408" rx="20" fill="#FFFFFF"/>
        <rect x="248" y="158" width="464" height="364" rx="10" fill="url(#${p}s)"/>
        <circle cx="600" cy="248" r="90" fill="#FFF2C2" opacity=".6"/><circle cx="600" cy="248" r="52" fill="#FFE8A3"/>
        <g fill="#FFFFFF" opacity=".95"><ellipse cx="350" cy="260" rx="62" ry="22"/><ellipse cx="392" cy="246" rx="40" ry="24"/><ellipse cx="520" cy="350" rx="50" ry="16"/></g>
        <rect x="476" y="158" width="9" height="364" fill="#FFFFFF"/><rect x="248" y="336" width="464" height="9" fill="#FFFFFF"/>
        <rect x="206" y="540" width="548" height="22" rx="7" fill="#FFFFFF"/>
        <path d="M 300 540 L 312 480 L 372 480 L 384 540 Z" fill="#E9805B"/>
        <g fill="#5BA548"><ellipse cx="324" cy="452" rx="14" ry="36" transform="rotate(-24 324 452)"/><ellipse cx="342" cy="440" rx="14" ry="42"/><ellipse cx="362" cy="452" rx="14" ry="36" transform="rotate(24 362 452)"/></g>
        <g fill="#3A8A3E"><ellipse cx="333" cy="462" rx="10" ry="26" transform="rotate(-10 333 462)"/><ellipse cx="352" cy="462" rx="10" ry="26" transform="rotate(12 352 462)"/></g>
        <circle cx="960" cy="200" r="420" fill="url(#${p}l)"/>
        <line x1="960" y1="-1200" x2="960" y2="70" stroke="#4A4A4A" stroke-width="4"/>
        <path d="M 896 70 L 1024 70 L 1068 140 L 852 140 Z" fill="#F2C14E"/><path d="M 1024 70 L 1068 140 L 1040 140 Z" fill="#D9A632"/>
        <rect x="1380" y="330" width="380" height="16" rx="6" fill="#C98A5A"/>
        <rect x="1410" y="264" width="54" height="66" rx="10" fill="#FFFFFF" opacity=".9"/><rect x="1406" y="254" width="62" height="16" rx="6" fill="#F8DB76"/>
        <rect x="1484" y="280" width="46" height="50" rx="10" fill="#FFFFFF" opacity=".9"/><rect x="1480" y="270" width="54" height="14" rx="6" fill="#F28BA8"/>
        <path d="M 1580 330 L 1588 286 L 1640 286 L 1648 330 Z" fill="#7FB2E5"/>
        <g fill="#5BA548"><ellipse cx="1600" cy="262" rx="12" ry="30" transform="rotate(-20 1600 262)"/><ellipse cx="1618" cy="252" rx="12" ry="36"/><ellipse cx="1636" cy="262" rx="12" ry="30" transform="rotate(20 1636 262)"/></g>
        <rect x="1440" y="110" width="200" height="140" rx="12" fill="#FFFFFF"/><rect x="1454" y="124" width="172" height="112" rx="6" fill="#EEE8F6"/>
        <circle cx="1510" cy="184" r="30" fill="#F7AE62" opacity=".85"/><circle cx="1566" cy="168" r="22" fill="#9FD08E" opacity=".9"/><circle cx="1580" cy="206" r="16" fill="#8466C6" opacity=".8"/>
        <rect x="785" y="512" width="150" height="150" rx="26" fill="#D69A6A"/><rect x="800" y="528" width="120" height="14" rx="7" fill="#C38657"/>
      </g>`,
    )
    const kd = kid(w.g)
    const table = sv(
      w.g,
      `<g>
        <ellipse cx="960" cy="910" rx="470" ry="20" fill="#000" opacity=".08"/>
        <rect x="582" y="672" width="26" height="236" rx="8" fill="#C98C5C"/><rect x="1312" y="672" width="26" height="236" rx="8" fill="#C98C5C"/>
        <rect x="540" y="640" width="840" height="26" rx="10" fill="#E3AE7E"/><rect x="540" y="660" width="840" height="18" rx="7" fill="#C98C5C"/>
        <ellipse cx="1120" cy="642" rx="82" ry="14" fill="#FFFFFF"/><ellipse cx="1120" cy="640" rx="58" ry="8" fill="#F1ECE4"/>
        <rect x="1090" y="612" width="58" height="30" rx="11" fill="#E8B672"/><rect x="1094" y="616" width="50" height="22" rx="8" fill="#F3D194"/>
        <ellipse class="puddle" cx="930" cy="644" rx="0" ry="0" fill="#F7A13A" opacity=".9"/>
      </g>`,
    )
    const puddle = table.querySelector('.puddle')
    // the glass of orange juice (pivot: base-left corner, 976/640)
    const glass = sv(
      w.g,
      `<g>
        <path class="juice" d="M -22 -3 L -25.5 -64 L 25.5 -64 L 22 -3 Z" fill="#F7A13A"/>
        <ellipse class="jtop" cx="0" cy="-64" rx="25.5" ry="4" fill="#FFC46B"/>
        <path d="M -24 0 L -28 -94 L 28 -94 L 24 0 Z" fill="rgba(255,255,255,.28)" stroke="rgba(255,255,255,.95)" stroke-width="3.5" stroke-linejoin="round"/>
        <path d="M -16 -84 L -14 -14" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".6"/>
      </g>`,
    )
    const juice = glass.querySelector('.juice')
    const jtop = glass.querySelector('.jtop')
    const drops = Array.from({ length: 26 }, () => sv(w.g, `<ellipse rx="7" ry="7" fill="#F7A13A"/>`))
    const dropR = rng(17)
    const dropSpec = drops.map((n, i) => ({
      n,
      t0: 2.14 + (i / drops.length) * 0.22 + dropR() * 0.02,
      vx: -(320 + dropR() * 280),
      vy: -(dropR() * 200),
      r: 4 + dropR() * 6,
      toShirt: i % 3 !== 2,
    }))
    const md = mom(w.g)
    const box = sv(w.g, `<g>${brandIn('angle_lavanta', 0, 0, 210)}</g>`)
    const boxSpark = sparkles(w.g, 4, '#FFFFFF')
    const bang = sv(
      w.g,
      `<g><path d="M -54 -40 Q -54 -64 -30 -64 L 30 -64 Q 54 -64 54 -40 L 54 4 Q 54 28 30 28 L 6 28 L -14 48 L -10 28 L -30 28 Q -54 28 -54 4 Z" fill="#FFFFFF" stroke="${C.ink}" stroke-width="5" stroke-linejoin="round"/><text x="0" y="12" text-anchor="middle" font-family="Fraunces" font-weight="700" font-size="76" fill="${C.nar}">!</text></g>`,
    )
    const capA = caption(c.calm)
    cue(capA, 5.0, 7.2, V ? H * 0.735 : H * 0.8)
    const capB = caption(c.enough, { size: 1 })
    cue(capB, 6.0, 7.2, V ? H * 0.795 : H * 0.895)
    capB.style.color = C.lav
    KIT.layer = L

    // story time: a slow-motion stretch around the spill
    const tau = (t) => (t < 2.0 ? t : t < 3.3 ? 2.0 + (t - 2.0) * 0.38 : 2.494 + (t - 3.3))
    const KX = 860
    const KY = 790
    scene(0, 8.05, L, (t) => {
      const u = tau(t)
      // camera
      // camera keyframes per orientation: wide → punch-in on the spill → settle → widen for mom
      const K = V
        ? { a: [900, 560, 1.35], b: [900, 565, 1.4], p: [880, 590, 1.75], k: [890, 590, 1.5], m: [1255, 600, 1.1] }
        : { a: [980, 540, 1.0], b: [930, 560, 1.06], p: [880, 590, 1.45], k: [900, 590, 1.25], m: [1120, 560, 1.0] }
      const lerp3 = (A, B, q) => A.map((v, i) => mix(v, B[i], q))
      let cam
      if (t < 4) {
        cam = lerp3(K.a, K.b, P(t, 0, 2, E.io2))
        cam = lerp3(cam, K.p, P(t, 2.0, 2.6, E.io3))
        cam = lerp3(cam, K.k, P(t, 3.3, 4.0, E.io2))
      } else cam = lerp3(K.k, K.m, P(t, 4.0, 4.9, E.io3))
      let [cx, cy, z] = cam
      if (t >= 4) z += P(t, 5, 7.5, E.lin) * 0.03
      // whip pan out to the laundry room
      cx += P(t, 7.55, 8.02, E.in3) * 2600
      w.cam(cx, cy, z)

      // the glass tips toward the kid at story-time 2.03
      const tip = P(u, 2.03, 2.32, E.in2)
      const ang = -97 * tip
      tf(glass, `translate(1000 640) rotate(${f2(ang)} -24 0)`)
      const lvl = 1 - P(u, 2.1, 2.36)
      tf(juice, `translate(0 ${f2(-3 * (1 - lvl))}) scale(1 ${f2(Math.max(0.001, lvl))}) translate(0 3)`)
      jtop.setAttribute('opacity', lvl > 0.02 ? 1 : 0)
      const rim = rot([1000, 546], [976, 640], ang)
      dropSpec.forEach((d) => {
        const dt = u - d.t0
        if (dt < 0 || u > 3.0) return show(d.n, false)
        show(d.n, true)
        let x = rim[0] + d.vx * dt
        let y = rim[1] + d.vy * dt + 0.5 * 1500 * dt * dt
        let a = 1
        const hitX = 922
        if (d.toShirt && x < hitX && y > 500) {
          x = Math.max(x, hitX - 14)
          a = 1 - clamp((u - (d.t0 + (rim[0] - hitX) / -d.vx)) / 0.08)
        }
        if (y > 640) {
          y = 640
          a = Math.min(a, 1 - clamp((dt - 0.25) / 0.1))
        }
        const sp = Math.hypot(d.vx, d.vy + 1500 * dt)
        const stretch = 1 + Math.min(1.6, sp / 700)
        const dir = (Math.atan2(d.vy + 1500 * dt, d.vx) * 180) / Math.PI
        tf(d.n, `translate(${f2(x)} ${f2(y)}) rotate(${f2(dir)}) scale(${f2(stretch)} 1)`)
        d.n.setAttribute('rx', f2(d.r))
        d.n.setAttribute('ry', f2(d.r))
        d.n.setAttribute('opacity', f2(clamp(a)))
      })
      const pud = P(u, 2.2, 2.6, E.out3)
      puddle.setAttribute('rx', f2(70 * pud))
      puddle.setAttribute('ry', f2(9 * pud))

      // the kid
      const shock = u >= 2.1 && t < 3.6
      const down = t >= 3.6 && t < 4.6
      const lookMom = t >= 4.6
      const wave = Math.sin(t * 7)
      let hands
      if (u < 1.55) hands = { L: [KX - 110 + wave * 10, 470 + Math.cos(t * 7) * 14], R: [KX + 70, 628] }
      else if (u < 2.05) {
        const sw = P(u, 1.55, 2.02, E.in2)
        hands = { L: [KX - 100, 500], R: [mix(KX + 70, 1012, sw), mix(628, 572, sw)] }
      } else if (shock) {
        const j = P(u, 2.05, 2.2, E.out3)
        hands = { L: [mix(KX - 100, KX - 60, j), mix(500, 536, j)], R: [mix(1012, KX + 72, j), mix(572, 534, j)] }
      } else if (down) hands = { L: [KX - 40, 610], R: [KX + 44, 612] }
      else hands = { L: [KX - 70, 628], R: [KX + 70, 628] }
      kd.pose({
        x: KX, y: KY, legs: false,
        head: shock ? -4 : down ? 0 : lookMom ? 6 : Math.sin(t * 3.4) * 4,
        headDy: down ? 10 : 0,
        look: down ? [0, 5] : lookMom ? [4, 0] : [2, 0],
        mouth: u < 2.08 ? 'grin' : shock ? 'o' : down ? 'sheep' : t < 5.9 ? 'sheep' : t < 6.4 ? 'smile' : 'grin',
        eyes: shock ? 'wide' : 'open',
        blink: shock ? 0 : blinkAt(t, 0.4),
        brow: shock ? -9 : down ? 2 : 0,
        worried: down || (lookMom && t < 5.9),
        hands,
        stain: P(u, 2.17, 2.4, E.out3),
      })
      tf(bang, `translate(${KX + 118} 330) scale(${f2(P(t, 2.55, 2.85, E.outBack) * (1 - P(t, 3.55, 3.75, E.in3)))}) rotate(${f2(Math.sin(t * 20) * 3)})`)

      // mom walks in from the right, box in hand, then lifts it
      const MX = mix(2200, 1480, P(t, 4.1, 5.3, E.out2))
      show(md.g, t > 4.0)
      show(box, t > 4.0)
      const walking = t > 4.1 && t < 5.35
      const ph = t * 11
      const raise = P(t, 5.55, 6.15, E.outBack)
      const calm = P(t, 4.95, 5.25, E.out3) * (1 - P(t, 5.6, 5.9, E.io2))
      const bob = walking ? -Math.abs(Math.sin(ph)) * 10 : 0
      const MY = 920 + bob
      const boxHand = [mix(MX + 96, MX + 150, raise), mix(MY - 300, MY - 450, raise)]
      md.pose({
        x: MX, y: MY,
        head: walking ? Math.sin(ph) * 2 : -6 + Math.sin(t * 2) * 2,
        look: [-3, 0],
        mouth: t > 5.0 && t < 5.5 ? (Math.sin(t * 34) > 0 ? 'talk' : 'smile') : t > 6.2 ? 'grin' : 'smile',
        blink: blinkAt(t, 1.3),
        hands: { R: boxHand, L: calm > 0 ? [mix(MX - 92, MX - 150, calm), mix(MY - 270, MY - 420, calm)] : null },
        feet: walking ? walkFeet(ph, 20, 18, 30) : undefined,
      })
      tf(box, `translate(${f2(boxHand[0] + 6)} ${f2(boxHand[1] - 78)}) rotate(${f2(-4 + raise * 6)})`)
      boxSpark.forEach((n, i) => {
        const tt = t - 6.15 - i * 0.12
        const a = tt > 0 && tt < 0.6 ? Math.sin((Math.PI * tt) / 0.6) : 0
        const off = [[-100, -100], [110, -70], [-80, 60], [100, 80]][i]
        tf(n, `translate(${f2(boxHand[0] + 6 + off[0])} ${f2(boxHand[1] - 78 + off[1])}) scale(${f2(a)}) rotate(${f2(tt * 90)})`)
      })
    })
  }

  // ═════════════════════════════════════════════════════════════════════
  // Laundry room set (used for the three steps, 8–16, and the result, 20–24)
  // ═════════════════════════════════════════════════════════════════════
  function laundryRoom() {
    const [L] = layer('#E6F2EA')
    const w = world(L)
    const p = `lr${++uid}`
    sv(
      w.defs,
      `<linearGradient id="${p}w" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F2F8F4"/><stop offset="1" stop-color="#DDEEE4"/></linearGradient>
       <linearGradient id="${p}f" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E9ECF2"/><stop offset="1" stop-color="#D6DBE5"/></linearGradient>`,
    )
    const tiles = []
    for (let x = -1000; x < 2920; x += 90) tiles.push(`<line x1="${x}" y1="520" x2="${x}" y2="752" stroke="#C9E0D2" stroke-width="2"/>`)
    for (let y = 520; y < 752; y += 58) tiles.push(`<line x1="-1000" y1="${y}" x2="2920" y2="${y}" stroke="#C9E0D2" stroke-width="2"/>`)
    for (let x = -1000; x < 2920; x += 160) tiles.push(`<line x1="${x}" y1="766" x2="${x - 220}" y2="2300" stroke="#C7CDD9" stroke-width="2.5" opacity=".7"/>`)
    for (let y = 840; y < 2300; y += 120) tiles.push(`<line x1="-1000" y1="${y}" x2="2920" y2="${y}" stroke="#C7CDD9" stroke-width="2.5" opacity=".6"/>`)
    sv(
      w.g,
      `<g>
        <rect x="-1000" y="-1200" width="3920" height="1960" fill="url(#${p}w)"/>
        <rect x="-1000" y="520" width="3920" height="232" fill="#E3F1E8"/>
        <rect x="-1000" y="750" width="3920" height="16" fill="#FFFFFF"/>
        <rect x="-1000" y="766" width="3920" height="1600" fill="url(#${p}f)"/>
        ${tiles.join('')}
        <g transform="translate(${V ? -200 : 0} 0)"><circle cx="980" cy="215" r="74" fill="#FFFFFF" stroke="#C3CFDC" stroke-width="8"/>${[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((i) => `<circle cx="${f2(980 + Math.cos((i / 12) * Math.PI * 2) * 56)}" cy="${f2(215 + Math.sin((i / 12) * Math.PI * 2) * 56)}" r="${i % 3 ? 3 : 5}" fill="#9AA6B8"/>`).join('')}
        <line class="clkH" x1="980" y1="215" x2="980" y2="180" stroke="#16214A" stroke-width="7" stroke-linecap="round"/><line class="clkM" x1="980" y1="215" x2="980" y2="160" stroke="#6E4FA8" stroke-width="5" stroke-linecap="round"/><circle cx="980" cy="215" r="6" fill="#16214A"/></g>
        <rect x="1360" y="300" width="380" height="16" rx="6" fill="#B9C6D6"/>
        <rect x="1390" y="262" width="96" height="38" rx="9" fill="#C9B8EE"/><rect x="1396" y="226" width="86" height="36" rx="9" fill="#F9D3A8"/><rect x="1402" y="194" width="74" height="32" rx="9" fill="#CBE6D3"/>
        <rect x="1520" y="250" width="68" height="50" rx="12" fill="#FFFFFF"/><path d="M 1610 300 L 1620 250 L 1680 250 L 1690 300 Z" fill="#F28BA8"/>
        <g fill="#5BA548"><ellipse cx="1634" cy="226" rx="11" ry="28" transform="rotate(-20 1634 226)"/><ellipse cx="1650" cy="216" rx="11" ry="34"/><ellipse cx="1666" cy="226" rx="11" ry="28" transform="rotate(20 1666 226)"/></g>
        <rect x="1330" y="640" width="320" height="270" rx="14" fill="#D6E0EA"/><rect x="1330" y="640" width="320" height="20" rx="8" fill="#C3CFDC"/>
        <rect x="1352" y="690" width="132" height="190" rx="10" fill="#E3EAF2"/><rect x="1496" y="690" width="132" height="190" rx="10" fill="#E3EAF2"/>
        <circle cx="1470" cy="785" r="7" fill="#AEBBCB"/><circle cx="1510" cy="785" r="7" fill="#AEBBCB"/>
        <ellipse cx="1490" cy="915" rx="190" ry="14" fill="#16214A" opacity=".08"/>
      </g>`,
    )
    const m = machine(w)
    // basket on the cabinet with laundry
    sv(w.g, `<g><path d="M 1476 640 L 1462 548 L 1646 548 L 1632 640 Z" fill="#D8A465"/>${[566, 588, 610].map((y) => `<line x1="1468" y1="${y}" x2="1640" y2="${y}" stroke="#BF8A4D" stroke-width="3"/>`).join('')}</g>`)
    const bTee2 = teeProp(w.g, '#9FD08E', false)
    tf(bTee2, 'translate(1590 540) rotate(18) scale(.55)')
    const bSock = sockProp(w.g)
    tf(bSock, 'translate(1500 530) rotate(-70) scale(.6)')
    const front = sv(w.g, `<g><path d="M 1476 640 L 1466 572 L 1642 572 L 1632 640 Z" fill="#E2B072"/><line x1="1470" y1="600" x2="1638" y2="600" stroke="#BF8A4D" stroke-width="3"/><line x1="1474" y1="622" x2="1634" y2="622" stroke="#BF8A4D" stroke-width="3"/></g>`)
    const clkH = w.g.querySelector('.clkH')
    const clkM = w.g.querySelector('.clkM')
    const clock = (min) => {
      tf(clkM, `rotate(${f2((min % 60) * 6)} 980 215)`)
      tf(clkH, `rotate(${f2((min / 60) * 30 + 240)} 980 215)`)
    }
    return { L, w, m, bTee2, bSock, front, clock }
  }
  const handleOpen = () => [1056, 676]

  // ═════════════════════════════════════════════════════════════════════
  // 3 · The three steps (8–16)
  // ═════════════════════════════════════════════════════════════════════
  const STP = {}
  {
    const R = laundryRoom()
    const { L, w, m } = R
    const md = mom(w.g)
    const sheetP = sheetProp(w.g)
    const box = sv(w.g, `<g>${brandIn('angle_lavanta', 0, 0, 200)}</g>`)
    const tee = teeProp(w.g)
    const tee2 = R.bTee2
    const sock = R.bSock
    w.g.appendChild(R.front)
    w.g.appendChild(box)
    const capM = caption(c.noMeasure)
    cue(capM, 14.55, 15.3, V ? H * 0.76 : H * 0.88)
    const sparkIn = sparkles(w.g, 5, '#FFFFFF')
    STP.layer = L
    STP.door = [880, 680]
    const MX = 1240
    const MY = 930
    scene(7.97, 16.1, L, (t) => {
      // camera: whip in, slow push, then into the porthole
      const inP = P(t, 7.95, 8.45, E.out3)
      const dive = P(t, 15.25, 16.05, E.in3)
      let cx = (V ? 1120 : 1120) - (1 - inP) * 2600
      let cy = V ? 640 : 600
      let z = (V ? 1.15 : 1) + P(t, 8.4, 15.2, E.io2) * 0.06
      cx = mix(cx, 880, dive)
      cy = mix(cy, 680, dive)
      z = mix(z, V ? 5.2 : 4.2, dive)
      w.cam(cx, cy, z)
      L.style.opacity = 1 - P(t, 15.85, 16.05)
      R.clock(10 + (t - 8) * 0.4)

      // door: open 8.9–9.35, close 12.55–12.95
      const door = P(t, 8.9, 9.35, E.io2) * (1 - P(t, 12.8, 13.2, E.in2))
      const items = t < 11.15 ? 0 : t < 11.95 ? 1 : t < 12.75 ? 2 : 3
      const run = P(t, 13.75, 14.7)
      const spinAng = t > 13.75 ? 0.5 * 380 * (Math.min(t, 14.75) - 13.75) ** 2 + Math.max(0, t - 14.75) * 380 : 0
      m.set({
        t, door, items, spin: spinAng, water: P(t, 13.8, 14.7), shake: run, stain: 1,
        progress: P(t, 13.65, 16, E.lin) * 0.12, led: P(t, 13.62, 13.85), knob: P(t, 13.2, 13.45, E.outBack) * 90, press: P(t, 13.58, 13.9),
      })

      // the mom's choreography
      const boxAt = [MX + 54, MY - 330]
      let lean = 0
      let hL = null
      let hR = boxAt
      let sheetPos = null
      let sheetScale = 1
      const handle = handleOpen()
      if (t < 8.3) hL = null
      else if (t < 8.75) hL = [mix(MX - 92, boxAt[0] - 4, P(t, 8.3, 8.6, E.io2)), mix(MY - 270, boxAt[1] - 150, P(t, 8.3, 8.6, E.io2))]
      else if (t < 9.35) {
        const pp = P(t, 8.75, 9.05, E.io2)
        hL = [mix(boxAt[0] - 4, handle[0], pp), mix(boxAt[1] - 150, handle[1], pp)]
        lean = -16 * pp
      } else if (t < 9.75) {
        const pp = P(t, 9.35, 9.65, E.io2)
        hL = [mix(handle[0], 1006, pp), mix(handle[1], 640, pp)]
        lean = -16
      } else if (t < 12.7) {
        lean = -16 * (1 - P(t, 9.75, 10.1, E.io2))
        hL = null
      } else if (t < 13.2) {
        const pp = P(t, 12.7, 13.0, E.io2)
        hL = [mix(MX - 92, 1010, pp), mix(MY - 270, 690, pp)]
        lean = -16 * pp
      } else if (t < 13.9) {
        const pp = P(t, 13.2, 13.55, E.io2)
        hL = [mix(1010, 1083, pp), mix(690, 425 + Math.sin(Math.PI * P(t, 13.56, 13.9)) * 6, pp)]
        lean = -16 * (1 - pp)
      } else hL = [mix(1083, MX - 92, P(t, 13.9, 14.3, E.io2)), mix(425, MY - 270, P(t, 13.9, 14.3, E.io2))]
      // the sheet: up out of the box, into her hand, into the drum
      const up = P(t, 8.3, 8.65, E.out3)
      if (t > 8.3 && t < 8.75) sheetPos = [boxAt[0] - 4, boxAt[1] - 64 - up * 70]
      else if (t >= 8.75 && t < 9.65) sheetPos = [hL[0], hL[1] - 30]
      else if (t >= 9.65 && t < 10.05) {
        const pp = P(t, 9.65, 10.0, E.in2)
        sheetPos = [mix(1006, 880, pp), mix(610, 700, pp) - Math.sin(Math.PI * pp) * 40]
        sheetScale = mix(1, 0.45, pp)
      }
      show(sheetP, !!sheetPos)
      if (sheetPos) tf(sheetP, `translate(${f2(sheetPos[0])} ${f2(sheetPos[1])}) rotate(${f2(t < 9.65 ? -8 : -8 - P(t, 9.65, 10) * 120)}) scale(${f2(sheetScale)})`)
      sparkIn.forEach((n, i) => {
        const tt = t - 9.95 - i * 0.05
        const a = tt > 0 && tt < 0.45 ? Math.sin((Math.PI * tt) / 0.45) : 0
        const ang2 = (i / 5) * Math.PI * 2
        tf(n, `translate(${f2(880 + Math.cos(ang2) * (30 + tt * 140))} ${f2(690 + Math.sin(ang2) * (30 + tt * 140))}) scale(${f2(a * 0.8)})`)
      })
      // box: in her hand, then set down on the cabinet
      const set = P(t, 9.85, 10.25, E.io2)
      const boxPos = [mix(boxAt[0], 1410, set), mix(boxAt[1] - 50, 548, set) - Math.sin(Math.PI * set) * 30]
      tf(box, `translate(${f2(boxPos[0])} ${f2(boxPos[1])}) rotate(${f2(-4 * (1 - set))})`)
      if (t > 9.85 && t < 10.3) hR = [boxPos[0], boxPos[1] + 50]
      // laundry: tee, green tee, sock from the basket into the drum
      const toss = (it, t0, from, scale0, rot0, start = [MX + 92, MY - 270]) => {
        const grab = P(t, t0, t0 + 0.3, E.io2)
        const fly = P(t, t0 + 0.35, t0 + 0.8, E.io2)
        if (t < t0 + 0.3) {
          tf(it, `translate(${from[0]} ${from[1]}) rotate(${rot0}) scale(${scale0})`)
          return { hand: [mix(start[0], from[0], grab), mix(start[1], from[1], grab)] }
        }
        if (fly < 1) {
          const lift = P(t, t0 + 0.3, t0 + 0.45, E.out2)
          const x = mix(from[0], 880, fly)
          const y = mix(from[1] - lift * 60, 700, fly) - Math.sin(Math.PI * fly) * 220
          tf(it, `translate(${f2(x)} ${f2(y)}) rotate(${f2(rot0 - fly * 300)}) scale(${f2(mix(scale0, 0.45, fly))})`)
          show(it, true)
          return { hand: [mix(from[0], 1300, P(t, t0 + 0.3, t0 + 0.6, E.out2)), mix(from[1], 420, P(t, t0 + 0.3, t0 + 0.6, E.out2))] }
        }
        show(it, false)
        return { hand: null }
      }
      show(tee, t < 11.2)
      if (t < 10.25) {
        tf(tee, 'translate(1545 528) rotate(-8) scale(.62)')
        show(tee2, true)
        show(sock, true)
        tf(tee2, 'translate(1590 540) rotate(18) scale(.55)')
        tf(sock, 'translate(1500 530) rotate(-70) scale(.6)')
      } else {
        const a = toss(tee, 10.35, [1545, 528], 0.62, -8)
        if (t < 11.15 && a.hand) hR = a.hand
        show(tee2, t < 11.95)
        show(sock, t < 12.75)
        if (t >= 11.15) {
          const b = toss(tee2, 11.15, [1590, 540], 0.55, 18, [1300, 420])
          if (t < 11.95 && b.hand) hR = b.hand
        } else tf(tee2, 'translate(1590 540) rotate(18) scale(.55)')
        if (t >= 11.95) {
          const s2 = toss(sock, 11.95, [1500, 530], 0.6, -70, [1300, 420])
          if (t < 12.75 && s2.hand) hR = s2.hand
        } else tf(sock, 'translate(1500 530) rotate(-70) scale(.6)')
        if (t >= 12.75) hR = [mix(1300, MX + 92, P(t, 12.75, 13.05, E.io2)), mix(420, MY - 270, P(t, 12.75, 13.05, E.io2))]
      }
      const wave = t > 13.95 && t < 14.8 ? P(t, 13.95, 14.2, E.outBack) * (1 - P(t, 14.55, 14.8)) : 0
      if (wave > 0) hR = [mix(MX + 92, MX + 175, wave) + Math.sin(t * 16) * 22 * wave, mix(MY - 270, MY - 600, wave)]
      md.pose({
        x: MX, y: MY, lean,
        head: lean * 0.4 + (t > 13.95 && t < 14.8 ? -4 : 0),
        look: t > 13.95 && t < 14.8 ? [0, 1] : [-3, 1],
        mouth: t > 13.95 && t < 14.9 ? 'grin' : 'smile',
        blink: blinkAt(t, 0.7),
        hands: { L: hL, R: hR },
      })
    })
  }

  // ═════════════════════════════════════════════════════════════════════
  // 4 · Inside the drum (16–20): the sheet dissolves, the stain lifts
  // ═════════════════════════════════════════════════════════════════════
  const DRM = {}
  {
    const [L] = layer('#1B3558')
    const svg = el(
      `<svg class="layer" width="${W}" height="${H}" viewBox="0 0 1000 1000" preserveAspectRatio="xMidYMid slice">
        <defs>
          <radialGradient id="dw" cx=".5" cy=".42" r=".65"><stop offset="0" stop-color="#7DB0E0"/><stop offset=".55" stop-color="#3B6C9F"/><stop offset="1" stop-color="#1A3456"/></radialGradient>
          <radialGradient id="dv" cx=".5" cy=".5" r=".55"><stop offset=".62" stop-color="#0B1A33" stop-opacity="0"/><stop offset="1" stop-color="#0B1A33" stop-opacity=".75"/></radialGradient>
          <linearGradient id="dl" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity=".16"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
        </defs>
        <rect x="-500" y="-500" width="2000" height="2000" fill="url(#dw)"/>
        <g class="holes"></g>
        <g class="rays"></g>
        <path class="surf" fill="#CFE6FA" opacity=".35"/>
        <g class="items"></g>
        <g class="bubs"></g>
        <rect x="-500" y="-500" width="2000" height="2000" fill="url(#dv)"/>
        <path d="M 210 330 A 330 330 0 0 1 420 190" fill="none" stroke="#fff" stroke-width="16" stroke-linecap="round" opacity=".35"/>
      </svg>`,
      L,
    )
    const q = (s) => svg.querySelector(s)
    const holes = q('.holes')
    for (let i = 0; i < 40; i++) {
      const a = (i / 40) * Math.PI * 2
      sv(holes, `<circle cx="${f2(500 + Math.cos(a) * 455)}" cy="${f2(500 + Math.sin(a) * 455)}" r="10" fill="#0E2240" opacity=".4"/>`)
      sv(holes, `<circle cx="${f2(500 + Math.cos(a + 0.08) * 395)}" cy="${f2(500 + Math.sin(a + 0.08) * 395)}" r="7" fill="#0E2240" opacity=".25"/>`)
    }
    const rays = q('.rays')
    const rayN = [0, 1, 2, 3].map(() => sv(rays, `<rect x="-60" y="-700" width="120" height="1400" fill="url(#dl)"/>`))
    const items = q('.items')
    const tee = teeProp(items)
    const tee2 = teeProp(items, '#9FD08E', false)
    const sock = sockProp(items)
    const pink = teeProp(items, '#F7B2C4', false)
    const frag = Array.from({ length: 16 }, (_, i) => sv(items, `<g><circle r="${7 + (i % 4) * 3}" fill="rgba(255,255,255,.85)"/><circle cx="-2.5" cy="-2.5" r="2.2" fill="#fff"/></g>`))
    const sh = sheetProp(items)
    const glint = sv(items, `<path d="${star(30)}" fill="#FFFFFF"/>`)
    const bubs = q('.bubs')
    const bR = rng(33)
    const bubList = Array.from({ length: 46 }, () => {
      const r = 4 + bR() ** 2 * 26
      return { n: sv(bubs, `<g><circle r="${f2(r)}" fill="rgba(255,255,255,.08)" stroke="rgba(255,255,255,.75)" stroke-width="${f2(Math.max(1.2, r / 10))}"/><circle cx="${f2(-r * 0.35)}" cy="${f2(-r * 0.35)}" r="${f2(r * 0.22)}" fill="#fff" opacity=".85"/></g>`), x: 120 + bR() * 760, sp: 90 + bR() * 220, ph: bR() * 10, wob: 8 + bR() * 22, r }
    })
    const surf = q('.surf')
    const capD = caption(c.dissolve, { dark: true })
    cue(capD, 16.45, 18.85, V ? H * 0.76 : H * 0.88)
    DRM.layer = L
    scene(15.8, 20.4, L, (t) => {
      L.style.opacity = P(t, 15.85, 16.05)
      const lt = t - 16
      const zoom = 1.25 - P(t, 15.85, 17.2, E.out3) * 0.25
      svg.setAttribute('viewBox', `${f2(500 - 500 / zoom)} ${f2(500 - 500 / zoom)} ${f2(1000 / zoom)} ${f2(1000 / zoom)}`)
      const ang = lt * 80 + lt * lt * 6
      tf(holes, `rotate(${f2(ang * 0.6)} 500 500)`)
      rayN.forEach((n, i) => tf(n, `translate(${f2(200 + i * 220 + Math.sin(t * 0.8 + i) * 60)} 500) rotate(${18 + i * 4})`))
      const lvl = mix(980, 250, P(t, 15.9, 16.7, E.out3))
      let d = `M -500 ${f2(lvl)}`
      for (let x = -500; x <= 1500; x += 25) d += ` L ${x} ${f2(lvl + Math.sin(x / 70 + t * 5) * 12)}`
      surf.setAttribute('d', d + ` L 1500 ${f2(lvl - 900)} L -500 ${f2(lvl - 900)} Z`)
      // tumbling laundry
      const orbit = (n, r0, a0, sc, spin, selfRot) => {
        const a = ((a0 + ang) * Math.PI) / 180
        tf(n, `translate(${f2(500 + Math.cos(a) * r0)} ${f2(520 + Math.sin(a) * r0 * 0.9)}) rotate(${f2(selfRot + ang * spin)}) scale(${sc})`)
      }
      orbit(tee, 135, 200, 1.45, 0.6, -10)
      orbit(tee2, 175, 40, 1.2, -0.5, 20)
      orbit(sock, 110, 300, 1.2, 0.9, 40)
      orbit(pink, 185, 120, 1.1, -0.7, -30)
      const st = 1 - P(t, 17.1, 19.2, E.io2)
      tee.querySelector('.stain').setAttribute('opacity', st.toFixed(3))
      // the sheet sinks and breaks into flakes that turn to foam
      const dis = P(t, 16.25, 17.2, E.io2)
      show(sh, dis < 1)
      tf(sh, `translate(500 ${f2(430 + lt * 40)}) rotate(${f2(-8 + lt * 30)}) scale(${f2(1.8 * (1 - dis * 0.9))})`)
      sh.setAttribute('opacity', f2(1 - dis))
      frag.forEach((n, i) => {
        const a = (i / frag.length) * Math.PI * 2
        const pp = P(t, 16.3 + (i % 4) * 0.05, 17.5 + (i % 3) * 0.1, E.out3)
        const on = pp > 0 && pp < 1
        show(n, on)
        if (on) tf(n, `translate(${f2(500 + Math.cos(a) * pp * 210)} ${f2(450 + Math.sin(a) * pp * 190 - pp * 60)}) rotate(${f2(pp * 200 + i * 30)}) scale(${f2(1.4 * (1 - pp))})`)
      })
      const gl = P(t, 19.15, 19.55)
      const a = ((200 + ang) * Math.PI) / 180
      tf(glint, `translate(${f2(500 + Math.cos(a) * 150)} ${f2(520 + Math.sin(a) * 135 - 40)}) scale(${f2(Math.sin(Math.PI * gl) * 1.2)}) rotate(${f2(gl * 90)})`)
      bubList.forEach((b) => {
        const span = 1200
        const y = 1100 - (((t + b.ph) * b.sp) % span)
        const x = b.x + Math.sin((t + b.ph) * 2) * b.wob
        const on = y < lvl + 20
        tf(b.n, `translate(${f2(x)} ${f2(y)})`)
        b.n.setAttribute('opacity', on ? 1 : 0)
      })
    })
  }

  // bubble burst that carries us from the drum back to the room (19.5–20.35)
  {
    const svg = el(`<svg class="layer" style="z-index:45" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"></svg>`)
    const R = rng(51)
    const cols = V ? 4 : 6
    const rows = V ? 7 : 4
    const list = []
    for (let i = 0; i < cols; i++)
      for (let j = 0; j < rows; j++) {
        const x = ((i + 0.5 + (R() - 0.5) * 0.6) / cols) * W
        const y = ((j + 0.5 + (R() - 0.5) * 0.6) / rows) * H
        const r = Math.max(W / cols, H / rows) * (0.78 + R() * 0.3)
        list.push({ n: sv(svg, `<g><circle r="1" fill="rgba(255,255,255,.93)" stroke="#D9E9F8" stroke-width=".03"/><circle cx="-.35" cy="-.35" r=".16" fill="#fff"/></g>`), x, y, r, d: R() * 0.18 })
      }
    scene(19.45, 20.45, svg, (t) => {
      list.forEach((b) => {
        const grow = P(t, 19.5 + b.d, 19.88 + b.d, E.out3)
        const pop = P(t, 19.95 + b.d, 20.2 + b.d, E.in2)
        tf(b.n, `translate(${f2(b.x)} ${f2(b.y)}) scale(${f2(b.r * grow * (1 + pop * 0.35))})`)
        b.n.setAttribute('opacity', f2(1 - pop))
      })
    })
  }

  // ═════════════════════════════════════════════════════════════════════
  // 5 · The result (20–24): clean tee, the kid's hug
  // ═════════════════════════════════════════════════════════════════════
  const RES = {}
  {
    const Rm = laundryRoom()
    const { L, w, m } = Rm
    show(Rm.bTee2, false)
    show(Rm.bSock, false)
    const kd = kid(w.g)
    const md = mom(w.g)
    const box = sv(w.g, `<g>${brandIn('angle_lavanta', 0, 0, 200)}</g>`)
    tf(box, 'translate(1410 548)')
    w.g.appendChild(Rm.front)
    w.g.appendChild(box)
    const tee = teeProp(w.g)
    show(tee.querySelector('.stain'), false)
    const spk = sparkles(w.g, 6, '#FFFFFF')
    const swirl = Array.from({ length: 3 }, (_, i) => sv(w.g, `<path d="M 0 0 C 30 -40 -30 -80 0 -120 C 30 -160 -10 -200 10 -230" fill="none" stroke="${['#B9A6F2', '#8466C6', '#CDBEEA'][i]}" stroke-width="7" stroke-linecap="round" pathLength="1" stroke-dasharray="1 1" opacity=".8"/>`))
    const sprigs = Array.from({ length: 4 }, () => sv(w.g, `<g>${brandIn('emblem_lavanta', 0, 0, 90)}</g>`))
    const hearts = Array.from({ length: 3 }, (_, i) => sv(w.g, `<path d="M 0 10 C -24 -8 -22 -30 -6 -30 C 0 -30 0 -24 0 -22 C 0 -24 0 -30 6 -30 C 22 -30 24 -8 0 10 Z" fill="${['#F28BA8', '#8466C6', '#F7AE62'][i]}"/>`))
    const capF = caption(c.fresh)
    cue(capF, 20.85, 21.9, V ? H * 0.76 : H * 0.88)
    const capC = caption(c.colours)
    cue(capC, 22.45, 23.45, V ? H * 0.76 : H * 0.88)
    RES.layer = L
    const MX = 1240
    const MY = 930
    scene(19.85, 24.02, L, (t) => {
      w.cam(V ? 1100 : 1110, V ? 620 : 640, (V ? 1.15 : 1.04) + P(t, 19.9, 24, E.lin) * 0.05)
      Rm.clock(65 + (t - 20) * 0.4)
      const door = P(t, 20.3, 20.75, E.io2)
      m.set({ t, door, items: 2, pile: { tee: t < 21.0, tee2: true }, stain: 0, progress: 1, check: true, led: 1 })
      const handle = handleOpen()
      let lean = 0
      let hL = null
      let hR = null
      // open, reach in, pull the tee out and hold it up
      if (t < 20.75) {
        const pp = P(t, 20.05, 20.35, E.io2)
        hL = [mix(MX - 92, handle[0], pp), mix(MY - 270, handle[1], pp)]
        lean = -16 * pp
      } else if (t < 21.1) {
        const pp = P(t, 20.75, 21.0, E.io2)
        hL = [mix(handle[0], 1006, pp), mix(handle[1], 650, pp)]
        lean = -16
      }
      const pull = P(t, 21.0, 21.5, E.io2)
      const give = P(t, 22.95, 23.4, E.io2)
      let teePos = [mix(900, MX, pull), mix(700, MY - 430, pull) - Math.sin(Math.PI * pull) * 60]
      let teeSc = mix(0.45, 1.3, pull)
      const kx = mix(-260, 1000, P(t, 21.9, 22.9, E.lin))
      show(kd.g, t > 21.88)
      const KY = 960
      if (give > 0) {
        teePos = [mix(MX, kx + 6, give), mix(MY - 430, KY - 196, give)]
        teeSc = mix(1.3, 0.95, give)
      }
      show(tee, t > 21.0)
      tf(tee, `translate(${f2(teePos[0])} ${f2(teePos[1])}) rotate(${f2((1 - pull) * 40)}) scale(${f2(teeSc)})`)
      if (t >= 21.0 && give < 1) {
        lean = -16 * (1 - pull)
        const sw = [70 * teeSc, -58 * teeSc]
        hL = [teePos[0] - sw[0], teePos[1] + sw[1]]
        hR = [teePos[0] + sw[0], teePos[1] + sw[1]]
        if (give > 0.6) (hL = null), (hR = null)
      }
      md.pose({
        x: MX, y: MY, lean, head: lean * 0.4 + (t > 23.2 ? -8 : 0),
        look: t > 22.4 ? [-3, 2] : [0, 0],
        mouth: t > 21.3 ? 'grin' : 'smile', blink: blinkAt(t, 0.2),
        hands: { L: hL, R: hR },
      })
      // sparkles and a breath of lavender off the clean tee
      spk.forEach((n, i) => {
        const tt = t - 21.25 - i * 0.13
        const a = tt > 0 && tt < 0.5 ? Math.sin((Math.PI * tt) / 0.5) : 0
        const off = [[-90, -70], [80, -50], [-60, 60], [100, 40], [0, -100], [-110, 10]][i]
        tf(n, `translate(${f2(teePos[0] + off[0] * teeSc)} ${f2(teePos[1] + off[1] * teeSc)}) scale(${f2(a)}) rotate(${f2(tt * 120)})`)
      })
      swirl.forEach((n, i) => {
        const pp = P(t, 21.3 + i * 0.15, 22.4 + i * 0.15, E.out2)
        n.setAttribute('stroke-dashoffset', f2(1 - pp))
        n.setAttribute('opacity', f2(0.6 * (1 - P(t, 22.6 + i * 0.1, 23.0 + i * 0.1))))
        tf(n, `translate(${f2(teePos[0] + [-170, 170, -120][i])} ${f2(teePos[1] - 10 * teeSc)})`)
      })
      sprigs.forEach((n, i) => {
        const pp = P(t, 21.45 + i * 0.18, 23.2 + i * 0.18, E.out2)
        const on = pp > 0 && pp < 1
        show(n, on)
        if (on) tf(n, `translate(${f2(teePos[0] + [-200, 200, -150, 160][i] + Math.sin(t * 3 + i) * 12)} ${f2(teePos[1] - 40 - pp * 260)}) rotate(${f2(-20 + i * 14 + pp * 30)}) scale(${f2(Math.sin(Math.PI * pp) * 0.9)})`)
      })
      // the kid hops in (white tank), takes the tee and hugs it
      const hopT = (t - 21.9) / 0.34
      const hopping = t > 21.9 && t < 22.92
      const hy = hopping ? -Math.abs(Math.sin(hopT * Math.PI)) * 70 : 0
      const hug = t > 23.3
      kd.pose({
        x: kx, y: KY + hy, outfit: 'tank',
        head: hug ? 8 : Math.sin(t * 5) * 4, headDy: hug ? 4 : 0,
        look: hug ? [0, 0] : [4, -2],
        mouth: hug ? 'bliss' : 'grin', eyes: hug ? 'closed' : 'open', blink: blinkAt(t, 1.1),
        hands: hug ? { L: [kx - 64, KY - 214], R: [kx + 68, KY - 214] } : give > 0 ? { L: [kx - 50, KY - 220], R: [kx + 60, KY - 220] } : { L: [kx - 90, KY - 330 + hy], R: [kx + 90, KY - 330 + hy] },
        feet: hopping && Math.abs(Math.sin(hopT * Math.PI)) > 0.3 ? { L: [-26, -40], R: [26, -40] } : undefined,
      })
      hearts.forEach((n, i) => {
        const pp = P(t, 23.45 + i * 0.15, 24.2 + i * 0.15, E.out2)
        const on = pp > 0
        show(n, on)
        if (on) tf(n, `translate(${f2(kx + (i - 1) * 50 + Math.sin(t * 4 + i) * 10)} ${f2(KY - 440 - pp * 160)}) scale(${f2(Math.sin(Math.PI * Math.min(1, pp * 1.2)) * 1.3)})`)
      })
    })
  }

  // ═════════════════════════════════════════════════════════════════════
  // 6 · Celebration (24–28): the kid in the clean tee, mom with the box
  // ═════════════════════════════════════════════════════════════════════
  {
    const [L] = layer('#EEE8F6')
    const w = world(L)
    const p = 'cel'
    sv(
      w.defs,
      `<radialGradient id="${p}b" cx=".5" cy=".4" r=".7"><stop offset="0" stop-color="#FBF8FE"/><stop offset=".6" stop-color="#EDE5F8"/><stop offset="1" stop-color="#D9CCF0"/></radialGradient>`,
    )
    const bw = 30
    sv(
      w.g,
      `<g>
        <rect x="-1000" y="-1200" width="3920" height="3400" fill="url(#${p}b)"/>
        <circle cx="400" cy="250" r="260" fill="#F9D3A8" opacity=".45"/><circle cx="1600" cy="300" r="300" fill="#CBE6D3" opacity=".5"/>
        ${RIBBON.map((col, i) => `<path class="rb" d="M -600 ${1010 + (i - 3) * bw} C 300 ${880 + (i - 3) * bw}, 900 ${1080 + (i - 3) * bw}, 2600 ${900 + (i - 3) * bw}" stroke="${col}" stroke-width="${bw * 1.05}" fill="none" pathLength="1" stroke-dasharray="1 1"/>`).join('')}
        <ellipse cx="1030" cy="935" rx="420" ry="20" fill="#16214A" opacity=".08"/>
      </g>`,
    )
    const rb = [...w.g.querySelectorAll('.rb')]
    // party poppers just outside the bottom corners; drawn behind the characters so no piece ever sits on a face
    const confR = rng(77)
    const conf = Array.from({ length: 48 }, (_, i) => {
      const col = RIBBON[i % 7]
      const n = sv(w.g, i % 6 === 0 ? `<g>${brandIn(['emblem_lavanta', 'emblem_bahar', 'emblem_narenciye'][i % 3], 0, 0, 52)}</g>` : `<rect x="-7" y="-12" width="14" height="24" rx="4" fill="${col}"/>`)
      return { n, side: (i >> 1) % 2 ? 1 : -1, up: 0.85 + confR() * 0.3, out: confR(), ph: confR() * 6.3, spin: (confR() - 0.5) * 900, burst: i % 2, late: confR() * 0.12 }
    })
    const md = mom(w.g)
    const kd = kid(w.g)
    const box = sv(w.g, `<g>${brandIn('angle_lavanta', 0, 0, 230)}</g>`)
    const capR = caption(c.forColour)
    cue(capR, 24.5, 27.05, V ? H * 0.17 : H * 0.14)
    scene(23.98, 27.95, L, (t) => {
      const push = P(t, 26.2, 27.5, E.io2)
      w.cam(mix(V ? 1150 : 1060, V ? 1240 : 1180, push), mix(V ? 600 : 560, 520, push), mix(V ? 1.25 : 1.02, V ? 1.45 : 1.22, push))
      rb.forEach((n, i) => n.setAttribute('stroke-dashoffset', f2(1 - P(t, 24.0 + i * 0.04, 25.0 + i * 0.04, E.io3))))
      const KX = 860
      const KY = 930
      const jump = (t0) => {
        const pp = clamp((t - t0) / 0.55)
        return pp > 0 && pp < 1 ? Math.sin(Math.PI * pp) * 150 : 0
      }
      const jy = jump(24.3) + jump(25.3) + jump(26.3) * 0.6
      const air = jy > 20
      kd.pose({
        x: KX, y: KY - jy, outfit: 'tee', stain: 0,
        head: Math.sin(t * 6) * 5, mouth: 'grin', blink: blinkAt(t, 0.5), look: [1, -1],
        hands: air ? { L: [KX - 110, KY - jy - 400], R: [KX + 110, KY - jy - 400] } : { L: [KX - 100, KY - 300], R: [KX + 100, KY - 300] },
        feet: air ? { L: [-30, -44], R: [30, -44] } : undefined,
      })
      const MX = 1270
      const MY = 930
      const hold = [MX + 168, MY - 455 + Math.sin(t * 2.2) * 6]
      md.pose({ x: MX, y: MY, head: -6, look: [-3, 0], mouth: 'grin', blink: blinkAt(t, 0.9), hands: { R: hold, L: [MX - 96, MY - 300] } })
      tf(box, `translate(${f2(hold[0] + 6)} ${f2(hold[1] - 86)}) rotate(${f2(2 + Math.sin(t * 2) * 2)})`)
      // popper origins sit just past the frame edges of the opening camera
      const ccx = V ? 1150 : 1060
      const ccy = V ? 600 : 560
      const cz = V ? 1.25 : 1.02
      const hw = W / 2 / k / cz
      const hh = H / 2 / k / cz
      const g = 900
      const rise = 1.42 * hh
      conf.forEach((cf) => {
        const t0 = (cf.burst ? 24.55 : 25.55) + cf.late
        const dt = t - t0
        const on = dt > 0 && dt < 2.2
        show(cf.n, on)
        if (!on) return
        const vy = Math.sqrt(2 * g * rise * cf.up)
        const vx = (0.35 + cf.out * 0.55) * hw * (V ? 0.7 : 0.62)
        const x0 = ccx + cf.side * (hw + 40)
        const y0 = ccy + hh + 50
        const x = x0 - cf.side * vx * dt + Math.sin(dt * 7 + cf.ph) * 14 * clamp(dt / 0.6)
        const y = y0 - vy * dt + 0.5 * g * dt * dt
        tf(cf.n, `translate(${f2(x)} ${f2(y)}) rotate(${f2(cf.spin * dt)})`)
        cf.n.setAttribute('opacity', f2(1 - clamp((dt - 1.6) / 0.6)))
      })
    })
  }

  // a white flash on the cut into the celebration
  {
    const fl = el(`<div class="layer" style="z-index:65;background:#FFFFFF"></div>`)
    scene(23.9, 24.3, fl, (t) => (fl.style.opacity = f2(t < 24 ? P(t, 23.9, 24.0) : 1 - P(t, 24.0, 24.28, E.out2))))
  }


  // ═════════════════════════════════════════════════════════════════════
  // 7 · End card (28–32)
  // ═════════════════════════════════════════════════════════════════════
  {
    const [L, cam] = layer(`linear-gradient(180deg, ${C.paper} 0%, ${C.cream} 100%)`)
    const g1 = glow(cam, '#D9CCF0', 1100, 0.8)
    const g2 = glow(cam, '#F9D3A8', 1000, 0.7)
    const g3 = glow(cam, '#CBE6D3', 800, 0.7)
    const bub = bubbles(cam, 10, 21, { min: 22, max: 70, speed: [40, 90] })
    const bw = (V ? 30 : 22) * k
    const path = V
      ? (o) => `M ${-0.2 * W} ${1.0 * H + o} C ${0.3 * W} ${0.88 * H + o}, ${0.6 * W} ${1.04 * H + o}, ${1.2 * W} ${0.91 * H + o}`
      : (o) => `M ${-0.05 * W} ${1.0 * H + o} C ${0.3 * W} ${0.82 * H + o}, ${0.62 * W} ${1.04 * H + o}, ${1.05 * W} ${0.84 * H + o}`
    const rib = el(
      `<svg class="layer" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${RIBBON.map(
        (col, i) => `<path d="${path((i - 3) * bw)}" stroke="${col}" stroke-width="${bw * 1.06}" fill="none" pathLength="1" stroke-dasharray="1 1"/>`,
      ).join('')}</svg>`,
      cam,
    )
    const ribPaths = [...rib.children]
    const bigW = (V ? 620 : 600) * k
    const smallW = bigW * 0.66
    const boxes = [
      { n: el(`<div class="abs pack" style="width:${smallW}px">${brandSvg('angle_bahar', 'width:100%;height:auto;filter:drop-shadow(0 24px 30px rgba(22,33,74,.16))')}</div>`, cam), dx: V ? -0.27 : -0.32, dy: -0.07, w: smallW, d: 0.1 },
      { n: el(`<div class="abs pack" style="width:${smallW}px">${brandSvg('angle_narenciye', 'width:100%;height:auto;filter:drop-shadow(0 24px 30px rgba(22,33,74,.16))')}</div>`, cam), dx: V ? 0.27 : 0.32, dy: -0.07, w: smallW, d: 0.22 },
      { n: el(`<div class="abs pack" style="width:${bigW}px">${brandSvg('angle_lavanta', 'width:100%;height:auto;filter:drop-shadow(0 34px 40px rgba(22,33,74,.22))')}</div>`, cam), dx: 0, dy: 0.05, w: bigW, d: 0 },
    ]
    const fs = (V ? 200 : 168) * k
    const logo = el(
      `<div class="abs" style="font:800 ${fs}px/1 Figtree;letter-spacing:-.04em;white-space:nowrap">
        <span style="position:relative;display:inline-flex;align-items:flex-end">${letters('VELMO')}
          <svg viewBox="0 0 24 16" style="position:absolute;top:-.42em;left:.78em;height:.42em;width:.62em;overflow:visible">
            <g class="lr" style="transform-origin:12px 16px"><path d="M12 16 C 13 8 18 2 24 0 C 24 8 19 14 12 16 Z" fill="#3A8A3E"/></g>
            <g class="ll" style="transform-origin:12px 16px"><path d="M12 16 C 11 9 7 4 1 3 C 1 10 6 15 12 16 Z" fill="#5BA548"/></g>
          </svg>
        </span>
      </div>`,
      cam,
    )
    const leafR = logo.querySelector('.lr')
    const leafL = logo.querySelector('.ll')
    const line = fit(el(`<div class="abs serif nowrap" style="font-size:${(V ? 74 : 64) * k}px">${words(c.endLine)}</div>`, cam), V ? W * 0.86 : W * 0.38)
    const brow = fit(el(`<div class="abs nowrap" style="font:600 ${(V ? 30 : 27) * k}px Figtree;color:${C.inkSoft}">${c.eyebrow}</div>`, cam), V ? W * 0.86 : W * 0.38)
    const cta = el(
      `<div class="abs pill" style="font:700 ${(V ? 42 : 38) * k}px Figtree;color:#fff;background:${C.ink};padding:${26 * k}px ${50 * k}px;gap:${18 * k}px;box-shadow:0 ${20 * k}px ${40 * k}px -${16 * k}px rgba(22,33,74,.5);overflow:hidden;position:absolute">
        ${svgIcon('ShoppingBag', '#fff', 40 * k, 2)}<span>${c.cta}</span>
        <span class="shine" style="position:absolute;top:0;bottom:0;left:0;width:40%;background:linear-gradient(100deg,rgba(255,255,255,0),rgba(255,255,255,.35),rgba(255,255,255,0))"></span>
      </div>`,
      cam,
    )
    const shine = cta.querySelector('.shine')
    const made = el(`<div class="abs nowrap" style="font:600 ${(V ? 26 : 23) * k}px Figtree;letter-spacing:.18em;text-transform:uppercase;color:${C.inkMute}">${c.madeIn}</div>`, cam)

    scene(27.45, DUR + 0.01, L, (t) => {
      const ip = P(t, 27.55, 28.25, E.io3)
      // a curved wipe from off-screen (left, or top when vertical): no dot, no smudge on the box
      if (ip < 1) {
        const [ox, oy] = V ? [W / 2, -0.3 * H] : [-0.25 * W, H / 2]
        const r0 = V ? 0.3 * H : 0.25 * W
        clipCircle(L, ox, oy, mix(r0, Math.hypot(W - ox, H - oy) + 20, ip))
      }
      else clipNone(L)
      put(cam, W / 2, H / 2, { s: 1.05 - P(t, 27.6, 32, E.out2) * 0.05 })
      put(g1, W * 0.2, H * 0.22 + Math.sin(t) * 30 * k, {})
      put(g2, W * 0.86, H * 0.7, { s: 1 + Math.sin(t * 0.8) * 0.05 })
      put(g3, W * 0.55, H * 0.05, {})
      bub(t, P(t, 28.4, 29.4))
      ribPaths.forEach((p, i) => p.setAttribute('stroke-dashoffset', (1 - P(t, 28.0 + i * 0.04, 29.3 + i * 0.04, E.io3)).toFixed(4)))
      const bcx = V ? W / 2 : W * 0.725
      const bcy = V ? H * 0.46 : H * 0.5
      boxes.forEach((b, i) => {
        const p = P(t, 28.15 + b.d, 28.95 + b.d, E.outBackSoft)
        const float = Math.sin(t * 1.5 + i * 1.7) * 8 * k
        put(b.n, bcx + b.dx * (V ? W : W * 0.5) * (V ? 1 : 0.95), bcy + b.dy * H + (1 - p) * H * 0.5 + float, { r: (1 - p) * (i === 0 ? -12 : i === 1 ? 12 : 0), a: P(t, 28.15 + b.d, 28.4 + b.d) })
      })
      const tx = V ? W / 2 : W * 0.075
      const o = V ? {} : { ax: 0 }
      const ly = V ? H * 0.14 : H * 0.29
      put(logo, tx, ly, { ...o, s: mix(0.92, 1, P(t, 28.2, 29.2)) })
      rise(logo, t, 28.25, { dur: 0.8, stagger: 0.06, e: E.out5, tilt: 0 })
      const pr = P(t, 28.75, 29.15, E.outBack)
      const pl = P(t, 28.85, 29.25, E.outBack)
      leafR.style.transform = `scale(${pr}) rotate(${(1 - pr) * 30}deg)`
      leafL.style.transform = `scale(${pl}) rotate(${(pl - 1) * 30}deg)`
      put(line, tx, V ? H * 0.23 : H * 0.45, o)
      rise(line, t, 28.65, { dur: 0.7, stagger: 0.07 })
      put(brow, tx, V ? H * 0.665 : H * 0.54, { ...o, a: P(t, 29.0, 29.5), pre: `translateY(${(1 - P(t, 29, 29.6)) * 16 * k}px)` })
      const cp = P(t, 29.2, 29.75, E.outBack)
      const pulse = 1 + Math.max(0, Math.sin((t - 30.6) * Math.PI * 1.25)) * 0.03 * (t > 30.6 && t < 31.4 ? 1 : 0)
      put(cta, tx, V ? H * 0.73 : H * 0.67, { ...o, s: mix(0.6, 1, cp) * pulse, a: P(t, 29.2, 29.4) })
      shine.style.transform = `translateX(${mix(-120, 320, P(t, 30.1, 30.8, E.io2))}%)`
      put(made, tx, V ? H * 0.795 : H * 0.8, { ...o, a: P(t, 29.6, 30.1) })
    })
  }

  // ── film-wide finishing: grain and vignette ───────────────────────────
  const grain = el(`<div id="grain" style="z-index:90"></div>`)
  {
    const cv = document.createElement('canvas')
    cv.width = cv.height = 256
    const g = cv.getContext('2d')
    const img = g.createImageData(256, 256)
    const r = rng(5)
    for (let i = 0; i < img.data.length; i += 4) {
      const v = 128 + (r() - 0.5) * 200
      img.data[i] = img.data[i + 1] = img.data[i + 2] = v
      img.data[i + 3] = 255
    }
    g.putImageData(img, 0, 0)
    grain.style.backgroundImage = `url(${cv.toDataURL()})`
    grain.style.backgroundSize = `${256 * Math.max(1, k)}px`
  }
  el(`<div id="vignette" style="z-index:91;background:radial-gradient(ellipse at 50% 50%, rgba(22,33,74,0) 55%, rgba(22,33,74,.16) 100%)"></div>`)


  window.DUR = DUR
  // Settled moments of each scene, checked by qa/layout.js.
  window.QA_MOMENTS = [3.1, 6.9, 9.6, 11.7, 14.9, 18.0, 21.7, 23.2, 25.6, 31.0]
  window.seek = (t) => {
    for (const s of scenes) {
      const on = t >= s.a && t < s.b
      s.node.style.display = on ? '' : 'none'
      if (on) s.update(t)
    }
    runCues(t)
    chipsAt(t, [8.15, 10.3, 12.75], 15.15)
    const f = Math.floor(t * 30)
    const gr = rng(f + 1)
    grain.style.transform = `translate(${Math.floor(gr() * 64)}px,${Math.floor(gr() * 64)}px)`
  }
  scenes.forEach((s, i) => {
    if (!s.node.style.zIndex) s.node.style.zIndex = i + 1
  })

  window.ready = (async () => {
    await document.fonts.load(`500 100px Fraunces`, 'ığşçöüİĞŞÇÖÜ!')
    await document.fonts.load(`700 100px Fraunces`, '!')
    await document.fonts.load(`800 100px Figtree`, 'ığşçöüİĞŞÇÖÜ')
    await document.fonts.load(`700 100px Figtree`, 'ığşçöüİĞŞÇÖÜ')
    await document.fonts.load(`600 100px Figtree`, 'ığşçöüİĞŞÇÖÜ')
    await document.fonts.ready
    for (const [n, max] of fits) {
      const d = n.style.display
      n.style.display = ''
      n.style.visibility = 'hidden'
      const w = n.scrollWidth
      n.style.display = d
      n.style.visibility = ''
      if (w > max) n.style.fontSize = `${(parseFloat(getComputedStyle(n).fontSize) * max) / w}px`
    }
    window.seek(0)
    return true
  })()
})()
