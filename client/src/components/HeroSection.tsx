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
              className="group w-full sm:w-auto relative overflow-hidden rounded-xl bg-gradient-to-br from-orange-500/10 to-orange-600/10 px-6 sm:px-10 py-4 backdrop-blur-sm border border-orange-500/20 hover:border-orange-500/40 transition-all duration-300"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-orange-600 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
              <div className="flex items-center justify-center gap-2 text-base sm:text-lg font-medium">
                <Calendar className="w-5 h-5" />
                <span>Réservez un call gratuit !</span>
              </div>
            </motion.a>

            <motion.div
              className="w-full sm:w-auto"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link href="/gap">
                <a className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-500/10 to-blue-600/10 px-6 sm:px-10 py-4 backdrop-blur-sm border border-blue-500/20 hover:border-blue-500/40 transition-all duration-300 block">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-600 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                  <div className="flex items-center justify-center gap-2 text-base sm:text-lg font-medium">
                    <Sparkles className="w-5 h-5" />
                    <span>Découvrez vos automatisations sur-mesure !</span>
                  </div>
                </a>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}