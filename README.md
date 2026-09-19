# Dijital Kartım

NFC dokunmatik kartvizit kartları için mağaza sitesi. Yerinde/civar satış modeli — kargo yok. Next.js (App Router) + Tailwind CSS.

## Geliştirme

```bash
npm install
npm run dev
```

## Sayfalar

- `/` — ana sayfa, hero, "nasıl çalışır", ürün vitrini
- `/urunler` — tüm kartlar
- `/urunler/[slug]` — ürün detayı, sepete ekle
- `/sepet` — localStorage tabanlı sepet
- `/siparis` — sipariş formu (yerinde satış modeli, kargo/teslimat adresi yok;
  ödeme sağlayıcısı henüz bağlı değil — `app/siparis/page.tsx` içindeki
  `submitOrder` fonksiyonu gerçek bir ödeme/checkout sağlayıcısı ile
  değiştirilecek tek nokta)
- `/hakkimizda`, `/iletisim`

## Ürünler

`data/products.ts` içinde tanımlı. Gerçek ürün fotoğrafları eklenene kadar
`components/ProductVisual.tsx` her ürünün marka rengiyle bir kart görseli
üretiyor.
