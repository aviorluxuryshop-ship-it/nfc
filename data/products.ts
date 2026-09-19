export type ColorOption = { name: string; hex: string }

export type Product = {
  slug: string
  name: string
  platform: 'Google' | 'Instagram'
  size: string
  price: number
  image: string
  description: string
  colors: ColorOption[]
}

export const products: Product[] = [
  {
    slug: 'google-degerlendirme-karti',
    name: 'Google Değerlendirme Kartı',
    platform: 'Google',
    size: '8,5 × 5,5 cm',
    price: 349,
    image: '/images/products/google-mavi.png',
    description:
      'Müşterin telefonunu yaklaştırdığında doğrudan Google yorum sayfana yönlenir. Kasada, masada ya da resepsiyonda dursun — yorum bırakmak tek dokunuşluk hale gelir.',
    colors: [
      { name: 'Lacivert', hex: '#2B3E8C' },
      { name: 'Siyah', hex: '#15161B' },
    ],
  },
  {
    slug: 'instagram-takip-karti',
    name: 'Instagram Takip Kartı',
    platform: 'Instagram',
    size: '8,5 × 5,5 cm',
    price: 349,
    image: '/images/products/instagram-siyah.png',
    description:
      'Telefon yaklaştırıldığında Instagram profiline yönlenir, takip tek dokunuşla tamamlanır. İşletmenin sosyal medyasını büyütmenin en kolay yolu.',
    colors: [
      { name: 'Siyah', hex: '#15161B' },
      { name: 'Gradyan', hex: '#C4287A' },
    ],
  },
]

export function getProductBySlug(slug: string) {
  return products.find((p) => p.slug === slug)
}
