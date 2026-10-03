---
name: video-production
description: Make promo films, product videos, ads, explainers and social cuts (YouTube 16:9, Reels/TikTok/Shorts 9:16) entirely with free tools — HTML/SVG motion graphics rendered frame by frame in headless Chromium with motion blur, original synthesised music and sound effects, ffmpeg encoding — then a strict QA pass before delivery. Use whenever a project needs a video made, re-cut, translated, re-timed, checked or delivered ("tanıtım videosu", "reklam filmi", "Reels/TikTok videosu", "video yap", "videoyu indir"). For editing existing camera footage, use it together with the video-editing-plus skill.
---

# Video production (code-drawn films, free tools only)

A working pipeline already exists in `video/` (two VELMO films, 32 s each, TR/EN, 16:9 + 9:16: the brand film `film.*` and the character-animated usage film `usage.*`).
Reuse it as the template for any new film rather than starting over: copy the page and its music script, add a case to `build.sh`'s `FILM` switch.

| File | Role |
|---|---|
| `video/film.html`, `video/film.js` | The film. `seek(t)` draws second t; everything is a pure function of time (no CSS animations), so frames render in any order |
| `video/assets/brand.js`, `assets/fonts/` | Product art, icons and the site's fonts, extracted from the site build (Playwright `outerHTML` of the real SVG components) |
| `video/music.py` | Original score + sound effects synthesised with numpy/scipy, every hit placed on the film's cue times |
| `video/usage.js`, `video/music_usage.py` | Story film kit: SVG world + camera, IK-posed characters (`kid()`, `mom()`), props, a washing machine; captions on the film clock (`cue()`); score with Karplus–Strong ukulele, glockenspiel, whistle and Foley-style effects, mastered in-script to −13 LUFS / −1.3 dBTP |
| `video/render.js` | Parallel Chromium workers → sub-frames → `tmix` motion blur → x264/AAC; `--snap` renders stills |
| `video/build.sh` | Music → loudness (−13 LUFS) → all versions → web cuts (MP4 + VP9 WebM) → posters → copies into `public/video/` |
| `video/qa/layout.js`, `qa/sheets.py`, `qa/check.sh` | QA tools (below) |

Playwright: `NODE_PATH=<dir with playwright-core> node video/render.js …`; Chromium at `/opt/pw-browsers/chromium-*/chrome-linux/chrome` (`--chrome` to override).

## Making a new film

1. **Copy, don't invent.** Every line of on-screen copy comes from the product's own site/packaging. No new claims, prices, company details or domains unless the user gives them.
2. **Storyboard on the music grid.** 120 BPM → a bar is 2 s; put every cut on a bar line. Typical arc: logo → problem → solution hero → how it works → proof/numbers → variants → end card with CTA.
3. **Write scenes in `film.js`** with the helpers already there: `put()` (anchor-based transforms), `words()`/`rise()` (masked text reveals), `fit()` (shrinks long lines — English runs longer), `bubbles()`, `wipe()` (rainbow ribbon), `clipCircle()` (iris / curved wipe from off-screen), `layer()` + camera push. Branch layouts on `V` (vertical) inside each scene.
4. **Write the cue list in `music.py`** against the same times (whooshes on wipes, pops on reveals, a drop where the story turns), keep sections dynamic (quiet intro, muted problem, full groove after the drop).
5. **Stills first:** `node video/render.js --lang tr --snap 2.9,10.7,23.3,31 --outdir video/out/snaps` (and `--w 1080 --h 1920`). Look at them before any full render.

### What makes it look expensive
- Masked word rises with stagger, `outExpo`/`outBack` easing, no linear moves.
- Motion blur: `--sub 6 --shutter 0.5` (stair-stepping shows below 6 on fast wipes).
- Anything discrete that changes over time (counters, digits) must change once per frame: compute it from `Math.round(t * 30) / 30`, or blur blends two values.
- Transitions start off-screen (curved wipe, ribbon), never as a dot or smear on the product.
- Real product art, soft glows, subtle grain (overlay ~0.16) and vignette; keep text out of the bottom ~20 % and right column on 9:16 (app UI).

## Render and deliver

```bash
NODE_PATH=… ./video/build.sh            # all versions, ~7 min each for 32 s 1080p on 4 cores
NODE_PATH=… ./video/build.sh tr 9x16    # one version
FILM=usage NODE_PATH=… ./video/build.sh # the usage film (render.js/qa/layout.js take --page usage.html)
```

- **Masters**: H.264 CRF 18, 30 fps, BT.709 tags, AAC 256k, `+faststart`, −13 LUFS, true peak ≤ −1 dB.
- **To send in chat**: files over ~30 MB fail to upload — make share copies at CRF 20 (~20 MB for 32 s 1080p).
- **On the site**: 1080p MP4 (CRF 22) + VP9/Opus WebM (CRF 33) + a poster from a scene without a CTA button (a fake button on a poster confuses people). Play only on click (`preload="none"`), pick the cut with `matchMedia` and the format with `canPlayType` at click time, call `play()` inside the click so phones allow sound.
- **Download links**: `/indir/<file>.mp4` rewrites to `/video/<file>.mp4` with `Content-Disposition: attachment` (see `next.config.mjs`) — one tap saves it. iPhone: Files → share → "Save Video" to reach Photos.

## QA — required before saying it's done

1. `node video/qa/layout.js` — text outside the title-safe area, text/text or text/product collisions at each scene's settled moment (`window.QA_MOMENTS`). Line boxes run taller than ink: confirm any logo/tagline hit in a still before fixing.
2. `python3 video/qa/sheets.py out/<file>.mp4 --fps 2` — look at every sheet of every version (TR/EN × 16:9/9:16). Check transitions frame by frame at `--fps 10` on short cuts.
3. `./video/qa/check.sh out/*.mp4` — exact duration and frame count, 0 decode errors, −13 LUFS ±1, true peak ≤ −1 dB, 48 kHz stereo.
4. Audio: L/R balance, mono fold-down loss < 1 dB, no clicks at start/end, no event spiking far above its surroundings.
5. On the site after deploy: crawl every page (desktop + mobile), click play on desktop and phone sizes (correct cut, sound on, controls, focus), replay after the end, and check the `/indir/` links return `attachment` and byte-identical files.

## Gotchas met before
- `pkill -f "<pattern>"` also matches your own shell's command line and kills it; find PIDs with `ps -eo pid,args | awk …` instead.
- Playwright's bundled Chromium has no H.264: test playback with the WebM or check `canPlayType`; real browsers play the MP4.
- `fit()` must measure text while it is displayed: captions hidden with `display:none` report width 0 and never shrink.
- Story films: give every action its own sound (latch, beep, splash, boing), then check each event's momentary loudness against the 2 s around it — a pure-tone whistle can jump 6 dB above the bed.
- Live-site browser tests behind the agent proxy need its CA: pass `--ignore-certificate-errors-spki-list=<sha256 of /root/.ccr/agent-proxy-ca.crt's SPKI>` (pins only that CA).
- Syncing large binaries through an API connector can hit request-size limits (~4 MB); verify the target repo's tree hash afterwards, and keep `build.sh`'s executable bit.
