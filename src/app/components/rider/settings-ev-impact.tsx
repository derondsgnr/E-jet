 /**
 * EV Impact — Carbon savings dashboard.
 *
 * NORTHSTAR: Apple Fitness rings + Tesla energy stats.
 * Shows cumulative CO₂ saved, EV ride count, equivalencies
 * (trees planted, km of petrol saved), monthly trend.
 */

import { motion } from "motion/react";
import { ArrowLeft, Leaf, TreePine, Droplets, Zap, TrendingUp } from "lucide-react";
import { GLASS_COLORS, GLASS_TYPE, MOTION, type GlassColorMode } from "../../config/project";
import { BRAND_COLORS } from "../../config/brand";

// Mock cumulative EV data
const EV_STATS = {
  totalCO2Kg: 18.7,
  evRides: 42,
  totalEvKm: 156,
  treesEquivalent: 0.9,
  petrolSavedL: 14.2,
  monthlyTrend: [
    { month: "Oct", kg: 2.1 },
    { month: "Nov", kg: 3.4 },
    { month: "Dec", kg: 2.8 },
    { month: "Jan", kg: 4.1 },
    { month: "Feb", kg: 3.9 },
    { month: "Mar", kg: 2.4 },
  ],
};

interface Props {
  colorMode: GlassColorMode;
  onBack: () => void;
}

export function EVImpactScreen({ colorMode, onBack }: Props) {
  const c = GLASS_COLORS[colorMode];
  const d = colorMode === "dark";
  const max = Math.max(...EV_STATS.monthlyTrend.map((m) => m.kg));

  return (
    <div className="h-full flex flex-col" style={{ background: c.bg }}>
      {/* Header */}
      <div className="flex items-center gap-3 px-5 pt-14 pb-3">
        <motion.button
          className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: c.surface.subtle }}
          onClick={onBack}
          whileTap={{ scale: 0.9 }}
        >
          <ArrowLeft className="w-4 h-4" style={{ color: c.icon.secondary }} />
        </motion.button>
        <span style={{ ...GLASS_TYPE.body, fontWeight: 600, color: c.text.primary }}>
          JetEV Impact
        </span>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-24 scrollbar-hide">
        {/* Hero stat */}
        <motion.div
          className="text-center mt-6 mb-2"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3"
            style={{
              background: d ? "rgba(29,185,84,0.1)" : "rgba(29,185,84,0.06)",
              border: `2px solid ${d ? "rgba(29,185,84,0.2)" : "rgba(29,185,84,0.15)"}`,
            }}
          >
            <Leaf className="w-7 h-7" style={{ color: BRAND_COLORS.green }} />
          </div>
          <div className="flex items-baseline justify-center gap-1">
            <span
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "42px",
                fontWeight: 700,
                letterSpacing: "-0.04em",
                lineHeight: "1",
                color: BRAND_COLORS.green,
              }}
            >
              {EV_STATS.totalCO2Kg}
            </span>
            <span
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "18px",
                fontWeight: 600,
                letterSpacing: "-0.02em",
                color: BRAND_COLORS.green,
                opacity: 0.7,
              }}
            >
              kg
            </span>
          </div>
          <span
            className="block mt-1"
            style={{ ...GLASS_TYPE.bodySmall, color: c.text.muted }}
          >
            CO₂ saved across {EV_STATS.evRides} EV rides
          </span>
        </motion.div>

        {/* Equivalencies row */}
        <motion.div
          className="flex gap-2 mt-6 mb-6"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {[
            { icon: TreePine, value: EV_STATS.treesEquivalent.toString(), unit: "trees", label: "equivalent planted" },
            { icon: Droplets, value: `${EV_STATS.petrolSavedL}L`, unit: "", label: "petrol saved" },
            { icon: Zap, value: `${EV_STATS.totalEvKm}`, unit: "km", label: "driven electric" },
          ].map((stat, i) => (
            <div
              key={stat.label}
              className="flex-1 px-3 py-3 rounded-xl text-center"
              style={{
                background: d ? "rgba(29,185,84,0.06)" : "rgba(29,185,84,0.03)",
                border: `1px solid ${d ? "rgba(29,185,84,0.1)" : "rgba(29,185,84,0.06)"}`,
              }}
            >
              <stat.icon
                className="w-4 h-4 mx-auto mb-1.5"
                style={{ color: BRAND_COLORS.green, opacity: 0.7 }}
              />
              <div className="flex items-baseline justify-center gap-0.5">
                <span
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontSize: "16px",
                    fontWeight: 600,
                    letterSpacing: "-0.03em",
                    color: c.text.primary,
                  }}
                >
                  {stat.value}
                </span>
                {stat.unit && (
                  <span style={{ ...GLASS_TYPE.caption, fontSize: "9px", color: c.text.faint }}>
                    {stat.unit}
                  </span>
                )}
              </div>
              <span
                className="block mt-0.5"
                style={{ ...GLASS_TYPE.caption, fontSize: "9px", color: c.text.faint }}
              >
                {stat.label}
              </span>
            </div>
          ))}
        </motion.div>

        {/* Monthly trend bar chart */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center gap-1.5 mb-3">
            <TrendingUp className="w-3 h-3" style={{ color: c.icon.muted }} />
            <span style={{ ...GLASS_TYPE.label, color: c.text.faint }}>Monthly trend</span>
          </div>

          <div
            className="rounded-2xl px-4 py-4"
            style={{ background: c.surface.subtle }}
          >
            <div className="flex items-end gap-3" style={{ height: 120 }}>
              {EV_STATS.monthlyTrend.map((m, i) => {
                const pct = (m.kg / max) * 100;
                const isLast = i === EV_STATS.monthlyTrend.length - 1;
                return (
                  <div key={m.month} className="flex-1 flex flex-col items-center gap-1.5">
                    <span
                      style={{
                        ...GLASS_TYPE.caption,
                        fontSize: "9px",
                        color: isLast ? BRAND_COLORS.green : c.text.faint,
                      }}
                    >
                      {m.kg}
                    </span>
                    <motion.div
                      className="w-full rounded-lg"
                      style={{
                        background: isLast
                          ? BRAND_COLORS.green
                          : (d ? "rgba(29,185,84,0.2)" : "rgba(29,185,84,0.15)"),
                        minHeight: 4,
                      }}
                      initial={{ height: 0 }}
                      animate={{ height: `${Math.max(pct, 5)}%` }}
                      transition={{
                        delay: 0.4 + i * 0.06,
                        type: "spring",
                        stiffness: 300,
                        damping: 25,
                      }}
                    />
                    <span
                      style={{
                        ...GLASS_TYPE.caption,
                        fontSize: "9px",
                        color: isLast ? c.text.secondary : c.text.faint,
                      }}
                    >
                      {m.month}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Motivational note */}
        <motion.p
          className="text-center mt-6 px-6"
          style={{ ...GLASS_TYPE.caption, color: c.text.faint, lineHeight: "1.6" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Every EV ride makes Lagos cleaner. You're in the top 12% of JET riders for carbon savings this quarter.
        </motion.p>
      </div>
    </div>
  );
}
