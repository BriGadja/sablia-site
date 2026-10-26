import { SITE_ORIGIN } from '@/lib/seo'
import { JsonLd } from './JsonLd'

export interface VideoObjectProps {
  name: string
  description: string
  youtubeId: string
  /** ISO date (YYYY-MM-DD) the video was published. */
  uploadDate: string
  /** Own-hosted thumbnail under /public (never a third-party image host: the content gate refuses them). */
  thumbnailPath: string
}

export function VideoObjectJsonLd({
  name,
  description,
  youtubeId,
  uploadDate,
  thumbnailPath,
}: VideoObjectProps) {
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'VideoObject',
        name,
        description,
        uploadDate,
        thumbnailUrl: `${SITE_ORIGIN}${thumbnailPath}`,
        contentUrl: `https://www.youtube.com/watch?v=${youtubeId}`,
      }}
    />
  )
}
