import { useCallback } from "react";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";
import type { Engine } from "tsparticles-engine";

export default function ParticlesBackground() {
  const particlesInit = useCallback(async (engine: Engine) => {
    await loadSlim(engine);
  }, []);

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      options={{
        background: {
          color: {
            value: "transparent",
          },
        },
        fpsLimit: 60,
        particles: {
          color: {
            value: "#e5e7eb", // Couleur gris clair subtile
          },
          links: {
            enable: false // Désactivé pour plus de sobriété
          },
          move: {
            enable: true,
            speed: 1, // Ralenti le mouvement
            direction: "none",
            outModes: {
              default: "out",
            },
            trail: {
              enable: true,
              length: 10, // Longueur de la traînée
              fillColor: "rgba(229, 231, 235, 0.2)", // Même couleur que les particules avec opacité réduite
            },
          },
          number: {
            density: {
              enable: true,
              area: 800,
            },
            value: 20, // Réduit le nombre de particules
          },
          opacity: {
            value: {
              min: 0.1,
              max: 0.5 // Variation d'opacité pour effet de scintillement
            },
            animation: {
              enable: true,
              speed: 0.5,
              sync: false
            }
          },
          size: {
            value: { min: 1, max: 2 }, // Taille plus petite
          },
          shape: {
            type: "circle" // Forme simple
          }
        },
        detectRetina: true,
      }}
      className="absolute inset-0 -z-10 opacity-30"
    />
  );
}