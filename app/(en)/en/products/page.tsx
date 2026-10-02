import { ProductsView } from '@/components/views/ProductsView'
import { pathsFor } from '@/lib/i18n/config'
import { getI18n } from '@/lib/i18n'
import { pageMetadata } from '@/lib/i18n/metadata'

export const metadata = pageMetadata({ locale: 'en', path: pathsFor('en').products, title: getI18n('en').t.meta.products, description: getI18n('en').t.meta.productsDescription })

export default function Page() {
  return <ProductsView locale="en" />
}
