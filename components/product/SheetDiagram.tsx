/** One sheet at true proportions (11 × 28 cm), with the halfway fold. */
export function SheetDiagram({
  className = '',
  showHalf = true,
  label,
  halfLabel,
}: {
  className?: string
  showHalf?: boolean
  label: string
  halfLabel: string
}) {
  return (
    <svg viewBox="0 0 220 380" className={className} role="img" aria-label={label}>
      <defs>
        <linearGradient id="sheet-face" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FFFFFF" />
          <stop offset="1" stopColor="#F3EFE7" />
        </linearGradient>
        <filter id="sheet-shadow" x="-30%" y="-10%" width="160%" height="130%">
          <feDropShadow dx="0" dy="10" stdDeviation="10" floodColor="#16214A" floodOpacity="0.14" />
        </filter>
      </defs>
      <rect x={62} y={30} width={110} height={280} rx={5} fill="url(#sheet-face)" stroke="#DDD6C8" filter="url(#sheet-shadow)" />
      {Array.from({ length: 22 }).map((_, i) => (
        <circle key={i} cx={72 + ((i * 37) % 90)} cy={46 + ((i * 53) % 250)} r={1.1} fill="#E6E0D3" />
      ))}
      {showHalf && (
        <>
          <line x1={62} y1={170} x2={172} y2={170} stroke="#16214A" strokeOpacity={0.45} strokeDasharray="5 5" strokeWidth={1.4} />
          <text x={117} y={164} textAnchor="middle" fontSize={11} fontWeight={600} fill="#454E70" style={{ fontFamily: 'var(--font-sans)' }}>
            {halfLabel}
          </text>
        </>
      )}
      {/* Height */}
      <g stroke="#16214A" strokeWidth={1.2} strokeOpacity={0.6}>
        <line x1={36} y1={30} x2={36} y2={310} />
        <line x1={30} y1={30} x2={42} y2={30} />
        <line x1={30} y1={310} x2={42} y2={310} />
        {/* Width */}
        <line x1={62} y1={340} x2={172} y2={340} />
        <line x1={62} y1={334} x2={62} y2={346} />
        <line x1={172} y1={334} x2={172} y2={346} />
      </g>
      <g fill="#16214A" style={{ fontFamily: 'var(--font-sans)' }} fontSize={13} fontWeight={700}>
        <rect x={16} y={158} width={40} height={24} rx={12} fill="#FCFBF8" />
        <text x={36} y={175} textAnchor="middle">28 cm</text>
        <rect x={97} y={329} width={40} height={24} rx={12} fill="#FCFBF8" />
        <text x={117} y={346} textAnchor="middle">11 cm</text>
      </g>
    </svg>
  )
}

/** Tiny sheet glyph — full or half — for the dosage guide. */
export function SheetGlyph({ fraction, className = '' }: { fraction: number; className?: string }) {
  return (
    <svg viewBox="0 0 40 72" className={className} aria-hidden="true">
      <rect x={6} y={4} width={28} height={64} rx={3} fill="none" stroke="#16214A" strokeOpacity={0.25} strokeDasharray={fraction < 1 ? '3 3' : undefined} />
      <rect x={6} y={fraction < 1 ? 36 : 4} width={28} height={fraction < 1 ? 32 : 64} rx={3} fill="#FFFFFF" stroke="#16214A" strokeWidth={1.6} />
    </svg>
  )
}
