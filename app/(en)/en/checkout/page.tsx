import { CheckoutView } from '@/components/checkout/CheckoutView'
import { pathsFor } from '@/lib/i18n/config'
import { getI18n } from '@/lib/i18n'
import { pageMetadata } from '@/lib/i18n/metadata'

export const metadata = pageMetadata({ locale: 'en', path: pathsFor('en').checkout, title: getI18n('en').t.meta.checkout, noindex: true })

export default function Page() {
  return <CheckoutView />
}
