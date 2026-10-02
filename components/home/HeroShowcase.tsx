'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

import { PackShot } from '@/components/product/PackShot'
import { products, type ScentSlug } from '@/data/products'
import { useI18n } from '@/lib/i18n/client'
import { scentTheme } from '@/lib/scents'

import { WaveBackdrop } from './WaveBackdrop'

/*
 * Three boxes on a stage. Every few seconds they swap places — the one at
 * the back left glides to the front, the front one steps back to the
 * right — and each floats gently on its own rhythm. Hovering a box grows
 * it and pauses the carousel; a click on a back box brings it forward,
 * a click on the front box opens that product.
 *
 * Slot geometry (centre x, centre y, scale) is in % of the stage; the
 * box itself is always 64% wide and only scales, so movement stays on the
 * GPU and never reflows.
 */
const SLOTS = {
  front: { x: 50, y: 65.5, s: 1, z: 30 },
  left: { x: 25.5, y: 29.5, s: 0.77, z: 10 },
  right: { x: 74.5, y: 29.5, s: 0.77, z: 20 },
} as const
type Slot = keyof typeof SLOTS

const ORDER: Slot[] = ['front', 'right', 'left']
const INTERVAL = 3600

export function HeroShowcase() {
  const { locale, t, paths } = useI18n()
  // rotation 0 → lavanta front; each tick moves every box one slot on.
  const [rotation, setRotation] = useState(0)
  const [hovered, setHovered] = useState<ScentSlug | null>(null)
  const [focusWithin, setFocusWithin] = useState(false)
  const paused = hovered !== null || focusWithin
  const pausedRef = useRef(paused)

  useEffect(() => {
    pausedRef.current = paused
  }, [paused])

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = window.setInterval(() => {
      if (!pausedRef.current && !document.hidden) setRotation((r) => r + 1)
    }, INTERVAL)
    return () => window.clearInterval(id)
  }, [])

  const slotOf = (index: number): Slot => ORDER[(index + rotation) % 3]
  const frontIndex = products.findIndex((_, i) => slotOf(i) === 'front')
  const bringToFront = (index: number) => {
    // Smallest number of steps forward that puts `index` at the front.
    for (let step = 1; step <= 3; step++) {
      if (ORDER[(index + rotation + step) % 3] === 'front') return setRotation((r) => r + step)
    }
  }

  return (
    <div
      onFocus={() => setFocusWithin(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setFocusWithin(false)
      }}
    >
      <div className="relative aspect-[6/5] overflow-hidden rounded-[2.25rem] bg-[linear-gradient(155deg,#F1ECF8_0%,#F7F3EC_48%,#FDEFE1_100%)]">
        <WaveBackdrop className="absolute inset-0 h-full w-full opacity-90" />
        {products.map((p, i) => {
          const slot = SLOTS[slotOf(i)]
          const isFront = slotOf(i) === 'front'
          const isHovered = hovered === p.slug
          const scent = p.text[locale].scent
          const scale = slot.s * (isHovered ? 1.07 : 1)
          const box = (
            <span className="hero-float block" style={{ animationDelay: `${i * -1.7}s` }}>
              <PackShot scent={p.slug} className="w-full" />
            </span>
          )
          const common = {
            onMouseEnter: () => setHovered(p.slug),
            onMouseLeave: () => setHovered(null),
            className: `absolute block w-[64%] cursor-pointer outline-none transition-[left,top,transform,filter] duration-[900ms] ease-[cubic-bezier(0.65,0,0.35,1)] focus-visible:ring-2 focus-visible:ring-ink ${
              isHovered ? 'drop-shadow-[0_18px_28px_rgba(22,33,74,0.18)]' : ''
            }`,
            style: {
              left: `${slot.x}%`,
              top: `${slot.y}%`,
              zIndex: isHovered ? 40 : slot.z,
              transform: `translate(-50%, -50%) scale(${scale})`,
            } as React.CSSProperties,
          }
          // One element type for every slot, so focus and hover survive the swap.
          return (
            <Link
              key={p.slug}
              href={paths.product(p.slug)}
              aria-label={isFront ? t.product.boxAlt(scent) : t.home.showScent(scent)}
              onClick={(e) => {
                if (isFront) return
                e.preventDefault()
                bringToFront(i)
              }}
              {...common}
            >
              {box}
            </Link>
          )
        })}
      </div>

      <ul className="mt-4 flex justify-center gap-2 text-sm font-semibold" aria-label={t.home.scentsLabel}>
        {products.map((p, i) => {
          const active = i === frontIndex
          const theme = scentTheme[p.slug]
          return (
            <li key={p.slug}>
              <Link
                href={paths.product(p.slug)}
                onMouseEnter={() => bringToFront(i)}
                className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 transition duration-300 ${
                  active ? `border-transparent ${theme.panel} ${theme.deepText} shadow-soft` : 'border-line bg-white hover:border-ink'
                }`}
              >
                <span className={`h-2.5 w-2.5 rounded-full ${theme.dot}`} aria-hidden="true" />
                {p.text[locale].scent}
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
