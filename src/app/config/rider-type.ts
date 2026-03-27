 /**
 * RIDER_TYPE — Shared typography config for all rider screens.
 *
 * Design rule: Nothing below 12px. Nigerian market readability bump.
 * Mid-range Android screens in bright Lagos sunlight need generous sizing.
 *
 * Mirrors DRIVER_TYPE naming convention for cross-app consistency.
 * GLASS_TYPE stays as the base reference; RIDER_TYPE overrides it in all
 * rider screens with bumped floors.
 *
 * Usage:
 *   import { RIDER_TYPE as RT } from "../../config/rider-type";
 *   <span style={RT.body}>Hello</span>
 *
 * Mapping from GLASS_TYPE:
 *   GLASS_TYPE.caption (11px)  → RT.meta (13px) or RT.metaSmall (12px)
 *   GLASS_TYPE.label (11px)    → RT.label (12px)
 *   GLASS_TYPE.bodySmall (13px)→ RT.bodySmall (14px)
 *   GLASS_TYPE.body (15px)     → RT.body (15px)
 *   GLASS_TYPE.display (28px)  → RT.display (28px)
 *   10px/9px overrides         → RT.metaSmall (12px) minimum
 *   8px EV badge               → RT.badge (10px) — only exception
 */

export const RIDER_TYPE = {
  /** Display heading — hero fare, big numbers. 28px / 600 / heading. */
  display: {
    fontFamily: "var(--font-heading)",
    fontSize: "28px",
    fontWeight: 600,
    letterSpacing: "-0.03em",
    lineHeight: "1.15",
  },
  /** Hero number — wallet balance, total spend. 32px / 700 / heading. */
  hero: {
    fontFamily: "var(--font-heading)",
    fontSize: "32px",
    fontWeight: 700,
    letterSpacing: "-0.04em",
    lineHeight: "1",
  },
  /** Section heading. 18px / 600 / heading. */
  heading: {
    fontFamily: "var(--font-heading)",
    fontSize: "18px",
    fontWeight: 600,
    letterSpacing: "-0.02em",
    lineHeight: "1.3",
  },
  /** Body text — primary content. 15px / 500 / body. */
  body: {
    fontFamily: "var(--font-body)",
    fontSize: "15px",
    fontWeight: 500,
    letterSpacing: "-0.02em",
    lineHeight: "1.4",
  },
  /** Body regular — paragraphs, descriptions. 15px / 400 / body. */
  bodyRegular: {
    fontFamily: "var(--font-body)",
    fontSize: "15px",
    fontWeight: 400,
    letterSpacing: "-0.02em",
    lineHeight: "1.5",
  },
  /** Small body — addresses, route text, card content. 14px / 500 / body. */
  bodySmall: {
    fontFamily: "var(--font-body)",
    fontSize: "14px",
    fontWeight: 500,
    letterSpacing: "-0.02em",
    lineHeight: "1.4",
  },
  /** Meta info — timestamps, durations, counts. 13px / 500 / body. */
  meta: {
    fontFamily: "var(--font-body)",
    fontSize: "13px",
    fontWeight: 500,
    letterSpacing: "-0.02em",
    lineHeight: "1.4",
  },
  /** Small meta — chip text, secondary details. 12px / 500 / body. FLOOR. */
  metaSmall: {
    fontFamily: "var(--font-body)",
    fontSize: "12px",
    fontWeight: 500,
    letterSpacing: "-0.02em",
    lineHeight: "1.4",
  },
  /** Section label — uppercase category headers. 12px / 500 / body. */
  label: {
    fontFamily: "var(--font-body)",
    fontSize: "12px",
    fontWeight: 500,
    letterSpacing: "0.04em",
    lineHeight: "1.4",
    textTransform: "uppercase" as const,
  },
  /** CTA button text. 16px / 600 / heading. */
  cta: {
    fontFamily: "var(--font-heading)",
    fontSize: "16px",
    fontWeight: 600,
    letterSpacing: "-0.02em",
    lineHeight: "1",
  },
  /** Badge text — EV badge, status pills. 10px / 600 / body. Exception to 12px floor. */
  badge: {
    fontFamily: "var(--font-body)",
    fontSize: "10px",
    fontWeight: 600,
    letterSpacing: "-0.01em",
    lineHeight: "1.4",
  },
  /** Status pill — completed/cancelled tags. 11px / 600 / body. */
  statusPill: {
    fontFamily: "var(--font-body)",
    fontSize: "11px",
    fontWeight: 600,
    letterSpacing: "-0.01em",
    lineHeight: "1.4",
  },
} as const;
