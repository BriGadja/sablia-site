import { Eyebrow } from '@/components/shell/Eyebrow'
import { EYEBROW, GROUPS, LEAD, TITLE } from './content'
import './outils.css'

export function Outils() {
  return (
    <section id="outils" className="v2-outils">
      <div className="wrap">
        <Eyebrow>{EYEBROW}</Eyebrow>
        <h2>{TITLE}</h2>
        <p className="ou-lead">{LEAD}</p>
        <div className="ou-tools">
          {GROUPS.map((g) => (
            <div key={g.title} className="ou-group">
              <h3>{g.title}</h3>
              <ul>
                {g.items.map((it) => (
                  <li key={it.name} className="ou-chip">
                    {it.name}
                    {it.note && <span className="ou-note">{it.note}</span>}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
