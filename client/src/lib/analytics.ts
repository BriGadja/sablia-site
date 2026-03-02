declare global {
  interface Window {
    dataLayer: unknown[]
    gtag: (...args: unknown[]) => void
  }
}

type ConversionType = 'contact_form' | 'gap_form' | 'calendly_booking'

const CONSENT_KEY = 'analytics_consent'
const GA4_ID = import.meta.env.VITE_GA4_MEASUREMENT_ID as string | undefined
const GADS_CONVERSION_ID = import.meta.env.VITE_GADS_CONVERSION_ID as string | undefined
const GADS_LABELS: Record<ConversionType, string | undefined> = {
  contact_form: import.meta.env.VITE_GADS_LABEL_CONTACT as string | undefined,
  gap_form: import.meta.env.VITE_GADS_LABEL_GAP as string | undefined,
  calendly_booking: import.meta.env.VITE_GADS_LABEL_CALENDLY as string | undefined,
}

type ConsentState = 'accepted' | 'rejected' | null

let initialized = false

export function getConsentState(): ConsentState {
  const value = localStorage.getItem(CONSENT_KEY)
  if (value === 'accepted' || value === 'rejected') return value
  return null
}

export function setConsentState(state: 'accepted' | 'rejected'): void {
  localStorage.setItem(CONSENT_KEY, state)
}

export function initGA4(): void {
  if (initialized || !GA4_ID) return

  // Create gtag script
  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`
  document.head.appendChild(script)

  // Initialize dataLayer and gtag
  window.dataLayer = window.dataLayer || []
  window.gtag = function gtag(...args: unknown[]) {
    window.dataLayer.push(args)
  }
  window.gtag('js', new Date())
  window.gtag('config', GA4_ID, {
    anonymize_ip: true,
    send_page_view: false, // We handle page views manually for SPA
  })

  // Configure Google Ads conversion tracking
  if (GADS_CONVERSION_ID) {
    window.gtag('config', GADS_CONVERSION_ID)
  }

  initialized = true
}

export function trackPageView(path: string): void {
  if (!initialized) return
  window.gtag('event', 'page_view', {
    page_path: path,
    page_title: document.title,
  })
}

export function trackEvent(name: string, params?: Record<string, string>): void {
  if (!initialized) return
  window.gtag('event', name, params)
}

export type { ConversionType }

export function trackConversion(type: ConversionType): void {
  if (!initialized) return

  // GA4 conversion event
  window.gtag('event', 'generate_lead', {
    event_category: 'conversion',
    event_label: type,
  })

  // Google Ads conversion event
  const label = GADS_LABELS[type]
  if (GADS_CONVERSION_ID && label) {
    window.gtag('event', 'conversion', {
      send_to: `${GADS_CONVERSION_ID}/${label}`,
    })
  }
}
