"""
VELMO film — original score and sound design, synthesised from scratch with
numpy/scipy (no samples, no licences to worry about).

    python3 music.py out/velmo-mix.wav

120 BPM in F major, 32 s = 16 bars; every hit is placed on the film's cue
times (see film.js). Sections:
  bars 1–2   intro: pad swell, letters as marimba notes, bell on the leaf
  bars 3–4   the hassle: muffled minor pad, ticking pulse, riser
  bars 5–14  the groove: kick/clap/shaker, bass, marimba arpeggios, bell hook
  bars 15–16 end card: final chord, sparkle, tail
"""
import sys

import numpy as np
from scipy import signal
from scipy.io import wavfile

SR = 48000
LEN = 32.0
N = int(SR * (LEN + 0.5))
BEAT = 0.5
BAR = 2.0
rng = np.random.default_rng(7)


def mtof(m):
    return 440.0 * 2 ** ((m - 69) / 12)


class Bus:
    def __init__(self):
        self.x = np.zeros((2, N))

    def add(self, sig, t0, gain=1.0, pan=0.0):
        """Mono or stereo signal at t0 seconds; pan −1…1 (equal power)."""
        i0 = int(round(t0 * SR))
        if i0 >= N:
            return
        if sig.ndim == 1:
            a = (pan + 1) * np.pi / 4
            sig = np.vstack([sig * np.cos(a), sig * np.sin(a)]) * np.sqrt(2)
        if i0 < 0:
            sig = sig[:, -i0:]
            i0 = 0
        n = min(sig.shape[1], N - i0)
        self.x[:, i0:i0 + n] += sig[:, :n] * gain


def env_adsr(n, a, d, s, r, hold):
    """Attack/decay/sustain for `hold` seconds, then release; n samples total."""
    t = np.arange(n) / SR
    e = np.where(t < a, t / max(a, 1e-4), s + (1 - s) * np.exp(-(t - a) / max(d, 1e-4)))
    rel = t > hold
    e[rel] *= np.exp(-(t[rel] - hold) / max(r, 1e-4))
    return e


def lp(x, f, order=2):
    return signal.sosfilt(signal.butter(order, f, 'low', fs=SR, output='sos'), x)


def hp(x, f, order=2):
    return signal.sosfilt(signal.butter(order, f, 'high', fs=SR, output='sos'), x)


def bp(x, lo, hi, order=2):
    return signal.sosfilt(signal.butter(order, [lo, hi], 'band', fs=SR, output='sos'), x)


# ── instruments ──────────────────────────────────────────────────────────
def pad_note(m, dur, cutoff, att=0.5, rel=1.2):
    """Warm detuned-saw pad, band-limited additively, 'filtered' per harmonic."""
    n = int((dur + rel * 3) * SR)
    t = np.arange(n) / SR
    out = np.zeros(n)
    f0 = mtof(m)
    for det, ph in ((-0.09, 0.0), (0.0, 1.3), (0.08, 2.1)):
        f = f0 * 2 ** (det / 12)
        vib = 1 + 0.0025 * np.sin(2 * np.pi * (4.6 + det * 10) * t + ph)
        phase = 2 * np.pi * f * np.cumsum(vib) / SR
        for h in range(1, 24):
            fh = f * h
            if fh > SR / 2.4:
                break
            g = (1 / h) / np.sqrt(1 + (fh / cutoff) ** 4)
            if g < 0.002:
                break
            out += g * np.sin(h * phase + ph * h)
    out *= env_adsr(n, att, 0.8, 0.8, rel, dur)
    return out / 3


def marimba(m, vel=1.0, dur=0.9):
    n = int(dur * SR)
    t = np.arange(n) / SR
    f = mtof(m)
    s = (np.sin(2 * np.pi * f * t) * np.exp(-t / 0.42)
         + 0.32 * np.sin(2 * np.pi * f * 3.93 * t) * np.exp(-t / 0.07)
         + 0.1 * np.sin(2 * np.pi * f * 9.24 * t) * np.exp(-t / 0.025))
    s *= np.minimum(1, t / 0.0015)
    click = lp(rng.standard_normal(n) * np.exp(-t / 0.004), 3000) * 0.25
    return (s + click) * vel


def bell(m, vel=1.0, dur=2.6, index=2.4):
    """FM bell/celesta."""
    n = int(dur * SR)
    t = np.arange(n) / SR
    f = mtof(m)
    idx = index * np.exp(-t / 0.35)
    s = np.sin(2 * np.pi * f * t + idx * np.sin(2 * np.pi * f * 3.5 * t))
    s += 0.25 * np.sin(2 * np.pi * f * 2.76 * t) * np.exp(-t / 0.4)
    s *= np.exp(-t / 0.9) * np.minimum(1, t / 0.002)
    return s * vel * 0.6


def pluck_bass(m, dur, vel=1.0):
    n = int((dur + 0.15) * SR)
    t = np.arange(n) / SR
    f = mtof(m)
    s = np.sin(2 * np.pi * f * t) + 0.35 * np.sin(4 * np.pi * f * t) * np.exp(-t / 0.2) + 0.12 * np.sin(6 * np.pi * f * t) * np.exp(-t / 0.08)
    s = np.tanh(1.6 * s) / np.tanh(1.6)
    e = np.minimum(1, t / 0.006) * np.where(t < dur, np.exp(-t / 0.9), np.exp(-dur / 0.9) * np.exp(-(t - dur) / 0.04))
    return s * e * vel


def kick(vel=1.0):
    n = int(0.45 * SR)
    t = np.arange(n) / SR
    f = 46 + 110 * np.exp(-t / 0.028)
    s = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 0.2)
    s += lp(rng.standard_normal(n), 4000) * np.exp(-t / 0.003) * 0.25
    return np.tanh(1.4 * s) * vel


def clap(vel=1.0):
    n = int(0.4 * SR)
    t = np.arange(n) / SR
    noise = rng.standard_normal(n)
    e = np.zeros(n)
    for d in (0, 0.011, 0.022):
        tt = t - d
        e += np.where(tt >= 0, np.exp(-np.maximum(tt, 0) / 0.006), 0)
    e += np.where(t >= 0.03, np.exp(-np.maximum(t - 0.03, 0) / 0.11), 0) * 0.6
    return bp(noise * e, 900, 2600) * vel * 0.9


def shaker(vel=1.0):
    n = int(0.08 * SR)
    t = np.arange(n) / SR
    e = np.minimum(1, t / 0.008) * np.exp(-t / 0.022)
    return hp(rng.standard_normal(n), 6500) * e * vel * 0.5


def hat(vel=1.0, open_=False):
    n = int((0.3 if open_ else 0.06) * SR)
    t = np.arange(n) / SR
    e = np.exp(-t / (0.09 if open_ else 0.015))
    return hp(rng.standard_normal(n), 8000) * e * vel * 0.45


# ── sound design ─────────────────────────────────────────────────────────
def whoosh(dur, f0, f1, peak=0.6, width=0.6, stereo=(-0.6, 0.6)):
    """Band of noise whose centre glides f0→f1; swells to `peak` of its length."""
    n = int(dur * SR)
    x = rng.standard_normal(n)
    f, tt, Z = signal.stft(x, SR, nperseg=2048, noverlap=1536)
    pos = np.clip(tt / dur, 0, 1)
    centre = f0 * (f1 / f0) ** pos
    mask = np.exp(-0.5 * (np.log2(np.maximum(f[:, None], 1) / centre[None, :]) / width) ** 2)
    _, y = signal.istft(Z * mask, SR, nperseg=2048, noverlap=1536)
    y = y[:n]
    tn = np.arange(len(y)) / SR / dur
    e = np.where(tn < peak, np.sin(np.pi / 2 * tn / peak) ** 2, np.cos(np.pi / 2 * (tn - peak) / (1 - peak)) ** 2)
    y = y * e
    y /= np.max(np.abs(y)) + 1e-9
    pan = np.linspace(stereo[0], stereo[1], len(y))
    a = (pan + 1) * np.pi / 4
    return np.vstack([y * np.cos(a), y * np.sin(a)]) * np.sqrt(2)


def plop(f0=380, f1=1100, dur=0.09):
    n = int((dur + 0.05) * SR)
    t = np.arange(n) / SR
    f = f0 + (f1 - f0) * (1 - np.exp(-t / (dur / 2.5)))
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / (dur / 2)) * np.minimum(1, t / 0.002)


def thud(f=80):
    n = int(0.3 * SR)
    t = np.arange(n) / SR
    s = np.sin(2 * np.pi * f * t * (1 - 0.3 * t)) * np.exp(-t / 0.07)
    s += lp(rng.standard_normal(n), 500) * np.exp(-t / 0.03) * 0.6
    return s


def tick(f=3200, dur=0.02):
    n = int(dur * SR)
    t = np.arange(n) / SR
    return (np.sin(2 * np.pi * f * t) * np.exp(-t / 0.004) + hp(rng.standard_normal(n), 3000) * np.exp(-t / 0.0015) * 0.5)


def swish(dur=0.22):
    return whoosh(dur, 4500, 1500, peak=0.25, width=0.7, stereo=(-0.4, 0.4))


def sparkle(dur=0.7, count=14, lo=2600, hi=7000):
    n = int((dur + 0.6) * SR)
    out = np.zeros(n)
    for i in range(count):
        t0 = (i / count) * dur * (0.6 + 0.4 * rng.random())
        f = rng.uniform(lo, hi)
        m = int(0.5 * SR)
        t = np.arange(m) / SR
        s = np.sin(2 * np.pi * f * t) * np.exp(-t / 0.08) * (0.4 + 0.6 * rng.random())
        i0 = int(t0 * SR)
        out[i0:i0 + m] += s[: n - i0]
    return out / count * 3


def boom():
    n = int(1.6 * SR)
    t = np.arange(n) / SR
    s = np.sin(2 * np.pi * np.cumsum(38 + 60 * np.exp(-t / 0.06)) / SR) * np.exp(-t / 0.55)
    s += lp(rng.standard_normal(n), 1800) * np.exp(-t / 0.25) * 0.35
    return s


def riser(dur=1.0):
    w = whoosh(dur, 300, 7000, peak=0.97, width=0.5, stereo=(0, 0))
    n = w.shape[1]
    t = np.arange(n) / SR
    g = np.sin(2 * np.pi * np.cumsum(220 * 2 ** (2 * t / dur)) / SR) * (t / dur) ** 2 * 0.25
    return w + g


# ── score ───────────────────────────────────────────────────────────────
music = Bus()
drums = Bus()
sfx = Bus()
send = Bus()  # reverb send

CH = {
    'Fmaj9': [53, 57, 60, 64, 67], 'Fmaj7': [53, 57, 60, 64], 'Am7': [57, 60, 64, 67], 'Bbmaj7': [58, 62, 65, 69],
    'C6': [60, 64, 67, 69], 'Csus': [60, 65, 67, 70], 'Dm9': [50, 57, 60, 64, 65], 'Dm7': [62, 65, 69, 72],
}
ROOT = {'Fmaj9': 41, 'Fmaj7': 41, 'Am7': 45, 'Bbmaj7': 46, 'C6': 36, 'Csus': 36, 'Dm9': 38, 'Dm7': 38}
ARP = {  # marimba chord tones around C5
    'Fmaj7': [65, 69, 72, 76], 'Am7': [64, 69, 72, 76], 'Bbmaj7': [65, 70, 74, 77], 'C6': [67, 69, 72, 76],
    'Dm7': [65, 69, 72, 74], 'Fmaj9': [65, 69, 72, 79],
}

# intro + hassle pads
for m in CH['Fmaj9']:
    music.add(pad_note(m, 3.7, 1600, att=1.2, rel=0.5), 0.0, 0.18)
for chord, t0, dur in (('Dm9', 4.0, 2.0), ('Bbmaj7', 6.0, 1.0), ('Csus', 7.0, 1.0)):
    for m in CH[chord]:
        music.add(pad_note(m - 12 if m > 64 else m, dur, 650, att=0.25, rel=0.3), t0, 0.2)
    music.add(pluck_bass(ROOT[chord], dur * 0.9, 0.5), t0, 0.35)

# the letters of the logo as rising marimba notes, the leaf as a bell
for i, m in enumerate((65, 69, 72, 76, 79)):
    music.add(marimba(m, 0.6), 0.42 + i * 0.075, 0.32, pan=-0.4 + i * 0.2)
    send.add(marimba(m, 0.6), 0.42 + i * 0.075, 0.25)
for i, m in enumerate((84, 88, 91)):
    music.add(bell(m, 0.5), 1.2 + i * 0.06, 0.3, pan=0.2)
    send.add(bell(m, 0.5), 1.2 + i * 0.06, 0.4)
# tagline: soft descending bells
for i, m in enumerate((81, 79, 77, 72)):
    music.add(bell(m, 0.32, index=1.4), 1.6 + i * 0.12, 0.25, pan=0.3 - i * 0.2)
    send.add(bell(m, 0.32, index=1.4), 1.6 + i * 0.12, 0.3)

# hassle: muted ticking pulse on eighths
for i in range(16):
    t0 = 4.0 + i * 0.25
    if t0 >= 7.75:
        break
    m = 50 if i % 4 == 0 else 57
    music.add(lp(marimba(m, 0.7, 0.3), 1200), t0, 0.22 if i % 2 == 0 else 0.13, pan=-0.2 if i % 2 else 0.2)

# groove (bars 5–14)
PROG = ['Fmaj7', 'Am7', 'Bbmaj7', 'C6', 'Fmaj7', 'Am7', 'Bbmaj7', 'C6', 'Dm7', 'Bbmaj7']
kicks = []
for b, chord in enumerate(PROG):
    t0 = 8.0 + b * BAR
    pad_chord = CH.get(chord, CH['Fmaj7'])
    if chord == 'Bbmaj7' and b == 9:  # last bar: Bb then C
        for m in CH['Bbmaj7']:
            music.add(pad_note(m, 0.95, 2400, att=0.05, rel=0.2), t0, 0.15)
        for m in CH['C6']:
            music.add(pad_note(m, 0.95, 2600, att=0.05, rel=0.2), t0 + 1.0, 0.15)
    else:
        for m in pad_chord:
            music.add(pad_note(m, BAR - 0.05, 2400, att=0.05, rel=0.25), t0, 0.15)
    # bass: 1, and-of-2, 3, and-of-4 (pushes into the next bar)
    roots = [ROOT[chord]] * 4 if not (chord == 'Bbmaj7' and b == 9) else [ROOT['Bbmaj7']] * 2 + [ROOT['C6']] * 2
    for (e8, dur), r in zip(((0, 0.6), (3, 0.2), (4, 0.6), (7, 0.2)), roots):
        music.add(pluck_bass(r + 12 if r < 36 else r, dur, 0.9), t0 + e8 * 0.25, 0.42)
    # marimba arpeggio
    tones = ARP.get(chord, ARP['Fmaj7'])
    pattern = [0, 2, 1, 3, 2, 1, 3, 2]
    for e8, idx in enumerate(pattern):
        tt = t0 + e8 * 0.25
        if b == 9 and e8 >= 4:
            tones = ARP['C6']
        vel = 0.75 if e8 % 4 == 0 else 0.5
        music.add(marimba(tones[idx], vel), tt, 0.2, pan=0.35 if e8 % 2 else -0.35)
        send.add(marimba(tones[idx], vel), tt, 0.08)
    # drums
    for beat in range(4):
        tb = t0 + beat * BEAT
        if beat in (0, 2):
            drums.add(kick(1.0), tb, 0.85)
            kicks.append(tb)
        if beat in (1, 3):
            drums.add(clap(0.9), tb, 0.32, pan=0.05)
            send.add(clap(0.9)[None, :].repeat(2, 0), tb, 0.12)
        for s16 in range(4):
            acc = (0.45, 0.22, 0.8, 0.3)[s16]
            drums.add(shaker(acc), tb + s16 * 0.125 + (0.012 if s16 % 2 else 0), 0.22, pan=0.45)
        if b >= 5:
            drums.add(hat(0.6, open_=True), tb + 0.25, 0.14, pan=-0.35)
    if b % 4 == 3 or b == 9:  # ghost kick into the next bar
        drums.add(kick(0.6), t0 + 1.75, 0.6)
        kicks.append(t0 + 1.75)

# bell hook over bars 5–8 and 9–12
HOOK = [[(0, 84), (2, 81), (3, 84), (6, 79)], [(0, 76), (3, 79), (4, 81)], [(0, 77), (2, 74), (3, 77), (6, 81)], [(0, 79), (4, 76)]]
for rep in (0, 1):
    for b, notes in enumerate(HOOK):
        for e8, m in notes:
            tt = 8.0 + (rep * 4 + b) * BAR + e8 * 0.25
            music.add(bell(m, 0.55, index=1.8), tt, 0.16, pan=0.15)
            send.add(bell(m, 0.55, index=1.8), tt, 0.22)

# a glittering run for each scent
for t0, base in ((22.0, 77), (24.0, 79), (26.0, 81)):
    for i, d in enumerate((0, 4, 7, 12, 16)):
        music.add(bell(base + d, 0.4, index=1.2), t0 + i * 0.0625, 0.14, pan=-0.5 + i * 0.25)
        send.add(bell(base + d, 0.4, index=1.2), t0 + i * 0.0625, 0.2)

# end card: final chord
for m in CH['Fmaj9'] + [72, 76]:
    music.add(pad_note(m, 3.0, 2200, att=0.02, rel=0.9), 28.0, 0.15)
    send.add(pad_note(m, 3.0, 2200, att=0.02, rel=0.9), 28.0, 0.08)
music.add(pluck_bass(41, 2.5, 1.0), 28.0, 0.45)
drums.add(kick(1.0), 28.0, 0.9)
kicks.append(28.0)
for i, m in enumerate((77, 81, 84, 88)):
    music.add(bell(m, 0.5), 28.0 + i * 0.09, 0.2, pan=-0.3 + i * 0.2)
    send.add(bell(m, 0.5), 28.0 + i * 0.09, 0.35)
for i, m in enumerate((84, 88, 91)):  # the leaf again
    music.add(bell(m, 0.45), 28.75 + i * 0.06, 0.22, pan=0.25)
    send.add(bell(m, 0.45), 28.75 + i * 0.06, 0.35)
music.add(marimba(84, 0.8), 29.2, 0.3)  # CTA
send.add(marimba(84, 0.8), 29.2, 0.25)

# sidechain-style pumping on the music bus during the groove
duck = np.ones(N)
tt = np.arange(N) / SR
for kt in kicks:
    i0 = int(kt * SR)
    seg = tt[i0:] - kt
    duck[i0:] *= 1 - 0.32 * np.exp(-seg / 0.11)
music.x *= duck

# section dynamics: an airy intro, a muted hassle, then the drop opens up
auto = np.interp(np.arange(N) / SR, [0, 3.3, 4.0, 7.85, 8.0, LEN + 1], [0.58, 0.6, 0.7, 0.72, 1.0, 1.0])
music.x *= auto
send.x *= auto

# ── sound effects on the film's cues ────────────────────────────────────
sfx.add(whoosh(1.6, 500, 2600, peak=0.55, width=0.8, stereo=(-0.8, 0.6)), 0.0, 0.10)          # ribbon draws
sfx.add(sparkle(0.5), 1.45, 0.05, pan=0.1)                                                       # leaf
sfx.add(whoosh(0.8, 180, 900, peak=0.7, width=0.7, stereo=(0, 0)), 3.35, 0.20)                 # navy wave
for i in range(3):
    sfx.add(thud(70), 4.4 + i * 0.5, 0.25)                                                        # items land
    sfx.add(swish(), 6.1 + i * 0.2, 0.2, pan=-0.2 + i * 0.2)                                     # strikes
sfx.add(sparkle(0.35, 8, 3000, 6000), 6.8, 0.05)
sfx.add(riser(1.0), 7.0, 0.14)                                                                    # into the drop
sfx.add(whoosh(0.7, 2600, 700, peak=0.35, width=0.6, stereo=(0.2, -0.1)), 7.3, 0.12)          # sheet falls
sfx.add(boom(), 8.0, 0.4)                                                                         # drop
sfx.add(whoosh(1.2, 8000, 3000, peak=0.05, width=1.0, stereo=(-0.5, 0.5)), 8.0, 0.08)         # air
sfx.add(sparkle(0.6), 8.9, 0.045, pan=0.0)                                                        # sheen
sfx.add(tick(2400), 10.0, 0.25, pan=0.2)
sfx.add(tick(2000), 10.25, 0.25, pan=0.0)
sfx.add(whoosh(0.5, 1800, 400, peak=0.6, width=0.6, stereo=(0, 0)), 11.25, 0.12)              # sheet drops
sfx.add(whoosh(0.9, 400, 3500, peak=0.5, width=0.7, stereo=(-0.9, 0.9)), 11.4, 0.22)          # ribbon wipe
sfx.add(whoosh(0.8, 2400, 900, peak=0.7, width=0.6, stereo=(0.5, 0)), 12.15, 0.12)            # sheet flies in
sfx.add(plop(320, 1000), 12.95, 0.3)                                                              # lands in the drum
sfx.add(plop(500, 1500, 0.06), 13.05, 0.16)
for i in range(3):
    sfx.add(thud(95 - i * 8), 14.5 + i * 0.3, 0.3)                                                # laundry lands
sfx.add(tick(1500, 0.03), 16.0, 0.35)                                                             # knob
sfx.add(tick(1100, 0.03), 16.12, 0.25)
water = lp(bp(rng.standard_normal(int(2.0 * SR)), 200, 1600), 900)                              # water + drum turning
wt = np.arange(len(water)) / SR
water *= np.minimum(1, wt / 0.6) * (0.6 + 0.4 * np.sin(2 * np.pi * 2.2 * wt) ** 2) * np.exp(-np.maximum(wt - 1.4, 0) / 0.25)
sfx.add(water / np.max(np.abs(water)), 16.2, 0.12)
for i in range(7):
    sfx.add(plop(rng.uniform(500, 900), rng.uniform(1300, 2200), 0.05), 16.5 + i * 0.17 + rng.uniform(0, 0.05), 0.06, pan=rng.uniform(-0.6, 0.6))
sfx.add(whoosh(0.75, 300, 2500, peak=0.9, width=0.6, stereo=(0, 0)), 17.45, 0.2)              # dive into the porthole
for i in range(5):
    sfx.add(plop(rng.uniform(600, 900), rng.uniform(1500, 2500), 0.04), 18.05 + i * 0.04, 0.08, pan=rng.uniform(-0.7, 0.7))
for i, m in enumerate((72, 76, 79, 84)):                                                          # cards pop
    sfx.add(plop(500, 1300, 0.05), 18.15 + i * 0.25, 0.12, pan=-0.45 + i * 0.3)
    music.add(marimba(m, 0.8), 18.17 + i * 0.25, 0.22, pan=-0.45 + i * 0.3)
    send.add(marimba(m, 0.8), 18.17 + i * 0.25, 0.2)
# count-up ticks (one per number, following the easing in film.js)
for v in range(1, 31):
    p = 1 - (1 - v / 30) ** (1 / 3)
    sfx.add(tick(2600 + v * 40, 0.012), 19.6 + p * 1.0, 0.08, pan=0.0)
sfx.add(whoosh(0.9, 3500, 400, peak=0.5, width=0.7, stereo=(0.9, -0.9)), 21.35, 0.22)         # ribbon wipe back
for t0 in (23.6, 25.6):
    sfx.add(whoosh(0.65, 600, 2600, peak=0.6, width=0.6, stereo=(0.8, -0.6)), t0, 0.16)       # scent slides
sfx.add(whoosh(0.7, 500, 2200, peak=0.8, width=0.7, stereo=(0, 0)), 27.45, 0.14)              # iris
sfx.add(boom(), 28.0, 0.22)
sfx.add(sparkle(0.6), 28.2, 0.05)
sfx.add(plop(450, 1200, 0.05), 29.2, 0.14)                                                        # CTA pops
sfx.add(sparkle(0.5, 10, 3500, 8000), 30.1, 0.05)                                                 # shine

# ── reverb (synthetic stereo hall) ───────────────────────────────────────
def hall(rt=2.0, length=2.6):
    n = int(length * SR)
    t = np.arange(n) / SR
    ir = np.zeros((2, n))
    for ch in range(2):
        noise = rng.standard_normal(n)
        bright = noise * np.exp(-t * 6.9 / (rt * 0.55))
        dark = lp(noise, 2500) * np.exp(-t * 6.9 / rt)
        ir[ch] = (0.35 * bright + dark) * np.minimum(1, t / 0.012)
    ir /= np.sqrt(np.sum(ir ** 2, axis=1, keepdims=True))
    return ir


ir = hall()
wet = np.vstack([signal.fftconvolve(hp(send.x[c], 250) + hp(sfx.x[c], 400) * 0.25, ir[c])[:N] for c in range(2)])

# ── mix and master ──────────────────────────────────────────────────────
mix = music.x * 1.0 + drums.x * 0.9 + sfx.x * 2.3 + wet * 0.36
mix = np.vstack([hp(mix[c], 28) for c in range(2)])
# tone: a little less 300 Hz mud, a little more air
mix = np.vstack([mix[c] - 0.22 * bp(mix[c], 220, 480) + 0.3 * hp(mix[c], 4500) for c in range(2)])
# gentle glue compression
level = np.sqrt(signal.sosfilt(signal.butter(1, 6, 'low', fs=SR, output='sos'), np.mean(mix ** 2, axis=0)) + 1e-12)
thr = np.percentile(level, 80)
gain = np.where(level > thr, (thr / level) ** 0.35, 1.0)
mix *= gain
# fade the tail and trim to the film's length
n_end = int(LEN * SR)
fade = np.ones(N)
f0, f1 = int(30.6 * SR), n_end
fade[f0:f1] = np.cos(np.linspace(0, np.pi / 2, f1 - f0)) ** 2
fade[f1:] = 0
mix = (mix * fade)[:, :n_end]
fade_in = np.minimum(1, np.arange(n_end) / (0.02 * SR))
mix *= fade_in
# soft limiter
mix /= np.max(np.abs(mix)) + 1e-9
mix = np.tanh(mix * 1.15) / np.tanh(1.15) * 0.89

out = sys.argv[1] if len(sys.argv) > 1 else 'out/velmo-mix.wav'
wavfile.write(out, SR, mix.T.astype(np.float32))
print(out, f'{mix.shape[1] / SR:.2f}s peak {np.max(np.abs(mix)):.3f}')
