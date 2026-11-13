import { Eyebrow } from '@/components/shell/Eyebrow'
import QuestionnaireForm from '@/components/webinaire/QuestionnaireForm'
import { QUESTIONNAIRE } from '@/content/webinaire'
import { pageMetadata } from '@/lib/seo'
import '@/components/webinaire/webinaire.css'

export const metadata = pageMetadata({
  path: '/webinaire/questionnaire',
  title: QUESTIONNAIRE.meta.title,
  description: QUESTIONNAIRE.meta.description,
  noindex: true,
})

/**
 * `/webinaire/questionnaire?t=` (US-90): the ten questions sent before the 30-minute call. One
 * screen, no inner scroll; the token link only reads until the visitor sends.
 */
export default function QuestionnairePage() {
  return (
    <main id="contenu" className="v2-webinaire">
      <section id="top" className="wbn-after">
        <div className="wrap wbn-quest">
          <Eyebrow>{QUESTIONNAIRE.eyebrow}</Eyebrow>
          <h1>{QUESTIONNAIRE.title}</h1>
          <p className="wbn-lede">{QUESTIONNAIRE.lede}</p>
          <QuestionnaireForm />
        </div>
      </section>
    </main>
  )
}
