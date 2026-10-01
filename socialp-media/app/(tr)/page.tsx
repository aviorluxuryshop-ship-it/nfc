import type { Metadata } from 'next'

import { HomePage } from '@/components/home/HomePage'
import { getDictionary } from '@/lib/content'
import { pageMetadata } from '@/lib/metadata'

const t = getDictionary('tr')

export const metadata: Metadata = pageMetadata('tr', 'home', t.meta.homeTitle, t.meta.homeDescription, true)

export default function Page() {
  return <HomePage locale="tr" />
}
