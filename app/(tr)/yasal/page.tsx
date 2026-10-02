import { LegalIndexView } from '@/components/views/LegalViews'
import { pathsFor } from '@/lib/i18n/config'
import { getI18n } from '@/lib/i18n'
import { pageMetadata } from '@/lib/i18n/metadata'

export const metadata = pageMetadata({ locale: 'tr', path: pathsFor('tr').legal, title: getI18n('tr').t.meta.legal })

export default function Page() {
  return <LegalIndexView locale="tr" />
}
