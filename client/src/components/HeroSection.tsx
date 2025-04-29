import { Button } from "./ui/button";
import { RainbowText } from "./RainbowText";
import { Link } from "wouter";

export default function HeroSection() {
  return (
    <div className="h-screen flex items-center justify-center bg-gray-900 text-gray-100 relative overflow-hidden">
      <div className="container mx-auto px-4 py-16 w-full flex flex-col justify-center h-full">
        <div className="max-w-3xl mx-auto text-center w-full mt-16">
          <p className="text-sm font-semibold tracking-widest text-gray-400 uppercase mb-10">
            AUTOMATE YOUR BUSINESS
          </p>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold text-white mb-16 leading-tight max-w-full overflow-hidden bg-gray-800/70 bg-opacity-70 backdrop-blur-sm inline-block mx-auto px-8 py-6 rounded-2xl shadow-lg">
            Laissez l'<span className="rainbow-text">IA</span> & vos<br className="hidden sm:block" /> <span className="rainbow-text">automatisations</span><br /> booster votre Business.
          </h1>
          <p className="text-base sm:text-lg md:text-2xl text-gray-300 mb-20 max-w-full px-4">
            Libérez votre temps des tâches répétitives. 
          </p>
          <div className="flex gap-6 justify-center flex-wrap px-4 mt-8">
            <a
              href="https://calendly.com/brice-gachadoat/30min"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-6 sm:px-10 py-4 rounded-md inline-block shadow-lg hover:shadow-xl transition-all duration-300 text-sm sm:text-base font-medium"
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