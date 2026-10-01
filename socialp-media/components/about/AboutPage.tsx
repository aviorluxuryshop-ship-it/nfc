import Image from 'next/image'

import { CtaBand } from '@/components/CtaBand'
import { Clients } from '@/components/home/Clients'
import { Marquee } from '@/components/Marquee'
import { PageHero } from '@/components/PageHero'
import { getDictionary } from '@/lib/content'
import { media } from '@/lib/media'
import type { Locale } from '@/lib/site'

export function AboutPage({ locale }: { locale: Locale }) {
  const t = getDictionary(locale)
  const tr = locale === 'tr'

  return (
    <>
      <PageHero
        eyebrow={t.about.eyebrow}
        title={t.about.title.split(' ').slice(0, -1).join(' ')}
        accent={t.about.title.split(' ').slice(-1).join(' ')}
        aside={
          <div className="relative ml-auto aspect-[4/5] w-full max-w-[30rem] overflow-hidden rounded-[1.5rem]">
            <Image
              src={media.streetCampaign.src}
              alt={tr ? 'Elinde “Socialp Media” yazılı karton tutan model, yaya geçidinde' : 'A model holding a “Socialp Media” cardboard sign on a crosswalk'}
              fill
              priority
              sizes="(min-width: 1024px) 30rem, 92vw"
              className="object-cover"
            />
          </div>
        }
      />

      {/* Story */}
      <section className="bg-paper py-24 text-ink sm:py-36">
        <div className="container-x grid gap-14 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-[calc(var(--header-h)+2rem)]">
              <p className="eyebrow text-graphite" data-reveal>
                2021 — {new Date().getFullYear()}
              </p>
              <div className="relative mt-10 aspect-[2/3] w-full max-w-[18rem] overflow-hidden rounded-2xl" data-reveal="clip">
                <Image
                  src={media.officeSign.src}
                  alt={tr ? 'Socialp Media ofis tabelası' : 'Socialp Media office sign'}
                  width={media.officeSign.width}
                  height={media.officeSign.height}
                  sizes="288px"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
          <div className="space-y-10 lg:col-span-8">
            {t.about.paragraphs.map((p, i) => (
              <p
                key={i}
                className={i === 0 ? 'text-[clamp(1.5rem,2.7vw,2.6rem)] font-medium leading-[1.18] tracking-[-0.03em]' : 'lead max-w-[56ch] text-ink/70'}
                data-reveal
                style={{ '--delay': `${i * 90}ms` } as React.CSSProperties}
              >
                {p}
              </p>
            ))}

            <div className="grid gap-px overflow-hidden rounded-3xl border border-ink/10 bg-ink/10 pt-0 sm:grid-cols-2">
              {t.about.pillars.map((pillar, i) => (
                <div key={pillar.title} className="bg-paper p-8 sm:p-10" data-reveal="fade" style={{ '--delay': `${i * 90}ms` } as React.CSSProperties}>
                  <span className="serif-accent text-[2.6rem] leading-none text-signal">{String(i + 1).padStart(2, '0')}</span>
                  <h2 className="mt-8 text-[1.5rem] font-medium tracking-[-0.025em]">{pillar.title}</h2>
                  <p className="mt-4 text-[1rem] leading-relaxed text-ink/65">{pillar.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Brand in the wild */}
      <section className="bg-ink py-24 sm:py-32">
        <div className="container-x">
          <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-12">
            <figure className="relative col-span-2 aspect-[16/9] overflow-hidden rounded-2xl lg:col-span-7" data-reveal="clip">
              <Image
                src={media.whatWeDo.src}
                alt={tr ? '“Socialp Media — Neler yapıyoruz?” yazılı yırtılabilir not kâğıdı tasarımı' : 'A tear-off note design reading “Socialp Media — what do we do?” in Turkish'}
                fill
                sizes="(min-width: 1024px) 58vw, 100vw"
                className="object-cover"
              />
            </figure>
            <figure className="relative aspect-[4/5] overflow-hidden rounded-2xl lg:col-span-5 lg:row-span-2 lg:aspect-auto" data-reveal="clip" style={{ '--delay': '120ms' } as React.CSSProperties}>
              <Image
                src={media.teeIdeas.src}
                alt={tr ? 'Sırtında “farklı fikirler özgün içerikler” yazan siyah Socialp Media tişörtü' : 'Black Socialp Media T-shirt printed with “different ideas, original content” in Turkish'}
                fill
                sizes="(min-width: 1024px) 40vw, 46vw"
                className="object-cover"
              />
            </figure>
            <figure className="relative aspect-[4/5] overflow-hidden rounded-2xl lg:col-span-7 lg:aspect-[16/10]" data-reveal="clip" style={{ '--delay': '200ms' } as React.CSSProperties}>
              <Image
                src={media.teeContent.src}
                alt={tr ? 'Beyaz Socialp Media tişörtü, masa tenisi masası başında' : 'White Socialp Media T-shirt at a table-tennis table'}
                fill
                sizes="(min-width: 1024px) 58vw, 46vw"
                className="object-cover object-[50%_30%]"
              />
            </figure>
          </div>
        </div>
      </section>

      <Marquee items={t.marquee} tone="signal" />

      <section className="bg-ink py-24 sm:py-32">
        <div className="container-x">
          <p className="eyebrow mb-6 text-smoke" data-reveal>
            {t.clients.eyebrow}
          </p>
          <h2 className="display-m mb-12 max-w-[20ch] text-bone sm:mb-16" data-reveal style={{ '--delay': '80ms' } as React.CSSProperties}>
            {t.about.clientsTitle}
          </h2>
          <Clients t={t} />
          <p className="serif-accent mt-16 max-w-[34ch] text-[clamp(1.5rem,2.4vw,2.3rem)] leading-snug text-bone/80" data-reveal>
            {t.about.closing}
          </p>
        </div>
      </section>

      <CtaBand locale={locale} t={t} />
    </>
  )
}
