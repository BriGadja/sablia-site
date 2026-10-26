import Link from 'next/link'
import VideoFacade from '@/components/VideoFacade'
import type { RessourceSummary } from '@/lib/contenu'
import { posterPath } from './poster'

function formatDate(iso: string | null): string | null {
  if (!iso) return null
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return null
  return date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  })
}

/** Poster props shared by the card and the detail page: own-hosted, or `null` (generic poster). */
export function posterFor(youtubeId: string) {
  const src = posterPath(youtubeId)
  return src ? { src, width: 640, height: 360 } : null
}

/**
 * One resource: its video on the left (click-to-play), so a visitor who lands here without having
 * seen the videos finds them (Brice, 2026-10-02); on the right the title, the summary and the way
 * in. Without a video the card keeps its text alone.
 */
export function RessourceCard({ row }: { row: RessourceSummary }) {
  const date = formatDate(row.published_at)
  return (
    <li className={`v2-ressources-card${row.youtube_id ? '' : ' is-text'}`}>
      {row.youtube_id && (
        <VideoFacade
          youtubeId={row.youtube_id}
          title={row.titre}
          thumbnail={posterFor(row.youtube_id)}
          size="compact"
        />
      )}
      <Link href={`/ressources/${row.slug}`} className="v2-ressources-card-text">
        <h2>{row.titre}</h2>
        {row.resume && <p>{row.resume}</p>}
        <span className="v2-ressources-meta">
          {date && <span className="v2-ressources-date">{date}</span>}
          <span className="v2-ressources-more">Voir la ressource</span>
        </span>
      </Link>
    </li>
  )
}
