// Menü ve işletme ayarları. Fiyatlar TL. Fiyatlar sunucuda bu dosyadan
// yeniden hesaplanır; tarayıcıdan gelen fiyata asla güvenilmez.
export const restaurant = {
  name: 'Lezzet Durağı',
  tagline: 'Sıcak sıcak kapına gelsin. Ödemeyi kapıda yap.',
  phoneDisplay: '0555 000 00 00',
  minOrder: 150,
  deliveryFee: 25,
}

export type MenuItem = {
  id: string
  name: string
  desc: string
  price: number
  category: string
}

export const categories = ['Ana Yemekler', 'Burger & Dürüm', 'Yan Ürünler', 'İçecekler', 'Tatlılar']

export const menu: MenuItem[] = [
  { id: 'adana', name: 'Adana Kebap', desc: 'Közlenmiş biber, domates, lavaş ve soğan salatası ile', price: 280, category: 'Ana Yemekler' },
  { id: 'iskender', name: 'İskender', desc: 'Tereyağlı, yoğurtlu, domates soslu', price: 320, category: 'Ana Yemekler' },
  { id: 'tavuk-sis', name: 'Tavuk Şiş', desc: 'Pilav ve közlenmiş sebze ile', price: 230, category: 'Ana Yemekler' },
  { id: 'cheeseburger', name: 'Cheeseburger', desc: '150 gr dana köfte, cheddar, özel sos', price: 210, category: 'Burger & Dürüm' },
  { id: 'tavuk-durum', name: 'Tavuk Dürüm', desc: 'Lavaş, tavuk, marul, turşu, sos', price: 150, category: 'Burger & Dürüm' },
  { id: 'et-durum', name: 'Et Dürüm', desc: 'Lavaş, dana döner, soğan, sumak', price: 190, category: 'Burger & Dürüm' },
  { id: 'patates', name: 'Patates Kızartması', desc: 'Büyük boy, çıtır', price: 80, category: 'Yan Ürünler' },
  { id: 'sogan-halkasi', name: 'Soğan Halkası', desc: '8 adet', price: 70, category: 'Yan Ürünler' },
  { id: 'kola', name: 'Kola 330 ml', desc: 'Kutu', price: 40, category: 'İçecekler' },
  { id: 'ayran', name: 'Ayran', desc: '300 ml', price: 30, category: 'İçecekler' },
  { id: 'su', name: 'Su 500 ml', desc: '', price: 15, category: 'İçecekler' },
  { id: 'kunefe', name: 'Künefe', desc: 'Sıcak servis, bol fıstıklı', price: 140, category: 'Tatlılar' },
  { id: 'sutlac', name: 'Fırın Sütlaç', desc: 'Geleneksel tarif', price: 90, category: 'Tatlılar' },
]
