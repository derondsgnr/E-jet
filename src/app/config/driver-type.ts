 /**
 * DRIVER_TYPE — Shared typography config for all driver screens.
 *
 * Design rule: Nothing below 13px. Hero numbers at 44px+.
 * Optimized for arm's-length glanceability in Lagos traffic/sunlight.
 *
 * Usage:
 *   import { DRIVER_TYPE } from "../../config/driver-type";
 *   <span style={DRIVER_TYPE.hero}>₦24,500</span>
 *
 * Every driver screen must import from here. No inline font overrides.
 */

export const DRIVER_TYPE = {
  /** Hero numbers — balance, big earnings. 44px / 700 / heading. */
  hero: {
    fontFamily: "var(--font-heading)",
    fontSize: "44px",
    fontWeight: 700,
    letterSpacing: "-0.03em",
    lineHeight: "1.05",
  },
  /** Hero unit — "today", "this week" below hero. 16px / 500 / body. */
  heroUnit: {
    fontFamily: "var(--font-body)",
    fontSize: "16px",
    fontWeight: 500,
    letterSpacing: "-0.02em",
    lineHeight: "1.4",
  },
  /** Section headings, screen titles. 18px / 600 / heading. */
  heading: {
    fontFamily: "var(--font-heading)",
    fontSize: "18px",
    fontWeight: 600,
    letterSpacing: "-0.02em",
    lineHeight: "1.3",
  },
  /** Sub-headings, card titles. 15px / 600 / body. */
  label: {
    fontFamily: "var(--font-body)",
    fontSize: "15px",
    fontWeight: 600,
    letterSpacing: "-0.02em",
    lineHeight: "1.4",
  },
  /** Secondary content — addresses, descriptions. 14px / 500 / body. */
  secondary: {
    fontFamily: "var(--font-body)",
    fontSize: "14px",
    fontWeight: 500,
    letterSpacing: "-0.02em",
    lineHeight: "1.4",
  },
  /** Meta info — timestamps, small details. 13px / 500 / body. FLOOR. */
  meta: {
    fontFamily: "var(--font-body)",
    fontSize: "13px",
    fontWeight: 500,
    letterSpacing: "-0.02em",
    lineHeight: "1.4",
  },
  /** CTA buttons. 17px / 600 / heading. */
  cta: {
    fontFamily: "var(--font-heading)",
    fontSize: "17px",
    fontWeight: 600,
    letterSpacing: "-0.02em",
    lineHeight: "1",
  },
  /** Stat values — trip counts, hours, distances. 20px / 700 / heading. */
  stat: {
    fontFamily: "var(--font-heading)",
    fontSize: "20px",
    fontWeight: 700,
    letterSpacing: "-0.03em",
    lineHeight: "1.2",
  },
  /** Stat labels — below stat values. 13px / 500 / body. */
  statLabel: {
    fontFamily: "var(--font-body)",
    fontSize: "13px",
    fontWeight: 500,
    letterSpacing: "-0.01em",
    lineHeight: "1.4",
  },
} as const;
