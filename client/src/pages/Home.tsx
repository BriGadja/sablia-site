import ParticlesBackground from "@/components/ParticlesBackground";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ProcessSection from "@/components/ProcessSection";
import ServicesSection from "@/components/ServicesSection";
import FaqSection from "@/components/FaqSection";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 relative">
      <ParticlesBackground />
      <Navbar />
      <main>
        <HeroSection />
        <ProcessSection />
        <ServicesSection />
        <FaqSection />

        {/* Final CTA Section */}
        <section className="py-16 bg-gray-800">
          <div className="container text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-100 mb-6">
              Prêt à transformer votre entreprise ?
            </h2>
            <Button
              size="lg"
              className="bg-primary text-white hover:bg-primary/90"
              onClick={() => window.open('https://calendly.com/brice-gachadoat/30min', '_blank')}
            >
              Réserver votre consultation gratuite
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}