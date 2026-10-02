import Link from 'next/link'

import type { Locale } from '@/lib/i18n/config'
import { getI18n } from '@/lib/i18n'

export function NotFoundView({ locale }: { locale: Locale }) {
  const { t, paths } = getI18n(locale)
  const n = t.notFound
  return (
    <div className="container flex flex-col items-center py-28 text-center">
      <p className="eyebrow text-lavanta">{n.eyebrow}</p>
      <h1 className="mt-4 font-display text-[clamp(2.5rem,5vw,3.75rem)] font-medium leading-tight">{n.title}</h1>
      <p className="mt-4 max-w-md text-lg text-ink-soft">{n.lead}</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href={paths.home} className="btn-primary px-8">
          {n.home}
        </Link>
        <Link href={paths.products} className="btn-secondary px-8">
          {n.products}
        </Link>
      </div>
    </div>
  )
}
