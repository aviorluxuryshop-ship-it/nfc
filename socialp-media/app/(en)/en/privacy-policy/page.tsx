import type { Metadata } from 'next'

import { PrivacyPage } from '@/components/legal/PrivacyPage'
import { privacy } from '@/lib/content/privacy'
import { pageMetadata } from '@/lib/metadata'

const p = privacy.en

export const metadata: Metadata = pageMetadata('en', 'privacy', p.title, p.metaDescription)

export default function Page() {
  return <PrivacyPage locale="en" />
}
