import { Button } from "./ui/button";
import { RainbowText } from "./RainbowText";
import { Link } from "wouter";

export default function HeroSection() {
  return (
    <div className="min-h-screen flex items-center bg-gray-900 text-gray-100 relative overflow-hidden">
      <div className="container mx-auto px-2 sm:px-4 w-full">
        <div className="max-w-3xl mx-auto text-center w-full">
          <p className="text-sm font-semibold tracking-widest text-gray-400 uppercase mb-8">
            AUTOMATE YOUR BUSINESS
          </p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-10 leading-tight max-w-full overflow-hidden">
            Laissez l'<RainbowText>IA</RainbowText> & vos<br className="hidden sm:block" /> <RainbowText>automatisations</RainbowText><br /> booster votre Business.
          </h1>
          <p className="text-base sm:text-lg md:text-2xl text-gray-300 mb-12 max-w-full px-4">
            Libérez votre temps des tâches répétitives. 
          </p>
          <div className="flex gap-4 justify-center flex-wrap px-4">
            <a
              href="https://calendly.com/brice-gachadoat/30min"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-4 sm:px-8 py-3 rounded-md inline-block shadow-lg hover:shadow-xl transition-all duration-300 text-sm sm:text-base font-medium"
            >
              Réservez un call gratuit !
            </a>
            <Link href="/gap" className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 sm:px-8 py-3 rounded-md inline-block shadow-lg hover:shadow-xl transition-all duration-300 text-sm sm:text-base font-medium truncate">
              Découvrez vos automatisations sur-mesure !
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}