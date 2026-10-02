'use client'

import { Minus, Plus } from 'lucide-react'

import { site } from '@/data/site'
import { useI18n } from '@/lib/i18n/client'

/** Big −/+ buttons around the number. No typing needed, no tiny arrows. */
export function QuantityStepper({
  value,
  onChange,
  size = 'md',
  label,
}: {
  value: number
  onChange: (next: number) => void
  size?: 'sm' | 'md'
  label?: string
}) {
  const { t } = useI18n()
  const max = site.commerce.maxQuantity
  const btn = size === 'md' ? 'h-[3.25rem] w-12' : 'h-10 w-10'
  return (
    <div className={`inline-flex items-center rounded-full border border-line-strong bg-white ${size === 'md' ? '' : 'text-[0.9375rem]'}`} role="group" aria-label={label ?? t.common.quantity}>
      <button
        type="button"
        onClick={() => onChange(value - 1)}
        disabled={value <= 1}
        aria-label={t.common.decrease}
        className={`${btn} inline-flex items-center justify-center rounded-full text-ink transition hover:bg-ink/5 disabled:text-ink/25 disabled:hover:bg-transparent`}
      >
        <Minus className="h-4 w-4" strokeWidth={2.5} />
      </button>
      <output aria-live="polite" className={`${size === 'md' ? 'w-9 text-lg' : 'w-7'} text-center font-semibold tabular-nums`}>
        {value}
      </output>
      <button
        type="button"
        onClick={() => onChange(value + 1)}
        disabled={value >= max}
        aria-label={t.common.increase}
        className={`${btn} inline-flex items-center justify-center rounded-full text-ink transition hover:bg-ink/5 disabled:text-ink/25 disabled:hover:bg-transparent`}
      >
        <Plus className="h-4 w-4" strokeWidth={2.5} />
      </button>
    </div>
  )
}
