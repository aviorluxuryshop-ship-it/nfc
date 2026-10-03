import type { Locale } from '@/lib/site'

import { en } from './en'
import { tr } from './tr'
import type { Dictionary } from './types'

const dictionaries: Record<Locale, Dictionary> = { tr, en }

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale]
}

export type { Dictionary }
