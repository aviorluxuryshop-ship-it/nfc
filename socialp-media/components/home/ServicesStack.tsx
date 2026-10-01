'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef } from 'react'

import { BrowserFrame } from '@/components/BrowserFrame'
import type { Dictionary } from '@/lib/content'
import { media } from '@/lib/media'
import { href, SERVICE_IDS, type Locale, type ServiceId } from '@/lib/site'

/**
 * Three service cards that pin and stack on desktop: as the next card slides
 * over, the one beneath eases back. Plain flow on smaller screens.
 */
export function ServicesStack({ locale, t }: { locale: Locale; t: Dictionary }) {
  const listRef = useRef<HTMLOListElement>(null)

  useEffect(() => {
    const list = listRef.current
    if (!list) return
    const mq = window.matchMedia('(min-width: 1024px)')
    const items = Array.from(list.querySelectorAll<HTMLElement>('[data-card]'))
    let raf = 0

    const update = () => {
      raf = 0
      if (!mq.matches) {
        items.forEach((el) => {
          el.style.transform = ''
          el.style.filter = ''
        })
        return
      }
      items.forEach((el, i) => {
        const next = items[i + 1]
        if (!next) return
        const host = next.parentElement as HTMLElement
        const stickyTop = parseFloat(getComputedStyle(host).top) || 0
        const distance = host.getBoundingClientRect().top - stickyTop
        const p = 1 - Math.min(Math.max(distance / el.offsetHeight, 0), 1)
        el.style.transform = `scale(${1 - p * 0.06})`
        el.style.filter = `brightness(${1 - p * 0.55})`
      })
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    mq.addEventListener('change', onScroll)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      mq.removeEventListener('change', onScroll)
    }
  }, [])

  return (
    <section id="hizmetler" className="relative bg-ink py-24 sm:py-32" aria-labelledby="services-title">
      <div className="container-x">
        <div className="mb-14 grid gap-8 sm:mb-20 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <p className="eyebrow mb-6 text-smoke" data-reveal>
              {t.servicesSection.eyebrow}
            </p>
            <h2 id="services-title" className="display-l max-w-[14ch] text-bone" data-reveal style={{ '--delay': '80ms' } as React.CSSProperties}>
              {t.servicesSection.title}
            </h2>
          </div>
          <p className="lead max-w-[40ch] text-bone/65 lg:col-span-5 lg:justify-self-end" data-reveal style={{ '--delay': '160ms' } as React.CSSProperties}>
            {t.servicesSection.body}
          </p>
        </div>

        <ol ref={listRef} className="flex flex-col gap-6 lg:gap-[12vh]">
          {SERVICE_IDS.map((id, i) => (
            <li
              key={id}
              className="lg:sticky"
              style={{ top: `calc(var(--header-h) + 1.25rem + ${i * 1.4}rem)` } as React.CSSProperties}
            >
              <article
                data-card
                className="grid origin-top overflow-hidden rounded-[2rem] border border-white/10 bg-ink-2 will-change-transform lg:h-[min(76vh,720px)] lg:grid-cols-2"
              >
                <ServiceCardBody id={id} locale={locale} t={t} />
                <ServiceCardMedia id={id} t={t} />
              </article>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

function ServiceCardBody({ id, locale, t }: { id: ServiceId; locale: Locale; t: Dictionary }) {
  const s = t.services[id]
  return (
    <div className="flex flex-col p-7 sm:p-10 lg:p-12">
      <span className="eyebrow text-smoke">
        {s.number} / 03
      </span>
      <h3 className="display-m mt-10 max-w-[12ch] text-bone lg:mt-auto">{s.title}</h3>
      <p className="serif-accent mt-4 text-[clamp(1.25rem,1.7vw,1.6rem)] leading-snug text-bone/70">{s.tagline}</p>
      <p className="mt-6 max-w-[46ch] text-[1.02rem] leading-relaxed text-bone/65">{s.lead}</p>
      <ul className="mt-7 flex flex-wrap gap-2">
        {s.bullets.map((b) => (
          <li key={b} className="rounded-full border border-white/12 px-3.5 py-1.5 text-[0.82rem] text-bone/75">
            {b}
          </li>
        ))}
      </ul>
      <div className="mt-9">
        <Link href={href(locale, id)} className="btn btn-light">
          <span>{t.common.explore}</span>
          <span aria-hidden="true" className="arrow-nudge">
            →
          </span>
        </Link>
      </div>
    </div>
  )
}

function ServiceCardMedia({ id, t }: { id: ServiceId; t: Dictionary }) {
  if (id === 'web') {
    return (
      <div className="relative flex min-h-[22rem] items-center justify-center overflow-hidden bg-[radial-gradient(80%_80%_at_70%_30%,#2a2a2e_0%,#141416_70%)] p-5 sm:p-10">
        <BrowserFrame url={t.featured.url} className="w-full max-w-[40rem]">
          <Image
            src={media.dluxStill.src}
            alt={t.locale === 'tr' ? 'Dlux Professional e-ticaret sitesinin ana sayfası' : 'Home page of the Dlux Professional e-commerce site'}
            width={media.dluxStill.width}
            height={media.dluxStill.height}
            sizes="(min-width: 1024px) 40rem, 92vw"
            className="h-auto w-full"
          />
        </BrowserFrame>
      </div>
    )
  }

  const img = id === 'social' ? media.socialNeedsUs : media.trayInstagram
  const alt =
    id === 'social'
      ? t.locale === 'tr'
        ? 'Bahçede asılı bez üzerinde “Sosyal Medyanın Bize İhtiyacı Var!” yazısı'
        : 'A cloth banner in a garden reading “Social media needs us!” in Turkish'
      : t.locale === 'tr'
        ? 'Kırmızı fonda, beyaz eldivenli elin tuttuğu tepside Instagram logosu'
        : 'A white-gloved hand presenting the Instagram logo on a tray against a red wall'

  return (
    <div className="relative min-h-[24rem] overflow-hidden">
      <Image
        src={img.src}
        alt={alt}
        fill
        sizes="(min-width: 1024px) 50vw, 100vw"
        className="object-cover transition-transform duration-[1.6s] ease-[var(--ease-out-expo)] hover:scale-[1.03]"
      />
    </div>
  )
}
