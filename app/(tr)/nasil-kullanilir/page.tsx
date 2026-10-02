import { HowToView } from '@/components/views/HowToView'
import { pathsFor } from '@/lib/i18n/config'
import { getI18n } from '@/lib/i18n'
import { pageMetadata } from '@/lib/i18n/metadata'

export const metadata = pageMetadata({ locale: 'tr', path: pathsFor('tr').howTo, title: getI18n('tr').t.meta.howTo, description: getI18n('tr').t.meta.howToDescription })

export default function Page() {
  return <HowToView locale="tr" />
}
