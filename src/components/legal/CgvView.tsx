import type { CgvArticle } from '@/content/legal/cgv-v2'
import { LegalPage, LegalSection } from './LegalPage'
import { LegalText } from './LegalText'

type Cgv = { intro: string; updated?: string; articles: readonly CgvArticle[] }

/** Renders a CGV data file (v2, or v1 as the fallback) article by article. */
export function CgvView({ cgv }: { cgv: Cgv }) {
  return (
    <LegalPage
      folio="CGV · Prestations"
      title={<>Conditions générales de vente</>}
      intro={<LegalText text={cgv.intro} />}
      updated={cgv.updated}
    >
      {cgv.articles.map((a) => (
        <LegalSection key={a.n} id={`article-${a.n}`} title={`Article ${a.n}. ${a.title}`}>
          {a.blocks.map((b, i) =>
            b.kind === 'p' ? (
              // biome-ignore lint/suspicious/noArrayIndexKey: static content, never reordered
              <p key={i}>
                <LegalText text={b.text} />
              </p>
            ) : (
              // biome-ignore lint/suspicious/noArrayIndexKey: static content, never reordered
              <ul key={i}>
                {b.items.map((it) => (
                  <li key={it}>
                    <LegalText text={it} />
                  </li>
                ))}
              </ul>
            ),
          )}
        </LegalSection>
      ))}
    </LegalPage>
  )
}
