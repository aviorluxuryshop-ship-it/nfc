import type { Metadata } from 'next'

import { PageHead } from '@/components/PageHead'
import { ProductGrid } from '@/components/ProductGrid'
import { restaurant } from '@/data/yemek'
import { tl } from '@/lib/format'

export const metadata: Metadata = {
  title: 'Tüm Ürünler',
  description: 'Peynir, zeytin, tatlı, salata, sıcak ürünler, unlu mamüller ve sandviçler. Paket paket sepete ekle, Merter\'e kapıda ödemeli getirelim.',
}

export default function UrunlerPage() {
  return (
    <>
      <PageHead
        crumbs={[{ label: 'Ana Sayfa', href: '/' }, { label: 'Ürünler' }]}
        title="Tüm Ürünler"
        description={`İstediğin ürünü, istediğin paket kadar sepete ekle. Minimum sipariş ${tl(restaurant.minOrder)}, ödeme kapıda.`}
      />
      <ProductGrid />
    </>
  )
}
