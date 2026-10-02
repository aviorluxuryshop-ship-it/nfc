// Builds the deck HTML (inlines the logo symbol), screenshots each slide and exports a 16:9 PDF,
// then runs pdf-son-islem.py (bookmarks, document info, language) on it.
// Usage: node render.mjs [--pdf out.pdf] [--shots dir]
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createRequire } from 'node:module'
import { spawnSync } from 'node:child_process'

const require = createRequire(import.meta.url)
const { chromium } = require('playwright')

const here = dirname(fileURLToPath(import.meta.url))
const args = process.argv.slice(2)
const opt = (k, d) => (args.includes(k) ? args[args.indexOf(k) + 1] : d)
const pdfOut = resolve(opt('--pdf', resolve(here, '../Neden-Socialp-Media.pdf')))
const shots = opt('--shots', null)

const src = readFileSync(resolve(here, 'deck.src.html'), 'utf8')
const defs = readFileSync(resolve(here, 'logo_defs.svg'), 'utf8')
const built = resolve(here, 'deck.html')
writeFileSync(built, src.replace('{{LOGO_DEFS}}', defs))

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } })
await page.goto('file://' + built, { waitUntil: 'load' })
await page.evaluate(() => document.fonts.ready)
await page.waitForTimeout(500)

if (shots) {
  mkdirSync(shots, { recursive: true })
  const n = await page.locator('section.slide').count()
  for (let i = 0; i < n; i++) {
    await page.locator('section.slide').nth(i).screenshot({ path: `${shots}/slide-${String(i + 1).padStart(2, '0')}.png` })
  }
}

await page.pdf({ path: pdfOut, width: '1920px', height: '1080px', printBackground: true, preferCSSPageSize: true, tagged: true })
await browser.close()

const post = spawnSync('python3', [resolve(here, 'pdf-son-islem.py'), pdfOut], { stdio: 'inherit' })
if (post.status !== 0) console.warn('Uyarı: pdf-son-islem.py çalışmadı (pikepdf kurulu mu?). PDF yer imleri olmadan üretildi.')
console.log('PDF:', pdfOut)
