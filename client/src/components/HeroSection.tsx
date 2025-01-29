import { Button } from "./ui/button";

export default function HeroSection() {
  return (
    <div className="pt-24 pb-16 relative overflow-hidden">
      <div className="container">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-sm font-semibold tracking-widest text-gray-600 uppercase mb-4">
            AUTOMATE YOUR BUSINESS
          </p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Libérez votre temps des tâches répétitives. Laissez l'IA & nos automatisations booster votre impact
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-8">
            Workflows intelligents clé en main pour freelances, entrepreneurs et entreprises - 0 code, 100% de temps réinvesti
          </p>
          <Button
            size="lg"
            className="bg-primary text-white hover:bg-primary/90"
            onClick={() => window.open('https://calendly.com/brice-gachadoat/30min', '_blank')}
          >
            Réserver un appel découverte gratuit
          </Button>
        </div>
      </div>
    </div>
  );
}
