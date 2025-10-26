import { motion } from "framer-motion";
import { Button } from "./Button";
import Container from "./Container";

export default function Hero() {

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Animated gradient background */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-v2-navy to-v2-electric"
        animate={{
          backgroundPosition: ["0% 0%", "100% 100%"]
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "linear"
        }}
        style={{ backgroundSize: "200% 200%" }}
      />

      {/* Gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-v2-navy/20" />

      <Container className="relative z-10">
        <motion.div className="max-w-4xl mx-auto text-center">
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
                Diagnostic gratuit 30 min
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
                Calculer mon ROI automation
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
}
