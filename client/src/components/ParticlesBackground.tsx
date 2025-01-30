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
        fullScreen: false,
        fpsLimit: 120,
        particles: {
          color: {
            value: "#4f46e5",
          },
          links: { 
            enable: false 
          },
          move: {
            enable: true,
            speed: 0.8,
            direction: "none",
            random: false,
            straight: false,
            outModes: {
              default: "out",
            },
            trail: {
              enable: true,
              length: 20,
              fill: {
                color: "#4f46e5",
              },
            },
          },
          number: {
            density: { 
              enable: true, 
              area: 1200 
            },
            value: 20,
          },
          opacity: {
            value: 0.15,
            animation: {
              enable: true,
              speed: 0.2,
              minimumValue: 0.05,
              sync: false,
            },
          },
          size: {
            value: { min: 0.5, max: 1.5 },
            animation: {
              enable: true,
              speed: 0.8,
              minimumValue: 0.3,
              sync: false,
            },
          },
          shape: { 
            type: "circle" 
          },
          life: {
            duration: {
              sync: false,
              value: 4
            },
            count: 1,
          }
        },
        detectRetina: true,
      }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        pointerEvents: 'none',
      }}
    />
  );
}