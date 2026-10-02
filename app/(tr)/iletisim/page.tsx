import { ContactView } from '@/components/views/ContactView'
import { pathsFor } from '@/lib/i18n/config'
import { getI18n } from '@/lib/i18n'
import { pageMetadata } from '@/lib/i18n/metadata'

export const metadata = pageMetadata({ locale: 'tr', path: pathsFor('tr').contact, title: getI18n('tr').t.meta.contact, description: getI18n('tr').t.meta.contactDescription })

export default function Page() {
  return <ContactView locale="tr" />
}
