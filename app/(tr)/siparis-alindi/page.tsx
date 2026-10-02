import { OrderConfirmation } from '@/components/checkout/OrderConfirmation'
import { pathsFor } from '@/lib/i18n/config'
import { getI18n } from '@/lib/i18n'
import { pageMetadata } from '@/lib/i18n/metadata'

export const metadata = pageMetadata({ locale: 'tr', path: pathsFor('tr').orderReceived, title: getI18n('tr').t.meta.orderReceived, noindex: true })

export default function Page() {
  return <OrderConfirmation />
}
