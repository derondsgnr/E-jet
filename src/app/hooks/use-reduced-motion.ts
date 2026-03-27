/**
 * usePrefersReducedMotion — shared hook
 *
 * Extracted from fleet-settings.tsx (P2 debt).
 * Listens to prefers-reduced-motion media query.
 * Returns true when the user prefers reduced motion.
 *
 * Usage:
 *   const rm = usePrefersReducedMotion();
 *   const motion = rm ? {} : { initial: {...}, animate: {...} };
 */

import { useState, useEffect } from "react";

export function usePrefersReducedMotion(): boolean {
  const [prefers, setPrefers] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefers(mq.matches);
    const handler = (e: MediaQueryListEvent) => setPrefers(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return prefers;
}
