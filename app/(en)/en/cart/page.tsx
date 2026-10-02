import { CartPageView } from '@/components/cart/CartPageView'
import { pathsFor } from '@/lib/i18n/config'
import { getI18n } from '@/lib/i18n'
import { pageMetadata } from '@/lib/i18n/metadata'

export const metadata = pageMetadata({ locale: 'en', path: pathsFor('en').cart, title: getI18n('en').t.meta.cart, noindex: true })

export default function Page() {
  return <CartPageView />
}
