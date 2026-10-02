import { HowToView } from '@/components/views/HowToView'
import { pathsFor } from '@/lib/i18n/config'
import { getI18n } from '@/lib/i18n'
import { pageMetadata } from '@/lib/i18n/metadata'

export const metadata = pageMetadata({ locale: 'en', path: pathsFor('en').howTo, title: getI18n('en').t.meta.howTo, description: getI18n('en').t.meta.howToDescription })

export default function Page() {
  return <HowToView locale="en" />
}
