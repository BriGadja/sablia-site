
import { useEffect } from "react";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

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

        <div className="max-w-4xl mx-auto bg-gray-800/50 p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-6 text-orange-500">Mon parcours</h2>
          <p className="mb-6 text-gray-300 leading-relaxed">
            Ingénieur informatique diplômé d'un Master 2 en Management et Conseils en SI, j'ai développé mon expertise en automatisation et en intelligence artificielle au sein de grands groupes avant de me spécialiser dans la création de solutions innovantes et personnalisées.
          </p>
          <p className="mb-6 text-gray-300 leading-relaxed">
            Mon parcours a débuté par une formation en alternance, me permettant d'acquérir simultanément des bases théoriques solides et une expérience pratique chez Société Générale (développement Qlikview) puis chez LVMH (gestion de projets techniques).
          </p>
          <p className="mb-6 text-gray-300 leading-relaxed">
            Pendant six années chez LVMH, j'ai évolué jusqu'au poste de responsable des outils pour le contrôle de gestion, gérant huit applications critiques pour la holding et la présidence du groupe. Cette expérience m'a permis de maîtriser les enjeux financiers et stratégiques des grandes entreprises, tout en découvrant les possibilités offertes par la RPA (Robotic Process Automation).
          </p>
          <p className="mb-8 text-gray-300 leading-relaxed">
            Mon passage comme consultant senior Data chez MeltOne a renforcé mon expertise en business intelligence, notamment sur Power BI, tandis que je me formais en parallèle aux technologies d'intelligence artificielle et d'automatisation avancée.
          </p>

          <h2 className="text-2xl font-bold mb-6 text-orange-500">Mon expertise</h2>
          <p className="mb-6 text-gray-300 leading-relaxed">
            Je me spécialise aujourd'hui dans deux domaines complémentaires à fort potentiel :
          </p>

          <h3 className="text-xl font-semibold mb-4 text-white">Développement de chatbots avancés</h3>
          <p className="mb-2 text-gray-300">Création de solutions conversationnelles intelligentes pour :</p>
          <ul className="list-disc pl-6 mb-6 text-gray-300 space-y-1">
            <li>FAQ dynamiques</li>
            <li>Support client personnalisé</li>
            <li>Qualification de prospects</li>
            <li>Assistance virtuelle</li>
          </ul>

          <h3 className="text-xl font-semibold mb-4 text-white">Automatisations augmentées par l'IA</h3>
          <p className="mb-2 text-gray-300">Conception et déploiement de systèmes qui simplifient et optimisent :</p>
          <ul className="list-disc pl-6 mb-6 text-gray-300 space-y-1">
            <li>La gestion documentaire</li>
            <li>Les processus administratifs</li>
            <li>La communication client</li>
            <li>La génération de contenu</li>
          </ul>

          <p className="mb-8 text-gray-300 leading-relaxed">
            En veille technologique permanente, je développe également des solutions basées sur des systèmes multi-agents (frameworks comme smolagent, llamaindex, crewai, agency swarm) pour créer des agents IA verticaux adaptés à des secteurs spécifiques.
          </p>

          <h2 className="text-2xl font-bold mb-6 text-orange-500">Réalisations concrètes</h2>
          <p className="mb-6 text-gray-300 leading-relaxed">
            Mes projets témoignent de ma capacité à transformer des concepts innovants en solutions opérationnelles à valeur ajoutée :
          </p>
          <ul className="list-disc pl-6 mb-8 text-gray-300 space-y-2">
            <li><strong>Assistant IA personnel</strong> : Interface Telegram capable de gérer emails, événements, réunions et base de données clients par texte ou commande vocale</li>
            <li><strong>Générateur SEO avancé</strong> : Outil de création d'articles de niveau universitaire avec données en temps réel (alternative économique au DeepSearch d'OpenAI)</li>
            <li><strong>Synchronisation Notion-Chatbot</strong> : Système permettant aux équipes métier de mettre à jour la base de connaissances de leur chatbot sans compétences techniques</li>
            <li><strong>Générateur de menus personnalisés</strong> : Solution automatisée pour une nutritionniste intégrant les particularités de chaque client</li>
            <li><strong>Générateur de présentations</strong> : Création automatique de slides Google pour propositions commerciales personnalisées</li>
            <li><strong>Système de templating CV</strong> : Automatisation de mise en forme selon les standards d'entreprise</li>
            <li><strong>Recommandeur d'automatisations</strong> : Analyse de profils clients pour suggérer des solutions d'automatisation adaptées</li>
          </ul>

          <h2 className="text-2xl font-bold mb-6 text-orange-500">Ma philosophie</h2>
          <p className="mb-4 text-gray-300 leading-relaxed">
            Ma démarche repose sur quelques principes fondamentaux :
          </p>
          <ul className="list-disc pl-6 mb-8 text-gray-300 space-y-2">
            <li><strong>Agilité et rapidité</strong> : Cycles de développement courts avec mise en production rapide et itérations successives</li>
            <li><strong>Transparence absolue</strong> : Clarté des offres et des paiements, sans facturation cachée</li>
            <li><strong>Engagement de résultat</strong> : Garantie 30 jours satisfait ou remboursé sur l'ensemble de mes services</li>
            <li><strong>Partenariat durable</strong> : Vision à long terme de la relation client, au-delà de la simple prestation</li>
            <li><strong>Transmission de compétences</strong> : Formation des équipes aux outils déployés et accompagnement dans l'adoption des bonnes pratiques IA</li>
          </ul>
        </div>
      </main>
      <Footer />
    </div>
  );
}
