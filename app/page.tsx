import type { Metadata } from 'next'

import { Shop } from '@/components/Shop'
import { restaurant } from '@/data/yemek'

export const metadata: Metadata = {
  title: `${restaurant.name} — Online Sipariş`,
  description: restaurant.tagline,
}

export default function YemekPage() {
  return <Shop />
}
