export const siteConfig = {
  name: 'Dijital Kartım',
  tagline: 'Telefonunu yaklaştır, tanıt.',
  description:
    'Dijital Kartım NFC kartvizit kartları: telefonunu yaklaştırdığında profilini, portfolyonu ya da menünü açan akıllı kart. Uygulama yok, kod okutma yok — tek kart, sınırsız paylaşım.',
  url: 'https://dijitalkartim.com',
  phone: '+90 555 000 00 00',
  email: 'merhaba@dijitalkartim.com',
  instagram: '@dijitalkartim',
  address: 'Türkiye',
  currency: '₺',
}

export type NavLink = { label: string; href: string }

export const navLinks: NavLink[] = [
  { label: 'Ürünler', href: '/urunler' },
  { label: 'Nasıl Çalışır', href: '/#nasil-calisir' },
  { label: 'Hakkımızda', href: '/hakkimizda' },
  { label: 'İletişim', href: '/iletisim' },
]
