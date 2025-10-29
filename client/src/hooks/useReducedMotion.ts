import { useEffect, useState } from "react";

/**
 * useReducedMotion Hook
 *
 * Detects if the user has enabled "prefers-reduced-motion" in their OS settings
 * and provides a boolean value that components can use to disable or simplify animations.
 *
 * Usage:
 * ```typescript
 * const prefersReducedMotion = useReducedMotion();
 *
 * <motion.div
 *   initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 20 }}
 *   animate={{ opacity: 1, y: 0 }}
 *   transition={{ duration: prefersReducedMotion ? 0 : 0.6 }}
 * />
 * ```
 *
 * Standards Compliance:
 * - WCAG 2.1 Success Criterion 2.3.3 (Level AAA)
 * - WCAG 2.1 Success Criterion 2.2.2 (Level A)
 * - Respects user preferences for reduced motion
 */
export function useReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => {
    // Check if window is defined (SSR safety)
    if (typeof window === "undefined") return false;

    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  useEffect(() => {
    // Media query for reduced motion preference
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    // Handler for media query changes
    const listener = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    // Add event listener for dynamic updates
    mediaQuery.addEventListener("change", listener);

    // Cleanup
    return () => mediaQuery.removeEventListener("change", listener);
  }, []);

  return prefersReducedMotion;
}
