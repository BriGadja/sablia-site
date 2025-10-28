/**
 * Export centralisé de tous les composants d'animation
 * Permet des imports simplifiés depuis un seul endroit
 *
 * Usage:
 * import {
 *   CustomCursor,
 *   AnimatedParticles,
 *   ScrollReveal,
 *   MagneticButton,
 *   GradientText
 * } from "@/components/animations";
 */

// Curseur custom
export { default as CustomCursor } from "./CustomCursor";

// Particules animées
export { default as AnimatedParticles } from "./AnimatedParticles";

// Animations au scroll (GSAP)
export {
  ScrollReveal,
  ParallaxSection,
  ColorChangeText,
  ScaleOnScroll,
} from "./ScrollReveal";

// Éléments magnétiques
export { MagneticButton, MagneticCard } from "./MagneticElements";

// Effets de texte
export {
  AnimatedText,
  GradientText,
  TypewriterText,
  RevealText,
  FloatingText,
} from "./AnimatedText";
