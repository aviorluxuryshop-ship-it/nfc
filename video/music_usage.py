"""
VELMO usage film — original score and sound design, synthesised from scratch
with numpy/scipy (no samples, no licences to worry about).

    python3 music_usage.py out/velmo-kullanim-mix.wav

120 BPM in F major, 32 s = 16 bars; every hit sits on a cue time in usage.js.
  0–2      breakfast: ukulele, glockenspiel, finger snaps
  2–3.3    the spill in slow motion: the tape stops, a drone, splash and clink
  3.3–8    slide-whistle "uh-oh"; mom walks in on calm chords, ta-da on the box, build
  8–15.4   the three steps on a light groove; every action has its own sound
  15.4–20  into the drum: the music goes underwater, the sheet fizzes away
  20–24    the clean tee: machine tune, ta-da, the kid hops in and hugs it
  24–28    celebration: whistle hook, party poppers, jumps
  28–32    end card (the brand film's sting)
The mix is mastered here to −13 LUFS integrated with true peak under −1 dBTP.
"""
import sys

import numpy as np
from scipy import ndimage, signal
from scipy.io import wavfile

SR = 48000
LEN = 32.0
N = int(SR * (LEN + 0.5))
BEAT = 0.5
BAR = 2.0
rng = np.random.default_rng(11)


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
            a = (np.clip(pan, -1, 1) + 1) * np.pi / 4
            sig = np.vstack([sig * np.cos(a), sig * np.sin(a)]) * np.sqrt(2)
        if i0 < 0:
            sig = sig[:, -i0:]
            i0 = 0
        n = min(sig.shape[1], N - i0)
        self.x[:, i0:i0 + n] += sig[:, :n] * gain


def env_adsr(n, a, d, s, r, hold):
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


def norm(x):
    return x / (np.max(np.abs(x)) + 1e-9)


def tt_(dur):
    n = int(dur * SR)
    return n, np.arange(n) / SR


# ── instruments ──────────────────────────────────────────────────────────
def pad_note(m, dur, cutoff, att=0.5, rel=1.2):
    """Warm detuned-saw pad, band-limited additively."""
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
    n, t = tt_(dur)
    f = mtof(m)
    s = (np.sin(2 * np.pi * f * t) * np.exp(-t / 0.42)
         + 0.32 * np.sin(2 * np.pi * f * 3.93 * t) * np.exp(-t / 0.07)
         + 0.1 * np.sin(2 * np.pi * f * 9.24 * t) * np.exp(-t / 0.025))
    s *= np.minimum(1, t / 0.0015)
    click = lp(rng.standard_normal(n) * np.exp(-t / 0.004), 3000) * 0.25
    return (s + click) * vel


def bell(m, vel=1.0, dur=2.6, index=2.4):
    """FM bell/celesta."""
    n, t = tt_(dur)
    f = mtof(m)
    idx = index * np.exp(-t / 0.35)
    s = np.sin(2 * np.pi * f * t + idx * np.sin(2 * np.pi * f * 3.5 * t))
    s += 0.25 * np.sin(2 * np.pi * f * 2.76 * t) * np.exp(-t / 0.4)
    s *= np.exp(-t / 0.9) * np.minimum(1, t / 0.002)
    return s * vel * 0.6


def glock(m, vel=1.0, dur=2.2):
    """Glockenspiel: bright bar partials and a mallet tick."""
    n, t = tt_(dur)
    f = mtof(m)
    s = (np.sin(2 * np.pi * f * t) * np.exp(-t / 0.95)
         + 0.35 * np.sin(2 * np.pi * f * 2.76 * t + 0.7) * np.exp(-t / 0.28)
         + 0.14 * np.sin(2 * np.pi * f * 5.40 * t + 1.9) * np.exp(-t / 0.09))
    s *= np.minimum(1, t / 0.0008)
    s += hp(rng.standard_normal(n), 4000) * np.exp(-t / 0.002) * 0.25
    return s * vel * 0.55


def pluck_bass(m, dur, vel=1.0):
    n = int((dur + 0.15) * SR)
    t = np.arange(n) / SR
    f = mtof(m)
    s = np.sin(2 * np.pi * f * t) + 0.35 * np.sin(4 * np.pi * f * t) * np.exp(-t / 0.2) + 0.12 * np.sin(6 * np.pi * f * t) * np.exp(-t / 0.08)
    s = np.tanh(1.6 * s) / np.tanh(1.6)
    e = np.minimum(1, t / 0.006) * np.where(t < dur, np.exp(-t / 0.9), np.exp(-dur / 0.9) * np.exp(-(t - dur) / 0.04))
    return s * e * vel


def ks(m, dur=1.0, vel=1.0, soft=0.35, damp=0.996):
    """Karplus–Strong plucked string (ukulele-ish), pitch-corrected by resampling."""
    f = mtof(m)
    D = max(4, int(np.floor(SR / f - 0.5)))
    real_f = SR / (D + 0.5)
    m_out = int(dur * SR)
    n = int(m_out * f / real_f) + D + 4
    y = np.zeros(n)
    exc = signal.lfilter([1 - soft], [1, -soft], rng.uniform(-1, 1, D + 1))
    y[:D + 1] = exc - exc.mean()
    k = D + 1
    while k < n:
        e = min(k + D, n)
        y[k:e] = damp * 0.5 * (y[k - D:e - D] + y[k - D - 1:e - D - 1])
        k = e
    out = np.interp(np.arange(m_out) * (f / real_f), np.arange(n), y)
    t = np.arange(m_out) / SR
    out *= np.minimum(1, t / 0.001) * np.minimum(1, (dur - t) / 0.03)
    return out * vel


def strum(bus, chord, t0, gain, dur=0.9, down=True, mute=False, pan=0.0, sb=None, sgain=0.0):
    notes = chord if down else chord[::-1]
    for i, m in enumerate(notes):
        s = ks(m, dur, 1 - 0.07 * i, soft=0.62 if mute else 0.35, damp=0.95 if mute else 0.996)
        bus.add(s, t0 + i * 0.013, gain, pan=pan + (i - 1.5) * 0.12)
        if sb is not None:
            sb.add(s, t0 + i * 0.013, sgain)


def whistle_line(notes, vel=1.0):
    """Whistled melody: (t, midi, dur) notes with glides, vibrato and breath. Returns (signal, start time)."""
    start = notes[0][0] - 0.05
    end = max(t + d for t, _, d in notes) + 0.25
    n = int((end - start) * SR)
    tt = np.arange(n) / SR + start
    logf = np.full(n, np.nan)
    amp = np.zeros(n)
    for t0, m, d in notes:
        on = (tt >= t0) & (tt < t0 + d - 0.025)
        logf[on] = np.log(mtof(m))
        amp[on] = 1
    first = np.argmax(~np.isnan(logf))
    logf[:first] = logf[first]
    for i in range(first + 1, n):  # hold the last pitch through gaps
        if np.isnan(logf[i]):
            logf[i] = logf[i - 1]
    a = np.exp(-1 / (0.022 * SR))
    logf = signal.lfilter([1 - a], [1, -a], logf - logf[0]) + logf[0]
    a2 = np.exp(-1 / (0.012 * SR))
    amp = signal.lfilter([1 - a2], [1, -a2], amp)
    f = np.exp(logf) * (1 + 0.009 * np.sin(2 * np.pi * 5.6 * tt))
    ph = 2 * np.pi * np.cumsum(f) / SR
    tone = np.sin(ph) + 0.05 * np.sin(2 * ph)
    breath = bp(rng.standard_normal(n), 1800, 7000) * 0.05
    return (tone + breath) * amp * vel, start


def kick(vel=1.0):
    n, t = tt_(0.45)
    f = 46 + 110 * np.exp(-t / 0.028)
    s = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 0.2)
    s += lp(rng.standard_normal(n), 4000) * np.exp(-t / 0.003) * 0.25
    return np.tanh(1.4 * s) * vel


def clap(vel=1.0):
    n, t = tt_(0.4)
    noise = rng.standard_normal(n)
    e = np.zeros(n)
    for d in (0, 0.011, 0.022):
        tt = t - d
        e += np.where(tt >= 0, np.exp(-np.maximum(tt, 0) / 0.006), 0)
    e += np.where(t >= 0.03, np.exp(-np.maximum(t - 0.03, 0) / 0.11), 0) * 0.6
    return bp(noise * e, 900, 2600) * vel * 0.9


def snap(vel=1.0):
    n, t = tt_(0.12)
    s = bp(rng.standard_normal(n), 1800, 5200) * np.exp(-t / 0.011) + np.sin(2 * np.pi * 2150 * t) * np.exp(-t / 0.005) * 0.5
    return s * vel


def snare(vel=1.0):
    n, t = tt_(0.25)
    body = np.sin(2 * np.pi * 190 * t) * np.exp(-t / 0.05) + 0.5 * np.sin(2 * np.pi * 330 * t) * np.exp(-t / 0.03)
    noise = bp(rng.standard_normal(n), 1500, 9000) * np.exp(-t / 0.09)
    return (0.6 * body + noise) * vel * 0.6


def shaker(vel=1.0):
    n, t = tt_(0.08)
    e = np.minimum(1, t / 0.008) * np.exp(-t / 0.022)
    return hp(rng.standard_normal(n), 6500) * e * vel * 0.5


def hat(vel=1.0, open_=False):
    n, t = tt_(0.3 if open_ else 0.06)
    e = np.exp(-t / (0.09 if open_ else 0.015))
    return hp(rng.standard_normal(n), 8000) * e * vel * 0.45


def crash(dur=2.4):
    n, t = tt_(dur)
    out = np.zeros((2, n))
    for c in range(2):
        noise = rng.standard_normal(n)
        s = hp(noise, 3500, order=4) * 0.8 + bp(noise, 6000, 11000) * 0.6
        out[c] = s * (np.exp(-t / 0.8) * 0.7 + np.exp(-t / 0.05) * 0.6) * np.minimum(1, t / 0.001)
    return norm(out)


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
    y = norm(y * e)
    pan = np.linspace(stereo[0], stereo[1], len(y))
    a = (pan + 1) * np.pi / 4
    return np.vstack([y * np.cos(a), y * np.sin(a)]) * np.sqrt(2)


def plop(f0=380, f1=1100, dur=0.09):
    n = int((dur + 0.05) * SR)
    t = np.arange(n) / SR
    f = f0 + (f1 - f0) * (1 - np.exp(-t / (dur / 2.5)))
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / (dur / 2)) * np.minimum(1, t / 0.002)


def thud(f=80):
    n, t = tt_(0.3)
    s = np.sin(2 * np.pi * f * t * (1 - 0.3 * t)) * np.exp(-t / 0.07)
    s += lp(rng.standard_normal(n), 500) * np.exp(-t / 0.03) * 0.6
    return s


def tick(f=3200, dur=0.02):
    n, t = tt_(dur)
    return np.sin(2 * np.pi * f * t) * np.exp(-t / 0.004) + hp(rng.standard_normal(n), 3000) * np.exp(-t / 0.0015) * 0.5


def swish(dur=0.22, stereo=(-0.4, 0.4)):
    return whoosh(dur, 4500, 1500, peak=0.25, width=0.7, stereo=stereo)


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
    n, t = tt_(1.6)
    s = np.sin(2 * np.pi * np.cumsum(38 + 60 * np.exp(-t / 0.06)) / SR) * np.exp(-t / 0.55)
    s += lp(rng.standard_normal(n), 1800) * np.exp(-t / 0.25) * 0.35
    return s


def riser(dur=1.0):
    w = whoosh(dur, 300, 7000, peak=0.97, width=0.5, stereo=(0, 0))
    n = w.shape[1]
    t = np.arange(n) / SR
    g = np.sin(2 * np.pi * np.cumsum(220 * 2 ** (2 * t / dur)) / SR) * (t / dur) ** 2 * 0.25
    return w + g


def splash(slow=1.0):
    """Liquid hitting cloth: a wet slap, spray and droplets (slow > 1 = slow motion)."""
    n, t = tt_(1.1 * slow)
    noise = rng.standard_normal(n)
    out = lp(noise, 1800 / slow) * np.exp(-t / (0.05 * slow))
    out += bp(noise, 900 / slow, 5000 / slow) * np.exp(-t / (0.2 * slow)) * np.minimum(1, t / (0.008 * slow)) * 0.6
    for _ in range(10):
        p = plop(rng.uniform(380, 750) / slow, rng.uniform(1100, 2300) / slow, 0.05 * slow)
        i0 = int(rng.uniform(0.02, 0.5) * slow * SR)
        k = min(len(p), n - i0)
        out[i0:i0 + k] += p[:k] * rng.uniform(0.15, 0.35)
    return norm(out)


def clink(pitch=1.0, slow=1.0):
    """Glass tapping wood: inharmonic glass partials over a small knock."""
    n, t = tt_(1.4 * slow)
    s = np.zeros(n)
    for f, a, d in ((2270, 1.0, 0.30), (3360, 0.6, 0.22), (4980, 0.4, 0.14), (6150, 0.25, 0.09), (1310, 0.3, 0.2)):
        s += a * np.sin(2 * np.pi * f * pitch * t + rng.uniform(0, 6.28)) * np.exp(-t / (d * slow))
    s *= np.minimum(1, t / 0.0005)
    s += hp(rng.standard_normal(n), 2000) * np.exp(-t / 0.003) * 0.3
    return norm(s)


def slide_whistle(f0, f1, dur):
    n, t = tt_(dur)
    s = t / dur
    f = f0 * (f1 / f0) ** (s ** 0.8) * (1 + 0.012 * np.sin(2 * np.pi * 6 * t))
    ph = 2 * np.pi * np.cumsum(f) / SR
    tone = np.sin(ph) + 0.08 * np.sin(2 * ph)
    breath = bp(rng.standard_normal(n), 1500, 6000) * 0.05
    return (tone + breath) * np.minimum(1, t / 0.03) * np.clip((dur - t) / 0.08, 0, 1)


def boing(f0=220, dur=0.45):
    """Cartoon spring: a rising, wobbling twang."""
    n, t = tt_(dur)
    f = f0 * (1 + 0.9 * (1 - np.exp(-t / 0.12))) * (1 + 0.09 * np.sin(2 * np.pi * 17 * t) * np.exp(-t / 0.2))
    ph = 2 * np.pi * np.cumsum(f) / SR
    s = np.sin(ph) + 0.5 * np.sin(2 * ph + 0.4) + 0.25 * np.sin(3 * ph)
    return lp(s * np.exp(-t / 0.16) * np.minimum(1, t / 0.003), 3200)


def step(vel=1.0):
    n, t = tt_(0.12)
    return (lp(rng.standard_normal(n), 1100) * np.exp(-t / 0.018) * 0.7 + np.sin(2 * np.pi * 95 * t) * np.exp(-t / 0.03)) * vel


def rustle(dur=0.25):
    n, t = tt_(dur)
    return bp(rng.standard_normal(n), 700, 4000) * np.sin(np.pi * t / dur) ** 2


def beep(f, dur=0.08):
    n, t = tt_(dur)
    s = np.sin(2 * np.pi * f * t) + 0.25 * np.sin(2 * np.pi * 3 * f * t)
    return lp(s, 5000) * np.minimum(1, t / 0.003) * np.clip((dur - t) / 0.012, 0, 1)


def popper():
    """Party popper: a crack, then a cloud of paper confetti ticks thinning out."""
    n, t = tt_(1.3)
    noise = rng.standard_normal(n)
    bang = bp(noise, 400, 7000) * np.exp(-t / 0.01) + np.sin(2 * np.pi * 110 * t) * np.exp(-t / 0.04) * 0.7
    rate = 900 * np.exp(-t / 0.35)
    ticks = (rng.random(n) < rate / SR) * rng.uniform(0.3, 1, n)
    rust = bp(signal.lfilter([1], [1, -0.6], ticks), 2500, 9000) * np.minimum(1, t / 0.03)
    return norm(bang * 0.9 + norm(rust) * 0.35)


def fizz(dur=1.0):
    """Effervescent dissolve: dense tiny crackles under a soft hiss."""
    n, t = tt_(dur)
    shape = np.sin(np.pi * np.clip(t / dur, 0, 1)) ** 0.6
    ticks = (rng.random(n) < 1600 * shape / SR) * rng.uniform(0.2, 1, n)
    s = hp(ticks, 3000) + hp(rng.standard_normal(n), 6000) * 0.04 * shape
    return norm(s)


def underwater(dur):
    n, t = tt_(dur)
    rum = norm(lp(rng.standard_normal(n), 220, order=4))
    return rum * (0.7 + 0.3 * np.sin(2 * np.pi * 0.7 * t)) * np.minimum(1, t / 0.3) * np.clip((dur - t) / 0.4, 0, 1)


def machine_run(dur):
    """Motor spinning up and water sloshing once per drum turn."""
    n, t = tt_(dur)
    f = 38 + 30 * np.clip(t / 1.0, 0, 1)
    ph = 2 * np.pi * np.cumsum(f) / SR
    hum = lp(np.sign(np.sin(ph)) * 0.5 + np.sin(2 * ph) * 0.3, 400)
    water = bp(rng.standard_normal(n), 300, 2500) * (0.35 + 0.65 * np.sin(np.pi * 0.95 * t) ** 2)
    return (norm(hum) * 0.6 + norm(water) * 0.5) * np.minimum(1, t / 0.25) * np.clip((dur - t) / 0.3, 0, 1)


def tape_stop(x, t_stop, dur):
    """Playback of a stereo bus slows to a halt from t_stop over dur seconds."""
    n = x.shape[1]
    t = np.arange(n) / SR
    s = np.clip((t - t_stop) / dur, 0, 1)
    pos = np.where(t < t_stop, t, t_stop + dur * (1 - (1 - s) ** 3) / 3)
    y = np.vstack([np.interp(pos * SR, np.arange(n), x[c]) for c in range(2)])
    y *= np.where(t < t_stop, 1, (1 - s) ** 0.7)
    y[:, t > t_stop + dur] = 0
    return y


# ── harmony ─────────────────────────────────────────────────────────────
PAD = {'F': [53, 57, 60, 64], 'Dm': [50, 57, 60, 65], 'Bb': [58, 62, 65, 69], 'C': [60, 64, 67, 69],
       'Gm': [55, 58, 62, 65], 'Csus': [60, 65, 67, 70]}
ARP = {'F': [65, 69, 72, 76], 'Dm': [65, 69, 72, 74], 'Bb': [65, 70, 74, 77], 'C': [67, 69, 72, 76],
       'Gm': [65, 67, 70, 74], 'Csus': [65, 67, 72, 77]}
UKE = {'F': [60, 65, 69, 72], 'Dm': [62, 65, 69, 74], 'Bb': [62, 65, 70, 74], 'C': [60, 64, 67, 72],
       'Gm': [62, 67, 70, 74], 'Csus': [60, 65, 67, 72]}
ROOT = {'F': 41, 'Dm': 38, 'Bb': 46, 'C': 36, 'Gm': 43, 'Csus': 36}

music = Bus()
drums = Bus()
sfx = Bus()
send = Bus()   # reverb send
intro = Bus()  # bar 1, tape-stopped on the spill
intro_send = Bus()
kicks = []


def bar(t0, chords, mb=None, db=None, sb=None, drum=1.0, claps=True, snaps=False, hats=False, kick_on=True,
        kick_extra=False, uke=1.0, arp=0.0, bass=1.0, pad=1.0, until=None):
    """One 2-second bar. chords: [(name, beats)] adding up to 4."""
    mb, db, sb = mb or music, db or drums, sb or send
    end = until if until is not None else t0 + BAR
    seq = []
    for name, nb in chords:
        seq += [name] * (nb * 2)
    tb = t0
    for name, nb in chords:
        if pad:
            for m in PAD[name]:
                mb.add(pad_note(m, nb * BEAT - 0.05, 2200, att=0.04, rel=0.25), tb, 0.1 * pad)
        tb += nb * BEAT
    for e8 in range(8):
        t = t0 + e8 * 0.25
        if t >= end:
            break
        name = seq[e8]
        r = ROOT[name]
        if bass:
            if e8 in (0, 4):
                mb.add(pluck_bass(r, 0.42, 0.9), t, 0.42 * bass)
            elif e8 == 3:
                mb.add(pluck_bass(r + 7, 0.18, 0.7), t, 0.34 * bass)
            elif e8 == 7:
                mb.add(pluck_bass(r + 12, 0.18, 0.7), t, 0.3 * bass)
        if uke:
            if e8 == 0:
                strum(mb, UKE[name], t, 0.085 * uke, dur=0.9, sb=sb, sgain=0.03)
            elif e8 % 2 == 1:
                strum(mb, UKE[name], t + 0.01, 0.07 * uke, dur=0.16, mute=True, down=e8 % 4 == 3, pan=0.15)
        if arp:
            idx = [0, 2, 1, 3, 2, 1, 3, 2][e8]
            v = 0.75 if e8 % 4 == 0 else 0.5
            mb.add(marimba(ARP[name][idx], v), t, 0.15 * arp, pan=0.35 if e8 % 2 else -0.35)
            sb.add(marimba(ARP[name][idx], v), t, 0.06 * arp)
    for beat in range(4):
        tb = t0 + beat * BEAT
        if tb >= end or not drum:
            continue
        if kick_on and beat in (0, 2):
            db.add(kick(1.0), tb, 0.8 * drum)
            kicks.append(tb)
        if kick_extra and beat == 1:
            db.add(kick(0.7), tb + 0.25, 0.5 * drum)
            kicks.append(tb + 0.25)
        if beat in (1, 3):
            if claps:
                db.add(clap(0.9), tb, 0.3 * drum, pan=0.05)
                sb.add(clap(0.9), tb, 0.1 * drum)
            if snaps:
                db.add(snap(0.9), tb, 0.22 * drum, pan=-0.15)
                sb.add(snap(0.9), tb, 0.08 * drum)
        for s16 in range(4):
            acc = (0.45, 0.22, 0.8, 0.3)[s16]
            db.add(shaker(acc), tb + s16 * 0.125 + (0.012 if s16 % 2 else 0), 0.2 * drum, pan=0.45)
        if hats:
            db.add(hat(0.6, open_=True), tb + 0.25, 0.13 * drum, pan=-0.35)


def roll(t0, t1, gain=0.3):
    """Snare roll that tightens and swells into t1."""
    t = t0
    while t < t1 - 0.02:
        p = (t - t0) / (t1 - t0)
        drums.add(snare(0.4 + 0.6 * p), t, gain * (0.25 + 0.75 * p ** 1.5), pan=0.1)
        t += 0.125 if p < 0.5 else 0.0625


def glock_line(notes, t0, gain=0.16, pan=0.15, bus=None, sb=None):
    bus, sb = bus or music, sb or send
    for e8, m in notes:
        bus.add(glock(m, 0.8), t0 + e8 * 0.25, gain, pan=pan)
        sb.add(glock(m, 0.8), t0 + e8 * 0.25, gain * 1.2)


def tada(t0, notes=(77, 81, 84, 89), gain=0.16):
    for i, m in enumerate(notes):
        music.add(glock(m, 0.9), t0 + i * 0.03, gain, pan=-0.3 + i * 0.2)
        send.add(glock(m, 0.9), t0 + i * 0.03, gain * 1.4)


# ── 0–2 · breakfast (tape-stopped at the spill) ──────────────────────────
bar(0.0, [('F', 4)], mb=intro, db=intro, sb=intro_send, drum=0.7, claps=False, snaps=True, kick_on=False, uke=1.0, bass=0.7, pad=0.6)
glock_line([(1, 77), (2, 81), (3, 84), (5, 86), (6, 84), (7, 81)], 0.0, 0.15, bus=intro, sb=intro_send)
strum(intro, UKE['Bb'], 2.0, 0.1, dur=1.2, sb=intro_send, sgain=0.04)   # the downbeat the tape stops on
intro.add(glock(82, 0.8), 2.0, 0.15)
intro.add(pluck_bass(46, 0.6, 0.9), 2.0, 0.42)
ix = tape_stop(intro.x, 2.05, 0.42)
isend = tape_stop(intro_send.x, 2.05, 0.42)

# ── 2–3.3 · slow-motion spill (story time runs at 0.38×) ─────────────────
sfx.add(whoosh(0.9, 160, 520, peak=0.6, width=0.6, stereo=(0.3, -0.1)), 2.08, 0.16)            # glass falls
for m in (41, 48):
    music.add(pad_note(m, 1.05, 380, att=0.15, rel=0.25), 2.1, 0.22)                               # drone
sfx.add(splash(2.2), 2.45, 0.3)                                                                    # juice hits the tee
sfx.add(plop(240, 640, 0.14), 2.55, 0.2, pan=0.3)                                                 # "!" bubble
for i in range(6):
    sfx.add(plop(rng.uniform(260, 420), rng.uniform(700, 1100), 0.08), 2.58 + i * 0.08 + rng.uniform(0, 0.03), 0.06, pan=rng.uniform(-0.4, 0.4))
sfx.add(clink(0.62, 2.0), 2.84, 0.22, pan=0.15)                                                    # glass lands on its side
sfx.add(thud(110), 2.84, 0.16)
sfx.add(whoosh(0.3, 400, 2600, peak=0.95, width=0.6, stereo=(0, 0)), 3.02, 0.1)                 # time snaps back

# ── 3.3–8 · uh-oh, mom walks in, one sheet ───────────────────────────────
sfx.add(slide_whistle(1250, 520, 0.5), 3.4, 0.09, pan=-0.1)
for i, t0 in enumerate((4.284, 4.570, 4.856, 5.141)):
    sfx.add(step(0.9), t0, 0.2, pan=0.6 - i * 0.12)
for m in PAD['Bb']:
    music.add(pad_note(m, 1.95, 1500, att=0.45, rel=0.4), 4.0, 0.11)
music.add(pluck_bass(46, 0.9, 0.8), 4.0, 0.36)
music.add(pluck_bass(46, 0.9, 0.7), 5.0, 0.32)
for i, m in enumerate((58, 62, 65, 69, 74)):                                                       # "No panic."
    s = ks(m, 1.4, 0.9)
    music.add(s, 5.0 + i * 0.06, 0.1, pan=-0.3 + i * 0.15)
    send.add(s, 5.0 + i * 0.06, 0.08)
sfx.add(swish(0.25, (0.2, 0.5)), 5.55, 0.1)                                                        # box goes up
bar(6.0, [('Gm', 2), ('Csus', 1), ('C', 1)], drum=0.6, claps=False, snaps=True, kick_on=False, uke=0.9, bass=0.8, pad=0.8)
tada(6.1)                                                                                           # box at the top
sfx.add(sparkle(0.5), 6.15, 0.05, pan=0.3)
roll(7.0, 7.98, 0.26)
sfx.add(riser(0.95), 7.0, 0.12)
sfx.add(whoosh(0.55, 600, 3000, peak=0.6, width=0.7, stereo=(-0.9, 0.9)), 7.5, 0.24)            # whip pan

# ── 8–15.4 · the three steps ─────────────────────────────────────────────
drums.add(kick(1.0), 8.0, 0.2)
sfx.add(boom(), 8.0, 0.24)
sfx.add(crash(), 8.0, 0.12)
STEPS_HOOK = [[(2, 84), (3, 81), (5, 77), (6, 79), (7, 81)], [(2, 81), (3, 77), (5, 74), (6, 76), (7, 77)],
              [(2, 77), (3, 74), (5, 70), (6, 72), (7, 74)], [(2, 76), (4, 79), (6, 84)]]
for b, ch in enumerate(('F', 'Dm', 'Bb', 'C')):
    t0 = 8.0 + b * BAR
    bar(t0, [(ch, 4)], drum=0.85, claps=False, snaps=True, uke=1.0, arp=0.45, bass=1.0, pad=0.8, until=15.3 if b == 3 else None)
    glock_line(STEPS_HOOK[b], t0, 0.11)
for t0, m in ((8.15, 72), (10.3, 76), (12.75, 79)):                                                # step chips 1-2-3
    sfx.add(plop(500, 1300, 0.05), t0, 0.1, pan=-0.3)
    music.add(marimba(m, 0.8), t0 + 0.02, 0.2, pan=-0.3)
    send.add(marimba(m, 0.8), t0 + 0.02, 0.15)
sfx.add(sparkle(0.4, 8, 4000, 8000), 8.3, 0.04, pan=0.3)                                           # sheet out of the box
music.add(glock(89, 0.6), 8.35, 0.08, pan=0.3)
sfx.add(tick(1200, 0.03), 8.9, 0.25, pan=-0.2)                                                     # door latch
sfx.add(tick(2000, 0.02), 8.93, 0.12, pan=-0.2)
sfx.add(whoosh(0.45, 900, 400, peak=0.4, width=0.6, stereo=(-0.1, -0.5)), 8.92, 0.06)            # door swings
sfx.add(swish(0.3, (0.2, -0.3)), 9.65, 0.14)                                                       # sheet into the drum
sfx.add(plop(350, 900, 0.08), 10.0, 0.16, pan=-0.3)
sfx.add(sparkle(0.4, 8), 9.95, 0.045, pan=-0.3)
sfx.add(thud(90), 10.25, 0.14, pan=0.5)                                                            # box on the cabinet
for i, t0 in enumerate((10.35, 11.15, 11.95)):                                                     # laundry in
    sfx.add(rustle(0.22), t0, 0.07, pan=0.55)
    sfx.add(swish(0.28, (0.5, -0.3)), t0 + 0.35, 0.15)
    sfx.add(lp(thud(70 + i * 6), 900), t0 + 0.8, 0.14, pan=-0.3)
sfx.add(thud(85), 13.18, 0.26, pan=-0.2)                                                           # door shuts
sfx.add(tick(1500, 0.03), 13.2, 0.2, pan=-0.2)
for t0 in (13.24, 13.32, 13.40):                                                                   # programme knob
    sfx.add(tick(2600, 0.012), t0, 0.12, pan=0.1)
sfx.add(beep(1760), 13.62, 0.1, pan=0.1)                                                           # start button
sfx.add(beep(2093), 13.72, 0.1, pan=0.1)
sfx.add(machine_run(1.95), 13.75, 0.12, pan=-0.15)                                                 # it runs
music.add(glock(81, 0.6), 14.55, 0.08)                                                             # "No measuring. No spills."
music.add(glock(84, 0.6), 14.62, 0.08)
send.add(glock(84, 0.6), 14.62, 0.1)
sfx.add(whoosh(0.8, 250, 2400, peak=0.9, width=0.6, stereo=(0, 0)), 15.25, 0.22)                 # into the porthole

# ── 16–20 · inside the drum ──────────────────────────────────────────────
sfx.add(splash(1.0), 16.0, 0.14)
sfx.add(underwater(3.6), 16.0, 0.12)
bar(16.0, [('Dm', 4)], drum=0.6, claps=False, uke=0.7, arp=0.9, bass=1.0, pad=1.0)
bar(18.0, [('Bb', 2), ('C', 2)], drum=0.6, claps=False, uke=0.7, arp=0.9, bass=1.0, pad=1.0)
sfx.add(fizz(1.0), 16.25, 0.11)                                                                    # the sheet dissolves
for i in range(16):
    t0 = rng.uniform(16.05, 19.3)
    sfx.add(plop(rng.uniform(300, 700), rng.uniform(900, 1800), 0.05), t0, rng.uniform(0.03, 0.07), pan=rng.uniform(-0.7, 0.7))
for i, m in enumerate((77, 81, 84, 89, 93)):                                                       # the stain fades
    music.add(glock(m, 0.7), 17.2 + i * 0.4, 0.1, pan=-0.4 + i * 0.2)
    send.add(glock(m, 0.7), 17.2 + i * 0.4, 0.14)
sfx.add(whoosh(2.0, 2000, 9000, peak=0.8, width=0.8, stereo=(-0.3, 0.3)), 17.2, 0.04)
music.add(bell(96, 0.7), 19.15, 0.16)                                                              # glint
send.add(bell(96, 0.7), 19.15, 0.2)
sfx.add(sparkle(0.4, 10, 5000, 9000), 19.15, 0.05)
sfx.add(whoosh(0.9, 400, 3200, peak=0.7, width=0.6, stereo=(0, 0)), 19.45, 0.16)                 # bubble wipe
for i in range(22):
    p = i / 21
    sfx.add(plop(400 + p * 700, 1100 + p * 1500, 0.045), 19.45 + p * 0.55 + rng.uniform(0, 0.03), 0.05, pan=rng.uniform(-0.8, 0.8))

# ── 20–24 · clean ────────────────────────────────────────────────────────
for i, m in enumerate((81, 84, 89)):                                                               # machine's end tune
    sfx.add(beep(mtof(m), 0.09), 20.0 + i * 0.12, 0.07, pan=-0.3)
sfx.add(tick(1200, 0.03), 20.32, 0.22, pan=-0.3)                                                   # door opens
bar(20.0, [('F', 4)], drum=0.9, claps=True, uke=1.0, arp=0.5, bass=1.0, pad=0.9)
glock_line(STEPS_HOOK[0], 20.0, 0.1)
bar(22.0, [('Bb', 2), ('C', 2)], drum=0.75, claps=True, uke=0.9, arp=0.4, bass=1.0, pad=0.9, until=23.5)
for m in PAD['C']:
    music.add(pad_note(m, 0.5, 2200, att=0.04, rel=0.2), 23.5, 0.1)
sfx.add(swish(0.3, (-0.2, 0.2)), 21.0, 0.16)                                                       # the tee comes out
sfx.add(sparkle(0.6), 21.25, 0.06)
tada(21.3, (77, 81, 84, 89), 0.17)
sfx.add(whoosh(1.1, 2500, 6000, peak=0.4, width=1.0, stereo=(-0.6, 0.6)), 21.3, 0.05)            # lavender swirls
for i, t0 in enumerate((21.9, 22.24, 22.58)):                                                      # the kid hops in
    sfx.add(boing(200 + i * 30), t0, 0.16, pan=-0.7 + i * 0.25)
    sfx.add(step(0.7), t0 + 0.34, 0.12, pan=-0.5 + i * 0.25)
sfx.add(swish(0.25, (0.2, -0.2)), 22.95, 0.08)                                                     # hands it over
for i, m in enumerate((77, 81, 84)):                                                               # the hug
    music.add(glock(m, 0.7), 23.32 + i * 0.08, 0.12)
    send.add(glock(m, 0.7), 23.32 + i * 0.08, 0.16)
for i in range(3):                                                                                 # hearts
    sfx.add(plop(600, 1500, 0.05), 23.45 + i * 0.15, 0.07, pan=-0.2 + i * 0.2)
roll(23.5, 23.98, 0.22)
sfx.add(riser(0.55), 23.45, 0.1)

# ── 24–28 · celebration ──────────────────────────────────────────────────
sfx.add(crash(), 24.0, 0.2)
sfx.add(boom(), 24.0, 0.26)
sfx.add(whoosh(1.0, 400, 3000, peak=0.5, width=0.7, stereo=(-0.9, 0.9)), 24.0, 0.14)             # ribbon
bar(24.0, [('Bb', 2), ('C', 2)], drum=1.0, claps=True, hats=True, kick_extra=True, uke=1.0, arp=0.55, bass=1.0, pad=0.9)
bar(26.0, [('F', 4)], drum=1.0, claps=True, hats=True, kick_extra=True, uke=1.0, arp=0.55, bass=1.0, pad=0.9, until=27.5)
whistle, w0 = whistle_line([(24.0, 81, 0.25), (24.25, 82, 0.25), (24.5, 84, 0.5), (25.0, 86, 0.25), (25.25, 84, 0.25),
                            (25.5, 81, 0.5), (26.0, 77, 0.25), (26.25, 81, 0.25), (26.5, 84, 0.5), (27.0, 89, 0.42)])
music.add(whistle, w0, 0.11, pan=0.1)
send.add(whistle, w0, 0.1)
for t0 in (24.3, 25.3, 26.3):                                                                      # jumps
    sfx.add(boing(250), t0, 0.1, pan=-0.25)
    sfx.add(step(0.6), t0 + 0.55, 0.1, pan=-0.25)
for t0 in (24.55, 25.55):                                                                          # party poppers
    sfx.add(popper(), t0, 0.17, pan=-0.85)
    sfx.add(popper(), t0 + 0.03, 0.16, pan=0.85)
sfx.add(whoosh(0.7, 500, 2200, peak=0.8, width=0.7, stereo=(0, 0)), 27.45, 0.14)                 # iris

# ── 28–32 · end card (the brand film's sting) ────────────────────────────
for m in [53, 57, 60, 64, 67] + [72, 76]:
    music.add(pad_note(m, 3.0, 2200, att=0.02, rel=0.9), 28.0, 0.15)
    send.add(pad_note(m, 3.0, 2200, att=0.02, rel=0.9), 28.0, 0.08)
music.add(pluck_bass(41, 2.5, 1.0), 28.0, 0.45)
drums.add(kick(1.0), 28.0, 0.9)
for i, m in enumerate((77, 81, 84, 88)):
    music.add(bell(m, 0.5), 28.0 + i * 0.09, 0.2, pan=-0.3 + i * 0.2)
    send.add(bell(m, 0.5), 28.0 + i * 0.09, 0.35)
for i, m in enumerate((84, 88, 91)):
    music.add(bell(m, 0.45), 28.75 + i * 0.06, 0.22, pan=0.25)
    send.add(bell(m, 0.45), 28.75 + i * 0.06, 0.35)
music.add(marimba(84, 0.8), 29.2, 0.3)
send.add(marimba(84, 0.8), 29.2, 0.25)
sfx.add(boom(), 28.0, 0.22)
sfx.add(sparkle(0.6), 28.2, 0.05)
sfx.add(plop(450, 1200, 0.05), 29.2, 0.14)                                                        # CTA pops
sfx.add(sparkle(0.5, 10, 3500, 8000), 30.1, 0.05)                                                 # shine

# ── buses: pumping, section levels, the underwater muffle ────────────────
tt = np.arange(N) / SR
duck = np.ones(N)
for kt in kicks:
    if kt < 8:
        continue
    i0 = int(kt * SR)
    duck[i0:] *= 1 - 0.28 * np.exp(-(tt[i0:] - kt) / 0.11)
music.x *= duck
auto = np.interp(tt, [0, 2.0, 4.0, 5.8, 7.9, 8.0, 15.3, 16.0, 19.6, 20.0, 24.0, LEN + 1],
                 [1.0, 1.0, 0.75, 0.82, 0.9, 0.88, 0.88, 0.8, 0.8, 0.94, 1.0, 1.0])
band = (music.x + drums.x * 0.9) * auto
muffle = np.interp(tt, [15.3, 15.95, 19.55, 20.0], [0, 1, 1, 0])
band = band * (1 - muffle) + np.vstack([lp(band[c], 650, order=4) for c in range(2)]) * muffle * 1.25
send.x *= auto * (1 - 0.6 * muffle)


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
wet_in = send.x + isend
wet = np.vstack([signal.fftconvolve(hp(wet_in[c], 250) + hp(sfx.x[c], 400) * 0.25, ir[c])[:N] for c in range(2)])

# ── mix ─────────────────────────────────────────────────────────────────
mix = band + ix + sfx.x * 2.3 + wet * 0.36
mix = np.vstack([hp(mix[c], 28) for c in range(2)])
mix = np.vstack([mix[c] - 0.22 * bp(mix[c], 220, 480) + 0.3 * hp(mix[c], 4500) for c in range(2)])
level = np.sqrt(signal.sosfilt(signal.butter(1, 6, 'low', fs=SR, output='sos'), np.mean(mix ** 2, axis=0)) + 1e-12)
thr = np.percentile(level, 80)
mix *= np.where(level > thr, (thr / level) ** 0.35, 1.0)
n_end = int(LEN * SR)
fade = np.ones(N)
f0, f1 = int(30.6 * SR), n_end
fade[f0:f1] = np.cos(np.linspace(0, np.pi / 2, f1 - f0)) ** 2
fade[f1:] = 0
mix = (mix * fade)[:, :n_end]
mix *= np.minimum(1, np.arange(n_end) / (0.02 * SR))


# ── master: −13 LUFS integrated (ITU-R BS.1770), true peak ≤ −1.3 dBTP ──
def lufs(x):
    k1 = np.array([[1.53512485958697, -2.69169618940638, 1.19839281085285, 1.0, -1.69065929318241, 0.73248077421585]])
    k2 = np.array([[1.0, -2.0, 1.0, 1.0, -1.99004745483398, 0.99007225036621]])
    y = signal.sosfilt(k2, signal.sosfilt(k1, x, axis=1), axis=1)
    blk, hop = int(0.4 * SR), int(0.1 * SR)
    z = np.array([np.sum(np.mean(y[:, i:i + blk] ** 2, axis=1)) for i in range(0, y.shape[1] - blk + 1, hop)])
    lk = -0.691 + 10 * np.log10(z + 1e-12)
    z1 = z[lk > -70]
    rel = -0.691 + 10 * np.log10(z1.mean()) - 10
    return -0.691 + 10 * np.log10(z[(lk > -70) & (lk > rel)].mean())


def true_peak(x):
    return np.max(np.abs(signal.resample_poly(x, 4, 1, axis=1)))


def limit(x, ceiling, win=0.012):
    """Look-ahead peak limiter on 4× oversampled peaks; the smoothed gain never exceeds the needed gain."""
    up = np.abs(signal.resample_poly(x, 4, 1, axis=1)).max(axis=0)
    pk = up[: x.shape[1] * 4].reshape(-1, 4).max(axis=1)
    g = np.minimum(1, ceiling / np.maximum(pk, 1e-9))
    L = int(win * SR)
    g = ndimage.minimum_filter1d(g, 2 * L + 1)
    g = ndimage.uniform_filter1d(g, L + 1)
    return x * g


ceiling = 10 ** (-1.3 / 20)
for _ in range(4):
    mix *= 10 ** ((-13.0 - lufs(mix)) / 20)
    mix = limit(mix, ceiling)
mix *= min(1.0, ceiling / true_peak(mix))

out = sys.argv[1] if len(sys.argv) > 1 else 'out/velmo-kullanim-mix.wav'
wavfile.write(out, SR, mix.T.astype(np.float32))
print(out, f'{mix.shape[1] / SR:.2f}s  {lufs(mix):.2f} LUFS  true peak {20 * np.log10(true_peak(mix)):.2f} dBTP')
