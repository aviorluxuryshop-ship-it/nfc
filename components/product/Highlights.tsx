import { Droplets, Leaf, Recycle, Shirt, type LucideIcon } from 'lucide-react'

import { productText } from '@/data/products'
import type { Locale } from '@/lib/i18n/config'

const ICONS: Record<string, LucideIcon> = { eco: Leaf, dissolve: Droplets, colour: Shirt, plastic: Recycle }

// One colour per highlight, picked from the box's ribbon.
const COLORS: Record<string, { main: string; soft: string }> = {
  eco: { main: '#2E7A47', soft: '#E3F1E6' },
  dissolve: { main: '#3C7FC2', soft: '#E2EEFA' },
  colour: { main: '#6E4FA8', soft: '#EEE8F6' },
  plastic: { main: '#D9701A', soft: '#FCEEDC' },
}

/**
 * `strip`: the band under the hero. Rather than sliding, the four icons
 * take turns — each lights up in its own colour with a ripple and a small
 * motion of its own (leaf sways, drop drips, shirt wiggles, arrows turn).
 */
export function Highlights({ locale, variant = 'strip' }: { locale: Locale; variant?: 'strip' | 'grid' }) {
  const items = productText[locale].highlights

  if (variant === 'grid') {
    return (
      <ul data-reveal="stagger" className="grid gap-3 sm:grid-cols-2">
        {items.map((h) => {
          const Icon = ICONS[h.key]
          const c = COLORS[h.key]
          return (
            <li key={h.key} className="flex gap-4 rounded-2xl border border-line bg-white p-5">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full" style={{ background: c.soft, color: c.main }}>
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <p className="font-semibold">{h.title}</p>
                <p className="mt-0.5 text-[0.9375rem] text-ink-soft">{h.text}</p>
              </div>
            </li>
          )
        })}
      </ul>
    )
  }

  return (
    <ul data-reveal="stagger" className="grid grid-cols-2 gap-x-6 gap-y-6 lg:grid-cols-4">
      {items.map((h, i) => {
        const Icon = ICONS[h.key]
        const c = COLORS[h.key]
        return (
          <li
            key={h.key}
            className="hl-item flex items-center gap-3.5"
            style={{ '--hl-main': c.main, '--hl-soft': c.soft, '--hl-delay': `${i * 2}s` } as React.CSSProperties}
          >
            <span className="hl-badge relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full">
              <Icon className={`hl-icon hl-icon-${h.key} h-5 w-5`} aria-hidden="true" />
            </span>
            <span className="font-semibold leading-snug">{h.title}</span>
          </li>
        )
      })}
    </ul>
  )
}
