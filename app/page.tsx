import Image from 'next/image'
import { CheckCircle2 } from 'lucide-react'

import { ProductRow } from '@/components/ProductRow'
import { Reveal } from '@/components/Reveal'
import { products } from '@/data/products'

const benefits = [
  'Uygulama indirmeye gerek yok, telefon yaklaştırmak yeterli',
  'Google yorumlarını ve Instagram takipçini kalıcı olarak artırır',
  'Kasada, masada ya da resepsiyonda durur — her müşteriye ulaşır',
  'Dayanıklı baskı, uzun ömürlü kullanım',
]

export default function HomePage() {
  return (
    <>
      {/* Hero: full-bleed photo, header floats over it */}
      <section className="relative overflow-hidden bg-ink">
        <div className="relative h-[56vh] min-h-[420px] w-full sm:h-[70vh]">
          <Image
            src="/images/hero/hero-recepsiyon.webp"
            alt="Resepsiyon masasında duran NFC kart ve telefonunu yaklaştıran bir müşteri"
            fill
            priority
            sizes="100vw"
            quality={95}
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
        </div>

        <div className="container -mt-16 pb-16 sm:-mt-20 sm:pb-20">
          <Reveal className="relative rounded-card bg-paper-raised p-7 shadow-lift sm:p-10">
            <span className="inline-flex items-center rounded-full bg-royal/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-royal">
              İşletmeler için NFC kart
            </span>
            <h1 className="mt-4 font-display text-3xl font-bold leading-[1.1] tracking-tight text-ink sm:text-4xl">
              Telefonunu yaklaştır, işletmeni büyüt.
            </h1>
            <p className="mt-4 max-w-xl text-ink-soft">
              Masana ya da kasana koyduğun tek bir kart; müşterin telefonunu yaklaştırdığında doğrudan Google yorum
              sayfana ya da Instagram profiline yönlenir. Kod okutmak, uygulama açmak yok.
            </p>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {benefits.map((benefit) => (
                <li key={benefit} className="flex items-start gap-2 text-sm text-ink-soft">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-royal" />
                  {benefit}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* Catalog rows — the homepage ends here, nothing below */}
      <section className="bg-paper pb-24 pt-4 sm:pt-8">
        <div className="container">
          <Reveal className="mx-auto max-w-xl text-center">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-royal">Kartlar</span>
            <h2 className="mt-2 font-display text-2xl font-bold text-ink sm:text-3xl">Hangi kart sana uygun?</h2>
          </Reveal>

          <div className="mt-14 flex flex-col gap-20 sm:mt-16 sm:gap-28">
            {products.map((product, i) => (
              <Reveal key={product.slug} delay={i * 80}>
                <ProductRow product={product} reverse={i % 2 === 1} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
