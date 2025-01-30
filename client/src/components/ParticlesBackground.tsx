
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
            value: "#e5e7eb",
          },
          links: { enable: false },
          move: {
            enable: true,
            speed: 0.5,
            direction: "none",
            outModes: "bounce",
            trail: {
              enable: true,
              length: 30,
              fill: { 
                color: "rgba(229, 231, 235, 0.1)"
              }
            },
          },
          number: {
            density: { enable: true, area: 800 },
            value: 12,
          },
          opacity: {
            value: { min: 0.3, max: 0.6 },
            animation: {
              enable: true,
              speed: 0.4,
              decay: 0.2,
              sync: false
            }
          },
          size: {
            value: { min: 1, max: 1 },
          },
          shape: { type: "circle" },
          life: {
            duration: {
              value: 3,
              sync: false
            }
          }
        },
        detectRetina: true,
      }}
      className="absolute inset-0 z-0"
      style={{
        pointerEvents: 'none',
        mixBlendMode: 'plus-lighter'
      }}
    />
  );
}
