import { ReactNode } from "react";
import { motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * ScrollReveal - Animation au scroll avec Framer Motion
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
  className?: string;
}

const directionMap = {
  up: { y: 50, x: 0, scale: 1 },
  down: { y: -50, x: 0, scale: 1 },
  left: { y: 0, x: 50, scale: 1 },
  right: { y: 0, x: -50, scale: 1 },
  fade: { y: 0, x: 0, scale: 1 },
  scale: { y: 0, x: 0, scale: 0.8 },
};

export function ScrollReveal({
  children,
  direction = "up",
  duration = 1,
  delay = 0,
  className = "",
}: ScrollRevealProps) {
  const prefersReducedMotion = useReducedMotion();
  const offsets = directionMap[direction];

  return (
    <motion.div
      initial={prefersReducedMotion ? false : { opacity: 0, ...offsets }}
      whileInView={{ opacity: 1, y: 0, x: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
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

export function ParallaxSection({ children, speed = 0.5, className = "" }: ParallaxSectionProps) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ y: 0 }}
      whileInView={{ y: speed * 100 }}
      viewport={{ once: false }}
      transition={{ ease: "linear" }}
      className={className}
    >
      {children}
    </motion.div>
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
  toColor = "#52D1DC",
  className = "",
}: ColorChangeTextProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      initial={prefersReducedMotion ? { color: toColor } : { color: "#FFFFFF" }}
      whileInView={{ color: toColor }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.8 }}
      className={className}
    >
      {children}
    </motion.div>
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
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      initial={prefersReducedMotion ? { scale: toScale, opacity: 1 } : { scale: fromScale, opacity: 0 }}
      whileInView={{ scale: toScale, opacity: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default ScrollReveal;
