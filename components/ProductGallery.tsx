'use client'

import Image from 'next/image'
import { useState } from 'react'

import type { Product } from '@/data/products'

const platformTint: Record<Product['platform'], string> = {
  Google: '#2B3E8C',
  Instagram: '#E8306B',
}

/**
 * The product photo plus, when there's more than one finish, the color
 * swatches that actually switch it. Every color's image is mounted at once
 * (loaded in parallel, up front) and toggled with opacity instead of
 * swapping `src` — switching color is instant, with no blank flash while a
 * new image loads in.
 */
export function ProductGallery({ product, imageClassName = 'p-8' }: { product: Product; imageClassName?: string }) {
  const [selected, setSelected] = useState(0)
  const tint = platformTint[product.platform]

  return (
    <div>
      <div
        className="relative aspect-[4/3] w-full overflow-hidden rounded-card"
        style={{ background: `linear-gradient(160deg, ${tint}14 0%, transparent 65%)` }}
      >
        {product.colors.map((c, i) => (
          <Image
            key={c.image}
            src={c.image}
            alt={`${product.name} — ${c.name}`}
            fill
            sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
            quality={92}
            priority={i === 0}
            className={`object-contain transition-opacity duration-300 ${imageClassName} ${
              i === selected ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ))}
      </div>

      {product.colors.length > 1 && (
        <div className="mt-4 flex items-center gap-3">
          {product.colors.map((c, i) => (
            <button
              key={c.name}
              onClick={() => setSelected(i)}
              aria-label={c.name}
              aria-pressed={i === selected}
              className={`flex items-center gap-2 rounded-full py-1 pl-1 pr-3 text-xs font-medium transition ${
                i === selected ? 'bg-ink/5 text-ink ring-1 ring-ink/15' : 'text-ink-mute hover:bg-ink/5'
              }`}
            >
              <span
                className="h-6 w-6 shrink-0 rounded-full border border-ink/10"
                style={{ background: c.hex }}
                aria-hidden
              />
              {c.name}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
