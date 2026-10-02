import type { Metadata } from 'next'

import { CartPageView } from '@/components/cart/CartPageView'

export const metadata: Metadata = {
  title: 'Sepetim',
  robots: { index: false },
}

export default function CartPage() {
  return <CartPageView />
}
