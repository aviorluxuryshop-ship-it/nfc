# VELMO — Online Mağaza

VELMO çamaşır deterjanı yaprağı için e-ticaret sitesi. Next.js (App Router) + Tailwind CSS,
tamamen statik üretilir (Vercel'e olduğu gibi yüklenebilir).

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # üretim derlemesi
npm run lint && npm run typecheck
```

## Sayfalar

| Yol | İçerik |
| --- | --- |
| `/` | Ana sayfa: ürün tanıtımı, 3 koku, kutunun içeriği, kullanım, sıvı deterjanla karşılaştırma, SSS |
| `/urunler`, `/urunler/[koku]` | Ürün listesi ve ürün detayı (Lavanta, Bahar, Narenciye) |
| `/sepet` | Sepet (ayrıca her sayfada açılan sepet paneli) |
| `/odeme` | Ödeme: iletişim, teslimat, fatura (bireysel/kurumsal), ödeme yöntemi, sözleşme onayı |
| `/siparis-alindi` | Sipariş onayı (Havale/EFT seçildiyse IBAN bilgisi) |
| `/nasil-kullanilir`, `/sss`, `/iletisim` | Yardım sayfaları ve şirket bilgileri |
| `/yasal/...` | KVKK Aydınlatma Metni, Gizlilik, Çerez Politikası, Çerez Tercihleri, Mesafeli Satış Sözleşmesi, Ön Bilgilendirme Formu, İptal ve İade, Teslimat ve Kargo, Kullanım Koşulları |

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
4. **`lib/legal/documents.ts`** — yasal metinler şablondur; içlerindeki `[...]` alanlarını (iade kodu,
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
- Çerez izni KVKK rehberine uygun: "Kabul Et" ve "Reddet" eşit ağırlıkta, kategoriler ayrı ayrı seçilebilir.
  Analitik/pazarlama etiketleri eklenirse yalnızca `useConsent()` izin verdiğinde yüklenmelidir.
