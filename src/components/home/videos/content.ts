import type { RessourceSummary } from '@/lib/contenu'

export const EYEBROW = 'Vidéos'
export const TITLE = 'Nos vidéos sur YouTube.'
export const CHANNEL_LABEL = 'Voir la chaîne'
export const CHANNEL_URL = 'https://www.youtube.com/channel/UCXzIrGckmJcwKSLCPXV7r1w'

export interface TileSource {
  youtubeId: string
  title: string
  alt: string
}

/** The four videos of the mockup, in its order. The OF-1 demo (`d5fo00AFqVM`) opens the row. */
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

/** A tile goes to our resource page when `contenu_ressources` has a published row for its video. */
export function resolveTiles(rows: readonly RessourceSummary[] | null): Tile[] {
  return TILES.map((tile) => {
    const own = rows?.find((r) => r.youtube_id === tile.youtubeId)
    return own
      ? { ...tile, href: `/ressources/${own.slug}`, external: false }
      : { ...tile, href: `https://youtu.be/${tile.youtubeId}`, external: true }
  })
}
