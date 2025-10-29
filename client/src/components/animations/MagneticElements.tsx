import { useRef, useState, ReactNode, MouseEvent } from "react";
import { motion, useSpring } from "framer-motion";

/**
 * MagneticElements - Éléments qui suivent le curseur au survol
 * 2 composants: MagneticButton et MagneticCard
 *
 * Utilisent spring physics pour mouvement naturel
 */

// ============================================
// 1. MagneticButton
// ============================================

interface MagneticButtonProps {
  children: ReactNode;
  strength?: number; // 0.1 à 1 (défaut: 0.3)
  className?: string;
  onClick?: () => void;
}

export function MagneticButton({
  children,
  strength = 0.3,
  className = "",
  onClick,
}: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Spring physics pour mouvement fluide
  const x = useSpring(0, { stiffness: 150, damping: 15 });
  const y = useSpring(0, { stiffness: 150, damping: 15 });

  const handleMouseMove = (e: MouseEvent<HTMLButtonElement>) => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = (e.clientX - centerX) * strength;
    const deltaY = (e.clientY - centerY) * strength;

    x.set(deltaX);
    y.set(deltaY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  };

  return (
    <motion.button
      ref={ref}
      className={`relative overflow-hidden ${className}`}
      style={{ x, y }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      whileTap={{ scale: 0.95 }}
    >
      {/* Lueur au survol */}
      {isHovered && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            background:
              "radial-gradient(circle at center, rgba(82, 209, 220, 0.2), transparent 70%)",
          }}
        />
      )}
      {children}
    </motion.button>
  );
}

// ============================================
// 2. MagneticCard
// ============================================

interface MagneticCardProps {
  children: ReactNode;
  glassEffect?: boolean;
  className?: string;
}

export function MagneticCard({ children, glassEffect = false, className = "" }: MagneticCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Springs pour rotation 3D
  const rotateX = useSpring(0, { stiffness: 150, damping: 15 });
  const rotateY = useSpring(0, { stiffness: 150, damping: 15 });

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = e.clientX - centerX;
    const deltaY = e.clientY - centerY;

    // Rotation 3D basée sur position du curseur
    const rotateYValue = (deltaX / rect.width) * 10; // -10 à +10 degrés
    const rotateXValue = -(deltaY / rect.height) * 10;

    rotateX.set(rotateXValue);
    rotateY.set(rotateYValue);
  };

  const handleMouseLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
    setIsHovered(false);
  };

  return (
    <motion.div
      ref={ref}
      className={`relative ${glassEffect ? "backdrop-blur-sm bg-white/5" : ""} ${className}`}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
        perspective: 1000,
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
    >
      {/* Lueur qui suit le curseur */}
      {isHovered && (
        <motion.div
          className="absolute inset-0 pointer-events-none rounded-[inherit]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            background:
              "radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), rgba(82, 209, 220, 0.1), transparent 40%)",
          }}
        />
      )}
      {children}
    </motion.div>
  );
}

export default MagneticButton;
