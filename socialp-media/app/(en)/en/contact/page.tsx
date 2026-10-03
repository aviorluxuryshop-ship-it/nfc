import type { Metadata } from 'next'

import { ContactPage } from '@/components/contact/ContactPage'
import { getDictionary } from '@/lib/content'
import { pageMetadata } from '@/lib/metadata'

const t = getDictionary('en')

export const metadata: Metadata = pageMetadata('en', 'contact', t.meta.contactTitle, t.meta.contactDescription)

export default function Page() {
  return <ContactPage locale="en" />
}
