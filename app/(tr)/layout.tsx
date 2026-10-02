import { RootDocument } from '@/components/layout/RootDocument'
import { rootMetadata } from '@/lib/i18n/metadata'

import '../globals.css'

export { viewport } from '@/components/layout/RootDocument'
export const metadata = rootMetadata('tr')

export default function TurkishLayout({ children }: { children: React.ReactNode }) {
  return <RootDocument locale="tr">{children}</RootDocument>
}
