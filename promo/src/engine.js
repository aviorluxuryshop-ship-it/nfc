/*
 * Tiny deterministic motion engine.
 * Every visual property is a pure function of time, so any frame can be
 * rendered in any order — which is what lets the renderer capture sub-frames
 * for real motion blur and split the job across parallel workers.
 */
(function () {
  const clamp01 = (x) => (x < 0 ? 0 : x > 1 ? 1 : x);

  // Cubic-bezier solver (same curves the site uses in CSS).
  function bezier(x1, y1, x2, y2) {
    const ax = 3 * x1 - 3 * x2 + 1, bx = 3 * x2 - 6 * x1, cx = 3 * x1;
    const ay = 3 * y1 - 3 * y2 + 1, by = 3 * y2 - 6 * y1, cy = 3 * y1;
    const sx = (t) => ((ax * t + bx) * t + cx) * t;
    const sy = (t) => ((ay * t + by) * t + cy) * t;
    const dsx = (t) => (3 * ax * t + 2 * bx) * t + cx;
    return (x) => {
      if (x <= 0) return 0;
      if (x >= 1) return 1;
      let t = x;
      for (let i = 0; i < 8; i++) {
        const d = sx(t) - x;
        if (Math.abs(d) < 1e-6) break;
        const ds = dsx(t);
        if (Math.abs(ds) < 1e-6) break;
        t -= d / ds;
      }
      return sy(clamp01(t));
    };
  }

  const E = {
    linear: (x) => x,
    inQuad: (x) => x * x,
    outQuad: (x) => 1 - (1 - x) * (1 - x),
    inCubic: (x) => x * x * x,
    outCubic: (x) => 1 - Math.pow(1 - x, 3),
    inOutCubic: (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2),
    inQuart: (x) => x * x * x * x,
    outQuart: (x) => 1 - Math.pow(1 - x, 4),
    inOutQuart: bezier(0.76, 0, 0.24, 1), // --ease-in-out-quart from the site
    outExpo: bezier(0.16, 1, 0.3, 1), // --ease-out-expo from the site
    inExpo: (x) => (x <= 0 ? 0 : Math.pow(2, 10 * x - 10)),
    inOutExpo: (x) =>
      x <= 0 ? 0 : x >= 1 ? 1 : x < 0.5 ? Math.pow(2, 20 * x - 10) / 2 : (2 - Math.pow(2, -20 * x + 10)) / 2,
    outBack: (x) => {
      const c1 = 1.4, c3 = c1 + 1;
      return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
    },
    bezier,
  };

  /** progress of t through [a, b], eased */
  const P = (t, a, b, ease = E.linear) => ease(clamp01((t - a) / (b - a)));
  const L = (a, b, p) => a + (b - a) * p;
  /** in → hold → out envelope */
  const env = (t, a, b, c, d, ein = E.outCubic, eout = E.inCubic) =>
    t < b ? P(t, a, b, ein) : 1 - P(t, c, d, eout);

  // Deterministic pseudo-random (mulberry32)
  function rng(seed) {
    let a = seed >>> 0;
    return () => {
      a = (a + 0x6d2b79f5) >>> 0;
      let t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  /** Set transform / opacity / filter in one call. */
  function S(el, o) {
    if (!el) return;
    const st = el.style;
    if (
      o.x !== undefined || o.y !== undefined || o.z !== undefined || o.s !== undefined ||
      o.sx !== undefined || o.sy !== undefined || o.r !== undefined || o.rx !== undefined ||
      o.ry !== undefined || o.skx !== undefined || o.xp !== undefined || o.yp !== undefined
    ) {
      let tr = '';
      if (o.xp !== undefined || o.yp !== undefined) tr += `translate(${o.xp || 0}%,${o.yp || 0}%) `;
      if (o.x !== undefined || o.y !== undefined || o.z !== undefined)
        tr += `translate3d(${(o.x || 0).toFixed(3)}px,${(o.y || 0).toFixed(3)}px,${(o.z || 0).toFixed(3)}px) `;
      if (o.rx !== undefined) tr += `rotateX(${o.rx.toFixed(4)}deg) `;
      if (o.ry !== undefined) tr += `rotateY(${o.ry.toFixed(4)}deg) `;
      if (o.r !== undefined) tr += `rotate(${o.r.toFixed(4)}deg) `;
      if (o.skx !== undefined) tr += `skewX(${o.skx.toFixed(4)}deg) `;
      if (o.s !== undefined) tr += `scale(${o.s.toFixed(5)}) `;
      if (o.sx !== undefined || o.sy !== undefined)
        tr += `scale(${(o.sx ?? 1).toFixed(5)},${(o.sy ?? 1).toFixed(5)}) `;
      st.transform = tr.trim();
    }
    if (o.o !== undefined) {
      const v = Math.max(0, Math.min(1, o.o));
      st.opacity = v.toFixed(4);
      st.visibility = v <= 0.001 ? 'hidden' : 'visible';
    }
    if (o.blur !== undefined || o.bright !== undefined || o.gray !== undefined) {
      let f = '';
      if (o.blur !== undefined && o.blur > 0.05) f += `blur(${o.blur.toFixed(2)}px) `;
      if (o.bright !== undefined) f += `brightness(${o.bright.toFixed(3)}) `;
      if (o.gray !== undefined) f += `grayscale(${o.gray.toFixed(3)}) `;
      st.filter = f.trim() || 'none';
    }
    if (o.clip !== undefined) st.clipPath = o.clip;
  }

  /** inset() clip-path helper (values in px or %) */
  const inset = (t, r, b, l, rad = 0) =>
    `inset(${t.toFixed(2)}px ${r.toFixed(2)}px ${b.toFixed(2)}px ${l.toFixed(2)}px round ${rad.toFixed(2)}px)`;

  /** Build a DOM node */
  function h(tag, cls, html, parent) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    if (parent) parent.appendChild(e);
    return e;
  }

  /**
   * Split text into masked words. Words wrapped in *asterisks* render in the
   * italic serif (the site's accent face). "|" forces a line break.
   * Returns { el, words: [innerSpan...] }.
   */
  function words(text, cls, parent) {
    const el = h('div', cls, null, parent);
    const inner = [];
    const lines = text.split('|');
    lines.forEach((line, li) => {
      const lineEl = h('span', 'line', null, el);
      const tokens = line.trim().split(/\s+/);
      let serif = false;
      tokens.forEach((tok, ti) => {
        let w = tok;
        let isSerif = serif;
        if (w.startsWith('*')) { isSerif = true; serif = true; w = w.slice(1); }
        if (w.endsWith('*')) { serif = false; w = w.slice(0, -1); }
        const m = h('span', 'm' + (isSerif ? ' serif' : ''), null, lineEl);
        const i = h('span', 'i', w, m);
        inner.push(i);
        if (ti < tokens.length - 1) lineEl.appendChild(document.createTextNode(' '));
      });
      if (li < lines.length - 1) h('br', null, null, el);
    });
    return { el, words: inner };
  }

  /** Split into masked characters (for typewriter / odometer style reveals). */
  function chars(text, cls, parent) {
    const el = h('div', cls, null, parent);
    const out = [];
    for (const ch of text) {
      if (ch === ' ') { el.appendChild(document.createTextNode(' ')); continue; }
      const m = h('span', 'm', null, el);
      out.push(h('span', 'i', ch, m));
    }
    return { el, chars: out };
  }

  /** Staggered mask reveal: words slide up from below their mask. */
  function reveal(list, t, start, { stagger = 0.06, dur = 0.9, ease = E.outExpo, from = 150, rot = 4, outAt = null, outDur = 0.55, outStagger = 0.035, outEase = E.inQuart } = {}) {
    list.forEach((w, i) => {
      const p = P(t, start + i * stagger, start + i * stagger + dur, ease);
      let y = (1 - p) * from;
      let r = (1 - p) * rot;
      if (outAt !== null) {
        const q = P(t, outAt + i * outStagger, outAt + i * outStagger + outDur, outEase);
        y -= q * from;
        r -= q * rot * 0.5;
      }
      w.style.transform = `translate3d(0,${y.toFixed(3)}%,0) rotate(${r.toFixed(3)}deg)`;
    });
  }

  window.M = { E, P, L, env, rng, S, inset, h, words, chars, reveal, clamp01 };
})();
