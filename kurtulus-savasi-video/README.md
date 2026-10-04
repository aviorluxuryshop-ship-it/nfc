# Kurtuluş Savaşı — sinematik harita animasyonu

1080×1920, 30 fps, sessiz (müzik yok). Python + OpenCV + Cairo ile render edilir.

- `prep.py`: NASA Blue Marble (Temmuz 2004 topo-bathy, C1 karosu) ve Natural Earth verisinden harita altlığını üretir (`data/`).
- `story.py`: senaryo, tarihler, cephe anahtar kareleri, alt yazılar.
- `engine.py`: kamera, bölgeler, oklar, bayrak rozetleri, efektler.
- `render.py`: `python3 render.py seg <ilk_kare> <son_kare> cikti.mp4` ile render alır.

Arşiv fotoğrafları (`photos/`) Library of Congress ve Wikimedia Commons'tan alınmış kamu malı görsellerdir.
