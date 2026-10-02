import { Plus } from 'lucide-react'

import type { Faq } from '@/data/faq'

/** Native <details> — opens with one tap, works without JavaScript. */
export function FaqList({ items }: { items: Faq[] }) {
  return (
    <div data-reveal="stagger" className="divide-y divide-line border-y border-line">
      {items.map((f) => (
        <details key={f.q} className="group">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-lg font-semibold [&::-webkit-details-marker]:hidden">
            {f.q}
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line-strong transition group-open:rotate-45 group-open:border-ink group-open:bg-ink group-open:text-white">
              <Plus className="h-4 w-4" aria-hidden="true" />
            </span>
          </summary>
          <p className="max-w-prose pb-6 pr-12 text-ink-soft">{f.a}</p>
        </details>
      ))}
    </div>
  )
}
