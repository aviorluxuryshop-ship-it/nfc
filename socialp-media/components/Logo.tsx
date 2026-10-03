import { LOGO_BOX, LOGO_PATH } from '@/lib/logo-path'

// The traced wordmark lives once in the document as a <symbol>; every logo
// on the page is a <use> of it, so the ~24 KB path is never duplicated.
//
// Row geometry (in path units): SOCIALP x 0–2960, y 0–484 · MEDIA x 352–2609,
// y 710–1190. The inline variant clips each row and sets MEDIA beside SOCIALP.
const ROW_SPLIT = 600
const INLINE_GAP = 330
const MEDIA_SHIFT_X = 2960 + INLINE_GAP - 352
const MEDIA_SHIFT_Y = -706
const INLINE_WIDTH = MEDIA_SHIFT_X + 2612
const INLINE_HEIGHT = 490

export function LogoSprite() {
  return (
    <svg aria-hidden="true" width="0" height="0" style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}>
      <defs>
        <symbol id="sp-logo" viewBox={`0 0 ${LOGO_BOX.width} ${LOGO_BOX.height}`}>
          <path d={LOGO_PATH} fill="currentColor" fillRule="evenodd" />
        </symbol>
        <clipPath id="sp-row-top" clipPathUnits="userSpaceOnUse">
          <rect x="0" y="0" width={LOGO_BOX.width} height={ROW_SPLIT} />
        </clipPath>
        <clipPath id="sp-row-bottom" clipPathUnits="userSpaceOnUse">
          <rect x="0" y={ROW_SPLIT} width={LOGO_BOX.width} height={LOGO_BOX.height - ROW_SPLIT} />
        </clipPath>
      </defs>
    </svg>
  )
}

type LogoProps = { className?: string; title?: string }

/** Stacked wordmark, exactly as the brand uses it. */
export function LogoStacked({ className, title = 'Socialp Media' }: LogoProps) {
  return (
    <svg viewBox={`0 0 ${LOGO_BOX.width} ${LOGO_BOX.height}`} className={className} role="img" aria-label={title}>
      <use href="#sp-logo" width={LOGO_BOX.width} height={LOGO_BOX.height} />
    </svg>
  )
}

/** Single-line wordmark for the header, built from the same glyphs. */
export function LogoInline({ className, title = 'Socialp Media' }: LogoProps) {
  return (
    <svg viewBox={`0 0 ${INLINE_WIDTH} ${INLINE_HEIGHT}`} className={className} role="img" aria-label={title}>
      <g clipPath="url(#sp-row-top)">
        <use href="#sp-logo" width={LOGO_BOX.width} height={LOGO_BOX.height} />
      </g>
      <g transform={`translate(${MEDIA_SHIFT_X} ${MEDIA_SHIFT_Y})`}>
        <g clipPath="url(#sp-row-bottom)">
          <use href="#sp-logo" width={LOGO_BOX.width} height={LOGO_BOX.height} />
        </g>
      </g>
    </svg>
  )
}
