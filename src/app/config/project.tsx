 /**
 * ============================================================================
 * JET E-HAILING PLATFORM — PROJECT CONFIGURATION
 * ============================================================================
 *
 * North Star References:
 *   Apple    — Hardware-level polish, spatial clarity, purposeful motion
 *   Linear   — Information density done right, keyboard-first, scaling across viewports
 *   Luma     — Warmth in minimal UI, beautiful event/social patterns
 *   Airbnb   — Trust through transparency, progressive disclosure, e2e UX
 *   Framer   — Fluid motion, canvas-aware design, creative tooling
 *   Vercel   — Developer-grade clarity, monochrome confidence, speed
 *   Figma    — Collaborative craft, component architecture, multiplayer
 *
 * Design System Base: Vercel (light + dark) + shadcn/ui
 * Typography: Montserrat (headlines) + Manrope (body)
 * ============================================================================
 */

// ---------------------------------------------------------------------------
// User Types — Each gets a dedicated dashboard experience
// ---------------------------------------------------------------------------
export const USER_TYPES = {
  RIDER: "rider",
  DRIVER: "driver",
  FLEET_OWNER: "fleet-owner",
  HOTEL: "hotel",
  ADMIN: "admin",
} as const;

export type UserType = (typeof USER_TYPES)[keyof typeof USER_TYPES];

// ---------------------------------------------------------------------------
// Platform surfaces
// ---------------------------------------------------------------------------
export const SURFACES = {
  /** Public-facing website + landing pages */
  WEBSITE: "website",
  /** Rider mobile app */
  RIDER_APP: "rider-app",
  /** Driver mobile app */
  DRIVER_APP: "driver-app",
  /** Fleet owner web dashboard */
  FLEET_DASHBOARD: "fleet-dashboard",
  /** Hotel partner web dashboard */
  HOTEL_DASHBOARD: "hotel-dashboard",
  /** Admin web dashboard */
  ADMIN_DASHBOARD: "admin-dashboard",
} as const;

// ---------------------------------------------------------------------------
// Breakpoints — Matches Tailwind defaults
// ---------------------------------------------------------------------------
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
} as const;

// ---------------------------------------------------------------------------
// Animation config — Intentional, delightful motion
// ---------------------------------------------------------------------------
export const MOTION = {
  /** Micro-interactions: button press, toggle, checkbox (120-150ms) */
  micro: { duration: 0.12, ease: [0.25, 0.1, 0.25, 1] },
  /** Standard transitions: panel open, nav slide, card expand (200-250ms) */
  standard: { duration: 0.22, ease: [0.16, 1, 0.3, 1] },
  /** Emphasis: page transitions, modals, onboarding steps (300-400ms) */
  emphasis: { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
  /** Spring for playful elements (mobile gestures, bouncy) */
  spring: { type: "spring" as const, stiffness: 400, damping: 30 },
  /** Stagger delay between items in lists/grids (30-50ms) */
  stagger: 0.04,
} as const;

// ---------------------------------------------------------------------------
// Z-index scale
// ---------------------------------------------------------------------------
export const Z = {
  base: 0,
  dropdown: 10,
  sticky: 20,
  overlay: 30,
  modal: 40,
  popover: 50,
  toast: 60,
  tooltip: 70,
} as const;

// ---------------------------------------------------------------------------
// Glass semantic color tokens — Mode-aware opacity palette
// ---------------------------------------------------------------------------
// These map semantic roles to the correct rgba values for dark/light glass
// surfaces. Used across all Rider screens that follow the C spine.
//
// Usage: const c = GLASS_COLORS[colorMode];
//        style={{ color: c.text.primary }}
// ---------------------------------------------------------------------------
export const GLASS_COLORS = {
  dark: {
    text: {
      /** High-emphasis text — titles, names (0.85–0.9 white) */
      primary: "rgba(255,255,255,0.85)",
      /** Medium-emphasis — active nav, strong labels (0.6 white) */
      secondary: "rgba(255,255,255,0.6)",
      /** Mid-emphasis — fare text, interactive labels (0.45 white) */
      secondaryStrong: "rgba(255,255,255,0.45)",
      /** Low-emphasis — secondary info, chip text (0.4–0.45 white) */
      tertiary: "rgba(255,255,255,0.4)",
      /** De-emphasized — placeholders, meta (0.3–0.35 white) */
      muted: "rgba(255,255,255,0.3)",
      /** Barely visible — section labels, hints (0.25 white) */
      faint: "rgba(255,255,255,0.25)",
      /** Ghost — empty state icons/text (0.2 white) */
      ghost: "rgba(255,255,255,0.2)",
      /** Display headline primary */
      display: "rgba(255,255,255,0.9)",
      /** Display headline secondary (faded line) */
      displayFaded: "rgba(255,255,255,0.35)",
      /** Slightly elevated primary — quick-access card names (0.8 white) */
      primarySoft: "rgba(255,255,255,0.8)",
    },
    icon: {
      primary: "rgba(255,255,255,0.6)",
      secondary: "rgba(255,255,255,0.45)",
      tertiary: "rgba(255,255,255,0.4)",
      muted: "rgba(255,255,255,0.35)",
    },
    surface: {
      /** Subtle background — icon containers, inactive chips */
      subtle: "rgba(255,255,255,0.06)",
      /** Slightly raised — buttons, action containers */
      raised: "rgba(255,255,255,0.08)",
      /** Hover/active state */
      hover: "rgba(255,255,255,0.1)",
      /** Button/action background */
      button: "rgba(255,255,255,0.06)",
    },
    green: {
      /** Green-tinted surface — saved icons, EV containers */
      tint: "rgba(29,185,84,0.12)",
      /** EV badge background */
      evBg: "rgba(29,185,84,0.1)",
      /** EV badge text */
      evText: "rgba(29,185,84,0.7)",
    },
    /** Root background */
    bg: "#0B0B0D",
  },
  light: {
    text: {
      primary: "rgba(11,11,13,0.88)",
      secondary: "rgba(11,11,13,0.6)",
      secondaryStrong: "rgba(11,11,13,0.55)",
      tertiary: "rgba(11,11,13,0.5)",
      muted: "rgba(11,11,13,0.45)",
      faint: "rgba(11,11,13,0.35)",
      ghost: "rgba(11,11,13,0.2)",
      display: "#0B0B0D",
      displayFaded: "rgba(11,11,13,0.3)",
      primarySoft: "rgba(11,11,13,0.85)",
    },
    icon: {
      primary: "rgba(11,11,13,0.55)",
      secondary: "rgba(11,11,13,0.4)",
      tertiary: "rgba(11,11,13,0.4)",
      muted: "rgba(11,11,13,0.35)",
    },
    surface: {
      subtle: "rgba(11,11,13,0.04)",
      raised: "rgba(11,11,13,0.06)",
      hover: "rgba(11,11,13,0.08)",
      button: "rgba(11,11,13,0.05)",
    },
    green: {
      tint: "rgba(29,185,84,0.08)",
      evBg: "rgba(29,185,84,0.06)",
      evText: "rgba(4,101,56,0.7)",
    },
    bg: "#FAFAFA",
  },
} as const;

export type GlassColorMode = keyof typeof GLASS_COLORS;

// ---------------------------------------------------------------------------
// Glass typography presets — Reusable inline style objects
// ---------------------------------------------------------------------------
// These encode the C spine's typographic hierarchy as composable presets.
// Fonts reference CSS vars so they stay in sync with theme.css.
//
// Usage: style={{ ...GLASS_TYPE.body, color: c.text.primary }}
// ---------------------------------------------------------------------------
export const GLASS_TYPE = {
  /** Display heading — 28px Montserrat 600, tight leading */
  display: {
    fontFamily: "var(--font-heading)",
    fontSize: "28px",
    fontWeight: 600,
    letterSpacing: "-0.03em",
    lineHeight: "1.15",
  },
  /** Body text — 15px Manrope 500 */
  body: {
    fontFamily: "var(--font-body)",
    fontSize: "15px",
    fontWeight: 500,
    letterSpacing: "-0.02em",
    lineHeight: "1.4",
  },
  /** Body regular — 15px Manrope 400 */
  bodyRegular: {
    fontFamily: "var(--font-body)",
    fontSize: "15px",
    fontWeight: 400,
    letterSpacing: "-0.02em",
    lineHeight: "1.5",
  },
  /** Small text — 14px Manrope 500 */
  small: {
    fontFamily: "var(--font-body)",
    fontSize: "14px",
    fontWeight: 500,
    letterSpacing: "-0.02em",
    lineHeight: "1.4",
  },
  /** Secondary body — 13px Manrope 500 */
  bodySmall: {
    fontFamily: "var(--font-body)",
    fontSize: "13px",
    fontWeight: 500,
    letterSpacing: "-0.02em",
    lineHeight: "1.4",
  },
  /** Secondary body regular — 13px Manrope 400 */
  bodySmallRegular: {
    fontFamily: "var(--font-body)",
    fontSize: "13px",
    fontWeight: 400,
    letterSpacing: "-0.02em",
    lineHeight: "1.4",
  },
  /** Caption / chip text — 11px Manrope 500 */
  caption: {
    fontFamily: "var(--font-body)",
    fontSize: "11px",
    fontWeight: 500,
    letterSpacing: "-0.02em",
    lineHeight: "1.4",
  },
  /** Section label — 11px Manrope 500, uppercase, wide tracking */
  label: {
    fontFamily: "var(--font-body)",
    fontSize: "11px",
    fontWeight: 500,
    letterSpacing: "0.05em",
    lineHeight: "1.4",
    textTransform: "uppercase" as const,
  },
} as const;