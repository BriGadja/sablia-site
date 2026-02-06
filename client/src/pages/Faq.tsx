import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import { Helmet } from "react-helmet-async";
import Navigation from "@/components/landing/Navigation";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import AnimatedParticles from "@/components/animations/AnimatedParticles";
import CustomCursor from "@/components/animations/CustomCursor";
import ScrollReveal from "@/components/animations/ScrollReveal";
import SEO from "@/components/SEO";

// ============================================
// FAQ Data organized by category
// ============================================

interface FaqItem {
  question: string;
  answer: string;
}

interface FaqCategory {
  id: string;
  title: string;
  items: FaqItem[];
}

const faqCategories: FaqCategory[] = [
  {
    id: "outils",
    title: "Outils & Technologies",
    items: [
      {
        question: "Quels sont les outils d'automatisation que vous utilisez ?",
        answer:
          "Nous travaillons principalement avec n8n (auto-hébergeable) et Make.com, deux outils européens qui garantissent la souveraineté de vos données. Ces plateformes no-code/low-code permettent à vos équipes de devenir autonomes sur l'automatisation, avec 800+ intégrations natives.",
      },
      {
        question: "Quelle est la différence entre n8n et Make.com ?",
        answer:
          "n8n est auto-hébergeable (souveraineté totale) et open-source, idéal pour les entreprises sensibles à la data. Make.com est un SaaS européen plus accessible pour débuter. Notre recommandation : Make.com pour tester rapidement, n8n pour scaler avec contrôle total.",
      },
      {
        question: "Pouvez-vous intégrer nos outils métier existants ?",
        answer:
          "Oui. Nous intégrons nativement CRM (HubSpot, Salesforce, Pipedrive), Comptabilité (Pennylane, QuickBooks, Sage), Facturation (Stripe, PayPal), Communication (Slack, Teams, Gmail), et bases de données (PostgreSQL, Airtable, Notion). Si votre outil dispose d'une API, nous pouvons l'intégrer.",
      },
      {
        question: "Utilisez-vous de l'IA dans vos automatisations ?",
        answer:
          "Oui, nous intégrons OpenAI GPT-4, Claude, et Mistral AI lorsque c'est pertinent. Cas d'usage courants : classification automatique de tickets, extraction de données depuis emails/PDFs, génération de réponses personnalisées, et résumé de réunions.",
      },
    ],
  },
  {
    id: "delais",
    title: "Délais & Processus",
    items: [
      {
        question: "Combien de temps faut-il pour automatiser un processus ?",
        answer:
          "Un workflow simple prend 3-7 jours, un workflow intermédiaire 1-2 semaines, et un système complet 2-4 semaines. Chaque projet inclut une phase d'audit (1-3 jours) pour établir un calendrier précis.",
      },
      {
        question: "Comment se déroule un projet type ?",
        answer:
          "4 phases : (1) Audit & Cadrage (2-5 jours) avec appel découverte gratuit et proposition technique, (2) Développement (1-4 semaines) avec prototypage et tests, (3) Formation & Déploiement (1 semaine) avec mise en production progressive, (4) Optimisation continue avec monitoring et ajustements.",
      },
      {
        question: "Puis-je voir un prototype avant de m'engager ?",
        answer:
          "Oui. Pour les projets > 10 000€, nous proposons un POC (Proof of Concept) à 2 500€ (déduit du projet si engagement). Durée : 5 jours. Livrables : workflow fonctionnel, documentation technique, vidéo démo de 15 min, et recommandations pour le passage à l'échelle.",
      },
    ],
  },
  {
    id: "competences",
    title: "Compétences & Formation",
    items: [
      {
        question: "Mes équipes doivent-elles avoir des compétences techniques ?",
        answer:
          "Non. Notre approche Formation-First permet à vos équipes de maîtriser les outils, même sans background technique. Nous avons formé avec succès des assistants administratifs, responsables opérations, chefs de projet, et managers commerciaux.",
      },
      {
        question: "Proposez-vous des formations en interne ?",
        answer:
          "Oui. Formation Initiation (1 jour, 1 200€), Intermédiaire (2 jours, 2 200€), et Avancée (3 jours, 3 000€). Toutes incluent support PDF + vidéos, Slack communautaire, cas pratiques métier, et 1h de support post-formation.",
      },
    ],
  },
  {
    id: "roi",
    title: "ROI & Rentabilité",
    items: [
      {
        question: "Quel est le ROI typique d'un projet d'automatisation ?",
        answer:
          "Petite transformation (5-10k€) : 20-50k€/an économisés. Transformation complète (20-50k€) : 50-150k€/an. Transformation digitale (50k€+) : 150-500k€/an. Exemple concret : client e-commerce 25 personnes, investissement 35 000€, ROI en 4 mois grâce à 1 000h économisées et réduction des erreurs de 80%.",
      },
      {
        question: "Comment mesurez-vous le ROI concrètement ?",
        answer:
          "Nous utilisons le calculateur ROI Sablia (sablia.io/roi) qui mesure : temps économisé par processus, coût horaire moyen, réduction du taux d'erreur, et volumes traités. Suivi continu via dashboard temps réel, rapports mensuels, et bilan trimestriel ROI vs prévisions.",
      },
    ],
  },
  {
    id: "support",
    title: "Support & Accompagnement",
    items: [
      {
        question: "Proposez-vous un support après la mise en production ?",
        answer:
          "Oui. Support inclus par défaut : 2 semaines (Workflow Simple), 1 mois (Workflow Avancé), 3 mois (Transformation Complète). Comprend correction de bugs, ajustements mineurs, hotline email/Slack (réponse < 4h), documentation technique, et sessions Q&A hebdomadaires.",
      },
      {
        question: "Que se passe-t-il après la période de support ?",
        answer:
          "Deux options : (1) Autonomie complète avec support ponctuel à 150€/h, ou (2) Retainer mensuel : Basic à 800€/mois (5h support + monitoring) ou Pro à 1 800€/mois (12h support + nouveaux workflows + formation continue + accès prioritaire).",
      },
      {
        question: "Que faire en cas de panne d'un workflow critique ?",
        answer:
          "Procédure d'urgence : hotline support@sablia.io (réponse < 1h), diagnostic immédiat, fix prioritaire sous 4h. Garantie SLA pour clients retainer Pro : disponibilité 99.5%, temps de réponse urgence < 1h, résolution critique < 4h.",
      },
    ],
  },
  {
    id: "approche",
    title: "Approche & Méthodologie",
    items: [
      {
        question: "Peut-on commencer petit avant de transformer toute l'entreprise ?",
        answer:
          "Absolument. Approche 'Quick Win First' : (1) Validation avec Audit Express (350€) ou Diagnostic Complet (2 000€), (2) Premier workflow (2 500-5 000€) avec formation de 2-3 champions internes, (3) Expansion progressive avec 2-3 workflows par trimestre. ROI prouvé avant investissement massif.",
      },
      {
        question: "Travaillez-vous avec des entreprises de toutes tailles ?",
        answer:
          "Nous accompagnons principalement des PME et ETI (10-250 personnes). Sweet spot : 20-100 personnes avec processus répétitifs à forte volumétrie. Secteurs : e-commerce, services B2B, cabinets de conseil, agences, associations.",
      },
      {
        question: "Proposez-vous des solutions clé-en-main ou du sur mesure ?",
        answer:
          "Hybride : bibliothèque de workflows pré-construits (80% du besoin) + customisation (20%). Workflows pré-construits : onboarding client, traitement commandes, facturation automatique, synchronisation CRM-ERP, reporting, relances. Sur mesure pour spécificités métier et intégrations propriétaires.",
      },
    ],
  },
  {
    id: "tarification",
    title: "Tarification & Budget",
    items: [
      {
        question: "Quel budget prévoir pour automatiser mon entreprise ?",
        answer:
          "1 processus simple : 2 500-5 000€ (économies 10-30k€/an, ROI 2-6 mois). 3-5 processus interconnectés : 15-25k€ (économies 40-80k€/an). Transformation complète : 35-60k€ (économies 100-200k€/an).",
      },
      {
        question: "Proposez-vous des paiements échelonnés ?",
        answer:
          "Oui, pour projets > 15 000€. Option 1 : paiement par jalons (30% signature, 40% prototype, 30% production). Option 2 : mensuel sur 6-12 mois sans frais (projets > 30k€). Option 3 : retainer + développement pour budget maîtrisé.",
      },
      {
        question: "Y a-t-il des coûts cachés ?",
        answer:
          "Coûts outils à prévoir : Make.com (29-99€/mois), n8n Cloud (20-50€/mois), APIs tierces. Inclus dans nos tarifs : développement complet, tests, documentation, formation, support post-production. Hors périmètre : licences outils tiers, infrastructure serveur (si auto-hébergement), développements hors scope.",
      },
    ],
  },
  {
    id: "securite",
    title: "Sécurité & Données",
    items: [
      {
        question: "Comment garantissez-vous la sécurité de nos données ?",
        answer:
          "Hébergement Europe (RGPD-compliant), chiffrement TLS 1.3 en transit et AES-256 au repos, gestion des secrets sécurisée, 2FA obligatoire. Au niveau Sablia : NDA systématique, accès clients cloisonnés, conformité RGPD, suppression données sur demande.",
      },
      {
        question: "Puis-je héberger mes workflows sur mes propres serveurs ?",
        answer:
          "Oui, avec n8n auto-hébergé. Avantages : souveraineté totale, pas de limite de volume, conformité réglementaire stricte. Prérequis : serveur Linux, Docker, nom de domaine + SSL. Sablia peut gérer installation, configuration sécurisée et maintenance via retainer.",
      },
      {
        question: "Que se passe-t-il si vous cessez votre activité ?",
        answer:
          "Protection client garantie : workflows exportables en JSON, documentation exhaustive, vidéos explicatives. Pour n8n : code source 100% accessible, infrastructure sous votre contrôle. 0 dépendance à Sablia grâce à l'open-source.",
      },
    ],
  },
];

// Flatten all questions for FAQPage schema
const allFaqs = faqCategories.flatMap((cat) => cat.items);

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: allFaqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
};

// ============================================
// Main Component
// ============================================

export default function Faq() {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  const toggleItem = (key: string) => {
    setOpenItems((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  return (
    <>
      <SEO page="/faq" />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>

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
        <AnimatedParticles />

        <div className="relative z-10">
          <Navigation />

          <main className="pt-20">
            <section className="py-24">
              <div className="container mx-auto px-6 lg:px-8">
                {/* Page Header */}
                <ScrollReveal>
                  <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-center text-v2-white mb-4">
                    Questions fréquentes
                  </h1>
                  <p className="text-xl sm:text-2xl text-v2-off-white/80 text-center mb-16 max-w-3xl mx-auto">
                    Tout ce que vous devez savoir sur nos services d'automatisation
                  </p>
                </ScrollReveal>

                {/* Category Navigation */}
                <div className="flex flex-wrap justify-center gap-3 mb-16 max-w-4xl mx-auto">
                  {faqCategories.map((cat) => (
                    <a
                      key={cat.id}
                      href={`#${cat.id}`}
                      className="px-4 py-2 rounded-full bg-v2-charcoal/30 border border-v2-cyan/20 text-v2-off-white/80 text-sm hover:border-v2-cyan/50 hover:text-v2-white transition-colors"
                    >
                      {cat.title}
                    </a>
                  ))}
                </div>

                {/* FAQ Categories */}
                <div className="max-w-4xl mx-auto space-y-16">
                  {faqCategories.map((category, catIndex) => (
                    <motion.div
                      key={category.id}
                      id={category.id}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: catIndex * 0.05 }}
                    >
                      <h2 className="text-2xl sm:text-3xl font-bold text-v2-white mb-6 border-b border-v2-cyan/20 pb-3">
                        {category.title}
                      </h2>

                      <div className="space-y-3">
                        {category.items.map((item, itemIndex) => {
                          const key = `${category.id}-${itemIndex}`;
                          const isOpen = openItems.has(key);

                          return (
                            <div
                              key={key}
                              className="bg-v2-charcoal/30 backdrop-blur-md rounded-xl overflow-hidden border border-v2-cyan/20"
                            >
                              <button
                                onClick={() => toggleItem(key)}
                                className="w-full flex items-center justify-between p-6 text-left hover:bg-v2-charcoal/50 transition-colors"
                                aria-expanded={isOpen}
                              >
                                <h3 className="text-base sm:text-lg font-semibold text-v2-white pr-4">
                                  {item.question}
                                </h3>
                                <motion.div
                                  animate={{ rotate: isOpen ? 45 : 0 }}
                                  transition={{ duration: 0.3 }}
                                  className="flex-shrink-0"
                                  aria-hidden="true"
                                >
                                  {isOpen ? (
                                    <Minus size={24} className="text-v2-cyan" />
                                  ) : (
                                    <Plus size={24} className="text-v2-cyan" />
                                  )}
                                </motion.div>
                              </button>

                              <AnimatePresence>
                                {isOpen && (
                                  <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.3, ease: "easeInOut" }}
                                    className="overflow-hidden"
                                  >
                                    <div className="px-6 pb-6">
                                      <p className="text-base sm:text-lg text-v2-off-white/80 leading-relaxed">
                                        {item.answer}
                                      </p>
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          );
                        })}
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* CTA */}
                <ScrollReveal>
                  <div className="text-center mt-16">
                    <p className="text-lg text-v2-off-white/70 mb-6">
                      Vous n'avez pas trouvé votre réponse ?
                    </p>
                    <a
                      href="/#contact"
                      className="inline-block bg-v2-cyan text-v2-navy px-8 py-4 rounded-lg font-bold text-lg hover:bg-v2-cyan/90 transition-colors"
                    >
                      Contactez-nous
                    </a>
                  </div>
                </ScrollReveal>
              </div>
            </section>
          </main>

          <Footer />
          <ScrollToTop />
        </div>

        <CustomCursor />
      </motion.div>
    </>
  );
}
