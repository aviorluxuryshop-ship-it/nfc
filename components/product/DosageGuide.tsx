import { productText } from '@/data/products'
import type { Locale } from '@/lib/i18n/config'
import { getI18n } from '@/lib/i18n'

import { SheetGlyph } from './SheetDiagram'

const tints = ['bg-bahar-soft', 'bg-lavanta-soft']

/** "How many sheets?" answered as a picture: load on the left, sheet on the right. */
export function DosageGuide({ locale, compact = false }: { locale: Locale; compact?: boolean }) {
  const { t } = getI18n(locale)
  return (
    <div data-reveal="stagger" className={`grid gap-3 ${compact ? '' : 'sm:grid-cols-2'}`}>
      {productText[locale].dosage.map((d, i) => (
        <div key={d.load} className="flex items-center gap-5 rounded-2xl border border-line bg-white p-5">
          <div className={`flex h-20 w-14 shrink-0 items-center justify-center rounded-xl ${tints[i % 2]}`}>
            <SheetGlyph fraction={d.fraction} className="h-14" />
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.1em] text-ink-mute">{d.label}</p>
            <p className="mt-0.5 text-lg font-semibold">
              {t.usage.dosageLine(d.load)} <span aria-hidden="true" className="text-ink-mute">→</span>
              <span className="sr-only">{t.usage.dosageFor}</span> {d.amount}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
