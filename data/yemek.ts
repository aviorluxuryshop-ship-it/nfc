// Marmara Gıda Kahvaltı — menü ve işletme ayarları.
// Fiyatlar sunucuda bu dosyadan yeniden hesaplanır; tarayıcıdan gelen fiyata güvenilmez.
// TODO(işletme): gerçek telefon, adres, fiyat ve sokak listelerini girin.
export const restaurant = {
  name: 'Marmara Gıda Kahvaltı',
  tagline: 'Kahvaltının her şeyi, paket paket kapında.',
  phoneDisplay: '0212 000 00 00',
  address: 'Merter, Güngören / İstanbul',
  hours: 'Her gün 07:00 – 22:00',
  minOrder: 500,
  deliveryFee: 0,
  serviceArea: 'Sadece Merter civarı (Güngören): Mehmet Nesin Özmen, Abdurrahman Nafiz Gürman ve Tozkopan mahalleleri',
}

// Sokak listesi boşsa formda serbest metin alanı çıkar, doluysa seçim listesi.
export const neighborhoods: { name: string; streets: string[] }[] = [
  { name: 'Mehmet Nesin Özmen', streets: [] },
  { name: 'Abdurrahman Nafiz Gürman', streets: [] },
  { name: 'Tozkopan', streets: [] },
]

export type MenuItem = {
  id: string
  name: string
  desc: string // paket boyutu / açıklama
  price: number
  category: string
}

export const categories = [
  { name: 'Peynir Çeşitleri', icon: '🧀' },
  { name: 'Zeytin Çeşitleri', icon: '🫒' },
  { name: 'Tatlı Çeşitler', icon: '🍯' },
  { name: 'Salatalar', icon: '🥗' },
  { name: 'Sıcak Ürünler', icon: '🍳' },
  { name: 'Unlu Mamüller', icon: '🥐' },
]

export const menu: MenuItem[] = [
  { id: 'beyaz-peynir', name: 'Beyaz Peynir', desc: '500 gr paket', price: 180, category: 'Peynir Çeşitleri' },
  { id: 'kasar', name: 'Taze Kaşar', desc: '400 gr paket', price: 220, category: 'Peynir Çeşitleri' },
  { id: 'eski-kasar', name: 'Eski Kaşar', desc: '300 gr paket', price: 240, category: 'Peynir Çeşitleri' },
  { id: 'tulum', name: 'Tulum Peyniri', desc: '300 gr paket', price: 210, category: 'Peynir Çeşitleri' },
  { id: 'lor', name: 'Lor Peyniri', desc: '400 gr paket', price: 110, category: 'Peynir Çeşitleri' },
  { id: 'cecil', name: 'Çeçil Peyniri', desc: '300 gr paket', price: 150, category: 'Peynir Çeşitleri' },
  { id: 'yesil-zeytin', name: 'Yeşil Zeytin', desc: '500 gr paket', price: 130, category: 'Zeytin Çeşitleri' },
  { id: 'siyah-zeytin', name: 'Gemlik Siyah Zeytin', desc: '500 gr paket', price: 160, category: 'Zeytin Çeşitleri' },
  { id: 'kirma-zeytin', name: 'Çizik Yeşil Zeytin', desc: '500 gr paket', price: 140, category: 'Zeytin Çeşitleri' },
  { id: 'yagli-sele', name: 'Yağlı Sele Zeytin', desc: '500 gr paket', price: 170, category: 'Zeytin Çeşitleri' },
  { id: 'recel', name: 'Reçel Çeşitleri', desc: '380 gr kavanoz', price: 90, category: 'Tatlı Çeşitler' },
  { id: 'bal-kaymak', name: 'Bal & Kaymak Seti', desc: '2 li paket', price: 260, category: 'Tatlı Çeşitler' },
  { id: 'helva', name: 'Tahin Helvası', desc: '400 gr paket', price: 120, category: 'Tatlı Çeşitler' },
  { id: 'findik-kremasi', name: 'Çikolatalı Fındık Kreması', desc: '350 gr kavanoz', price: 130, category: 'Tatlı Çeşitler' },
  { id: 'sogus', name: 'Söğüş Tabağı', desc: 'Domates, salatalık, biber, 2 kişilik', price: 120, category: 'Salatalar' },
  { id: 'coban', name: 'Çoban Salata', desc: '2 kişilik paket', price: 110, category: 'Salatalar' },
  { id: 'gavurdagi', name: 'Gavurdağı Salata', desc: '2 kişilik paket', price: 130, category: 'Salatalar' },
  { id: 'menemen', name: 'Menemen', desc: '2 kişilik kap', price: 160, category: 'Sıcak Ürünler' },
  { id: 'sahanda-yumurta', name: 'Sahanda Yumurta', desc: '3 yumurtalı kap', price: 110, category: 'Sıcak Ürünler' },
  { id: 'sucuklu-yumurta', name: 'Sucuklu Yumurta', desc: '3 yumurtalı kap', price: 150, category: 'Sıcak Ürünler' },
  { id: 'gozleme', name: 'Gözleme', desc: 'Peynirli / patatesli / kıymalı, 1 adet', price: 90, category: 'Sıcak Ürünler' },
  { id: 'su-boregi', name: 'Su Böreği', desc: '1 dilim', price: 80, category: 'Sıcak Ürünler' },
  { id: 'simit', name: 'Simit', desc: '5 li paket', price: 100, category: 'Unlu Mamüller' },
  { id: 'pogaca', name: 'Poğaça', desc: '5 li paket', price: 120, category: 'Unlu Mamüller' },
  { id: 'acma', name: 'Açma', desc: '5 li paket', price: 110, category: 'Unlu Mamüller' },
  { id: 'kruvasan', name: 'Kruvasan', desc: '4 lü paket', price: 140, category: 'Unlu Mamüller' },
]
