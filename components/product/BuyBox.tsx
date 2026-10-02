'use client'

import { Check } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

import { QuantityStepper } from '@/components/ui/QuantityStepper'
import { products, productLine, pricePerKg, pricePerWash, type Product } from '@/data/products'
import { formatPrice } from '@/lib/format'
import { scentTheme } from '@/lib/scents'

import { AddToCartButton } from './AddToCartButton'
import { ScentEmblem } from './ScentArt'

/**
 * Scent → quantity → add. In that order, top to bottom, nothing else in
 * between. On phones a slim bar keeps the price and button in reach once
 * the main button has scrolled away.
 */
export function BuyBox({ product }: { product: Product }) {
  const [qty, setQty] = useState(1)
  const buttonRef = useRef<HTMLDivElement>(null)
  const [showBar, setShowBar] = useState(false)

  useEffect(() => {
    const el = buttonRef.current
    if (!el) return
    // The root is stretched far downwards, so the button only stops
    // "intersecting" once it has left through the top of the screen — a
    // fast fling can't skip past that the way it can skip a normal threshold.
    const observer = new IntersectionObserver(([entry]) => setShowBar(!entry.isIntersecting), { rootMargin: '0px 0px 100000px 0px' })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div>
      <fieldset>
        <legend className="text-[0.9375rem] font-semibold">
          Koku: <span className={scentTheme[product.slug].deepText}>{product.scent}</span>
        </legend>
        <ul className="mt-3 grid grid-cols-3 gap-2.5">
          {products.map((p) => {
            const selected = p.slug === product.slug
            return (
              <li key={p.slug}>
                <Link
                  href={`/urunler/${p.slug}`}
                  scroll={false}
                  replace
                  aria-current={selected ? 'true' : undefined}
                  className={`relative flex flex-col items-center gap-1.5 rounded-2xl border px-2 pb-3 pt-2.5 text-center transition ${
                    selected ? `border-ink bg-white ring-1 ring-ink` : 'border-line bg-white hover:border-ink/40'
                  }`}
                >
                  {selected && (
                    <span className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-ink text-white">
                      <Check className="h-3 w-3" strokeWidth={3.5} aria-hidden="true" />
                    </span>
                  )}
                  <span className={`flex h-14 w-14 items-center justify-center rounded-full ${scentTheme[p.slug].panel}`}>
                    <ScentEmblem scent={p.slug} className="h-11 w-11" />
                  </span>
                  <span className="text-[0.9375rem] font-semibold">{p.scent}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </fieldset>

      <div className="mt-7 flex flex-wrap items-end justify-between gap-x-6 gap-y-2 border-t border-line pt-6">
        <div>
          <p className="flex items-baseline gap-3">
            <span className="text-[2.25rem] font-bold leading-none tabular-nums">{formatPrice(product.price)}</span>
            {product.compareAtPrice && <s className="text-lg text-ink-mute">{formatPrice(product.compareAtPrice)}</s>}
          </p>
          <p className="mt-2 text-sm text-ink-mute">KDV dahil · 1 kutu = {productLine.sheets} yaprak</p>
        </div>
        <p className="text-sm text-ink-soft">
          Yıkama başına <strong className="font-semibold text-ink">{formatPrice(pricePerWash(product))}</strong>
          <span className="block text-ink-mute">Birim fiyat: {formatPrice(pricePerKg(product))} / kg</span>
        </p>
      </div>

      <div ref={buttonRef} className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <span className="text-[0.9375rem] font-semibold sm:sr-only">Adet</span>
          <QuantityStepper value={qty} onChange={setQty} label="Kutu adedi" />
        </div>
        <AddToCartButton
          slug={product.slug}
          qty={qty}
          disabled={!product.inStock}
          className="flex-1"
          label={qty > 1 ? `Sepete Ekle · ${formatPrice(product.price * qty)}` : 'Sepete Ekle'}
        />
      </div>

      {/* Mobile sticky bar */}
      <div
        className={`fixed inset-x-0 bottom-0 z-20 border-t border-line bg-white px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 shadow-lift transition-[transform,visibility] duration-300 lg:hidden ${
          showBar ? 'visible translate-y-0' : 'invisible translate-y-full'
        }`}
        aria-hidden={!showBar}
        inert={!showBar}
      >
        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm text-ink-soft">
              {product.scent} · {qty} kutu
            </p>
            <p className="font-bold tabular-nums">{formatPrice(product.price * qty)}</p>
          </div>
          <AddToCartButton slug={product.slug} qty={qty} disabled={!product.inStock} className="btn-sm" />
        </div>
      </div>
    </div>
  )
}
