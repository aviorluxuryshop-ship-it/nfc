import { HomeView } from '@/components/views/HomeView'
import { pageMetadata } from '@/lib/i18n/metadata'

export const metadata = pageMetadata({ locale: 'tr', path: '/' })

export default function Page() {
  return <HomeView locale="tr" />
}
