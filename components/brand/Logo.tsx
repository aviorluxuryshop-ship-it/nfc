import Link from 'next/link'

/**
 * VELMO wordmark with the leaf over the E, as on the packaging. Set in
 * type so it stays sharp; swap for the official SVG logo when available.
 */
export function Logo({ className = '', tone = 'ink' }: { className?: string; tone?: 'ink' | 'white' }) {
  return (
    <span className={`relative inline-flex items-end font-sans font-extrabold leading-none tracking-[-0.04em] ${tone === 'white' ? 'text-white' : 'text-ink'} ${className}`}>
      VELMO
      <svg viewBox="0 0 24 16" aria-hidden="true" className="absolute -top-[0.42em] left-[0.78em] h-[0.42em] w-[0.62em]">
        <path d="M12 16 C 13 8 18 2 24 0 C 24 8 19 14 12 16 Z" fill={tone === 'white' ? '#A7D7A0' : '#3A8A3E'} />
        <path d="M12 16 C 11 9 7 4 1 3 C 1 10 6 15 12 16 Z" fill={tone === 'white' ? '#CDEBC5' : '#5BA548'} />
      </svg>
    </span>
  )
}

export function LogoLink({ className = '' }: { className?: string }) {
  return (
    <Link href="/" aria-label="VELMO ana sayfa" className={`inline-flex pt-2 ${className}`}>
      <Logo className="text-[1.75rem]" />
    </Link>
  )
}
