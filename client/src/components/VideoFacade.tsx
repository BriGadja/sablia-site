import { cva } from 'class-variance-authority'
import { useState } from 'react'

const playButton = cva(
  'absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-primary shadow-lg transition-transform duration-base group-hover:scale-105',
  { variants: { size: { default: 'h-16 w-16', compact: 'h-12 w-12' } } },
)

const playIcon = cva('ml-1 fill-on-primary', {
  variants: { size: { default: 'h-7 w-7', compact: 'h-5 w-5' } },
})

interface VideoFacadeProps {
  youtubeId: string
  title: string
  /** The image shown before the click. */
  thumbnail: { src: string; width: number; height: number }
  /** `compact`: a smaller play button, for a thumbnail inside a list card. */
  size?: 'default' | 'compact'
}

/**
 * Click-to-play facade: before the click the visitor loads the thumbnail and no byte of YouTube's
 * player; the click mounts the privacy-enhanced player, whose `autoplay=1` then follows a user
 * gesture. Browsers may still keep it paused on a session they do not trust with sound.
 */
export default function VideoFacade({
  youtubeId,
  title,
  thumbnail,
  size = 'default',
}: VideoFacadeProps) {
  const [playing, setPlaying] = useState(false)

  if (playing) {
    return (
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0`}
        title={title}
        allow="autoplay; encrypted-media; picture-in-picture"
        allowFullScreen
        loading="lazy"
        className="aspect-video w-full rounded-xl border-0 bg-ink"
      />
    )
  }

  return (
    <button
      type="button"
      onClick={() => setPlaying(true)}
      aria-label={`Lire la vidéo : ${title}`}
      className="group relative block aspect-video w-full overflow-hidden rounded-xl bg-ink"
    >
      <img
        src={thumbnail.src}
        alt=""
        width={thumbnail.width}
        height={thumbnail.height}
        loading="lazy"
        className="h-full w-full object-cover transition-transform duration-base group-hover:scale-[1.02]"
      />
      <span className={playButton({ size })}>
        <svg viewBox="0 0 24 24" aria-hidden="true" className={playIcon({ size })}>
          <path d="M7 4.5v15l13-7.5z" />
        </svg>
      </span>
    </button>
  )
}
