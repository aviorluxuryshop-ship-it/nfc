import type { Locale } from '@/lib/i18n/config'

export type LegalSlug =
  | 'kvkk-aydinlatma-metni'
  | 'gizlilik-politikasi'
  | 'cerez-politikasi'
  | 'cerez-tercihleri'
  | 'mesafeli-satis-sozlesmesi'
  | 'on-bilgilendirme-formu'
  | 'iptal-ve-iade'
  | 'teslimat-ve-kargo'
  | 'kullanim-kosullari'

type LegalMeta = { title: string; summary: string }

export const legalSlugs: LegalSlug[] = [
  'kvkk-aydinlatma-metni',
  'gizlilik-politikasi',
  'cerez-politikasi',
  'cerez-tercihleri',
  'mesafeli-satis-sozlesmesi',
  'on-bilgilendirme-formu',
  'iptal-ve-iade',
  'teslimat-ve-kargo',
  'kullanim-kosullari',
]

export const legalMeta: Record<Locale, Record<LegalSlug, LegalMeta>> = {
  tr: {
    'kvkk-aydinlatma-metni': { title: 'KVKK Aydınlatma Metni', summary: 'Kişisel verilerinizi hangi amaçla, nasıl işlediğimiz ve haklarınız.' },
    'gizlilik-politikasi': { title: 'Gizlilik Politikası', summary: 'Sitemizde bilgilerinizi nasıl koruduğumuz.' },
    'cerez-politikasi': { title: 'Çerez Politikası', summary: 'Hangi çerezleri, ne için kullandığımız.' },
    'cerez-tercihleri': { title: 'Çerez Tercihleri', summary: 'Çerez izinlerinizi görüntüleyin ve değiştirin.' },
    'mesafeli-satis-sozlesmesi': { title: 'Mesafeli Satış Sözleşmesi', summary: 'Online siparişinizle kurulan satış sözleşmesi.' },
    'on-bilgilendirme-formu': { title: 'Ön Bilgilendirme Formu', summary: 'Sipariş öncesi bilmeniz gereken temel bilgiler.' },
    'iptal-ve-iade': { title: 'İptal ve İade Koşulları', summary: 'Sipariş iptali, cayma hakkı ve iade adımları.' },
    'teslimat-ve-kargo': { title: 'Teslimat ve Kargo', summary: 'Kargo süresi, ücreti ve teslimat koşulları.' },
    'kullanim-kosullari': { title: 'Kullanım Koşulları', summary: 'Siteyi kullanırken geçerli kurallar.' },
  },
  en: {
    'kvkk-aydinlatma-metni': { title: 'Privacy Notice (KVKK)', summary: 'Why and how we process your personal data, and your rights.' },
    'gizlilik-politikasi': { title: 'Privacy Policy', summary: 'How we protect your information on our site.' },
    'cerez-politikasi': { title: 'Cookie Policy', summary: 'Which cookies we use and why.' },
    'cerez-tercihleri': { title: 'Cookie Preferences', summary: 'View and change your cookie choices.' },
    'mesafeli-satis-sozlesmesi': { title: 'Distance Sales Agreement', summary: 'The sales contract formed by your online order.' },
    'on-bilgilendirme-formu': { title: 'Pre-Information Form', summary: 'Key information to know before you order.' },
    'iptal-ve-iade': { title: 'Cancellation & Returns', summary: 'Cancelling an order, right of withdrawal and how to return.' },
    'teslimat-ve-kargo': { title: 'Delivery & Shipping', summary: 'Shipping times, costs and delivery terms.' },
    'kullanim-kosullari': { title: 'Terms of Use', summary: 'The rules that apply when using the site.' },
  },
}
