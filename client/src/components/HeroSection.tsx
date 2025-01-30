
import { Button } from "./ui/button";

export default function HeroSection() {
  return (
    <div className="pt-24 pb-16 relative overflow-hidden">
      <div className="container">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-sm font-semibold tracking-widest text-gray-400 uppercase mb-4">
            AUTOMATE YOUR BUSINESS
          </p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Libérez votre temps des tâches répétitives. Laissez l'IA & nos <span className="rainbow-text" onMouseMove={(e) => {
              const x = (e.clientX / window.innerWidth) * 100;
              (e.target as HTMLElement).style.setProperty('--x', x.toString());
            }}>automatisations</span> booster votre impact
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-8">
            Workflows intelligents clé en main pour freelances, entrepreneurs et entreprises<br />
            0 code, 100% de temps réinvesti
          </p>
          <a
            href="https://calendly.com/brice-gachadoat/30min"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-3 rounded-md inline-block shadow-lg hover:shadow-xl transition-all duration-300 text-lg font-medium"
          >
            Réserver un appel découverte gratuit
          </a>
        </div>
      </div>
    </div>
  );
}
