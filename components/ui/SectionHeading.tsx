export function SectionHeading({
  eyebrow,
  title,
  children,
  align = 'left',
  id,
}: {
  eyebrow?: string
  title: React.ReactNode
  children?: React.ReactNode
  align?: 'left' | 'center'
  id?: string
}) {
  return (
    <div className={align === 'center' ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl'}>
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h2 id={id} className="mt-3 font-display text-[clamp(2rem,4vw,3rem)] font-medium leading-[1.08] tracking-[-0.01em]">
        {title}
      </h2>
      {children && <div className="mt-4 text-lg text-ink-soft">{children}</div>}
    </div>
  )
}
