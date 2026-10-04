"""Cinematic map engine: camera, base raster, vector overlays, effects."""
import math, pickle, random
import numpy as np, cv2, cairo
from shapely.geometry import Polygon, MultiPolygon, LineString, box
from shapely.ops import unary_union
from shapely.prepared import prep

cv2.setNumThreads(1)
W, H, FPS = 1080, 1920, 30
D = 'data/'
G = pickle.load(open(D + 'geo.pkl', 'rb'))
PPD, KX, LON0, LAT1 = G['PPD'], G['KX'], G['LON0'], G['LAT1']
BASE = None


def load_base():
    global BASE
    if BASE is None:
        BASE = [cv2.imread(D + 'base.png'), cv2.imread(D + 'base_half.png'), cv2.imread(D + 'base_q.png')]
    return BASE


TURKEY = G['countries']['Turkey'].buffer(0.01)
ARMENIA = G['countries']['Armenia']
LAND = G['land']

# ---------------------------------------------------------------- easing
def clamp(x, a=0.0, b=1.0):
    return a if x < a else b if x > b else x


def smooth(x):
    x = clamp(x)
    return x * x * x * (x * (x * 6 - 15) + 10)


def ease_io(x):
    x = clamp(x)
    return 0.5 - 0.5 * math.cos(math.pi * x)


def ease_out(x):
    x = clamp(x)
    return 1 - (1 - x) ** 3


def ease_in(x):
    x = clamp(x)
    return x ** 3


def fade(t, t0, t1, fi=0.6, fo=0.6):
    if t < t0 or t > t1:
        return 0.0
    a = 1.0
    if fi > 0:
        a = min(a, smooth((t - t0) / fi))
    if fo > 0:
        a = min(a, smooth((t1 - t) / fo))
    return a


def lerp(a, b, u):
    return a + (b - a) * u


# ---------------------------------------------------------------- camera
class Camera:
    """keys: list of (t, lon, lat, span, arc). span = degrees of latitude visible vertically."""

    def __init__(self, keys):
        self.keys = sorted(keys, key=lambda k: k[0])

    def at(self, t):
        ks = self.keys
        if t <= ks[0][0]:
            k = ks[0]
            return k[1], k[2], k[3]
        for a, b in zip(ks, ks[1:]):
            if a[0] <= t <= b[0]:
                u = (t - a[0]) / max(1e-6, b[0] - a[0])
                e = smooth(u)
                lon = lerp(a[1], b[1], e)
                lat = lerp(a[2], b[2], e)
                ls = lerp(math.log(a[3]), math.log(b[3]), ease_io(u))
                arc = b[4] if len(b) > 4 else 0
                span = math.exp(ls) * (1 + arc * math.sin(math.pi * u) ** 1.5)
                return lon, lat, span
        k = ks[-1]
        return k[1], k[2], k[3]


class View:
    def __init__(self, lon, lat, span, t=0.0):
        # subtle handheld drift
        lon += 0.004 * span * math.sin(t * 0.37) + 0.002 * span * math.sin(t * 1.1)
        lat += 0.003 * span * math.sin(t * 0.29 + 1)
        self.lon, self.lat, self.span = lon, lat, span
        self.s = H / (span * PPD)
        self.cx = (lon - LON0) * PPD * KX
        self.cy = (LAT1 - lat) * PPD

    def P(self, lon, lat):
        return ((lon - LON0) * PPD * KX - self.cx) * self.s + W / 2, ((LAT1 - lat) * PPD - self.cy) * self.s + H / 2

    def Pa(self, arr):
        arr = np.asarray(arr, dtype=np.float64)
        x = ((arr[:, 0] - LON0) * PPD * KX - self.cx) * self.s + W / 2
        y = ((LAT1 - arr[:, 1]) * PPD - self.cy) * self.s + H / 2
        return np.stack([x, y], 1)

    def bbox(self, m=0.25):
        hw = (W / 2) / self.s / (PPD * KX)
        hh = (H / 2) / self.s / PPD
        return box(self.lon - hw * (1 + m), self.lat - hh * (1 + m), self.lon + hw * (1 + m), self.lat + hh * (1 + m))

    def px_per_deg(self):
        return self.s * PPD


def render_base(v):
    b = load_base()
    lvl, sc = 0, v.s
    if v.s < 0.55:
        lvl, sc = 1, v.s * 2
    if v.s < 0.28:
        lvl, sc = 2, v.s * 4
    img = b[lvl]
    f = 1.0 / (2 ** lvl)
    cx, cy = v.cx * f, v.cy * f
    M = np.array([[sc, 0, W / 2 - cx * sc], [0, sc, H / 2 - cy * sc]], dtype=np.float64)
    interp = cv2.INTER_CUBIC if sc > 1.05 else cv2.INTER_LINEAR
    out = cv2.warpAffine(img, M, (W, H), flags=interp, borderMode=cv2.BORDER_REFLECT)
    if sc > 1.6:  # soften upscaled pixels
        out = cv2.GaussianBlur(out, (0, 0), 0.6)
    return out


# ---------------------------------------------------------------- clouds / fx textures
def _noise_tex(n, seed, beta=2.2):
    rng = np.random.default_rng(seed)
    w = rng.normal(size=(n, n)) + 1j * rng.normal(size=(n, n))
    fx = np.fft.fftfreq(n)[:, None]
    fy = np.fft.fftfreq(n)[None, :]
    f = np.sqrt(fx ** 2 + fy ** 2)
    f[0, 0] = 1
    spec = w / f ** (beta / 2 + 0.5)
    spec[0, 0] = 0
    r = np.real(np.fft.ifft2(spec))
    r = (r - r.min()) / (r.max() - r.min())
    return r.astype(np.float32)


_CLOUD = None


def _fbm_tile(n, seed):
    rng = np.random.default_rng(seed)
    acc = np.zeros((n, n), np.float32)
    wsum = 0
    for i, cells in enumerate([4, 8, 16, 32, 64, 128, 256]):
        g = rng.random((cells, cells)).astype(np.float32)
        g3 = np.tile(g, (3, 3))
        r = cv2.resize(g3, (n * 3, n * 3), interpolation=cv2.INTER_CUBIC)[n:2 * n, n:2 * n]
        w = 0.55 ** i
        acc += r * w
        wsum += w
    acc /= wsum
    return (acc - acc.min()) / (acc.max() - acc.min())


def cloud_tex():
    global _CLOUD
    if _CLOUD is None:
        try:
            _CLOUD = np.load(D + 'clouds2.npy')
        except Exception:
            c = _fbm_tile(1024, 5)
            c = np.clip((c - 0.48) / 0.30, 0, 1)
            c = c * c * (3 - 2 * c)
            c = c * (0.75 + 0.25 * _fbm_tile(1024, 9))
            _CLOUD = c.astype(np.float32)
            np.save(D + 'clouds2.npy', _CLOUD)
    return _CLOUD


def apply_clouds(img, v, amt, t):
    """img float32 BGR 0..1. Clouds are screen-space layers whose scale follows the camera."""
    if amt <= 0.005:
        return img
    tex = cloud_tex()
    out = img
    for li, (alt, al, drift) in enumerate([(1.0, 0.85, 0.010), (0.55, 0.55, 0.018)]):
        # texel per screen px: proportional to span (zoomed out -> clouds smaller)
        scale = (1024.0 / H) * (v.span / 30.0) * alt
        scale = max(0.15, min(scale, 3.0))
        ox = (v.cx / PPD * 120 * alt + t * drift * 1000) % 1024
        oy = (v.cy / PPD * 120 * alt) % 1024
        M = np.array([[scale, 0, ox], [0, scale, oy]], dtype=np.float64)
        c = cv2.warpAffine(tex, M, (W, H), flags=cv2.INTER_LINEAR | cv2.WARP_INVERSE_MAP, borderMode=cv2.BORDER_WRAP)
        a = c * amt * al
        sh = np.roll(a, (18, 24), (0, 1))
        out = out * (1 - sh[..., None] * 0.35)
        out = out * (1 - a[..., None]) + np.array([0.93, 0.95, 0.97], np.float32) * a[..., None]
    return out


_GRAIN = None
_VIG = None


def grain_frames():
    global _GRAIN
    if _GRAIN is None:
        rng = np.random.default_rng(3)
        _GRAIN = []
        for i in range(6):
            g = rng.normal(0, 1, (H // 2, W // 2)).astype(np.float32)
            g = cv2.resize(g, (W, H), interpolation=cv2.INTER_LINEAR)
            _GRAIN.append(g)
    return _GRAIN


def vignette():
    global _VIG
    if _VIG is None:
        y, x = np.mgrid[0:H, 0:W].astype(np.float32)
        nx = (x - W / 2) / (W / 2)
        ny = (y - H / 2) / (H / 2)
        r = np.sqrt(nx ** 2 * 0.9 + ny ** 2 * 0.75)
        _VIG = np.clip(1 - 0.55 * np.clip(r - 0.45, 0, 1) ** 1.6, 0, 1)[..., None].astype(np.float32)
    return _VIG


def grade(img, frame, grain=0.035, sat=0.88, dark=1.0):
    """img float BGR 0..1 -> cinematic grade."""
    lum = img[..., 0] * 0.11 + img[..., 1] * 0.59 + img[..., 2] * 0.3
    img = img * sat + lum[..., None] * (1 - sat)
    # filmic contrast
    img = np.clip(img, 0, 1)
    img = img * img * (3 - 2 * img) * 0.35 + img * 0.65
    # split tone: teal shadows / warm highlights
    l = lum[..., None]
    img = img + (1 - l) * np.array([0.025, 0.012, -0.01], np.float32) + l * np.array([-0.025, 0.0, 0.03], np.float32)
    img = img * vignette() * dark
    g = grain_frames()[frame % 6]
    img = img + g[..., None] * grain
    return np.clip(img, 0, 1)


# ---------------------------------------------------------------- cairo helpers
def new_ctx():
    surf = cairo.ImageSurface(cairo.FORMAT_ARGB32, W, H)
    ctx = cairo.Context(surf)
    ctx.set_line_join(cairo.LINE_JOIN_ROUND)
    ctx.set_line_cap(cairo.LINE_CAP_ROUND)
    return surf, ctx


def surf_to_np(surf):
    buf = surf.get_data()
    a = np.ndarray((H, W, 4), np.uint8, buf).astype(np.float32) / 255.0
    return a  # premultiplied BGRA


def composite(img, ov):
    # premultiplied over
    return img * (1 - ov[..., 3:4]) + ov[..., :3]


def hexc(h, a=1.0):
    h = h.lstrip('#')
    return (int(h[0:2], 16) / 255, int(h[2:4], 16) / 255, int(h[4:6], 16) / 255, a)


def geom_path(ctx, v, g):
    if g is None or g.is_empty:
        return
    polys = [g] if isinstance(g, Polygon) else [p for p in getattr(g, 'geoms', []) if isinstance(p, Polygon)]
    for p in polys:
        for ring in [p.exterior] + list(p.interiors):
            pts = v.Pa(np.asarray(ring.coords))
            ctx.move_to(*pts[0])
            for x, y in pts[1:]:
                ctx.line_to(x, y)
            ctx.close_path()


def line_path(ctx, v, g):
    if g is None or g.is_empty:
        return
    lines = [g] if isinstance(g, LineString) else list(getattr(g, 'geoms', []))
    for l in lines:
        if not isinstance(l, LineString):
            continue
        pts = v.Pa(np.asarray(l.coords))
        ctx.move_to(*pts[0])
        for x, y in pts[1:]:
            ctx.line_to(x, y)


def font(ctx, fam, size, bold=False):
    ctx.select_font_face(fam, cairo.FONT_SLANT_NORMAL, cairo.FONT_WEIGHT_BOLD if bold else cairo.FONT_WEIGHT_NORMAL)
    ctx.set_font_size(size)


def text_spaced(ctx, s, x, y, spacing=0.0, align=0.0, measure=False):
    """draw text with letter spacing; align 0=left .5=center 1=right"""
    widths = [ctx.text_extents(ch).x_advance for ch in s]
    total = sum(widths) + spacing * max(0, len(s) - 1)
    if measure:
        return total
    cx = x - total * align
    for ch, w in zip(s, widths):
        ctx.move_to(cx, y)
        ctx.show_text(ch)
        cx += w + spacing
    return total


def shadow_text(ctx, s, x, y, col, alpha, spacing=0.0, align=0.0, sh=0.75, blur=3):
    for dx, dy, a in [(0, 3, sh * 0.55), (2, 4, sh * 0.35), (-2, 4, sh * 0.25), (0, 6, sh * 0.2)]:
        ctx.set_source_rgba(0, 0, 0, a * alpha)
        text_spaced(ctx, s, x + dx, y + dy, spacing, align)
    ctx.set_source_rgba(col[0], col[1], col[2], alpha * (col[3] if len(col) > 3 else 1))
    return text_spaced(ctx, s, x, y, spacing, align)


def wrap(ctx, text, maxw):
    words = text.split()
    lines, cur = [], ''
    for w in words:
        t = (cur + ' ' + w).strip()
        if ctx.text_extents(t).x_advance > maxw and cur:
            lines.append(cur)
            cur = w
        else:
            cur = t
    if cur:
        lines.append(cur)
    return lines


# ---------------------------------------------------------------- flags
def star_path(ctx, cx, cy, r, rot=0.0, inner=0.382):
    for i in range(10):
        ang = rot + i * math.pi / 5
        rr = r if i % 2 == 0 else r * inner
        x, y = cx + rr * math.cos(ang), cy + rr * math.sin(ang)
        (ctx.move_to if i == 0 else ctx.line_to)(x, y)
    ctx.close_path()


def flag_tr(ctx, r):
    ctx.set_source_rgb(0.80, 0.06, 0.10)
    ctx.rectangle(-r * 1.6, -r, r * 3.2, r * 2)
    ctx.fill()
    ctx.set_source_rgb(1, 1, 1)
    ctx.arc(-0.22 * r, 0, 0.56 * r, 0, 2 * math.pi)
    ctx.fill()
    ctx.set_source_rgb(0.80, 0.06, 0.10)
    ctx.arc(-0.08 * r, 0, 0.45 * r, 0, 2 * math.pi)
    ctx.fill()
    ctx.set_source_rgb(1, 1, 1)
    star_path(ctx, 0.48 * r, 0, 0.27 * r, math.pi)
    ctx.fill()


def flag_gr(ctx, r):
    ctx.set_source_rgb(0.05, 0.37, 0.69)
    ctx.rectangle(-r * 1.6, -r, r * 3.2, r * 2)
    ctx.fill()
    ctx.set_source_rgb(1, 1, 1)
    ctx.rectangle(-r * 1.6, -0.2 * r, r * 3.2, 0.4 * r)
    ctx.rectangle(-0.2 * r, -r, 0.4 * r, 2 * r)
    ctx.fill()


def flag_uk(ctx, r):
    ctx.set_source_rgb(0.0, 0.14, 0.42)
    ctx.rectangle(-r * 1.6, -r, r * 3.2, r * 2)
    ctx.fill()
    for col, wd in [((1, 1, 1), 0.42), ((0.78, 0.06, 0.18), 0.16)]:
        ctx.set_source_rgb(*col)
        ctx.set_line_width(wd * r)
        ctx.move_to(-1.6 * r, -r); ctx.line_to(1.6 * r, r)
        ctx.move_to(-1.6 * r, r); ctx.line_to(1.6 * r, -r)
        ctx.stroke()
    ctx.set_source_rgb(1, 1, 1)
    ctx.rectangle(-1.6 * r, -0.3 * r, 3.2 * r, 0.6 * r); ctx.rectangle(-0.3 * r, -r, 0.6 * r, 2 * r); ctx.fill()
    ctx.set_source_rgb(0.78, 0.06, 0.18)
    ctx.rectangle(-1.6 * r, -0.18 * r, 3.2 * r, 0.36 * r); ctx.rectangle(-0.18 * r, -r, 0.36 * r, 2 * r); ctx.fill()


def flag_fr(ctx, r):
    for i, c in enumerate([(0.0, 0.14, 0.58), (1, 1, 1), (0.93, 0.16, 0.22)]):
        ctx.set_source_rgb(*c)
        ctx.rectangle(-r + i * 2 * r / 3, -r, 2 * r / 3 + 0.5, 2 * r)
        ctx.fill()


def flag_it(ctx, r):
    for i, c in enumerate([(0.0, 0.57, 0.27), (1, 1, 1), (0.81, 0.17, 0.22)]):
        ctx.set_source_rgb(*c)
        ctx.rectangle(-r + i * 2 * r / 3, -r, 2 * r / 3 + 0.5, 2 * r)
        ctx.fill()
    ctx.set_source_rgb(0.81, 0.17, 0.22)
    ctx.rectangle(-0.17 * r, -0.25 * r, 0.34 * r, 0.42 * r); ctx.fill()
    ctx.set_source_rgb(1, 1, 1)
    ctx.rectangle(-0.05 * r, -0.2 * r, 0.1 * r, 0.32 * r); ctx.rectangle(-0.13 * r, -0.08 * r, 0.26 * r, 0.09 * r); ctx.fill()


def flag_am(ctx, r):
    for i, c in enumerate([(0.85, 0.0, 0.07), (0.0, 0.2, 0.63), (0.95, 0.66, 0.0)]):
        ctx.set_source_rgb(*c)
        ctx.rectangle(-r * 1.6, -r + i * 2 * r / 3, 3.2 * r, 2 * r / 3 + 0.5)
        ctx.fill()


FLAGS = dict(tr=flag_tr, gr=flag_gr, uk=flag_uk, fr=flag_fr, it=flag_it, am=flag_am)


def badge(ctx, x, y, flag, r=30, alpha=1.0, pop=1.0, ring=(1, 1, 1)):
    if alpha <= 0.01:
        return
    r = r * pop
    ctx.save()
    ctx.push_group()
    # shadow
    rg = cairo.RadialGradient(x + 2, y + 6, r * 0.6, x + 2, y + 6, r * 1.5)
    rg.add_color_stop_rgba(0, 0, 0, 0, 0.55)
    rg.add_color_stop_rgba(1, 0, 0, 0, 0)
    ctx.set_source(rg)
    ctx.arc(x + 2, y + 6, r * 1.5, 0, 2 * math.pi)
    ctx.fill()
    ctx.save()
    ctx.arc(x, y, r, 0, 2 * math.pi)
    ctx.clip()
    ctx.translate(x, y)
    FLAGS[flag](ctx, r)
    # glossy shading
    lg = cairo.LinearGradient(0, -r, 0, r)
    lg.add_color_stop_rgba(0, 1, 1, 1, 0.22)
    lg.add_color_stop_rgba(0.5, 1, 1, 1, 0.0)
    lg.add_color_stop_rgba(1, 0, 0, 0, 0.3)
    ctx.set_source(lg)
    ctx.paint()
    ctx.restore()
    ctx.set_source_rgba(*ring, 1)
    ctx.set_line_width(max(2.0, r * 0.11))
    ctx.arc(x, y, r, 0, 2 * math.pi)
    ctx.stroke()
    ctx.set_source_rgba(0, 0, 0, 0.5)
    ctx.set_line_width(1.2)
    ctx.arc(x, y, r + max(2.0, r * 0.11) / 2 + 0.6, 0, 2 * math.pi)
    ctx.stroke()
    ctx.pop_group_to_source()
    ctx.paint_with_alpha(alpha)
    ctx.restore()


def pop_curve(u):
    """0..1 -> scale with overshoot"""
    u = clamp(u)
    if u < 0.6:
        return ease_out(u / 0.6) * 1.15
    return 1.15 - 0.15 * smooth((u - 0.6) / 0.4)


# ---------------------------------------------------------------- arrows
def catmull(pts, n=160):
    pts = np.asarray(pts, dtype=np.float64)
    if len(pts) == 2:
        u = np.linspace(0, 1, n)[:, None]
        return pts[0] * (1 - u) + pts[1] * u
    P = np.vstack([pts[0] * 2 - pts[1], pts, pts[-1] * 2 - pts[-2]])
    out = []
    seg = len(pts) - 1
    per = max(8, n // seg)
    for i in range(seg):
        p0, p1, p2, p3 = P[i], P[i + 1], P[i + 2], P[i + 3]
        for tt in np.linspace(0, 1, per, endpoint=(i == seg - 1)):
            t2, t3 = tt * tt, tt * tt * tt
            out.append(0.5 * ((2 * p1) + (-p0 + p2) * tt + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t2 + (-p0 + 3 * p1 - 3 * p2 + p3) * t3))
    return np.array(out)


def arrow(ctx, v, pts_ll, prog, col, width=26, alpha=1.0, tail_fade=True, start=0.0):
    """Tapered animated campaign arrow following lon/lat control points."""
    if prog <= 0.001 or alpha <= 0.01:
        return
    sp = v.Pa(catmull(pts_ll, 220))
    d = np.r_[0, np.cumsum(np.hypot(*np.diff(sp, axis=0).T))]
    L = d[-1]
    if L < 5:
        return
    s0, s1 = L * start, L * prog
    width = width * min(1.0, max(0.55, L / 500))
    headL = width * 1.9
    end_body = max(s0, s1 - headL * 0.85)
    m = (d >= s0) & (d <= end_body)
    if m.sum() < 2:
        idx = np.searchsorted(d, s1)
        idx = max(1, min(idx, len(d) - 1))
        body = sp[max(0, idx - 2):idx + 1]
    else:
        body = sp[m]
    # tip point & direction
    tip = np.array([np.interp(s1, d, sp[:, 0]), np.interp(s1, d, sp[:, 1])])
    base = np.array([np.interp(end_body, d, sp[:, 0]), np.interp(end_body, d, sp[:, 1])])
    body = np.vstack([body, base])
    dirv = tip - base
    nrm = np.hypot(*dirv)
    if nrm < 1e-6:
        return
    dirv /= nrm
    perp = np.array([-dirv[1], dirv[0]])
    n = len(body)
    tang = np.gradient(body, axis=0)
    tl = np.hypot(tang[:, 0], tang[:, 1])[:, None]
    tl[tl == 0] = 1
    tang /= tl
    nor = np.stack([-tang[:, 1], tang[:, 0]], 1)
    u = np.linspace(0, 1, n)[:, None]
    w = (width * (0.35 + 0.65 * u ** 0.7)) / 2
    left = body + nor * w
    right = body - nor * w
    hw = width * 1.15
    poly = np.vstack([left, base + perp * hw, tip, base - perp * hw, right[::-1]])
    ctx.save()
    ctx.push_group()
    # drop shadow
    ctx.translate(4, 7)
    ctx.move_to(*poly[0])
    for p in poly[1:]:
        ctx.line_to(*p)
    ctx.close_path()
    ctx.set_source_rgba(0, 0, 0, 0.35)
    ctx.fill()
    ctx.translate(-4, -7)
    ctx.move_to(*poly[0])
    for p in poly[1:]:
        ctx.line_to(*p)
    ctx.close_path()
    r, g, b = col[:3]
    lg = cairo.LinearGradient(body[0][0], body[0][1], tip[0], tip[1])
    lg.add_color_stop_rgba(0, r, g, b, 0.0 if tail_fade else 0.9)
    lg.add_color_stop_rgba(0.35, r, g, b, 0.85)
    lg.add_color_stop_rgba(1, min(1, r * 1.15 + 0.08), min(1, g * 1.15 + 0.08), min(1, b * 1.15 + 0.08), 1.0)
    ctx.set_source(lg)
    ctx.fill_preserve()
    lg2 = cairo.LinearGradient(body[0][0], body[0][1], tip[0], tip[1])
    lg2.add_color_stop_rgba(0, 1, 1, 1, 0)
    lg2.add_color_stop_rgba(1, 1, 1, 1, 0.9)
    ctx.set_source(lg2)
    ctx.set_line_width(2.2)
    ctx.stroke()
    ctx.pop_group_to_source()
    ctx.paint_with_alpha(alpha)
    ctx.restore()


# ---------------------------------------------------------------- zones
def zone(ctx, v, g, col, alpha=1.0, fill=0.40, edge=True, hatch=False, glow=True, edge_w=2.6, dash=None):
    if g is None or g.is_empty or alpha <= 0.01:
        return
    vb = v.bbox(0.4)
    try:
        g = g.intersection(vb)
    except Exception:
        g = g.buffer(0).intersection(vb)
    if g.is_empty:
        return
    fill = fill * (0.62 + 0.38 * clamp((v.span - 2.0) / 8.0))
    r, gg, b = col[:3]
    ctx.save()
    ctx.push_group()
    ctx.set_fill_rule(cairo.FILL_RULE_EVEN_ODD)
    geom_path(ctx, v, g)
    ctx.set_source_rgba(r, gg, b, fill)
    ctx.fill_preserve()
    ctx.save()
    ctx.clip_preserve()
    if glow:
        for lw, a in [(34, 0.10), (18, 0.16), (8, 0.22)]:
            ctx.set_line_width(lw)
            ctx.set_source_rgba(min(1, r * 1.2 + .1), min(1, gg * 1.2 + .1), min(1, b * 1.2 + .1), a)
            ctx.stroke_preserve()
    if hatch:
        ctx.new_path()
        ctx.set_line_width(2)
        ctx.set_source_rgba(r * 0.5, gg * 0.5, b * 0.5, 0.35)
        for k in range(-H, W + H, 22):
            ctx.move_to(k, 0)
            ctx.line_to(k + H, H)
        ctx.stroke()
        geom_path(ctx, v, g)
    ctx.restore()
    if edge:
        if dash:
            ctx.set_dash(dash)
        ctx.set_line_width(edge_w + 2.4)
        ctx.set_source_rgba(0, 0, 0, 0.35)
        ctx.stroke_preserve()
        ctx.set_line_width(edge_w)
        ctx.set_source_rgba(min(1, r * 1.3 + .15), min(1, gg * 1.3 + .15), min(1, b * 1.3 + .15), 0.95)
        ctx.stroke()
    ctx.new_path()
    ctx.pop_group_to_source()
    ctx.paint_with_alpha(alpha)
    ctx.restore()


def front_poly(pts, west=23.5):
    """front polyline north->south; area west of it."""
    pts = list(pts)
    ring = pts + [(west, pts[-1][1] - 0.5), (west, pts[0][1] + 0.5)]
    p = Polygon(ring)
    if not p.is_valid:
        p = p.buffer(0)
    return p


def east_poly(pts, east=47.5):
    pts = list(pts)
    ring = pts + [(east, pts[-1][1] - 0.3), (east, pts[0][1] + 0.3)]
    p = Polygon(ring)
    if not p.is_valid:
        p = p.buffer(0)
    return p


def interp_keys(keys, t):
    """keys: list (t, pts). Returns interpolated point list."""
    if t <= keys[0][0]:
        return keys[0][1]
    for a, b in zip(keys, keys[1:]):
        if a[0] <= t <= b[0]:
            u = smooth((t - a[0]) / max(1e-6, b[0] - a[0]))
            return [(lerp(p[0], q[0], u), lerp(p[1], q[1], u)) for p, q in zip(a[1], b[1])]
    return keys[-1][1]


# ---------------------------------------------------------------- map furniture
def coast(ctx, v, alpha=1.0):
    vb = v.bbox(0.3)
    g = LAND.intersection(vb)
    ctx.save()
    geom_path(ctx, v, g)
    ctx.set_line_width(1.4)
    ctx.set_source_rgba(0.95, 0.92, 0.82, 0.32 * alpha)
    ctx.stroke()
    ctx.restore()


_BORDERS = None


def borders(ctx, v, alpha=1.0, exclude=('Turkey',)):
    global _BORDERS
    if _BORDERS is None:
        ls = []
        for n, g in G['countries'].items():
            b = g.boundary
            ls.append(b)
        _BORDERS = unary_union(ls).difference(LAND.boundary.buffer(0.02))
    if alpha <= 0.01:
        return
    vb = v.bbox(0.3)
    g = _BORDERS.intersection(vb)
    ctx.save()
    line_path(ctx, v, g)
    ctx.set_dash([7, 6])
    ctx.set_line_width(1.6)
    ctx.set_source_rgba(1, 1, 1, 0.35 * alpha)
    ctx.stroke()
    ctx.restore()


def rivers(ctx, v, names, alpha=1.0):
    if alpha <= 0.01:
        return
    ctx.save()
    for n in names:
        for g in G['rivers'].get(n, []):
            line_path(ctx, v, g)
    ctx.set_line_width(2.6)
    ctx.set_source_rgba(0.45, 0.72, 0.95, 0.75 * alpha)
    ctx.stroke()
    ctx.restore()


def city(ctx, v, name, lon, lat, alpha=1.0, size=30, side='r', capital=False, col=(1, 1, 1), dot=True):
    if alpha <= 0.01:
        return
    x, y = v.P(lon, lat)
    if x < -200 or x > W + 200 or y < -100 or y > H + 100:
        return
    ctx.save()
    if dot:
        if capital:
            ctx.set_source_rgba(0, 0, 0, 0.5 * alpha)
            star_path(ctx, x + 1, y + 2, 15, -math.pi / 2)
            ctx.fill()
            ctx.set_source_rgba(1, 0.85, 0.35, alpha)
            star_path(ctx, x, y, 14, -math.pi / 2)
            ctx.fill_preserve()
            ctx.set_source_rgba(0.3, 0.15, 0, alpha)
            ctx.set_line_width(1.5)
            ctx.stroke()
        else:
            ctx.set_source_rgba(0, 0, 0, 0.55 * alpha)
            ctx.arc(x, y, 8.5, 0, 2 * math.pi)
            ctx.fill()
            ctx.set_source_rgba(1, 1, 1, alpha)
            ctx.arc(x, y, 6, 0, 2 * math.pi)
            ctx.fill()
            ctx.set_source_rgba(0.1, 0.1, 0.1, alpha)
            ctx.arc(x, y, 2.6, 0, 2 * math.pi)
            ctx.fill()
    font(ctx, 'Oswald', size, False)
    w = text_spaced(ctx, name, 0, 0, 1.5, measure=True)
    if side == 'r':
        tx, ty, al = x + 16, y + size * 0.36, 0
    elif side == 'l':
        tx, ty, al = x - 16, y + size * 0.36, 1
    elif side == 'u':
        tx, ty, al = x, y - 16, 0.5
    else:
        tx, ty, al = x, y + size + 10, 0.5
    shadow_text(ctx, name, tx, ty, col, alpha, 1.5, al, sh=0.9)
    ctx.restore()


def region_label(ctx, v, name, lon, lat, alpha=1.0, size=34, col=(1, 1, 1), spacing=6, fam='Cinzel', bold=True, sub=None):
    if alpha <= 0.01:
        return
    x, y = v.P(lon, lat)
    ctx.save()
    font(ctx, fam, size, bold)
    lines = name.split('\n')
    for i, ln in enumerate(lines):
        shadow_text(ctx, ln, x, y + i * size * 1.15, col + (0.92,), alpha, spacing, 0.5, sh=0.9)
    if sub:
        font(ctx, 'Oswald', size * 0.55, False)
        shadow_text(ctx, sub, x, y + len(lines) * size * 1.15 - size * 0.2, (1, 1, 1, 0.85), alpha, 2, 0.5)
    ctx.restore()


def swords(ctx, x, y, s, alpha):
    ctx.save()
    ctx.translate(x, y)
    for ang in (math.pi / 4, -math.pi / 4):
        ctx.save()
        ctx.rotate(ang)
        for col, lw in [((0, 0, 0, 0.6), 7), ((1, 0.95, 0.85, 1), 3.6)]:
            ctx.set_source_rgba(col[0], col[1], col[2], col[3] * alpha)
            ctx.set_line_width(lw * s)
            ctx.move_to(0, -26 * s); ctx.line_to(0, 18 * s); ctx.stroke()
            ctx.move_to(-8 * s, 12 * s); ctx.line_to(8 * s, 12 * s); ctx.stroke()
            ctx.move_to(0, 18 * s); ctx.line_to(0, 26 * s); ctx.stroke()
        ctx.restore()
    ctx.restore()


def battle(ctx, v, lon, lat, t, t0, t1, name=None, sub=None, side='r', seed=0, radius=0.35, flashes=True, size=1.0):
    a = fade(t, t0, t1, 0.5, 0.6)
    if a <= 0.01:
        return
    x, y = v.P(lon, lat)
    lt = t - t0
    ctx.save()
    if flashes:
        rng = random.Random(seed)
        ctx.set_operator(cairo.OPERATOR_ADD)
        rad = radius * v.px_per_deg()
        for i in range(26):
            per = rng.uniform(0.6, 1.6)
            ph = rng.uniform(0, per)
            k = int((lt + ph) / per)
            rr = random.Random(seed * 1000 + i * 37 + k)
            u = ((lt + ph) % per) / per
            if u > 0.35:
                continue
            ang = rr.uniform(0, 2 * math.pi)
            dist = rad * math.sqrt(rr.uniform(0, 1))
            fx, fy = x + math.cos(ang) * dist, y + math.sin(ang) * dist * 0.7
            inten = (1 - u / 0.35) ** 2 * a
            R = 10 + 22 * rr.uniform(0.3, 1)
            rg = cairo.RadialGradient(fx, fy, 0, fx, fy, R)
            rg.add_color_stop_rgba(0, 1, 0.92, 0.7, 0.9 * inten)
            rg.add_color_stop_rgba(0.3, 1, 0.6, 0.2, 0.45 * inten)
            rg.add_color_stop_rgba(1, 1, 0.3, 0.0, 0)
            ctx.set_source(rg)
            ctx.arc(fx, fy, R, 0, 2 * math.pi)
            ctx.fill()
        ctx.set_operator(cairo.OPERATOR_OVER)
    # pulsing rings
    for k in range(2):
        u = ((lt * 0.7 + k * 0.5) % 1.0)
        ctx.set_source_rgba(1, 0.85, 0.5, (1 - u) * 0.7 * a)
        ctx.set_line_width(3)
        ctx.arc(x, y, (30 + 60 * u) * size, 0, 2 * math.pi)
        ctx.stroke()
    pc = pop_curve(lt / 0.5)
    ctx.set_source_rgba(0.08, 0.06, 0.05, 0.75 * a)
    ctx.arc(x, y, 30 * pc * size, 0, 2 * math.pi)
    ctx.fill()
    ctx.set_source_rgba(0.95, 0.75, 0.35, a)
    ctx.set_line_width(2.5)
    ctx.arc(x, y, 30 * pc * size, 0, 2 * math.pi)
    ctx.stroke()
    swords(ctx, x, y, 0.85 * pc * size, a)
    if name:
        font(ctx, 'Oswald', 40, True)
        if side == 'r':
            tx, al = x + 48 * size, 0
        elif side == 'l':
            tx, al = x - 48 * size, 1
        else:
            tx, al = x, 0.5
        ty = y + 12 if side in 'rl' else y - 52 * size
        shadow_text(ctx, name, tx, ty, (1, 0.9, 0.62), a * smooth((lt - 0.2) / 0.5), 2, al, sh=1)
        if sub:
            font(ctx, 'Oswald', 27, False)
            shadow_text(ctx, sub, tx, ty + 36, (1, 1, 1), a * smooth((lt - 0.35) / 0.5), 1.5, al, sh=1)
    ctx.restore()


def route(ctx, v, pts_ll, prog, col=(1, 0.82, 0.35), alpha=1.0, width=4.5, dash=(14, 10), smooth_n=200):
    if prog <= 0.001 or alpha <= 0.01:
        return None
    sp = v.Pa(catmull(pts_ll, smooth_n))
    d = np.r_[0, np.cumsum(np.hypot(*np.diff(sp, axis=0).T))]
    s1 = d[-1] * prog
    m = d <= s1
    pts = sp[m]
    tip = np.array([np.interp(s1, d, sp[:, 0]), np.interp(s1, d, sp[:, 1])])
    pts = np.vstack([pts, tip])
    ctx.save()
    for lw, c in [(width + 4, (0, 0, 0, 0.45)), (width, col + (1,))]:
        ctx.set_dash(dash)
        ctx.set_line_width(lw)
        ctx.set_source_rgba(c[0], c[1], c[2], c[3] * alpha)
        ctx.move_to(*pts[0])
        for p in pts[1:]:
            ctx.line_to(*p)
        ctx.stroke()
    ctx.restore()
    return tip


def glow_dot(ctx, x, y, r, col, alpha):
    rg = cairo.RadialGradient(x, y, 0, x, y, r)
    rg.add_color_stop_rgba(0, col[0], col[1], col[2], alpha)
    rg.add_color_stop_rgba(1, col[0], col[1], col[2], 0)
    ctx.set_source(rg)
    ctx.arc(x, y, r, 0, 2 * math.pi)
    ctx.fill()


def ship(ctx, x, y, ang, s, alpha, col=(0.1, 0.1, 0.12)):
    ctx.save()
    ctx.translate(x, y)
    ctx.rotate(ang)
    ctx.scale(s, s)
    ctx.move_to(-22, -6); ctx.line_to(16, -6); ctx.line_to(26, 0); ctx.line_to(16, 6); ctx.line_to(-22, 6); ctx.close_path()
    ctx.set_source_rgba(0, 0, 0, 0.4 * alpha)
    ctx.save(); ctx.translate(2, 4); ctx.fill_preserve(); ctx.restore()
    ctx.new_path()
    ctx.move_to(-22, -6); ctx.line_to(16, -6); ctx.line_to(26, 0); ctx.line_to(16, 6); ctx.line_to(-22, 6); ctx.close_path()
    ctx.set_source_rgba(col[0], col[1], col[2], alpha)
    ctx.fill_preserve()
    ctx.set_source_rgba(1, 1, 1, 0.8 * alpha)
    ctx.set_line_width(1.5)
    ctx.stroke()
    ctx.rectangle(-8, -3, 10, 6)
    ctx.set_source_rgba(0.85, 0.85, 0.8, alpha)
    ctx.fill()
    ctx.restore()


_TPATH = {}


def focus_mask(v, geom, feather=6):
    surf = cairo.ImageSurface(cairo.FORMAT_A8, W, H)
    ctx = cairo.Context(surf)
    ctx.set_fill_rule(cairo.FILL_RULE_EVEN_ODD)
    geom_path(ctx, v, geom.intersection(v.bbox(0.3)))
    ctx.set_source_rgba(0, 0, 0, 1)
    ctx.fill()
    stride = surf.get_stride()
    m = np.ndarray((H, stride), np.uint8, surf.get_data())[:, :W].astype(np.float32) / 255
    if feather:
        m = cv2.GaussianBlur(m, (0, 0), feather)
    return m
