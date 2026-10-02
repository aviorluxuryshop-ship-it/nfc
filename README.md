# VELMO — Online Mağaza

VELMO çamaşır deterjanı yaprağı için e-ticaret sitesi. Next.js (App Router) + Tailwind CSS,
tamamen statik üretilir (Vercel'e olduğu gibi yüklenebilir).

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # üretim derlemesi
npm run lint && npm run typecheck
```

## Sayfalar (Türkçe / İngilizce)

Türkçe sitenin kökünde, İngilizce `/en` altında; her dilin kendi root layout'u var
(`app/(tr)`, `app/(en)`), böylece `<html lang>` doğru. Dil düğmesi (TR/EN) kullanıcıyı
aynı sayfanın diğer dildeki adresine götürür. Eşleşmeyen adresler `app/global-not-found.tsx`'e düşer.

| Türkçe | İngilizce | İçerik |
| --- | --- | --- |
| `/` | `/en` | Ana sayfa: dönen kutu vitrini, kokular, kutunun içeriği, kullanım, karşılaştırma, SSS |
| `/urunler`, `/urunler/lavanta` | `/en/products`, `/en/products/lavender` | Ürün listesi ve ürün detayı (Lavanta/Lavender, Bahar/Spring, Narenciye/Citrus) |
| `/sepet` | `/en/cart` | Sepet (ayrıca her sayfada açılan sepet paneli) |
| `/odeme` | `/en/checkout` | Ödeme: iletişim, teslimat, fatura, ödeme yöntemi, sözleşme onayı |
| `/siparis-alindi` | `/en/order-received` | Sipariş onayı |
| `/nasil-kullanilir`, `/sss`, `/iletisim` | `/en/how-to-use`, `/en/faq`, `/en/contact` | Yardım sayfaları |
| `/yasal/...` | `/en/legal/...` | KVKK, Gizlilik, Çerez Politikası/Tercihleri, Mesafeli Satış, Ön Bilgilendirme, İptal-İade, Teslimat, Kullanım Koşulları |

## Metinler nerede?

- Arayüz metinleri: `lib/i18n/tr.ts` ve `lib/i18n/en.ts` (aynı yapı; eksik çeviri tip hatası verir)
- Ürün, SSS ve yasal sayfa başlıkları: `data/products.ts`, `data/faq.ts`, `data/legal.ts` (her dil için ayrı)
- Yasal metinler: `lib/legal/tr.ts` (bağlayıcı) ve `lib/legal/en.ts` (bilgi amaçlı çeviri)
- Adresler (URL'ler): `lib/i18n/config.ts`

## Yayına almadan önce doldurulması gerekenler

Site, verilmeyen hiçbir bilgiyi uydurmaz; eksik olanlar `[köşeli parantez]` içinde yer tutucudur.
`site.demoMode` açıkken yasal sayfalarda bu yer tutucular sarıyla vurgulanır.

1. **`data/company.ts`** — ticaret unvanı, MERSİS, vergi dairesi/no, adres, telefon, e-posta,
   KEP, ETBİS, banka/IBAN, ödeme kuruluşu, kargo firması, barındırma sağlayıcısı.
2. **`data/products.ts`** — fiyatlar **örnektir** (₺299,90). Gerçek fiyatları ve stok kodlarını girin.
   Gerçek ürün fotoğrafları hazır olduğunda `photos` alanına ekleyin (`public/` altına koyup yolunu yazın);
   şu an ambalajdan birebir çizilmiş vektör kutu görselleri kullanılıyor.
3. **`data/site.ts`** — kargo ücreti (₺59,90), ücretsiz kargo sınırı (₺500) ve kargoya veriliş süresi
   (1–3 iş günü) **örnektir**. Alan adı: `NEXT_PUBLIC_SITE_URL` ortam değişkeni (varsayılan ambalajdaki www.velmo.com).
4. **`lib/legal/tr.ts` ve `lib/legal/en.ts`** — yasal metinler şablondur; içlerindeki `[...]` alanlarını (iade kodu,
   kargo şubesi bekleme süresi, yurt dışı aktarım, analitik araçları vb.) doldurun ve
   **bir hukuk danışmanına kontrol ettirin**.
5. **Ödeme altyapısı** — sitede henüz sunucu tarafı yok; sipariş tarayıcıda tutulur ve ödeme alınmaz.
   `lib/checkout.ts` içindeki `placeOrder` fonksiyonu, sipariş API'nize ve ödeme kuruluşunun
   (iyzico, PayTR vb.) güvenli ödeme sayfasına bağlanacak yerdir. Bağlandıktan sonra
   `site.demoMode` değerini `false` yapın.

## Yapı

- `data/` — ürünler, site ayarları, şirket bilgileri, SSS, il listesi
- `lib/` — sepet ve çerez izni (localStorage), ödeme doğrulama (telefon, T.C. kimlik no, vergi no), yasal metinler
- `components/product/PackShot.tsx` — ambalajdan çizilmiş SVG kutu; `ScentArt.tsx` koku çizimleri
- Animasyonlar: üst şerit kayan yazı, ana sayfada kendi kendine yer değiştiren kutular
  (`components/home/HeroShowcase.tsx`), sırayla yanan özellik ikonları (`Highlights.tsx`),
  GIF gibi dönen kullanım adımları (`UsageSteps.tsx`). Hepsi CSS/SVG; "hareketi azalt"
  ayarı açık olan kullanıcılarda durur.
- Çerez izni KVKK rehberine uygun: "Kabul Et" ve "Reddet" eşit ağırlıkta, kategoriler ayrı ayrı seçilebilir.
  Analitik/pazarlama etiketleri eklenirse yalnızca `useConsent()` izin verdiğinde yüklenmelidir.
