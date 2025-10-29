import { useEffect } from "react";
import Footer from "@/components/Footer";
import Navigation from "@/components/landing/Navigation";
import ScrollToTop from "@/components/ScrollToTop";
import AnimatedParticles from "@/components/animations/AnimatedParticles";
import CustomCursor from "@/components/animations/CustomCursor";
import { motion } from "framer-motion";

export default function About() {
  useEffect(() => {
    // Scroll to top when the page loads
    window.scrollTo(0, 0);
  }, []);

  return (
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
            <h1 className="text-4xl font-bold text-center">À propos</h1>
          </div>

          <div className="max-w-3xl mx-auto prose prose-invert">
            <h2 className="text-3xl font-semibold mb-6 text-white">
              🚀 Simplifier votre quotidien, c'est mon métier.
            </h2>

            <p className="text-gray-300 mb-6">
              Je suis <strong>Brice Gachadoat</strong>, expert en automatisation et intelligence
              artificielle. Vous êtes probablement ici parce que vous passez trop de temps sur des
              tâches répétitives ou que vous souhaitez tirer parti des dernières avancées en IA pour
              votre activité. Bonne nouvelle, c'est exactement ma spécialité.
            </p>

            <p className="text-gray-300 mb-6">
              Ingénieur informatique avec plus de 10 ans d'expérience dans l'IT, j'ai toujours
              cherché des moyens innovants de faciliter le quotidien professionnel des personnes
              autour de moi.
            </p>

            <h3 className="text-2xl font-semibold mb-4 text-white">💡 Mon déclic personnel</h3>

            <p className="text-gray-300 mb-6">
              Tout a changé quand j'ai voulu aider ma femme, nutritionniste, à simplifier la gestion
              chronophage de ses dossiers et rendez-vous clients. Ma frustration de ne pas pouvoir
              l'assister efficacement malgré mes compétences techniques s'est envolée lorsque j'ai
              découvert les plateformes d'automatisation comme Make.com et n8n.
            </p>

            <p className="text-gray-300 mb-6">
              Lorsque ChatGPT a été mis à disposition du public, j'ai immédiatement compris le
              potentiel immense de cette technologie et commencé à l'intégrer dans mes solutions.{" "}
              <strong>Résultat concret</strong> : ma femme a réduit de 90% le temps consacré à la
              génération de menus et de 70% ses tâches administratives. Elle a pu accueillir 60%
              plus de clientes sans augmentation significative de sa charge de travail.
            </p>

            <p className="text-gray-300 mb-6">
              Aujourd'hui, je vous propose mon expertise pour simplifier et optimiser vos propres
              processus métier grâce à l'automatisation intelligente et l'IA conversationnelle.
            </p>

            <h3 className="text-2xl font-semibold mb-4 text-white">
              ✅ Ce que je peux vous apporter concrètement :
            </h3>

            <ul className="text-gray-300 mb-6 space-y-3">
              <li className="flex items-start">
                <span className="mr-2">🔄</span>
                <span>
                  <strong>Automatisation des tâches chronophages</strong> — Comme la transformation
                  automatique de CV au format de votre entreprise, réduisant un travail de 30
                  minutes à quelques secondes
                </span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">💬</span>
                <span>
                  <strong>Automatisations intelligentes de qualification</strong> — Systèmes
                  automatisés capables de qualifier vos prospects et générer des propositions
                  commerciales sur mesure
                </span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">🤖</span>
                <span>
                  <strong>Assistants IA personnalisés</strong> — À l'image de l'assistant que j'ai
                  développé pour gérer mes emails, contacts et planifier mes réunions, libérant plus
                  de 10 heures par semaine
                </span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">🎓</span>
                <span>
                  <strong>Formations sur mesure</strong> — J'accompagne vos équipes dans la maîtrise
                  des solutions mises en place et propose des formations dédiées aux bonnes
                  pratiques de l'IA pour garantir leur autonomie et maximiser votre retour sur
                  investissement
                </span>
              </li>
            </ul>

            <h3 className="text-2xl font-semibold mb-4 text-white">🛠️ Mon expertise technique</h3>

            <p className="text-gray-300 mb-6">
              Je développe des automatisations principalement sur n8n, avec des compétences
              complémentaires sur Make.com. J'intègre efficacement des outils comme Notion, Airtable
              et Supabase pour créer des écosystèmes connectés et performants.
            </p>

            <p className="text-gray-300 mb-6">
              J'ai accompagné avec succès des clients dans les secteurs du conseil, du marketing, de
              la formation, de l'organisation d'événements et des ESN, ainsi que de nombreux
              entrepreneurs indépendants.
            </p>

            <h3 className="text-2xl font-semibold mb-4 text-white">
              🔒 Pourquoi me faire confiance ?
            </h3>

            <ul className="text-gray-300 mb-6 space-y-3">
              <li className="flex items-start">
                <span className="mr-2">📊</span>
                <span>
                  <strong>Expérience confirmée</strong> : 10+ ans en gestion de projets IT, Data et
                  automatisation, dont un parcours au sein du prestigieux cabinet{" "}
                  <strong>MeltOne Advisory</strong> et du groupe de luxe mondial{" "}
                  <strong>LVMH</strong>
                </span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">✓</span>
                <span>
                  <strong>Engagement concret</strong> : résultats garantis ou satisfait/remboursé
                </span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">🤝</span>
                <span>
                  <strong>Relation durable</strong> : je vous accompagne au-delà de la mise en place
                  technique, en formant vos équipes
                </span>
              </li>
            </ul>

            <h3 className="text-2xl font-semibold mb-4 text-white">📞 Passons à l'action</h3>

            <p className="text-gray-300 mb-6">
              Vous souhaitez retrouver du temps pour vous concentrer sur l'essentiel de votre métier
              ? <strong>Réservez un appel gratuit de 30 minutes</strong> pour identifier ensemble
              les automatisations qui transformeront votre business. Sans engagement.
            </p>

            <div className="mt-12 text-center">
              <a
                href="https://calendly.com/brice-gachadoat/30min"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-3 rounded-md inline-block shadow-lg hover:shadow-xl transition-all duration-300 text-lg font-medium"
              >
                Réservez un appel découverte gratuit
              </a>
            </div>
          </div>
        </main>
        <Footer />
        <ScrollToTop />
      </div>

      {/* Custom cursor layer */}
      <CustomCursor />
    </motion.div>
  );
}
