'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { alternatePath, type Locale } from '@/lib/site'

/** Link to the current page in the other language. */
export function LanguageLink({ locale, className }: { locale: Locale; className?: string }) {
  const other: Locale = locale === 'tr' ? 'en' : 'tr'
  return (
    <Link href={alternatePath(usePathname(), other)} hrefLang={other} lang={other} className={className}>
      {other === 'en' ? 'English' : 'Türkçe'}
    </Link>
  )
}
