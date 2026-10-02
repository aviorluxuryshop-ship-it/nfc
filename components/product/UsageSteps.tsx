/**
 * The three-step "how to use", each with its own small drawing of a
 * washing machine. Line art in the brand navy, so it reads as one set.
 */

const STROKE = '#16214A'

function Machine({ children, accent }: { children: React.ReactNode; accent: string }) {
  return (
    <g>
      <rect x={30} y={18} width={100} height={124} rx={12} fill="#FFFFFF" stroke={STROKE} strokeWidth={2.4} />
      <line x1={30} y1={42} x2={130} y2={42} stroke={STROKE} strokeWidth={2} />
      <rect x={40} y={27} width={26} height={8} rx={3} fill={accent} opacity={0.5} />
      <circle cx={112} cy={30} r={5} fill="none" stroke={STROKE} strokeWidth={2} />
      <circle cx={96} cy={30} r={2.4} fill={STROKE} />
      <circle cx={80} cy={92} r={34} fill="#F5F1E9" stroke={STROKE} strokeWidth={2.4} />
      <circle cx={80} cy={92} r={25} fill={accent} fillOpacity={0.18} stroke={STROKE} strokeWidth={1.6} />
      {children}
    </g>
  )
}

function StepArt({ step, accent }: { step: 1 | 2 | 3; accent: string }) {
  return (
    <svg viewBox="0 0 160 156" className="h-36 w-auto" aria-hidden="true">
      <Machine accent={accent}>
        {step === 1 && (
          <g>
            <rect x={63} y={70} width={32} height={46} rx={3} fill="#FFFFFF" stroke={STROKE} strokeWidth={1.8} transform="rotate(-14 79 93)" />
            <path d="M118 6 C 112 20 104 36 96 50" stroke={accent} strokeWidth={2.4} fill="none" strokeLinecap="round" strokeDasharray="4 5" />
            <path d="M92 44 L96 52 L104 47" stroke={accent} strokeWidth={2.4} fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </g>
        )}
        {step === 2 && (
          <g>
            <rect x={66} y={98} width={28} height={8} rx={2} fill="#FFFFFF" stroke={STROKE} strokeWidth={1.4} />
            <path
              d="M66 76 L74 70 C 77 74 83 74 86 70 L94 76 L91 82 L87 80 L87 98 L73 98 L73 80 L69 82 Z"
              fill={accent}
              fillOpacity={0.8}
              stroke={STROKE}
              strokeWidth={1.8}
              strokeLinejoin="round"
            />
          </g>
        )}
        {step === 3 && (
          <g>
            <path d="M58 98 C 66 90 74 106 82 98 C 90 90 98 106 104 98" stroke={accent} strokeWidth={2.4} fill="none" strokeLinecap="round" />
            <path d="M60 86 C 68 78 76 94 84 86 C 92 78 98 92 102 86" stroke={STROKE} strokeOpacity={0.5} strokeWidth={1.8} fill="none" strokeLinecap="round" />
            <circle cx={124} cy={136} r={18} fill={accent} />
            <path d="M119 128 L131 136 L119 144 Z" fill="#FFFFFF" />
          </g>
        )}
      </Machine>
    </svg>
  )
}

const STEPS = [
  { title: 'Yaprağı makineye koyun', text: 'Bir yaprağı doğrudan makinenin tamburuna, yani çamaşırların gireceği bölmeye bırakın.' },
  { title: 'Çamaşırları ekleyin', text: 'Renkli çamaşırlarınızı yaprağın üzerine yerleştirin ve kapağı kapatın.' },
  { title: 'Makineyi çalıştırın', text: 'Her zamanki yıkama programınızı seçin. Yaprak suyla birlikte çözünür.' },
] as const

export function UsageSteps({ accent = '#6E4FA8' }: { accent?: string }) {
  return (
    <ol className="grid gap-4 md:grid-cols-3">
      {STEPS.map((s, i) => (
        <li key={s.title} className="flex flex-col rounded-3xl border border-line bg-white p-6 sm:p-7">
          <div className="flex items-start justify-between">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-ink text-lg font-bold text-white">{i + 1}</span>
            <StepArt step={(i + 1) as 1 | 2 | 3} accent={accent} />
          </div>
          <h3 className="mt-4 text-xl font-semibold">{s.title}</h3>
          <p className="mt-1.5 text-ink-soft">{s.text}</p>
        </li>
      ))}
    </ol>
  )
}
