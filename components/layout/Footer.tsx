import Link from 'next/link'
import { CreditCard, Landmark, ShieldCheck } from 'lucide-react'

import { Logo } from '@/components/brand/Logo'
import { CookieSettingsButton } from '@/components/cookies/ConsentProvider'
import { company } from '@/data/company'
import { legalHref } from '@/data/legal'
import { products } from '@/data/products'

const linkClass = 'text-[0.9375rem] text-ink-soft transition hover:text-ink'

function Column({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-sm font-bold uppercase tracking-[0.12em] text-ink">{title}</h2>
      <ul className="mt-4 space-y-2.5">{children}</ul>
    </div>
  )
}

export function Footer() {
  const companyRows: [string, string][] = [
    ['Ticaret Unvanı', company.legalName],
    ['MERSİS No', company.mersisNo],
    ['Vergi Dairesi / No', `${company.taxOffice} / ${company.taxNo}`],
    ['Adres', company.address],
    ['Telefon', company.phone],
    ['E-posta', company.email],
    ['KEP Adresi', company.kep],
  ]

  return (
    <footer className="mt-auto border-t border-line bg-paper-cream">
      <div className="container py-14 lg:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1.2fr]">
          <div>
            <Logo className="pt-2 text-[2rem]" />
            <p className="mt-4 max-w-xs text-ink-soft">Temiz çamaşır, daha yeşil bir yarın. Renkli çamaşırlar için deterjan yaprağı.</p>
            <p className="mt-3 text-sm text-ink-mute">Türkiye’de üretilmiştir.</p>
          </div>

          <Column title="Alışveriş">
            <li><Link href="/urunler" className={linkClass}>Tüm Ürünler</Link></li>
            {products.map((p) => (
              <li key={p.slug}>
                <Link href={`/urunler/${p.slug}`} className={linkClass}>{p.scent} Deterjan Yaprağı</Link>
              </li>
            ))}
            <li><Link href="/sepet" className={linkClass}>Sepetim</Link></li>
          </Column>

          <Column title="Yardım">
            <li><Link href="/nasil-kullanilir" className={linkClass}>Nasıl Kullanılır?</Link></li>
            <li><Link href="/sss" className={linkClass}>Sıkça Sorulan Sorular</Link></li>
            <li><Link href={legalHref('teslimat-ve-kargo')} className={linkClass}>Teslimat ve Kargo</Link></li>
            <li><Link href={legalHref('iptal-ve-iade')} className={linkClass}>İptal ve İade</Link></li>
            <li><Link href="/iletisim" className={linkClass}>İletişim</Link></li>
          </Column>

          <Column title="Yasal">
            <li><Link href={legalHref('kvkk-aydinlatma-metni')} className={linkClass}>KVKK Aydınlatma Metni</Link></li>
            <li><Link href={legalHref('gizlilik-politikasi')} className={linkClass}>Gizlilik Politikası</Link></li>
            <li><Link href={legalHref('cerez-politikasi')} className={linkClass}>Çerez Politikası</Link></li>
            <li><CookieSettingsButton className={linkClass} /></li>
            <li><Link href={legalHref('mesafeli-satis-sozlesmesi')} className={linkClass}>Mesafeli Satış Sözleşmesi</Link></li>
            <li><Link href={legalHref('on-bilgilendirme-formu')} className={linkClass}>Ön Bilgilendirme Formu</Link></li>
            <li><Link href={legalHref('kullanim-kosullari')} className={linkClass}>Kullanım Koşulları</Link></li>
          </Column>
        </div>

        <div className="mt-12 rounded-3xl border border-line bg-paper p-6">
          <h2 className="text-sm font-bold uppercase tracking-[0.12em]">Satıcı Bilgileri</h2>
          <dl className="mt-4 grid gap-x-8 gap-y-3 text-[0.9375rem] sm:grid-cols-2 lg:grid-cols-3">
            {companyRows.map(([k, v]) => (
              <div key={k}>
                <dt className="text-sm text-ink-mute">{k}</dt>
                <dd className="break-words text-ink-soft">{v}</dd>
              </div>
            ))}
            <div>
              <dt className="text-sm text-ink-mute">ETBİS</dt>
              <dd className="text-ink-soft">{company.etbis}</dd>
            </div>
          </dl>
        </div>

        <div className="mt-8 flex flex-col gap-5 border-t border-line pt-8 lg:flex-row lg:items-center lg:justify-between">
          <p className="text-sm text-ink-mute">
            © {new Date().getFullYear()} {company.legalName}. Tüm hakları saklıdır.
          </p>
          <ul className="flex flex-wrap items-center gap-2 text-sm text-ink-soft" aria-label="Ödeme seçenekleri">
            <li className="inline-flex items-center gap-1.5 rounded-full border border-line bg-paper px-3 py-1.5">
              <ShieldCheck className="h-4 w-4 text-leaf" aria-hidden="true" /> Güvenli ödeme
            </li>
            <li className="inline-flex items-center gap-1.5 rounded-full border border-line bg-paper px-3 py-1.5">
              <CreditCard className="h-4 w-4" aria-hidden="true" /> Kredi / Banka Kartı
            </li>
            <li className="inline-flex items-center gap-1.5 rounded-full border border-line bg-paper px-3 py-1.5">
              <Landmark className="h-4 w-4" aria-hidden="true" /> Havale / EFT
            </li>
          </ul>
        </div>
      </div>
    </footer>
  )
}
