import Link from 'next/link'
import { loadList } from '@/components/ressources/data'
import { posterPath } from '@/components/ressources/poster'
import { Dune } from '@/components/shell/Dune'
import { Eyebrow } from '@/components/shell/Eyebrow'
import type { RessourceSummary } from '@/lib/contenu'
import { CHANNEL_LABEL, CHANNEL_URL, EYEBROW, resolveTiles, TITLE, type Tile } from './content'
import './videos.css'

type Env = Record<string, string | undefined>

/**
 * Tiles at build time. In strict mode (deploy) an unreadable `contenu_ressources` THROWS (via
 * `loadList`), so a deploy never bakes YouTube links into tiles that should open our own pages.
 */
export async function loadTiles({
  env = process.env,
  fetchList,
}: {
  env?: Env
  fetchList?: () => Promise<RessourceSummary[] | null>
} = {}): Promise<Tile[]> {
  return resolveTiles(await loadList({ env, ...(fetchList ? { fetchList } : {}) }))
}

const ArrowIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M7 17L17 7M9 7h8v8" />
  </svg>
)

export function VideosView({ tiles }: { tiles: readonly Tile[] }) {
  return (
    <section id="videos" className="v2-videos">
      <Dune back="#C68A8E" front="#262038" />
      <div className="wrap">
        <div className="vd-head">
          <div>
            <Eyebrow onDark>{EYEBROW}</Eyebrow>
            <h2 className="vd-h2">{TITLE}</h2>
          </div>
          <a className="vd-channel" href={CHANNEL_URL} target="_blank" rel="noopener">
            {CHANNEL_LABEL}
            <ArrowIcon />
          </a>
        </div>
        <div className="vid-row">
          {tiles.map((tile) => {
            const poster = posterPath(tile.youtubeId)
            const body = (
              <>
                <div className="vid-frame">
                  {poster && (
                    // biome-ignore lint/performance/noImgElement: static export, no image optimizer
                    <img
                      className="vid-img"
                      src={poster}
                      alt={tile.alt}
                      width={640}
                      height={360}
                      loading="lazy"
                    />
                  )}
                </div>
                <div className="vid-title">
                  <span className="vid-play" aria-hidden="true">
                    <svg
                      width="11"
                      height="11"
                      viewBox="0 0 24 24"
                      fill="#131620"
                      aria-hidden="true"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </span>
                  <span>{tile.title}</span>
                </div>
              </>
            )
            return tile.external ? (
              <a
                key={tile.youtubeId}
                className="vid"
                href={tile.href}
                target="_blank"
                rel="noopener"
              >
                {body}
              </a>
            ) : (
              <Link key={tile.youtubeId} className="vid" href={tile.href}>
                {body}
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/** `#videos`: four tiles, each an own-hosted poster (no `i.ytimg.com`, no iframe before a click). */
export async function Videos({ load = loadTiles }: { load?: () => Promise<Tile[]> } = {}) {
  return <VideosView tiles={await load()} />
}
