
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
            value: "rgba(255,0,0,0.1)", // Fond rouge semi-transparent pour debug
          },
        },
        fpsLimit: 60,
        particles: {
          color: {
            value: "#4a5568", // Couleur des particules changée
          },
          links: {
            color: "#4a5568",
            distance: 150,
            enable: true,
            opacity: 0.1,
            width: 1,
          },
          move: {
            enable: true,
            speed: 0.8,
            direction: "none",
            random: true,
            straight: false,
            outModes: {
              default: "bounce",
            },
            trail: {
              enable: false, // Trail désactivé
            },
          },
          number: {
            density: {
              enable: true,
              area: 800,
            },
            value: 30,
          },
          opacity: {
            value: 0.5,
            animation: {
              enable: true,
              speed: 0.5,
              minimumValue: 0.1,
              sync: false,
            },
          },
          size: {
            value: { min: 1, max: 3 },
          },
          glow: {
            enable: true,
            color: "#ffffff",
            radius: 2,
          },
        },
      }}
      className="absolute inset-0 z-0"
      style={{ width: '100%', height: '100%' }}
    />
  );
}
