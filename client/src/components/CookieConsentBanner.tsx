import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { getConsentState, initGA4, setConsentState, trackPageView } from '@/lib/analytics'

export default function CookieConsentBanner() {
  const [visible, setVisible] = useState(() => getConsentState() === null)

  function handleAccept() {
    setConsentState('accepted')
    initGA4()
    trackPageView(window.location.pathname)
    setVisible(false)
  }

  function handleReject() {
    setConsentState('rejected')
    setVisible(false)
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed bottom-0 left-0 right-0 z-50 flex justify-center p-4"
        >
          <div className="max-w-3xl w-full bg-sablia-bg border border-sablia-border rounded-lg shadow-lg p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <p className="text-sm text-sablia-text-secondary flex-1">
              Nous utilisons des cookies d'analyse et de mesure publicitaire (Google Analytics,
              Google Ads) pour ameliorer votre experience et mesurer l'efficacite de nos campagnes.
              Consultez notre{' '}
              <a
                href="/politique-confidentialite"
                className="text-sablia-accent underline hover:text-sablia-accent-hover"
              >
                politique de confidentialite
              </a>
              .
            </p>
            <div className="flex gap-3 shrink-0">
              <button
                type="button"
                onClick={handleReject}
                className="text-sm text-sablia-text-secondary hover:text-sablia-text transition-colors px-3 py-2"
              >
                Refuser
              </button>
              <button
                type="button"
                onClick={handleAccept}
                className="text-sm bg-sablia-accent text-white px-4 py-2 rounded-md hover:bg-sablia-accent-hover transition-colors font-medium"
              >
                Accepter
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
