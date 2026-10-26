import type { ReactNode } from 'react'
import { ConsentBanner } from '@/components/consent/ConsentBanner'
import { MeasurementBoot } from '@/components/measurement/MeasurementBoot'
import { OrganizationJsonLd } from '@/components/seo/OrganizationJsonLd'
import { SiteFooter } from '@/components/shell/SiteFooter'
import { SiteHeader } from '@/components/shell/SiteHeader'
import './globals.css'
import { familjen, fragmentMono } from './fonts'

// No `alternates.canonical` here: it would be inherited into 404.html. Pages set their own via src/lib/seo.ts.
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr" className={`${familjen.variable} ${fragmentMono.variable}`}>
      <body>
        <a href="#contenu" className="skip-link">
          Aller au contenu
        </a>
        <SiteHeader />
        {children}
        <SiteFooter />
        <MeasurementBoot />
        <ConsentBanner />
        <OrganizationJsonLd />
      </body>
    </html>
  )
}
