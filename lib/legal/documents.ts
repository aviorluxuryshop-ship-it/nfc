import type { Locale } from '@/lib/i18n/config'

import { enDocs } from './en'
import { trDocs } from './tr'
import type { DocSlug, OrderContext } from './types'

/**
 * Policy and contract texts. Turkish is the binding version; English is a
 * courtesy translation. Have both reviewed by a lawyer before going live.
 */
export function getLegalDoc(slug: DocSlug, locale: Locale, ctx?: OrderContext) {
  return (locale === 'en' ? enDocs : trDocs)[slug](ctx)
}

export type { DocSlug }
