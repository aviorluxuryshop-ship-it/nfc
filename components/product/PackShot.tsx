'use client'

import { useId } from 'react'

import { products, type ScentSlug } from '@/data/products'
import { scentTheme } from '@/lib/scents'

import { BoxScentArt } from './ScentArt'

/**
 * A drawn VELMO carton, modelled on the real packaging: cream board,
 * navy wordmark with the leaf, rainbow ribbon, stacked sheets and the
 * scent artwork bottom-left. Vector, so it is sharp on every screen and
 * every scent gets a matching box. Swap in studio photos through
 * `Product.photos` whenever they exist.
 *
 * `angle` draws the box in three-quarter view; `front` just the face.
 */

const W = 400
const H = 350
// Depth of the carton, drawn as an oblique offset up and to the right.
const DX = 78
const DY = -44
const D = 86

const FX = 40
const FY = 120

const NAVY = '#16214A'

export function PackShot({
  scent,
  view = 'angle',
  className = '',
  title,
}: {
  scent: ScentSlug
  view?: 'angle' | 'front'
  className?: string
  title?: string
}) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '')
  const product = products.find((p) => p.slug === scent)!
  const label = title ?? `VELMO deterjan yaprağı kutusu, ${product.scent} kokulu`

  const viewBox = view === 'angle' ? '0 40 560 500' : `${FX - 24} ${FY - 24} ${W + 48} ${H + 64}`

  return (
    <svg viewBox={viewBox} className={className} role="img" aria-label={label}>
      <defs>
        <linearGradient id={`${uid}-board`} x1="0" y1="0" x2="0.3" y2="1">
          <stop offset="0" stopColor="#FDFBF7" />
          <stop offset="1" stopColor="#F1ECE2" />
        </linearGradient>
        <linearGradient id={`${uid}-side`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#E7E0D3" />
          <stop offset="1" stopColor="#D9D1C2" />
        </linearGradient>
        <linearGradient id={`${uid}-fade`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#FDFBF7" stopOpacity="0.55" />
          <stop offset="0.35" stopColor="#FDFBF7" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={`${uid}-pill`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={scentTheme[scent].pill[0]} />
          <stop offset="1" stopColor={scentTheme[scent].pill[1]} />
        </linearGradient>
        <linearGradient id={`${uid}-gloss`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FFFFFF" stopOpacity="0.28" />
          <stop offset="0.4" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>
        <filter id={`${uid}-shadow`} x="-20%" y="-50%" width="140%" height="200%">
          <feGaussianBlur stdDeviation="14" />
        </filter>
        <filter id={`${uid}-soft`} x="-10%" y="-10%" width="120%" height="140%">
          <feGaussianBlur stdDeviation="3" />
        </filter>
        <clipPath id={`${uid}-face`}>
          <rect width={W} height={H} rx={3} />
        </clipPath>
        <clipPath id={`${uid}-sideclip`}>
          <rect width={D} height={H} />
        </clipPath>
        <path id={`${uid}-arc`} d="M -22 0 A 22 22 0 0 0 22 0" />
      </defs>

      {/* Contact shadow */}
      {view === 'angle' ? (
        <ellipse cx={FX + W / 2 + DX / 2} cy={FY + H + 8} rx={W / 2 + 40} ry={18} fill={NAVY} opacity={0.22} filter={`url(#${uid}-shadow)`} />
      ) : (
        <ellipse cx={FX + W / 2} cy={FY + H + 6} rx={W / 2 - 10} ry={12} fill={NAVY} opacity={0.2} filter={`url(#${uid}-shadow)`} />
      )}

      {view === 'angle' && (
        <>
          {/* Top */}
          <g transform={`matrix(1 0 ${DX / D} ${DY / D} ${FX} ${FY})`}>
            <rect width={W} height={D} fill="#F7F3EB" />
            <rect width={W} height={3} fill="#FFFFFF" opacity={0.8} />
          </g>
          {/* Side */}
          <g transform={`matrix(${DX / D} ${DY / D} 0 1 ${FX + W} ${FY})`}>
            <SideFace scent={scent} uid={uid} />
          </g>
        </>
      )}

      {/* Front */}
      <g transform={`translate(${FX} ${FY})`}>
        <FrontFace scent={scent} uid={uid} boxScent={product.boxScent} />
        <rect width={W} height={H} fill={`url(#${uid}-gloss)`} rx={3} />
        {view === 'angle' && <rect x={W - 1.5} width={1.5} height={H} fill="#FFFFFF" opacity={0.7} />}
      </g>
    </svg>
  )
}

/** Bezier for wave boundary k (0 = bottom edge of the band, 1 = top). */
function waveCurve(t: number) {
  const lerp = (a: number, b: number) => a + (b - a) * t
  return {
    s: [-12, lerp(380, 232)],
    c1: [140, lerp(392, 300)],
    c2: [250, lerp(330, 70)],
    e: [412, lerp(352, 82)],
  }
}

function ribbonPath(t0: number, t1: number) {
  const a = waveCurve(t0)
  const b = waveCurve(t1)
  return [
    `M ${a.s[0]} ${a.s[1]}`,
    `C ${a.c1[0]} ${a.c1[1]} ${a.c2[0]} ${a.c2[1]} ${a.e[0]} ${a.e[1]}`,
    `L ${b.e[0]} ${b.e[1]}`,
    `C ${b.c2[0]} ${b.c2[1]} ${b.c1[0]} ${b.c1[1]} ${b.s[0]} ${b.s[1]}`,
    'Z',
  ].join(' ')
}

function curveStroke(t: number) {
  const a = waveCurve(t)
  return `M ${a.s[0]} ${a.s[1]} C ${a.c1[0]} ${a.c1[1]} ${a.c2[0]} ${a.c2[1]} ${a.e[0]} ${a.e[1]}`
}

// Bottom ribbon is wide — the scent name and weight sit on it.
const STOPS = [0, 0.42, 0.53, 0.62, 0.7, 0.78, 0.86, 0.93, 1]

function FrontFace({ scent, uid, boxScent }: { scent: ScentSlug; uid: string; boxScent: string }) {
  const wave = scentTheme[scent].wave
  return (
    <g clipPath={`url(#${uid}-face)`}>
      <rect width={W} height={H} fill={`url(#${uid}-board)`} />

      {/* Rainbow ribbon */}
      <g>
        {wave.map((color, i) => (
          <path key={i} d={ribbonPath(STOPS[i], STOPS[i + 1])} fill={color} />
        ))}
        {STOPS.slice(1, -1).map((t, i) => (
          <path key={i} d={curveStroke(t)} stroke="#FFFFFF" strokeOpacity={0.28} strokeWidth={0.9} fill="none" />
        ))}
        <path d={ribbonPath(0.995, 1.14)} fill="#FFFFFF" opacity={0.55} />
        <rect width={W} height={296} fill={`url(#${uid}-fade)`} />
      </g>

      <BoxScentArt scent={scent} />

      {/* Stack of sheets */}
      <g transform="translate(120 196)">
        <g filter={`url(#${uid}-soft)`} opacity={0.25}>
          <path d="M8 34 L132 12 L196 40 L72 66 Z" fill={NAVY} />
        </g>
        {[16, 8, 0].map((dy, i) => (
          <g key={dy} transform={`translate(0 ${dy})`}>
            <path d="M0 22 L124 0 L188 26 L64 50 Z" fill={i === 2 ? '#FFFFFF' : '#F7F4EE'} stroke="#DCD5C7" strokeWidth={0.8} />
            <path d="M0 22 L64 50 L64 53 L0 25 Z" fill="#E3DDD1" />
            <path d="M64 50 L188 26 L188 29 L64 53 Z" fill="#ECE7DD" />
          </g>
        ))}
        <path d="M18 23 L124 4 L176 26" stroke="#EEE9DF" strokeWidth={0.8} fill="none" />
      </g>

      {/* Wordmark */}
      <g fill={NAVY}>
        <g transform="translate(110 10)">
          <path d="M0 22 C 2 10 10 2 22 0 C 22 12 14 20 0 22 Z" fill="#3A8A3E" />
          <path d="M2 22 C 4 12 -2 6 -10 4 C -12 14 -6 20 2 22 Z" fill="#5BA548" />
        </g>
        <text x={34} y={104} fontSize={78} fontWeight={800} letterSpacing={-3} style={{ fontFamily: 'var(--font-sans)' }}>
          VELMO
        </text>
        <text x={38} y={130} fontSize={14.5} fontWeight={600} letterSpacing={2.4} style={{ fontFamily: 'var(--font-sans)' }}>
          LAUNDRY DETERGENT SHEETS
        </text>
        <g style={{ fontFamily: 'var(--font-sans)' }} textAnchor="middle">
          <text x={350} y={58} fontSize={38} fontWeight={800}>30</text>
          <text x={350} y={74} fontSize={10.5} fontWeight={700} letterSpacing={1.5}>SHEETS</text>
          <text x={350} y={87} fontSize={8.5} fontWeight={600} letterSpacing={1}>30 WASHES</text>
        </g>
      </g>
      <rect x={38} y={142} width={168} height={22} rx={11} fill={`url(#${uid}-pill)`} />
      <text x={122} y={157} fontSize={9.5} fontWeight={700} letterSpacing={1.2} fill="#FFFFFF" textAnchor="middle" style={{ fontFamily: 'var(--font-sans)' }}>
        FOR COLOURED CLOTHES
      </text>

      {/* Eco badge */}
      <g transform="translate(352 240)">
        <circle r={29} fill="#2E7A47" stroke="#FFFFFF" strokeWidth={2.5} />
        <path d="M-9 8 C -9 -6 2 -13 12 -13 C 12 0 3 8 -9 8 Z" fill="#FFFFFF" />
        <path d="M-9 8 L4 -4" stroke="#2E7A47" strokeWidth={1.4} />
        <text fontSize={5.8} fontWeight={700} letterSpacing={0.6} fill="#FFFFFF" style={{ fontFamily: 'var(--font-sans)' }} transform="translate(0 2)">
          <textPath href={`#${uid}-arc`} startOffset="50%" textAnchor="middle">
            ECO-FRIENDLY
          </textPath>
        </text>
      </g>

      {/* Scent + weight */}
      <g fill="#FFFFFF" style={{ fontFamily: 'var(--font-sans)' }}>
        <text x={26} y={326} fontSize={17} fontWeight={700} letterSpacing={2.6}>
          {boxScent}
        </text>
        <text x={26} y={339} fontSize={6.8} fontWeight={600} letterSpacing={1.2} opacity={0.92}>
          LONG LASTING FRESHNESS
        </text>
        <text x={374} y={334} fontSize={16} fontWeight={600} textAnchor="end">
          120 g
        </text>
      </g>
    </g>
  )
}

function SideFace({ scent, uid }: { scent: ScentSlug; uid: string }) {
  const wave = scentTheme[scent].wave
  return (
    <g clipPath={`url(#${uid}-sideclip)`}>
      <rect width={D} height={H} fill={`url(#${uid}-side)`} />
      <g fill={NAVY} style={{ fontFamily: 'var(--font-sans)' }} fontWeight={800} fontSize={10} letterSpacing={0.4}>
        <text x={12} y={32}>CLEAN</text>
        <text x={12} y={45}>TODAY</text>
        <text x={12} y={58}>GREENER</text>
        <text x={12} y={71}>TOMORROW</text>
      </g>
      {[104, 146, 188].map((y) => (
        <circle key={y} cx={26} cy={y} r={9} fill="none" stroke={NAVY} strokeOpacity={0.55} strokeWidth={1.3} />
      ))}
      {[118, 160, 202].map((y) => (
        <rect key={y} x={12} y={y} width={46} height={3} rx={1.5} fill={NAVY} opacity={0.25} />
      ))}
      {wave.slice(0, 4).map((color, i) => (
        <path key={i} d={`M0 ${300 - i * 14} C 30 ${292 - i * 14} 60 ${276 - i * 16} ${D} ${262 - i * 18} L ${D} ${H} L 0 ${H} Z`} fill={color} opacity={i === 0 ? 1 : 0.9} transform={`translate(0 ${i * 0})`} />
      )).reverse()}
      <text x={12} y={336} fill="#FFFFFF" fontSize={15} fontWeight={800} letterSpacing={-0.4} style={{ fontFamily: 'var(--font-sans)' }}>
        VELMO
      </text>
      <rect width={D} height={H} fill="#16214A" opacity={0.05} />
    </g>
  )
}
