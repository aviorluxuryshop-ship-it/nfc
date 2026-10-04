# -*- coding: utf-8 -*-
import sys, os, glob, math, random, subprocess
import numpy as np, cv2, cairo
import story as S
from engine import *
from story import TR, GR, UK, FR, IT, AM, GOLD

S.WEST_KEYS.sort(key=lambda k: k[0])
S.EAST_KEYS.sort(key=lambda k: k[0])
CAMERA = Camera(S.CAM)
PHOTO_DIR = 'photos/'


# ------------------------------------------------------------------ occupied areas -> red national area
def occupied(t):
    gs = []
    g = S.west_greek(t)
    if g is not None and not g.is_empty:
        gs.append(g)
    if S.T_THRACE + 0.6 <= t <= S.T_MUDANYA + 1.2:
        gs.append(S.THRACE)
    if 23.8 <= t <= S.T_IST_FREE + 0.6:
        gs.append(S.ALLIED)
    if t >= 29.2:
        gs.append(S.FR0 if t < S.T_MARAS else S.FR1 if t < S.T_ANKARA_TR else S.FR2)
    if 33.8 <= t <= S.T_ITALY_OUT + 1.0:
        gs.append(S.IT0)
    if t >= S.T6 - 0.5:
        gs.append(S.east_armenia(t))
    if not gs:
        return None
    return unary_union(gs).buffer(0.003)


def turkey_fill(ctx, v, t):
    a = fade(t, 1.5, 1e9, 2.0, 0.0)
    strength = 0.30
    if t > S.T_TBMM - 0.5:
        strength = 0.30 + 0.10 * smooth((t - S.T_TBMM + 0.5) / 3)
    g = S.LAUSANNE if t >= S.T_LAUS else TURKEY
    if S.T_SEVR <= t <= S.T_SEVR + 12.2:  # Sevr haritasında kırmızıyı kalan topraklara indir
        u = fade(t, S.T_SEVR + 4.6, S.T_SEVR + 12.2, 0.8, 1.2)
        zone(ctx, v, S.SV_TR, TR, a * u, fill=0.38, edge=True)
        a *= (1 - u)
    occ = occupied(t)
    if occ is not None and t < S.T_LAUS:
        g = g.difference(occ)
    strength *= 0.6 + 0.4 * clamp((v.span - 3) / 8)
    if t >= S.T14:
        strength += 0.18 * smooth((t - S.T14 - 0.5) / 2.0)
    zone(ctx, v, g, TR, a, fill=strength, edge=False, glow=t >= S.T_LAUS)
    if t >= S.T_LAUS:
        # Lozan sınırı: altın kenar
        u = smooth((t - S.T_LAUS - 3.0) / 1.5)
        ctx.save()
        geom_path(ctx, v, S.LAUSANNE.intersection(v.bbox(0.3)))
        ctx.set_line_width(3.0)
        ctx.set_source_rgba(1, 0.85, 0.45, 0.9 * u * a)
        ctx.stroke()
        ctx.restore()


# replace the story's version (which subtracted nothing)
for i, (t0, t1, fn) in enumerate(S.LAYERS):
    if fn.__name__ == 'turkey_fill':
        S.LAYERS[i] = (t0, 1e9, turkey_fill)
    if fn.__name__ == 'italy_note':
        S.LAYERS[i] = (0, -1, fn)
# draw order: base furniture, red, zones..., then everything else as declared
ORDER = ['base_layers', 'wide_labels', 'turkey_fill', 'allied_zone', 'south_zone', 'italy_zone', 'greek_west', 'thrace', 'armenia']
S.LAYERS.sort(key=lambda L: ORDER.index(L[2].__name__) if L[2].__name__ in ORDER else 100)


# ------------------------------------------------------------------ HUD
def current_dates(t):
    prev, cur = None, None
    for i, (dt, s) in enumerate(S.DATES):
        if dt <= t:
            prev, cur = (S.DATES[i - 1] if i > 0 else None), (dt, s)
    return prev, cur


def in_photo(t):
    best = 0.0
    for (t0, t1, f, *_r) in S.PHOTOS:
        if photo_ok(f):
            best = max(best, fade(t, t0, t1, 0.55, 0.55))
    return best


def hud_dim(t):
    d = 0.0
    for t0, t1, *_ in S.CHAPTERS:
        d = max(d, 0.45 * fade(t, t0, t1, 0.5, 0.7))
    for t0, t1, *_ in S.QUOTES:
        d = max(d, 0.55 * fade(t, t0, t1, 0.6, 0.7))
    for t0, t1, k in S.TITLES:
        if k != 'republic':
            d = max(d, 0.35 * fade(t, t0, t1, 0.4, 0.8))
    return d


def draw_date(ctx, t):
    prev, cur = current_dates(t)
    if cur is None:
        return
    vis = fade(t, S.DATES[0][0], S.END - 0.3, 0.6, 0.6) * (1 - in_photo(t))
    for t0, t1, k in S.TITLES:
        vis *= 1 - fade(t, t0 - 0.3, t1, 0.4, 0.4) * (1.0 if k != 'republic' else 1.0)
    if vis <= 0.01:
        return
    u = smooth((t - cur[0]) / 0.55)
    font(ctx, 'Oswald', 23, False)
    shadow_text(ctx, 'KURTULUŞ SAVAŞI', W / 2, 150, (1, 0.82, 0.42), vis * 0.95, 8, 0.5, sh=0.8)
    # thin rules
    ctx.set_source_rgba(1, 0.82, 0.42, 0.7 * vis)
    ctx.set_line_width(1.5)
    ctx.move_to(W / 2 - 260, 142); ctx.line_to(W / 2 - 150, 142)
    ctx.move_to(W / 2 + 150, 142); ctx.line_to(W / 2 + 260, 142)
    ctx.stroke()
    font(ctx, 'Cinzel', 60, True)
    if prev is not None and u < 1:
        shadow_text(ctx, prev[1], W / 2, 228 - 40 * u, (1, 1, 1), vis * (1 - u), 3, 0.5, sh=0.9)
    shadow_text(ctx, cur[1], W / 2, 228 + 40 * (1 - u), (1, 1, 1), vis * u, 3, 0.5, sh=0.9)


def draw_caption(ctx, t):
    for t0, t1, title, body in S.CAPS:
        a = fade(t, t0, t1, 0.5, 0.5) * (1 - in_photo(t))
        if a <= 0.01:
            continue
        lt = t - t0
        x0 = 70
        font(ctx, 'Oswald', 34, False)
        lines = wrap(ctx, body, 860) if body else []
        y0 = 1395
        hgt = 70 + len(lines) * 47
        # backdrop
        lg = cairo.LinearGradient(0, y0 - 140, 0, y0 + hgt + 120)
        lg.add_color_stop_rgba(0, 0, 0, 0, 0)
        lg.add_color_stop_rgba(0.35, 0, 0, 0, 0.55 * a)
        lg.add_color_stop_rgba(0.8, 0, 0, 0, 0.55 * a)
        lg.add_color_stop_rgba(1, 0, 0, 0, 0)
        ctx.set_source(lg)
        ctx.rectangle(0, y0 - 140, W, hgt + 260)
        ctx.fill()
        sl = ease_out(lt / 0.6)
        ctx.set_source_rgba(0.85, 0.12, 0.15, a)
        ctx.rectangle(x0 - 22, y0 - 40, 7, (hgt + 10) * sl)
        ctx.fill()
        font(ctx, 'Oswald', 48, True)
        shadow_text(ctx, title, x0 + (1 - sl) * -30, y0, (1, 0.86, 0.5), a * sl, 2.5, 0, sh=0.9)
        font(ctx, 'Oswald', 34, False)
        for i, ln in enumerate(lines):
            aa = a * smooth((lt - 0.25 - i * 0.12) / 0.5)
            shadow_text(ctx, ln, x0, y0 + 62 + i * 47, (1, 1, 1), aa, 0.6, 0, sh=0.9)


def draw_chapter(ctx, t):
    for t0, t1, num, title in S.CHAPTERS:
        a = fade(t, t0, t1, 0.5, 0.7)
        if a <= 0.01:
            continue
        lt = t - t0
        y = H * 0.44
        font(ctx, 'Cinzel', 40, True)
        shadow_text(ctx, 'BÖLÜM ' + num, W / 2, y - 80, (1, 0.82, 0.42), a * smooth(lt / 0.6), 10, 0.5, sh=1)
        sz = 88 if len(title) < 10 else 70
        font(ctx, 'Cinzel', sz, True)
        sp = 10 + 8 * (1 - ease_out(lt / 1.5))
        shadow_text(ctx, title, W / 2, y + 30, (1, 1, 1), a * smooth((lt - 0.15) / 0.6), sp, 0.5, sh=1)
        lw = 340 * ease_out((lt - 0.2) / 1.0)
        ctx.set_source_rgba(1, 0.82, 0.42, 0.85 * a)
        ctx.set_line_width(2)
        ctx.move_to(W / 2 - lw, y + 75); ctx.line_to(W / 2 + lw, y + 75)
        ctx.stroke()
        ctx.set_source_rgba(1, 0.82, 0.42, a)
        star_path(ctx, W / 2, y + 75, 9, -math.pi / 2)
        ctx.fill()


def draw_quote(ctx, t):
    for t0, t1, text, who in S.QUOTES:
        a = fade(t, t0, t1, 0.6, 0.7) * (1 - in_photo(t))
        if a <= 0.01:
            continue
        lt = t - t0
        font(ctx, 'Cinzel', 52, True)
        lines = wrap(ctx, text, 880)
        y = H * 0.40 - len(lines) * 34
        for i, ln in enumerate(lines):
            aa = a * smooth((lt - i * 0.25) / 0.7)
            shadow_text(ctx, ln, W / 2, y + i * 70 + (1 - aa) * 10, (1, 0.97, 0.9), aa, 1, 0.5, sh=1)
        font(ctx, 'Oswald', 30, False)
        yy = y + len(lines) * 70 + 30
        aa = a * smooth((lt - 0.8) / 0.6)
        ctx.set_source_rgba(1, 0.82, 0.42, aa)
        ctx.rectangle(W / 2 - 40, yy - 34, 80, 2)
        ctx.fill()
        shadow_text(ctx, '— ' + who, W / 2, yy + 14, (1, 0.82, 0.42), aa, 2, 0.5, sh=1)


def draw_stamp(ctx, t):
    for t0, t1, text, rx, ry, rot in S.STAMPS:
        a = fade(t, t0, t1, 0.05, 0.6)
        if a <= 0.01:
            continue
        lt = t - t0
        sc = 1 + 1.8 * (1 - ease_out(lt / 0.35)) if lt < 0.35 else 1.0
        ctx.save()
        ctx.translate(W * rx, H * ry)
        ctx.rotate(rot)
        ctx.scale(sc, sc)
        font(ctx, 'Cinzel', 70, True)
        tw = text_spaced(ctx, text, 0, 0, 6, measure=True)
        col = (0.85, 0.08, 0.1)
        ctx.set_source_rgba(*col, 0.9 * a)
        ctx.set_line_width(7)
        ctx.rectangle(-tw / 2 - 30, -78, tw + 60, 112)
        ctx.stroke()
        ctx.set_line_width(2.5)
        ctx.rectangle(-tw / 2 - 18, -66, tw + 36, 88)
        ctx.stroke()
        ctx.set_source_rgba(*col, 0.92 * a)
        text_spaced(ctx, text, 0, 0, 6, 0.5)
        ctx.restore()


def draw_titles(ctx, t):
    for t0, t1, k in S.TITLES:
        a = fade(t, t0, t1, 0.8, 0.9)
        if a <= 0.01:
            continue
        lt = t - t0
        if k == 'year':
            font(ctx, 'Cinzel', 170, True)
            sp = 30 - 14 * ease_out(lt / 4)
            shadow_text(ctx, '1918', W / 2, H * 0.43, (1, 0.97, 0.9), a, sp, 0.5, sh=1)
            font(ctx, 'Oswald', 40, False)
            shadow_text(ctx, 'Birinci Dünya Savaşı sona eriyor.', W / 2, H * 0.43 + 90, (1, 1, 1), a * smooth((lt - 0.6) / 0.8), 2, 0.5, sh=1)
            shadow_text(ctx, 'Osmanlı Devleti yenik düşmüştü.', W / 2, H * 0.43 + 145, (1, 0.82, 0.42), a * smooth((lt - 1.6) / 0.8), 2, 0.5, sh=1)
        elif k == 'main':
            y = H * 0.42
            font(ctx, 'Oswald', 30, False)
            shadow_text(ctx, 'TÜRK İSTİKLÂL HARBİ', W / 2, y - 120, (1, 0.82, 0.42), a * smooth(lt / 0.8), 12, 0.5, sh=1)
            font(ctx, 'Cinzel', 104, True)
            sp = 6 + 10 * (1 - ease_out(lt / 3))
            shadow_text(ctx, 'KURTULUŞ', W / 2, y, (1, 1, 1), a * smooth((lt - 0.2) / 0.8), sp, 0.5, sh=1)
            shadow_text(ctx, 'SAVAŞI', W / 2, y + 115, (1, 1, 1), a * smooth((lt - 0.45) / 0.8), sp, 0.5, sh=1)
            lw = 300 * ease_out((lt - 0.6) / 1.2)
            ctx.set_source_rgba(1, 0.82, 0.42, a)
            ctx.set_line_width(2)
            ctx.move_to(W / 2 - lw, y + 165); ctx.line_to(W / 2 + lw, y + 165); ctx.stroke()
            font(ctx, 'Cinzel', 44, True)
            shadow_text(ctx, '1919 — 1923', W / 2, y + 235, (1, 0.82, 0.42), a * smooth((lt - 0.9) / 0.8), 6, 0.5, sh=1)
        elif k == 'republic':
            y = H * 0.20
            font(ctx, 'Oswald', 30, False)
            shadow_text(ctx, '29 EKİM 1923', W / 2, y - 80, (1, 0.82, 0.42), a * smooth(lt / 0.8), 12, 0.5, sh=1)
            font(ctx, 'Cinzel', 92, True)
            sp = 4 + 10 * (1 - ease_out(lt / 3))
            shadow_text(ctx, 'TÜRKİYE', W / 2, y + 20, (1, 1, 1), a * smooth((lt - 0.3) / 0.8), sp, 0.5, sh=1)
            shadow_text(ctx, 'CUMHURİYETİ', W / 2, y + 120, (1, 1, 1), a * smooth((lt - 0.55) / 0.8), sp, 0.5, sh=1)
            lw = 280 * ease_out((lt - 0.8) / 1.2)
            ctx.set_source_rgba(1, 0.82, 0.42, a)
            ctx.set_line_width(2)
            ctx.move_to(W / 2 - lw, y + 170); ctx.line_to(W / 2 + lw, y + 170); ctx.stroke()
            badge(ctx, W / 2, H * 0.72, 'tr', 70, a * smooth((lt - 1.4) / 0.6), pop_curve((lt - 1.4) / 0.8))
            font(ctx, 'Oswald', 36, False)
            shadow_text(ctx, '"Egemenlik kayıtsız şartsız milletindir."', W / 2, H * 0.72 + 150, (1, 1, 1),
                        a * smooth((lt - 2.6) / 0.8), 1, 0.5, sh=1)


# ------------------------------------------------------------------ photos
_PH = {}


def photo_path(name):
    for f in glob.glob(PHOTO_DIR + name + '.*'):
        return f
    return None


def photo_ok(name):
    return photo_path(name) is not None


def load_photo(name):
    if name not in _PH:
        im = cv2.imread(photo_path(name), cv2.IMREAD_COLOR)
        g = cv2.cvtColor(im, cv2.COLOR_BGR2GRAY).astype(np.float32) / 255
        # normalize & gentle local contrast
        lo, hi = np.percentile(g, 1), np.percentile(g, 99.3)
        g = np.clip((g - lo) / max(1e-3, hi - lo), 0, 1)
        cl = cv2.createCLAHE(2.0, (8, 8)).apply((g * 255).astype(np.uint8)).astype(np.float32) / 255
        g = g * 0.5 + cl * 0.5
        # denoise jpeg & upsample-friendly
        g = cv2.bilateralFilter(g, 5, 0.08, 3)
        tone = np.stack([g * 0.80 + 0.03, g * 0.93 + 0.02, g * 1.02 + 0.0], -1)  # warm sepia (BGR)
        _PH[name] = np.clip(tone, 0, 1).astype(np.float32)
    return _PH[name]


CROP = dict(izmir1922a=(0.08, 0.13, 0.92, 0.87), izmir1922b=(0.08, 0.13, 0.92, 0.87), izmir1922c=(0.08, 0.13, 0.92, 0.87),
            ankara1920=(0.03, 0.05, 0.97, 0.93), eskisehir1921=(0.02, 0.03, 0.98, 0.97), infantry1921=(0.02, 0.04, 0.98, 0.95),
            ist1923=(0.03, 0.04, 0.97, 0.96), sivas1919=(0.10, 0.06, 0.95, 0.94), mk1920=(0.05, 0.05, 0.95, 0.95))
_BG = {}


def photo_layers(name):
    if name not in _BG:
        img = load_photo(name)
        h, w = img.shape[:2]
        c = CROP.get(name)
        if c:
            img = img[int(c[1] * h):int(c[3] * h), int(c[0] * w):int(c[2] * w)].copy()
        h, w = img.shape[:2]
        k = max(H / h, W / w) * 1.15
        bg = cv2.resize(img, (int(w * k), int(h * k)), interpolation=cv2.INTER_LINEAR)
        bg = cv2.GaussianBlur(bg, (0, 0), 28)
        y0, x0 = (bg.shape[0] - H) // 2, (bg.shape[1] - W) // 2
        bg = bg[y0:y0 + H, x0:x0 + W] * 0.42
        _BG[name] = (img, bg.astype(np.float32))
    return _BG[name]


def render_photo(t, ph, frame):
    t0, t1, name, caption, pan, z = ph
    u = clamp((t - t0) / (t1 - t0))
    img, bg = photo_layers(name)
    h, w = img.shape[:2]
    zoom = lerp(z[0], z[1], ease_io(u))
    # framed photo: fit width with margin
    fw = W - 70
    k = fw / w
    ph_h = h * k
    cy_screen = H * 0.43
    # inner Ken Burns inside the frame: crop by zoom, drift by pan
    px = lerp(pan[0], pan[2], ease_io(u))
    py = lerp(pan[1], pan[3], ease_io(u))
    kz = k * zoom
    vw, vh = fw / kz, ph_h / kz
    cx = vw / 2 + (w - vw) * px
    cy = vh / 2 + (h - vh) * py
    fx0, fy0 = (W - fw) / 2, cy_screen - ph_h / 2
    M = np.array([[kz, 0, fx0 + fw / 2 - cx * kz], [0, kz, fy0 + ph_h / 2 - cy * kz]])
    fg = cv2.warpAffine(img, M, (W, H), flags=cv2.INTER_CUBIC, borderMode=cv2.BORDER_CONSTANT)
    mask = np.zeros((H, W), np.float32)
    mask[int(fy0):int(fy0 + ph_h), int(fx0):int(fx0 + fw)] = 1
    # outer slow push on the whole composition
    bgz = 1.0 + 0.04 * ease_io(u)
    Mb = np.array([[bgz, 0, W / 2 * (1 - bgz)], [0, bgz, H / 2 * (1 - bgz)]])
    bgw = cv2.warpAffine(bg, Mb, (W, H), flags=cv2.INTER_LINEAR, borderMode=cv2.BORDER_REFLECT)
    # drop shadow
    sh = cv2.GaussianBlur(mask, (0, 0), 18)
    out = bgw * (1 - 0.7 * sh[..., None])
    out = out * (1 - mask[..., None]) + fg * mask[..., None]
    rng = random.Random(frame * 7 + 1)
    out = out * (1 + rng.uniform(-0.025, 0.025))
    ov_s, ctx = new_ctx()
    # thin frame line
    ctx.set_source_rgba(0.95, 0.88, 0.7, 0.55)
    ctx.set_line_width(2)
    ctx.rectangle(fx0 - 8, fy0 - 8, fw + 16, ph_h + 16)
    ctx.stroke()
    for i in range(rng.randint(0, 2)):
        x = rng.uniform(fx0, fx0 + fw)
        ctx.set_source_rgba(1, 1, 1, rng.uniform(0.05, 0.15))
        ctx.set_line_width(rng.uniform(0.8, 1.8))
        ctx.move_to(x, fy0); ctx.line_to(x + rng.uniform(-5, 5), fy0 + ph_h)
        ctx.stroke()
    for i in range(rng.randint(2, 8)):
        ctx.set_source_rgba(0.05, 0.04, 0.03, rng.uniform(0.3, 0.7))
        ctx.arc(rng.uniform(fx0, fx0 + fw), rng.uniform(fy0, fy0 + ph_h), rng.uniform(1, 3), 0, 2 * math.pi)
        ctx.fill()
    a = fade(t, t0 + 0.3, t1, 0.6, 0.5)
    ytxt = fy0 + ph_h + 90
    font(ctx, 'Oswald', 24, False)
    shadow_text(ctx, 'ARŞİV FOTOĞRAFI', 70, ytxt, (1, 0.82, 0.42), a, 6, 0)
    ctx.set_source_rgba(0.85, 0.12, 0.15, a)
    ctx.rectangle(70, ytxt + 16, 60 * ease_out((t - t0 - 0.3) / 0.8), 3)
    ctx.fill()
    font(ctx, 'Oswald', 38, False)
    for i, ln in enumerate(wrap(ctx, caption, 900)):
        shadow_text(ctx, ln, 70, ytxt + 70 + i * 50, (1, 1, 1), a * smooth((t - t0 - 0.5 - i * 0.12) / 0.5), 0.6, 0)
    out = composite(out, surf_to_np(ov_s))
    return out


# ------------------------------------------------------------------ frame
def render_map(t, frame):
    lon, lat, span = CAMERA.at(t)
    v = View(lon, lat, span, t)
    base = render_base(v).astype(np.float32) / 255.0
    # map-grade: slightly darker, moodier
    base = base * 0.88
    # focus: dim & desaturate land/sea outside Anatolia
    m = focus_mask(v, S.TURKEY_AM if t < S.T_LAUS else S.LAUSANNE, 10)[..., None]
    lum = base.mean(axis=2, keepdims=True)
    outside = (base * 0.6 + lum * 0.4) * 0.78
    base = base * m + outside * (1 - m)
    surf, ctx = new_ctx()
    for t0, t1, fn in S.LAYERS:
        if t0 <= t <= t1:
            fn(ctx, v, t)
    ov = surf_to_np(surf)
    img = composite(base, ov)
    # clouds
    amt = 0.0
    if S.CLOUDS:
        ks = S.CLOUDS
        if t <= ks[0][0]:
            amt = ks[0][1]
        elif t >= ks[-1][0]:
            amt = ks[-1][1]
        else:
            for a, b in zip(ks, ks[1:]):
                if a[0] <= t <= b[0]:
                    amt = lerp(a[1], b[1], smooth((t - a[0]) / (b[0] - a[0])))
    # natural cloud wisps in far shots
    amt = max(amt, 0.22 * clamp((span - 14) / 10))
    img = apply_clouds(img, v, amt, t)
    return img


def render_frame(frame):
    t = frame / FPS
    pa = in_photo(t)
    img = None
    if pa < 0.999:
        img = render_map(t, frame)
    if pa > 0.001:
        ph = None
        for p in S.PHOTOS:
            if photo_ok(p[2]) and fade(t, p[0], p[1], 0.55, 0.55) > 0:
                ph = p
        pimg = render_photo(t, ph, frame)
        img = pimg if img is None else img * (1 - pa) + pimg * pa
        # warm flash at dissolve midpoint
        fl = max(0.0, 1 - abs(pa - 0.5) * 2) ** 2
        img = img + fl * 0.10 * np.array([0.6, 0.85, 1.0], np.float32)
    dim = hud_dim(t)
    if dim > 0:
        img = img * (1 - dim)
    # HUD layer
    surf, ctx = new_ctx()
    draw_date(ctx, t)
    draw_caption(ctx, t)
    draw_chapter(ctx, t)
    draw_quote(ctx, t)
    draw_stamp(ctx, t)
    draw_titles(ctx, t)
    img = composite(img, surf_to_np(surf))
    img = grade(img, frame, grain=0.03 + 0.02 * pa)
    # global fades
    g = smooth(t / 1.2) * smooth((S.END - t) / 1.5)
    img = img * g
    return (np.clip(img, 0, 1) * 255).astype(np.uint8)


def nframes():
    return int(S.END * FPS)


if __name__ == '__main__':
    mode = sys.argv[1]
    if mode == 'stills':
        os.makedirs('stills', exist_ok=True)
        for ts in sys.argv[2:]:
            f = int(float(ts) * FPS)
            cv2.imwrite(f'stills/s_{float(ts):07.2f}.jpg', render_frame(f), [cv2.IMWRITE_JPEG_QUALITY, 88])
    elif mode == 'seg':
        f0, f1, out = int(sys.argv[2]), int(sys.argv[3]), sys.argv[4]
        p = subprocess.Popen(['ffmpeg', '-v', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'bgr24', '-s', f'{W}x{H}', '-r', str(FPS),
                              '-i', '-', '-c:v', 'libx264', '-preset', 'slow', '-crf', '16', '-pix_fmt', 'yuv420p',
                              '-x264-params', 'aq-mode=3', out], stdin=subprocess.PIPE)
        for f in range(f0, min(f1, nframes())):
            p.stdin.write(render_frame(f).tobytes())
            if f % 60 == 0:
                print(out, f, flush=True)
        p.stdin.close()
        p.wait()
    elif mode == 'n':
        print(nframes())
