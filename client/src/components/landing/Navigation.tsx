import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Navigation - Header style kriss.ai avec logo séparé et capsule nav
 *
 * Structure:
 * - Logo "Sablia" en haut-gauche (fixed, séparé)
 * - Capsule nav en haut-droite avec glassmorphism
 * - Indicateurs animés (opacity: 0 par défaut, visible au hover/focus)
 * - Support clavier et prefers-reduced-motion
 */

interface IndicatorState {
  left: number;
  width: number;
  opacity: number;
}

export default function Navigation() {
  const [, setLocation] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);

  // Refs for animation
  const capsuleRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<(HTMLAnchorElement | HTMLButtonElement | null)[]>([]);
  const underlineRef = useRef<HTMLDivElement>(null);

  // Animation state
  const currentRef = useRef<IndicatorState>({ left: 0, width: 0, opacity: 0 });
  const targetRef = useRef<IndicatorState>({ left: 0, width: 0, opacity: 0 });
  const rafRef = useRef<number>();

  // Check prefers-reduced-motion
  const prefersReducedMotion = useRef(
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  // Close mobile menu on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsMobileMenuOpen(false);
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, []);

  const menuItems = [
    { label: "Problématique", href: "#problem", type: "anchor" as const },
    { label: "Solution", href: "#solution", type: "anchor" as const },
    { label: "Processus", href: "#process", type: "anchor" as const },
    { label: "Tarifs", href: "#pricing", type: "anchor" as const },
    { label: "FAQ", href: "#faq", type: "anchor" as const },
    { label: "GAP", href: "/gap", type: "route" as const },
    { label: "À propos", href: "/about", type: "route" as const },
  ];

  const handleNavClick = (href: string, type: "anchor" | "route") => {
    setIsMobileMenuOpen(false);

    if (type === "route") {
      // Navigate to route
      setLocation(href);
    } else {
      // Smooth scroll to section
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  // Lerp function for smooth animation
  const lerp = (start: number, end: number, factor: number) => {
    return start + (end - start) * factor;
  };

  // Update target position based on hover/focus
  useEffect(() => {
    if (!capsuleRef.current) return;

    const capsuleRect = capsuleRef.current.getBoundingClientRect();
    const activeIndex = hoveredIndex !== null ? hoveredIndex : focusedIndex;

    if (activeIndex === null) {
      // No hover/focus: hide underline
      targetRef.current = { left: 0, width: 0, opacity: 0 };
    } else {
      // Hover/focus: show underline under the item
      const link = linksRef.current[activeIndex];
      if (link) {
        const linkRect = link.getBoundingClientRect();
        const leftPosition = linkRect.left - capsuleRect.left;
        const width = linkRect.width;

        targetRef.current = { left: leftPosition, width, opacity: 1 };
      }
    }
  }, [hoveredIndex, focusedIndex]);

  // Animation loop with lerp
  useEffect(() => {
    const animate = () => {
      const lerpFactor = prefersReducedMotion.current ? 1 : 0.15;

      // Lerp underline
      currentRef.current.left = lerp(
        currentRef.current.left,
        targetRef.current.left,
        lerpFactor
      );
      currentRef.current.width = lerp(
        currentRef.current.width,
        targetRef.current.width,
        lerpFactor
      );
      currentRef.current.opacity = lerp(
        currentRef.current.opacity,
        targetRef.current.opacity,
        lerpFactor
      );

      // Update DOM
      if (underlineRef.current) {
        underlineRef.current.style.transform = `translateX(${currentRef.current.left}px)`;
        underlineRef.current.style.width = `${currentRef.current.width}px`;
        underlineRef.current.style.opacity = `${currentRef.current.opacity}`;
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  // Handle capsule mouse leave: reset indicators
  const handleCapsuleLeave = () => {
    setHoveredIndex(null);
  };

  return (
    <>
      {/* Logo séparé - top left */}
      <Link
        href="/"
        className="fixed top-6 left-6 z-50 text-2xl font-bold text-white hover:text-v2-cyan transition-colors"
      >
        Sablia
      </Link>

      {/* Capsule nav - top right (desktop) */}
      <nav
        onMouseLeave={handleCapsuleLeave}
        className="hidden md:block fixed top-6 right-6 z-50"
      >
        <div
          ref={capsuleRef}
          className={cn(
            "relative px-4 py-3 rounded-[24px]",
            "bg-white/10 backdrop-blur-[10px]",
            "border border-white/20",
            "shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_2px_8px_rgba(0,0,0,0.1)]"
          )}
        >
          {/* Underline indicator */}
          <div
            ref={underlineRef}
            className="absolute bottom-0 left-0 h-[2px] bg-white rounded-full pointer-events-none will-change-transform"
            style={{
              transformOrigin: "left",
              opacity: 0,
            }}
          />

          <div className="flex items-center gap-1 relative">

            {/* Menu Items */}
            {menuItems.map((item, index) => (
              <button
                key={item.href}
                ref={(el) => (linksRef.current[index] = el)}
                onClick={() => handleNavClick(item.href, item.type)}
                onMouseEnter={() => setHoveredIndex(index)}
                onFocus={() => setFocusedIndex(index)}
                onBlur={() => setFocusedIndex(null)}
                className={cn(
                  "px-4 py-2 text-sm font-medium transition-colors relative",
                  "text-white/70 hover:text-white focus:text-white",
                  "focus:outline-none focus-visible:text-white"
                )}
                aria-label={`Aller à la section ${item.label}`}
              >
                {item.label}
              </button>
            ))}

            {/* CTA Button - inside capsule, aligned right */}
            <button
              ref={(el) => (linksRef.current[menuItems.length] = el)}
              onClick={() => handleNavClick("#contact", "anchor")}
              onMouseEnter={() => setHoveredIndex(menuItems.length)}
              onFocus={() => setFocusedIndex(menuItems.length)}
              onBlur={() => setFocusedIndex(null)}
              className={cn(
                "ml-2 px-5 py-2 rounded-xl text-sm font-medium transition-all",
                "bg-black text-white",
                "hover:bg-black/90",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
              )}
              aria-label="Réserver un diagnostic gratuit"
            >
              Diagnostic Gratuit
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile: Logo + Hamburger */}
      <div className="md:hidden fixed top-6 left-6 right-6 z-50 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-white hover:text-v2-cyan transition-colors">
          Sablia
        </Link>

        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className={cn(
            "p-3 rounded-xl text-white transition-all min-h-[48px] min-w-[48px]",
            "bg-white/10 backdrop-blur-[10px]",
            "border border-white/20"
          )}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-v2-navy/95 backdrop-blur-md z-30 md:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-20 right-0 bottom-0 w-full max-w-sm bg-v2-navy border-l border-v2-electric/20 z-40 md:hidden"
            >
              <div className="flex flex-col p-6 space-y-6">
                {/* Menu Items */}
                {menuItems.map((item, index) => (
                  <motion.button
                    key={item.href}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => handleNavClick(item.href, item.type)}
                    className="text-left text-xl text-white hover:text-v2-cyan transition-colors font-medium"
                    aria-label={`Aller à la section ${item.label}`}
                  >
                    {item.label}
                  </motion.button>
                ))}

                {/* CTA Button */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: menuItems.length * 0.05 }}
                >
                  <button
                    onClick={() => handleNavClick("#contact", "anchor")}
                    className={cn(
                      "block w-full px-6 py-3 text-center rounded-lg font-medium transition-all",
                      "bg-black text-white",
                      "hover:bg-black/90"
                    )}
                    aria-label="Réserver un diagnostic gratuit"
                  >
                    Diagnostic Gratuit
                  </button>
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
