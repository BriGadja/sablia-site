import { existsSync } from 'node:fs'

const YOUTUBE_ID = /^[A-Za-z0-9_-]{6,20}$/

/**
 * Own-hosted poster of a video, as a public path, or `null` when no copy is on disk (the facade then
 * draws a generic poster). No `i.ytimg.com` request ever reaches a visitor: `scripts/fetch-posters.mjs`
 * downloads the posters at build time into `public/_posters/`, and the home tiles' own copies in
 * `public/video-thumbs/` serve when they are the only one. Server-side only (reads the disk at render).
 */
export function posterPath(
  youtubeId: string | null,
  exists: (relative: string) => boolean = existsSync,
): string | null {
  if (!youtubeId || !YOUTUBE_ID.test(youtubeId)) return null
  for (const dir of ['_posters', 'video-thumbs']) {
    if (exists(`public/${dir}/${youtubeId}.webp`)) return `/${dir}/${youtubeId}.webp`
  }
  return null
}
