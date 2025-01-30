
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
            speed: 0.3,
            direction: "none",
            outModes: {
              default: "bounce",
            },
            trail: {
              enable: true,
              length: 50,
              fill: { 
                color: {
                  value: "rgba(229, 231, 235, 0.05)"
                }
              }
            },
          },
          number: {
            density: { enable: true, area: 800 },
            value: 15,
          },
          opacity: {
            value: { min: 0.1, max: 0.4 },
            animation: {
              enable: true,
              speed: 0.2,
              sync: false
            }
          },
          size: {
            value: { min: 1, max: 1 },
          },
          shape: { type: "circle" },
          life: {
            duration: {
              sync: false,
              value: 5
            }
          }
        },
        detectRetina: true,
      }}
      className="absolute inset-0 -z-10 opacity-20"
      style={{
        pointerEvents: 'none',
        mixBlendMode: 'screen'
      }}
    />
  );
}
