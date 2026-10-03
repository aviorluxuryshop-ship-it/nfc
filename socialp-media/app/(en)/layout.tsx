import type { Metadata, Viewport } from 'next'

import { SiteShell } from '@/components/SiteShell'
import { fontVariables } from '@/lib/fonts'
import { rootMetadata } from '@/lib/metadata'

import '../globals.css'

export const metadata: Metadata = rootMetadata('en')

export const viewport: Viewport = {
  themeColor: '#0b0b0c',
  colorScheme: 'dark',
}

export default function EnglishLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={fontVariables} id="top" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body>
        <SiteShell locale="en">{children}</SiteShell>
      </body>
    </html>
  )
}
