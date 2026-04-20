import type { ReactNode } from 'react'
import Footer from '@/components/Footer'
import Navigation from '@/components/landing/Navigation'

interface LegalShellProps {
  folio: string
  title: ReactNode
  intro?: ReactNode
  children: ReactNode
}

export default function LegalShell({ folio, title, intro, children }: LegalShellProps) {
  return (
    <>
      <Navigation />
      <main>
        <section className="relative pb-16 pt-32 md:pb-24 md:pt-40 lg:pt-48">
          <div className="container-editorial">
            <div className="mx-auto max-w-3xl">
              <p className="folio mb-6">{folio}</p>
              <h1 className="display-lg text-[color:var(--color-encre)]">{title}</h1>
              {intro && (
                <p className="mt-8 max-w-[58ch] text-[1.0625rem] leading-relaxed text-[color:var(--color-encre-70)]">
                  {intro}
                </p>
              )}
            </div>
          </div>
        </section>

        <section className="relative pb-24 md:pb-32">
          <div className="container-editorial">
            <div className="mx-auto max-w-3xl">
              <hr className="rule mb-12" />
              <div className="legal-prose">{children}</div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

export function LegalSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="legal-section">
      <h2 className="display-md">{title}</h2>
      <div className="legal-body">{children}</div>
    </section>
  )
}
