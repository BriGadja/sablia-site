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
        fpsLimit: 120,
        particles: {
          color: {
            value: "#ff6b6b",
          },
          links: { 
            enable: false 
          },
          move: {
            enable: true,
            speed: 2,
            direction: "none",
            random: true,
            straight: false,
            outModes: {
              default: "out",
            },
            trail: {
              enable: true,
              length: 20,
              fill: {
                color: "#ff6b6b",
              },
            },
          },
          number: {
            density: { 
              enable: true, 
              area: 800 
            },
            value: 40,
          },
          opacity: {
            value: 0.8,
            animation: {
              enable: true,
              speed: 0.5,
              minimumValue: 0.1,
              sync: false,
            },
          },
          size: {
            value: { min: 1, max: 2 },
            animation: {
              enable: true,
              speed: 1,
              minimumValue: 0.1,
              sync: false,
            },
          },
          shape: { 
            type: "circle" 
          },
          life: {
            duration: {
              sync: false,
              value: 3
            },
            count: 1,
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