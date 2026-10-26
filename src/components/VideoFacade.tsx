'use client' // click state, and the play report after the click

import { useEffect, useRef, useState } from 'react'
import { trackVideoPlay, watchVideoProgress } from '@/lib/events'
import './video-facade.css'

interface VideoFacadeProps {
  youtubeId: string
  title: string
  /** The image shown before the click; `null` draws the generic poster. */
  thumbnail: { src: string; width: number; height: number } | null
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
  const frame = useRef<HTMLIFrameElement>(null)

  // After the click only: report the play and follow the player (both need the visitor's consent).
  useEffect(() => {
    if (!playing || !frame.current) return
    trackVideoPlay(youtubeId)
    watchVideoProgress(frame.current, youtubeId)
  }, [playing, youtubeId])

  if (playing) {
    return (
      <iframe
        ref={frame}
        className="v2-vf is-frame"
        src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0&enablejsapi=1`}
        title={title}
        allow="autoplay; encrypted-media; picture-in-picture"
        allowFullScreen
        loading="lazy"
      />
    )
  }

  return (
    <button
      type="button"
      onClick={() => setPlaying(true)}
      aria-label={`Lire la vidéo : ${title}`}
      className={`v2-vf is-${size}${thumbnail ? '' : ' is-generic'}`}
    >
      {thumbnail && (
        // biome-ignore lint/performance/noImgElement: static export, no image optimizer
        <img
          src={thumbnail.src}
          alt=""
          width={thumbnail.width}
          height={thumbnail.height}
          loading="lazy"
        />
      )}
      <span className="v2-vf-play">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M7 4.5v15l13-7.5z" />
        </svg>
      </span>
    </button>
  )
}
