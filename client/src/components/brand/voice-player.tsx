import * as React from 'react'

import { cn } from '@/lib/utils'

type VoicePlayerProps = {
  src: string
  label?: string
  className?: string
}

function formatTime(sec: number) {
  if (!Number.isFinite(sec)) return '0:00'
  const m = Math.floor(sec / 60)
  const s = Math.floor(sec % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

export function VoicePlayer({ src, label = 'Écouter la démo', className }: VoicePlayerProps) {
  const audioRef = React.useRef<HTMLAudioElement | null>(null)
  const [playing, setPlaying] = React.useState(false)
  const [current, setCurrent] = React.useState(0)
  const [duration, setDuration] = React.useState(0)

  React.useEffect(() => {
    const a = audioRef.current
    if (!a) return
    const onTime = () => setCurrent(a.currentTime)
    const onLoaded = () => setDuration(a.duration)
    const onEnded = () => setPlaying(false)
    a.addEventListener('timeupdate', onTime)
    a.addEventListener('loadedmetadata', onLoaded)
    a.addEventListener('ended', onEnded)
    return () => {
      a.removeEventListener('timeupdate', onTime)
      a.removeEventListener('loadedmetadata', onLoaded)
      a.removeEventListener('ended', onEnded)
    }
  }, [])

  const toggle = () => {
    const a = audioRef.current
    if (!a) return
    if (a.paused) {
      void a.play()
      setPlaying(true)
    } else {
      a.pause()
      setPlaying(false)
    }
  }

  const progress = duration > 0 ? (current / duration) * 100 : 0

  return (
    <div className={cn('flex items-center justify-center', className)}>
      {/** biome-ignore lint/a11y/useMediaCaption: no transcript for short demo audio */}
      <audio ref={audioRef} src={src} preload="metadata" />

      <div className="flex items-center gap-3 rounded-full border border-[color:var(--color-encre)]/[0.12] bg-[color:var(--color-sable)]/70 px-3 py-2.5 shadow-[0_10px_30px_-15px_rgba(26,22,19,0.35)] backdrop-blur-xl">
        <button
          type="button"
          onClick={toggle}
          aria-label={playing ? 'Pause' : label}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[color:var(--color-tuile)] text-[color:var(--color-sable)] transition-transform hover:scale-[1.05] active:scale-[0.96] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[color:var(--color-tuile)]"
        >
          {playing ? (
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
              <title>Pause</title>
              <rect x="7" y="5" width="3.5" height="14" rx="0.5" />
              <rect x="13.5" y="5" width="3.5" height="14" rx="0.5" />
            </svg>
          ) : (
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5 translate-x-[1.5px]"
              fill="currentColor"
              aria-hidden
            >
              <title>Play</title>
              <path d="M7.5 5 L18 12 L7.5 19 Z" />
            </svg>
          )}
        </button>

        <div className="flex items-center gap-2.5 pr-2 font-mono text-[0.7rem] tabular-nums tracking-[0.04em] text-[color:var(--color-encre-70)]">
          <span>{formatTime(current)}</span>
          <div className="relative h-[3px] w-[110px] overflow-hidden rounded-full bg-[color:var(--color-encre)]/15">
            <div
              className="absolute left-0 top-0 h-full rounded-full bg-[color:var(--color-tuile)] transition-[width] duration-150"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-[color:var(--color-encre-50)]">{formatTime(duration)}</span>
        </div>
      </div>
    </div>
  )
}
