import { Clock, Mail, MapPin, MessageCircle, Phone, type LucideIcon } from 'lucide-react'

import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { company, isPlaceholder } from '@/data/company'
import type { Locale } from '@/lib/i18n/config'
import { getI18n } from '@/lib/i18n'

function ContactCard({
  icon: Icon,
  title,
  value,
  href,
  tint,
}: {
  icon: LucideIcon
  title: string
  value: string
  href?: string
  tint: string
}) {
  // Placeholders aren't real numbers or addresses — never turn them into links.
  const linkable = href && !isPlaceholder(value)
  return (
    <div className="flex gap-4 rounded-3xl border border-line bg-white p-6">
      <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${tint}`}>
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
      </div>
    </div>
  )
}

export function ContactView({ locale }: { locale: Locale }) {
  const { t, paths } = getI18n(locale)
  const c = t.contactPage
  const tel = company.phone.replace(/[^\d+]/g, '')
  const wa = company.whatsapp.replace(/\D/g, '')

  return (
    <div className="container pb-20 pt-6 lg:pb-28">
      <Breadcrumbs label={t.common.breadcrumb} items={[{ label: t.common.home, href: paths.home }, { label: t.meta.contact }]} />
      <header className="mt-8 max-w-2xl">
        <h1 className="font-display text-[clamp(2.5rem,5vw,3.75rem)] font-medium leading-[1.04] tracking-[-0.01em]">{c.title}</h1>
        <p className="mt-4 text-lg text-ink-soft">{c.lead}</p>
      </header>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        <ContactCard icon={Phone} title={c.phone} value={company.phone} href={`tel:${tel}`} tint="bg-lavanta-soft text-lavanta" />
        <ContactCard icon={MessageCircle} title={c.whatsapp} value={company.whatsapp} href={`https://wa.me/${wa}`} tint="bg-bahar-soft text-bahar" />
        <ContactCard icon={Mail} title={c.email} value={company.email} href={`mailto:${company.email}`} tint="bg-narenciye-soft text-narenciye" />
        <ContactCard icon={Clock} title={c.hours} value={company.serviceHours} tint="bg-[#E2EEFA] text-[#3C7FC2]" />
        <div className="sm:col-span-2">
          <ContactCard icon={MapPin} title={c.address} value={company.address} tint="bg-paper-cream text-ink" />
        </div>
      </div>
    </div>
  )
}
