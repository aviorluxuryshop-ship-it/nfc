import { Droplets, Leaf, Recycle, Shirt, type LucideIcon } from 'lucide-react'

import { productLine } from '@/data/products'

const ICONS: Record<string, LucideIcon> = { eco: Leaf, dissolve: Droplets, colour: Shirt, plastic: Recycle }

export function Highlights({ variant = 'strip' }: { variant?: 'strip' | 'grid' }) {
  if (variant === 'grid') {
    return (
      <ul className="grid gap-3 sm:grid-cols-2">
        {productLine.highlights.map((h) => {
          const Icon = ICONS[h.key]
          return (
            <li key={h.key} className="flex gap-4 rounded-2xl border border-line bg-white p-5">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-leaf-soft text-leaf">
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
    <ul className="grid grid-cols-2 gap-x-6 gap-y-6 lg:grid-cols-4">
      {productLine.highlights.map((h) => {
        const Icon = ICONS[h.key]
        return (
          <li key={h.key} className="flex items-center gap-3.5">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white text-leaf shadow-soft">
              <Icon className="h-5 w-5" aria-hidden="true" />
            </span>
            <span className="font-semibold leading-snug">{h.title}</span>
          </li>
        )
      })}
    </ul>
  )
}
