import Image from 'next/image'

import type { Product } from '@/data/products'
import { siteConfig } from '@/data/site'

const platformStyle: Record<Product['platform'], string> = {
  Google: 'bg-royal-50 text-royal',
  Instagram: 'bg-magenta-50 text-magenta',
}

export function ProductGridCard({ product }: { product: Product }) {
  return (
    <div className="overflow-hidden rounded-card border border-ink/10 bg-paper-raised shadow-card">
      <div className="relative aspect-[4/3] w-full bg-paper">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
          className="object-contain p-6"
        />
      </div>
      <div className="p-6">
        <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${platformStyle[product.platform]}`}>
          {product.platform}
        </span>
        <h3 className="mt-3 text-lg font-bold text-ink">{product.name}</h3>
        <p className="mt-2 text-sm text-ink-soft">{product.description}</p>

        <div className="mt-4 flex items-center justify-between text-sm">
          <span className="text-ink-mute">{product.size}</span>
          <span className="font-semibold text-ink">
            {siteConfig.currency}
            {product.price}
          </span>
        </div>

        <div className="mt-4 flex items-center gap-2">
          {product.colors.map((color) => (
            <span
              key={color.name}
              className="h-5 w-5 rounded-full border border-ink/10"
              style={{ background: color.hex }}
              title={color.name}
              aria-hidden
            />
          ))}
        </div>
      </div>
    </div>
  )
}
