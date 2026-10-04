#!/usr/bin/env node
/*
 * Frame-accurate renderer for the brand film.
 *
 *   node scripts/render.js --format h --out build/video-h.mp4
 *   node scripts/render.js --format v --out build/video-v.mp4
 *   node scripts/render.js --stills 4.5,12,30 --out build/stills
 *
 * Each output frame is the average of N sub-frames sampled across a 180°
 * shutter (real motion blur, like a film camera). Work is split across
 * parallel headless-Chromium workers; each pipes PNGs straight into ffmpeg.
 */
const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const { chromium } = require('playwright');

const args = Object.fromEntries(
  process.argv.slice(2).reduce((acc, a, i, arr) => {
    if (a.startsWith('--')) acc.push([a.slice(2), arr[i + 1] && !arr[i + 1].startsWith('--') ? arr[i + 1] : true]);
    return acc;
  }, [])
);
const FORMAT = args.format === 'v' ? 'v' : 'h';
const W = FORMAT === 'v' ? 1080 : 1920;
const H = FORMAT === 'v' ? 1920 : 1080;
const FPS = Number(args.fps || 30);
const SUB = Number(args.sub || 4); // motion-blur samples per frame
const SHUTTER = Number(args.shutter || 0.5); // 180°
const WORKERS = Number(args.workers || 3);
const ROOT = path.resolve(__dirname, '..', 'src');
const OUT = path.resolve(args.out || `build/video-${FORMAT}.mp4`);

// Extra browser flags (e.g. trusting a corporate proxy CA) can be passed via env.
const EXTRA = (process.env.CHROMIUM_ARGS || '').split(' ').filter(Boolean);

const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg', '.woff2': 'font/woff2', '.mp4': 'video/mp4' };
function serve() {
  return new Promise((resolve) => {
    const srv = http.createServer((req, res) => {
      const p = path.join(ROOT, decodeURIComponent(req.url.split('?')[0]));
      if (!p.startsWith(ROOT) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) { res.writeHead(404); return res.end(); }
      res.writeHead(200, { 'Content-Type': MIME[path.extname(p)] || 'application/octet-stream', 'Cache-Control': 'max-age=3600' });
      fs.createReadStream(p).pipe(res);
    });
    srv.listen(0, '127.0.0.1', () => resolve(srv));
  });
}

async function openPage(browser, port) {
  const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
  page.on('console', (m) => { if (m.type() === 'error') console.error('[page]', m.text()); });
  page.on('pageerror', (e) => console.error('[pageerror]', e.message));
  await page.goto(`http://127.0.0.1:${port}/index.html?render=1&format=${FORMAT}`);
  await page.waitForFunction(() => window.__ready === true, null, { timeout: 120000 });
  const cdp = await page.context().newCDPSession(page);
  return { page, cdp };
}

async function grab(p, t) {
  await p.page.evaluate((tt) => window.seek(tt), t);
  const { data } = await p.cdp.send('Page.captureScreenshot', { format: 'png', optimizeForSpeed: true, captureBeyondViewport: false });
  return Buffer.from(data, 'base64');
}

async function stills(browser, port) {
  fs.mkdirSync(OUT, { recursive: true });
  const p = await openPage(browser, port);
  for (const t of String(args.stills).split(',').map(Number)) {
    const buf = await grab(p, t);
    const f = path.join(OUT, `${FORMAT}-${t.toFixed(2).padStart(5, '0')}.png`);
    fs.writeFileSync(f, buf);
    console.log('still', f);
  }
}

async function renderRange(browser, port, f0, f1, file, wi) {
  const p = await openPage(browser, port);
  const vf = SUB > 1
    ? `tmix=frames=${SUB},select='eq(mod(n\\,${SUB})\\,${SUB - 1})',setpts=N/(${FPS}*TB)`
    : 'setpts=N/(' + FPS + '*TB)';
  const ff = spawn('ffmpeg', ['-v', 'error', '-y', '-f', 'image2pipe', '-framerate', String(FPS * SUB), '-c:v', 'png', '-i', '-',
    '-vf', `${vf},scale=out_color_matrix=bt709:out_range=tv,format=yuv444p`, '-r', String(FPS),
    '-c:v', 'libx264', '-preset', 'ultrafast', '-qp', '0', '-colorspace', 'bt709', '-color_primaries', 'bt709', '-color_trc', 'bt709', '-color_range', 'tv', file], { stdio: ['pipe', 'inherit', 'inherit'] });
  const done = new Promise((res, rej) => ff.on('close', (c) => (c === 0 ? res() : rej(new Error('ffmpeg exited ' + c)))));
  const t0 = Date.now();
  for (let f = f0; f < f1; f++) {
    for (let s = 0; s < SUB; s++) {
      const t = f / FPS + (s / SUB) * (SHUTTER / FPS);
      const buf = await grab(p, t);
      if (!ff.stdin.write(buf)) await new Promise((r) => ff.stdin.once('drain', r));
    }
    if ((f - f0) % 60 === 0) {
      const el = (Date.now() - t0) / 1000;
      console.log(`[w${wi}] frame ${f}/${f1} · ${(el / Math.max(1, f - f0)).toFixed(2)} s/frame`);
    }
  }
  ff.stdin.end();
  await done;
  await p.page.close();
}

(async () => {
  const srv = await serve();
  const port = srv.address().port;
  const browser = await chromium.launch({ args: ['--disable-gpu-vsync', '--hide-scrollbars', '--font-render-hinting=none', ...EXTRA] });
  try {
    if (args.stills) return await stills(browser, port);
    const from = Number(args.from || 0), to = Number(args.to || 64);
    const F0 = Math.round(from * FPS), F1 = Math.round(to * FPS);
    fs.mkdirSync(path.dirname(OUT), { recursive: true });
    const tmp = OUT + '.parts';
    fs.mkdirSync(tmp, { recursive: true });
    const n = F1 - F0, per = Math.ceil(n / WORKERS);
    const parts = [];
    const jobs = [];
    for (let w = 0; w < WORKERS; w++) {
      const a = F0 + w * per, b = Math.min(F1, a + per);
      if (a >= b) break;
      const file = path.join(tmp, `part${w}.mkv`);
      parts.push(file);
      jobs.push(renderRange(browser, port, a, b, file, w));
    }
    const t0 = Date.now();
    await Promise.all(jobs);
    fs.writeFileSync(path.join(tmp, 'list.txt'), parts.map((p) => `file '${p}'`).join('\n'));
    await new Promise((res, rej) => {
      const ff = spawn('ffmpeg', ['-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', path.join(tmp, 'list.txt'), '-c', 'copy', OUT], { stdio: 'inherit' });
      ff.on('close', (c) => (c === 0 ? res() : rej(new Error('concat failed'))));
    });
    console.log(`rendered ${n} frames in ${((Date.now() - t0) / 1000).toFixed(1)} s → ${OUT}`);
  } finally {
    await browser.close();
    srv.close();
  }
})().catch((e) => { console.error(e); process.exit(1); });
