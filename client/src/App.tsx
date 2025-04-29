import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { usePersistentToast } from "@/hooks/use-persistent-toast";
import { AnimatePresence } from "framer-motion";
import Home from "@/pages/Home";
import GapForm from "@/pages/GapForm";
import About from "@/pages/About";
import Roi from "@/pages/Roi";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <AnimatePresence mode="wait">
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/gap" component={GapForm} />
        <Route path="/about" component={About} />
        <Route path="/roi" component={Roi} />
        <Route component={NotFound} />
      </Switch>
    </AnimatePresence>
  );
}

function App() {
  // Utiliser le hook pour vérifier s'il y a un toast en attente
  usePersistentToast();
  
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;