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
            value: "#ff6b6b",
          },
          links: { enable: false },
          move: {
            enable: true,
            speed: 1,
            direction: "none",
            outModes: {
              default: "bounce",
            },
            trail: {
              enable: true,
              length: 3,
              fill: { 
                color: {
                  value: "#ff6b6b"
                }
              }
            },
          },
          number: {
            density: { enable: true, area: 800 },
            value: 30,
          },
          opacity: {
            value: { min: 0.4, max: 0.8 },
            animation: {
              enable: true,
              speed: 0.3,
              sync: false
            }
          },
          size: {
            value: { min: 2, max: 3 },
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
      className="fixed inset-0 z-[1]"
      style={{
        pointerEvents: 'none',
        backgroundColor: 'transparent',
        position: 'absolute'
      }}
    />
  );
}