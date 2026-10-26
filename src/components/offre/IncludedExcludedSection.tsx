import { Eyebrow } from '@/components/shell/Eyebrow'
import { of1 } from '@/content/of1'

export default function IncludedExcludedSection() {
  return (
    <section id="inclus" className="sec">
      <div className="wrap">
        <Eyebrow>Le périmètre, écrit</Eyebrow>
        <h2 className="h2">Inclus et exclu, nommés.</h2>
        <div className="scope">
          <div>
            <h3>Ce qui est inclus</h3>
            <ul>
              {of1.included.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="is-out">
            <h3>Ce qui est exclu</h3>
            <ul>
              {of1.excluded.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
