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
            value: "#6366f1",
          },
          links: { 
            enable: false 
          },
          move: {
            enable: true,
            speed: 1,
            direction: "none",
            random: false,
            straight: false,
            outModes: {
              default: "out",
            },
            trail: {
              enable: true,
              length: 15,
              fill: {
                color: "#6366f1",
              },
            },
          },
          number: {
            density: { 
              enable: true, 
              area: 800 
            },
            value: 30,
          },
          opacity: {
            value: 0.3,
            animation: {
              enable: true,
              speed: 0.3,
              minimumValue: 0.1,
              sync: false,
            },
          },
          size: {
            value: { min: 0.5, max: 1 },
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
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  );
}