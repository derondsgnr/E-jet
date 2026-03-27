 /**
 * ============================================================================
 * JET — BRAND CONFIGURATION
 * ============================================================================
 *
 * Jet is a pioneering e-hailing platform combining sustainability with
 * convenience. Diverse fleet of EVs and gas-based vehicles, catering to
 * Nigeria's evolving transportation needs.
 *
 * Positioning: Premium, reliable e-hailing service
 * Personality: Confident, Efficient, Trustworthy, Premium
 *
 * Logo assets:
 *   - SVG (full wordmark): JetLogo component variant="full"
 *   - Icon only (chevrons): JetLogo component variant="icon"
 *   - PNG full: JetLogo component variant="wordmark-png" mode="dark"
 *   - PNG white: JetLogo component variant="wordmark-png" mode="light"
 * ============================================================================
 */

// ---------------------------------------------------------------------------
// Brand Identity
// ---------------------------------------------------------------------------
export const BRAND = {
  name: "JET",
  tagline: "Redefining city mobility",
  description:
    "Premium, reliable e-hailing service combining sustainability with convenience. Diverse fleet of EVs and gas-based vehicles for Nigeria's evolving transportation needs.",
  highlights: [
    "Diverse fleet of EVs and gas-based vehicles",
    "User-friendly mobile app for seamless booking",
    "Competitive pricing with flexible payment options",
    "Emphasis on sustainability and reducing carbon footprint",
  ],
} as const;

// ---------------------------------------------------------------------------
// Brand Colors
// ---------------------------------------------------------------------------
export const BRAND_COLORS = {
  /** Primary green — main brand color */
  green: "#1DB954",
  /** Dark green — secondary brand emphasis, chevron icon */
  greenDark: "#046538",
  /** Black — headlines, primary text, strong UI */
  black: "#0B0B0D",
  /** Light gray — backgrounds, surfaces */
  light: "#F5F5F5",

  /** Green tint scale (50% or less per brand guidelines) */
  green50: "rgba(29, 185, 84, 0.05)",
  green100: "rgba(29, 185, 84, 0.1)",
  green200: "rgba(29, 185, 84, 0.2)",
  green300: "rgba(29, 185, 84, 0.3)",
  green400: "rgba(29, 185, 84, 0.5)",

  /** Semantic colors */
  success: "#1DB954",
  warning: "#F59E0B",
  error: "#D4183D",
  info: "#3B82F6",

  /**
   * Supporting colors, greys, and per-dashboard accents
   * will be explored via references then systemized.
   */
} as const;

// ---------------------------------------------------------------------------
// Typography
// ---------------------------------------------------------------------------
export const TYPOGRAPHY = {
  heading: {
    fontFamily: "'Montserrat', system-ui, -apple-system, sans-serif",
    weights: { medium: 500, semibold: 600 },
    letterSpacing: { h1: "-0.03em", h2: "-0.02em", h3: "-0.02em", h4: "-0.01em" },
    lineHeight: { h1: 1.2, h2: 1.25, h3: 1.3, h4: 1.4 },
  },
  body: {
    fontFamily: "'Manrope', system-ui, -apple-system, sans-serif",
    weights: { regular: 400, medium: 500 },
    letterSpacing: "-0.02em",
    lineHeight: { paragraph: 1.5, ui: 1.4 },
  },
} as const;