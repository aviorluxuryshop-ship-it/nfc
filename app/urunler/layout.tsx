import { CategorySidebar } from '@/components/CategorySidebar'

export default function UrunlerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container grid gap-6 py-8 lg:grid-cols-[280px_1fr] lg:gap-10 lg:py-12">
      <CategorySidebar />
      <div className="min-w-0">{children}</div>
    </div>
  )
}
