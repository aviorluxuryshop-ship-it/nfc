# Socialp Media — Tanıtım Filmi

**Socialp Media** (İstanbul, sosyal medya ajansı) için, ajansın web sitesindeki gerçek
içerik, fotoğraf, renk ve tipografiden üretilmiş 64 saniyelik marka filmi.

| Dosya | Format | Kullanım |
| --- | --- | --- |
| `video/socialp-media-16x9.mp4` | 1920×1080 · 30 fps · H.264 + AAC | YouTube, web sitesi, sunum |
| `video/socialp-media-9x16.mp4` | 1080×1920 · 30 fps · H.264 + AAC | Instagram Reels, TikTok, Shorts |

Ses −14 LUFS / −1 dBTP'ye normalize edildi (Instagram, YouTube ve TikTok'un hedef seviyesi).

## Kurgu (120 BPM · 1 ölçü = 2 sn)

| Zaman | Sahne | İçerik |
| --- | --- | --- |
| 0–4 | Giriş | Daktilo efektiyle eyebrow, çekim kareleri arasında vuruşa oturan kelimeler: *Strateji. Prodüksiyon. Tasarım. Reklam.* |
| 4–10 | Ajans | 14 prodüksiyon karesinden 3B dönen halka · “Dijital çözüm *ortağınız.*” |
| 10–16 | Biz kimiz | 2021 · 100+ · 5 ülke kilometre sayacı gibi dönen sayaçlar, referans logoları |
| 16–28 | Hizmetler | Beyaz eldivenli tepsi fotoğraflarıyla *match-cut*: Sosyal Medya → Web Tasarım → Meta & Google Reklamları |
| 28–34 | Seçili proje | Dlux Professional e-ticaret sitesi, 3B tarayıcı maketinde gerçek ekran kaydı |
| 34–42 | Prodüksiyon | “Sahadan kareler.” 3B fotoğraf duvarı → “Her kare bir hikâye.” → üçlü panel montaj → kayan bantlar |
| 42–48 | Süreç | Strateji · Prodüksiyon · Yayın & yönetim · Analiz zaman çizgisi (müzikte breakdown) |
| 48–52 | Referans | Müşteri yorumu, yıldızlı tepsi |
| 52–58 | Çağrı | “Dijitalde güçlü *görünün.*” · imleç “Projenizi konuşalım” butonuna tıklar |
| 58–64 | Kapanış | SOCIALP / MEDIA logo açılışı, iletişim bilgileri, ses logosu |

## Nasıl üretildi

Bu film bir kurgu programında değil, **kodla** üretildi — her piksel ve her ses
zamanın saf bir fonksiyonu:

- **Görüntü** — `src/` içindeki HTML/CSS sahneleri, `window.seek(t)` ile herhangi bir
  ana kesin olarak çizilir. `scripts/render.js` sahneleri headless Chromium ile kare kare
  yakalar; her kare 180° obtüratörde alınan **4 alt-karenin ortalamasıdır** (gerçek
  kamera gibi hareket bulanıklığı). İş 3 paralel işçiye bölünür ve PNG'ler doğrudan
  ffmpeg'e akar.
- **Ses** — `scripts/score.py` müziği ve tüm efektleri sıfırdan sentezler (sample yok,
  lisans derdi yok): davul, sub bas, supersaw pad, arpej, yaylılar, FM elektrik piyano,
  çanlar; whoosh, riser, impact, daktilo, deklanşör, fare tıklaması. Her vuruş görüntüdeki
  kesmeyle aynı zaman damgasına yerleştirilir. Sidechain, reverb, M/S genişletme, glue
  kompresör ve limiter dahil.
- **Bitiş** — ince luma greni, BT.709 renk etiketleri, iki geçişli H.264.

Tasarım dili siteyle birebir: Archivo (değişken genişlik) + Instrument Serif italik,
`#0b0b0c` mürekkep, `#f2f0eb` kâğıt, `#970f18` sinyal kırmızısı, sitenin
`ease-out-expo` / `ease-in-out-quart` eğrileri.

## Yeniden üretmek

Gereksinimler: Node 18+, Python 3.10+ (`numpy`, `scipy`), ffmpeg.

```bash
cd promo
npm install                 # playwright
npx playwright install chromium   # gerekiyorsa
pip install numpy scipy
npm run build               # → video/*.mp4  (~35 dk, 4 çekirdek)
```

Önizleme (tarayıcıda oynatıcı, boşluk = oynat, ←/→ = kare kare):

```bash
npm run preview             # sonra http://localhost:3000/?t=16
```

`FORMATS="h"` yalnızca yatay, `FORMATS="v"` yalnızca dikey sürümü üretir.
Metinler, zamanlama ve renkler `src/scenes.js` içindedir; bölüm başlıkları `src/timeline.json`.
