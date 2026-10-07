# Marmara Gıda Kahvaltı

Merter'e kapıda ödemeli kahvaltılık sipariş sitesi. Next.js (App Router) + Tailwind CSS.
Online ödeme yok; sipariş fişi WhatsApp Business Cloud API ile işletmeye iletilir.

## Geliştirme

```bash
npm install
npm run dev
```

## Sayfalar

- `/` — hero, kategoriler, tüm ürünler (sepete ekle), servis bölgesi
- `/hakkimizda`, `/iletisim`
- `/api/siparis` — siparişi doğrular (mahalle, minimum tutar, fiyat) ve WhatsApp'a gönderir

## İçerik

Menü, fiyatlar, telefon, adres, mahalle/sokak listesi: `data/yemek.ts`.
Ürün fotoğrafları: `public/images/urunler/<ürün-id>.webp` (kaynaklar `public/images/CREDITS.md`).

## WhatsApp

`.env.example` dosyasındaki değişkenleri Vercel'e girin (`WHATSAPP_TOKEN`,
`WHATSAPP_PHONE_NUMBER_ID`, `BUSINESS_WHATSAPP_TO`). Girilmezse sipariş iletilemez ve
müşteriye wa.me yedek butonu gösterilir.
