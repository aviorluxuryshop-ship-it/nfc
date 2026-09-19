import Image from 'next/image'

import type { Product } from '@/data/products'
import { siteConfig } from '@/data/site'

const platformStyle: Record<Product['platform'], string> = {
  Google: 'bg-royal-50 text-royal',
  Instagram: 'bg-magenta-50 text-magenta',
}

/**
 * A catalog row, not a store listing: photo on one side, specs on the
 * other, no price-then-buy affordance. This is what you browse before you
 * call or message — never a "sepete ekle" button, on purpose.
 */
export function ProductRow({ product, reverse }: { product: Product; reverse?: boolean }) {
  return (
    <div className={`flex flex-col gap-8 sm:gap-12 ${reverse ? 'sm:flex-row-reverse' : 'sm:flex-row'}`}>
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-card bg-paper-raised shadow-card sm:w-1/2">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(min-width: 640px) 45vw, 100vw"
          className="object-contain p-6"
        />
      </div>

      <div className="flex flex-col justify-center sm:w-1/2">
        <span className={`inline-flex w-fit items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${platformStyle[product.platform]}`}>
          {product.platform}
        </span>
        <h3 className="mt-4 font-display text-2xl font-bold text-ink sm:text-3xl">{product.name}</h3>
        <p className="mt-3 max-w-md text-ink-soft">{product.description}</p>

        <dl className="mt-6 grid grid-cols-2 gap-4 text-sm">
          <div>
            <dt className="text-ink-mute">Boyut</dt>
            <dd className="mt-1 font-semibold text-ink">{product.size}</dd>
          </div>
          <div>
            <dt className="text-ink-mute">Fiyat</dt>
            <dd className="mt-1 font-semibold text-ink">
              {siteConfig.currency}
              {product.price}
            </dd>
          </div>
        </dl>

        <div className="mt-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-mute">Renk Seçenekleri</p>
          <div className="mt-3 flex items-center gap-4">
            {product.colors.map((color) => (
              <span key={color.name} className="flex items-center gap-2">
                <span
                  className="h-6 w-6 rounded-full border border-ink/10"
                  style={{ background: color.hex }}
                  title={color.name}
                  aria-hidden
                />
                <span className="text-xs text-ink-soft">{color.name}</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
