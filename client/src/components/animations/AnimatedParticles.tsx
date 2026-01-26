import { useEffect, useRef, useState } from "react";

/**
 * AnimatedParticles - Système de particules organiques en fond
 * Utilise Canvas API + requestAnimationFrame pour performance optimale
 *
 * Caractéristiques:
 * - Particules qui se déplacent avec physique (vx, vy avec friction)
 * - Connexions dynamiques entre particules proches
 * - Interaction curseur (attraction dans rayon 150px)
 * - Couleurs: blanc pur et blanc semi-transparent pour visibilité optimale
 * - Optimisé pour mobile (moins de particules, pas de connexions)
 * - Respecte prefers-reduced-motion
 *
 * Performance: 60fps garanti sur desktop moderne
 */

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
}

export default function AnimatedParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Check for prefers-reduced-motion
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handleMotionChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };
    mediaQuery.addEventListener("change", handleMotionChange);

    return () => mediaQuery.removeEventListener("change", handleMotionChange);
  }, []);

  useEffect(() => {
    // Don't animate if user prefers reduced motion
    if (prefersReducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Detect mobile for performance optimization
    const isMobile = window.innerWidth < 768;

    // Dimensions
    const updateSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    updateSize();
    window.addEventListener("resize", updateSize);

    // Particules - reduced on mobile, capped at 100 max
    const baseCount = Math.floor((canvas.width * canvas.height) / (isMobile ? 30000 : 15000));
    const particleCount = Math.min(baseCount, isMobile ? 30 : 100);
    const particles: Particle[] = [];
    const colors = ["#FFFFFF", "rgba(255, 255, 255, 0.8)"];

    // Initialisation
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 2 + 1,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    // Position du curseur
    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    window.addEventListener("mousemove", handleMouseMove);

    // Animation loop
    const animate = () => {
      // Effacement complet pour rendu propre (pas de traînée)
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle, i) => {
        // Mise à jour position
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Rebond sur les bords
        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

        // Interaction avec le curseur
        const dx = mouseX - particle.x;
        const dy = mouseY - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 150) {
          const force = (150 - distance) / 150;
          particle.vx += (dx / distance) * force * 0.02;
          particle.vy += (dy / distance) * force * 0.02;
        }

        // Friction
        particle.vx *= 0.99;
        particle.vy *= 0.99;

        // Dessiner la particule
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.fill();

        // Connexions entre particules proches (skip on mobile for performance)
        if (!isMobile) {
          for (let j = i + 1; j < particles.length; j++) {
            const other = particles[j];
            const dx2 = particle.x - other.x;
            const dy2 = particle.y - other.y;
            const dist = Math.sqrt(dx2 * dx2 + dy2 * dy2);

            if (dist < 100) {
              ctx.beginPath();
              ctx.moveTo(particle.x, particle.y);
              ctx.lineTo(other.x, other.y);
              ctx.strokeStyle = `rgba(255, 255, 255, ${0.3 * (1 - dist / 100)})`;
              ctx.lineWidth = 0.5;
              ctx.stroke();
            }
          }
        }
      });

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", updateSize);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [prefersReducedMotion]);

  // Don't render canvas if user prefers reduced motion
  if (prefersReducedMotion) {
    return null;
  }

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ background: "transparent" }}
    />
  );
}
