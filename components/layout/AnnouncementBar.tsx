import { site } from '@/data/site'
import { formatPrice } from '@/lib/format'
import type { Locale } from '@/lib/i18n/config'
import { getI18n } from '@/lib/i18n'

function Leaf() {
  return (
    <svg viewBox="0 0 24 16" className="mx-6 h-3 w-[1.1rem] shrink-0 sm:mx-8" aria-hidden="true">
      <path d="M12 16 C 13 8 18 2 24 0 C 24 8 19 14 12 16 Z" fill="#A7D7A0" />
      <path d="M12 16 C 11 9 7 4 1 3 C 1 10 6 15 12 16 Z" fill="#CDEBC5" />
    </svg>
  )
}

/**
 * The navy strip at the very top: shipping promise and the product's key
 * facts running past as a ticker. Pure CSS, pauses on hover, and stands
 * still for people who prefer reduced motion.
 */
export function AnnouncementBar({ locale }: { locale: Locale }) {
  const { t } = getI18n(locale)
  const items = t.ticker(formatPrice(site.commerce.freeShippingThreshold), site.commerce.dispatchDays)

  return (
    <div className="marquee-wrap relative overflow-hidden bg-ink text-white">
      <p className="sr-only">{items.slice(0, 2).join(' · ')}</p>
      <div className="marquee flex h-10 items-center text-sm font-medium" aria-hidden="true">
        {[0, 1].map((half) => (
          <div key={half} className="flex shrink-0 items-center">
            {[...items, ...items].map((item, i) => (
              <span key={`${half}-${i}`} className="flex items-center whitespace-nowrap">
                {item}
                <Leaf />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
