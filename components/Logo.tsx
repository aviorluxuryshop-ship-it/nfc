export function Logo({ className = '' }: { className?: string }) {
  return (
    <span className={`inline-flex flex-col items-center leading-none text-marmara ${className}`}>
      <svg viewBox="0 0 48 34" className="mb-1 h-7 w-10" fill="currentColor" aria-hidden>
        <path d="M24 2c5.5 5 6.5 12 0 19-6.5-7-5.5-14 0-19Z" />
        <path d="M21.5 24C12 25 5.5 20 4 10c9-.5 16 5 17.5 14Z" />
        <path d="M26.5 24C36 25 42.5 20 44 10c-9-.5-16 5-17.5 14Z" />
        <path d="M23 22h2v10h-2z" />
      </svg>
      <span className="font-display text-[1.65rem] font-extrabold tracking-[0.14em] sm:text-3xl">MARMARA</span>
      <span className="mt-1.5 flex items-center gap-2 text-[0.7rem] font-bold tracking-[0.45em]">
        <i className="h-px w-6 bg-current" />
        GIDA
        <i className="h-px w-6 bg-current" />
      </span>
    </span>
  )
}
