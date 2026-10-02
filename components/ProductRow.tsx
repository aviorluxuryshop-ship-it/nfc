import { CircleCheck } from 'lucide-react'

import type { Product } from '@/data/products'
import { siteConfig } from '@/data/site'
import { ProductGallery } from './ProductGallery'

const platformStyle: Record<Product['platform'], string> = {
  Google: 'bg-royal/10 text-royal',
  Instagram: 'bg-magenta/10 text-magenta',
}

/**
 * A catalog row, not a store listing: photo on one side, specs on the
 * other, no price-then-buy affordance. This is what you browse before you
 * call or message — never a "sepete ekle" button, on purpose.
 */
export function ProductRow({ product, reverse }: { product: Product; reverse?: boolean }) {
  return (
    <div className={`flex flex-col gap-8 sm:gap-14 ${reverse ? 'sm:flex-row-reverse' : 'sm:flex-row'}`}>
      <div className="sm:w-1/2">
        <ProductGallery product={product} />
      </div>

      <div className="flex flex-col justify-center sm:w-1/2">
        <span className={`inline-flex w-fit items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${platformStyle[product.platform]}`}>
          {product.platform}
        </span>
        <h3 className="mt-4 font-display text-2xl font-bold text-ink sm:text-3xl">{product.name}</h3>
        <p className="mt-3 max-w-md text-ink-soft">{product.description}</p>

        <dl className="mt-6 flex items-center gap-10">
          <div>
            <dt className="text-xs uppercase tracking-wide text-ink-mute">Boyut</dt>
            <dd className="mt-1 font-semibold text-ink">{product.size}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-ink-mute">Fiyat</dt>
            <dd className="mt-1 text-xl font-bold text-royal">
              {siteConfig.currency}
              {product.price}
            </dd>
          </div>
        </dl>

        <p className="mt-6 flex items-center gap-2 text-xs font-medium text-ink-mute">
          <CircleCheck className="h-4 w-4 text-royal" />
          Sipariş ve bilgi için bizimle iletişime geç
        </p>
      </div>
    </div>
  )
}
