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
      {/* Warm atmospheric gradient */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-sablia-bg via-sablia-bg to-sablia-surface" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_40%,_rgba(196,90,44,0.03),_transparent_70%)]" />
      </div>

      <div className="container mx-auto px-6 lg:px-8 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          className="space-y-8"
        >
          {/* Small label */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-sm font-medium uppercase tracking-[0.2em] text-sablia-text-secondary"
          >
            Automatisation & IA sur mesure pour PME
          </motion.p>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-display font-semibold leading-[1.1] tracking-tight text-sablia-text">
            Retournez{" "}
            <span className="text-sablia-sienna">le sablier</span>
          </h1>

          <p className="text-lg sm:text-xl text-sablia-text-secondary max-w-2xl mx-auto leading-relaxed font-light">
            Sablia automatise vos processus répétitifs. Vous récupérez vos heures.
          </p>

          {/* Thin decorative line */}
          <div className="w-16 h-px bg-sablia-accent/20 mx-auto" />

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-2">
            <button
              onClick={() => handleCTAClick("#contact")}
              className="bg-sablia-accent text-sablia-bg px-8 py-3.5 rounded text-base font-medium hover:bg-sablia-accent-hover transition-colors duration-200 tracking-wide"
            >
              Diagnostic Gratuit
            </button>

            <button
              onClick={() => handleCTAClick("#calculator")}
              className="border border-sablia-accent/20 text-sablia-text px-8 py-3.5 rounded text-base font-medium hover:bg-sablia-accent/5 transition-colors duration-200"
            >
              Calculer mon ROI
            </button>
          </div>

          <p className="text-sm text-sablia-text-tertiary pt-2">
            Brice Gachadoat — Resp. Pédagogique & Expert IA,{" "}
            <a
              href="https://iapreneurs.com"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-sablia-text-secondary transition-colors"
            >
              IAPreneurs (160k+)
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
