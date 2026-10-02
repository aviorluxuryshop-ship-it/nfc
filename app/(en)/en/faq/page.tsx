import { FaqView } from '@/components/views/FaqView'
import { pathsFor } from '@/lib/i18n/config'
import { getI18n } from '@/lib/i18n'
import { pageMetadata } from '@/lib/i18n/metadata'

export const metadata = pageMetadata({ locale: 'en', path: pathsFor('en').faq, title: getI18n('en').t.meta.faq, description: getI18n('en').t.meta.faqDescription })

export default function Page() {
  return <FaqView locale="en" />
}
