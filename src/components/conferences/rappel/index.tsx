import { WebinarReminder } from '@/components/shell/WebinarReminder'
import './rappel.css'

/**
 * Between `#preuve` and `#fin` of /conferences: the shared webinar reminder (nothing from the session
 * start). The wrapper keeps the sand room the `#fin` dune overlaps, with or without the reminder.
 */
export function ConferencesRappel() {
  return (
    <div className="v2-conf-rappel">
      <WebinarReminder />
    </div>
  )
}
