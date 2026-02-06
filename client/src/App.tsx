import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { usePersistentToast } from "@/hooks/use-persistent-toast";
import { AnimatePresence } from "framer-motion";
import { HelmetProvider } from "react-helmet-async";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import Landing from "@/pages/Landing";
import Tarifs from "@/pages/Tarifs";
import GapForm from "@/pages/GapForm";
import About from "@/pages/About";
import Roi from "@/pages/Roi";
import MentionsLegales from "@/pages/MentionsLegales";
import PolitiqueConfidentialite from "@/pages/PolitiqueConfidentialite";
import CGV from "@/pages/CGV";
import Faq from "@/pages/Faq";
import CaseStudies from "@/pages/CaseStudies";
import NotFound from "@/pages/not-found";

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
  );
}

function App() {
  // Utiliser le hook pour vérifier s'il y a un toast en attente
  usePersistentToast();

  return (
    <ErrorBoundary>
      <HelmetProvider>
        <QueryClientProvider client={queryClient}>
          <Router />
          <Toaster />
        </QueryClientProvider>
      </HelmetProvider>
    </ErrorBoundary>
  );
}

export default App;
