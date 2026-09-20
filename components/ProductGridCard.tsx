import type { Product } from '@/data/products'
import { siteConfig } from '@/data/site'
import { ProductGallery } from './ProductGallery'

const platformStyle: Record<Product['platform'], string> = {
  Google: 'bg-royal/10 text-royal',
  Instagram: 'bg-magenta/10 text-magenta',
}

export function ProductGridCard({ product }: { product: Product }) {
  return (
    <div className="overflow-hidden rounded-card border border-ink/10 bg-paper-raised shadow-card transition hover:-translate-y-1 hover:shadow-lift">
      <div className="p-6 pb-0">
        <ProductGallery product={product} imageClassName="p-4" />
      </div>
      <div className="p-6">
        <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${platformStyle[product.platform]}`}>
          {product.platform}
        </span>
        <h3 className="mt-3 font-display text-lg font-bold text-ink">{product.name}</h3>
        <p className="mt-2 text-sm text-ink-soft">{product.description}</p>

        <div className="mt-4 flex items-center justify-between border-t border-ink/10 pt-4 text-sm">
          <span className="text-ink-mute">{product.size}</span>
          <span className="text-lg font-bold text-royal">
            {siteConfig.currency}
            {product.price}
          </span>
        </div>
      </div>
    </div>
  )
}
