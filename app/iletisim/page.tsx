import type { Metadata } from 'next'
import { Clock, Mail, MapPin, MessageCircle, Phone, type LucideIcon } from 'lucide-react'

import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { company, isPlaceholder } from '@/data/company'

export const metadata: Metadata = {
  title: 'İletişim',
  description: 'VELMO müşteri hizmetleri: telefon, WhatsApp, e-posta ve şirket bilgileri.',
  alternates: { canonical: '/iletisim' },
}

function ContactCard({ icon: Icon, title, value, href, note }: { icon: LucideIcon; title: string; value: string; href?: string; note?: string }) {
  // Placeholders aren't real numbers or addresses — never turn them into links.
  const linkable = href && !isPlaceholder(value)
  return (
    <div className="flex gap-4 rounded-3xl border border-line bg-white p-6">
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-paper-cream">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </span>
      <div className="min-w-0">
        <h2 className="text-sm font-semibold uppercase tracking-[0.1em] text-ink-mute">{title}</h2>
        {linkable ? (
          <a href={href} className="mt-1 block break-words text-lg font-semibold hover:underline">
            {value}
          </a>
        ) : (
          <p className="mt-1 break-words text-lg font-semibold">{value}</p>
        )}
        {note && <p className="mt-1 text-[0.9375rem] text-ink-soft">{note}</p>}
      </div>
    </div>
  )
}

export default function ContactPage() {
  const tel = company.phone.replace(/[^\d+]/g, '')
  const wa = company.whatsapp.replace(/\D/g, '')

  const rows: [string, string][] = [
    ['Ticaret unvanı', company.legalName],
    ['MERSİS numarası', company.mersisNo],
    ['Ticaret sicil numarası', company.tradeRegistryNo],
    ['Vergi dairesi / numarası', `${company.taxOffice} / ${company.taxNo}`],
    ['Adres', company.address],
    ['Telefon', company.phone],
    ['E-posta', company.email],
    ['KEP adresi', company.kep],
    ['ETBİS', company.etbis],
  ]

  return (
    <div className="container pb-20 pt-6 lg:pb-28">
      <Breadcrumbs items={[{ label: 'Ana Sayfa', href: '/' }, { label: 'İletişim' }]} />
      <header className="mt-8 max-w-2xl">
        <h1 className="font-display text-[clamp(2.5rem,5vw,3.75rem)] font-medium leading-[1.04] tracking-[-0.01em]">Size nasıl yardımcı olabiliriz?</h1>
        <p className="mt-4 text-lg text-ink-soft">Siparişinizle ilgili yazıyorsanız sipariş numaranızı da eklemeyi unutmayın; daha hızlı yardımcı olabiliriz.</p>
      </header>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        <ContactCard icon={Phone} title="Telefon" value={company.phone} href={`tel:${tel}`} />
        <ContactCard icon={MessageCircle} title="WhatsApp" value={company.whatsapp} href={`https://wa.me/${wa}`} />
        <ContactCard icon={Mail} title="E-posta" value={company.email} href={`mailto:${company.email}`} />
        <ContactCard icon={Clock} title="Çalışma saatleri" value={company.serviceHours} />
        <div className="sm:col-span-2">
          <ContactCard icon={MapPin} title="Adres" value={company.address} />
        </div>
      </div>

      <section aria-labelledby="sirket" className="mt-14">
        <h2 id="sirket" className="font-display text-[clamp(1.875rem,3.5vw,2.5rem)] font-medium">
          Şirket bilgileri
        </h2>
        <dl className="mt-6 divide-y divide-line rounded-3xl border border-line bg-white">
          {rows.map(([k, v]) => (
            <div key={k} className="grid gap-1 px-6 py-4 sm:grid-cols-[16rem_1fr] sm:gap-6">
              <dt className="text-ink-mute">{k}</dt>
              <dd className="break-words font-medium">{v}</dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  )
}
