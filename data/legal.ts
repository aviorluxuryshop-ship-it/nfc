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

export const legalPages: { slug: LegalSlug; title: string; summary: string }[] = [
  { slug: 'kvkk-aydinlatma-metni', title: 'KVKK Aydınlatma Metni', summary: 'Kişisel verilerinizi hangi amaçla, nasıl işlediğimiz ve haklarınız.' },
  { slug: 'gizlilik-politikasi', title: 'Gizlilik Politikası', summary: 'Sitemizde bilgilerinizi nasıl koruduğumuz.' },
  { slug: 'cerez-politikasi', title: 'Çerez Politikası', summary: 'Hangi çerezleri, ne için kullandığımız.' },
  { slug: 'cerez-tercihleri', title: 'Çerez Tercihleri', summary: 'Çerez izinlerinizi görüntüleyin ve değiştirin.' },
  { slug: 'mesafeli-satis-sozlesmesi', title: 'Mesafeli Satış Sözleşmesi', summary: 'Online siparişinizle kurulan satış sözleşmesi.' },
  { slug: 'on-bilgilendirme-formu', title: 'Ön Bilgilendirme Formu', summary: 'Sipariş öncesi bilmeniz gereken temel bilgiler.' },
  { slug: 'iptal-ve-iade', title: 'İptal ve İade Koşulları', summary: 'Sipariş iptali, cayma hakkı ve iade adımları.' },
  { slug: 'teslimat-ve-kargo', title: 'Teslimat ve Kargo', summary: 'Kargo süresi, ücreti ve teslimat koşulları.' },
  { slug: 'kullanim-kosullari', title: 'Kullanım Koşulları', summary: 'Siteyi kullanırken geçerli kurallar.' },
]

export function legalHref(slug: LegalSlug) {
  return `/yasal/${slug}`
}
