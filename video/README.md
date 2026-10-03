# VELMO filmleri

İki adet 32 saniyelik film (tanıtım filmi ve kullanım filmi); tamamı kodla çizilir ve ücretsiz araçlarla üretilir
(Chromium + ffmpeg + Python). Görüntü, müzik ve efektlerin hepsi bu klasörde üretilir; telifli
müzik, stok video veya ücretli program kullanılmaz.

| Dosya | Ne yapar |
| --- | --- |
| `film.html`, `film.js` | Filmin kendisi: 7 sahne, `seek(t)` ile her kare zamanın saf bir fonksiyonu |
| `assets/brand.js` | Siteden alınan kutu çizimleri, koku çizimleri ve ikonlar |
| `assets/fonts/` | Sitenin yazı tipleri (Fraunces, Figtree — SIL Open Font License) |
| `music.py` | Özgün müzik ve ses efektleri (numpy/scipy ile sentezlenir, 120 BPM, Fa majör) |
| `usage.html`, `usage.js` | Kullanım filmi: çocuğun tişörtüne meyve suyu dökülür, anne bir yaprakla üç adımda yıkar, tişört temiz çıkar |
| `music_usage.py` | Kullanım filminin müziği ve efektleri (ukulele, glockenspiel, ıslık; dökülme, kapı, düğme, köpük, konfeti sesleri) |
| `render.js` | Kareleri paralel çizer, alt-kareleri karıştırıp hareket bulanıklığı verir, ffmpeg ile MP4 yapar |
| `build.sh` | Hepsini sırayla çalıştırır |
| `qa/layout.js`, `qa/sheets.py`, `qa/check.sh` | Kontroller: yazı taşması/çakışması, kare kare inceleme sayfaları, teknik kontrol (bozuk kare, ses seviyesi) |

## Üretmek

```bash
npm i -D playwright-core          # bir kez (ya da NODE_PATH ile mevcut bir kopyayı gösterin)
pip install numpy scipy           # bir kez
./video/build.sh                  # dört ana kopya + web sürümleri + kapak görselleri → video/out/
./video/build.sh tr 9x16          # tek bir sürüm
FILM=usage ./video/build.sh       # kullanım filmi → video/out/velmo-kullanim-*
```

Chromium yolu `--chrome` ya da `CHROME_PATH` ile verilebilir. Tek kare önizleme:
`node video/render.js --lang en --w 1080 --h 1920 --snap 9.5,22.8 --outdir video/out/snaps`
(kullanım filmi için `--page usage.html` ekleyin).

Çıktılar: `velmo-{tr,en}-{16x9,9x16}.mp4` (1080p, 30 fps, H.264 + AAC, −13 LUFS).
Kullanım filmi: `velmo-kullanim-{tr,en}-{16x9,9x16}.mp4`.
Sitedeki hafif sürümler ve kapaklar `public/video/` altındadır (yalnızca tanıtım filmi sitede).

## Metni değiştirmek

Filmdeki bütün yazılar `film.js` / `usage.js` başındaki `COPY` nesnesindedir ve sitedeki metinlerden alınmıştır
(yeni bir iddia eklenmedi). Alan adı ya da fiyat bilinçli olarak yok; eklemek isterseniz son
sahnedeki (`7 · End card`) metinlere ekleyip `build.sh`'yi yeniden çalıştırmanız yeterli.
