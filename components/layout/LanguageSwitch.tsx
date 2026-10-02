'use client'

import { usePathname } from 'next/navigation'
import { Globe } from 'lucide-react'

import { switchPath } from '@/lib/i18n/config'
import { useI18n } from '@/lib/i18n/client'

/** Same page, other language. A plain <a>: each language has its own root layout. */
export function LanguageSwitch({ className = '', short = false }: { className?: string; short?: boolean }) {
  const pathname = usePathname()
  const { locale, t } = useI18n()
  const other = locale === 'tr' ? 'en' : 'tr'
  return (
    <a href={switchPath(pathname, other)} hrefLang={other} lang={other} aria-label={t.nav.switchAria} className={className}>
      <Globe className="h-4 w-4 shrink-0" aria-hidden="true" />
      {short ? t.nav.switchShort : t.nav.switchTo}
    </a>
  )
}
