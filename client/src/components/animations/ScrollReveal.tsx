import { useEffect, useRef, ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "@/hooks/useReducedMotion";

gsap.registerPlugin(ScrollTrigger);

/**
 * ScrollReveal - Animation sophistiquée au scroll avec GSAP
 * 4 composants exportés pour différents effets
 * All components respect prefers-reduced-motion user preference
 */

// ============================================
// 1. ScrollReveal - Animation principale
// ============================================

interface ScrollRevealProps {
  children: ReactNode;
  direction?: "up" | "down" | "left" | "right" | "fade" | "scale";
  duration?: number;
  delay?: number;
  stagger?: number;
  className?: string;
}

export function ScrollReveal({
  children,
  direction = "up",
  duration = 1,
  delay = 0,
  stagger = 0,
  className = "",
}: ScrollRevealProps) {
  const elementRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    // If user prefers reduced motion, set final state immediately with no animation
    if (prefersReducedMotion) {
      gsap.set(element, { opacity: 1, y: 0, x: 0, scale: 1 });
      if (stagger > 0) {
        gsap.set(Array.from(element.children), { opacity: 1, y: 0, x: 0, scale: 1 });
      }
      return;
    }

    const animations: Record<string, gsap.TweenVars> = {
      up: { y: 50, opacity: 0 },
      down: { y: -50, opacity: 0 },
      left: { x: 50, opacity: 0 },
      right: { x: -50, opacity: 0 },
      fade: { opacity: 0 },
      scale: { scale: 0.8, opacity: 0 },
    };

    const children = element.children;
    const targets = stagger > 0 ? Array.from(children) : element;

    gsap.fromTo(
      targets,
      animations[direction],
      {
        ...animations[direction],
        y: 0,
        x: 0,
        scale: 1,
        opacity: 1,
        duration,
        delay,
        stagger,
        ease: "power3.out",
        scrollTrigger: {
          trigger: element,
          start: "top 80%",
          end: "top 20%",
          toggleActions: "play none none reverse",
        },
      }
    );
  }, [direction, duration, delay, stagger, prefersReducedMotion]);

  return (
    <div ref={elementRef} className={className}>
      {children}
    </div>
  );
}

// ============================================
// 2. ParallaxSection - Effet parallax
// ============================================

interface ParallaxSectionProps {
  children: ReactNode;
  speed?: number;
  className?: string;
}

export function ParallaxSection({
  children,
  speed = 0.5,
  className = "",
}: ParallaxSectionProps) {
  const elementRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    // If user prefers reduced motion, skip parallax effect
    if (prefersReducedMotion) {
      return;
    }

    gsap.to(element, {
      y: () => window.innerHeight * speed,
      ease: "none",
      scrollTrigger: {
        trigger: element,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    });
  }, [speed, prefersReducedMotion]);

  return (
    <div ref={elementRef} className={className}>
      {children}
    </div>
  );
}

// ============================================
// 3. ColorChangeText - Texte qui change de couleur
// ============================================

interface ColorChangeTextProps {
  children: ReactNode;
  fromColor?: string;
  toColor?: string;
  className?: string;
}

export function ColorChangeText({
  children,
  fromColor = "#FFFFFF",
  toColor = "#52D1DC",
  className = "",
}: ColorChangeTextProps) {
  const elementRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    // If user prefers reduced motion, show final color immediately
    if (prefersReducedMotion) {
      gsap.set(element, { color: toColor });
      return;
    }

    gsap.fromTo(
      element,
      { color: fromColor },
      {
        color: toColor,
        scrollTrigger: {
          trigger: element,
          start: "top 70%",
          end: "top 30%",
          scrub: true,
        },
      }
    );
  }, [fromColor, toColor, prefersReducedMotion]);

  return (
    <div ref={elementRef} className={className}>
      {children}
    </div>
  );
}

// ============================================
// 4. ScaleOnScroll - Scale progressif
// ============================================

interface ScaleOnScrollProps {
  children: ReactNode;
  fromScale?: number;
  toScale?: number;
  className?: string;
}

export function ScaleOnScroll({
  children,
  fromScale = 0.8,
  toScale = 1,
  className = "",
}: ScaleOnScrollProps) {
  const elementRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    // If user prefers reduced motion, set final state immediately with no animation
    if (prefersReducedMotion) {
      gsap.set(element, { scale: toScale, opacity: 1 });
      return;
    }

    gsap.fromTo(
      element,
      { scale: fromScale, opacity: 0 },
      {
        scale: toScale,
        opacity: 1,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: element,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      }
    );
  }, [fromScale, toScale, prefersReducedMotion]);

  return (
    <div ref={elementRef} className={className}>
      {children}
    </div>
  );
}

export default ScrollReveal;
