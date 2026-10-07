export function SectionTitle({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return (
    <h2 className="flex items-center gap-4 font-display text-3xl font-bold sm:text-4xl">
      <span className={`h-0.5 w-10 ${light ? 'bg-white' : 'bg-marmara'}`} aria-hidden />
      {children}
    </h2>
  )
}
