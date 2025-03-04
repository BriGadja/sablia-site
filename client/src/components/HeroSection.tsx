import { Button } from "./ui/button";
import { RainbowText } from "./RainbowText";
import { Link } from "wouter";

export default function HeroSection() {
  return (
    <div className="min-h-screen flex items-center bg-gray-900 text-gray-100 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-sm font-semibold tracking-widest text-gray-400 uppercase mb-8">
            AUTOMATE YOUR BUSINESS
          </p>
          <h1 className="text-6xl sm:text-5xl md:text-6xl font-bold text-white mb-10 leading-tight">
            Laissez l'<RainbowText>IA</RainbowText> & vos <RainbowText>automatisations</RainbowText> booster votre Business.
          </h1>
          <p className="text-lg md:text-3xl text-gray-300 mb-12">
            Libérez votre temps des tâches répétitives. 
          </p>
          <div className="flex gap-6 justify-center flex-wrap mt-6">
            <a
              href="https://calendly.com/brice-gachadoat/30min"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-10 py-4 rounded-md inline-block shadow-lg hover:shadow-xl transition-all duration-300 text-lg font-medium"
            >
              Réservez un call gratuit !
            </a>
            <Link href="/gap" className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-10 py-4 rounded-md inline-block shadow-lg hover:shadow-xl transition-all duration-300 text-lg font-medium">
              Découvrez vos automatisations sur-mesure !
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}