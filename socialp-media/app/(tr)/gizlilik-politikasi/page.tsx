import type { Metadata } from 'next'

import { PrivacyPage } from '@/components/legal/PrivacyPage'
import { privacy } from '@/lib/content/privacy'
import { pageMetadata } from '@/lib/metadata'

const p = privacy.tr

export const metadata: Metadata = pageMetadata('tr', 'privacy', p.title, p.metaDescription)

export default function Page() {
  return <PrivacyPage locale="tr" />
}
