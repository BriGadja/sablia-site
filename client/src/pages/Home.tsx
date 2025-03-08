import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ProcessSection from "@/components/ProcessSection";
import ServicesSection from "@/components/ServicesSection";
import { AutomationExamplesSection } from "@/components/AutomationExamplesSection";
import FaqSection from "@/components/FaqSection";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { RainbowText } from "@/components/RainbowText";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 relative">
      <div className="relative z-[2]">        
        <Navbar />
        <main className="bg-gray-900">
          <HeroSection />
          <ServicesSection />
          <AutomationExamplesSection />
          <section className="py-16 sm:py-20 bg-gray-800/50">
            <div className="container px-4 text-center">
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight">
                Découvrez les <RainbowText>automatisations</RainbowText><br />
                <span className="text-3xl sm:text-4xl md:text-5xl">idéales pour votre business</span>
              </h2>
              <p className="text-lg sm:text-xl text-gray-300 mb-8 sm:mb-12 max-w-2xl mx-auto px-2">
                Utilisez notre générateur d'automatisations personnalisées et recevez des recommandations sur-mesure qui vont faire exploser votre productivité
              </p>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-block w-full sm:w-auto px-4"
              >
                <Link href="/gap">
                  <div className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-500 via-blue-500 to-orange-500 rounded-lg blur opacity-60 group-hover:opacity-100 transition duration-1000 group-hover:duration 200 animate-tilt"></div>
                    <button className="relative w-full px-6 sm:px-8 py-4 bg-gray-900 rounded-lg leading-none flex items-center justify-center">
                      <span className="text-gray-100 group-hover:text-white transition duration-200 text-base sm:text-lg font-medium">
                        Générer mes automatisations personnalisées
                      </span>
                    </button>
                  </div>
                </Link>
              </motion.div>
            </div>
          </section>
          <ProcessSection />
          <FaqSection />
          <section className="py-12 sm:py-16 bg-gray-800">
            <div className="container px-4 text-center">
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-100 mb-6 leading-tight">
                Prêt à <RainbowText>transformer</RainbowText><br /> 
                <span className="text-3xl sm:text-4xl md:text-5xl">votre entreprise ?</span>
              </h2>
              <div className="flex gap-4 justify-center flex-wrap px-2">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-6 sm:px-8 py-3"
                  onClick={() => window.open('https://calendly.com/brice-gachadoat/30min', '_blank')}
                >
                  Réserver votre consultation gratuite
                </Button>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </div>
  );
}