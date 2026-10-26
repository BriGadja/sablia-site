import { Eyebrow } from '@/components/shell/Eyebrow'
import { of1 } from '@/content/of1'
import CrmLinks from './CrmLinks'

const SPREADSHEETS = ['Google Sheets', 'Excel 365'] as const

export default function AudienceStrip() {
  const crms = of1.crms.filter((name) => !(SPREADSHEETS as readonly string[]).includes(name))
  return (
    <section id="pour-qui" className="sec">
      <div className="wrap">
        <Eyebrow>Pour qui</Eyebrow>
        <h2 className="h2">Avec ou sans CRM.</h2>
        <p className="sub">
          Pour les équipes commerciales de {of1.teamSize.min} à {of1.teamSize.max} personnes.
        </p>
        <div className="cases">
          <div className="case">
            <h3>Vous avez un CRM</h3>
            <CrmLinks names={crms} />
            <p>Nous ne vendons pas le CRM, nous le remplissons.</p>
          </div>
          <div className="case">
            <h3>Votre CRM est un tableur</h3>
            <CrmLinks names={SPREADSHEETS} />
            <p>Excel 365 fonctionne si le fichier est dans OneDrive ou SharePoint.</p>
          </div>
          <div className="case">
            <h3>Vous n'en avez pas</h3>
            <p>
              Nous le construisons avec vous : un tableur bien tenu, un CRM du marché configuré, ou
              un outil sur mesure. Chiffré sous 24 heures, hors de cette offre.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
