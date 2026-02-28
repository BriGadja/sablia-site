import { QueryClientProvider } from '@tanstack/react-query'
import { AnimatePresence } from 'framer-motion'
import { HelmetProvider } from 'react-helmet-async'
import { Route, Switch } from 'wouter'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { Toaster } from '@/components/ui/toaster'
import { usePersistentToast } from '@/hooks/use-persistent-toast'
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
import { queryClient } from './lib/queryClient'

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
        <Route component={NotFound} />
      </Switch>
    </AnimatePresence>
  )
}

function App() {
  // Utiliser le hook pour vérifier s'il y a un toast en attente
  usePersistentToast()

  return (
    <ErrorBoundary>
      <HelmetProvider>
        <QueryClientProvider client={queryClient}>
          <Router />
          <Toaster />
        </QueryClientProvider>
      </HelmetProvider>
    </ErrorBoundary>
  )
}

export default App
