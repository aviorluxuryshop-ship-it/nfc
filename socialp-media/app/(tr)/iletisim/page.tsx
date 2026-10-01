import type { Metadata } from 'next'

import { ContactPage } from '@/components/contact/ContactPage'
import { getDictionary } from '@/lib/content'
import { pageMetadata } from '@/lib/metadata'

const t = getDictionary('tr')

export const metadata: Metadata = pageMetadata('tr', 'contact', t.meta.contactTitle, t.meta.contactDescription)

export default function Page() {
  return <ContactPage locale="tr" />
}
