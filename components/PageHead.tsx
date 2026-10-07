import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

export function PageHead({ crumbs, title, description }: { crumbs: { label: string; href?: string }[]; title: string; description: string }) {
  return (
    <header className="mb-8">
      <nav aria-label="Sayfa yolu" className="flex flex-wrap items-center gap-1.5 text-sm text-ink-mute">
        {crumbs.map((c, i) => (
          <span key={c.label} className="flex items-center gap-1.5">
            {c.href ? <Link href={c.href} className="hover:text-marmara">{c.label}</Link> : <span className="font-semibold text-marmara" aria-current="page">{c.label}</span>}
            {i < crumbs.length - 1 && <ChevronRight size={14} aria-hidden />}
          </span>
        ))}
      </nav>
      <h1 className="mt-3 font-display text-4xl font-bold tracking-tight sm:text-5xl">{title}</h1>
      <p className="mt-3 max-w-2xl text-ink-soft">{description}</p>
    </header>
  )
}
