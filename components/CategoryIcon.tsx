import { CakeSlice, Cherry, Croissant, LayoutGrid, Salad, Sandwich, Soup } from 'lucide-react'

function CheeseIcon({ size = 24, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d="M3 17 21 8v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1Z" />
      <path d="M3 17 21 8 12 4 3 9Z" opacity="0" />
      <circle cx="9" cy="15" r="1" />
      <circle cx="15" cy="14" r="1.2" />
      <circle cx="18" cy="16" r=".5" />
    </svg>
  )
}

const icons = { peynir: CheeseIcon, zeytin: Cherry, tatli: CakeSlice, salata: Salad, sicak: Soup, unlu: Croissant, sandvic: Sandwich, tumu: LayoutGrid } as const

export function CategoryIcon({ slug, size = 22, className }: { slug: string; size?: number; className?: string }) {
  const Icon = icons[slug as keyof typeof icons] ?? LayoutGrid
  return <Icon size={size} className={className} />
}
