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
            value: "#ffffff",
          },
          links: { 
            enable: false 
          },
          move: {
            enable: true,
            speed: 1.5,
            direction: "none",
            random: false,
            straight: false,
            outModes: {
              default: "out",
            },
            trail: {
              enable: true,
              length: 10,
              fill: {
                color: "#ffffff",
              },
            },
          },
          number: {
            density: { 
              enable: true, 
              area: 1000 
            },
            value: 50,
          },
          opacity: {
            value: 1,
            animation: {
              enable: true,
              speed: 0.3,
              minimumValue: 0.2,
              sync: false,
            },
          },
          size: {
            value: { min: 0.5, max: 1.5 },
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
      className="fixed inset-0 z-[999]"
      style={{
        position: 'fixed',
        width: '100%',
        height: '100%',
        top: 0,
        left: 0,
        pointerEvents: 'none',
        backgroundColor: 'transparent',
      }}
    />
  );
}