import type { ScentSlug } from '@/data/products'

/**
 * Hand-built scent illustrations — lavender sprigs, white spring blossoms
 * and orange slices, as on the boxes. Drawn from primitives so they stay
 * crisp at every size and need no image files. Used on the pack shot and
 * as the small scent chips next to every scent name.
 */

const LAVENDER = ['#5B3F94', '#7A5BBF', '#9A7ED3', '#6A4CA6', '#B39BE0']

function Sprig({ x, y, angle, length, scale = 1 }: { x: number; y: number; angle: number; length: number; scale?: number }) {
  const florets = []
  const levels = 9
  for (let i = 0; i < levels; i++) {
    const t = 0.42 + (0.58 * i) / (levels - 1)
    const fy = -length * t
    const s = (1 - 0.45 * (i / (levels - 1))) * scale
    const sway = Math.sin(i * 1.7) * 0.6
    florets.push(
      <ellipse key={`l${i}`} cx={-3.4 * s + sway} cy={fy} rx={3.3 * s} ry={5.4 * s} fill={LAVENDER[i % 5]} transform={`rotate(-26 ${-3.4 * s + sway} ${fy})`} />,
      <ellipse key={`r${i}`} cx={3.4 * s + sway} cy={fy - 2} rx={3.3 * s} ry={5.4 * s} fill={LAVENDER[(i + 2) % 5]} transform={`rotate(26 ${3.4 * s + sway} ${fy - 2})`} />,
    )
    if (i % 2 === 0) {
      florets.push(<ellipse key={`c${i}`} cx={sway} cy={fy - 4} rx={2.8 * s} ry={4.6 * s} fill={LAVENDER[(i + 4) % 5]} />)
    }
  }
  return (
    <g transform={`translate(${x} ${y}) rotate(${angle})`}>
      <path d={`M0 0 Q ${length * 0.04} ${-length * 0.5} 0 ${-length * 1.02}`} stroke="#6E8F55" strokeWidth={1.6 * scale} fill="none" strokeLinecap="round" />
      <path d={`M0 ${-length * 0.18} q ${-9 * scale} ${-6 * scale} ${-14 * scale} ${-16 * scale} q ${8 * scale} ${3 * scale} ${14 * scale} ${16 * scale}`} fill="#86A86A" />
      {florets}
    </g>
  )
}

function Leaf({ x, y, angle, length, width, fill = '#5E9B5A' }: { x: number; y: number; angle: number; length: number; width: number; fill?: string }) {
  const l = length
  const w = width
  return (
    <g transform={`translate(${x} ${y}) rotate(${angle})`}>
      <path d={`M0 0 C ${w} ${-l * 0.3} ${w * 0.7} ${-l * 0.82} 0 ${-l} C ${-w * 0.7} ${-l * 0.82} ${-w} ${-l * 0.3} 0 0 Z`} fill={fill} />
      <path d={`M0 0 L0 ${-l * 0.92}`} stroke="rgba(255,255,255,0.35)" strokeWidth={0.9} />
    </g>
  )
}

function Blossom({ x, y, r, rotate = 0 }: { x: number; y: number; r: number; rotate?: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate})`}>
      {[0, 72, 144, 216, 288].map((a) => (
        <ellipse key={a} cx={0} cy={-r * 0.55} rx={r * 0.44} ry={r * 0.62} fill="#FFFFFF" stroke="#E2DCCC" strokeWidth={0.8} transform={`rotate(${a})`} />
      ))}
      {[36, 108, 180, 252, 324].map((a) => (
        <path key={a} d={`M0 0 L0 ${-r * 0.5}`} stroke="#EDE6D3" strokeWidth={0.7} transform={`rotate(${a - 36})`} />
      ))}
      <circle r={r * 0.22} fill="#F2C14E" />
      <circle r={r * 0.11} fill="#E3A42A" />
    </g>
  )
}

function OrangeSlice({ x, y, r, rotate = 0 }: { x: number; y: number; r: number; rotate?: number }) {
  const segments = 10
  const wedges = []
  for (let k = 0; k < segments; k++) {
    const a0 = ((k * 360) / segments + 3.2) * (Math.PI / 180)
    const a1 = (((k + 1) * 360) / segments - 3.2) * (Math.PI / 180)
    const ri = r * 0.12
    const ro = r * 0.78
    const p = (a: number, rr: number) => `${(Math.cos(a) * rr).toFixed(2)} ${(Math.sin(a) * rr).toFixed(2)}`
    wedges.push(
      <path key={k} d={`M ${p((a0 + a1) / 2, ri)} L ${p(a0, ro)} A ${ro} ${ro} 0 0 1 ${p(a1, ro)} Z`} fill="#F9B04A" />,
    )
  }
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate})`}>
      <circle r={r} fill="#EE8420" />
      <circle r={r * 0.9} fill="#FFF0D0" />
      <circle r={r * 0.84} fill="#F59A2E" />
      {wedges}
      <circle r={r * 0.1} fill="#FFF0D0" />
      <ellipse cx={-r * 0.35} cy={-r * 0.4} rx={r * 0.2} ry={r * 0.08} fill="#FFFFFF" opacity={0.35} transform={`rotate(-40 ${-r * 0.35} ${-r * 0.4})`} />
    </g>
  )
}

function Orange({ x, y, r }: { x: number; y: number; r: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <circle r={r} fill="#EE8420" />
      <circle cx={r * 0.18} cy={r * 0.2} r={r * 0.82} fill="#E2741A" opacity={0.45} />
      <ellipse cx={-r * 0.38} cy={-r * 0.38} rx={r * 0.26} ry={r * 0.14} fill="#FFFFFF" opacity={0.3} transform={`rotate(-40 ${-r * 0.38} ${-r * 0.38})`} />
      <circle cx={0} cy={-r * 0.92} r={r * 0.08} fill="#7A5A1E" />
    </g>
  )
}

/**
 * Composition for the box front (face is 400×350). Kept above y≈300 so the
 * white scent name printed on the bottom ribbon always stays readable.
 */
export function BoxScentArt({ scent }: { scent: ScentSlug }) {
  if (scent === 'lavanta') {
    return (
      <g>
        <Sprig x={-8} y={300} angle={50} length={140} />
        <Sprig x={-12} y={276} angle={38} length={124} scale={0.95} />
        <Sprig x={6} y={318} angle={60} length={140} />
        <Sprig x={-14} y={250} angle={28} length={100} scale={0.85} />
      </g>
    )
  }
  if (scent === 'bahar') {
    return (
      <g>
        <Leaf x={10} y={282} angle={58} length={54} width={14} />
        <Leaf x={22} y={262} angle={12} length={50} width={13} fill="#4C8A4E" />
        <Leaf x={74} y={284} angle={84} length={44} width={12} fill="#6FAA62" />
        <Leaf x={-4} y={226} angle={40} length={42} width={11} fill="#4C8A4E" />
        <Blossom x={38} y={234} r={28} rotate={8} />
        <Blossom x={92} y={262} r={22} rotate={-14} />
        <Blossom x={14} y={282} r={17} rotate={30} />
        <Blossom x={118} y={222} r={13} rotate={20} />
      </g>
    )
  }
  return (
    <g>
      <Leaf x={74} y={232} angle={62} length={48} width={14} fill="#4C8A4E" />
      <Leaf x={30} y={222} angle={-18} length={42} width={12} />
      <Orange x={22} y={270} r={30} />
      <OrangeSlice x={82} y={262} r={33} rotate={12} />
      <OrangeSlice x={136} y={284} r={18} rotate={-20} />
    </g>
  )
}

/** Small round scent emblem (viewBox 0 0 100 100) for chips and lists. */
export function ScentEmblem({ scent, className = '' }: { scent: ScentSlug; className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      {scent === 'lavanta' && (
        <g>
          <Sprig x={36} y={96} angle={-14} length={84} scale={0.95} />
          <Sprig x={52} y={98} angle={4} length={92} scale={1.05} />
          <Sprig x={66} y={96} angle={20} length={80} scale={0.9} />
        </g>
      )}
      {scent === 'bahar' && (
        <g>
          <Leaf x={50} y={58} angle={-50} length={40} width={11} />
          <Leaf x={50} y={58} angle={56} length={38} width={10} fill="#4C8A4E" />
          <Leaf x={52} y={60} angle={170} length={30} width={9} fill="#6FAA62" />
          <Blossom x={50} y={48} r={30} rotate={10} />
        </g>
      )}
      {scent === 'narenciye' && (
        <g>
          <Leaf x={66} y={30} angle={40} length={30} width={10} fill="#4C8A4E" />
          <OrangeSlice x={48} y={54} r={36} rotate={8} />
        </g>
      )}
    </svg>
  )
}
