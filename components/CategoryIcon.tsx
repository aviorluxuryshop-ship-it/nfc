import { CakeSlice, Croissant, LayoutGrid, Salad, Sandwich, Soup } from 'lucide-react'

type IconProps = { size?: number; className?: string }

function Svg({ size = 24, className, children }: IconProps & { children: React.ReactNode }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      {children}
    </svg>
  )
}

// Peynir dilimi: gövde + delikler.
function CheeseIcon(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M2 19v-7l20-6v13Z" />
      <circle cx="7" cy="16" r="1" />
      <circle cx="13.5" cy="14" r="1.3" />
      <circle cx="19" cy="12" r="1" />
    </Svg>
  )
}

// Zeytin: gövde + yaprak + ince sap.
function OliveIcon(p: IconProps) {
  return (
    <Svg {...p}>
      <ellipse cx="10" cy="14.5" rx="6" ry="7.5" transform="rotate(-35 10 14.5)" />
      <path d="M15.5 7.5c1.2-2.2 3.4-3.2 6-2.8-.3 2.6-2.2 4.2-4.8 4.2" />
      <circle cx="8.5" cy="15.5" r="1.4" />
    </Svg>
  )
}

const icons = { peynir: CheeseIcon, zeytin: OliveIcon, tatli: CakeSlice, salata: Salad, sicak: Soup, unlu: Croissant, sandvic: Sandwich, tumu: LayoutGrid } as const

export function CategoryIcon({ slug, size = 22, className }: { slug: string; size?: number; className?: string }) {
  const Icon = icons[slug as keyof typeof icons] ?? LayoutGrid
  return <Icon size={size} className={className} />
}
