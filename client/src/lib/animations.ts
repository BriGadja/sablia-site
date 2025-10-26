import { Variants } from "framer-motion";

/**
 * Centralized animation variants for consistency across v2 components
 * All animations respect prefers-reduced-motion automatically (Framer Motion feature)
 */

export const fadeInUp: Variants = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, ease: "easeOut" }
};

export const staggerContainer: Variants = {
  initial: {},
  whileInView: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1
    }
  },
  viewport: { once: true }
};

export const fadeInStagger: Variants = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: "easeOut" }
};

export const buttonHover = {
  whileHover: {
    scale: 1.02,
    boxShadow: "0 10px 40px rgba(82, 209, 220, 0.3)",
    transition: { duration: 0.2 }
  },
  whileTap: {
    scale: 0.98,
    transition: { duration: 0.1 }
  }
};

export const cardHover = {
  whileHover: {
    y: -4,
    boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)",
    transition: { duration: 0.2 }
  }
};

// Scroll indicator bounce animation (infini)
export const scrollIndicator = {
  animate: {
    y: [0, 10, 0]
  },
  transition: {
    duration: 1.5,
    repeat: Infinity,
    ease: "easeInOut"
  }
};
