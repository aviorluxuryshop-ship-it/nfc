# Neden Socialp Media? — teklif eki sunumu

`Neden-Socialp-Media.pdf`: 12 slaytlık, 16:9 (1920×1080) sunum. Teklif dosyasıyla birlikte gönderilir.

Marka kimliği socialpmedia.com'dan alındı: mürekkep siyahı `#0b0b0c`, kâğıt `#f2f0eb`,
sinyal kırmızısı `#970f18` / `#e5383b`, Archivo + Instrument Serif Italic, sitedeki logo ve görseller.

## Düzenleme

Metinler `kaynak/deck.src.html` içinde, her slayt kendi `<section>` bloğunda.
PDF'i yeniden üretmek için (Playwright gerekir):

```bash
cd sunum/kaynak
node render.mjs --pdf ../Neden-Socialp-Media.pdf --shots onizleme
```

Slayt 5'teki rapor ekranı temsilidir; üzerindeki değerler örnek amaçlıdır.
