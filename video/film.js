/*
 * VELMO — 32 s promo film, drawn in HTML/SVG and rendered frame by frame.
 *
 * Everything on screen is a pure function of time: `seek(t)` puts every
 * element where it belongs at second t, so any frame can be rendered in any
 * order (the renderer runs several browser pages in parallel and blends
 * sub-frames for motion blur). No CSS animations or transitions are used.
 *
 * URL params: ?lang=tr|en&w=1920&h=1080 (a taller-than-wide size switches
 * every scene to its vertical 9:16 layout).
 *
 * Timeline (120 BPM, one bar = 2 s, cuts land on bar lines):
 *   0–4   logo build          4–8   the hassle (navy)      8–12  one sheet
 *  12–18  three steps          18–22 highlights + numbers   22–28 three scents
 *  28–32  end card
 */
;(() => {
  const Q = new URLSearchParams(location.search)
  const W = +(Q.get('w') || 1920)
  const H = +(Q.get('h') || 1080)
  const LANG = Q.get('lang') === 'en' ? 'en' : 'tr'
  const V = H > W
  const k = V ? W / 1080 : H / 1080
  const DUR = 32

  // Copy comes from the site (lib/i18n, data/products) — nothing new is claimed.
  const COPY = {
    tr: {
      tagline: 'Temiz çamaşır, daha yeşil bir yarın.',
      eyebrow: 'Renkli çamaşırlar için deterjan yaprağı',
      hassleHead: 'Her yıkamada aynı dert:',
      hassles: ['Ölçü kabı', 'Dökülen deterjan', 'Ağır şişeler'],
      hassleEnd: 'Artık yok.',
      titleA: 'Bir yaprak.',
      titleB: 'Bir yıkama.',
      cmW: '11 cm',
      cmH: '28 cm',
      stepsTitle: 'Üç adımda temiz çamaşır',
      steps: ['Yaprağı makineye koyun', 'Çamaşırları ekleyin', 'Makineyi çalıştırın'],
      featuresTitle: 'Öne çıkanlar',
      features: ['Çevre dostu formül', 'Hızlı çözünür', 'Renkleri canlı tutar', 'Plastik içermeyen ambalaj'],
      stats: [['30', 'yaprak'], ['30', 'yıkama'], ['120 g', 'net ağırlık']],
      statsNote: '30 yıkamalık kutu sadece 120 g.',
      scentsTitle: 'Kokunu seç',
      scents: [
        ['Lavanta', 'Uzun süre kalıcı ferahlık'],
        ['Bahar', 'Beyaz çiçeklerin hafif kokusu'],
        ['Narenciye', 'Canlı portakal ferahlığı'],
      ],
      endLine: 'Bir yaprak. Bir yıkama.',
      cta: 'Kokunu Seç, Satın Al',
      madeIn: 'Türkiye’de üretildi',
    },
    en: {
      tagline: 'Clean laundry, a greener tomorrow.',
      eyebrow: 'Detergent sheets for coloured laundry',
      hassleHead: 'Every wash, the same hassle:',
      hassles: ['Measuring cups', 'Spilled detergent', 'Heavy bottles'],
      hassleEnd: 'Not anymore.',
      titleA: 'One sheet.',
      titleB: 'One wash.',
      cmW: '11 cm',
      cmH: '28 cm',
      stepsTitle: 'Clean laundry in three steps',
      steps: ['Put a sheet in the machine', 'Add your laundry', 'Start the machine'],
      featuresTitle: 'Highlights',
      features: ['Eco-friendly formula', 'Dissolves quickly', 'Keeps colours bright', 'Plastic-free packaging'],
      stats: [['30', 'sheets'], ['30', 'washes'], ['120 g', 'net weight']],
      statsNote: 'A 30-wash box weighs just 120 g.',
      scentsTitle: 'Pick your scent',
      scents: [
        ['Lavender', 'Long-lasting freshness'],
        ['Spring', 'A light white-flower scent'],
        ['Citrus', 'Zesty orange freshness'],
      ],
      endLine: 'One sheet. One wash.',
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
  // 1 · Logo build (0–4)
  // ═════════════════════════════════════════════════════════════════════
  {
    const [L, cam] = layer(C.paper)
    const g1 = glow(cam, '#D9CCF0', V ? 1100 : 1200, 0.8)
    const g2 = glow(cam, '#FBD9B5', V ? 900 : 1000, 0.7)
    const g3 = glow(cam, '#CFE6D6', V ? 700 : 760, 0.6)
    const bw = (V ? 30 : 24) * k
    const path = V
      ? (o) => `M ${-0.2 * W} ${0.95 * H + o} C ${0.25 * W} ${0.66 * H + o}, ${0.62 * W} ${0.9 * H + o}, ${1.2 * W} ${0.68 * H + o}`
      : (o) => `M ${-0.08 * W} ${1.04 * H + o} C ${0.28 * W} ${0.66 * H + o}, ${0.56 * W} ${1.02 * H + o}, ${1.08 * W} ${0.7 * H + o}`
    const rib = el(
      `<svg class="layer" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${RIBBON.map(
        (col, i) => `<path d="${path((i - 3) * bw)}" stroke="${col}" stroke-width="${bw * 1.06}" fill="none" pathLength="1" stroke-dasharray="1 1"/>`,
      ).join('')}</svg>`,
      cam,
    )
    const ribPaths = [...rib.children]
    const bub = bubbles(cam, 9, 3, { min: 20, max: 64, speed: [30, 70] })
    const fs = (V ? 230 : 250) * k
    const logo = el(
      `<div class="abs" style="font:800 ${fs}px/1 Figtree;letter-spacing:-.04em;white-space:nowrap">
        <span style="position:relative;display:inline-flex;align-items:flex-end">${letters('VELMO')}
          <svg viewBox="0 0 24 16" style="position:absolute;top:-.42em;left:.78em;height:.42em;width:.62em;overflow:visible">
            <g class="lr" style="transform-origin:12px 16px"><path d="M12 16 C 13 8 18 2 24 0 C 24 8 19 14 12 16 Z" fill="#3A8A3E"/></g>
            <g class="ll" style="transform-origin:12px 16px"><path d="M12 16 C 11 9 7 4 1 3 C 1 10 6 15 12 16 Z" fill="#5BA548"/></g>
            <g class="spark" stroke="#5BA548" stroke-width="1.3" stroke-linecap="round">${[0, 1, 2, 3, 4].map((i) => `<line x1="0" y1="0" x2="0" y2="0" data-a="${-150 + i * 30}"/>`).join('')}</g>
          </svg>
        </span>
      </div>`,
      cam,
    )
    const leafR = logo.querySelector('.lr')
    const leafL = logo.querySelector('.ll')
    const sparks = [...logo.querySelectorAll('.spark line')]
    const tag = fit(el(`<div class="abs serif nowrap" style="font-size:${(V ? 62 : 60) * k}px;font-weight:400;color:${C.inkSoft}">${words(c.tagline)}</div>`, cam), W * (V ? 0.84 : 0.8))
    const eyebrow = el(
      `<div class="abs nowrap" style="font:700 ${(V ? 25 : 22) * k}px Figtree;letter-spacing:.22em;text-transform:uppercase;color:${C.lav}">${c.eyebrow}</div>`,
      cam,
    )

    scene(0, 4.15, L, (t) => {
      put(cam, 0, -P(t, 3.35, 4.1, E.in3) * 90 * k, { ax: 0, ay: 0, s: 1 + t * 0.012 })
      put(g1, W * 0.2 + Math.sin(t * 0.7) * 60 * k, H * 0.2, { s: 1 + t * 0.03 })
      put(g2, W * 0.85, H * 0.78 + Math.cos(t * 0.6) * 40 * k, { s: 1 + t * 0.02 })
      put(g3, W * (V ? 0.8 : 0.62), H * (V ? 0.25 : 0.12), {})
      ribPaths.forEach((p, i) => {
        const d = P(t, 0.05 + i * 0.045, 1.55 + i * 0.045, E.io3)
        p.setAttribute('stroke-dashoffset', (1 - d).toFixed(4))
      })
      put(rib, 0, Math.sin(t * 1.2) * 6 * k, { ax: 0, ay: 0 })
      bub(t + 4, P(t, 1.2, 2.2) * 0.9)
      const ly = V ? H * 0.4 : H * 0.42
      put(logo, W / 2, ly, { s: mix(0.94, 1, P(t, 0.4, 2.2, E.out3)) })
      rise(logo, t, 0.42, { dur: 0.9, stagger: 0.075, e: E.out5, tilt: 0 })
      const pr = P(t, 1.18, 1.62, E.outBack)
      const pl = P(t, 1.3, 1.74, E.outBack)
      leafR.style.transform = `scale(${pr}) rotate(${(1 - pr) * 30}deg)`
      leafL.style.transform = `scale(${pl}) rotate(${(pl - 1) * 30}deg)`
      const sp = P(t, 1.5, 2.05, E.out3)
      sparks.forEach((ln) => {
        const ang = (+ln.dataset.a * Math.PI) / 180
        const r0 = 14 + sp * 8
        const r1 = r0 + 5 * (1 - sp) + 1
        ln.setAttribute('x1', 12 + Math.cos(ang) * r0)
        ln.setAttribute('y1', 8 + Math.sin(ang) * r0)
        ln.setAttribute('x2', 12 + Math.cos(ang) * r1)
        ln.setAttribute('y2', 8 + Math.sin(ang) * r1)
        ln.style.opacity = sp > 0 && sp < 1 ? 1 - sp : 0
      })
      put(eyebrow, W / 2, ly - fs * 1.13, { a: P(t, 1.05, 1.6, E.out2), pre: `translateY(${(1 - P(t, 1.05, 1.7)) * 16 * k}px)` })
      put(tag, W / 2, ly + fs * (V ? 0.66 : 0.64), {})
      rise(tag, t, 1.55, { dur: 0.8, stagger: 0.06 })
    })
  }

  // ═════════════════════════════════════════════════════════════════════
  // 2 · The hassle (4–8) — navy, rises in as a wave
  // ═════════════════════════════════════════════════════════════════════
  {
    const [L, cam] = layer(`radial-gradient(ellipse at 28% 38%, #25336F 0%, #16214A 55%, #0F1838 100%)`)
    const icons = ['Beaker', 'Droplets', 'Milk']
    const x0 = V ? 96 * k : W * 0.2
    const fs = (V ? 90 : 100) * k
    const head = el(`<div class="abs nowrap" style="font:600 ${(V ? 38 : 36) * k}px Figtree;color:#A9B0D3;letter-spacing:.01em">${words(c.hassleHead)}</div>`, cam)
    const rows = c.hassles.map((txt, i) => {
      const row = el(
        `<div class="abs" style="display:flex;align-items:center;gap:${34 * k}px;white-space:nowrap">
          <span class="ic" style="display:flex;align-items:center;justify-content:center;width:${fs * 0.95}px;height:${fs * 0.95}px;border-radius:50%;background:rgba(169,176,211,.12)">${svgIcon(icons[i], '#B9B0EC', fs * 0.5, 1.6)}</span>
          <span class="serif tx" style="font-size:${fs}px;color:${C.cream}">${words(txt)}</span>
          <span class="st" style="position:absolute;left:${-14 * k}px;right:${-22 * k}px;top:50%;height:${7 * k}px;margin-top:${-3 * k}px;border-radius:9px;background:linear-gradient(90deg,${C.coral},#F7AE62);transform-origin:0 50%"></span>
        </div>`,
        cam,
      )
      fit(row.querySelector('.tx'), W - x0 - W * 0.07 - fs * 0.95 - 34 * k)
      return { row, ic: row.querySelector('.ic'), tx: row.querySelector('.tx'), st: row.querySelector('.st') }
    })
    const end = el(`<div class="abs serif nowrap" style="font-size:${(V ? 104 : 112) * k}px;font-weight:600">${words(c.hassleEnd, '', `background:linear-gradient(95deg,#B9A6F2,${C.coral} 55%,#F7AE62);-webkit-background-clip:text;background-clip:text;color:transparent`)}</div>`, cam)
    const ys = V ? [H * 0.4, H * 0.49, H * 0.58] : [H * 0.36, H * 0.5, H * 0.64]

    scene(3.45, 8.3, L, (t) => {
      // wave rising from the bottom
      const p = P(t, 3.45, 4.1, E.io3)
      if (p < 1) {
        const amp = 46 * k * (1 - p * 0.6)
        const top = mix(H + amp * 1.2, -amp * 1.5, p)
        const pts = []
        for (let i = 0; i <= 40; i++) {
          const x = (W * i) / 40
          pts.push([x, top + Math.sin((i / 40) * Math.PI * 3 + t * 9) * amp])
        }
        pts.push([W, H + 10], [0, H + 10])
        clipPoly(L, pts)
      } else clipNone(L)
      const zoomOut = P(t, 7.55, 8.25, E.in3)
      put(cam, W / 2, H / 2, { s: 1 + (t - 4) * 0.01 + zoomOut * 0.08, a: 1 - zoomOut * 0.6 })
      put(head, x0, V ? H * 0.32 : H * 0.22, { ax: 0 })
      rise(head, t, 4.05, { dur: 0.6, stagger: 0.04 })
      rows.forEach((r, i) => {
        const t0 = 4.4 + i * 0.5
        put(r.row, x0, ys[i], { ax: 0 })
        const ip = P(t, t0, t0 + 0.5, E.outBack)
        r.ic.style.transform = `scale(${ip})`
        rise(r.tx, t, t0 + 0.06, { dur: 0.6, stagger: 0.06 })
        const sp = P(t, 6.12 + i * 0.2, 6.4 + i * 0.2, E.out3)
        r.st.style.transform = `rotate(-1.6deg) scaleX(${sp})`
        r.st.style.opacity = sp > 0 ? 1 : 0
        r.row.style.opacity = mix(1, 0.42, P(t, 6.3 + i * 0.2, 6.7 + i * 0.2))
      })
      put(end, x0, V ? H * 0.7 : H * 0.84, { ax: 0 })
      rise(end, t, 6.78, { dur: 0.6, stagger: 0.09, e: E.outBack, tilt: 3 })
    })
  }

  // ═════════════════════════════════════════════════════════════════════
  // 3 · One sheet, one wash (8–12) — the sheet falls in, an iris opens
  // ═════════════════════════════════════════════════════════════════════
  const S3 = {}
  {
    const [L, cam] = layer(`linear-gradient(180deg, ${C.paper} 0%, ${C.cream} 100%)`)
    const g1 = glow(cam, '#D9CCF0', V ? 1000 : 1100, 0.9)
    const g2 = glow(cam, '#F9D3A8', V ? 900 : 1000, 0.75)
    const g3 = glow(cam, '#CBE6D3', 700, 0.7)
    const bub = bubbles(cam, V ? 12 : 14, 7)
    const fs = (V ? 128 : 122) * k
    const A = el(`<div class="abs serif nowrap" style="font-size:${fs}px">${words(c.titleA)}</div>`, cam)
    const B = el(`<div class="abs serif nowrap" style="font-size:${fs}px">${words(c.titleB, '', `background:${GRAD};-webkit-background-clip:text;background-clip:text;color:transparent;padding-right:.04em`)}</div>`, cam)
    const brow = el(
      `<div class="abs pill" style="font:700 ${(V ? 26 : 22) * k}px Figtree;letter-spacing:.16em;text-transform:uppercase;color:${C.lavDeep};background:rgba(255,255,255,.7);border:1px solid ${C.line};padding:${14 * k}px ${26 * k}px">${c.eyebrow}</div>`,
      cam,
    )
    // the sheet sits above every scene from the moment it falls in until it drops out
    const sl = el(`<div class="layer" style="z-index:40;overflow:visible;pointer-events:none"></div>`)
    const sh = sheet(sl, (V ? 720 : 560) * k)
    const dimH = el(
      `<div class="abs" style="height:${sh.h}px;width:${40 * k}px">
        <div class="ln" style="position:absolute;left:50%;top:0;bottom:0;width:${2.4 * k}px;margin-left:${-1.2 * k}px;background:${C.ink};opacity:.55;transform-origin:50% 50%"></div>
        <div class="tk" style="position:absolute;left:0;right:0;top:0;height:${2.4 * k}px;background:${C.ink};opacity:.55"></div>
        <div class="tk" style="position:absolute;left:0;right:0;bottom:0;height:${2.4 * k}px;background:${C.ink};opacity:.55"></div>
        <div class="lb pill" style="position:absolute;left:50%;top:50%;font:700 ${24 * k}px Figtree;background:${C.ink};color:#fff;padding:${8 * k}px ${16 * k}px">${c.cmH}</div>
      </div>`,
      sl,
    )
    const dimW = el(
      `<div class="abs" style="width:${sh.w}px;height:${40 * k}px">
        <div class="ln" style="position:absolute;top:50%;left:0;right:0;height:${2.4 * k}px;margin-top:${-1.2 * k}px;background:${C.ink};opacity:.55;transform-origin:50% 50%"></div>
        <div class="tk" style="position:absolute;top:0;bottom:0;left:0;width:${2.4 * k}px;background:${C.ink};opacity:.55"></div>
        <div class="tk" style="position:absolute;top:0;bottom:0;right:0;width:${2.4 * k}px;background:${C.ink};opacity:.55"></div>
        <div class="lb pill" style="position:absolute;left:50%;top:50%;font:700 ${24 * k}px Figtree;background:${C.ink};color:#fff;padding:${8 * k}px ${16 * k}px">${c.cmW}</div>
      </div>`,
      sl,
    )
    S3.layer = L
    S3.sheetLayer = sl

    const cx = W / 2
    const cy = V ? H * 0.5 : H * 0.53
    scene(7.3, 12.3, L, (t) => {
      const ip = P(t, 7.72, 8.32, E.io3)
      if (ip < 1) clipCircle(L, cx, cy, ip * FAR * 0.62)
      else if (t < 11.4) clipNone(L)
      put(cam, W / 2, H / 2, { s: 1.06 - P(t, 7.7, 12, E.out2) * 0.06 })
      put(g1, W * 0.18 + Math.sin(t * 0.6) * 50 * k, H * 0.25, { s: 1 + Math.sin(t * 0.8) * 0.05 })
      put(g2, W * 0.86, H * 0.78, { s: 1 + Math.cos(t * 0.7) * 0.06 })
      put(g3, W * 0.62, H * 0.1 + Math.sin(t) * 30 * k, {})
      bub(t - 6, P(t, 8.2, 9.2))
      put(brow, W / 2, V ? H * 0.09 : H * 0.12, { a: P(t, 8.5, 9.0), pre: `translateY(${(1 - P(t, 8.5, 9.1)) * 20 * k}px)` })
      if (V) {
        put(A, W / 2, H * 0.205, {})
        put(B, W / 2, H * 0.83, {})
      } else {
        put(A, W * 0.235, H * 0.47, {})
        put(B, W * 0.77, H * 0.6, {})
      }
      rise(A, t, 8.2, { dur: 0.8, stagger: 0.12 })
      rise(B, t, 9.05, { dur: 0.8, stagger: 0.12 })
    })

    scene(7.3, 11.9, sl, (t) => {
      // fall in (decelerating, as if caught by air), flutter, settle, then drop out
      const fall = P(t, 7.3, 8.05, E.out3)
      const flutter = 1 - P(t, 9.5, 10.1, E.io3)
      const drop = P(t, 11.25, 11.8, E.in3)
      const y = mix(-sh.h, cy, fall) + Math.sin(t * 1.4) * 10 * k * flutter + drop * (H * 0.75 + sh.h)
      const x = cx + Math.sin(t * 1.1 + 0.5) * 14 * k * flutter
      const rz = mix(-38, 0, fall) + Math.sin(t * 2.1) * 6 * flutter + drop * 28
      const ry = Math.sin(t * 1.7) * 22 * flutter
      const rx = Math.sin(t * 1.3 + 1) * 10 * flutter
      put(sh.n, x, y, { r: rz, pre: `perspective(${1400 * k}px) rotateX(${rx}deg) rotateY(${ry}deg)` })
      const sp = P(t, 8.85, 9.65, E.io2)
      sh.sheen.style.transform = `translateX(${sp * 260}%)`
      sh.sheen.style.opacity = sp > 0 && sp < 1 ? 1 : 0
      // dimension lines, once the sheet is still
      const d = P(t, 10.0, 10.5, E.out4)
      const lb = P(t, 10.25, 10.65, E.outBack)
      const fade = 1 - P(t, 11.05, 11.3)
      const gap = 44 * k
      put(dimH, x + sh.w / 2 + gap, y, { a: (d > 0 ? 1 : 0) * fade })
      dimH.querySelector('.ln').style.transform = `scaleY(${d})`
      dimH.querySelectorAll('.tk').forEach((n) => (n.style.transform = `scaleX(${d})`))
      dimH.querySelector('.lb').style.transform = `translate(-50%,-50%) scale(${lb})`
      put(dimW, x, y + sh.h / 2 + gap, { a: (d > 0 ? 1 : 0) * fade })
      dimW.querySelector('.ln').style.transform = `scaleX(${d})`
      dimW.querySelectorAll('.tk').forEach((n) => (n.style.transform = `scaleY(${d})`))
      dimW.querySelector('.lb').style.transform = `translate(-50%,-50%) scale(${lb})`
    })
  }

  // ═════════════════════════════════════════════════════════════════════
  // 4 · Three steps (12–18) — sheet in, laundry in, start
  // ═════════════════════════════════════════════════════════════════════
  const S4 = {}
  {
    const [L, cam] = layer(`linear-gradient(160deg, ${C.paper} 0%, ${C.cream} 70%, ${C.deep} 100%)`)
    const STEP = [C.lav, C.bah, C.nar]
    const STEP_SOFT = [C.lavSoft, C.bahSoft, C.narSoft]
    const mh = (V ? 860 : 830) * k
    const ms = mh / 470
    const mw = 400 * ms
    const mcx = V ? W / 2 : W * 0.295
    const mcy = V ? H * 0.3 : H * 0.53
    const halo = el(`<div class="glow" style="width:${mh * 1.15}px;height:${mh * 1.15}px;background:radial-gradient(circle, #E4DBF4 0%, rgba(228,219,244,0) 66%)"></div>`, cam)
    const holes = Array.from({ length: 18 }, (_, i) => {
      const a = (i / 18) * Math.PI * 2
      return `<circle cx="${200 + Math.cos(a) * 86}" cy="${268 + Math.sin(a) * 86}" r="3.2" fill="${C.ink}" opacity=".13"/>`
    }).join('')
    const shirt = 'M-14 -11 L-6 -17 C -3 -13 3 -13 6 -17 L14 -11 L11 -5 L7 -7 L7 13 L-7 13 L-7 -7 L-11 -5 Z'
    const sock = 'M-4 -12 L4 -12 L4 3 C 4 6 6 7 10 7 C 13 7 14 9 14 11 C 14 14 12 15 9 15 L-1 15 C -4 15 -4 12 -4 10 Z'
    const foam = Array.from({ length: 16 }, (_, i) => `<circle class="fm" r="${3 + (i % 4) * 1.6}" fill="#fff" stroke="${C.ink}" stroke-width="1.2"/>`).join('')
    const machine = el(
      `<svg class="abs" width="${mw}" height="${mh}" viewBox="0 0 400 470">
        <defs>
          <clipPath id="drum"><circle cx="200" cy="268" r="99"/></clipPath>
          <linearGradient id="mbody" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFFFFF"/><stop offset="1" stop-color="#F2EEF8"/></linearGradient>
          <linearGradient id="mring" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFFFFF"/><stop offset="1" stop-color="#DCD5EA"/></linearGradient>
          <radialGradient id="mglass" cx=".38" cy=".32" r=".85"><stop offset="0" stop-color="#FFFFFF" stop-opacity="0"/><stop offset="1" stop-color="#16214A" stop-opacity=".16"/></radialGradient>
        </defs>
        <ellipse cx="200" cy="458" rx="190" ry="12" fill="${C.ink}" opacity=".12"/>
        <g id="mshake">
          <rect x="58" y="434" width="36" height="20" rx="6" fill="${C.ink}"/>
          <rect x="306" y="434" width="36" height="20" rx="6" fill="${C.ink}"/>
          <rect x="22" y="18" width="356" height="424" rx="36" fill="url(#mbody)" stroke="${C.ink}" stroke-width="5"/>
          <line x1="22" y1="100" x2="378" y2="100" stroke="${C.ink}" stroke-width="4"/>
          <rect x="48" y="40" width="104" height="38" rx="9" fill="${C.cream}" stroke="${C.ink}" stroke-width="3.5"/>
          <line x1="78" y1="59" x2="122" y2="59" stroke="${C.ink}" stroke-width="3.5" stroke-linecap="round"/>
          <rect x="182" y="42" width="98" height="34" rx="9" fill="${C.ink}"/>
          ${[0, 1, 2].map((i) => `<circle class="led" cx="${206 + i * 25}" cy="59" r="6.5" fill="#3A4673"/>`).join('')}
          <g id="knob" transform="translate(334 59)"><circle r="23" fill="#fff" stroke="${C.ink}" stroke-width="4"/><g class="kn"><line x1="0" y1="-5" x2="0" y2="-16" stroke="${C.ink}" stroke-width="4.5" stroke-linecap="round"/></g></g>
          <circle cx="200" cy="268" r="142" fill="url(#mring)" stroke="${C.ink}" stroke-width="5"/>
          <rect x="333" y="240" width="16" height="56" rx="6" fill="${C.ink}"/>
          <circle cx="200" cy="268" r="119" fill="#FFFFFF" stroke="${C.ink}" stroke-width="4"/>
          <g clip-path="url(#drum)">
            <circle cx="200" cy="268" r="100" fill="#EEE8F6"/>
            <g class="drum">${holes}</g>
            <g class="water"><path class="w2" fill="${C.lav}" fill-opacity=".16"/><path class="w1" fill="${C.lav}" fill-opacity=".26"/></g>
            <g class="spin">
              <g class="sin"><rect x="-19" y="-48" width="38" height="96" rx="4" fill="#fff" stroke="${C.ink}" stroke-width="2.6"/><line x1="-9" y1="-24" x2="9" y2="-24" stroke="${C.lav}" stroke-width="2.4" stroke-linecap="round" opacity=".6"/><line x1="-9" y1="-14" x2="5" y2="-14" stroke="${C.lav}" stroke-width="2.4" stroke-linecap="round" opacity=".6"/></g>
              <g class="c1"><path d="${shirt}" fill="#8466C6" stroke="${C.ink}" stroke-width="1.3" stroke-linejoin="round"/></g>
              <g class="c2"><path d="${shirt}" fill="#9FD08E" stroke="${C.ink}" stroke-width="1.3" stroke-linejoin="round"/></g>
              <g class="c3"><path d="${sock}" fill="#F7AE62" stroke="${C.ink}" stroke-width="1.3" stroke-linejoin="round"/></g>
              ${foam}
            </g>
            <circle cx="200" cy="268" r="100" fill="url(#mglass)"/>
            <path d="M126 222 A 84 84 0 0 1 226 186" stroke="#fff" stroke-width="9" stroke-linecap="round" fill="none" opacity=".8"/>
            <path d="M262 330 A 84 84 0 0 1 240 346" stroke="#fff" stroke-width="6" stroke-linecap="round" fill="none" opacity=".6"/>
          </g>
          <circle cx="200" cy="268" r="100" fill="none" stroke="${C.ink}" stroke-width="4"/>
          <circle class="flash" cx="200" cy="268" r="100" fill="none" stroke-width="10" opacity="0"/>
        </g>
      </svg>`,
      cam,
    )
    const q = (s) => machine.querySelector(s)
    const shake = q('#mshake')
    const leds = [...machine.querySelectorAll('.led')]
    const knob = q('.kn')
    const drum = q('.drum')
    const w1 = q('.w1')
    const w2 = q('.w2')
    const spin = q('.spin')
    const sin = q('.sin')
    const cl = [q('.c1'), q('.c2'), q('.c3')]
    const fms = [...machine.querySelectorAll('.fm')]
    const flash = q('.flash')
    const fly = sheet(cam, 300 * k, 'line')

    // steps panel
    const panelX = V ? 90 * k : W * 0.56
    const title = fit(el(`<div class="abs serif nowrap" style="font-size:${(V ? 74 : 70) * k}px">${words(c.stepsTitle)}</div>`, cam), V ? W * 0.86 : W - panelX - W * 0.05)
    const rows = c.steps.map((txt, i) =>
      el(
        `<div class="abs" style="display:flex;align-items:center;gap:${30 * k}px;width:${(V ? 900 : 720) * k}px">
          <span class="bd" style="flex:none;display:flex;align-items:center;justify-content:center;width:${86 * k}px;height:${86 * k}px;border-radius:50%;font:800 ${40 * k}px Figtree">${i + 1}</span>
          <span style="flex:1;min-width:0">
            <span class="tt" style="display:block;font:700 ${(V ? 46 : 44) * k}px/1.15 Figtree;white-space:nowrap">${txt}</span>
            <span style="display:block;margin-top:${16 * k}px;height:${6 * k}px;border-radius:9px;background:rgba(22,33,74,.08);overflow:hidden"><span class="pb" style="display:block;height:100%;width:100%;transform-origin:0 50%;background:${STEP[i]}"></span></span>
          </span>
        </div>`,
        cam,
      ),
    )
    rows.forEach((r) => fit(r.querySelector('.tt'), ((V ? 900 : 720) - 116) * k))
    S4.layer = L
    const portX = mcx
    const portY = mcy - mh / 2 + 268 * ms
    S4.port = [portX, portY, 100 * ms]

    const rest = [
      { x: 178, y: 312, r: -14, s: 2.5 },
      { x: 230, y: 318, r: 16, s: 2.25 },
      { x: 204, y: 336, r: 34, s: 1.9 },
    ]
    const sinRest = { x: 196, y: 318, r: -76 }
    const fr = rng(11)
    const foamSeed = fms.map(() => ({ a: fr() * Math.PI * 2, r: 30 + fr() * 62, sp: 0.6 + fr() * 1.2, ph: fr() * 6 }))

    scene(11.45, 18.3, L, (t) => {
      if (t > 12.3 && t < 17.5) clipNone(L)
      // dive into the porthole at the end
      const dive = P(t, 17.5, 18.2, E.in3)
      cam.style.transformOrigin = `${portX}px ${portY}px`
      cam.style.transform = `scale(${1 + dive * 1.6 + P(t, 11.5, 18, E.lin) * 0.03})`
      put(halo, mcx, mcy, { s: 1 + Math.sin(t * 1.3) * 0.02 })

      // machine shake while washing
      const wash = P(t, 16.15, 16.6)
      const sx = Math.sin(t * 71) * 1.6 * wash
      const sy = Math.sin(t * 53 + 1) * 0.9 * wash
      shake.setAttribute('transform', `translate(${sx.toFixed(2)} ${sy.toFixed(2)})`)
      put(machine, mcx, mcy + (1 - P(t, 11.6, 12.6, E.out4)) * 60 * k, {})

      const step = t < 14 ? 0 : t < 16 ? 1 : 2
      leds.forEach((n, i) => n.setAttribute('fill', i <= step && t > 12.2 ? STEP[i] : '#3A4673'))
      knob.setAttribute('transform', `rotate(${P(t, 16.0, 16.35, E.outBack) * 120})`)

      // step 1 — the sheet flies in and drops through the glass
      const fp = P(t, 12.15, 12.95, E.io2)
      const showFly = t >= 12.0 && t < 12.95
      fly.n.style.display = showFly ? '' : 'none'
      if (showFly) {
        const fx = mix(portX + 330 * k, portX, E.out2(fp))
        const fy = mix(-fly.h * 0.7, portY + 30 * k, E.in2(fp) * 0.35 + fp * 0.65)
        put(fly.n, fx, fy, { r: mix(38, -70, fp), s: mix(1, (96 * ms) / fly.h, E.in2(fp)) })
      }
      const inP = P(t, 12.95, 13.45, E.outBounce)
      sin.style.display = t >= 12.95 ? '' : 'none'
      const fl = P(t, 12.95, 13.5, E.out3)
      flash.setAttribute('stroke', STEP[step])
      flash.setAttribute('r', 100 - fl * 18)
      flash.setAttribute('opacity', t >= 12.95 ? (1 - fl) * 0.9 : 0)

      // step 2 — laundry drops in on top
      const cp = [P(t, 14.3, 14.85, E.outBounce), P(t, 14.6, 15.15, E.outBounce), P(t, 14.9, 15.4, E.outBounce)]
      // step 3 — water rises, drum turns, the sheet dissolves into foam
      const lvl = P(t, 16.25, 17.1, E.io2)
      const ang = t < 16.3 ? 0 : 0.5 * 260 * (Math.min(t, 17.2) - 16.3) ** 2 / 0.9 + Math.max(0, t - 17.2) * 260
      spin.setAttribute('transform', `rotate(${ang.toFixed(2)} 200 268)`)
      drum.setAttribute('transform', `rotate(${(ang * 0.6).toFixed(2)} 200 268)`)
      const settle = P(t, 16.3, 16.9)
      const sinX = sinRest.x
      const sinY = mix(150, sinRest.y, inP)
      sin.setAttribute('transform', `translate(${sinX} ${sinY}) rotate(${sinRest.r}) scale(${mix(1, 0.6, P(t, 16.4, 17.3))})`)
      sin.style.opacity = 1 - P(t, 16.5, 17.3)
      cl.forEach((n, i) => {
        const r = rest[i]
        const y = mix(140, r.y, cp[i]) + settle * Math.sin(t * 6 + i * 2) * 6
        n.setAttribute('transform', `translate(${r.x} ${y.toFixed(2)}) rotate(${r.r + settle * Math.sin(t * 5 + i) * 18}) scale(${r.s})`)
        n.style.opacity = t > 14.3 + i * 0.3 ? 1 : 0
      })
      fms.forEach((n, i) => {
        const f = foamSeed[i]
        const vis = P(t, 16.55 + i * 0.03, 16.9 + i * 0.03)
        n.setAttribute('cx', 200 + Math.cos(f.a + t * f.sp) * f.r)
        n.setAttribute('cy', 268 + Math.sin(f.a + t * f.sp) * f.r)
        n.style.opacity = vis
      })
      const wy = mix(380, 286, lvl)
      const wave = (y, amp, ph) => {
        let d = `M 80 ${y}`
        for (let x = 80; x <= 320; x += 8) d += ` L ${x} ${(y + Math.sin(x / 18 + ph) * amp).toFixed(2)}`
        return d + ' L 320 380 L 80 380 Z'
      }
      w1.setAttribute('d', wave(wy, 5, t * 7))
      w2.setAttribute('d', wave(wy - 8, 6, -t * 5 + 2))

      // steps panel
      if (V) {
        put(title, W / 2, H * 0.6, {})
        rows.forEach((r, i) => put(r, panelX, H * (0.69 + i * 0.085), { ax: 0, a: P(t, 12.2 + i * 0.1, 12.7 + i * 0.1), pre: `translateX(${(1 - P(t, 12.2 + i * 0.1, 12.9 + i * 0.1, E.out4)) * 80 * k}px)` }))
      } else {
        put(title, panelX, H * 0.23, { ax: 0 })
        rows.forEach((r, i) => put(r, panelX, H * (0.41 + i * 0.165), { ax: 0, a: P(t, 12.2 + i * 0.1, 12.7 + i * 0.1), pre: `translateX(${(1 - P(t, 12.2 + i * 0.1, 12.9 + i * 0.1, E.out4)) * 80 * k}px)` }))
      }
      rise(title, t, 12.05, { dur: 0.7, stagger: 0.06 })
      rows.forEach((r, i) => {
        const on = t >= 12 + i * 2
        const act = on && t < 14 + i * 2
        const bd = r.querySelector('.bd')
        const pulse = act ? P(t, 12 + i * 2, 12.35 + i * 2, E.outBack) : 1
        bd.style.background = on ? STEP[i] : STEP_SOFT[i]
        bd.style.color = on ? '#fff' : STEP[i]
        bd.style.transform = `scale(${act ? mix(0.8, 1, pulse) : 1})`
        r.querySelector('.tt').style.color = on ? C.ink : C.inkMute
        r.querySelector('.tt').style.opacity = on ? 1 : 0.55
        r.querySelector('.pb').style.transform = `scaleX(${clamp((t - (12 + i * 2)) / 1.9)})`
      })
    })
  }

  // ═════════════════════════════════════════════════════════════════════
  // 5 · Highlights and numbers (18–22)
  // ═════════════════════════════════════════════════════════════════════
  const S5 = {}
  {
    const [L, cam] = layer(C.paper)
    const g1 = glow(cam, '#E2EEFA', 1100, 0.9)
    const g2 = glow(cam, '#FCEEDC', 1000, 0.9)
    const FEAT = [
      { icon: 'Leaf', main: '#2E7A47', soft: '#E3F1E6' },
      { icon: 'Droplets', main: '#3C7FC2', soft: '#E2EEFA' },
      { icon: 'Shirt', main: '#6E4FA8', soft: '#EEE8F6' },
      { icon: 'Recycle', main: '#D9701A', soft: '#FCEEDC' },
    ]
    const cw = (V ? 440 : 392) * k
    const ch = (V ? 330 : 316) * k
    const eyebrow = el(`<div class="abs nowrap" style="font:700 ${(V ? 28 : 24) * k}px Figtree;letter-spacing:.22em;text-transform:uppercase;color:${C.leaf}">${c.featuresTitle}</div>`, cam)
    const cards = c.features.map((txt, i) =>
      el(
        `<div class="abs" style="width:${cw}px;height:${ch}px;border-radius:${36 * k}px;background:#fff;border:1px solid ${C.line};box-shadow:0 ${24 * k}px ${50 * k}px -${24 * k}px rgba(22,33,74,.18);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:${24 * k}px;padding:0 ${26 * k}px;text-align:center">
          <span class="ic" style="display:flex;align-items:center;justify-content:center;width:${118 * k}px;height:${118 * k}px;border-radius:50%;background:${FEAT[i].soft}">${svgIcon(FEAT[i].icon, FEAT[i].main, 56 * k, 1.8)}</span>
          <span style="font:700 ${(V ? 38 : 33) * k}px/1.2 Figtree">${txt}</span>
        </div>`,
        cam,
      ),
    )
    const statCols = [C.lav, C.bah, C.nar]
    const stats = el(
      `<div class="abs" style="display:flex;align-items:flex-start;gap:${(V ? 34 : 64) * k}px;white-space:nowrap">
        ${c.stats
          .map(
            ([n, lbl], i) => `${i === 1 ? `<span class="serif" style="font-size:${(V ? 110 : 130) * k}px;color:${C.inkMute};line-height:1.2">=</span>` : ''}${i === 2 ? `<span style="align-self:stretch;width:${2 * k}px;background:${C.line};margin:0 ${(V ? 0 : 6) * k}px"></span>` : ''}
          <span style="display:flex;flex-direction:column;align-items:center">
            <span class="serif num" data-n="${parseInt(n, 10)}" data-suffix="${n.replace(/^\d+/, '')}" style="font-size:${(V ? 130 : 150) * k}px;font-weight:600;color:${statCols[i]};line-height:1.2;font-variant-numeric:tabular-nums">${n}</span>
            <span style="font:600 ${(V ? 32 : 32) * k}px Figtree;color:${C.inkSoft};margin-top:${4 * k}px">${lbl}</span>
          </span>`,
          )
          .join('')}
      </div>`,
      cam,
    )
    const nums = [...stats.querySelectorAll('.num')]
    const note = el(`<div class="abs nowrap" style="font:500 ${(V ? 34 : 30) * k}px Figtree;color:${C.inkSoft}">${c.statsNote}</div>`, cam)
    S5.layer = L
    const icons = cards.map((n) => n.querySelector('.ic svg'))

    scene(17.45, 22.3, L, (t) => {
      const [px0, py0] = S4.port
      const ip = P(t, 17.55, 18.2, E.io3)
      if (ip < 1) clipCircle(L, px0, py0, ip * FAR)
      else if (t < 21.4) clipNone(L)
      put(cam, W / 2, H / 2, { s: 1.08 - P(t, 17.6, 19, E.out3) * 0.08 })
      put(g1, W * 0.15, H * 0.2, { s: 1 + Math.sin(t) * 0.05 })
      put(g2, W * 0.88, H * 0.85, { s: 1 + Math.cos(t) * 0.05 })
      put(eyebrow, W / 2, V ? H * 0.12 : H * 0.12, { a: P(t, 18.0, 18.4), pre: `translateY(${(1 - P(t, 18, 18.5)) * 16 * k}px)` })
      cards.forEach((n, i) => {
        const t0 = 18.15 + i * 0.25
        const p = P(t, t0, t0 + 0.55, E.outBack)
        const x = V ? W / 2 + (i % 2 ? 1 : -1) * (cw / 2 + 14 * k) : W / 2 + (i - 1.5) * (cw + 30 * k)
        const y = V ? H * 0.26 + Math.floor(i / 2) * (ch + 28 * k) : H * 0.37
        put(n, x, y + (1 - p) * 60 * k, { s: mix(0.7, 1, p), a: P(t, t0, t0 + 0.2) })
        // a small motion of its own, like on the site
        const life = Math.max(0, t - t0 - 0.4)
        const ic = icons[i]
        ic.style.transformOrigin = '50% 50%'
        if (i === 0) ic.style.transform = `rotate(${Math.sin(life * 3) * 10}deg)`
        if (i === 1) ic.style.transform = `translateY(${Math.abs(Math.sin(life * 3.4)) * -6 * k}px)`
        if (i === 2) ic.style.transform = `rotate(${Math.sin(life * 5) * 7 * Math.exp(-life * 0.5)}deg)`
        if (i === 3) ic.style.transform = `rotate(${life * 70}deg)`
      })
      const sp = P(t, 19.45, 19.95, E.out4)
      put(stats, W / 2, (V ? H * 0.7 : H * 0.73) + (1 - sp) * 50 * k, { a: sp })
      const cp = P(t, 19.6, 20.6, E.out3)
      nums.forEach((n) => {
        const v = Math.round(+n.dataset.n * cp)
        n.textContent = `${v}${n.dataset.suffix}`
      })
      put(note, W / 2, V ? H * 0.83 : H * 0.91, { a: P(t, 20.4, 20.9), pre: `translateY(${(1 - P(t, 20.4, 21)) * 14 * k}px)` })
    })
  }

  // ═════════════════════════════════════════════════════════════════════
  // 6 · Three scents (22–28)
  // ═════════════════════════════════════════════════════════════════════
  const S6 = {}
  {
    const [L, cam] = layer(C.paper)
    const SPOTS = V
      ? [[0.12, 0.08, 150, -20, 0.5, 2], [0.88, 0.1, 210, 18, 1.1, 0], [0.92, 0.42, 160, -10, 0.8, 5], [0.08, 0.5, 190, 24, 1.2, 4], [0.86, 0.9, 260, -14, 1.4, 7], [0.14, 0.92, 170, 12, 0.9, 0], [0.5, 0.97, 120, 30, 0.7, 3]]
      : [[0.46, 0.12, 150, -20, 0.6, 3], [0.95, 0.14, 210, 18, 1.2, 0], [0.9, 0.84, 260, -12, 1.4, 7], [0.42, 0.9, 150, 26, 0.8, 0], [0.04, 0.88, 200, -28, 1, 5], [0.98, 0.52, 140, 38, 0.9, 0], [0.62, 0.06, 110, -6, 0.7, 2], [0.06, 0.12, 120, 10, 0.6, 4]]
    const panels = SCENTS.map((s, i) => {
      const p = el(`<div class="layer" style="background:linear-gradient(125deg, ${s.bg[0]} 0%, ${s.bg[1]} 100%)"></div>`, cam)
      const halo = el(`<div class="glow" style="width:${(V ? 1300 : 1100) * k}px;height:${(V ? 1300 : 1100) * k}px;background:radial-gradient(circle, rgba(255,255,255,.85) 0%, rgba(255,255,255,0) 64%)"></div>`, p)
      const ems = SPOTS.map(([x, y, size, r, d, b]) => ({ n: el(`<div class="abs" style="width:${size * k}px;height:${size * k}px;filter:${b ? `blur(${b * k}px)` : 'none'}">${brandSvg(`emblem_${s.slug}`, 'width:100%;height:100%')}</div>`, p), x, y, r, d }))
      const bw = (V ? 900 : 780) * k
      const shadow = el(`<div class="abs" style="width:${bw * 0.8}px;height:${bw * 0.09}px;border-radius:50%;background:radial-gradient(ellipse, rgba(22,33,74,.28) 0%, rgba(22,33,74,0) 70%)"></div>`, p)
      const box = el(`<div class="abs pack" style="width:${bw}px">${brandSvg(`angle_${s.slug}`, 'width:100%;height:auto;filter:drop-shadow(0 30px 40px rgba(22,33,74,.18))')}</div>`, p)
      const [name, noteTxt] = c.scents[i]
      const count = el(`<div class="abs nowrap" style="font:700 ${(V ? 28 : 24) * k}px Figtree;letter-spacing:.22em;text-transform:uppercase;color:${s.main}">${c.scentsTitle} · 0${i + 1}/03</div>`, p)
      const title = fit(el(`<div class="abs serif nowrap" style="font-size:${(V ? 180 : 190) * k}px;color:${s.deep}">${words(name)}</div>`, p), V ? W * 0.86 : W * 0.42)
      const note = fit(el(`<div class="abs nowrap" style="font:500 ${(V ? 44 : 42) * k}px Figtree;color:${C.inkSoft}">${noteTxt}</div>`, p), V ? W * 0.86 : W * 0.42)
      const dots = el(`<div class="abs" style="display:flex;gap:${14 * k}px">${SCENTS.map((d, j) => `<span style="width:${(j === i ? 46 : 14) * k}px;height:${14 * k}px;border-radius:9px;background:${j === i ? s.main : 'rgba(22,33,74,.18)'}"></span>`).join('')}</div>`, p)
      return { p, halo, ems, shadow, box, count, title, note, dots, bw }
    })
    S6.layer = L
    const starts = [22, 24, 26]

    scene(21.45, 28.3, L, (t) => {
      if (t > 22.3 && t < 27.5) clipNone(L)
      panels.forEach((pn, i) => {
        const s0 = starts[i]
        const inP = i === 0 ? 1 : P(t, s0 - 0.4, s0 + 0.25, E.io4)
        const outP = i === 2 ? 0 : P(t, s0 + 1.6, s0 + 2.25, E.io4)
        const vis = t >= s0 - 0.45 && t < s0 + 2.3
        pn.p.style.display = vis ? '' : 'none'
        if (!vis) return
        pn.p.style.zIndex = i
        put(pn.p, (1 - inP) * W - outP * W * 0.35, 0, { ax: 0, ay: 0 })
        pn.p.style.boxShadow = inP < 1 ? `-${40 * k}px 0 ${80 * k}px rgba(22,33,74,.25)` : 'none'
        const lt = t - s0
        const bx = V ? W / 2 : W * 0.68
        const by = V ? H * 0.64 : H * 0.53
        put(pn.halo, bx, by, { s: 1 + Math.sin(t * 0.9) * 0.03 })
        pn.ems.forEach((e, j) => {
          const drift = (lt + 1) * 26 * e.d * k
          put(e.n, e.x * W + (1 - inP) * 260 * e.d * k, e.y * H - drift + Math.sin(t * 1.3 + j) * 8 * k, { r: e.r + lt * 8 * (j % 2 ? 1 : -1) })
        })
        const bob = Math.sin(t * 1.6 + i) * 10 * k
        const boxIn = i === 0 ? P(t, 21.9, 22.7, E.out4) : P(t, s0 - 0.3, s0 + 0.5, E.out4)
        put(pn.box, bx + (1 - boxIn) * 360 * k, by + bob, { r: (1 - boxIn) * 10 + Math.sin(t * 1.2 + i) * 1.2, s: mix(0.9, 1, boxIn) })
        put(pn.shadow, bx + (1 - boxIn) * 360 * k, by + pn.bw * 0.43, { s: 1 - bob / (200 * k), a: boxIn })
        const tx = V ? W / 2 : W * 0.075
        const opt = V ? {} : { ax: 0 }
        put(pn.count, tx, V ? H * 0.12 : H * 0.3, { ...opt, a: P(t, s0 - 0.05, s0 + 0.3) })
        put(pn.title, tx, V ? H * 0.205 : H * 0.44, opt)
        rise(pn.title, t, s0 - 0.08, { dur: 0.75, stagger: 0.1 })
        put(pn.note, tx, V ? H * 0.302 : H * 0.6, { ...opt, a: P(t, s0 + 0.15, s0 + 0.55), pre: `translateY(${(1 - P(t, s0 + 0.15, s0 + 0.6)) * 18 * k}px)` })
        put(pn.dots, tx, V ? H * 0.352 : H * 0.7, { ...opt, a: P(t, s0 + 0.25, s0 + 0.6) })
      })
    })
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
      if (ip < 1) clipCircle(L, V ? W / 2 : W * 0.68, H * 0.53, ip * FAR * 0.75)
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

  // ── wipes that span two scenes ────────────────────────────────────────
  function transitions(t) {
    wipe(t, 11.45, 12.25, 1, [S4.layer], [S3.layer])
    if (t >= 21.35) wipe(t, 21.4, 22.2, -1, [S6.layer], [S5.layer])
  }

  window.DUR = DUR
  window.seek = (t) => {
    for (const s of scenes) {
      const on = t >= s.a && t < s.b
      s.node.style.display = on ? '' : 'none'
      if (on) s.update(t)
    }
    transitions(t)
    const f = Math.floor(t * 30)
    const gr = rng(f + 1)
    grain.style.transform = `translate(${Math.floor(gr() * 64)}px,${Math.floor(gr() * 64)}px)`
  }
  // Z order: later scenes above earlier ones, the falling sheet above all.
  scenes.forEach((s, i) => {
    if (!s.node.style.zIndex) s.node.style.zIndex = i + 1
  })
  S3.sheetLayer.style.zIndex = 40

  window.ready = (async () => {
    await document.fonts.load(`500 100px Fraunces`, 'ığşçöüİĞŞÇÖÜ')
    await document.fonts.load(`800 100px Figtree`, 'ığşçöüİĞŞÇÖÜ')
    await document.fonts.load(`600 100px Figtree`, 'ığşçöüİĞŞÇÖÜ')
    await document.fonts.ready
    for (const [n, max] of fits) {
      const w = n.scrollWidth
      if (w > max) n.style.fontSize = `${(parseFloat(getComputedStyle(n).fontSize) * max) / w}px`
    }
    window.seek(0)
    return true
  })()
})()
