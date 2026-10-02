/**
 * The ribbon from the box, softened to pastel — the one decorative motif
 * the site borrows from the packaging. Purely ornamental.
 */
const RIBBONS = ['#D9CCEE', '#CFE3F3', '#DCEED3', '#FBF0C6', '#FBE0C9', '#F7D3DD']

export function WaveBackdrop({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 600 500" preserveAspectRatio="none" className={className} aria-hidden="true">
      {RIBBONS.map((c, i) => {
        const o = i * 22
        return (
          <path
            key={c}
            d={`M -20 ${430 - o} C 140 ${470 - o} 260 ${250 - o} 620 ${200 - o} L 620 ${226 - o} C 260 ${276 - o} 140 ${496 - o} -20 ${456 - o} Z`}
            fill={c}
          />
        )
      })}
    </svg>
  )
}
