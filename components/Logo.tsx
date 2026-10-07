import Image from 'next/image'

// Kurumsal logo (beyaz zeminde kırmızı yazı, şeffaf PNG). Yükseklik sınıfla verilir.
export function Logo({ className = 'h-12 sm:h-14' }: { className?: string }) {
  return (
    <Image
      src="/images/logo.png"
      alt="Marmara Gıda Kahvaltı"
      width={1200}
      height={425}
      priority
      sizes="200px"
      className={`w-auto ${className}`}
    />
  )
}
