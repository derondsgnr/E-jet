 /**
 * GlassPanel — Adaptive surface component.
 *
 * ── DARK MODE ──
 * True glassmorphism: translucent backgrounds, backdrop-blur, subtle
 * luminous borders. Content floats in atmospheric darkness.
 *
 * ── LIGHT MODE ──
 * Apple-grade frosted surfaces. NOT flat white cards.
 * - Subtle translucency (0.72–0.85 opacity) with backdrop-blur
 * - Multi-layer shadow system for depth (not a single generic shadow)
 * - Fine 0.5px borders at very low opacity for crispness
 * - Different shadow intensity per variant to create hierarchy
 *
 * The key insight from Apple: light mode glass is still glass — you see
 * a hint of what's behind it. But the blur is heavier, so text stays
 * perfectly readable. The magic is in the shadow system, not opacity.
 *
 * Variants:
 * - dark:        subtle white glass on dark surfaces
 * - light:       frosted white card with multi-layer shadows
 * - map-dark:    heavier dark glass for readability over map
 * - map-light:   frosted header bar over light map
 * - sheet-light: bottom sheet with directional shadow
 * - chip-dark:   small inline badge/pill on dark
 * - chip-light:  small inline badge/pill on light (visible gray bg)
 */

import { motion, type HTMLMotionProps } from "motion/react";
import { forwardRef, type ReactNode } from "react";

type GlassVariant =
  | "dark"
  | "light"
  | "map-dark"
  | "map-light"
  | "sheet-light"
  | "chip-dark"
  | "chip-light";

interface GlassPanelProps extends Omit<HTMLMotionProps<"div">, "children"> {
  variant?: GlassVariant;
  children: ReactNode;
  className?: string;
  /** Remove border */
  borderless?: boolean;
  /** Blur amount (px) */
  blur?: number;
}

interface VariantStyle {
  bg: string;
  border: string;
  shadow: string;
  blur: boolean;
}

const variantStyles: Record<GlassVariant, VariantStyle> = {
  // ── Dark mode ───────────────────────────────────────────────
  // Translucent glass, luminous border, no shadow
  dark: {
    bg: "rgba(255,255,255, 0.06)",
    border: "1px solid rgba(255,255,255, 0.09)",
    shadow: "none",
    blur: true,
  },

  // ── Light mode ──────────────────────────────────────────────
  // Apple-style frosted surface. Slightly translucent white + blur
  // so the atmospheric background tints through just barely.
  // Multi-layer shadow: ambient (spread) + direct (close) + ring (border).
  light: {
    bg: "rgba(255,255,255, 0.78)",
    border: "0.5px solid rgba(0,0,0, 0.06)",
    shadow: [
      "0 0 0 0.5px rgba(0,0,0, 0.03)", // ring — crispness
      "0 1px 2px rgba(0,0,0, 0.04)", // direct — lift
      "0 4px 16px rgba(0,0,0, 0.04)", // ambient — depth
    ].join(", "),
    blur: true,
  },

  // ── Dark mode map overlay ───────────────────────────────────
  // Heavier glass for headers/overlays on the map
  "map-dark": {
    bg: "rgba(10,10,13, 0.6)",
    border: "1px solid rgba(255,255,255, 0.07)",
    shadow: "none",
    blur: true,
  },

  // ── Light mode header on map ────────────────────────────────
  // Heavily frosted bar. More opaque than content cards.
  // Stronger shadow for "attached to top" feel.
  "map-light": {
    bg: "rgba(255,255,255, 0.82)",
    border: "none",
    shadow: [
      "0 0.5px 0 rgba(0,0,0, 0.04)", // bottom hairline
      "0 4px 12px rgba(0,0,0, 0.05)", // ambient
    ].join(", "),
    blur: true,
  },

  // ── Light mode bottom sheet ─────────────────────────────────
  // Nearly opaque. Strong upward shadow for sheet "rising" feel.
  "sheet-light": {
    bg: "rgba(255,255,255, 0.92)",
    border: "none",
    shadow: [
      "0 -0.5px 0 rgba(0,0,0, 0.04)",
      "0 -4px 20px rgba(0,0,0, 0.06)",
      "0 -1px 3px rgba(0,0,0, 0.03)",
    ].join(", "),
    blur: true,
  },

  // ── Chips (small inline badges) ─────────────────────────────
  "chip-dark": {
    bg: "rgba(255,255,255, 0.06)",
    border: "none",
    shadow: "none",
    blur: false,
  },
  "chip-light": {
    bg: "rgba(11,11,13, 0.04)",
    border: "0.5px solid rgba(0,0,0, 0.04)",
    shadow: "none",
    blur: false,
  },
};

export const GlassPanel = forwardRef<HTMLDivElement, GlassPanelProps>(
  function GlassPanel(
    {
      variant = "dark",
      children,
      className = "",
      borderless = false,
      blur = 20,
      style,
      ...props
    },
    ref
  ) {
    const v = variantStyles[variant];

    return (
      <motion.div
        ref={ref}
        className={className}
        style={{
          background: v.bg,
          backdropFilter: v.blur ? `blur(${blur}px)` : undefined,
          WebkitBackdropFilter: v.blur ? `blur(${blur}px)` : undefined,
          border: borderless ? "none" : v.border,
          boxShadow: borderless ? "none" : v.shadow,
          ...style,
        }}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);
