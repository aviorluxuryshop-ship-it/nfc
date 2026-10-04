/*
 * Socialp Media — brand film. 64 s @ 120 BPM (1 beat = 0.5 s, 1 bar = 2 s).
 * Every scene is a function of absolute time t; cuts land on the beat grid so
 * the synthesized score (scripts/score.py) hits with the picture.
 */
window.buildFilm = async function (stage, { vertical: V }) {
  const { E, P, L, env, rng, S, inset, h, words, chars, reveal } = M;
  const W = V ? 1080 : 1920;
  const H = V ? 1920 : 1080;
  const G = V ? 84 : 120;
  const A = 'assets/img/';
  const DUR = 64;
  const scenes = [];
  const decodes = [];

  const img = (src, cls, parent) => {
    const i = h('img', cls, null, parent);
    i.src = src;
    decodes.push(i.decode().catch(() => {}));
    return i;
  };
  const box = (el, x, y, w, hh) => {
    el.style.left = x + 'px'; el.style.top = y + 'px';
    if (w != null) el.style.width = w + 'px';
    if (hh != null) el.style.height = hh + 'px';
    return el;
  };
  function scene(id, t0, t1, z, build) {
    const el = h('div', 'scene', null, stage);
    el.style.zIndex = z;
    el.style.display = 'none';
    el.dataset.id = id;
    const s = { id, t0, t1, el, on: false };
    s.update = build(el, s);
    scenes.push(s);
    return s;
  }
  const px = (n) => n + 'px';

  // ---------------------------------------------------------------- helpers
  function makeRing(parent, { N = 14, cw, ch, R, srcs }) {
    const ring = h('div', 'abs', null, parent);
    ring.style.cssText += `left:50%;top:50%;width:0;height:0;transform-style:preserve-3d;`;
    const cards = [];
    for (let i = 0; i < N; i++) {
      const c = h('div', 'abs', null, ring);
      c.style.cssText += `left:${-cw / 2}px;top:${-ch / 2}px;width:${cw}px;height:${ch}px;transform-style:preserve-3d;`;
      const faces = [];
      for (const back of [false, true]) {
        const f = h('div', 'card', null, c);
        f.style.cssText += `inset:0;backface-visibility:hidden;-webkit-backface-visibility:hidden;${back ? 'transform:rotateY(180deg);' : ''}`;
        img(srcs[i % srcs.length], 'cover', f);
        faces.push(h('div', 'shade', null, f));
      }
      c.style.transform = `rotateY(${(i * 360) / N}deg) translateZ(${R}px)`;
      cards.push({ faces, a: (i * 360) / N });
    }
    return {
      ring,
      update(angle, tilt, z, y, fog = 0.85) {
        ring.style.transform = `translate3d(0,${y.toFixed(2)}px,${(z - R).toFixed(2)}px) rotateX(${tilt.toFixed(3)}deg) rotateY(${angle.toFixed(3)}deg)`;
        for (const k of cards) {
          const a = ((k.a + angle) * Math.PI) / 180;
          const depth = (Math.cos(a) + 1) / 2;
          const sh = (fog * Math.pow(1 - depth, 1.15)).toFixed(3);
          k.faces[0].style.opacity = sh;
          k.faces[1].style.opacity = sh;
        }
      },
    };
  }

  function odometer(parent, digits, cls) {
    const el = h('div', cls, null, parent);
    const cols = [];
    [...digits].forEach((d, i) => {
      const m = h('span', 'odo', null, el);
      m.style.cssText = 'display:inline-block;overflow:hidden;height:1em;line-height:1em;vertical-align:top;';
      const strip = h('span', null, null, m);
      strip.style.cssText = 'display:block;will-change:transform;';
      for (let k = 0; k < 30; k++) {
        const s = h('span', null, String(k % 10), strip);
        s.style.cssText = 'display:block;height:1em;line-height:1em;';
      }
      cols.push({ strip, from: Number(d) + (i % 2 ? 3 : 6) % 10, to: 20 + Number(d) });
    });
    return {
      el,
      update(t, start, stagger = 0.09, dur = 1.5) {
        cols.forEach((c, i) => {
          const p = P(t, start + i * stagger, start + i * stagger + dur, E.outExpo);
          c.strip.style.transform = `translate3d(0,${(-L(c.from, c.to, p)).toFixed(4)}em,0)`;
        });
      },
    };
  }

  const CURSOR = `<svg viewBox="0 0 28 28" width="44" height="44"><path d="M6 3 L6 23 L11.2 18.4 L14.8 25.6 L18.2 24 L14.6 16.9 L21.6 16.9 Z" fill="#fbfaf7" stroke="#0b0b0c" stroke-width="1.5" stroke-linejoin="round"/></svg>`;

  // ======================================================== 01 · COLD OPEN
  scene('intro', 0, 4.0, 10, (el) => {
    el.style.background = 'var(--ink)';
    const ebWrap = box(h('div', 'abs', null, el), 0, H / 2 - 8, W);
    ebWrap.style.textAlign = 'center';
    const eb = h('div', 'eyebrow', null, ebWrap);
    eb.style.display = 'inline-block';
    eb.style.fontSize = V ? '24px' : '19px';
    const dot = h('span', 'dot', null, eb);
    const label = 'Sosyal medya ajansı — İstanbul';
    const letters = [...label].map((c) => h('span', null, c === ' ' ? '&nbsp;' : c, eb));
    const caret = h('span', null, null, eb);
    caret.style.cssText = 'display:inline-block;width:2px;height:16px;background:var(--hot);margin-left:6px;vertical-align:-2px;';

    // image window
    const ww = V ? 640 : 560, wh = V ? 860 : 700;
    const win = box(h('div', 'abs', null, el), (W - ww) / 2, (H - wh) / 2 + (V ? 40 : 30), ww, wh);
    win.style.overflow = 'hidden';
    const shots = ['ring-04', 'ring-05', 'ring-09', 'ring-06', 'ring-11', 'ring-02', 'ring-10', 'ring-13'].map((n) => {
      const i = img(`${A}${n}.webp`, 'abs cover', win);
      i.style.inset = '0';
      return i;
    });
    const tint = h('div', 'fill', null, win);
    tint.style.background = 'linear-gradient(180deg, rgba(11,11,12,.15), rgba(11,11,12,.45))';

    const W4 = [
      { t: 1.5, txt: 'Strateji.', serif: false },
      { t: 2.0, txt: 'Prodüksiyon.', serif: true },
      { t: 2.5, txt: 'Tasarım.', serif: false },
      { t: 3.0, txt: 'Reklam.', serif: true },
    ].map((w) => {
      const e = box(h('div', 'abs ' + (w.serif ? 'serif' : 'sans'), w.txt, el), 0, 0, W);
      e.style.cssText += `text-align:center;line-height:1;mix-blend-mode:difference;color:#fff;white-space:nowrap;font-size:${w.serif ? (V ? 190 : 250) : V ? 160 : 210}px;`;
      e.style.top = px(H / 2 - (w.serif ? (V ? 105 : 140) : V ? 85 : 110) + (V ? 40 : 30));
      return { ...w, e };
    });

    return (t) => {
      // typewriter eyebrow
      const tw0 = 0.35, cps = 0.03;
      letters.forEach((l, i) => (l.style.visibility = t >= tw0 + i * cps ? 'visible' : 'hidden'));
      const typed = Math.min(letters.length, Math.max(0, Math.floor((t - tw0) / cps) + 1));
      caret.style.visibility = (t < tw0 + letters.length * cps + 0.2 ? true : Math.floor(t * 4) % 2 === 0) && t < 1.45 ? 'visible' : 'hidden';
      S(dot, { s: L(0, 1, P(t, 0.1, 0.5, E.outBack)) });
      const up = P(t, 1.2, 1.7, E.inOutQuart);
      S(ebWrap, { y: -up * (H / 2 - (V ? 260 : 150)), o: 1 - P(t, 3.4, 3.7) });
      void typed;

      // window opens like a shutter, then explodes to full frame into the drop
      const open = P(t, 1.42, 1.72, E.outExpo);
      const grow = P(t, 3.45, 4.0, E.inOutQuart);
      const x0 = (W - ww) / 2, y0 = (H - wh) / 2 + (V ? 40 : 30);
      // window rect interpolated toward full frame
      const rx = L(x0, 0, grow), ry = L(y0, 0, grow), rw = L(ww, W, grow), rh = L(wh, H, grow);
      box(win, rx, ry, rw, rh);
      S(win, { clip: `inset(${((1 - open) * 50).toFixed(3)}% 0 ${((1 - open) * 50).toFixed(3)}% 0 round ${(10 * (1 - grow)).toFixed(2)}px)`, o: t < 1.42 ? 0 : 1 });
      const k = Math.max(0, Math.min(shots.length - 1, Math.floor((t - 1.5) / 0.25)));
      shots.forEach((s, i) => {
        s.style.visibility = i === k ? 'visible' : 'hidden';
        if (i === k) {
          const lt = P(t, 1.5 + i * 0.25, 1.5 + (i + 1) * 0.25 + (i === shots.length - 1 ? 0.5 : 0));
          S(s, { s: 1.14 - 0.08 * E.outCubic(lt) + grow * 0.05 });
        }
      });
      tint.style.opacity = (1 - grow * 0.6).toFixed(3);

      W4.forEach((w, i) => {
        const on = t >= w.t && t < w.t + 0.5 && t < 3.45;
        if (!on) { w.e.style.visibility = 'hidden'; return; }
        const p = P(t, w.t, w.t + 0.42, E.outExpo);
        w.e.style.visibility = 'visible';
        if (!w.serif) w.e.style.fontStretch = (125 - 25 * p).toFixed(2) + '%';
        S(w.e, { s: 1.07 - 0.07 * p, o: P(t, w.t, w.t + 0.06) });
        void i;
      });
    };
  });

  // ============================================================== 02 · HERO
  const heroScene = scene('hero', 4.0, 10.15, 20, (el) => {
    el.style.background = 'radial-gradient(ellipse 85% 55% at 50% 100%, rgba(151,15,24,.34), rgba(11,11,12,0) 70%), var(--ink)';
    const wrap = box(h('div', 'abs', null, el), 0, 0, W, H);
    wrap.style.cssText += `perspective:${V ? 1600 : 1700}px;perspective-origin:50% ${V ? 40 : 36}%;`;
    const ringSrcs = Array.from({ length: 14 }, (_, i) => `${A}ring-${String(i + 1).padStart(2, '0')}.webp`);
    const ring = makeRing(wrap, V ? { cw: 300, ch: 400, R: 690, srcs: ringSrcs } : { cw: 262, ch: 350, R: 880, srcs: ringSrcs });

    const eb = box(h('div', 'abs eyebrow', `<span class="dot"></span>Sosyal medya ajansı — İstanbul, 2021’den beri`, el), 0, V ? 330 : 172, W);
    eb.style.textAlign = 'center';
    const title = words('Dijital çözüm|*ortağınız.*', 'abs sans', el);
    box(title.el, 0, V ? 380 : 208, W);
    title.el.style.cssText += `text-align:center;font-size:${V ? 132 : 156}px;line-height:${V ? 1.0 : 0.98};`;
    title.el.querySelectorAll('.serif').forEach((s) => (s.style.fontSize = '1.2em'));
    const ebm = h('div', 'fill', null, el); // dark falloff behind the title for legibility
    ebm.style.cssText += 'background:radial-gradient(ellipse 50% 32% at 50% 30%, rgba(11,11,12,.55), rgba(11,11,12,0));pointer-events:none;';
    el.insertBefore(ebm, eb);

    return (t) => {
      const lt = t - 4;
      const whirl = -150 * (1 - P(t, 4.0, 7.2, E.outCubic));
      const exitWhip = -150 * P(t, 9.2, 10.15, E.inCubic);
      const angle = whirl - 10 * lt + exitWhip;
      const dolly = L(-700, 0, P(t, 4.0, 6.2, E.outExpo)) + 90 * P(t, 6.2, 10, E.inOutCubic);
      const tilt = L(-24, -11, P(t, 4.0, 7.5, E.outCubic));
      ring.update(angle, tilt, dolly, V ? 330 : 165);

      S(eb, { o: P(t, 4.25, 4.7) * (1 - P(t, 9.15, 9.4)), y: 14 * (1 - P(t, 4.25, 4.9, E.outExpo)) });
      reveal(title.words, t, 4.02, { stagger: 0.09, dur: 1.0, outAt: 9.1, outStagger: 0.04 });
      ebm.style.opacity = (1 - P(t, 9.2, 9.6)).toFixed(3);
    };
  });
  void heroScene;

  // ============================================================= 03 · STATS
  scene('stats', 9.55, 16.25, 30, (el) => {
    el.style.background = 'var(--paper)';
    el.style.color = 'var(--ink)';
    const content = box(h('div', 'abs', null, el), 0, 0, W, H);

    // part A: statement + counters
    const eb = box(h('div', 'abs eyebrow', '<span class="dot"></span>Biz kimiz', content), G, V ? 330 : 182);
    eb.style.color = 'var(--graphite)';
    const stmt = words(
      V
        ? '2021’de markaların|dijitalde güçlü,|sürdürülebilir ve|*dikkat çekici* bir|varlık kurması için|yola çıktık.'
        : '2021’de markaların dijitalde güçlü,|sürdürülebilir ve *dikkat çekici* bir|varlık kurması için yola çıktık.',
      'abs sans', content);
    box(stmt.el, G, V ? 380 : 226, W - 2 * G);
    stmt.el.style.cssText += `font-size:${V ? 84 : 76}px;line-height:1.04;letter-spacing:-0.04em;`;

    const stats = [
      { n: '2021', suf: '', lab: 'Kuruluş yılı' },
      { n: '100', suf: '+', lab: 'İş birliği yapılan marka' },
      { n: '5', suf: ' ülke', lab: 'Uluslararası iletişim hattı' },
    ];
    const colW = V ? W - 2 * G : (W - 2 * G) / 3;
    const statEls = stats.map((s, i) => {
      const x = V ? G : G + i * colW;
      const y = V ? 990 + i * 265 : 590;
      const c = box(h('div', 'abs', null, content), x, y, colW - (V ? 0 : 40), V ? 230 : 360);
      const line = h('div', 'abs', null, c);
      line.style.cssText = 'left:0;right:0;top:0;height:1.5px;background:rgba(11,11,12,.18);transform-origin:0 0;';
      const num = h('div', 'abs sans', null, c);
      num.style.cssText += `left:0;top:${V ? 34 : 40}px;font-size:${V ? 176 : 236}px;line-height:1;letter-spacing:-0.06em;font-variant-numeric:tabular-nums;white-space:nowrap;display:flex;align-items:flex-start;`;
      const odo = odometer(num, s.n, 'odo-wrap');
      odo.el.style.display = 'inline-block';
      let suf = null;
      if (s.suf) {
        suf = h('span', s.suf.trim() === 'ülke' ? 'serif' : '', s.suf.trim() === 'ülke' ? '&nbsp;ülke' : '+', num);
        suf.style.cssText += s.suf === '+' ? 'color:var(--signal);' : `font-size:0.62em;line-height:1.5;letter-spacing:-0.02em;color:var(--ink);`;
      }
      const lab = h('div', 'abs eyebrow', s.lab, c);
      lab.style.cssText += `left:0;top:${V ? 196 : 306}px;color:var(--graphite);font-size:${V ? 20 : 15}px;`;
      if (V) { num.style.top = '30px'; lab.style.left = 'auto'; lab.style.right = '0'; lab.style.top = '70px'; }
      return { c, line, odo, suf, lab };
    });

    // part B: clients
    const eb2 = box(h('div', 'abs eyebrow', '<span class="dot"></span>Referanslar', content), G, V ? 330 : 182);
    eb2.style.color = 'var(--graphite)';
    const head2 = words('Yüzlerce markayla|*iş birliği.*', 'abs sans', content);
    box(head2.el, G, V ? 380 : 226, W - 2 * G);
    head2.el.style.cssText += `font-size:${V ? 120 : 116}px;line-height:1.0;`;
    const logos = ['fibabanka', 'kinetics', 'the-balance', 'lalin-cadde', 'dlux-professional'];
    const cols = V ? 2 : 3, cw = (W - 2 * G) / cols, chh = V ? 220 : 190;
    const gx = G, gy = V ? 820 : 560;
    const cells = [];
    for (let i = 0; i < 6; i++) {
      const cx = gx + (i % cols) * cw, cy = gy + Math.floor(i / cols) * chh;
      const cell = box(h('div', 'abs', null, content), cx, cy, cw, chh);
      const lt = h('div', 'abs', null, cell);
      lt.style.cssText = 'left:0;right:0;top:0;height:1.5px;background:rgba(11,11,12,.16);transform-origin:0 0;';
      const ll = h('div', 'abs', null, cell);
      ll.style.cssText = `left:0;top:0;bottom:0;width:1.5px;background:rgba(11,11,12,.16);transform-origin:0 0;${i % cols === 0 ? 'display:none;' : ''}`;
      const inner = h('div', 'fill', null, cell);
      inner.style.cssText += 'display:flex;align-items:center;justify-content:center;flex-direction:column;';
      if (i < 5) {
        const im = img(`assets/logos/${logos[i]}.png`, '', inner);
        im.style.cssText = `max-width:${V ? 300 : 300}px;max-height:${i === 4 ? 92 : 62}px;filter:invert(1) brightness(0.35);`;
      } else {
        const n = h('div', 'sans', '100+', inner);
        n.style.cssText += `font-size:${V ? 80 : 72}px;letter-spacing:-0.05em;`;
        const l = h('div', 'eyebrow', 'marka ve devam ediyor', inner);
        l.style.cssText += 'margin-top:14px;color:var(--graphite);font-size:13px;';
      }
      cells.push({ cell, lt, ll, inner });
    }

    return (t) => {
      // wipe-in from bottom with parallax
      const inP = P(t, 9.55, 10.12, E.inOutQuart);
      S(el, { clip: `inset(${((1 - inP) * H).toFixed(2)}px 0 0 0)` });
      const outP = P(t, 15.2, 16.2, E.inOutQuart);
      S(content, { y: (1 - inP) * 220 - outP * 140, o: 1 - outP * 0.5 });

      S(eb, { o: P(t, 10.0, 10.4) * (1 - P(t, 12.55, 12.8)) });
      reveal(stmt.words, t, 10.0, { stagger: 0.028, dur: 0.95, outAt: 12.5, outStagger: 0.012 });
      statEls.forEach((s, i) => {
        const st = 10.45 + i * 0.25;
        S(s.line, { sx: P(t, st - 0.1, st + 0.7, E.outExpo) });
        const outQ = P(t, 12.55 + i * 0.05, 13.05 + i * 0.05, E.inQuart);
        S(s.c, { y: -outQ * 80, o: 1 - outQ });
        s.odo.update(t, st, 0.08, 1.45);
        S(s.odo.el, { o: P(t, st, st + 0.15) });
        if (s.suf) S(s.suf, { o: P(t, st + 0.5, st + 0.8), x: 20 * (1 - P(t, st + 0.5, st + 1.1, E.outExpo)) });
        S(s.lab, { o: P(t, st + 0.3, st + 0.7) });
      });

      S(eb2, { o: P(t, 12.95, 13.3) });
      reveal(head2.words, t, 12.9, { stagger: 0.07, dur: 1.0 });
      cells.forEach((c, i) => {
        const st = 13.15 + i * 0.09;
        S(c.lt, { sx: P(t, st, st + 0.8, E.outExpo) });
        S(c.ll, { sy: P(t, st + 0.1, st + 0.9, E.outExpo) });
        S(c.inner, { o: P(t, st + 0.15, st + 0.55), y: 34 * (1 - P(t, st + 0.15, st + 1.0, E.outExpo)) });
      });
    };
  });

  // ========================================================== 04 · SERVICES
  const SVC = [
    { t: 16, img: 'instagram-tepsi', n: '01', title: 'Sosyal Medya|Yönetimi', sub: 'İçerikler tesadüfen değil,|stratejiyle üretilir.', chips: ['İçerik stratejisi', 'Fotoğraf & video çekimi', 'Kreatif tasarım', 'İçerik planlama', 'Hesap & topluluk yönetimi', 'Performans analizi'] },
    { t: 20, img: 'telefon-tepsi', n: '02', title: 'Web Tasarım|& Kurulum', sub: 'Dijitalde güçlü bir|ilk izlenim bırakın.', chips: ['Modern tasarım', 'Mobil uyumlu yapı', 'SEO altyapısı', 'Hızlı & güvenli altyapı', 'Yayın sonrası destek'] },
    { t: 24, img: 'meta-tepsi', n: '03', title: 'Meta & Google|Reklamları', sub: 'Görüntülenme değil,|müşteri.', chips: ['Hedef kitle analizi', 'Reklam stratejisi', 'Sürekli optimizasyon', 'Şeffaf raporlama'] },
  ];
  // where the tray object sits on screen (used by the card transition)
  const IMG = V ? { x: 40, y: 840, w: 1000, h: 1333 } : { x: 1010, y: -70, w: 930, h: 1240 };
  const OBJ = { x: IMG.x + IMG.w * 0.5, y: IMG.y + IMG.h * 0.47 };

  scene('services', 15.1, 28.1, 40, (el) => {
    const content = box(h('div', 'abs', null, el), 0, 0, W, H);
    content.style.background = V
      ? 'radial-gradient(ellipse 85% 45% at 50% 72%, #b7212d 0%, #9a1520 40%, #7c070f 78%, #5f050c 100%)'
      : 'radial-gradient(ellipse 58% 80% at 77% 47%, #b7212d 0%, #9a1520 40%, #7c070f 78%, #5f050c 100%)';
    const imgs = SVC.map((s) => {
      const holder = box(h('div', 'abs', null, content), IMG.x, IMG.y, IMG.w, IMG.h);
      holder.style.cssText += '-webkit-mask-image:radial-gradient(ellipse 50% 50% at 50% 50%, #000 62%, transparent 100%);mask-image:radial-gradient(ellipse 50% 50% at 50% 50%, #000 62%, transparent 100%);';
      const i = img(`${A}${s.img}.webp`, 'cover', holder);
      i.style.transformOrigin = '50% 47%';
      return { holder, i };
    });
    const eb = box(h('div', 'abs eyebrow', '<span class="dot" style="background:var(--bone)"></span>Hizmetler', content), G, V ? 250 : 190);
    const ctr = box(h('div', 'abs', null, content), G, V ? 300 : 236);
    ctr.style.cssText += `font-size:${V ? 26 : 19}px;letter-spacing:.12em;font-weight:500;color:rgba(251,250,247,.75);display:flex;gap:10px;`;
    const ctrN = h('span', null, null, ctr);
    ctrN.style.cssText = 'display:inline-block;height:1.2em;overflow:hidden;line-height:1.2em;';
    const ctrStrip = h('span', null, '01<br>02<br>03', ctrN);
    ctrStrip.style.cssText = 'display:block;';
    h('span', null, '/ 03', ctr);

    const groups = SVC.map((s) => {
      const g = { s };
      g.title = words(s.title, 'abs sans', content);
      box(g.title.el, G, V ? 350 : 284, V ? W - 2 * G : 900);
      g.title.el.style.cssText += `font-size:${V ? 112 : 116}px;line-height:0.98;`;
      g.sub = words(s.sub, 'abs serif', content);
      box(g.sub.el, G, V ? 600 : 545, V ? W - 2 * G : 860);
      g.sub.el.style.cssText += `font-size:${V ? 56 : 50}px;line-height:1.08;color:rgba(251,250,247,.9);`;
      const chipWrap = box(h('div', 'abs', null, content), G, V ? 1480 : 724, V ? W - 2 * G : 820);
      chipWrap.style.cssText += 'display:flex;flex-wrap:wrap;';
      g.chips = s.chips.map((c) => h('span', 'chip', c, chipWrap));
      if (V) chipWrap.style.top = px(780);
      return g;
    });
    const flash = h('div', 'fill', null, content);
    flash.style.cssText += 'background:#fff;opacity:0;mix-blend-mode:soft-light;';

    return (t) => {
      // card rises from below, then opens to full frame
      const rise = P(t, 15.1, 15.62, E.outExpo);
      const open = P(t, 15.55, 16.05, E.inOutQuart);
      const cw0 = V ? 520 : 420, ch0 = V ? 640 : 540;
      const cx = OBJ.x, cy = L(OBJ.y + H * 0.85, OBJ.y, rise);
      const top = L(cy - ch0 / 2, 0, open), bottom = L(H - (cy + ch0 / 2), 0, open);
      const left = L(cx - cw0 / 2, 0, open), right = L(W - (cx + cw0 / 2), 0, open);
      S(el, { clip: inset(top, right, bottom, left, L(18, 0, open)) });

      // push-out to the project scene
      const push = P(t, 27.45, 28.05, E.inOutQuart);
      S(content, { x: -push * W * 0.32, bright: 1 - push * 0.45 });

      const k = t < 20 ? 0 : t < 24 ? 1 : 2;
      imgs.forEach((im, i) => {
        im.holder.style.visibility = i === k ? 'visible' : 'hidden';
        if (i === k) {
          const s = SVC[i];
          const punch = i === 0 ? 0 : 1 - P(t, s.t, s.t + 0.7, E.outExpo);
          const intro = i === 0 ? 0.12 * (1 - P(t, 15.3, 16.6, E.outExpo)) : 0;
          S(im.i, { s: 1 + 0.085 * punch + intro + 0.012 * (t - s.t) });
        }
      });
      const fl = Math.max(env(t, 19.96, 20.0, 20.04, 20.3), env(t, 23.96, 24.0, 24.04, 24.3));
      flash.style.opacity = (fl * 0.55).toFixed(3);

      S(eb, { o: P(t, 15.95, 16.3) });
      S(ctr, { o: P(t, 16.05, 16.4) });
      const roll = P(t, 19.92, 20.4, E.outExpo) + P(t, 23.92, 24.4, E.outExpo);
      ctrStrip.style.transform = `translate3d(0,${(-roll * 1.2).toFixed(4)}em,0)`;

      groups.forEach((g, i) => {
        const tin = i === 0 ? 15.85 : g.s.t + 0.02;
        const tout = g.s.t + 3.5;
        const last = i === 2;
        reveal(g.title.words, t, tin, { stagger: 0.07, dur: 0.95, outAt: last ? null : tout, outStagger: 0.03, outDur: 0.42 });
        reveal(g.sub.words, t, tin + 0.22, { stagger: 0.035, dur: 0.9, outAt: last ? null : tout + 0.04, outStagger: 0.012, outDur: 0.4 });
        g.chips.forEach((c, j) => {
          const st = tin + 0.45 + j * 0.07;
          const pin = P(t, st, st + 0.7, E.outExpo);
          const pout = last ? 0 : P(t, tout + j * 0.02, tout + 0.3 + j * 0.02, E.inQuart);
          S(c, { o: Math.min(P(t, st, st + 0.25), 1 - pout), y: 26 * (1 - pin) - 20 * pout, s: 0.92 + 0.08 * pin });
        });
      });
    };
  });

  // ============================================================ 05 · WORK
  scene('work', 27.45, 34.0, 50, (el) => {
    el.style.background = 'var(--paper)';
    el.style.color = 'var(--ink)';
    const shadow = h('div', 'abs', null, el);
    shadow.style.cssText += 'left:-60px;top:0;bottom:0;width:60px;background:linear-gradient(90deg,rgba(0,0,0,0),rgba(0,0,0,.25));';
    const eb = box(h('div', 'abs eyebrow', '<span class="dot"></span>Seçili proje', el), G, V ? 250 : 232);
    eb.style.color = 'var(--graphite)';
    const title = words('Dlux|Professional', 'abs sans', el);
    box(title.el, G, V ? 296 : 272, 800);
    title.el.style.cssText += `font-size:${V ? 120 : 112}px;line-height:0.98;`;
    const by = words('*by Selin Demirel*', 'abs serif', el);
    box(by.el, G, V ? 540 : 500, 700);
    by.el.style.cssText += `font-size:${V ? 58 : 50}px;color:var(--graphite);`;
    const meta = [['Hizmet', 'Web Tasarım & Kurulum'], ['Tür', 'E-ticaret sitesi'], ['Sektör', 'Güzellik & kirpik']];
    const rows = meta.map(([k, v], i) => {
      const r = box(h('div', 'abs', null, el), G, (V ? 1300 : 640) + i * (V ? 96 : 84), V ? W - 2 * G : 600, V ? 96 : 84);
      const ln = h('div', 'abs', null, r);
      ln.style.cssText = 'left:0;right:0;top:0;height:1.5px;background:rgba(11,11,12,.16);transform-origin:0 0;';
      const kk = h('div', 'abs eyebrow', k, r);
      kk.style.cssText += `left:0;top:${V ? 38 : 34}px;color:var(--graphite);font-size:${V ? 18 : 13}px;`;
      const vv = h('div', 'abs', v, r);
      vv.style.cssText += `left:${V ? 300 : 190}px;top:${V ? 28 : 25}px;font-size:${V ? 32 : 25}px;letter-spacing:-0.015em;`;
      return { r, ln, kk, vv };
    });

    const bw = V ? 960 : 1000, sh = Math.round(bw * 736 / 1440);
    const persp = box(h('div', 'abs', null, el), 0, 0, W, H);
    persp.style.cssText += `perspective:2400px;perspective-origin:${V ? '50% 45%' : '70% 50%'};`;
    const br = box(h('div', 'browser', null, persp), V ? (W - bw) / 2 : 830, V ? 690 : (H - sh - 46) / 2 + 10, bw, sh + 46);
    const bar = h('div', 'bar', '<b></b><b></b><b></b>', br);
    h('div', 'url', '<svg width="11" height="11" viewBox="0 0 12 12"><path d="M3 5V3.6a3 3 0 0 1 6 0V5M2.2 5h7.6v6H2.2z" fill="none" stroke="#9b9993" stroke-width="1.2"/></svg>Dlux Professional', bar);
    const scr = h('div', 'screen', null, br);
    scr.style.height = sh + 'px';
    const frame = h('img', '', null, scr);
    const frames = [];
    for (let i = 1; i <= 270; i++) frames.push(`assets/dlux/f${String(i).padStart(3, '0')}.jpg`);
    // warm the cache so per-frame swaps are instant
    frames.forEach((f) => { const im = new Image(); im.src = f; decodes.push(im.decode().catch(() => {})); });
    let cur = -1;

    return (t) => {
      const inP = P(t, 27.45, 28.05, E.inOutQuart);
      S(el, { x: (1 - inP) * W });
      shadow.style.opacity = (1 - inP).toFixed(3);
      S(eb, { o: P(t, 28.0, 28.4) });
      reveal(title.words, t, 28.0, { stagger: 0.08, dur: 1.0 });
      reveal(by.words, t, 28.3, { dur: 1.0 });
      rows.forEach((r, i) => {
        const st = 28.55 + i * 0.12;
        S(r.ln, { sx: P(t, st, st + 0.8, E.outExpo) });
        S(r.kk, { o: P(t, st + 0.1, st + 0.4) });
        S(r.vv, { o: P(t, st + 0.15, st + 0.45), y: 16 * (1 - P(t, st + 0.15, st + 0.9, E.outExpo)) });
      });
      const e = P(t, 27.85, 29.1, E.outExpo);
      const drift = P(t, 29.1, 34, E.inOutCubic);
      S(br, {
        x: (1 - e) * (V ? 0 : 300), y: (1 - e) * (V ? 260 : 40), z: (1 - e) * -500,
        ry: L(V ? -30 : -34, V ? -6 : -9, e) + (V ? 4 : 5) * drift,
        rx: L(18, 4, e) - 2 * drift,
        r: (1 - e) * 4,
      });
      const fi = Math.max(0, Math.min(269, Math.floor((t - 28.25) * 45)));
      if (fi !== cur) { frame.src = frames[fi]; cur = fi; }
    };
  });

  // ======================================================= 06 · PRODUCTION
  const WORK = [
    ['kafe-tanitim-filmi', 'Kafe tanıtım filmi'], ['showroom-cekimi', 'Showroom çekimi'], ['roportaj-cekimi', 'Röportaj çekimi'],
    ['guzellik-merkezi-cekimi', 'Güzellik merkezi çekimi'], ['konsept-video-cekimi', 'Konsept video çekimi'], ['restoran-icerik-cekimi', 'Restoran içerik çekimi'],
    ['mekan-cekimi', 'Mekân çekimi'], ['sahne-cekimi', 'Sahne çekimi'], ['konsept-cekim-dergi', 'Konsept fotoğraf çekimi'],
    ['guzellik-salonu-set', 'Güzellik salonu çekimi'], ['roportaj-studyo', 'Stüdyo röportajı'], ['sosyal-medya-tasarimi', 'Sosyal medya tasarımı'],
  ];
  scene('production', 33.35, 42.0, 60, (el) => {
    const bars = Array.from({ length: 6 }, (_, i) => {
      const b = box(h('div', 'abs', null, el), (i * W) / 6 - 1, 0, W / 6 + 2, H);
      b.style.background = 'var(--ink)';
      return b;
    });
    const content = box(h('div', 'abs', null, el), 0, 0, W, H);
    content.style.background = 'var(--ink)';

    // gallery wall
    const persp = box(h('div', 'abs', null, content), 0, 0, W, H);
    persp.style.cssText += 'perspective:1900px;perspective-origin:50% 50%;';
    const wall = box(h('div', 'abs', null, persp), W / 2, H / 2, 0, 0);
    wall.style.transformStyle = 'preserve-3d';
    const NC = V ? 4 : 6, cardW = V ? 300 : 320, cardH = Math.round(cardW * 4 / 3), gap = 26;
    const pool = [...WORK.map((w) => w[0]), 'ring-02', 'ring-14', 'ring-07', 'ring-12'];
    const r0 = rng(7);
    const columns = Array.from({ length: NC }, (_, c) => {
      const col = h('div', 'abs', null, wall);
      col.style.cssText += `left:${(c - NC / 2) * (cardW + gap) + gap / 2}px;top:0;width:${cardW}px;`;
      const n = 8;
      const items = [];
      for (let k = 0; k < n; k++) {
        const name = pool[(c * 5 + k * 3 + Math.floor(r0() * 3)) % pool.length];
        const card = box(h('div', 'card', null, col), 0, k * (cardH + gap), cardW, cardH);
        img(`${A}${name}.webp`, '', card);
        items.push(card);
      }
      return { col, speed: (c % 2 ? -1 : 1) * (60 + 18 * (c % 3)), base: -((c * 173) % (cardH + gap)) - 2.2 * (cardH + gap), loop: 4 * (cardH + gap) };
    });
    const wallShade = h('div', 'fill', null, content);
    wallShade.style.cssText += 'background:linear-gradient(90deg, var(--ink) 0%, rgba(11,11,12,.92) 30%, rgba(11,11,12,.25) 62%, rgba(11,11,12,0) 80%);';
    if (V) wallShade.style.background = 'linear-gradient(180deg, var(--ink) 0%, rgba(11,11,12,.9) 34%, rgba(11,11,12,.2) 60%, rgba(11,11,12,0) 80%)';

    const eb = box(h('div', 'abs eyebrow', '<span class="dot"></span>Prodüksiyon', content), G, V ? 250 : 232);
    eb.style.color = 'var(--smoke)';
    const title = words('Sahadan|*kareler.*', 'abs sans', content);
    box(title.el, G, V ? 290 : 272, 1000);
    title.el.style.cssText += `font-size:${V ? 170 : 172}px;line-height:0.96;`;
    title.el.querySelectorAll('.serif').forEach((s) => (s.style.fontSize = '1.12em'));
    const desc = words(
      V ? 'Kafeden showroom’a, röportajdan|konsept çekime; çekim öncesinden|paylaşım sonrasına kadar her adımı|biz planlıyor, sahada biz üretiyoruz.'
        : 'Kafeden showroom’a, röportajdan konsept|çekime; çekim öncesinden paylaşım sonrasına|kadar her adımı biz planlıyor, sahada biz|üretiyoruz.',
      'abs', content);
    box(desc.el, G, V ? 660 : 690, 640);
    desc.el.style.cssText += `font-size:${V ? 32 : 24}px;line-height:1.42;color:var(--smoke);letter-spacing:-0.01em;`;

    // centred statement over the flattened wall
    const dim = h('div', 'fill', null, content);
    dim.style.cssText += 'background:rgba(11,11,12,.62);opacity:0;';
    const big = words(V ? 'Her kare|*bir hikâye.*' : 'Her kare *bir hikâye.*', 'abs sans', content);
    box(big.el, 0, V ? 760 : 430, W);
    big.el.style.cssText += `text-align:center;font-size:${V ? 150 : 170}px;line-height:1;`;
    big.el.querySelectorAll('.serif').forEach((s) => (s.style.fontSize = '1.1em'));

    // triptych montage
    const tri = box(h('div', 'abs', null, content), 0, 0, W, H);
    tri.style.background = 'var(--ink)';
    const NP = 3, pg = 14;
    const pw = V ? W : (W - pg * (NP + 1)) / NP, ph = V ? (H - pg * (NP + 1)) / NP : H - 2 * pg;
    const panels = Array.from({ length: NP }, (_, p) => {
      const pan = box(h('div', 'abs', null, tri), V ? 0 : pg + p * (pw + pg), V ? pg + p * (ph + pg) : pg, pw, ph);
      pan.style.overflow = 'hidden';
      pan.style.borderRadius = '10px';
      const seq = [0, 1, 2, 3].map((k) => WORK[(p * 4 + k * 1 + p) % WORK.length]);
      const ims = seq.map(([n]) => { const i = img(`${A}${n}.webp`, 'abs cover', pan); i.style.inset = '0'; return i; });
      const cap = h('div', 'abs', null, pan);
      cap.style.cssText += `left:22px;bottom:22px;right:22px;display:flex;justify-content:space-between;font-size:${V ? 22 : 16}px;letter-spacing:.02em;color:var(--bone);text-shadow:0 1px 12px rgba(0,0,0,.5);`;
      const capL = h('span', null, '', cap), capR = h('span', null, '', cap);
      return { pan, ims, seq, capL, capR };
    });

    return (t) => {
      // shutter bars fall in over the project scene
      bars.forEach((b, i) => {
        const st = 33.35 + i * 0.045;
        S(b, { y: -H * (1 - P(t, st, st + 0.5, E.inOutQuart)) });
      });
      const ready = t >= 33.95;
      content.style.visibility = ready ? 'visible' : 'hidden';
      if (!ready) return;

      // wall: tilted on the right → flat full-frame
      const flat = P(t, 36.55, 37.45, E.inOutQuart);
      S(wall, V
        ? { x: L(0, 0, flat), y: L(420, 0, flat), z: L(-260, 40, flat), rx: L(26, 0, flat), ry: L(0, 0, flat), r: L(-8, 0, flat), s: L(0.95, 1.08, flat) }
        : { x: L(560, 0, flat), y: L(20, 0, flat), z: L(-320, 60, flat), rx: L(14, 0, flat), ry: L(-26, 0, flat), r: L(6, 0, flat), s: L(0.95, 1.06, flat) });
      columns.forEach((c) => {
        let y = c.base + c.speed * (t - 34) * (1 + 0.8 * flat);
        y = ((y % c.loop) - c.loop) % c.loop;
        S(c.col, { y: y - c.loop * 0.25 });
      });
      wallShade.style.opacity = (1 - flat).toFixed(3);
      S(eb, { o: P(t, 34.05, 34.4) * (1 - P(t, 36.4, 36.6)) });
      reveal(title.words, t, 34.0, { stagger: 0.1, dur: 1.0, outAt: 36.35, outStagger: 0.05, outDur: 0.4 });
      reveal(desc.words, t, 34.45, { stagger: 0.012, dur: 0.9, outAt: 36.3, outStagger: 0.004, outDur: 0.35 });

      const dimP = P(t, 37.6, 38.1) * (1 - P(t, 39.7, 39.95));
      dim.style.opacity = dimP.toFixed(3);
      reveal(big.words, t, 37.8, { stagger: 0.08, dur: 0.9, outAt: 39.6, outStagger: 0.04, outDur: 0.35 });

      // montage — panels cut on staggered 8ths, a new image every beat
      const mon = t >= 40.0;
      tri.style.visibility = mon ? 'visible' : 'hidden';
      if (mon) {
        panels.forEach((p, i) => {
          const lt = t - 40.0 - i * 0.125;
          const k = Math.max(0, Math.min(3, Math.floor(lt / 0.5)));
          p.ims.forEach((im, j) => {
            im.style.visibility = j === k ? 'visible' : 'hidden';
            if (j === k) S(im, { s: 1.12 - 0.1 * E.outExpo(Math.max(0, Math.min(1, (lt - k * 0.5) / 0.5))) });
          });
          p.capL.textContent = p.seq[k][1];
          p.capR.textContent = String(((i * 4 + k) % 12) + 1).padStart(2, '0');
          S(p.pan, { o: lt < 0 ? 0 : 1, y: lt < 0 ? 0 : (V ? 0 : 60 * (1 - E.outExpo(Math.min(1, lt / 0.4)))) });
        });
      }
    };
  });

  // ============================================ 06b · MARQUEE (transition)
  scene('marquee', 41.25, 42.95, 75, (el) => {
    const mk = (bg, fg, deg, serif) => {
      const b = h('div', 'band', null, el);
      b.style.cssText += `height:${V ? 230 : 250}px;top:${(H - (V ? 230 : 250)) / 2}px;background:${bg};color:${fg};transform-origin:50% 50%;`;
      const tr = h('div', 'track', null, b);
      const phrase = serif
        ? '<span class="serif">Farklı fikirler, özgün içerikler</span><span class="star">✶</span><span>Dijital çözüm ortağınız</span><span class="star">✶</span>'
        : '<span>Dijital çözüm ortağınız</span><span class="star">✶</span><span class="serif">Farklı fikirler, özgün içerikler</span><span class="star">✶</span>';
      tr.innerHTML = phrase.repeat(5);
      tr.style.cssText += `font-size:${V ? 120 : 140}px;letter-spacing:-0.04em;line-height:1;`;
      tr.querySelectorAll('.serif').forEach((s) => (s.style.letterSpacing = '-0.02em'));
      return { b, tr, deg };
    };
    const b1 = mk('var(--signal)', 'var(--bone)', -7, false);
    const b2 = mk('var(--bone)', 'var(--ink)', 5, true);
    b2.tr.querySelectorAll('.star').forEach((s) => (s.style.color = 'var(--signal)'));
    return (t) => {
      const inP = P(t, 41.25, 41.75, E.outExpo);
      const outP = P(t, 42.35, 42.95, E.inQuart);
      const d = V ? 1300 : 900;
      S(b1.b, { y: L(d, 0, inP) - outP * d * 1.2 - 70, r: b1.deg });
      S(b2.b, { y: L(-d, 0, inP) + outP * d * 1.2 + 90, r: b2.deg });
      S(b1.tr, { x: -900 - (t - 41.25) * 900 });
      S(b2.tr, { x: -2600 + (t - 41.25) * 900 });
    };
  });

  // ========================================================== 07 · PROCESS
  scene('process', 42.0, 48.1, 70, (el) => {
    el.style.background = 'var(--paper)';
    el.style.color = 'var(--ink)';
    const eb = box(h('div', 'abs eyebrow', '<span class="dot"></span>Nasıl çalışıyoruz', el), G, V ? 250 : 190);
    eb.style.color = 'var(--graphite)';
    const head = words('Çekim öncesinden|*paylaşım sonrasına.*', 'abs sans', el);
    box(head.el, G, V ? 296 : 234, W - 2 * G);
    head.el.style.cssText += `font-size:${V ? 104 : 108}px;line-height:1.0;`;
    const steps = [
      ['Strateji', 'Markanızı, sektörünüzü ve hedef kitlenizi analiz ediyor; iletişim dilinizi belirliyoruz.'],
      ['Prodüksiyon', 'Özgün fotoğraf ve video çekimleri, markanıza özel kreatif tasarımlar hazırlıyoruz.'],
      ['Yayın & yönetim', 'Düzenli içerik planıyla hesaplarınızı yönetiyor, etkileşimi canlı tutuyoruz.'],
      ['Analiz', 'Performansı ölçüyor; strateji, içerik ve reklamları verilerle optimize ediyoruz.'],
    ];
    const lineY = V ? 640 : 590;
    const track = box(h('div', 'abs', null, el), G, lineY, V ? 2 : W - 2 * G, V ? 1120 : 2);
    track.style.background = 'rgba(11,11,12,.14)';
    const prog = h('div', 'abs', null, track);
    prog.style.cssText = `left:0;top:0;${V ? 'width:2px;height:100%;transform-origin:0 0;' : 'height:2px;width:100%;transform-origin:0 0;'}background:var(--signal);`;
    const head2 = h('div', 'abs', null, el);
    head2.style.cssText += 'width:16px;height:16px;border-radius:50%;background:var(--signal);box-shadow:0 0 0 8px rgba(151,15,24,.15);';
    const colW = (W - 2 * G) / 4;
    const items = steps.map(([ti, de], i) => {
      const x = V ? G + 70 : G + i * colW, y = V ? lineY + 40 + i * 270 : lineY + 40;
      const c = box(h('div', 'abs', null, el), x, y, V ? W - 2 * G - 70 : colW - 50, 260);
      const node = h('div', 'abs', null, el);
      node.style.cssText += `left:${V ? G - 6 : x - 6}px;top:${V ? y + 30 : lineY - 6}px;width:14px;height:14px;border-radius:50%;border:2px solid rgba(11,11,12,.35);background:var(--paper);`;
      const num = h('div', 'abs serif', '0' + (i + 1), c);
      num.style.cssText += `left:0;top:${V ? -20 : -4}px;font-size:${V ? 110 : 132}px;line-height:1;color:var(--signal);`;
      const tt = h('div', 'abs', ti, c);
      tt.style.cssText += `left:${V ? 150 : 0}px;top:${V ? 6 : 150}px;font-size:${V ? 46 : 42}px;letter-spacing:-0.03em;font-weight:500;white-space:nowrap;`;
      const dd = h('div', 'abs', de, c);
      dd.style.cssText += `left:${V ? 150 : 0}px;top:${V ? 70 : 214}px;width:${V ? 680 : 370}px;font-size:${V ? 28 : 22}px;line-height:1.45;color:var(--graphite);letter-spacing:-0.005em;`;
      return { c, num, tt, dd, node };
    });

    return (t) => {
      S(eb, { o: P(t, 42.35, 42.7) });
      reveal(head.words, t, 42.35, { stagger: 0.07, dur: 1.0 });
      S(track, V ? { sy: P(t, 42.6, 43.4, E.outExpo) } : { sx: P(t, 42.6, 43.4, E.outExpo) });
      track.style.transformOrigin = '0 0';
      const pr = P(t, 42.9, 46.4, E.inOutCubic);
      S(prog, V ? { sy: pr } : { sx: pr });
      const hx = V ? G - 7 : G + pr * (W - 2 * G) - 8, hy = V ? lineY + pr * 1120 - 8 : lineY - 7;
      box(head2, hx, hy);
      S(head2, { o: P(t, 42.9, 43.1) });
      items.forEach((it, i) => {
        const st = 43.0 + i * 1.0;
        S(it.num, { o: P(t, st, st + 0.2), y: 50 * (1 - P(t, st, st + 0.8, E.outExpo)) });
        S(it.tt, { o: P(t, st + 0.1, st + 0.35), y: 24 * (1 - P(t, st + 0.1, st + 0.9, E.outExpo)) });
        S(it.dd, { o: P(t, st + 0.2, st + 0.55), y: 18 * (1 - P(t, st + 0.2, st + 1.0, E.outExpo)) });
        const act = P(t, st, st + 0.15);
        it.node.style.background = act > 0.5 ? 'var(--signal)' : 'var(--paper)';
        it.node.style.borderColor = act > 0.5 ? 'var(--signal)' : 'rgba(11,11,12,.35)';
        S(it.node, { s: 1 + 0.5 * env(t, st, st + 0.12, st + 0.12, st + 0.5) });
      });
    };
  });

  // ====================================================== 08 · TESTIMONIAL
  const CIRC = V ? { x: G, y: 640 + 1120 } : { x: W - G, y: 590 };
  scene('testimonial', 47.35, 52.0, 80, (el) => {
    const content = box(h('div', 'abs', null, el), 0, 0, W, H);
    content.style.background = V
      ? 'radial-gradient(ellipse 85% 40% at 50% 74%, #b7212d 0%, #9a1520 40%, #7c070f 78%, #5f050c 100%)'
      : 'radial-gradient(ellipse 55% 80% at 24% 50%, #b7212d 0%, #9a1520 40%, #7c070f 78%, #5f050c 100%)';
    const holder = box(h('div', 'abs', null, content), V ? 60 : -40, V ? 900 : -60, V ? 960 : 900, V ? 1280 : 1200);
    holder.style.cssText += '-webkit-mask-image:radial-gradient(ellipse 50% 50% at 50% 50%, #000 62%, transparent 100%);mask-image:radial-gradient(ellipse 50% 50% at 50% 50%, #000 62%, transparent 100%);';
    const im = img(`${A}yorum-tepsi.webp`, 'cover', holder);
    const X = V ? G : 920;
    const eb = box(h('div', 'abs eyebrow', '<span class="dot" style="background:var(--bone)"></span>Müşterilerimizden', content), X, V ? 250 : 236);
    const qm = box(h('div', 'abs serif', '“', content), X - 10, V ? 300 : 262);
    qm.style.cssText += `font-size:${V ? 260 : 230}px;line-height:1;color:rgba(251,250,247,.32);`;
    const quote = words(
      V ? 'Kısa sürede farkını|fazlasıyla ortaya|koydu. *Socialp Media*|*farkı* diyebiliriz!'
        : 'Kısa sürede farkını fazlasıyla|ortaya koydu. *Socialp Media*|*farkı* diyebiliriz!',
      'abs sans', content);
    box(quote.el, X, V ? 470 : 432, W - X - G + 40);
    quote.el.style.cssText += `font-size:${V ? 80 : 72}px;line-height:1.08;letter-spacing:-0.035em;`;
    const tag = box(h('div', 'abs', null, content), X, V ? 840 : 742);
    tag.style.cssText += 'display:flex;align-items:center;gap:18px;';
    const stars = h('div', null, '★★★★★', tag);
    stars.style.cssText = `font-size:${V ? 30 : 24}px;letter-spacing:4px;color:var(--bone);`;
    h('div', 'chip', 'Sosyal medya yönetimi', tag).style.margin = '0';

    return (t) => {
      const r = P(t, 47.35, 48.02, E.inOutQuart) * Math.hypot(W, H) * 1.05;
      S(el, { clip: `circle(${r.toFixed(2)}px at ${CIRC.x}px ${CIRC.y}px)` });
      S(im, { s: 1.08 - 0.06 * P(t, 47.4, 52, E.outCubic) });
      S(eb, { o: P(t, 48.0, 48.35) });
      S(qm, { o: P(t, 48.05, 48.4), y: 30 * (1 - P(t, 48.05, 48.9, E.outExpo)) });
      reveal(quote.words, t, 48.1, { stagger: 0.045, dur: 0.9 });
      S(tag, { o: P(t, 49.2, 49.5), y: 20 * (1 - P(t, 49.2, 49.9, E.outExpo)) });
      // breathe out before the final drop
      const out = P(t, 51.3, 51.95, E.inQuart);
      S(content, { s: 1 - 0.05 * out, bright: 1 - 0.85 * out });
    };
  });

  // ============================================================== 09 · CTA
  let btnRect = null;
  let measureBtn = null;
  scene('cta', 52.0, 57.6, 90, (el) => {
    el.style.background = 'radial-gradient(ellipse 80% 55% at 50% 100%, rgba(151,15,24,.3), rgba(11,11,12,0) 70%), var(--ink)';
    const wrap = box(h('div', 'abs', null, el), 0, 0, W, H);
    wrap.style.cssText += `perspective:1700px;perspective-origin:50% ${V ? 60 : 50}%;opacity:.0;`;
    const ringSrcs = Array.from({ length: 14 }, (_, i) => `${A}ring-${String(14 - i).padStart(2, '0')}.webp`);
    const ring = makeRing(wrap, V ? { cw: 230, ch: 306, R: 620, srcs: ringSrcs } : { cw: 240, ch: 320, R: 900, srcs: ringSrcs });
    const veil = h('div', 'fill', null, el);
    veil.style.background = 'radial-gradient(ellipse 60% 50% at 50% 46%, rgba(11,11,12,.86), rgba(11,11,12,.35))';

    const eb = box(h('div', 'abs eyebrow', '<span class="dot"></span>Markanız için üretiyoruz', el), 0, V ? 520 : 222, W);
    eb.style.textAlign = 'center';
    const l1 = h('div', 'abs sans', null, el);
    box(l1, 0, V ? 580 : 262, W);
    l1.style.cssText += `text-align:center;font-size:${V ? 150 : 196}px;line-height:1;white-space:nowrap;`;
    const w1 = ['Dijitalde', 'güçlü'].map((w) => { const s = h('span', null, w, l1); s.style.display = 'inline-block'; s.style.margin = '0 0.12em'; return s; });
    const l2 = h('div', 'abs serif', 'görünün<span style="color:var(--hot)">.</span>', el);
    box(l2, 0, V ? 740 : 452, W);
    l2.style.cssText += `text-align:center;font-size:${V ? 210 : 250}px;line-height:1;white-space:nowrap;`;
    const subl = box(h('div', 'abs', V ? 'Hedeflerinizi anlatın; markanıza özel<br>yol haritasını birlikte çizelim.' : 'Hedeflerinizi anlatın; markanıza özel yol haritasını birlikte çizelim.', el), 0, V ? 1000 : 724, W);
    subl.style.cssText += `text-align:center;font-size:${V ? 34 : 27}px;color:var(--smoke);letter-spacing:-0.01em;line-height:1.4;`;
    const row = box(h('div', 'abs', null, el), 0, V ? 1150 : 806, W);
    row.style.cssText += `display:flex;justify-content:center;gap:16px;${V ? 'flex-direction:column;align-items:center;' : ''}`;
    const b1 = h('div', 'btn solid', 'Projenizi konuşalım <span class="arr" style="display:inline-block">→</span>', row);
    const b2 = h('div', 'btn ghost', 'WhatsApp’tan yazın', row);
    const b3 = h('div', 'btn ghost', 'hello@socialpmedia.com', row);
    const arr = b1.querySelector('.arr');
    measureBtn = () => {
      const prev = el.style.display;
      el.style.display = 'block';
      const r = b1.getBoundingClientRect(), sr = stage.getBoundingClientRect();
      const sc = sr.width / W;
      const m = { x: (r.left - sr.left) / sc, y: (r.top - sr.top) / sc, w: r.width / sc, h: r.height / sc };
      el.style.display = prev;
      return m;
    };
    const cur = h('div', 'abs', CURSOR, el);
    cur.style.cssText += 'left:0;top:0;transform-origin:6px 3px;filter:drop-shadow(0 6px 14px rgba(0,0,0,.4));';
    const ripple = h('div', 'abs', null, el);
    ripple.style.cssText += 'width:40px;height:40px;margin:-20px 0 0 -20px;border-radius:50%;border:2px solid var(--bone);opacity:0;';

    return (t) => {
      ring.update(-20 - 9 * (t - 52), -14, L(-300, 0, P(t, 52, 54, E.outExpo)), V ? 180 : 90, 0.9);
      wrap.style.opacity = (0.55 * P(t, 52.0, 53.0)).toFixed(3);
      S(eb, { o: P(t, 52.7, 53.1) });
      w1.forEach((w, i) => {
        const st = 52.0 + i * 0.1;
        const p = P(t, st, st + 0.55, E.outExpo);
        S(w, { s: L(1.45, 1, p), blur: 22 * (1 - p), o: P(t, st, st + 0.12) });
      });
      {
        const st = 52.26;
        const p = P(t, st, st + 0.7, E.outExpo);
        S(l2, { s: L(1.3, 1, p), blur: 18 * (1 - p), o: P(t, st, st + 0.15), y: 30 * (1 - p) });
      }
      S(subl, { o: P(t, 53.4, 53.8), y: 18 * (1 - P(t, 53.4, 54.2, E.outExpo)) });
      [b1, b2, b3].forEach((b, i) => {
        const st = 54.0 + i * 0.1;
        S(b, { o: P(t, st, st + 0.25), y: 30 * (1 - P(t, st, st + 0.8, E.outExpo)), s: 0.94 + 0.06 * P(t, st, st + 0.8, E.outExpo) });
      });

      // cursor glides in, hovers, clicks
      const bx = BTN.x, by = BTN.y, bwid = BTN.w, bht = BTN.h;
      const tx = bx + bwid * 0.62, ty = by + bht * 0.58;
      const mv = P(t, 54.8, 55.9, E.inOutCubic);
      const sx = V ? W * 0.85 : W * 0.8, sy = H + 60;
      const cx = L(sx, tx, mv) + Math.sin(mv * Math.PI) * -80, cy = L(sy, ty, mv);
      const click = env(t, 56.3, 56.38, 56.38, 56.5);
      S(cur, { x: cx, y: cy, o: P(t, 54.8, 54.95), s: 1 - 0.18 * click });
      const hov = P(t, 55.75, 55.95);
      b1.style.background = `rgb(${L(251, 151, hov) | 0},${L(250, 15, hov) | 0},${L(247, 24, hov) | 0})`;
      b1.style.color = hov > 0.5 ? 'var(--bone)' : 'var(--ink)';
      S(arr, { x: 8 * hov });
      const rp = P(t, 56.38, 56.9, E.outCubic);
      S(ripple, { x: cx + 6, y: cy + 3, s: 1 + 3.5 * rp, o: t < 56.38 ? 0 : 0.9 * (1 - rp) });
    };
  });

  // ============================================================== 10 · END
  scene('end', 56.6, 64.01, 100, (el) => {
    el.style.background = 'radial-gradient(ellipse 70% 60% at 50% 42%, #a8141f 0%, #970f18 45%, #6c0910 100%)';
    const lw = V ? 820 : 900, lh = lw * 1192 / 2964;
    const ly = V ? 700 : 250;
    const logoSvg = (window.__LOGO_STACKED || '');
    const rows = [0, 1].map((r) => {
      const m = box(h('div', 'abs', null, el), (W - lw) / 2, ly + (r ? lh * 600 / 1192 : 0), lw, r ? lh * 592 / 1192 : lh * 600 / 1192);
      m.style.overflow = 'hidden';
      const inner = box(h('div', 'abs', logoSvg, m), 0, r ? -lh * 600 / 1192 : 0, lw, lh);
      inner.style.color = 'var(--bone)';
      inner.style.clipPath = r ? 'inset(50.34% 0 0 0)' : 'inset(0 0 49.66% 0)';
      const svg = inner.querySelector('svg');
      if (svg) { svg.style.width = '100%'; svg.style.height = '100%'; svg.style.display = 'block'; }
      return { m, inner };
    });
    const tag = words('Dijital çözüm *ortağınız.*', 'abs sans', el);
    box(tag.el, 0, ly + lh + (V ? 90 : 70), W);
    tag.el.style.cssText += `text-align:center;font-size:${V ? 70 : 64}px;letter-spacing:-0.035em;`;
    tag.el.querySelectorAll('.serif').forEach((s) => (s.style.fontSize = '1.12em'));
    const rule = box(h('div', 'abs', null, el), (W - (V ? 760 : 980)) / 2, ly + lh + (V ? 260 : 200), V ? 760 : 980, 1.5);
    rule.style.background = 'rgba(251,250,247,.35)';
    rule.style.transformOrigin = '50% 50%';
    const c1 = box(h('div', 'abs', V ? 'hello@socialpmedia.com<br>+90 (540) 034 69 69<br>@socialp.media' : 'hello@socialpmedia.com&nbsp;&nbsp;·&nbsp;&nbsp;+90 (540) 034 69 69&nbsp;&nbsp;·&nbsp;&nbsp;@socialp.media', el), 0, ly + lh + (V ? 300 : 236), W);
    c1.style.cssText += `text-align:center;font-size:${V ? 38 : 27}px;letter-spacing:-0.005em;color:rgba(251,250,247,.92);line-height:1.55;`;
    const c2 = box(h('div', 'abs eyebrow', 'İstanbul · ABD · Kanada · Birleşik Krallık · Avustralya · Almanya', el), 0, ly + lh + (V ? 520 : 300), W);
    c2.style.cssText += `text-align:center;color:rgba(251,250,247,.62);font-size:${V ? 17 : 13}px;letter-spacing:.26em;`;

    return (t) => {
      const c = btnRect || { x: W / 2, y: H * 0.78 };
      const r = P(t, 56.6, 57.45, E.inOutQuart) * Math.hypot(W, H) * 1.05;
      S(el, { clip: `circle(${r.toFixed(2)}px at ${c.x.toFixed(1)}px ${c.y.toFixed(1)}px)` });
      rows.forEach((row, i) => {
        const st = 57.92 + i * 0.12;
        const p = P(t, st, st + 1.0, E.outExpo);
        S(row.inner, { y: (1 - p) * lh * 0.6 });
      });
      reveal(tag.words, t, 58.7, { stagger: 0.07, dur: 1.0 });
      S(rule, { sx: P(t, 59.2, 60.2, E.outExpo) });
      S(c1, { o: P(t, 59.4, 59.8), y: 16 * (1 - P(t, 59.4, 60.2, E.outExpo)) });
      S(c2, { o: P(t, 59.7, 60.1) });
      const breathe = P(t, 58, 64, E.linear);
      S(el, { s: 1 + 0.02 * breathe });
    };
  });

  // ============================================================ overlays
  const hud = h('div', null, null, stage);
  hud.id = 'hud';
  hud.innerHTML = (window.__LOGO_INLINE || '').replace('<svg', '<svg class="logo"');
  const hudLogo = hud.querySelector('svg');
  if (hudLogo) hudLogo.setAttribute('height', V ? 20 : 15);
  const TL = window.__TIMELINE.sections;
  const sec = h('div', 'sec', null, hud);
  const secStrip = h('div', null, null, sec);
  secStrip.innerHTML = TL.map((s, i) => `<span class="row">${String(i + 1).padStart(2, '0')} — ${s.label}</span>`).join('');
  const barEl = h('div', 'bar', '<i></i>', hud);
  const barFill = barEl.querySelector('i');
  const loc = h('div', 'loc', 'İstanbul · 2021’den beri', hud);
  const tc = h('div', 'tc', '', hud);
  void loc;

  const vig = h('div', null, null, stage); vig.id = 'vignette';
  const flash = h('div', null, null, stage); flash.id = 'flash';
  const black = h('div', null, null, stage); black.id = 'black';

  function hudUpdate(t) {
    const vis = P(t, 4.3, 4.8) * (1 - P(t, 56.4, 56.8));
    hud.style.opacity = vis.toFixed(3);
    hud.style.visibility = vis > 0 ? 'visible' : 'hidden';
    let idx = 0;
    TL.forEach((s, i) => { if (t >= s.t) idx = i; });
    // roll to the current section label
    const prev = TL[idx];
    const roll = idx + P(t, (TL[idx + 1] || { t: 999 }).t - 0.3, (TL[idx + 1] || { t: 999 }).t, E.inOutQuart) - P(t, prev.t - 0.3, prev.t, E.inOutQuart) * 0;
    secStrip.style.transform = `translate3d(0,${(-roll * (V ? 26 : 20)).toFixed(3)}px,0)`;
    barFill.style.width = ((t / DUR) * 100).toFixed(3) + '%';
    const sIdx = String(idx + 1).padStart(2, '0');
    tc.textContent = `${sIdx} / ${String(TL.length).padStart(2, '0')}`;
  }

  // flashes on the big hits
  const HITS = [4.0, 52.0];
  function fxUpdate(t) {
    let f = 0;
    for (const x of HITS) f = Math.max(f, env(t, x - 0.01, x, x + 0.02, x + 0.35, E.linear, E.outCubic));
    flash.style.opacity = (f * 0.22).toFixed(3);
    const light = (a, b2) => P(t, a, a + 0.5) * (1 - P(t, b2, b2 + 0.5));
    const lt = Math.max(light(9.7, 15.6), light(27.6, 33.5), light(42.0, 47.5));
    vig.style.opacity = (1 - 0.7 * lt).toFixed(3);
    const b = Math.max(P(t, 62.4, 63.9, E.inOutCubic), 1 - P(t, 0, 0.25));
    black.style.opacity = b.toFixed(3);
  }

  await document.fonts.load('450 100px Archivo', 'çğışöüÇĞİŞÖÜ');
  await document.fonts.load('italic 400 100px "Instrument Serif"', 'çğışöüÇĞİŞÖÜ');
  await document.fonts.ready;
  await Promise.all(decodes);
  // the button's resting position drives the cursor path and the end-card wipe
  const BTN = measureBtn();
  btnRect = { x: BTN.x + BTN.w / 2, y: BTN.y + BTN.h / 2 };

  async function seek(t) {
    for (const s of scenes) {
      const on = t >= s.t0 && t < s.t1;
      if (on !== s.on) { s.el.style.display = on ? 'block' : 'none'; s.on = on; }
      if (on) s.update(t);
    }
    hudUpdate(t);
    fxUpdate(t);
    // make sure swapped video frames are decoded before capture
    const imgs = stage.querySelectorAll('.screen img');
    await Promise.all([...imgs].map((i) => (i.complete ? null : i.decode().catch(() => {}))));
  }

  return { seek, duration: DUR };
};
