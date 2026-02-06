import { motion } from "framer-motion";

export default function HeroSection() {
  const handleCTAClick = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center"
    >
      <div className="container mx-auto px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
          className="space-y-8"
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight text-sablia-text">
            L'IA au service de{" "}
            <span className="text-sablia-accent">votre croissance</span>
          </h1>

          <p className="text-lg sm:text-xl text-sablia-text-secondary max-w-2xl mx-auto leading-relaxed">
            On forme vos équipes. On installe les systèmes. Vous gardez le contrôle.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <button
              onClick={() => handleCTAClick("#contact")}
              className="bg-sablia-accent text-white px-8 py-3.5 rounded-md text-base font-medium hover:bg-sablia-accent-hover transition-colors duration-200"
            >
              Diagnostic Gratuit
            </button>

            <button
              onClick={() => handleCTAClick("#calculator")}
              className="border border-gray-200 text-sablia-text px-8 py-3.5 rounded-md text-base font-medium hover:bg-gray-50 transition-colors duration-200"
            >
              Calculer mon ROI
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
