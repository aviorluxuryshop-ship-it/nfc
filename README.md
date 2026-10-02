# Dijital Kartım

İşletmeler için NFC kart kataloğu — Google değerlendirme ve Instagram takip kartları.
Bu bir online mağaza değil, katalog sitesi: sepet, ödeme ya da kargo akışı yok; satış
yerinde/civarda yapılıyor. Next.js (App Router) + Tailwind CSS.

## Geliştirme

```bash
npm install
npm run dev
```

## Sayfalar

- `/` — ana sayfa: resepsiyon fotoğraflı hero + kartların ne işe yaradığı, ardından
  ürün kataloğu satır satır (fiyat/sipariş butonu yok)
- `/katalog` — tüm kartların grid görünümü (boyut, fiyat, renk seçenekleri)
- `/nfc-kart-nedir` — NFC kart nedir, nasıl çalışır, nerede kullanılır
- `/iletisim` — telefon, WhatsApp, e-posta, Instagram, adres

## Ürünler

`data/products.ts` içinde tanımlı. Ürün fotoğrafları `public/images/products/`
altında — gerçek kart tasarımları.
