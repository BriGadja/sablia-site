import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ProcessSection from "@/components/ProcessSection";
import ServicesSection from "@/components/ServicesSection";
import { AutomationExamplesSection } from "@/components/AutomationExamplesSection";
import FaqSection from "@/components/FaqSection";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 relative">
      <div className="relative z-[2]">        
        <Navbar />
        <main className="bg-gray-900">
          <HeroSection />
          <ServicesSection />
          <AutomationExamplesSection />
          <section className="py-12 bg-gray-800/50">
            <div className="container text-center">
              <h2 className="text-3xl font-bold mb-6">
                Découvrez les automatisations idéales pour votre business
              </h2>
              <p className="text-xl text-gray-300 mb-8">
                Utilisez notre générateur d'automatisations personnalisées pour recevoir des recommandations sur mesure
              </p>
              <Link href="/gap" className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-8 py-3 rounded-md inline-block shadow-lg hover:shadow-xl transition-all duration-300 text-lg font-medium">
                Générer mes automatisations personnalisées
              </Link>
            </div>
          </section>
          <ProcessSection />
          <FaqSection />
          <section className="py-16 bg-gray-800">
            <div className="container text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-100 mb-6">
                Prêt à transformer votre entreprise ?
              </h2>
              <div className="flex gap-4 justify-center flex-wrap">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-3"
                  onClick={() => window.open('https://calendly.com/brice-gachadoat/30min', '_blank')}
                >
                  Réserver votre consultation gratuite
                </Button>
                <Link href="/gap">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-8 py-3"
                  >
                    Générer mes automatisations
                  </Button>
                </Link>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </div>
  );
}