# Socialp Media — web sitesi

Socialp Media (sosyal medya ajansı, İstanbul) için yeni web sitesi. Next.js 16 (App Router)
+ Tailwind CSS 4 + TypeScript. Hero'daki dönen fotoğraf halkası three.js (WebGL) ile çiziliyor.

Bu klasör, `nfc` deposunun kökündeki NFC kart sitesinden bağımsız, kendi `package.json`'ı
olan ayrı bir uygulama.

## Geliştirme

```bash
cd socialp-media
npm install
npm run dev        # http://localhost:3000
npm run build      # production build (tüm sayfalar statik üretilir)
npm run lint
npm run typecheck
```

## Yayına alma (Vercel)

Vercel'de bu repo için **yeni bir proje** oluşturun ve **Root Directory** olarak
`socialp-media` seçin. Framework otomatik olarak Next.js algılanır, ek ayar gerekmez.

## Sayfalar

| Türkçe (varsayılan)                   | İngilizce                               |
| ------------------------------------- | --------------------------------------- |
| `/`                                   | `/en`                                   |
| `/hizmetler/sosyal-medya-yonetimi`    | `/en/services/social-media-management`  |
| `/hizmetler/web-tasarim-kurulum`      | `/en/services/web-design-development`   |
| `/hizmetler/meta-google-reklamlari`   | `/en/services/meta-google-ads`          |
| `/hakkimizda`                         | `/en/about`                             |
| `/iletisim`                           | `/en/contact`                           |

Her dilin kendi root layout'u var (`app/(tr)`, `app/(en)`), böylece `<html lang>` doğru.
Eşleşmeyen URL'ler `app/global-not-found.tsx`'e düşer.

## İçerik nerede?

- **Metinler:** `lib/content/tr.ts` ve `lib/content/en.ts` — tüm sayfa metinleri burada,
  aynı tipte (`lib/content/types.ts`). Metin değiştirmek için bileşenlere dokunmak gerekmez.
- **İletişim bilgileri, URL'ler:** `lib/site.ts`
- **Görseller:** `lib/media.ts` (yollar + boyutlar), dosyalar `public/images/`.
  Hepsi markanın mevcut sitesindeki kendi fotoğrafları; WebP olarak optimize edildi.
- **Hero halkası:** `components/home/ring-scene.ts` (dokular: `public/ring/01–14.webp`, 600×800).
- **Logo:** `lib/logo-path.ts` — markanın logo dosyasından vektöre çevrildi.

## Notlar

- İletişim formu sunucu gerektirmez: mesajı WhatsApp'ta ya da e-posta uygulamasında hazır
  açar. Formun doğrudan e-posta göndermesi istenirse bir route handler + e-posta servisi
  (ör. Resend) eklenmesi gerekir.
- WhatsApp butonu `+90 540 034 69 69` numarasına bağlı (`lib/site.ts` → `whatsappHref`).
- Animasyonlar `prefers-reduced-motion` ayarına uyar; WebGL yoksa hero statik görsellere düşer.
