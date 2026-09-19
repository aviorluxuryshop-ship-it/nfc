export const siteConfig = {
  name: 'Dijital Kartım',
  tagline: 'Telefonunu yaklaştır, işletmeni büyüt.',
  description:
    'Dijital Kartım — işletmeler için NFC kartlar. Masada, kasada ya da resepsiyonda dur; müşterin telefonunu yaklaştırdığında Google yorumuna ya da Instagram sayfana yönlensin. Uygulama yok, kod okutma yok.',
  url: 'https://dijitalkartim.com',
  phone: '+90 555 000 00 00',
  whatsapp: '+90 555 000 00 00',
  email: 'merhaba@dijitalkartim.com',
  instagram: { handle: '@dijitalkartim', url: 'https://instagram.com/dijitalkartim' },
  address: 'Türkiye — yerinde satış ve teslim',
  currency: '₺',
}

export type NavLink = { label: string; href: string }

export const navLinks: NavLink[] = [
  { label: 'Ana Sayfa', href: '/' },
  { label: 'Ürün Kataloğu', href: '/katalog' },
  { label: 'NFC Kart Nedir?', href: '/nfc-kart-nedir' },
  { label: 'İletişim', href: '/iletisim' },
]
