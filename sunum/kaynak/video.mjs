// Renders the animated MP4 version of the deck: every slide is played frame by frame
// (CSS animations paused and stepped to exact times, so no dropped frames), encoded as a clip,
// then all clips are joined with soft cross-fades.
// Usage: node video.mjs [--out ../Neden-Socialp-Media.mp4] [--only 5]
import { readFileSync, writeFileSync, mkdirSync, rmSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createRequire } from 'node:module'
import { spawn } from 'node:child_process'

const require = createRequire(import.meta.url)
const { chromium } = require('playwright')

const here = dirname(fileURLToPath(import.meta.url))
const args = process.argv.slice(2)
const opt = (k, d) => (args.includes(k) ? args[args.indexOf(k) + 1] : d)
const out = resolve(opt('--out', resolve(here, '../Neden-Socialp-Media.mp4')))
const tmp = resolve(opt('--tmp', resolve(here, '.video-tmp')))
const only = opt('--only', null)

const FPS = 30
const XFADE = 0.7 // seconds of cross-fade between slides
// Slides after the first hold their entrance animations until the cross-fade is almost over, so only
// backgrounds and the fixed frame (logo, labels) blend — two slides' headlines never overlap.
const LEAD = 0.6
// Seconds each slide stays on screen (includes LEAD and its entrance animation).
const DUR = [6, 7, 8, 7, 8, 8, 7, 7, 7.5, 7.5, 8, 8.5]

const src = readFileSync(resolve(here, 'deck.src.html'), 'utf8')
const defs = readFileSync(resolve(here, 'logo_defs.svg'), 'utf8')
const built = resolve(here, 'deck.html')
writeFileSync(built, src.replace('{{LOGO_DEFS}}', defs))

function run(cmd, argv, stdin = 'ignore') {
  const p = spawn(cmd, argv, { stdio: [stdin, 'inherit', 'inherit'] })
  const done = new Promise((res, rej) => p.on('close', c => (c === 0 ? res() : rej(new Error(`${cmd} exited ${c}`)))))
  return { p, done }
}

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } })
await page.goto('file://' + built, { waitUntil: 'load' })
await page.evaluate(() => { document.body.classList.add('anim'); return document.fonts.ready })

const n = await page.locator('section.slide').count()
if (n !== DUR.length) throw new Error(`DUR has ${DUR.length} entries but the deck has ${n} slides`)
mkdirSync(tmp, { recursive: true })

const clips = []
for (let i = 0; i < n; i++) {
  if (only && Number(only) !== i + 1) continue
  await page.evaluate(async i => {
    const slides = document.querySelectorAll('section.slide')
    slides.forEach((s, k) => s.classList.toggle('on', k === i))
    await Promise.all([...slides[i].querySelectorAll('img')].map(im => im.decode().catch(() => {})))
    await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)))
    window.__anims = document.getAnimations()
    window.__anims.forEach(a => a.pause())
  }, i)

  const clip = resolve(tmp, `clip-${String(i + 1).padStart(2, '0')}.mp4`)
  const ff = run('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'mjpeg', '-i', '-',
    '-c:v', 'libx264', '-preset', 'medium', '-crf', '12', '-pix_fmt', 'yuv420p', clip], 'pipe')
  const frames = Math.round(DUR[i] * FPS)
  for (let f = 0; f < frames; f++) {
    const t = (f * 1000) / FPS - (i === 0 ? 0 : LEAD * 1000)
    await page.evaluate(t => { window.__anims.forEach(a => { a.currentTime = t }); window.__count(t) }, t)
    const buf = await page.screenshot({ type: 'jpeg', quality: 95 })
    if (!ff.p.stdin.write(buf)) await new Promise(r => ff.p.stdin.once('drain', r))
  }
  ff.p.stdin.end()
  await ff.done
  clips.push(clip)
  console.log(`slayt ${i + 1}/${n}: ${frames} kare`)
}
await browser.close()

if (only) {
  console.log('Önizleme klibi:', clips[0])
} else {
  let graph = ''
  let prev = '[0:v]'
  let offset = 0
  for (let k = 1; k < clips.length; k++) {
    offset += DUR[k - 1] - XFADE
    const label = k === clips.length - 1 ? '[v]' : `[x${k}]`
    graph += `${prev}[${k}:v]xfade=transition=fade:duration=${XFADE}:offset=${offset.toFixed(3)}${label};`
    prev = label
  }
  const final = run('ffmpeg', ['-y', '-loglevel', 'error', ...clips.flatMap(c => ['-i', c]),
    '-filter_complex', graph.replace(/;$/, ''), '-map', '[v]',
    '-c:v', 'libx264', '-preset', 'slow', '-crf', '19', '-profile:v', 'high', '-level', '4.1', '-pix_fmt', 'yuv420p',
    '-r', String(FPS), '-movflags', '+faststart', '-tag:v', 'avc1', '-metadata', 'title=Neden Socialp Media?', out])
  await final.done
  rmSync(tmp, { recursive: true, force: true })
  console.log('Video:', out)
}
