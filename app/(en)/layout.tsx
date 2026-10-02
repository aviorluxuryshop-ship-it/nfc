import { RootDocument } from '@/components/layout/RootDocument'
import { rootMetadata } from '@/lib/i18n/metadata'

import '../globals.css'

export { viewport } from '@/components/layout/RootDocument'
export const metadata = rootMetadata('en')

export default function EnglishLayout({ children }: { children: React.ReactNode }) {
  return <RootDocument locale="en">{children}</RootDocument>
}
