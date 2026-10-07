import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Banknote, ClipboardList, Leaf, MapPin, Truck } from 'lucide-react'

import { ProductCard } from '@/components/ProductCard'
import { SectionTitle } from '@/components/SectionTitle'
import { categories, featuredIds, imageOf, menu, neighborhoods, restaurant } from '@/data/yemek'
import { tl } from '@/lib/format'

const perks = [
  { icon: Leaf, title: 'Taze ve kaliteli', text: 'Her gün taze hazırlanan ürünler' },
  { icon: ClipboardList, title: '3 adımda sipariş', text: 'Seç, adresini yaz, kapıda öde' },
  { icon: Banknote, title: 'Kapıda ödeme', text: 'Online ödeme yok, kapıda öde' },
  { icon: Truck, title: 'Merter\'e kurye', text: `Minimum sipariş ${tl(restaurant.minOrder)}` },
]

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-white">
        <div className="container relative z-10">
          <div className="max-w-xl py-10 lg:py-14">
            <p className="flex animate-fade-up items-center gap-3 text-xs font-bold uppercase tracking-[0.3em] text-ink-soft">
              <span className="h-0.5 w-10 bg-marmara" aria-hidden />
              Kalite ve tazelik
            </p>
            <h1 className="mt-5 animate-fade-up font-display text-[2.75rem] font-bold leading-[1.05] tracking-tight [animation-delay:80ms] [text-wrap:balance] sm:text-6xl xl:text-[4.25rem]">
              Lezzet dolu <span className="text-marmara">kahvaltılar</span> her zaman yanınızda.
            </h1>
            <p className="mt-5 max-w-md animate-fade-up text-lg text-ink-soft [animation-delay:160ms]">
              Marmara Gıda&apos;nın taze ve kaliteli ürünleriyle sofralarınızı zenginleştirin. Peynirden zeytine, sıcak ürünlerden tatlılara kadar aradığınız her şey tek yerde.
            </p>
            <div className="mt-7 flex animate-fade-up flex-wrap items-center gap-4 [animation-delay:240ms]">
              <Link href="/urunler" className="inline-flex items-center gap-3 rounded-xl bg-marmara px-7 py-4 text-lg font-bold text-white shadow-card transition hover:bg-marmara-dim">
                Hemen Sipariş Ver <ArrowRight size={20} />
              </Link>
              <span className="text-sm font-semibold text-ink-soft">Kapıda ödeme · Sadece Merter civarı</span>
            </div>
          </div>
        </div>
        <div className="relative aspect-[4/3] w-full lg:absolute lg:inset-y-0 lg:right-0 lg:aspect-auto lg:w-[56%]">
          <Image src="/images/hero.webp" alt="Peynir, zeytin, domates ve ekmekten oluşan zengin bir kahvaltı sofrası" fill priority sizes="(min-width:1024px) 56vw, 100vw" className="object-cover" />
          <div className="absolute inset-0 hidden bg-gradient-to-r from-white via-white/25 to-transparent lg:block" />
          <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-white to-transparent lg:hidden" />
        </div>
      </section>

      {/* Güven şeridi */}
      <section aria-label="Avantajlar" className="border-y border-ink/10 bg-white">
        <ul className="container grid grid-cols-2 gap-x-6 gap-y-6 py-7 lg:grid-cols-4">
          {perks.map(({ icon: Icon, title, text }) => (
            <li key={title} className="flex items-center gap-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-marmara-50 text-marmara">
                <Icon size={22} />
              </span>
              <span className="leading-tight">
                <b className="block text-[0.95rem]">{title}</b>
                <span className="text-sm text-ink-soft">{text}</span>
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* Kategoriler */}
      <section className="container py-12">
        <SectionTitle>Kategoriler</SectionTitle>
        <div className="no-scrollbar -mx-5 mt-8 flex snap-x gap-4 overflow-x-auto px-5 pb-3 lg:mx-0 lg:grid lg:grid-cols-7 lg:overflow-visible lg:px-0">
          {categories.map((c) => (
            <Link
              key={c.slug}
              href={`/urunler/${c.slug}`}
              className="group w-36 shrink-0 snap-start rounded-2xl bg-marmara-50/70 p-3 text-center ring-1 ring-marmara/10 transition duration-300 hover:-translate-y-1 hover:shadow-card lg:w-auto"
            >
              <span className="relative block aspect-square overflow-hidden rounded-xl">
                <Image src={imageOf(c.cover)} alt="" fill sizes="(min-width:1024px) 14vw, 144px" className="object-cover transition duration-700 group-hover:scale-110" />
              </span>
              <span className="mt-3 block text-sm font-bold">{c.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Öne çıkanlar */}
      <section className="container pb-16">
        <div className="flex items-end justify-between gap-4">
          <SectionTitle>Öne Çıkan Ürünler</SectionTitle>
          <Link href="/urunler" className="hidden shrink-0 items-center gap-2 font-bold text-marmara hover:underline sm:flex">
            Tüm Ürünleri Gör <ArrowRight size={18} />
          </Link>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
          {featuredIds.map((id) => {
            const item = menu.find((m) => m.id === id)
            return item ? <ProductCard key={id} item={item} /> : null
          })}
        </div>
        <Link href="/urunler" className="mt-8 flex items-center justify-center gap-2 rounded-xl border border-marmara/30 py-4 font-bold text-marmara sm:hidden">
          Tüm Ürünleri Gör <ArrowRight size={18} />
        </Link>
      </section>

      {/* Teslimat bölgesi */}
      <section className="bg-marmara text-white">
        <div className="container grid gap-10 py-16 lg:grid-cols-2 lg:items-center">
          <div>
            <SectionTitle light>Servis bölgemiz</SectionTitle>
            <p className="mt-5 max-w-md text-lg text-white/85">
              Merter ve çevresine, Güngören&apos;deki üç mahalleye kapıda ödemeli teslimat yapıyoruz. Sipariş verirken mahallenizi ve sokağınızı seçmeniz yeterli.
            </p>
            <Link href="/urunler" className="mt-7 inline-flex items-center gap-3 rounded-xl bg-white px-7 py-4 font-bold text-marmara transition hover:bg-marmara-50">
              Sipariş ver <ArrowRight size={20} />
            </Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            {neighborhoods.map((n) => (
              <div key={n.name} className="flex items-center gap-4 rounded-2xl bg-white/10 px-5 py-4 ring-1 ring-white/20 backdrop-blur">
                <MapPin className="shrink-0" />
                <span className="font-bold">{n.name} Mahallesi</span>
              </div>
            ))}
            <p className="px-1 text-sm text-white/80 sm:col-span-3 lg:col-span-1">Minimum sipariş {tl(restaurant.minOrder)} · {restaurant.hours}</p>
          </div>
        </div>
      </section>
    </>
  )
}
