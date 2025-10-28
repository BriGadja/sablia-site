import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

/**
 * CustomCursor - Curseur personnalisé lumineux avec traînée
 * Inspiré de chatflowai.co et sites Awwwards
 *
 * Composé de 2 layers:
 * 1. Point principal (petit, cyan, mix-blend-difference)
 * 2. Lueur diffuse (gradient radial avec blur)
 *
 * Performance: GPU-accelerated (transform only)
 * Responsive: Caché sur mobile (lg: breakpoint)
 */
export default function CustomCursor() {
  const [isVisible, setIsVisible] = useState(false);

  // Position du curseur avec MotionValues pour performance optimale
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // Spring physics pour mouvement fluide et naturel
  const springConfig = { damping: 25, stiffness: 150, mass: 0.5 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const hideCursor = () => setIsVisible(false);

    window.addEventListener("mousemove", moveCursor);
    window.addEventListener("mouseleave", hideCursor);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("mouseleave", hideCursor);
    };
  }, [cursorX, cursorY, isVisible]);

  if (!isVisible) return null;

  return (
    <>
      {/* Layer 1: Point principal */}
      <motion.div
        className="fixed top-0 left-0 w-3 h-3 bg-v2-cyan rounded-full pointer-events-none z-[9999]"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          translateX: "-50%",
          translateY: "-50%",
          mixBlendMode: "difference",
        }}
      />

      {/* Layer 2: Lueur diffuse */}
      <motion.div
        className="fixed top-0 left-0 w-32 h-32 pointer-events-none z-[9997]"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          translateX: "-50%",
          translateY: "-50%",
          background: "radial-gradient(circle, rgba(82, 209, 220, 0.15) 0%, transparent 70%)",
          filter: "blur(20px)",
        }}
      />
    </>
  );
}
