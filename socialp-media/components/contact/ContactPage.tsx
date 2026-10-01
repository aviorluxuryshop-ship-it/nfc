import { BriefForm } from '@/components/contact/BriefForm'
import { PageHero } from '@/components/PageHero'
import { getDictionary } from '@/lib/content'
import { contact, SERVICE_IDS, type Locale } from '@/lib/site'

export function ContactPage({ locale }: { locale: Locale }) {
  const t = getDictionary(locale)
  const c = t.contactPage

  // International visitors see the international line first.
  const blocks = [
    {
      key: 'tr',
      title: c.turkey,
      phone: contact.tr.phone,
      phoneHref: contact.tr.phoneHref,
      email: contact.tr.email,
      note: null as string | null,
    },
    {
      key: 'intl',
      title: c.intl,
      phone: contact.intl.phone,
      phoneHref: contact.intl.phoneHref,
      email: contact.intl.email,
      note: t.footer.intlCountries,
    },
  ]
  if (locale === 'en') blocks.reverse()

  return (
    <>
      <PageHero eyebrow={c.eyebrow} title={c.title} lead={c.body} compact />

      <section className="bg-ink pb-28 sm:pb-36">
        <div className="container-x grid gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="space-y-4 lg:col-span-5">
            {blocks.map((b, i) => (
              <div key={b.key} className="rounded-[1.5rem] border border-white/10 bg-ink-2 p-7 sm:p-9" data-reveal style={{ '--delay': `${i * 90}ms` } as React.CSSProperties}>
                <p className="eyebrow text-smoke">{b.title}</p>
                <a href={b.phoneHref} className="mt-6 block w-fit text-[clamp(1.5rem,2.4vw,2.1rem)] font-medium tracking-[-0.03em] text-bone hover:text-bone/80">
                  {b.phone}
                </a>
                <a href={`mailto:${b.email}`} className="link-draw mt-2 inline-block text-[1.05rem] text-bone/80 hover:text-bone">
                  {b.email}
                </a>
                {b.note && <p className="mt-5 text-[0.92rem] leading-relaxed text-smoke">{b.note}</p>}
              </div>
            ))}

            <div className="grid gap-4 sm:grid-cols-2" data-reveal style={{ '--delay': '180ms' } as React.CSSProperties}>
              <a
                href={contact.address.mapsHref}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col justify-between gap-8 rounded-[1.5rem] border border-white/10 bg-ink-2 p-7 transition-colors hover:border-white/25"
              >
                <span className="eyebrow text-smoke">{c.address}</span>
                <span>
                  <span className="block text-[1.02rem] leading-relaxed text-bone/85">
                    {contact.address.street}
                    <br />
                    {contact.address.postalCode} {contact.address.district}/{contact.address.city}
                  </span>
                  <span className="mt-4 inline-flex items-center gap-2 text-[0.92rem] text-bone">
                    {c.openMap}
                    <span aria-hidden="true" className="transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
                      ↗
                    </span>
                  </span>
                </span>
              </a>
              <div className="flex flex-col justify-between gap-8 rounded-[1.5rem] border border-white/10 bg-ink-2 p-7">
                <span className="eyebrow text-smoke">{c.social}</span>
                <div className="space-y-3">
                  <a href={contact.instagram.href} target="_blank" rel="noopener noreferrer" className="link-draw block w-fit text-[1.02rem] text-bone/85 hover:text-bone">
                    Instagram {contact.instagram.handle} ↗
                  </a>
                  <a href={contact.whatsappHref} target="_blank" rel="noopener noreferrer" className="link-draw block w-fit text-[1.02rem] text-bone/85 hover:text-bone">
                    WhatsApp ↗
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7" data-reveal style={{ '--delay': '120ms' } as React.CSSProperties}>
            <BriefForm t={t} services={SERVICE_IDS.map((id) => t.services[id].short)} />
          </div>
        </div>
      </section>
    </>
  )
}
