'use client'

import Link from 'next/link'
import { Lock, ShoppingBag } from 'lucide-react'

import { Breadcrumbs } from '@/components/ui/Breadcrumbs'

import { CartLineItem } from './CartLineItem'
import { useCart } from './CartProvider'
import { FreeShippingMeter } from './FreeShippingMeter'
import { TotalsRows } from './TotalsRows'

export function CartPageView() {
  const cart = useCart()

  return (
    <div className="container pb-20 pt-6 lg:pb-28">
      <Breadcrumbs items={[{ label: 'Ana Sayfa', href: '/' }, { label: 'Sepetim' }]} />
      <h1 className="mt-8 font-display text-[clamp(2.25rem,4.5vw,3.25rem)] font-medium leading-tight">Sepetim</h1>

      {cart.count === 0 ? (
        <div className="mt-10 flex flex-col items-center rounded-3xl border border-line bg-white px-6 py-16 text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-paper-cream">
            <ShoppingBag className="h-7 w-7 text-ink-soft" aria-hidden="true" />
          </span>
          <p className="mt-5 text-xl font-semibold">Sepetiniz şu an boş</p>
          <p className="mt-1 text-ink-soft">Kokunuzu seçip sepete ekleyebilirsiniz.</p>
          <Link href="/urunler" className="btn-primary mt-6 px-8">
            Ürünleri Gör
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid items-start gap-8 lg:grid-cols-[1.5fr_1fr] lg:gap-12">
          <div>
            <FreeShippingMeter subtotal={cart.subtotal} toFreeShipping={cart.toFreeShipping} />
            <ul className="mt-2 divide-y divide-line border-b border-line">
              {cart.items.map((item) => (
                <CartLineItem key={item.slug} item={item} large />
              ))}
            </ul>
            <Link href="/urunler" className="link mt-6 inline-block">
              ← Alışverişe devam et
            </Link>
          </div>

          <aside className="rounded-3xl border border-line bg-white p-6 lg:sticky lg:top-28" aria-labelledby="ozet">
            <h2 id="ozet" className="text-lg font-semibold">
              Sipariş özeti
            </h2>
            <div className="mt-4">
              <TotalsRows {...cart} />
            </div>
            <Link href="/odeme" className="btn-primary mt-6 w-full">
              Ödemeye Geç
            </Link>
            <p className="mt-3 flex items-center justify-center gap-1.5 text-sm text-ink-mute">
              <Lock className="h-3.5 w-3.5" aria-hidden="true" /> Güvenli ödeme
            </p>
          </aside>
        </div>
      )}
    </div>
  )
}
