import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "./Button";
import Container from "./Container";

export default function Hero() {
  // Parallax effect: hero content moves slower than scroll
  const { scrollY } = useScroll();
  const yParallax = useTransform(scrollY, [0, 500], [0, 100]);

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Animated gradient background */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-v2-navy to-v2-electric"
        animate={{
          backgroundPosition: ["0% 0%", "100% 100%"]
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "linear"
        }}
        style={{ backgroundSize: "200% 200%" }}
      />

      {/* Gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-v2-navy/20" />

      <Container className="relative z-10">
        <motion.div
          className="max-w-4xl mx-auto text-center"
          style={{ y: yParallax }}
        >
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-4xl sm:text-5xl lg:text-7xl font-bold text-v2-white mb-8 leading-[1.1]"
          >
            Vos meilleurs collaborateurs se{" "}
            <span className="text-v2-cyan">noient</span> dans le copier-coller
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl sm:text-2xl text-v2-white/90 mb-12 leading-relaxed"
          >
            Formation-first automation qui donne à votre équipe les moyens
            de posséder les systèmes qui pilotent la croissance
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2 }}
            >
              <Button
                size="lg"
                variant="primary"
                onClick={() => window.open('https://calendly.com/brice-gachadoat/30min', '_blank')}
                className="w-full sm:w-auto"
              >
                🎯 Diagnostic gratuit 30 min
              </Button>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2 }}
            >
              <Button
                size="lg"
                variant="outline"
                className="bg-transparent border-v2-white text-v2-white hover:bg-v2-white hover:text-v2-navy w-full sm:w-auto"
                onClick={() => {
                  const calculator = document.getElementById('calculator-roi');
                  calculator?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                📊 Calculer mon ROI automation
              </Button>
            </motion.div>
          </motion.div>

          {/* Animated scroll indicator */}
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 text-v2-white/60 text-sm font-medium flex flex-col items-center gap-2"
          >
            <span>Découvrir</span>
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
}
