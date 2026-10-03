# Neden Socialp Media? — teklif eki sunumu

- `Neden-Socialp-Media.pdf`: 12 slaytlık, 16:9 (1920×1080) sunum. Teklif dosyasıyla birlikte gönderilir.
- `Neden-Socialp-Media.mp4`: aynı sunumun hafif animasyonlu video hâli (1080p, H.264). WhatsApp ve e-postayla
  gönderilebilir; kendi kendine oynar, tıklanacak bir şey içermez.

Sunumda tıklanabilir gibi görünen (buton, hap etiket, onay kutusu, seçili kart) hiçbir öğe yoktur.

Marka kimliği socialpmedia.com'dan alındı: mürekkep siyahı `#0b0b0c`, kâğıt `#f2f0eb`,
sinyal kırmızısı `#970f18` / `#e5383b`, Archivo + Instrument Serif Italic, sitedeki logo ve görseller.

PDF'te telefon, e-posta, web, Instagram, harita ve WhatsApp bağlantıları tıklanabilir;
her slayt için yer imi, belge bilgileri ve Türkçe dil etiketi vardır.

## Düzenleme

Metinler `kaynak/deck.src.html` içinde, her slayt kendi `<section>` bloğunda.
PDF'i yeniden üretmek için (Playwright ve `pip install pikepdf` gerekir):

```bash
cd sunum/kaynak
node render.mjs --shots onizleme
```

Videoyu yeniden üretmek için (ffmpeg gerekir; ~3 dakika):

```bash
cd sunum/kaynak
node video.mjs            # tek slaytı denemek için: node video.mjs --only 5
```

Animasyonlar `deck.src.html` içindeki `data-a` öznitelikleriyle tanımlıdır ve yalnızca videoda çalışır;
PDF her zaman son (durağan) hâli gösterir. Slayt süreleri `video.mjs` içindeki `DUR` listesindedir.

`render.mjs` PDF'i `../Neden-Socialp-Media.pdf` olarak yazar ve ardından `pdf-son-islem.py` ile
yer imlerini ve belge bilgilerini ekler. Slayt eklenir ya da çıkarılırsa `pdf-son-islem.py`
içindeki `BOOKMARKS` listesi de güncellenmelidir.

`fonts/static/` içindeki Archivo dosyaları `statik-font.py` ile değişken fonttan üretilir;
böylece fontlar PDF'e Type 3 yerine gerçek TrueType olarak gömülür.

Slayt 5'teki rapor ekranı temsilidir; üzerindeki değerler örnek amaçlıdır.
