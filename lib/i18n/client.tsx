'use client'

import { createContext, useContext, useMemo } from 'react'

import { getI18n, type I18n, type Locale } from './index'

const I18nContext = createContext<I18n | null>(null)

/** Gives client components the page's language, words and URLs. */
export function I18nProvider({ locale, children }: { locale: Locale; children: React.ReactNode }) {
  const value = useMemo(() => getI18n(locale), [locale])
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n() {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n must be used inside <I18nProvider>')
  return ctx
}
