/*
 * Renders film.html to video with headless Chromium + ffmpeg.
 *
 *   node render.js --lang tr --w 1920 --h 1080 --out out/velmo-tr-16x9.mp4
 *   node render.js --lang tr --snap 1.5,9,13.2 --outdir out/snaps    (stills)
 *
 * Options: --fps 30, --sub 4 (sub-frames blended per frame = motion blur),
 * --shutter 0.5 (fraction of a frame the blur spans), --workers 4,
 * --from/--to (seconds), --chrome <path>, --audio <wav> (muxed in).
 */
const http = require('http')
const fs = require('fs')
const path = require('path')
const { spawn } = require('child_process')
const { once } = require('events')
let chromium
try {
  chromium = require('playwright-core').chromium
} catch {
  chromium = require(process.env.PLAYWRIGHT_CORE || 'playwright-core').chromium
}

const args = Object.fromEntries(
  process.argv.slice(2).reduce((acc, a, i, all) => (a.startsWith('--') ? [...acc, [a.slice(2), all[i + 1] && !all[i + 1].startsWith('--') ? all[i + 1] : true]] : acc), []),
)
const lang = args.lang || 'tr'
const W = +(args.w || 1920)
const H = +(args.h || 1080)
const fps = +(args.fps || 30)
const sub = +(args.sub || 4)
const shutter = +(args.shutter || 0.5)
const workers = +(args.workers || 4)
const FORMAT = args.format || 'jpeg'
const chrome = args.chrome || process.env.CHROME_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome'

const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.woff2': 'font/woff2', '.json': 'application/json' }
function serve() {
  const root = __dirname
  const server = http.createServer((req, res) => {
    const file = path.join(root, decodeURIComponent(new URL(req.url, 'http://x').pathname))
    if (!file.startsWith(root) || !fs.existsSync(file)) return res.writeHead(404).end()
    res.writeHead(200, { 'content-type': MIME[path.extname(file)] || 'application/octet-stream' })
    fs.createReadStream(file).pipe(res)
  })
  return new Promise((r) => server.listen(0, '127.0.0.1', () => r(server)))
}

async function openPage(browser, port) {
  const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 })
  page.on('pageerror', (e) => console.error('page error:', e.message))
  await page.goto(`http://127.0.0.1:${port}/film.html?lang=${lang}&w=${W}&h=${H}`)
  await page.evaluate(() => window.ready)
  const cdp = await page.context().newCDPSession(page)
  return { page, cdp }
}

async function shoot({ page, cdp }, t, format = FORMAT) {
  await page.evaluate((t) => window.seek(t), t)
  const { data } = await cdp.send('Page.captureScreenshot', { format, ...(format === 'jpeg' ? { quality: 95 } : {}), optimizeForSpeed: true, captureBeyondViewport: false })
  return Buffer.from(data, 'base64')
}

;(async () => {
  const server = await serve()
  const port = server.address().port
  const browser = await chromium.launch({ executablePath: chrome, args: ['--font-render-hinting=none', '--disable-lcd-text', '--force-color-profile=srgb'] })

  if (args.snap) {
    const outdir = args.outdir || 'out/snaps'
    fs.mkdirSync(outdir, { recursive: true })
    const p = await openPage(browser, port)
    for (const s of String(args.snap).split(',')) {
      const buf = await shoot(p, +s)
      const f = path.join(outdir, `${lang}-${W}x${H}-${(+s).toFixed(2)}.png`)
      fs.writeFileSync(f, buf)
      console.log(f)
    }
    await browser.close()
    server.close()
    return
  }

  const from = +(args.from || 0)
  const dur = await (async () => {
    const p = await openPage(browser, port)
    const d = await p.page.evaluate(() => window.DUR)
    await p.page.close()
    return d
  })()
  const to = +(args.to || dur)
  const frames = Math.round((to - from) * fps)
  const total = frames * sub
  const out = args.out || `out/velmo-${lang}-${W}x${H}.mp4`
  fs.mkdirSync(path.dirname(out), { recursive: true })

  const vf = [
    sub > 1 ? `tmix=frames=${sub}` : null,
    sub > 1 ? `select='eq(mod(n\\,${sub})\\,${sub - 1})'` : null,
    `setpts=N/${fps}/TB`,
    'format=yuv420p',
  ].filter(Boolean).join(',')
  const ffArgs = ['-y', '-hide_banner', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(fps * sub), '-i', '-']
  if (args.audio) ffArgs.push('-i', args.audio)
  ffArgs.push('-vf', vf, '-r', String(fps), '-c:v', 'libx264', '-preset', args.preset || 'slow', '-crf', String(args.crf || 14), '-profile:v', 'high', '-pix_fmt', 'yuv420p', '-colorspace', 'bt709', '-color_primaries', 'bt709', '-color_trc', 'bt709', '-movflags', '+faststart')
  if (args.audio) ffArgs.push('-c:a', 'aac', '-b:a', '256k', '-shortest')
  ffArgs.push(out)
  const ff = spawn('ffmpeg', ffArgs, { stdio: ['pipe', 'inherit', 'inherit'] })

  const pages = await Promise.all(Array.from({ length: workers }, () => openPage(browser, port)))
  const chains = pages.map(() => Promise.resolve())
  const pending = new Map()
  const timeOf = (i) => {
    const f = Math.floor(i / sub)
    const j = i % sub
    const off = sub > 1 ? shutter * ((j + 0.5) / sub - 0.5) : 0
    return Math.max(0, from + (f + off) / fps)
  }
  const schedule = (i) => {
    const w = i % workers
    const p = chains[w].then(() => shoot(pages[w], timeOf(i)))
    chains[w] = p.catch(() => {})
    return p
  }
  const started = Date.now()
  let next = 0
  for (let i = 0; i < total; i++) {
    while (next < total && next < i + workers * 3) pending.set(next, schedule(next++))
    const buf = await pending.get(i)
    pending.delete(i)
    if (!ff.stdin.write(buf)) await once(ff.stdin, 'drain')
    if (i % (fps * sub) === 0) process.stdout.write(`\r${lang} ${W}x${H}  ${(i / (fps * sub)).toFixed(0)}s / ${(to - from).toFixed(0)}s  ${((Date.now() - started) / 1000).toFixed(0)}s elapsed`)
  }
  ff.stdin.end()
  await once(ff, 'close')
  console.log(`\n${out}  (${((Date.now() - started) / 1000).toFixed(0)}s)`)
  await browser.close()
  server.close()
})()
