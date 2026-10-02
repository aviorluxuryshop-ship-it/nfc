import { site } from '@/data/site'
import { formatPrice } from '@/lib/format'

export function AnnouncementBar() {
  const { freeShippingThreshold, dispatchDays } = site.commerce
  return (
    <div className="bg-ink text-white">
      <p className="container flex h-10 items-center justify-center gap-3 text-center text-sm font-medium">
        <span>{formatPrice(freeShippingThreshold)} ve üzeri siparişlerde kargo ücretsiz</span>
        <span aria-hidden="true" className="hidden text-white/40 sm:inline">
          •
        </span>
        <span className="hidden sm:inline">Siparişler {dispatchDays} iş günü içinde kargoda</span>
      </p>
    </div>
  )
}
