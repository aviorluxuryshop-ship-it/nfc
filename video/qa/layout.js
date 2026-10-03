/*
 * Layout QA for a film.html composition: at the settled moments it lists
 * (window.QA_MOMENTS), every visible text block must sit inside the title-safe
 * area and must not collide with another text block or a product shot (.pack).
 *
 *   node qa/layout.js [--sizes 1920x1080,1080x1920] [--langs tr,en]
 *
 * Glyph boxes come from the text nodes' line boxes, which run a little taller
 * than the ink: a hit between a heavy logo and the line under it can be a
 * false positive. Confirm those in the frame itself.
 */
const http = require('http')
const fs = require('fs')
const path = require('path')
const { chromium } = require(process.env.PLAYWRIGHT_CORE || 'playwright-core')

const arg = (k, d) => {
  const i = process.argv.indexOf(`--${k}`)
  return i > -1 ? process.argv[i + 1] : d
}
const root = path.join(__dirname, '..')
const sizes = arg('sizes', '1920x1080,1080x1920').split(',').map((s) => s.split('x').map(Number))
const langs = arg('langs', 'tr,en').split(',')
const chrome = arg('chrome', process.env.CHROME_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome')
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.woff2': 'font/woff2' }

const server = http.createServer((req, res) => {
  const f = path.join(root, decodeURIComponent(new URL(req.url, 'http://x').pathname))
  if (!f.startsWith(root) || !fs.existsSync(f)) return res.writeHead(404).end()
  res.writeHead(200, { 'content-type': MIME[path.extname(f)] || 'application/octet-stream' })
  fs.createReadStream(f).pipe(res)
})

;(async () => {
  await new Promise((r) => server.listen(0, '127.0.0.1', r))
  const port = server.address().port
  const browser = await chromium.launch({ executablePath: chrome })
  let problems = 0
  for (const lang of langs) {
    for (const [w, h] of sizes) {
      const page = await browser.newPage({ viewport: { width: w, height: h } })
      await page.goto(`http://127.0.0.1:${port}/film.html?lang=${lang}&w=${w}&h=${h}`)
      await page.evaluate(() => window.ready)
      const moments = await page.evaluate(() => window.QA_MOMENTS || [window.DUR - 1])
      for (const t of moments) {
        const found = await page.evaluate(({ t, w, h }) => {
          window.seek(t)
          const visible = (n) => {
            for (let e = n; e && e.id !== 'stage'; e = e.parentElement) {
              const cs = getComputedStyle(e)
              if (cs.display === 'none' || +cs.opacity < 0.05) return false
            }
            return true
          }
          const blocks = [...document.querySelectorAll('#stage .abs')].filter((n) => n instanceof HTMLElement && visible(n) && !n.querySelector('.abs'))
          const m = Math.round(Math.min(w, h) * 0.035)
          const textBox = (n) => {
            const walker = document.createTreeWalker(n, NodeFilter.SHOW_TEXT)
            let box = null
            for (let tn; (tn = walker.nextNode()); ) {
              if (!tn.textContent.trim()) continue
              const r = document.createRange()
              r.selectNodeContents(tn)
              for (const q of r.getClientRects()) {
                if (q.width < 1) continue
                box = box ? { l: Math.min(box.l, q.left), t: Math.min(box.t, q.top), r: Math.max(box.r, q.right), b: Math.max(box.b, q.bottom) } : { l: q.left, t: q.top, r: q.right, b: q.bottom }
              }
            }
            return box
          }
          const texts = blocks.filter((n) => !n.classList.contains('pack')).map((n) => ({ box: textBox(n), txt: n.innerText.replace(/\s+/g, ' ').slice(0, 40) })).filter((x) => x.box)
          const packs = blocks.filter((n) => n.classList.contains('pack')).map((n) => {
            const r = n.getBoundingClientRect()
            return { r, box: { l: r.left + r.width * 0.1, t: r.top + r.height * 0.14, r: r.right - r.width * 0.1, b: r.bottom - r.height * 0.14 }, txt: '[box]' }
          })
          const out = []
          for (const { box, txt } of texts) if (box.l < m || box.t < m || box.r > w - m || box.b > h - m) out.push(`OUT  "${txt}"`)
          for (const { r } of packs) if (r.left < -2 || r.right > w + 2) out.push(`EDGE [box] ${r.left | 0} → ${r.right | 0}`)
          const all = [...texts, ...packs]
          for (let i = 0; i < all.length; i++)
            for (let j = i + 1; j < all.length; j++) {
              if (all[i].txt === '[box]' && all[j].txt === '[box]') continue
              const a = all[i].box, c = all[j].box
              if (Math.min(a.r, c.r) - Math.max(a.l, c.l) > 2 && Math.min(a.b, c.b) - Math.max(a.t, c.t) > 2) out.push(`HIT  "${all[i].txt}" × "${all[j].txt}"`)
            }
          return out
        }, { t, w, h })
        for (const f of found) {
          problems++
          console.log(`${lang} ${w}x${h} t=${t}: ${f}`)
        }
      }
      await page.close()
    }
  }
  console.log(problems ? `${problems} finding(s) — check each in a still` : 'layout OK')
  await browser.close()
  server.close()
})()
