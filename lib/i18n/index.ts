import { pathsFor, type Locale } from './config'
import { en } from './en'
import { tr, type Dictionary } from './tr'

const dictionaries: Record<Locale, Dictionary> = { tr, en }

export function getI18n(locale: Locale) {
  return { locale, t: dictionaries[locale], paths: pathsFor(locale) }
}

export type I18n = ReturnType<typeof getI18n>
export type { Dictionary, Locale }
