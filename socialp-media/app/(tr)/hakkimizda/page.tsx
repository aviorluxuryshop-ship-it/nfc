import type { Metadata } from 'next'

import { AboutPage } from '@/components/about/AboutPage'
import { getDictionary } from '@/lib/content'
import { pageMetadata } from '@/lib/metadata'

const t = getDictionary('tr')

export const metadata: Metadata = pageMetadata('tr', 'about', t.meta.aboutTitle, t.meta.aboutDescription)

export default function Page() {
  return <AboutPage locale="tr" />
}
