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
          <section className="py-20 bg-gray-800/50">
            <div className="container text-center">
              <h2 className="text-4xl font-bold mb-6">
                Découvrez les <RainbowText>automatisations</RainbowText> idéales pour votre business
              </h2>
              <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
                Utilisez notre générateur d'automatisations personnalisées et recevez des recommandations sur-mesure qui vont faire exploser votre productivité
              </p>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-block"
              >
                <Link href="/gap">
                  <div className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-500 via-blue-500 to-orange-500 rounded-lg blur opacity-60 group-hover:opacity-100 transition duration-1000 group-hover:duration 200 animate-tilt"></div>
                    <button className="relative px-8 py-4 bg-gray-900 rounded-lg leading-none flex items-center">
                      <span className="text-gray-100 group-hover:text-white transition duration-200 text-lg font-medium">
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
          <section className="py-16 bg-gray-800">
            <div className="container text-center">
              <h2 className="text-4xl md:text-4xl font-bold text-gray-100 mb-6">
                Prêt à <RainbowText>transformer</RainbowText> votre entreprise ?
              </h2>
              <div className="flex gap-4 justify-center flex-wrap">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-3"
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