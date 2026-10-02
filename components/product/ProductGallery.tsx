'use client'

import Image from 'next/image'
import { useState } from 'react'

import type { Product } from '@/data/products'
import { useI18n } from '@/lib/i18n/client'
import { scentTheme } from '@/lib/scents'

import { PackShot } from './PackShot'
import { ScentEmblem } from './ScentArt'
import { SheetDiagram } from './SheetDiagram'

type Slide = { key: string; label: string; render: (size: 'main' | 'thumb') => React.ReactNode; panel: string }

export function ProductGallery({ product }: { product: Product }) {
  const theme = scentTheme[product.slug]
  const { locale, t } = useI18n()
  const g = t.product.gallery
  const text = product.text[locale]

  const photoSlides: Slide[] = product.photos.map((src, i) => ({
    key: src,
    label: g.photo(i + 1),
    panel: 'bg-white',
    render: (size) => (
      <Image src={src} alt={`${t.product.boxAlt(text.scent)} — ${g.photo(i + 1)}`} fill sizes={size === 'main' ? '(min-width: 1024px) 50vw, 100vw' : '80px'} className="object-contain" priority={i === 0 && size === 'main'} />
    ),
  }))

  const drawnSlides: Slide[] = [
    {
      key: 'angle',
      label: g.box,
      panel: theme.panel,
      render: (size) => <PackShot scent={product.slug} className={size === 'main' ? 'w-[88%]' : 'w-full'} />,
    },
    {
      key: 'front',
      label: g.front,
      panel: theme.panel,
      render: (size) => <PackShot scent={product.slug} view="front" className={size === 'main' ? 'w-[78%]' : 'w-full'} />,
    },
    {
      key: 'sheet',
      label: g.sheet,
      panel: 'bg-paper-cream',
      render: (size) => (
        <SheetDiagram
          className={size === 'main' ? 'h-[78%] w-auto' : 'h-full w-auto'}
          showHalf={size === 'main'}
          label={t.usage.sheetAria}
          halfLabel={t.usage.halfSheet}
        />
      ),
    },
    {
      key: 'scent',
      label: g.scent(text.scent),
      panel: theme.panel,
      render: (size) =>
        size === 'main' ? (
          <div className="flex flex-col items-center text-center">
            <ScentEmblem scent={product.slug} className="h-56 w-56 sm:h-64 sm:w-64" />
            <p className={`mt-4 font-display text-3xl font-medium ${theme.deepText}`}>{text.scent}</p>
            <p className="mt-1 text-ink-soft">{text.note}</p>
          </div>
        ) : (
          <ScentEmblem scent={product.slug} className="h-full w-full" />
        ),
    },
  ]

  const slides = [...photoSlides, ...drawnSlides]
  const [active, setActive] = useState(0)
  const current = slides[active] ?? slides[0]

  return (
    <div className="flex flex-col gap-3">
      <div className={`relative flex aspect-square items-center justify-center overflow-hidden rounded-[2rem] ${current.panel} transition-colors duration-500`}>
        <div key={current.key} className="flex h-full w-full animate-fade-in items-center justify-center">
          {current.render('main')}
        </div>
      </div>
      <ul className="grid grid-cols-4 gap-3" aria-label={t.common.images}>
        {slides.map((s, i) => (
          <li key={s.key}>
            <button
              type="button"
              onClick={() => setActive(i)}
              aria-label={s.label}
              aria-pressed={i === active}
              className={`relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-2xl p-2 ring-offset-2 ring-offset-paper transition ${s.panel} ${
                i === active ? 'ring-2 ring-ink' : 'opacity-80 hover:opacity-100'
              }`}
            >
              {s.render('thumb')}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
