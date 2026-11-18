import type { RessourceSummary } from '@/lib/contenu'

export const EYEBROW = 'Vidéos'
export const TITLE = 'Nos vidéos sur YouTube.'
export const CHANNEL_LABEL = 'Voir la chaîne'
export const CHANNEL_URL = 'https://www.youtube.com/channel/UCXzIrGckmJcwKSLCPXV7r1w'
/** US-112: the whole library, every video with its files. */
export const ALL_LABEL = 'Toutes les ressources'
export const ALL_HREF = '/ressources'
const MAX_TILES = 4

/** Copy deck B2 `home.videos.besoin` and `home.videos.link` (US-104): custom builds, the Réalisations door. */
export const BESOIN = 'Un besoin précis ? Je construis aussi à la demande.'
export const REALISATIONS_LABEL = 'Voir les réalisations'
export const REALISATIONS_HREF = '/realisations'

export interface TileSource {
  youtubeId: string
  title: string
  alt: string
}

/** Fallback when the resource list is empty or unreadable outside strict mode: the mockup's four. */
export const TILES: readonly TileSource[] = [
  {
    youtubeId: 'd5fo00AFqVM',
    title: 'Claude branché sur un CRM',
    alt: 'Miniature de la démonstration : Claude branché sur un CRM',
  },
  {
    youtubeId: 'Op67YSG7T84',
    title: "Pipedrive vers n'importe quelle appli",
    alt: "Miniature : brancher Pipedrive à n'importe quelle appli",
  },
  {
    youtubeId: 'V2VLG4alRxI',
    title: 'Le skill de devis',
    alt: 'Miniature : le skill de devis pour Claude',
  },
  {
    youtubeId: 'wbQ6yCKLy3I',
    title: 'La veille du matin',
    alt: 'Miniature : la veille du matin avec Claude',
  },
]

export interface Tile extends TileSource {
  href: string
  /** YouTube: new tab with `rel`; our own resource page: same tab. */
  external: boolean
}

/** The tile's short name: the resource title before « : ». */
function shortTitle(titre: string): string {
  return titre.split(' : ')[0].trim()
}

/**
 * US-112: the four newest published resources with a video, newest first, each opening our own
 * page, so a new video reaches the home without a code change. No such row: the hand-picked four,
 * to YouTube.
 */
export function resolveTiles(rows: readonly RessourceSummary[] | null): Tile[] {
  const videos = [...(rows ?? [])]
    .filter((r): r is RessourceSummary & { youtube_id: string } => Boolean(r.youtube_id))
    .sort((a, b) => (b.published_at ?? '').localeCompare(a.published_at ?? ''))
    .slice(0, MAX_TILES)
  if (videos.length === 0) {
    return TILES.map((tile) => ({
      ...tile,
      href: `https://youtu.be/${tile.youtubeId}`,
      external: true,
    }))
  }
  return videos.map((r) => {
    const title = shortTitle(r.titre)
    return {
      youtubeId: r.youtube_id,
      title,
      alt: `Miniature : ${title}`,
      href: `/ressources/${r.slug}`,
      external: false,
    }
  })
}
