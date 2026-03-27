 /**
 * CarbonSummaryCard — 3 design explorations for the saved places carbon stat.
 *
 * A: "Metric Strip" — Vercel/Linear: three tight metric cells in a row
 * B: "Ring" — Apple Health: semi-circular progress toward a goal
 * C: "Atmospheric" — Luma/Airbnb: tall hero card with gradient + contextual comparison
 *
 * Usage: <CarbonSummaryCard variant="A" ... />
 */

import { motion } from "motion/react";
import { Leaf, TreePine, TrendingUp, MapPin, Zap } from "lucide-react";
import {
  GLASS_COLORS,
  GLASS_TYPE,
  MOTION,
  type GlassColorMode,
} from "../../config/project";
import { BRAND_COLORS } from "../../config/brand";
import { GlassPanel } from "./glass-panel";

export type CarbonVariant = "A" | "B" | "C";

interface CarbonSummaryCardProps {
  colorMode: GlassColorMode;
  variant: CarbonVariant;
  totalCarbonKg: number;
  totalTrips: number;
  totalPlaces: number;
}

export function CarbonSummaryCard({
  colorMode,
  variant,
  totalCarbonKg,
  totalTrips,
  totalPlaces,
}: CarbonSummaryCardProps) {
  const d = colorMode === "dark";
  const c = GLASS_COLORS[colorMode];

  /* ── A: "Metric Strip" — Vercel/Linear ── */
  if (variant === "A") {
    const metrics = [
      { value: `${totalCarbonKg}`, unit: "kg", label: "CO₂ saved", icon: Leaf, accent: true },
      { value: `${totalTrips}`, unit: "", label: "EV trips", icon: Zap, accent: false },
      { value: `${totalPlaces}`, unit: "", label: "Places", icon: MapPin, accent: false },
    ];

    return (
      <motion.div
        className="flex gap-2"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...MOTION.standard, delay: 0.1 }}
      >
        {metrics.map(({ value, unit, label, icon: Icon, accent }, i) => (
          <div
            key={label}
            className="flex-1 px-3 py-3 rounded-xl"
            style={{
              background: accent
                ? d ? "rgba(29,185,84,0.08)" : "rgba(29,185,84,0.04)"
                : c.surface.subtle,
              border: accent
                ? `1px solid rgba(29,185,84,${d ? "0.12" : "0.08"})`
                : `1px solid transparent`,
            }}
          >
            <Icon
              className="w-3 h-3 mb-1.5"
              style={{ color: accent ? BRAND_COLORS.green : c.icon.muted }}
            />
            <div className="flex items-baseline gap-0.5">
              <span
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: "18px",
                  fontWeight: 600,
                  letterSpacing: "-0.03em",
                  lineHeight: "1.1",
                  color: accent ? BRAND_COLORS.green : c.text.primary,
                }}
              >
                {value}
              </span>
              {unit && (
                <span
                  style={{
                    ...GLASS_TYPE.caption,
                    fontSize: "10px",
                    color: accent ? BRAND_COLORS.green : c.text.muted,
                  }}
                >
                  {unit}
                </span>
              )}
            </div>
            <span
              style={{
                ...GLASS_TYPE.caption,
                fontSize: "10px",
                color: c.text.faint,
                display: "block",
                marginTop: "2px",
              }}
            >
              {label}
            </span>
          </div>
        ))}
      </motion.div>
    );
  }

  /* ── B: "Ring" — Apple Health ── */
  if (variant === "B") {
    const goal = 10; // kg goal
    const pct = Math.min(1, totalCarbonKg / goal);
    const radius = 36;
    const circumference = 2 * Math.PI * radius;
    const arcLength = circumference * 0.75; // 270° arc
    const dashOffset = arcLength * (1 - pct);

    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...MOTION.standard, delay: 0.1 }}
      >
        <GlassPanel
          variant={d ? "dark" : "light"}
          blur={16}
          className="rounded-2xl px-5 py-4"
        >
          <div className="flex items-center gap-5">
            {/* Ring */}
            <div className="relative w-20 h-20 shrink-0">
              <svg className="w-full h-full" viewBox="0 0 80 80">
                {/* Background arc */}
                <circle
                  cx="40"
                  cy="40"
                  r={radius}
                  fill="none"
                  stroke={d ? "rgba(255,255,255,0.06)" : "rgba(11,11,13,0.04)"}
                  strokeWidth="5"
                  strokeDasharray={`${arcLength} ${circumference}`}
                  strokeDashoffset="0"
                  strokeLinecap="round"
                  transform="rotate(135 40 40)"
                />
                {/* Progress arc */}
                <motion.circle
                  cx="40"
                  cy="40"
                  r={radius}
                  fill="none"
                  stroke={BRAND_COLORS.green}
                  strokeWidth="5"
                  strokeDasharray={`${arcLength} ${circumference}`}
                  strokeLinecap="round"
                  transform="rotate(135 40 40)"
                  initial={{ strokeDashoffset: arcLength }}
                  animate={{ strokeDashoffset: dashOffset }}
                  transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
                  style={{ filter: `drop-shadow(0 0 6px ${BRAND_COLORS.green}40)` }}
                />
              </svg>
              {/* Center number */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontSize: "17px",
                    fontWeight: 600,
                    letterSpacing: "-0.03em",
                    lineHeight: "1",
                    color: BRAND_COLORS.green,
                  }}
                >
                  {totalCarbonKg}
                </span>
                <span
                  style={{
                    ...GLASS_TYPE.caption,
                    fontSize: "8px",
                    color: c.text.muted,
                    marginTop: "1px",
                  }}
                >
                  kg CO₂
                </span>
              </div>
            </div>

            {/* Info */}
            <div className="flex-1">
              <span
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: "14px",
                  fontWeight: 600,
                  letterSpacing: "-0.02em",
                  lineHeight: "1.3",
                  color: c.text.primary,
                }}
              >
                Carbon offset goal
              </span>
              <div
                className="mt-1 flex items-center gap-1"
                style={{ ...GLASS_TYPE.caption, color: c.text.muted }}
              >
                <span>{Math.round(pct * 100)}% of {goal}kg monthly goal</span>
              </div>
              <div className="flex items-center gap-3 mt-2.5">
                <div className="flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" style={{ color: BRAND_COLORS.green }} />
                  <span style={{ ...GLASS_TYPE.caption, fontSize: "10px", color: BRAND_COLORS.green }}>
                    {totalTrips} trips
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" style={{ color: c.icon.muted }} />
                  <span style={{ ...GLASS_TYPE.caption, fontSize: "10px", color: c.text.faint }}>
                    {totalPlaces} places
                  </span>
                </div>
              </div>
            </div>
          </div>
        </GlassPanel>
      </motion.div>
    );
  }

  /* ── C: "Atmospheric" — Luma/Airbnb ── */
  const treeDays = Math.round(totalCarbonKg / 0.022); // a tree absorbs ~22g/day

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...MOTION.standard, delay: 0.1 }}
    >
      <div
        className="relative rounded-2xl overflow-hidden px-5 py-5"
        style={{
          background: d
            ? "linear-gradient(135deg, rgba(29,185,84,0.1) 0%, rgba(4,101,56,0.08) 50%, rgba(11,11,13,0.4) 100%)"
            : "linear-gradient(135deg, rgba(29,185,84,0.06) 0%, rgba(29,185,84,0.02) 50%, rgba(250,250,250,0.4) 100%)",
          border: `1px solid rgba(29,185,84,${d ? "0.12" : "0.08"})`,
        }}
      >
        {/* Subtle noise overlay */}
        <div
          className="absolute inset-0 z-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          }}
        />

        <div className="relative z-10">
          {/* Top row: icon + label */}
          <div className="flex items-center gap-2 mb-3">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: d ? "rgba(29,185,84,0.15)" : "rgba(29,185,84,0.1)" }}
            >
              <Leaf className="w-3.5 h-3.5" style={{ color: BRAND_COLORS.green }} />
            </div>
            <span style={{ ...GLASS_TYPE.label, color: BRAND_COLORS.green }}>
              Your green impact
            </span>
          </div>

          {/* Hero number */}
          <div className="flex items-baseline gap-2 mb-1.5">
            <span
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "34px",
                fontWeight: 600,
                letterSpacing: "-0.04em",
                lineHeight: "1",
                color: c.text.display,
              }}
            >
              {totalCarbonKg}
            </span>
            <span
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "16px",
                fontWeight: 600,
                letterSpacing: "-0.02em",
                lineHeight: "1",
                color: c.text.muted,
              }}
            >
              kg CO₂ saved
            </span>
          </div>

          {/* Contextual comparison */}
          <div className="flex items-center gap-1.5 mb-4">
            <TreePine className="w-3 h-3" style={{ color: c.text.faint }} />
            <span style={{ ...GLASS_TYPE.caption, color: c.text.muted }}>
              That's what {treeDays} trees absorb in a day
            </span>
          </div>

          {/* Bottom metric row */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <Zap className="w-3 h-3" style={{ color: BRAND_COLORS.green }} />
              <span style={{ ...GLASS_TYPE.caption, color: c.text.secondary }}>
                {totalTrips} EV trips
              </span>
            </div>
            <div className="w-px h-3" style={{ background: c.surface.hover }} />
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3 h-3" style={{ color: c.icon.muted }} />
              <span style={{ ...GLASS_TYPE.caption, color: c.text.secondary }}>
                {totalPlaces} saved places
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
