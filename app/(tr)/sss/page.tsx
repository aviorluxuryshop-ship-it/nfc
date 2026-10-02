import { FaqView } from '@/components/views/FaqView'
import { pathsFor } from '@/lib/i18n/config'
import { getI18n } from '@/lib/i18n'
import { pageMetadata } from '@/lib/i18n/metadata'

export const metadata = pageMetadata({ locale: 'tr', path: pathsFor('tr').faq, title: getI18n('tr').t.meta.faq, description: getI18n('tr').t.meta.faqDescription })

export default function Page() {
  return <FaqView locale="tr" />
}
