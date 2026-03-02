import { QueryClientProvider } from '@tanstack/react-query'
import { AnimatePresence } from 'framer-motion'
import { lazy, Suspense, useEffect } from 'react'
import { HelmetProvider } from 'react-helmet-async'
import { Route, Switch } from 'wouter'
import CookieConsentBanner from '@/components/CookieConsentBanner'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { Toaster } from '@/components/ui/toaster'
import { usePageTracking } from '@/hooks/use-page-tracking'
import { getConsentState, initGA4 } from '@/lib/analytics'
import About from '@/pages/About'
import CaseStudies from '@/pages/CaseStudies'
import CGV from '@/pages/CGV'
import Faq from '@/pages/Faq'
import GapForm from '@/pages/GapForm'
import Landing from '@/pages/Landing'
import MentionsLegales from '@/pages/MentionsLegales'
import NotFound from '@/pages/not-found'
import PolitiqueConfidentialite from '@/pages/PolitiqueConfidentialite'
import Roi from '@/pages/Roi'
import Tarifs from '@/pages/Tarifs'
import ThankYou from '@/pages/ThankYou'
import { queryClient } from './lib/queryClient'

const LpAutomatisation = lazy(() => import('@/pages/LpAutomatisation'))
const LpAuditGratuit = lazy(() => import('@/pages/LpAuditGratuit'))

function Router() {
  return (
    <AnimatePresence mode="wait">
      <Switch>
        <Route path="/" component={Landing} />
        <Route path="/tarifs" component={Tarifs} />
        <Route path="/gap" component={GapForm} />
        <Route path="/about" component={About} />
        <Route path="/roi" component={Roi} />
        <Route path="/mentions-legales" component={MentionsLegales} />
        <Route path="/politique-confidentialite" component={PolitiqueConfidentialite} />
        <Route path="/cgv" component={CGV} />
        <Route path="/faq" component={Faq} />
        <Route path="/cas-clients" component={CaseStudies} />
        <Route path="/thank-you" component={ThankYou} />
        <Route path="/lp/automatisation-pme">
          <Suspense fallback={null}>
            <LpAutomatisation />
          </Suspense>
        </Route>
        <Route path="/lp/audit-gratuit">
          <Suspense fallback={null}>
            <LpAuditGratuit />
          </Suspense>
        </Route>
        <Route component={NotFound} />
      </Switch>
    </AnimatePresence>
  )
}

function App() {
  usePageTracking()

  useEffect(() => {
    if (getConsentState() === 'accepted') {
      initGA4()
    }
  }, [])

  return (
    <ErrorBoundary>
      <HelmetProvider>
        <QueryClientProvider client={queryClient}>
          <Router />
          <Toaster />
          <CookieConsentBanner />
        </QueryClientProvider>
      </HelmetProvider>
    </ErrorBoundary>
  )
}

export default App
