import Image from 'next/image'
import Link from 'next/link'

import { CtaBand } from '@/components/CtaBand'
import { FeaturedProject } from '@/components/home/FeaturedProject'
import { Process } from '@/components/home/Process'
import { Production } from '@/components/home/Production'
import { JsonLd } from '@/components/JsonLd'
import { PageHero } from '@/components/PageHero'
import { SectorList } from '@/components/service/SectorList'
import { getDictionary, type Dictionary } from '@/lib/content'
import { media, platformLogos, serviceTrays } from '@/lib/media'
import { href, SERVICE_IDS, SITE_URL, type Locale, type ServiceId } from '@/lib/site'

export function ServicePage({ locale, id }: { locale: Locale; id: ServiceId }) {
  const t = getDictionary(locale)
  const s = t.services[id]

  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Service',
          name: s.title,
          description: s.metaDescription,
          url: `${SITE_URL}${href(locale, id)}`,
          provider: { '@type': 'ProfessionalService', name: 'Socialp Media', url: SITE_URL },
          areaServed: ['TR', 'US', 'CA', 'GB', 'AU', 'DE'],
        }}
      />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Socialp Media', item: `${SITE_URL}${href(locale, 'home')}` },
            { '@type': 'ListItem', position: 2, name: s.title, item: `${SITE_URL}${href(locale, id)}` },
          ],
        }}
      />
      <PageHero
        eyebrow={`${t.servicePage.eyebrow} ${s.number}`}
        title={s.title}
        accent={s.tagline}
        lead={s.lead}
        aside={<HeroMedia id={id} t={t} />}
        compact
      />

      {/* Intro */}
      <section className="bg-paper py-24 text-ink sm:py-32">
        <div className="container-x grid gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-4">
            <h2 className="eyebrow text-graphite" data-reveal>
              {s.featuresTitle}
            </h2>
          </div>
          <div className="space-y-8 lg:col-span-8">
            {s.intro.map((p, i) => (
              <p
                key={i}
                className={i === 0 ? 'text-[clamp(1.45rem,2.5vw,2.4rem)] font-medium leading-[1.2] tracking-[-0.03em]' : 'lead max-w-[56ch] text-ink/70'}
                data-reveal
                style={{ '--delay': `${i * 100}ms` } as React.CSSProperties}
              >
                {p}
              </p>
            ))}
          </div>
        </div>

        {/* Features */}
        <div className="container-x mt-20 sm:mt-28">
          <ol className={`grid gap-px overflow-hidden rounded-3xl border border-ink/10 bg-ink/10 sm:grid-cols-2 ${s.features.length === 6 ? 'lg:grid-cols-3' : 'lg:grid-cols-4'}`}>
            {s.features.map((f, i) => (
              <li key={f.title} className="group flex flex-col bg-paper p-7 transition-colors duration-500 hover:bg-bone sm:p-9" data-reveal="fade" style={{ '--delay': `${i * 70}ms` } as React.CSSProperties}>
                <span className="serif-accent text-[2.6rem] leading-none text-signal">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="mt-10 text-[1.35rem] font-medium tracking-[-0.02em]">{f.title}</h3>
                <p className="mt-3 text-[0.98rem] leading-relaxed text-ink/65">{f.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {id === 'social' && <SocialExtras t={t} />}
      {id === 'web' && <WebExtras t={t} />}
      {id === 'ads' && <AdsExtras t={t} />}

      <OtherServices locale={locale} t={t} current={id} />
      <CtaBand locale={locale} t={t} />
    </>
  )
}

function HeroMedia({ id, t }: { id: ServiceId; t: Dictionary }) {
  const tray = serviceTrays[id]
  return (
    <div className="relative ml-auto aspect-[4/5] w-full max-w-[30rem] overflow-hidden rounded-[1.5rem] bg-signal-deep">
      <Image src={tray.src} alt={tray.alt[t.locale]} fill priority sizes="(min-width: 1024px) 30rem, 92vw" className="object-cover object-[50%_45%]" />
    </div>
  )
}

function SocialExtras({ t }: { t: Dictionary }) {
  const shots = t.production.items.filter((item) => item.src !== media.socialDesign.src).slice(0, 9)
  return (
    <>
      <Production eyebrow={t.production.eyebrow} title={t.servicePage.socialGalleryTitle} body={t.production.body} items={shots} />

      <section className="bg-paper py-24 text-ink sm:py-32">
        <div className="container-x grid items-center gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-6">
            <p className="eyebrow mb-6 text-graphite" data-reveal>
              {t.services.social.bullets[2]}
            </p>
            <h2 className="display-l max-w-[12ch]" data-reveal style={{ '--delay': '80ms' } as React.CSSProperties}>
              {t.servicePage.socialDesignTitle}
            </h2>
            <p className="lead mt-8 max-w-[42ch] text-ink/70" data-reveal style={{ '--delay': '160ms' } as React.CSSProperties}>
              {t.servicePage.socialDesignBody}
            </p>
          </div>
          <div className="flex justify-center gap-4 sm:gap-6 lg:col-span-6 lg:justify-end">
            <div className="relative aspect-[9/16] w-[46%] max-w-[17rem] overflow-hidden rounded-[1.4rem] shadow-[0_40px_80px_-40px_rgba(0,0,0,0.5)]" data-reveal="clip">
              <Image src={media.socialDesign.src} alt={t.production.items.find((i) => i.src === media.socialDesign.src)?.alt ?? ''} fill sizes="(min-width: 1024px) 17rem, 46vw" className="object-cover" />
            </div>
            <div className="relative mt-16 aspect-[4/5] w-[46%] max-w-[17rem] overflow-hidden rounded-[1.4rem] shadow-[0_40px_80px_-40px_rgba(0,0,0,0.5)]" data-reveal="clip" style={{ '--delay': '150ms' } as React.CSSProperties}>
              <Image
                src={media.conceptNewspaper.src}
                alt={t.locale === 'tr' ? 'Gazete okuyan model, siyah beyaz konsept çekim' : 'Model reading a newspaper, black-and-white concept shoot'}
                fill
                sizes="(min-width: 1024px) 17rem, 46vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <Process eyebrow={t.servicePage.processEyebrow} title={t.process.title} steps={t.process.steps} tone="dark" />
    </>
  )
}

function WebExtras({ t }: { t: Dictionary }) {
  return (
    <>
      <FeaturedProject t={t} tone="dark" />

      <section className="bg-paper py-24 text-ink sm:py-32">
        <div className="container-x grid gap-16 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-4">
            <p className="eyebrow mb-6 text-graphite" data-reveal>
              {t.servicePage.webBuildsTitle}
            </p>
            <ul className="space-y-3">
              {t.servicePage.webBuilds.map((b, i) => (
                <li key={b} className="flex items-center gap-3 text-[1.1rem]" data-reveal style={{ '--delay': `${i * 60}ms` } as React.CSSProperties}>
                  <span className="h-1.5 w-1.5 rounded-full bg-signal" aria-hidden="true" />
                  {b}
                </li>
              ))}
            </ul>
          </div>
          <div className="lg:col-span-8">
            <h2 className="display-m" data-reveal>
              {t.servicePage.webSectorsTitle}
            </h2>
            <p className="lead mb-12 mt-5 max-w-[44ch] text-ink/65" data-reveal style={{ '--delay': '80ms' } as React.CSSProperties}>
              {t.servicePage.webSectorsBody}
            </p>
            <SectorList sectors={t.servicePage.webSectors} />
          </div>
        </div>
      </section>

      <Process eyebrow={t.servicePage.processEyebrow} title={t.servicePage.processTitle} steps={t.servicePage.webProcess} tone="dark" />
    </>
  )
}

function AdsExtras({ t }: { t: Dictionary }) {
  return (
    <>
      {/* Platforms + objectives */}
      <section className="bg-ink py-24 text-bone sm:py-32">
        <div className="container-x grid gap-16 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <p className="eyebrow mb-8 text-smoke" data-reveal>
              {t.servicePage.adsPlatformsTitle}
            </p>
            <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-paper-2">
              {[platformLogos.meta, platformLogos.google].map((logo, i) => (
                <div key={logo.name} className="flex aspect-[4/3] items-center justify-center bg-bone px-8" data-reveal="fade" style={{ '--delay': `${i * 90}ms` } as React.CSSProperties}>
                  <Image src={logo.src} alt={logo.name} width={logo.width} height={logo.height} sizes="200px" className="h-auto max-h-10 w-auto max-w-[80%] object-contain" />
                </div>
              ))}
            </div>
            <p className="mt-6 text-[0.95rem] text-bone/55" data-reveal>
              Instagram · Facebook · Google
            </p>
          </div>
          <div className="lg:col-span-7">
            <p className="eyebrow mb-8 text-smoke" data-reveal>
              {t.servicePage.adsObjectivesTitle}
            </p>
            <ol className="border-t border-white/10">
              {t.servicePage.adsObjectives.map((o, i) => (
                <li key={o} className="flex items-baseline gap-6 border-b border-white/10 py-5 sm:py-6" data-reveal style={{ '--delay': `${i * 70}ms` } as React.CSSProperties}>
                  <span className="eyebrow text-smoke">{String(i + 1).padStart(2, '0')}</span>
                  <span className="text-[clamp(1.6rem,3.2vw,2.9rem)] font-medium leading-none tracking-[-0.035em]">{o}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* Goal + reporting on the campaign red */}
      <section className="grain relative isolate overflow-hidden bg-signal py-24 text-bone sm:py-32">
        <div className="container-x grid items-center gap-14 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-7">
            <p className="text-[clamp(1.7rem,3.2vw,3.1rem)] font-medium leading-[1.14] tracking-[-0.03em]" data-reveal>
              {t.servicePage.adsGoal}
            </p>
            <div className="mt-14 border-t border-bone/25 pt-10">
              <h2 className="display-s" data-reveal>
                {t.servicePage.adsReportTitle}
              </h2>
              <p className="mt-4 max-w-[46ch] text-[1.02rem] leading-relaxed text-bone/75" data-reveal style={{ '--delay': '80ms' } as React.CSSProperties}>
                {t.servicePage.adsReportBody}
              </p>
              <ul className="mt-8 flex flex-wrap gap-2.5">
                {t.servicePage.adsMetrics.map((m, i) => (
                  <li key={m} className="rounded-full border border-bone/35 px-4 py-2 text-[0.92rem]" data-reveal="fade" style={{ '--delay': `${i * 70}ms` } as React.CSSProperties}>
                    {m}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="flex justify-center gap-4 sm:gap-6 lg:col-span-5 lg:justify-end">
            <div className="relative aspect-[3/4] w-[48%] max-w-[15rem] overflow-hidden rounded-[1.4rem]" data-reveal="clip">
              <Image
                src={media.trayInstagram.src}
                alt={t.locale === 'tr' ? 'Kırmızı fonda tepside Instagram logosu' : 'The Instagram logo on a tray against a red wall'}
                fill
                sizes="(min-width: 1024px) 15rem, 48vw"
                className="object-cover"
              />
            </div>
            <div className="relative mt-14 aspect-[3/4] w-[48%] max-w-[15rem] overflow-hidden rounded-[1.4rem]" data-reveal="clip" style={{ '--delay': '150ms' } as React.CSSProperties}>
              <Image
                src={media.newCustomer.src}
                alt={t.locale === 'tr' ? 'Ekranında “Yeni müşteri!” yazan dizüstü bilgisayar' : 'A laptop whose screen reads “New customer!” in Turkish'}
                fill
                sizes="(min-width: 1024px) 15rem, 48vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

function OtherServices({ locale, t, current }: { locale: Locale; t: Dictionary; current: ServiceId }) {
  const others = SERVICE_IDS.filter((id) => id !== current)
  return (
    <section className="bg-ink pt-24 sm:pt-32" aria-labelledby="other-services">
      <div className="container-x">
        <h2 id="other-services" className="eyebrow mb-8 text-smoke">
          {t.servicePage.otherServices}
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {others.map((id) => (
            <Link
              key={id}
              href={href(locale, id)}
              className="group flex flex-col overflow-hidden rounded-[1.6rem] border border-white/10 bg-ink-2 transition-colors hover:border-white/25"
            >
              {/* Photo and title in separate rows: no text over the image. */}
              <div className="relative aspect-[16/10] overflow-hidden bg-signal-deep">
                <Image
                  src={serviceTrays[id].src}
                  alt=""
                  fill
                  sizes="(min-width: 640px) 50vw, 100vw"
                  className="object-cover object-[50%_42%] transition-transform duration-[1.2s] ease-[var(--ease-out-expo)] group-hover:scale-105"
                />
              </div>
              <div className="flex items-center justify-between gap-6 p-6 sm:p-8">
                <span className="flex items-baseline gap-4">
                  <span className="eyebrow text-smoke">{t.services[id].number}</span>
                  <span className="text-[clamp(1.2rem,2vw,1.9rem)] font-medium leading-tight tracking-[-0.03em] text-bone [text-wrap:balance]">
                    {t.services[id].title}
                  </span>
                </span>
                <span aria-hidden="true" className="text-2xl text-bone transition-transform duration-500 group-hover:-translate-y-1 group-hover:translate-x-1">
                  ↗
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
