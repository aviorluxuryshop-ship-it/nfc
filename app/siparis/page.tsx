import type { Metadata } from 'next'

import { CheckoutForm } from '@/components/CheckoutForm'

export const metadata: Metadata = {
  title: 'Siparişi Tamamla',
  robots: { index: false, follow: false },
  alternates: { canonical: './' },
}

export default function SiparisPage() {
  return <CheckoutForm />
}
