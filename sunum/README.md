# Neden Socialp Media? — teklif eki sunumu

`Neden-Socialp-Media.pdf`: 12 slaytlık, 16:9 (1920×1080) sunum. Teklif dosyasıyla birlikte gönderilir.

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

`render.mjs` PDF'i `../Neden-Socialp-Media.pdf` olarak yazar ve ardından `pdf-son-islem.py` ile
yer imlerini ve belge bilgilerini ekler. Slayt eklenir ya da çıkarılırsa `pdf-son-islem.py`
içindeki `BOOKMARKS` listesi de güncellenmelidir.

`fonts/static/` içindeki Archivo dosyaları `statik-font.py` ile değişken fonttan üretilir;
böylece fontlar PDF'e Type 3 yerine gerçek TrueType olarak gömülür.

Slayt 5'teki rapor ekranı temsilidir; üzerindeki değerler örnek amaçlıdır.
