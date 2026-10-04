#!/usr/bin/env python3
"""
Original score + sound design for the Socialp Media brand film.

Everything is synthesized from scratch (no samples, no licensing), and every
hit is placed on the exact timestamp the picture uses, so cuts, wipes, type
reveals and clicks land frame-accurately.

    python3 scripts/score.py build/score.wav

120 BPM, A minor. Structure (bars of 2 s):
  0–4   intro: drone, typewriter, word hits, riser
  4–42  groove: Am–F–C–G cycle, layers added per section
  42–52 breakdown: FM piano, step bells, long riser
  52–58 drop
  58–64 end: A major resolution + sonic logo
"""
import sys
import numpy as np
from scipy import signal

SR = 48000
DUR = 64.0
N = int(DUR * SR)
BPM = 120
BEAT = 60 / BPM
BAR = 4 * BEAT
S16 = BEAT / 4
rng = np.random.default_rng(2026)


# ----------------------------------------------------------------- basics
def mtof(m):
    return 440.0 * 2 ** ((np.asarray(m, dtype=float) - 69) / 12)


def tt(n):
    return np.arange(n) / SR


def track():
    return np.zeros((2, N))


def place(dst, sig, t0, gain=1.0, pan=0.0):
    """Mix mono or stereo `sig` into stereo `dst` at time t0 (constant-power pan)."""
    i0 = int(round(t0 * SR))
    if sig.ndim == 1:
        l = np.cos((pan + 1) * np.pi / 4) * np.sqrt(2)
        r = np.sin((pan + 1) * np.pi / 4) * np.sqrt(2)
        sig = np.vstack([sig * l, sig * r])
    if i0 < 0:
        sig = sig[:, -i0:]
        i0 = 0
    n = min(sig.shape[1], N - i0)
    if n > 0:
        dst[:, i0:i0 + n] += sig[:, :n] * gain


def env_adsr(n, a, d, s, r, hold=None):
    a, d, r = int(a * SR), int(d * SR), int(r * SR)
    hold = n - a - d - r if hold is None else int(hold * SR)
    hold = max(0, hold)
    e = np.concatenate([
        np.linspace(0, 1, max(a, 1), endpoint=False),
        np.linspace(1, s, max(d, 1), endpoint=False),
        np.full(hold, s),
        np.linspace(s, 0, max(r, 1)),
    ])
    if len(e) < n:
        e = np.pad(e, (0, n - len(e)))
    return e[:n]


def expdec(n, tau):
    return np.exp(-tt(n) / tau)


def saw(freq, n, phase0=None):
    f = np.broadcast_to(np.asarray(freq, dtype=float), (n,))
    dt = f / SR
    ph = ((rng.random() if phase0 is None else phase0) + np.cumsum(dt)) % 1.0
    y = 2 * ph - 1
    m = ph < dt
    x = ph[m] / dt[m]
    y[m] -= x + x - x * x - 1
    m = ph > 1 - dt
    x = (ph[m] - 1) / dt[m]
    y[m] -= x * x + x + x + 1
    return y


def sine(freq, n, phase0=0.0):
    f = np.broadcast_to(np.asarray(freq, dtype=float), (n,))
    return np.sin(2 * np.pi * (phase0 + np.cumsum(f) / SR))


def noise(n):
    return rng.standard_normal(n)


def sos(kind, f, order=2):
    if kind == 'bp':
        return signal.butter(order, f, btype='bandpass', fs=SR, output='sos')
    return signal.butter(order, f, btype=kind, fs=SR, output='sos')


def filt(x, kind, f, order=2):
    return signal.sosfilt(sos(kind, f, order), x, axis=-1)


def sweep(x, kind, f_curve, q=0.9, block=128):
    """Time-varying biquad (RBJ) processed in small blocks with carried state."""
    y = np.zeros_like(x)
    z = np.zeros(2)
    for i in range(0, len(x), block):
        f = float(np.clip(f_curve[min(i, len(f_curve) - 1)], 20, SR * 0.45))
        w0 = 2 * np.pi * f / SR
        alpha = np.sin(w0) / (2 * q)
        c = np.cos(w0)
        if kind == 'lp':
            b = np.array([(1 - c) / 2, 1 - c, (1 - c) / 2])
        elif kind == 'hp':
            b = np.array([(1 + c) / 2, -(1 + c), (1 + c) / 2])
        else:  # band-pass, constant peak gain
            b = np.array([alpha, 0, -alpha])
        a = np.array([1 + alpha, -2 * c, 1 - alpha])
        seg, z = signal.lfilter(b / a[0], a / a[0], x[i:i + block], zi=z)
        y[i:i + block] = seg
    return y


def drive(x, k=1.5):
    return np.tanh(k * x) / np.tanh(k)


def make_ir(sec=3.2, decay=2.6, pre=0.018, bright=7000, seed=3):
    r = np.random.default_rng(seed)
    n = int(sec * SR)
    t = tt(n)
    e = np.exp(-t * 6.9 / decay)
    ch = []
    for k in range(2):
        x = r.standard_normal(n) * e
        lo = filt(x, 'lp', bright * 0.35)
        hi = x - lo
        x = lo + hi * np.exp(-t * 3.0)  # highs die faster
        x = np.concatenate([np.zeros(int(pre * SR)), x])[:n]
        ch.append(x)
    ir = np.vstack(ch)
    return ir / np.sqrt(np.sum(ir ** 2) / 2)


def reverb(x, ir, wet=1.0):
    out = np.vstack([signal.oaconvolve(x[0], ir[0])[:N], signal.oaconvolve(x[1], ir[1])[:N]])
    return out * wet


def delay(x, time, fb=0.35, mix=0.3, pingpong=True):
    d = int(time * SR)
    y = x.copy()
    tap = x.copy()
    for k in range(1, 6):
        tap = np.roll(tap, d, axis=1)
        tap[:, :d] = 0
        tap = filt(tap, 'lp', 5000) * fb
        if pingpong:
            tap = tap[::-1]
        y += tap * mix / fb if k == 1 else tap * mix
    return y


# ----------------------------------------------------------- arrangement
# chords by bar (index = bar number, bar = 2 s)
AM = dict(pad=[57, 64, 71, 72], arp=[69, 72, 76, 81], bass=33)
F_ = dict(pad=[53, 60, 64, 69], arp=[65, 69, 72, 76], bass=29)
C_ = dict(pad=[55, 60, 64, 67], arp=[67, 72, 76, 79], bass=36)
G_ = dict(pad=[55, 59, 62, 67], arp=[67, 71, 74, 79], bass=31)
CYCLE = [AM, F_, C_, G_]
FMAJ7 = dict(pad=[53, 60, 64, 69], bass=29, piano=[53, 57, 64, 67, 72])
G6 = dict(pad=[55, 59, 64, 67], bass=31, piano=[55, 59, 64, 67, 71])
AM9 = dict(pad=[57, 64, 67, 71], bass=33, piano=[57, 60, 64, 67, 71])
ESUS = dict(pad=[52, 57, 59, 64], bass=28, piano=[52, 57, 59, 64, 69])
E_ = dict(pad=[52, 56, 59, 64], bass=28, piano=[52, 56, 59, 64, 68])
AMAJ = dict(pad=[45, 52, 57, 61, 64, 69], bass=33)


def chord_at(bar):
    if bar == 0:
        return AM
    if bar == 1:
        return F_
    if 2 <= bar <= 20:
        return CYCLE[(bar - 2) % 4]
    return {21: FMAJ7, 22: G6, 23: AM9, 24: FMAJ7, 25: ESUS}.get(bar) or {26: AM, 27: F_, 28: C_}.get(bar) or AMAJ


GROOVE = (4.0, 42.0)
DROP = (52.0, 58.0)


def in_groove(t):
    return (GROOVE[0] <= t < GROOVE[1]) or (DROP[0] <= t < DROP[1])


# ------------------------------------------------------------ instruments
def kick(vel=1.0):
    n = int(0.55 * SR)
    t = tt(n)
    f = 44 + 120 * np.exp(-t / 0.032) + 260 * np.exp(-t / 0.0035)
    body = sine(f, n) * np.exp(-t / 0.19) * np.minimum(1, t / 0.0015)
    click = filt(noise(n), 'bp', [1800, 6000]) * np.exp(-t / 0.003) * 0.55
    knock = filt(noise(n), 'bp', [180, 900]) * np.exp(-t / 0.012) * 0.35
    click = click + knock
    return drive((body + click) * vel * 1.1, 2.0) * 0.95


def clap(vel=1.0):
    n = int(0.6 * SR)
    t = tt(n)
    x = noise(n)
    e = np.zeros(n)
    for k, off in enumerate([0, 0.009, 0.018, 0.026]):
        i = int(off * SR)
        e[i:] += np.exp(-(t[: n - i]) / (0.008 if k < 3 else 0.16)) * (0.8 if k < 3 else 1.0)
    y = filt(x * e, 'bp', [900, 5200])
    return y * vel * 0.9


def hat(open_=False, vel=1.0):
    n = int((0.35 if open_ else 0.08) * SR)
    t = tt(n)
    freqs = [205.3, 304.4, 369.6, 522.7, 540.0, 800.0]
    m = sum(np.sign(np.sin(2 * np.pi * f * 2.6 * t + rng.random() * 6)) for f in freqs)
    x = 0.6 * m / 6 + 0.6 * noise(n)
    x = filt(x, 'hp', 7200, 4)
    return x * np.exp(-t / (0.12 if open_ else 0.022)) * vel * 0.55


def shaker(vel=1.0):
    n = int(0.09 * SR)
    t = tt(n)
    e = np.minimum(1, t / 0.012) * np.exp(-t / 0.03)
    return filt(noise(n), 'bp', [5000, 11000]) * e * vel * 0.22


def tom(m, vel=1.0):
    n = int(0.45 * SR)
    t = tt(n)
    f = mtof(m) * (1 + 0.6 * np.exp(-t / 0.03))
    return drive(sine(f, n) * np.exp(-t / 0.18) * vel, 1.3) * 0.7


def snare(vel=1.0):
    n = int(0.3 * SR)
    t = tt(n)
    body = sine(190 * (1 + 0.5 * np.exp(-t / 0.01)), n) * np.exp(-t / 0.06)
    nz = filt(noise(n), 'bp', [1500, 9000]) * np.exp(-t / 0.07)
    return (0.5 * body + 0.8 * nz) * vel * 0.5


def supersaw(notes, dur, voices=5, detune=0.12, cutoff=2200, att=0.35, rel=0.8):
    n = int((dur + rel) * SR)
    out = np.zeros((2, n))
    for m in notes:
        for v in range(voices):
            dv = (v - (voices - 1) / 2) / ((voices - 1) / 2) if voices > 1 else 0
            f = mtof(m) * 2 ** (dv * detune / 12)
            x = saw(f, n)
            pan = dv * 0.8
            out[0] += x * np.cos((pan + 1) * np.pi / 4)
            out[1] += x * np.sin((pan + 1) * np.pi / 4)
    out = filt(out, 'lp', cutoff, 2)
    e = env_adsr(n, att, 0.3, 0.85, rel, hold=dur - att - 0.3)
    return out * e / (len(notes) * voices) * 2.2


def pluck(m, dur=0.22, bright=1.0):
    n = int((dur + 0.25) * SR)
    t = tt(n)
    f = mtof(m)
    x = 0.6 * saw(f, n) + 0.4 * saw(f * 1.004, n)
    lo = filt(x, 'lp', 900)
    hi = x - lo
    y = lo * np.exp(-t / 0.22) + hi * np.exp(-t / (0.045 * bright)) * 0.9
    return y * np.minimum(1, t / 0.002) * 0.45


def fm_piano(m, dur=2.5, vel=1.0):
    n = int((dur + 1.0) * SR)
    t = tt(n)
    f = mtof(m)
    idx = 2.2 * np.exp(-t / 0.35) + 0.25
    mod = np.sin(2 * np.pi * f * t) * idx
    car = np.sin(2 * np.pi * f * t + mod)
    tine = np.sin(2 * np.pi * f * 7.0 * t + np.sin(2 * np.pi * f * t) * 0.8) * np.exp(-t / 0.05) * 0.12
    e = np.exp(-t / 1.6) * np.minimum(1, t / 0.003)
    rel = np.clip((dur - t) / 0.6 + 1, 0, 1)
    return (car + tine) * e * rel * vel * 0.3


def bell(m, vel=1.0, dec=2.2):
    n = int((dec * 2) * SR)
    t = tt(n)
    f = mtof(m)
    idx = 3.0 * np.exp(-t / 0.4) + 0.4
    y = np.sin(2 * np.pi * f * t + np.sin(2 * np.pi * f * 3.5 * t) * idx)
    y += 0.3 * np.sin(2 * np.pi * f * 2.0 * t) * np.exp(-t / 0.6)
    return y * np.exp(-t / dec) * np.minimum(1, t / 0.002) * vel * 0.25


def sub(m, dur, vel=1.0):
    n = int((dur + 0.05) * SR)
    t = tt(n)
    f = mtof(m)
    x = sine(f, n) + 0.3 * sine(2 * f, n) + 0.12 * sine(3 * f, n)
    return drive(x * env_adsr(n, 0.006, 0.05, 0.9, 0.04, hold=dur - 0.06) * vel, 1.2) * 0.55


def reese(m, dur):
    n = int((dur + 0.05) * SR)
    x = saw(mtof(m + 12), n) + saw(mtof(m + 12) * 1.008, n)
    x = filt(x, 'lp', 620, 2)
    return x * env_adsr(n, 0.01, 0.05, 0.9, 0.05, hold=dur - 0.08) * 0.22


# ------------------------------------------------------------------- sfx
def whoosh(dur=0.7, f0=300, f1=3200, f2=700, pan0=-0.7, pan1=0.7, vel=1.0, peak=0.55):
    n = int(dur * SR)
    u = np.linspace(0, 1, n)
    fc = np.where(u < peak, f0 * (f1 / f0) ** (u / peak), f1 * (f2 / f1) ** ((u - peak) / (1 - peak)))
    x = sweep(noise(n), 'bp', fc, q=1.4)
    e = np.where(u < peak, (u / peak) ** 2.2, ((1 - u) / (1 - peak)) ** 1.6)
    y = x * e * vel * 0.9
    pan = pan0 + (pan1 - pan0) * u
    return np.vstack([y * np.cos((pan + 1) * np.pi / 4), y * np.sin((pan + 1) * np.pi / 4)]) * np.sqrt(2)


def riser(dur, f0=200, f1=6000, tone=None, vel=1.0):
    n = int(dur * SR)
    u = np.linspace(0, 1, n)
    fc = f0 * (f1 / f0) ** (u ** 1.3)
    x = sweep(noise(n), 'bp', fc, q=2.0) * 1.2
    if tone is not None:
        fr = mtof(tone) * 2 ** (u ** 1.6 * 1.0)
        tn = saw(fr, n) + saw(fr * 1.01, n)
        x += filt(tn, 'lp', 3000) * 0.18
    e = u ** 2.4
    return x * e * vel * 0.6


def rev_cymbal(dur=1.2, vel=1.0):
    n = int(dur * SR)
    t = tt(n)
    x = filt(noise(n), 'hp', 4500, 2)
    e = np.exp(-(dur - t) / (dur * 0.28))
    return x * e * vel * 0.35


def impact(vel=1.0, tail=2.2, sub_f=52):
    n = int((tail + 0.5) * SR)
    t = tt(n)
    boom = sine(sub_f * (1 + 1.5 * np.exp(-t / 0.05)), n) * np.exp(-t / 0.6) * np.minimum(1, t / 0.002) * 0.6
    thump = filt(noise(n), 'lp', 900) * np.exp(-t / 0.08) * 0.9
    crash = filt(noise(n), 'hp', 3500) * np.exp(-t / (tail * 0.45)) * 0.3
    return drive((boom * 1.1 + thump + crash) * vel, 1.6) * 0.8


def tick(vel=1.0, f=3200):
    n = int(0.03 * SR)
    t = tt(n)
    x = filt(noise(n), 'bp', [f * 0.7, f * 1.4]) * np.exp(-t / 0.004)
    x += np.sin(2 * np.pi * f * 0.8 * t) * np.exp(-t / 0.006) * 0.3
    return x * vel * 0.4


def key(vel=1.0):
    n = int(0.05 * SR)
    t = tt(n)
    x = filt(noise(n), 'bp', [1500, 5500]) * np.exp(-t / 0.006)
    x += sine(2400 + 600 * rng.random(), n) * np.exp(-t / 0.004) * 0.2
    return x * vel * 0.5


def pop(vel=1.0, f0=1300, f1=760):
    n = int(0.09 * SR)
    t = tt(n)
    f = f1 + (f0 - f1) * np.exp(-t / 0.012)
    return sine(f, n) * np.exp(-t / 0.03) * np.minimum(1, t / 0.0008) * vel * 0.35


def mouse_click(vel=1.0):
    out = np.zeros(int(0.15 * SR))
    for off, f, g in [(0.0, 3400, 1.0), (0.075, 2700, 0.6)]:
        n = int(0.02 * SR)
        t = tt(n)
        c = filt(noise(n), 'bp', [f * 0.6, f * 1.5]) * np.exp(-t / 0.0025) * g
        i = int(off * SR)
        out[i:i + n] += c
    return out * vel * 0.8


def shutter(vel=1.0):
    n = int(0.12 * SR)
    t = tt(n)
    a = filt(noise(n), 'bp', [1200, 7000]) * np.exp(-t / 0.006)
    b = np.roll(filt(noise(n), 'bp', [900, 5000]) * np.exp(-t / 0.012) * 0.7, int(0.045 * SR))
    return (a + b) * vel * 0.45


def roll_ticks(dst, t0, dur, n_ticks=22, vel=0.5, f=2600):
    """Odometer: ticks decelerating along an ease-out curve."""
    for k in range(n_ticks):
        u = k / n_ticks
        # inverse of outExpo-like curve → ticks bunch at the start
        tk = t0 + dur * (1 - (1 - u) ** 0.35) ** 2.2 if False else t0 + dur * (u ** 2.3)
        place(dst, tick(vel * (1 - 0.6 * u), f=f * (1 + 0.1 * rng.random())), tk, pan=rng.uniform(-0.2, 0.2))


# ================================================================ BUILD
def build():
    drums = track()
    bass = track()
    music = track()
    keys = track()
    fx = track()
    send = track()  # reverb send

    kicks = []

    # ------------------------------------------------------------ drums
    def groove_bar(b0, layer):
        for beat in range(4):
            tb = b0 + beat * BEAT
            if not in_groove(tb):
                continue
            place(drums, kick(1.0), tb, 0.72)
            kicks.append(tb)
            if layer >= 2 and beat in (1, 3):
                c = clap(1.0)
                place(drums, c, tb, 0.95)
                place(send, c, tb, 0.25)
            # hats
            place(drums, hat(False, 0.9), tb + BEAT / 2, 0.8, pan=0.25)
            if layer >= 3:
                place(drums, hat(True, 0.8), tb + BEAT / 2, 0.45, pan=0.25)
            if layer >= 2:
                for s in (1, 3):
                    place(drums, hat(False, 0.45 + 0.2 * rng.random()), tb + s * S16, 0.6, pan=-0.3)
            if layer >= 4:
                for s in range(4):
                    place(drums, shaker(0.7 if s % 2 else 1.0), tb + s * S16, 0.6, pan=0.45)

    layers = {}
    for b in range(2, 21):
        t0 = b * BAR
        layers[b] = 1 if t0 < 6 else 2 if t0 < 16 else 3 if t0 < 28 else 2 if t0 < 34 else 4
    for b in range(26, 29):
        layers[b] = 4
    for b, ly in layers.items():
        groove_bar(b * BAR, ly)

    # fills
    for k in range(8):  # 39.0 → 40.0 snare build
        place(drums, snare(0.35 + 0.08 * k), 39.0 + k * 0.125, 0.8)
    for k, m in enumerate([50, 47, 45, 43, 50, 47, 45, 43]):  # tom run before the marquee
        place(drums, tom(m, 0.8), 41.0 + k * 0.125, 0.55, pan=-0.4 + 0.1 * k)
    # long snare roll into the drop (accelerating)
    tk = 50.0
    k = 0
    while tk < 51.9:
        place(drums, snare(0.15 + 0.5 * (tk - 50) / 1.9), tk, 0.8, pan=0.1 * np.sin(k))
        step = 0.25 if tk < 50.75 else 0.125 if tk < 51.35 else 0.0625
        tk += step
        k += 1
    # intro heartbeat
    for tb in [0.5, 1.0, 1.5, 2.0, 2.5, 3.0, 3.5]:
        place(drums, kick(0.45), tb, 0.45)
    for s in range(28):  # ticking 16ths in the intro
        tb = 0.5 + s * S16
        place(drums, hat(False, 0.25 + 0.15 * (s % 2 == 0)), tb, 0.5, pan=0.3 * np.sin(s))
    # breakdown clock (soft 8ths)
    for s in range(int((48 - 42) / (BEAT / 2))):
        tb = 42 + s * BEAT / 2
        place(drums, hat(False, 0.25 if s % 2 else 0.35), tb, 0.45, pan=0.35)

    # ------------------------------------------------------------- bass
    for b in range(0, 32):
        t0 = b * BAR
        ch = chord_at(b)
        if t0 >= 58:
            place(bass, sub(ch['bass'], 5.0, 0.9), 58.0, 0.45)
            break
        if 4 <= t0 < 42 or 52 <= t0 < 58:
            # pumping 8ths on the off-beats + reese body
            for e in range(8):
                te = t0 + e * BEAT / 2
                if e % 2 == 1 and in_groove(te):
                    place(bass, sub(ch['bass'], BEAT / 2 - 0.02, 1.0), te, 0.5)
            place(bass, reese(ch['bass'], BAR), t0, 0.95)
        elif t0 < 4:
            place(bass, sub(ch['bass'], BAR, 0.6), t0, 0.35)
        else:  # breakdown: long soft notes
            place(bass, sub(ch['bass'], BAR, 0.55), t0, 0.32)

    # -------------------------------------------------------------- pads
    for b in range(0, 32):
        t0 = b * BAR
        ch = chord_at(b)
        if t0 >= 58:
            p = supersaw(AMAJ['pad'] + [76], 5.6, voices=7, detune=0.14, cutoff=2600, att=0.5, rel=1.0)
            place(music, p, 58.0, 0.9)
            place(send, p, 58.0, 0.5)
            break
        if b == 1:  # intro: F then E for the last beats
            p = supersaw(F_['pad'], 1.0, cutoff=1200, att=0.25, rel=0.3)
            place(music, p, t0, 0.42)
            p = supersaw(E_['pad'], 0.95, cutoff=1500, att=0.15, rel=0.05)
            place(music, p, t0 + 1.0, 0.42)
            place(send, p, t0 + 1.0, 0.3)
            continue
        cutoff = 1400 if t0 < 4 else 2800 if t0 < 16 else 3600 if t0 < 42 else 2000 if t0 < 52 else 4200
        p = supersaw(ch['pad'], BAR - 0.05, cutoff=cutoff, att=0.6 if t0 < 4 else 0.12, rel=0.25)
        g = 0.75 if t0 < 4 else 0.62 if t0 < 42 else 0.55 if t0 < 52 else 0.75
        place(music, p, t0, g)
        place(send, p, t0, 0.25)

    # strings layer (services, production, drop)
    for b in range(0, 32):
        t0 = b * BAR
        if (16 <= t0 < 28) or (34 <= t0 < 42) or (52 <= t0 < 58):
            ch = chord_at(b)
            s = supersaw([n + 12 for n in ch['pad'][1:]], BAR - 0.05, voices=3, detune=0.08, cutoff=3800, att=0.4, rel=0.35)
            place(music, s, t0, 0.34)
            place(send, s, t0, 0.3)

    # arp (16ths) with ping-pong delay
    arp = track()
    pat = [0, 2, 1, 3, 2, 0, 3, 1, 0, 2, 1, 3, 2, 3, 1, 2]
    for b in range(2, 29):
        t0 = b * BAR
        if 42 <= t0 < 52:
            continue
        ch = chord_at(b)
        for s in range(16):
            ts = t0 + s * S16
            if not in_groove(ts):
                continue
            bright = 0.6 if ts < 8 else 1.0 if ts < 28 else 0.7 if ts < 34 else 1.2
            v = 0.8 if s % 4 == 0 else 0.55
            place(arp, pluck(ch['arp'][pat[s]], bright=bright) * v, ts, 0.9, pan=0.35 * np.sin(s * 1.3))
    arp = delay(arp, BEAT * 0.75, fb=0.3, mix=0.28)
    music += arp
    send += arp * 0.15

    # drop stabs on the off-beats
    for b in range(26, 29):
        t0 = b * BAR
        ch = chord_at(b)
        for e in [1.5, 3.5]:
            st = supersaw([n + 12 for n in ch['pad']], 0.18, voices=5, detune=0.18, cutoff=5200, att=0.004, rel=0.2)
            place(music, st, t0 + e * BEAT, 0.3)
            place(send, st, t0 + e * BEAT, 0.35)

    # breakdown FM piano
    for b in range(21, 26):
        t0 = b * BAR
        ch = chord_at(b)
        pnotes = ch['piano']
        for i, m in enumerate(pnotes):
            place(keys, fm_piano(m, 1.9, 0.8), t0 + i * 0.018, 0.55, pan=-0.5 + i * 0.25)
        # answer phrase on beat 3
        top = pnotes[-1]
        for i, m in enumerate([top + 3 if b != 25 else top, top + 7 - 12 + 12]):
            place(keys, fm_piano(m, 0.6, 0.45), t0 + 2 * BEAT + i * BEAT * 0.5, 0.5, pan=0.3)
        if b == 25:  # E major turn on the second half
            for i, m in enumerate(E_['piano']):
                place(keys, fm_piano(m, 0.9, 0.7), t0 + 1.0 + i * 0.015, 0.5, pan=-0.5 + i * 0.25)
    send += keys * 0.5
    music += keys

    # ----------------------------------------------------------- sound design
    # intro
    for i in range(30):  # typewriter: 0.35 + i*0.03
        place(fx, key(0.5 + 0.3 * rng.random()), 0.35 + i * 0.03, 0.55, pan=rng.uniform(-0.15, 0.15))
    place(fx, whoosh(0.35, 400, 5000, 2000, -0.2, 0.2, 0.7, peak=0.85), 1.12, 0.5)  # shutter opens 1.42
    for i, tw in enumerate([1.5, 2.0, 2.5, 3.0]):
        hit = impact(0.45 + 0.1 * i, tail=0.7, sub_f=60)
        place(fx, hit, tw, 0.55)
        place(send, hit, tw, 0.2)
    for k in range(8):  # image cuts every 16th-pair
        place(fx, shutter(0.6), 1.5 + k * 0.25, 0.35, pan=rng.uniform(-0.3, 0.3))
    place(fx, riser(2.0, 250, 9000, tone=57, vel=1.0), 1.95, 0.65)
    place(fx, rev_cymbal(1.3), 2.7, 0.8)
    place(fx, whoosh(0.6, 200, 2600, 600, 0.0, 0.0, 1.0, peak=0.92), 3.42, 0.55)

    # big hits
    for t_hit, v in [(4.0, 1.0), (16.0, 0.75), (52.0, 1.1), (58.0, 0.9)]:
        im = impact(v, tail=2.6)
        place(fx, im, t_hit, 0.85)
        place(send, im, t_hit, 0.35)

    # hero → stats
    place(fx, riser(0.9, 400, 7000, vel=0.5), 8.75, 0.4)
    place(fx, whoosh(0.9, 250, 3800, 500, -0.6, 0.6, 1.0, peak=0.6), 9.3, 0.6)
    # odometers + logo pops
    for i in range(3):
        roll_ticks(fx, 10.45 + i * 0.25, 1.1, n_ticks=18, vel=0.55)
    for i in range(6):
        place(fx, pop(0.55, 1200 + 80 * i, 700 + 40 * i), 13.15 + i * 0.09 + 0.15, 0.45, pan=-0.4 + 0.16 * i)
    place(fx, whoosh(0.5, 300, 2400, 900, 0.0, -0.3, 0.6, peak=0.5), 12.45, 0.35)
    # card rises, opens
    place(fx, whoosh(0.55, 200, 2600, 1200, 0.5, 0.3, 0.7, peak=0.4), 15.05, 0.45)
    place(fx, whoosh(0.6, 300, 4200, 400, 0.4, -0.4, 1.0, peak=0.7), 15.5, 0.55)
    place(fx, rev_cymbal(0.7, 0.6), 15.3, 0.6)
    # service match-cuts
    for tc in (20.0, 24.0):
        place(fx, whoosh(0.5, 400, 4500, 900, -0.5, 0.5, 0.8, peak=0.82), tc - 0.42, 0.45)
        place(fx, rev_cymbal(0.6, 0.6), tc - 0.6, 0.5)
        hit = impact(0.5, tail=1.2, sub_f=58)
        place(fx, hit, tc, 0.5)
        place(send, hit, tc, 0.25)
    for tc in (16.4, 20.4, 24.4):  # chips cascade
        for j in range(6):
            place(fx, pop(0.25, 1600, 1100), tc + j * 0.07, 0.25, pan=-0.5 + 0.2 * j)
    # push to the project
    place(fx, whoosh(0.75, 250, 3800, 600, 0.7, -0.7, 1.0, peak=0.55), 27.35, 0.6)
    place(fx, whoosh(0.8, 180, 1800, 400, 0.3, 0.0, 0.6, peak=0.35), 27.85, 0.35)
    # shutter bars
    for i in range(6):
        place(fx, whoosh(0.32, 500, 5200, 1500, -0.6 + 0.24 * i, -0.6 + 0.24 * i, 0.45, peak=0.7), 33.3 + i * 0.045, 0.3)
    place(fx, impact(0.4, tail=0.8), 33.95, 0.45)
    # production
    place(fx, whoosh(0.9, 200, 3000, 500, 0.6, -0.2, 0.9, peak=0.5), 36.45, 0.5)
    place(fx, impact(0.45, tail=1.4, sub_f=55), 37.8, 0.4)
    for p in range(3):
        for k in range(4):
            tcut = 40.0 + p * 0.125 + k * 0.5
            if tcut < 41.9:
                place(fx, shutter(0.8), tcut, 0.35, pan=-0.5 + 0.5 * p)
    place(fx, whoosh(0.7, 300, 5000, 800, -0.8, 0.8, 1.1, peak=0.45), 41.15, 0.6)
    place(fx, whoosh(0.7, 250, 4200, 700, 0.8, -0.8, 1.0, peak=0.5), 41.25, 0.5)
    place(fx, whoosh(0.7, 2000, 6000, 300, 0.0, 0.0, 0.7, peak=0.3), 42.3, 0.4)
    # process steps: bells climbing the chord
    for i, m in enumerate([76, 79, 81, 84]):
        b_ = bell(m, 0.7)
        place(keys, b_, 43.0 + i * 1.0, 0.0)
        place(fx, b_, 43.0 + i * 1.0, 0.4, pan=-0.45 + 0.3 * i)
        place(send, b_, 43.0 + i * 1.0, 0.45)
    # circle wipe → testimonial
    place(fx, whoosh(0.8, 200, 3500, 600, 0.6, -0.1, 0.9, peak=0.7), 47.2, 0.55)
    place(fx, pop(0.4), 49.25, 0.35)
    # long riser into the drop + breath
    place(fx, riser(2.6, 150, 11000, tone=52, vel=1.0), 49.35, 0.75)
    place(fx, rev_cymbal(1.6, 0.9), 50.35, 0.7)
    # CTA buttons, cursor, click
    for i in range(3):
        place(fx, pop(0.5, 1100 + 120 * i, 650 + 60 * i), 54.0 + i * 0.1, 0.45, pan=-0.3 + 0.3 * i)
    place(fx, whoosh(1.0, 300, 1400, 600, 0.6, 0.1, 0.25, peak=0.5), 54.85, 0.25)
    place(fx, pop(0.25, 900, 700), 55.8, 0.3)
    place(fx, mouse_click(1.0), 56.32, 0.6)
    place(fx, whoosh(0.9, 200, 3800, 500, 0.0, 0.0, 1.0, peak=0.75), 56.6, 0.6)
    place(fx, riser(1.3, 300, 8000, vel=0.6), 56.7, 0.4)
    place(fx, rev_cymbal(0.9, 0.7), 57.1, 0.6)
    # sonic logo
    for tl, m, v in [(57.92, 76, 0.9), (58.04, 81, 0.9), (58.7, 85, 0.7), (59.4, 88, 0.45)]:
        b_ = bell(m, v, dec=2.8)
        place(fx, b_, tl, 0.55, pan=0.0)
        place(send, b_, tl, 0.6)

    # ------------------------------------------------------- sidechain duck
    duck = np.ones(N)
    for tk in kicks:
        i0 = int(tk * SR)
        n = int(0.32 * SR)
        u = np.linspace(0, 1, n)
        g = 1 - 0.62 * (1 - u) ** 2.2
        seg = duck[i0:i0 + n]
        duck[i0:i0 + n] = np.minimum(seg, g[: len(seg)])
    bass *= duck
    music *= 0.35 + 0.65 * duck

    # widen the music bus (mid/side, sides above 250 Hz only)
    m_, s_ = (music[0] + music[1]) / 2, (music[0] - music[1]) / 2
    s_ = filt(s_, 'hp', 250, 2) * 2.0 + (s_ - filt(s_, 'hp', 250, 2)) * 0.5
    music = np.vstack([m_ + s_, m_ - s_])
    # Haas-style width on the arp/pad bus
    hd = int(0.011 * SR)
    music[1] = 0.8 * music[1] + 0.2 * np.concatenate([np.zeros(hd), music[1][:-hd]])

    # --------------------------------------------------------------- reverb
    ir = make_ir()
    wet = reverb(send, ir, 0.32)

    mix = drums * 0.95 + bass * 0.75 + music * 0.85 + fx * 0.9 + wet

    # silence gaps right before the two drops (tension)
    for a, b in [(3.93, 4.0), (51.93, 52.0)]:
        i0, i1 = int(a * SR), int(b * SR)
        ramp = int(0.006 * SR)
        g = np.ones(N)
        g[i0:i1] = 0.0
        g[i0 - ramp:i0] = np.linspace(1, 0, ramp)
        mix *= g[None, :]
        # keep reverb tails of the hits alive a little
    # final fade with the picture
    fade = np.ones(N)
    f0 = int(61.5 * SR)
    fade[f0:] = np.linspace(1, 0, N - f0) ** 1.6
    mix *= fade
    fin = int(0.01 * SR)
    mix[:, :fin] *= np.linspace(0, 1, fin)

    # ----------------------------------------------------- bus processing
    mix = filt(mix, 'hp', 28, 2)  # clean rumble
    lows = filt(mix, 'lp', 90, 2)
    mix = mix - 0.3 * lows  # ~-3 dB low shelf so the sub does not eat the headroom
    # glue compressor (RMS, 4:1 above threshold, 10 ms / 120 ms)
    lvl = np.sqrt(filt((mix ** 2).mean(axis=0), 'lp', 12, 1).clip(1e-12))
    db = 20 * np.log10(lvl)
    thr, ratio = -16.0, 3.0
    gr = np.where(db > thr, (thr - db) * (1 - 1 / ratio), 0.0)
    gr = filt(gr, 'lp', 8, 1)
    mix *= (10 ** (gr / 20))[None, :]
    # soft limiter
    peak = np.max(np.abs(mix))
    mix = mix / peak * 1.25
    mix = np.tanh(mix) * 0.95
    return mix.astype(np.float32)


def write_wav(path, x):
    import wave
    y = np.clip(x, -1, 1)
    pcm = (y.T * 32767).astype('<i2').tobytes()
    with wave.open(path, 'wb') as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(pcm)


if __name__ == '__main__':
    out = sys.argv[1] if len(sys.argv) > 1 else 'build/score.wav'
    mix = build()
    write_wav(out, mix)
    print('wrote', out, mix.shape, 'peak', float(np.max(np.abs(mix))))
