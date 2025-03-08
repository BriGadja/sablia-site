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
              className="group w-full sm:w-auto relative overflow-hidden rounded-xl bg-gradient-to-br from-orange-500/20 to-orange-600/20 px-6 sm:px-10 py-4 backdrop-blur-sm border-2 border-transparent transition-all duration-300"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-500 via-blue-500 to-orange-500 rounded-lg blur opacity-60 group-hover:opacity-100 transition duration-1000 group-hover:duration 200 animate-tilt"></div>
              <button className="relative w-full px-6 sm:px-10 py-4 bg-gradient-to-br from-orange-500/20 to-orange-600/20 rounded-xl backdrop-blur-sm leading-none flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-orange-600 opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-xl"></div>
                <div className="flex items-center justify-center gap-2 text-base sm:text-lg font-medium relative">
                  <Calendar className="w-5 h-5 group-hover:text-orange-400 transition-colors" />
                  <span className="group-hover:text-orange-200 transition-colors">Réservez un call gratuit !</span>
                </div>
              </button>
            </motion.a>

            <motion.div
              className="w-full sm:w-auto"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link href="/gap">
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 via-orange-500 to-blue-500 rounded-lg blur opacity-60 group-hover:opacity-100 transition duration-1000 group-hover:duration 200 animate-tilt"></div>
                  <button className="relative w-full px-6 sm:px-10 py-4 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-xl backdrop-blur-sm leading-none flex items-center justify-center">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-600 opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-xl"></div>
                    <div className="flex items-center justify-center gap-2 text-base sm:text-lg font-medium relative">
                      <Sparkles className="w-5 h-5 group-hover:text-blue-400 transition-colors" />
                      <span className="group-hover:text-blue-200 transition-colors">Découvrez vos automatisations sur-mesure !</span>
                    </div>
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