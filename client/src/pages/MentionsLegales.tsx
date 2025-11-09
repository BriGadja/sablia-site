import { useEffect } from "react";
import Footer from "@/components/Footer";
import Navigation from "@/components/landing/Navigation";
import ScrollToTop from "@/components/ScrollToTop";
import AnimatedParticles from "@/components/animations/AnimatedParticles";
import CustomCursor from "@/components/animations/CustomCursor";
import SEO from "@/components/SEO";
import { motion } from "framer-motion";

export default function MentionsLegales() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <SEO page="/mentions-legales" />
      <motion.div
      className="min-h-screen"
      style={{
        background:
          "linear-gradient(to bottom, #2B9AB8 0%, #3E92CC 15%, #0A2463 35%, #0A2463 50%, #2D3142 65%, #3d2f1f 80%, #4a3621 95%, #3d2f1f 100%)",
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Animated particles background */}
      <AnimatedParticles />

      {/* Content layer */}
      <div className="relative z-10">
        <Navigation />
        <main className="container mx-auto px-4 py-16">
          <div className="flex flex-col items-center mb-10 mt-12">
            <h1 className="text-4xl font-bold text-center">Mentions Légales</h1>
          </div>

          <div className="max-w-4xl mx-auto prose prose-invert prose-lg">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-white">Éditeur du site</h2>
              <p className="text-gray-300">Le site sablia.io est édité par :</p>
              <ul className="text-gray-300 space-y-2">
                <li>GACHADOAT Brice</li>
                <li>Entrepreneur individuel</li>
                <li>SIREN : 940 901 127</li>
                <li>Siret : 94090112700016</li>
                <li>Adresse : 60 RUE François Ier, 75008 Paris, France</li>
                <li>Date de création : 24/02/2025</li>
                <li>
                  Activité principale : Conseil, formation et développement d'automatisations et
                  d'agents IA alimentés à l'Intelligence Artificielle
                </li>
                <li>Code APE : 6201Z - Programmation informatique</li>
                <li>Nom commercial : Sablia</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-white">
                Responsable de la publication
              </h2>
              <p className="text-gray-300">GACHADOAT Brice</p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-white">Hébergeur du site</h2>
              <ul className="text-gray-300 space-y-2">
                <li>Vercel Inc.</li>
                <li>340 S Lemon Ave #4133 Walnut, CA 91789 États-Unis</li>
                <li>privacy@vercel.com</li>
                <li>+1 (559) 288-7060</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-white">Propriété intellectuelle</h2>
              <p className="text-gray-300">
                L'ensemble du contenu présent sur le site sablia.io, incluant notamment les textes,
                images, logos, et éléments graphiques, est la propriété de GACHADOAT Brice ou de ses
                partenaires, et est protégé par les lois françaises et internationales relatives à
                la propriété intellectuelle. Toute reproduction, distribution, ou utilisation sans
                autorisation préalable est interdite.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-white">Conditions d'utilisation</h2>
              <p className="text-gray-300">
                L'utilisation du site sablia.io implique l'acceptation des présentes mentions
                légales. En cas de non-respect, l'accès au site peut être suspendu ou interdit.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-white">
                Protection des données personnelles
              </h2>
              <p className="text-gray-300">
                Les données collectées via le site sont destinées à l'usage exclusif de GACHADOAT
                Brice. Conformément au Règlement Général sur la Protection des Données (RGPD), vous
                disposez d'un droit d'accès, de rectification ou de suppression de vos données
                personnelles. Pour exercer ces droits, contactez-nous à l'adresse :{" "}
                <a href="mailto:brice@sablia.io" className="text-orange-500 hover:text-orange-400">
                  brice@sablia.io
                </a>
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-white">Liens vers d'autres sites</h2>
              <p className="text-gray-300">
                Le site sablia.io peut contenir des liens vers d'autres sites. GACHADOAT Brice n'est
                pas responsable du contenu ou des pratiques de ces sites.
              </p>
            </section>
          </div>
        </main>
        <Footer />
        <ScrollToTop />
      </div>

      {/* Custom cursor layer */}
      <CustomCursor />
      </motion.div>
    </>
  );
}
