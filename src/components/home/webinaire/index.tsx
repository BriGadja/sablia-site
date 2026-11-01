import { WhenUpcoming } from '@/content/session-bar'
import { WebinaireBandView } from './band'

/**
 * `#webinaire` on the home: the next session while it is ahead, nothing from its start (copy 01b:
 * hidden when no session is upcoming). The switch is `WhenUpcoming`, never a date check here.
 */
export function WebinaireBand() {
  return <WhenUpcoming upcoming={<WebinaireBandView />} past={null} />
}
