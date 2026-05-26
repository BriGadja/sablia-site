const CALENDLY_URL = 'https://calendly.com/brice-gachadoat/30min'

export function openBooking() {
  const w = 600
  const h = 700
  const left = (window.innerWidth - w) / 2 + window.screenX
  const top = (window.innerHeight - h) / 2 + window.screenY
  window.open(
    CALENDLY_URL,
    'calendly',
    `width=${w},height=${h},left=${left},top=${top},noopener,noreferrer`,
  )
}
