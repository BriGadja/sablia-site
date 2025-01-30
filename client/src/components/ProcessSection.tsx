
import { Clock, Wrench, CheckCircle, Rocket } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";

const steps = [
  {
    icon: Clock,
    title: "Appel découverte gratuit",
    subtitle: "On discute, on identifie, on vous propose – sans aucun engagement !",
    content: `Ce premier contact est l'occasion d'échanger librement sur vos besoins, vos outils existants et les tâches qui vous prennent le plus de temps. Nous analysons ensemble vos processus pour cibler les automatisations les plus impactantes. À la fin de l'appel, vous recevrez un résumé personnalisé avec des pistes concrètes pour optimiser votre quotidien.

    ✅ Ce que vous gagnez :
    • Aucune pression : c'est une simple prise de contact
    • Une analyse clé en main de vos points bloquants
    • Des idées d'automatisation adaptées à vos besoins
    
    Vous repartez avec des solutions, même si nous ne travaillons pas ensemble !`
  },
  {
    icon: Wrench,
    title: "Développement sur mesure",
    subtitle: "Une solution 100% façonnée pour vous, sans délai standardisé",
    content: `Nous transformons vos idées en outils concrets. Que votre besoin soit simple (automatiser un envoi d'emails) ou complexe (refonte d'un workflow multi-services), nous adaptons notre approche. La réalisation prend entre 3 jours et 4 semaines selon les cas – nous vous tiendrons informés à chaque étape !

    ✅ Notre promesse :
    • Pas de modèle prédéfini : tout est conçu pour votre activité
    • Des mises à jour régulières sur l'avancée du projet
    • Des technologies sécurisées et compatibles avec vos systèmes`
  },
  {
    icon: CheckCircle,
    title: "Tests et ajustements",
    subtitle: "Votre avis guide tout : on affine jusqu'à la perfection !",
    content: `Nous vous présentons la solution développée et testons ensemble son fonctionnement. Un bug ? Une fonction manquante ? Nous modifions, améliorons et réitérons les tests autant de fois que nécessaire. L'objectif est simple : vous offrir un outil qui dépasse vos attentes.

    ✅ Pourquoi ça marche :
    • Des retours intégrés en temps réel
    • Des corrections rapides (souvent sous 24h)
    • Une équipe disponible pour répondre à toutes vos questions`
  },
  {
    icon: Rocket,
    title: "Intégration finale",
    subtitle: "Vous pilotez, nous restons en copilote !",
    content: `Une fois la solution validée, nous la déployons sur vos plateformes en toute transparence. Vous recevez vos identifiants, une formation claire et un accès à notre FAQ en ligne. Et si besoin, notre équipe reste joignable pour des ajustements post-lancement.

    ✅ Les avantages :
    • Autonomie totale (mais pas d'abandon !)
    • Documentation et tutoriels vidéo inclus
    • Un support réactif pendant 1 mois offert
    
    Votre succès est le nôtre : nous célébrerons ensemble chaque gain de productivité !`
  }
];

export default function ProcessSection() {
  return (
    <section id="process" className="py-16">
      <div className="container max-w-4xl">
        <h2 className="section-title">Notre Processus</h2>
        <div className="relative">
          <div className="absolute left-8 top-0 h-full w-px bg-gradient-to-b from-orange-500/30 to-orange-600/30" />
          <Accordion type="single" collapsible className="space-y-6">
            {steps.map((step, index) => (
              <AccordionItem
                key={index}
                value={`step-${index}`}
                className="border-none relative"
              >
                <div className="absolute -left-3 top-4 h-4 w-4 rounded-full bg-orange-500" />
                <div className="pl-12">
                  <AccordionTrigger className="hover:no-underline [&[data-state=open]>div]:text-orange-500">
                    <div className="flex flex-col items-start text-left">
                      <h3 className="text-xl font-semibold mb-2 text-white">
                        {step.title}
                      </h3>
                      <p className="text-gray-400 text-sm">{step.subtitle}</p>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-300 whitespace-pre-line">
                    {step.content}
                  </AccordionContent>
                </div>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
