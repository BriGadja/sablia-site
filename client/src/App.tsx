import { AnimatePresence, MotionConfig } from 'framer-motion'
import { HelmetProvider } from 'react-helmet-async'
import { Route, Switch } from 'wouter'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { Toaster } from '@/components/ui/toaster'
import CGV from '@/pages/CGV'
import GuideIaEntreprise from '@/pages/GuideIaEntreprise'
import Landing from '@/pages/Landing'
import MentionsLegales from '@/pages/MentionsLegales'
import NotFound from '@/pages/not-found'
import PolitiqueConfidentialite from '@/pages/PolitiqueConfidentialite'
import ThankYou from '@/pages/ThankYou'

function Router() {
  return (
    <AnimatePresence mode="wait">
      <Switch>
        <Route path="/" component={Landing} />
        <Route path="/mentions-legales" component={MentionsLegales} />
        <Route path="/politique-confidentialite" component={PolitiqueConfidentialite} />
        <Route path="/cgv" component={CGV} />
        <Route path="/guides/integrer-l-ia-dans-votre-entreprise" component={GuideIaEntreprise} />
        <Route path="/thank-you" component={ThankYou} />
        <Route component={NotFound} />
      </Switch>
    </AnimatePresence>
  )
}

function App() {
  return (
    <ErrorBoundary>
      <MotionConfig reducedMotion="user">
        <HelmetProvider>
          <Router />
          <Toaster />
        </HelmetProvider>
      </MotionConfig>
    </ErrorBoundary>
  )
}

export default App
