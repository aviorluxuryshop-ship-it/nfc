import type { Metadata } from 'next'

import { OrderConfirmation } from '@/components/checkout/OrderConfirmation'

export const metadata: Metadata = {
  title: 'Siparişiniz alındı',
  robots: { index: false },
}

export default function OrderReceivedPage() {
  return <OrderConfirmation />
}
