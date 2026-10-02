import type { Locale } from '@/lib/i18n/config'
import { getI18n } from '@/lib/i18n'

/**
 * The three-step "how to use", each with a small looping animation, like a
 * GIF but drawn in SVG + CSS so it stays sharp and weighs nothing:
 * 1) a sheet flies into the drum, 2) clothes drop in on top of it,
 * 3) the drum turns. With reduced motion each shows its resting frame.
 */

const STROKE = '#16214A'

const STEP_COLORS = [
  { main: '#6E4FA8', soft: 'bg-lavanta-soft', badge: 'bg-lavanta' },
  { main: '#3E8A60', soft: 'bg-bahar-soft', badge: 'bg-bahar' },
  { main: '#D9701A', soft: 'bg-narenciye-soft', badge: 'bg-narenciye' },
] as const

function Machine({ accent, children, className = '' }: { accent: string; children?: React.ReactNode; className?: string }) {
  return (
    <g className={className}>
      <rect x={30} y={18} width={100} height={124} rx={12} fill="#FFFFFF" stroke={STROKE} strokeWidth={2.4} />
      <line x1={30} y1={42} x2={130} y2={42} stroke={STROKE} strokeWidth={2} />
      <rect x={40} y={27} width={26} height={8} rx={3} fill={accent} opacity={0.55} />
      <circle cx={112} cy={30} r={5} fill="none" stroke={STROKE} strokeWidth={2} />
      <circle cx={96} cy={30} r={2.4} fill={STROKE} />
      <circle cx={80} cy={92} r={34} fill="#F5F1E9" stroke={STROKE} strokeWidth={2.4} />
      <circle cx={80} cy={92} r={25} fill={accent} fillOpacity={0.14} stroke={STROKE} strokeWidth={1.6} />
      {children}
    </g>
  )
}

function Shirt({ fill }: { fill: string }) {
  return (
    <path
      d="M-14 -11 L-6 -17 C -3 -13 3 -13 6 -17 L14 -11 L11 -5 L7 -7 L7 13 L-7 13 L-7 -7 L-11 -5 Z"
      fill={fill}
      stroke={STROKE}
      strokeWidth={1.6}
      strokeLinejoin="round"
    />
  )
}

function Sock({ fill }: { fill: string }) {
  return (
    <path
      d="M-4 -12 L4 -12 L4 3 C 4 6 6 7 10 7 C 13 7 14 9 14 11 C 14 14 12 15 9 15 L-1 15 C -4 15 -4 12 -4 10 Z"
      fill={fill}
      stroke={STROKE}
      strokeWidth={1.4}
      strokeLinejoin="round"
    />
  )
}

function StepArt({ step, accent, id }: { step: 0 | 1 | 2; accent: string; id: string }) {
  return (
    <svg viewBox="0 -40 160 196" className="h-56 w-auto overflow-visible" aria-hidden="true">
      {step === 0 && (
        <Machine accent={accent}>
          <circle cx={80} cy={92} r={25} fill={accent} className="us-flash" />
          <g transform="translate(80 94)">
            <g className="us-sheet">
              <rect x={-13} y={-18} width={26} height={36} rx={3} fill="#FFFFFF" stroke={STROKE} strokeWidth={1.8} />
              <line x1={-7} y1={-8} x2={7} y2={-8} stroke={accent} strokeWidth={1.4} strokeLinecap="round" opacity={0.6} />
              <line x1={-7} y1={-2} x2={4} y2={-2} stroke={accent} strokeWidth={1.4} strokeLinecap="round" opacity={0.6} />
            </g>
          </g>
        </Machine>
      )}

      {step === 1 && (
        <Machine accent={accent}>
          <rect x={70} y={104} width={20} height={8} rx={2} fill="#FFFFFF" stroke={STROKE} strokeWidth={1.4} />
          <g transform="translate(76 90)">
            <g className="us-drop">
              <Shirt fill={accent} />
            </g>
          </g>
          <g transform="translate(92 96)">
            <g className="us-drop us-drop-late">
              <g transform="scale(0.75)">
                <Sock fill="#F7AE62" />
              </g>
            </g>
          </g>
        </Machine>
      )}

      {step === 2 && (
        <>
          <defs>
            <clipPath id={`${id}-drum`}>
              <circle cx={80} cy={92} r={24} />
            </clipPath>
          </defs>
          <Machine accent={accent} className="us-shake">
            <g clipPath={`url(#${id}-drum)`}>
              <g className="us-water">
                <path
                  d="M 20 98 q 10 -6 20 0 t 20 0 t 20 0 t 20 0 t 20 0 t 20 0 t 20 0 V 130 H 20 Z"
                  fill={accent}
                  fillOpacity={0.32}
                />
              </g>
              <g className="us-spin">
                <circle cx={80} cy={92} r={24} fill="none" />
                <g transform="translate(70 86) scale(0.62)">
                  <Shirt fill="#8466C6" />
                </g>
                <g transform="translate(91 99) rotate(30) scale(0.55)">
                  <Sock fill="#9FD08E" />
                </g>
                <circle cx={92} cy={80} r={2.6} fill="#FFFFFF" stroke={STROKE} strokeWidth={0.8} />
                <circle cx={68} cy={104} r={2} fill="#FFFFFF" stroke={STROKE} strokeWidth={0.8} />
                <circle cx={84} cy={110} r={1.6} fill="#FFFFFF" stroke={STROKE} strokeWidth={0.8} />
              </g>
            </g>
          </Machine>
          <g>
            <circle cx={124} cy={136} r={18} fill={accent} className="us-pulse" />
            <circle cx={124} cy={136} r={18} fill={accent} />
            <path d="M119 128 L131 136 L119 144 Z" fill="#FFFFFF" />
          </g>
        </>
      )}
    </svg>
  )
}

export function UsageSteps({ locale, idPrefix = 'usage' }: { locale: Locale; idPrefix?: string }) {
  const { t } = getI18n(locale)
  return (
    <ol data-reveal="stagger" className="grid gap-4 md:grid-cols-3">
      {t.usage.steps.map((s, i) => {
        const c = STEP_COLORS[i]
        return (
          <li key={s.title} className="flex flex-col overflow-hidden rounded-3xl border border-line bg-white">
            <div className={`relative flex items-center justify-center px-6 pb-4 pt-6 ${c.soft}`}>
              <span className={`absolute left-5 top-5 flex h-11 w-11 items-center justify-center rounded-full text-lg font-bold text-white ${c.badge}`}>
                {i + 1}
              </span>
              <StepArt step={i as 0 | 1 | 2} accent={c.main} id={`${idPrefix}-${i}`} />
            </div>
            <div className="p-6 sm:p-7">
              <h3 className="text-xl font-semibold">{s.title}</h3>
              <p className="mt-1.5 text-ink-soft">{s.text}</p>
            </div>
          </li>
        )
      })}
    </ol>
  )
}
