import { ReactNode } from "react";
import { motion } from "framer-motion";

/**
 * AnimatedText - 5 types d'effets de texte sophistiqués
 * Exports: AnimatedText, GradientText, TypewriterText, RevealText, FloatingText
 */

// ============================================
// 1. AnimatedText - Apparition mot par mot
// ============================================

interface AnimatedTextProps {
  children: string;
  className?: string;
  staggerDelay?: number;
}

export function AnimatedText({ children, className = "", staggerDelay = 0.1 }: AnimatedTextProps) {
  const words = children.split(" ");

  return (
    <motion.div className={className}>
      {words.map((word, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.6,
            delay: index * staggerDelay,
            ease: "easeOut",
          }}
          className="inline-block mr-[0.25em]"
        >
          {word}
        </motion.span>
      ))}
    </motion.div>
  );
}

// ============================================
// 2. GradientText - Gradient animé
// ============================================

interface GradientTextProps {
  children: ReactNode;
  className?: string;
  colors?: string[];
}

export function GradientText({
  children,
  className = "",
  colors = ["#52D1DC", "#3E92CC", "#52D1DC"],
}: GradientTextProps) {
  return (
    <motion.span
      className={`bg-clip-text text-transparent ${className}`}
      style={{
        backgroundImage: `linear-gradient(90deg, ${colors.join(", ")})`,
        backgroundSize: "200% auto",
      }}
      animate={{
        backgroundPosition: ["0% center", "200% center"],
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: "linear",
      }}
    >
      {children}
    </motion.span>
  );
}

// ============================================
// 3. TypewriterText - Machine à écrire
// ============================================

interface TypewriterTextProps {
  children: string;
  className?: string;
  speed?: number;
}

export function TypewriterText({ children, className = "", speed = 0.05 }: TypewriterTextProps) {
  const letters = children.split("");

  return (
    <motion.div className={className}>
      {letters.map((letter, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: 0.1,
            delay: index * speed,
          }}
        >
          {letter}
        </motion.span>
      ))}
    </motion.div>
  );
}

// ============================================
// 4. RevealText - Révélation avec barre
// ============================================

interface RevealTextProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function RevealText({ children, className = "", delay = 0 }: RevealTextProps) {
  return (
    <div className={`relative inline-block overflow-hidden ${className}`}>
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        transition={{
          duration: 0.8,
          delay,
          ease: [0.33, 1, 0.68, 1], // cubic-bezier
        }}
      >
        {children}
      </motion.div>

      {/* Barre de révélation */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-0.5 bg-v2-cyan"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{
          duration: 0.6,
          delay: delay + 0.2,
          ease: "easeOut",
        }}
        style={{ transformOrigin: "left" }}
      />
    </div>
  );
}

// ============================================
// 5. FloatingText - Flottement
// ============================================

interface FloatingTextProps {
  children: ReactNode;
  className?: string;
  intensity?: number;
  duration?: number;
}

export function FloatingText({
  children,
  className = "",
  intensity = 10,
  duration = 3,
}: FloatingTextProps) {
  return (
    <motion.div
      className={className}
      animate={{
        y: [0, -intensity, 0],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      {children}
    </motion.div>
  );
}

export default AnimatedText;
