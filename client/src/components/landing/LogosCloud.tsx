import { motion } from "framer-motion";
import ScrollReveal from "@/components/animations/ScrollReveal";

/**
 * LogosCloud - Responsive grid of 12 integration logos
 *
 * Features:
 * - 12 integration logos (automation, AI, productivity, communication, development)
 * - Responsive grid: 4 columns desktop → 3 tablet → 2 mobile
 * - White logos with opacity hover effect (60% → 100%)
 * - Staggered fade-in animation (0.08s delay per logo)
 * - ScrollReveal wrapper for section entry animation
 * - Scale effect on hover (1.05x)
 */

interface Integration {
  id: number;
  name: string;
  imageUrl: string;
  category: "automation" | "ai" | "productivity" | "communication" | "development";
}

const integrations: Integration[] = [
  // Automation platforms (2)
  { id: 1, name: "n8n", imageUrl: "/logos/integrations/n8n.svg", category: "automation" },
  { id: 2, name: "Make", imageUrl: "/logos/integrations/make.svg", category: "automation" },

  // AI platforms (4)
  { id: 3, name: "OpenAI", imageUrl: "/logos/integrations/openai.svg", category: "ai" },
  { id: 4, name: "Anthropic", imageUrl: "/logos/integrations/anthropic.svg", category: "ai" },
  { id: 5, name: "Gemini", imageUrl: "/logos/integrations/googlegemini.svg", category: "ai" },
  { id: 6, name: "Perplexity", imageUrl: "/logos/integrations/perplexity.svg", category: "ai" },

  // Productivity & Google ecosystem (3)
  { id: 7, name: "Google Sheets", imageUrl: "/logos/integrations/googlesheets.svg", category: "productivity" },
  { id: 8, name: "Google Drive", imageUrl: "/logos/integrations/googledrive.svg", category: "productivity" },
  { id: 9, name: "Notion", imageUrl: "/logos/integrations/notion.svg", category: "productivity" },

  // Communication (1)
  { id: 10, name: "Slack", imageUrl: "/logos/integrations/slack.svg", category: "communication" },

  // Development & Deployment (2)
  { id: 11, name: "GitHub", imageUrl: "/logos/integrations/github.svg", category: "development" },
  { id: 12, name: "Vercel", imageUrl: "/logos/integrations/vercel.svg", category: "development" },
];

export default function LogosCloud() {
  return (
    <section
      id="logos"
      className="py-24 relative overflow-hidden"
    >
      <div className="container mx-auto px-6 lg:px-8">
        <ScrollReveal>
          {/* Section Header */}
          <div className="text-center mb-16">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-lg sm:text-xl font-semibold text-v2-cyan uppercase tracking-wider mb-4"
            >
              Les outils que nous maîtrisons
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-5xl sm:text-6xl lg:text-7xl font-bold text-v2-white"
            >
              Intégrations & Outils
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-xl sm:text-2xl text-v2-off-white/70 mt-4"
            >
              Automatisez vos workflows avec les outils que vous utilisez déjà
            </motion.p>
          </div>

          {/* Logos Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 lg:gap-12">
            {integrations.map((integration, index) => (
              <motion.div
                key={integration.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                whileHover={{ scale: 1.05 }}
                className="flex items-center justify-center"
              >
                <img
                  src={integration.imageUrl}
                  alt={`${integration.name} integration`}
                  title={integration.name}
                  className="h-12 lg:h-14 w-auto object-contain transition-all duration-300 opacity-60 hover:opacity-100"
                />
              </motion.div>
            ))}
          </div>

          {/* Footer Text */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-12 text-base sm:text-lg text-v2-off-white/50"
          >
            Et bien d'autres intégrations possibles
          </motion.p>
        </ScrollReveal>
      </div>
    </section>
  );
}
