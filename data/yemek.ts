// Marmara Gıda Kahvaltı — menü ve işletme ayarları.
// Fiyatlar sunucuda bu dosyadan yeniden hesaplanır; tarayıcıdan gelen fiyata güvenilmez.
// TODO(işletme): gerçek telefon, adres ve fiyatları girin (fiyatlar şimdilik 50 ₺).
export const restaurant = {
  name: 'Marmara Gıda Kahvaltı',
  tagline: 'Kahvaltının her şeyi, kapınızda.',
  phoneDisplay: '0212 000 00 00',
  // TODO(işletme): sipariş WhatsApp numarası (905xx… biçiminde). Boşsa BUSINESS_WHATSAPP_TO kullanılır.
  whatsapp: '',
  address: 'Merter, Güngören / İstanbul',
  hours: 'Her gün 07:00 – 22:00',
  minOrder: 500,
  deliveryFee: 0,
  serviceArea: 'Sadece Merter civarı (Güngören): Mehmet Nesin Özmen, Abdurrahman Nafiz Gürman ve Tozkopan mahalleleri',
}

// Sokaklar öneri listesidir (web'den bulunan kısmi liste); müşteri listede olmayan sokağı elle yazabilir.
// TODO(işletme): tam sokak listesini ekleyin.
export const neighborhoods: { name: string; streets: string[] }[] = [
  { name: 'Mehmet Nesin Özmen', streets: ['Akasya Sokak', 'Barış Sokak', 'Savaş Sokak', 'Karadal Sokak', 'Zeki Sokak', 'Eski Londra Asfaltı'] },
  { name: 'Abdurrahman Nafiz Gürman', streets: [] },
  { name: 'Tozkopan', streets: ['Ezher Sokak'] },
]

export type Category = { slug: string; name: string; cover: string; description: string }

export const categories: Category[] = [
  { slug: 'peynir', name: 'Peynir Çeşitleri', cover: 'beyaz-peynir', description: 'Kahvaltı sofralarınızın vazgeçilmezi, taptaze ve kaliteli peynir çeşitleri Marmara Gıda\'da.' },
  { slug: 'zeytin', name: 'Zeytin Çeşitleri', cover: 'siyah-zeytin', description: 'Sofranın baş tacı; yeşil, siyah ve yağlı zeytin çeşitleri bir arada.' },
  { slug: 'tatli', name: 'Tatlı Çeşitleri', cover: 'bal-kaymak', description: 'Reçel, bal ve kaymak, helva, çikolata ve fındık kreması ile kahvaltıya tatlı bir son.' },
  { slug: 'salata', name: 'Salatalar', cover: 'sogus', description: 'Söğüş tabağından çoban salataya, kahvaltının ferah tamamlayıcıları.' },
  { slug: 'sicak', name: 'Sıcak Ürünler', cover: 'menemen', description: 'Menemen, yumurta çeşitleri, gözleme ve böreklerle sıcak sıcak bir kahvaltı.' },
  { slug: 'unlu', name: 'Unlu Mamüller', cover: 'simit', description: 'Simit, poğaça, açma ve kruvasan; sabahın en güzel eşlikçileri.' },
  { slug: 'sandvic', name: 'Sandviçler', cover: 'karisik-sandvic', description: 'Güne hızlı ve doyurucu başlamak isteyenler için sandviç ve tost çeşitleri.' },
]

export type MenuItem = { id: string; name: string; price: number; category: string }

const P = 50 // TODO(işletme): gerçek fiyatlar; şimdilik hepsi 50 ₺

export const menu: MenuItem[] = [
  { id: 'beyaz-peynir', name: 'Beyaz Peynir', price: P, category: 'peynir' },
  { id: 'kasar', name: 'Taze Kaşar', price: P, category: 'peynir' },
  { id: 'tulum', name: 'Tulum Peyniri', price: P, category: 'peynir' },
  { id: 'lor', name: 'Lor Peyniri', price: P, category: 'peynir' },
  { id: 'cecil', name: 'Çeçil Peyniri', price: P, category: 'peynir' },
  { id: 'yesil-zeytin', name: 'Yeşil Zeytin', price: P, category: 'zeytin' },
  { id: 'siyah-zeytin', name: 'Gemlik Siyah Zeytin', price: P, category: 'zeytin' },
  { id: 'cizik-zeytin', name: 'Çizik Yeşil Zeytin', price: P, category: 'zeytin' },
  { id: 'yagli-sele', name: 'Yağlı Sele Zeytin', price: P, category: 'zeytin' },
  { id: 'recel', name: 'Reçel Çeşitleri', price: P, category: 'tatli' },
  { id: 'bal-kaymak', name: 'Bal & Kaymak', price: P, category: 'tatli' },
  { id: 'helva', name: 'Tahin Helvası', price: P, category: 'tatli' },
  { id: 'findik-kremasi', name: 'Fındık Kreması', price: P, category: 'tatli' },
  { id: 'cikolata', name: 'Çikolata', price: P, category: 'tatli' },
  { id: 'sogus', name: 'Söğüş Tabağı', price: P, category: 'salata' },
  { id: 'coban', name: 'Çoban Salata', price: P, category: 'salata' },
  { id: 'mevsim-salata', name: 'Mevsim Salata', price: P, category: 'salata' },
  { id: 'menemen', name: 'Menemen', price: P, category: 'sicak' },
  { id: 'sahanda-yumurta', name: 'Sahanda Yumurta', price: P, category: 'sicak' },
  { id: 'sucuklu-yumurta', name: 'Sucuklu Yumurta', price: P, category: 'sicak' },
  { id: 'gozleme', name: 'Gözleme', price: P, category: 'sicak' },
  { id: 'borek', name: 'Börek', price: P, category: 'sicak' },
  { id: 'simit', name: 'Simit', price: P, category: 'unlu' },
  { id: 'pogaca', name: 'Poğaça', price: P, category: 'unlu' },
  { id: 'acma', name: 'Açma', price: P, category: 'unlu' },
  { id: 'kruvasan', name: 'Kruvasan', price: P, category: 'unlu' },
  { id: 'karisik-sandvic', name: 'Karışık Sandviç', price: P, category: 'sandvic' },
  { id: 'tost', name: 'Kaşarlı Tost', price: P, category: 'sandvic' },
  { id: 'tavuk-sandvic', name: 'Tavuklu Sandviç', price: P, category: 'sandvic' },
]

export const featuredIds = ['beyaz-peynir', 'kasar', 'siyah-zeytin', 'simit', 'karisik-sandvic', 'sucuklu-yumurta']

export const imageOf = (id: string) => `/images/urunler/${id}.webp`
