export type ColorOption = { name: string; hex: string; image: string }

export type Product = {
  slug: string
  name: string
  platform: 'Google' | 'Instagram'
  size: string
  price: number
  description: string
  colors: ColorOption[]
}

export const products: Product[] = [
  {
    slug: 'google-degerlendirme-karti-kare',
    name: 'Google Değerlendirme Kartı — Kare',
    platform: 'Google',
    size: '7,5 × 7,5 cm (kare)',
    price: 1000,
    description:
      'Müşterin telefonunu yaklaştırdığında doğrudan Google yorum sayfana yönlenir. Kare form, masaüstünde ya da vitrinde kompakt durur.',
    colors: [
      { name: 'Lacivert', hex: '#2B3E8C', image: '/images/products/google-kare-lacivert.png' },
      { name: 'Siyah', hex: '#15161B', image: '/images/products/google-kare-siyah.png' },
    ],
  },
  {
    slug: 'google-degerlendirme-karti-kart',
    name: 'Google Değerlendirme Kartı — Kart',
    platform: 'Google',
    size: '8,5 × 5,5 cm (kart)',
    price: 1000,
    description:
      'Aynı Google yorum yönlendirmesi, standart kartvizit ölçüsünde. Kasada, masada ya da resepsiyonda dursun — yorum bırakmak tek dokunuşluk hale gelir.',
    colors: [{ name: 'Lacivert', hex: '#2B3E8C', image: '/images/products/google-lacivert-studio.png' }],
  },
  {
    slug: 'instagram-takip-karti',
    name: 'Instagram Takip Kartı',
    platform: 'Instagram',
    size: '8,5 × 5,5 cm (kart)',
    price: 1000,
    description:
      'Telefon yaklaştırıldığında Instagram profiline yönlenir, takip tek dokunuşla tamamlanır. İşletmenin sosyal medyasını büyütmenin en kolay yolu.',
    colors: [
      { name: 'Siyah', hex: '#15161B', image: '/images/products/instagram-siyah.png' },
      { name: 'Gradyan', hex: '#C4287A', image: '/images/products/instagram-gradyan.png' },
    ],
  },
]

export function getProductBySlug(slug: string) {
  return products.find((p) => p.slug === slug)
}
