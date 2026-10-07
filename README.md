# Marmara Gıda Kahvaltı

Merter'e kapıda ödemeli kahvaltılık sipariş sitesi. Next.js (App Router) + Tailwind CSS.
Online ödeme yok; sipariş fişi WhatsApp Business Cloud API ile işletmeye iletilir.

## Geliştirme

```bash
npm install
npm run dev
```

## Sayfalar

- `/` — hero, kategoriler, öne çıkan ürünler, servis bölgesi
- `/urunler`, `/urunler/[kategori]` — ürünler (sepete ekle), sol kategori menüsü, arama
- `/hakkimizda`, `/iletisim`
- `/siparis` — sepetten "Sipariş ver" ile gelinen sayfa: teslimat bilgileri (mahalle, sokak, no/kat/daire, konum), ödeme yöntemi (kapıda nakit ya da kredi/banka kartı), sipariş özeti
- `/api/siparis` — siparişi doğrular (mahalle, minimum tutar, fiyat, ödeme yöntemi) ve WhatsApp'a gönderir

Sipariş akışı: ürünleri sepete ekle → sepet panelinde tutarı gör → **Sipariş ver** → `/siparis` sayfasında bilgileri gir → **Siparişi ver**.

## İçerik

Menü, fiyatlar, telefon, adres, mahalle/sokak listesi: `data/yemek.ts`.
Ürün fotoğrafları: `public/images/urunler/<ürün-id>.webp` (kaynaklar `public/images/CREDITS.md`).
Logo: `public/images/logo.png` (şeffaf PNG); favicon `app/icon.png`, paylaşım görseli `app/opengraph-image.jpg`.

## WhatsApp

`.env.example` dosyasındaki değişkenleri Vercel'e girin (`WHATSAPP_TOKEN`,
`WHATSAPP_PHONE_NUMBER_ID`, `BUSINESS_WHATSAPP_TO`). Girilmezse sipariş iletilemez ve
müşteriye wa.me yedek butonu gösterilir.
