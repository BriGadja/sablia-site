import { Button } from "./ui/button";
import { RainbowText } from "./RainbowText";
import { Link } from "wouter";
import { Calendar, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function HeroSection() {
  return (
    <div className="min-h-screen flex items-center bg-gray-900 text-gray-100 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-sm font-semibold tracking-widest text-gray-400 uppercase mb-6 sm:mb-8">
            AUTOMATE YOUR BUSINESS
          </p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-8 sm:mb-10 leading-tight px-2">
            Laissez l'<RainbowText>IA</RainbowText> & vos <RainbowText>automatisations</RainbowText> booster votre Business.
          </h1>
          <p className="text-lg sm:text-xl md:text-3xl text-gray-300 mb-8 sm:mb-12 px-2">
            Libérez votre temps des tâches répétitives. 
          </p>
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center px-4">
            <motion.a
              href="https://calendly.com/brice-gachadoat/30min"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <button className="w-full px-8 py-4 rounded-full bg-gradient-to-r from-[#d14b79] via-[#22c4d6] to-[#d14b79] text-white font-medium text-base sm:text-lg hover:opacity-90 transition-opacity duration-200 flex items-center justify-center gap-2 animate-gradient-x bg-200%">
                <Calendar className="w-5 h-5" />
                <span>Réservez un call gratuit !</span>
              </button>
            </motion.a>

            <motion.div
              className="w-full sm:w-auto"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link href="/gap">
                <div className="relative p-[2px] rounded-full bg-gradient-to-r from-[#d14b79] via-[#22c4d6] to-[#d14b79] animate-gradient-x bg-200%">
                  <button className="relative w-full px-8 py-4 bg-gray-900 rounded-full text-white font-medium text-base sm:text-lg hover:bg-opacity-95 transition-colors duration-200 flex items-center justify-center gap-2 group">
                    <Sparkles className="w-5 h-5" />
                    <span className="bg-gradient-to-r from-[#d14b79] via-[#22c4d6] to-[#d14b79] bg-clip-text text-transparent animate-gradient-x bg-200%">Découvrez vos automatisations sur-mesure !</span>
                  </button>
                </div>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}