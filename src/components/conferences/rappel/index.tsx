import { WebinarReminder } from '@/components/shell/WebinarReminder'
import './rappel.css'

/**
 * Between `#preuve` and the line toward the monthly offer of /conferences: the shared webinar reminder
 * (nothing from the session start), on the page's sand.
 */
export function ConferencesRappel() {
  return (
    <div className="v2-conf-rappel">
      <WebinarReminder />
    </div>
  )
}
