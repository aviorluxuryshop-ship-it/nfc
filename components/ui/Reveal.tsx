/**
 * Marks a block to fade and rise into place when it scrolls into view.
 * The work is done once, page-wide, by <ScrollReveal /> plus CSS in
 * globals.css — so this stays a plain server component.
 *
 * `stagger` reveals the direct children one after another instead.
 */
export function Reveal({
  children,
  className = '',
  delay = 0,
  stagger = false,
  as: Tag = 'div',
}: {
  children: React.ReactNode
  className?: string
  delay?: number
  stagger?: boolean
  as?: 'div' | 'li' | 'section' | 'ul' | 'ol'
}) {
  return (
    <Tag
      data-reveal={stagger ? 'stagger' : ''}
      className={className}
      style={delay ? ({ '--reveal-delay': `${delay}ms` } as React.CSSProperties) : undefined}
    >
      {children}
    </Tag>
  )
}
