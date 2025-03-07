import { useEffect } from "react";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";

export default function About() {
  useEffect(() => {
    // Scroll to top when the page loads
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <Navbar />
      <main className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-10 text-center">À propos</h1>

        <div className="max-w-3xl mx-auto prose prose-invert">
          <h2 className="text-2xl font-semibold mb-6 text-white">Simplifier votre quotidien, c'est mon métier.</h2>

          <p className="text-gray-300 mb-6">
            Vous êtes probablement ici parce que vous passez trop de temps sur des tâches répétitives ou que vous souhaitez tirer parti des dernières avancées en intelligence artificielle pour votre activité. Bonne nouvelle, c'est exactement ma spécialité.
          </p>

          <p className="text-gray-300 mb-6">
            Ingénieur informatique avec plus de 10 ans d'expérience dans l'IT, j'ai toujours cherché des moyens innovants de faciliter le quotidien professionnel des personnes autour de moi.
          </p>

          <p className="text-gray-300 mb-6">
            Tout a changé quand j'ai voulu aider ma femme, nutritionniste, à simplifier la gestion chronophage de ses dossiers et rendez-vous clients. Ma frustration de ne pas pouvoir l'assister efficacement malgré mes compétences techniques s'est envolée lorsque j'ai découvert les plateformes d'automatisation (comme Make.com et n8n). Lorsque ChatGPT a été mis à disposition du public, j'ai immédiatement compris le potentiel immense de cette technologie et commencé à l'intégrer pour créer des automatisations encore plus intelligentes. Résultat : son quotidien professionnel a été révolutionné.
          </p>

          <p className="text-gray-300 mb-6">
            Aujourd'hui, je vous propose mon expertise pour simplifier et optimiser vos propres processus métier grâce à l'automatisation intelligente et l'IA conversationnelle.
          </p>

          <h3 className="text-xl font-semibold mt-8 mb-4 text-white">Ce que je peux vous apporter concrètement :</h3>

          <ul className="list-disc pl-6 mb-6 text-gray-300 space-y-2">
            <li>Automatisation des tâches chronophages (gestion documentaire, administratif, génération de contenus…)</li>
            <li>Développement d'agents conversationnels intelligents pour améliorer votre relation client</li>
            <li>Des solutions adaptées spécifiquement à vos enjeux et à votre métier</li>
          </ul>

          <h3 className="text-xl font-semibold mt-8 mb-4 text-white">Pourquoi me faire confiance ?</h3>

          <ul className="list-disc pl-6 mb-10 text-gray-300 space-y-2">
            <li>Expérience confirmée : 10+ ans en gestion de projets IT, Data et automatisation</li>
            <li>Engagement concret : résultats garantis ou satisfait/remboursé</li>
            <li>Relation durable : je vous accompagne au-delà de la mise en place technique, en formant vos équipes</li>
          </ul>

          <p className="text-gray-300 mb-10">
            Vous souhaitez retrouver du temps pour vous concentrer sur l'essentiel ? Discutons-en ensemble dès aujourd'hui, sans engagement.
          </p>

          <div className="flex justify-center mb-8">
            <a
              href="https://calendly.com/brice-gachadoat/30min"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-4 rounded-md inline-block shadow-lg hover:shadow-xl transition-all duration-300 text-lg font-medium"
            >
              Prendre contact
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}