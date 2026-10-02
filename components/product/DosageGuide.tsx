import { productLine } from '@/data/products'

import { SheetGlyph } from './SheetDiagram'

/** "How many sheets?" answered as a picture: load on the left, sheet on the right. */
export function DosageGuide({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`grid gap-3 ${compact ? '' : 'sm:grid-cols-2'}`}>
      {productLine.dosage.map((d) => (
        <div key={d.load} className="flex items-center gap-5 rounded-2xl border border-line bg-white p-5">
          <div className="flex h-20 w-14 shrink-0 items-center justify-center rounded-xl bg-paper-cream">
            <SheetGlyph fraction={d.fraction} className="h-14" />
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.1em] text-ink-mute">{d.label}</p>
            <p className="mt-0.5 text-lg font-semibold">
              {d.load} çamaşır <span aria-hidden="true" className="text-ink-mute">→</span>
              <span className="sr-only">için</span> {d.amount}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
