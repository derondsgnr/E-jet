/**
 * Driver Earnings Home — Variation A: "Command Center"
 *
 * Linear/Vercel DNA — Map-dominant, information-dense, compact.
 *
 * Layout:
 *   - Full-bleed MapCanvas with demand zone overlays
 *   - GlassPanel top bar: JET logo + online status + driver avatar
 *   - Floating compact earnings strip (one line of dense data)
 *   - Demand zone indicators on map
 *   - Online/Offline weighted toggle at bottom
 *   - Offline: earnings expand upward with daily summary
 *
 * C spine materials maintained: GlassPanel, MapCanvas, ambient glows,
 * noise texture, typography hierarchy, green-as-scalpel.
 */

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Power,
  TrendingUp,
  Zap,
  ChevronUp,
  Star,
} from "lucide-react";
import {
  GLASS_COLORS,
  GLASS_TYPE,
  MOTION,
  type GlassColorMode,
} from "../../config/project";
import { BRAND_COLORS } from "../../config/brand";
import { MapCanvas } from "../rider/map-canvas";
import { GlassPanel } from "../rider/glass-panel";
import { JetLogo } from "../brand/jet-logo";
import {
  DRIVER_PROFILE,
  TODAY_EARNINGS,
  WEEKLY_EARNINGS,
  DEMAND_ZONES,
  RECENT_TRIPS,
  formatNaira,
  formatHours,
  getDemandColor,
} from "./driver-data";

const DRIVER_AVATAR =
  "https://images.unsplash.com/photo-1634805211765-4ada7b686dd2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZnJpY2FuJTIwbWFuJTIwZHJpdmVyJTIwcHJvZmVzc2lvbmFsJTIwcG9ydHJhaXQlMjBoZWFkc2hvdHxlbnwxfHx8fDE3NzI2OTY1MjF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";

interface Props {
  colorMode: GlassColorMode;
}

export function EarningsHomeA({ colorMode }: Props) {
  const [isOnline, setIsOnline] = useState(false);
  const [showExpanded, setShowExpanded] = useState(false);
  const c = GLASS_COLORS[colorMode];
  const d = colorMode === "dark";

  const toggleOnline = useCallback(() => {
    setIsOnline((prev) => !prev);
    setShowExpanded(false);
  }, []);

  return (
    <div className="relative w-full h-full overflow-hidden" style={{ background: c.bg }}>
      {/* ── Map background ── */}
      <MapCanvas
        colorMode={colorMode}
        variant={isOnline ? "muted" : "dark"}
      />

      {/* ── Online state: brighter map overlay ── */}
      <AnimatePresence>
        {isOnline && (
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            style={{
              background: d
                ? "radial-gradient(ellipse at 50% 60%, rgba(29,185,84,0.06) 0%, transparent 60%)"
                : "radial-gradient(ellipse at 50% 60%, rgba(29,185,84,0.04) 0%, transparent 60%)",
            }}
          />
        )}
      </AnimatePresence>

      {/* ── Demand zone indicators (visible when online) ── */}
      <AnimatePresence>
        {isOnline && (
          <motion.div
            className="absolute top-[20%] left-0 right-0 px-4"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={MOTION.standard}
          >
            <div className="flex flex-wrap gap-2 justify-center">
              {DEMAND_ZONES.filter((z) => z.level !== "low").map((zone) => (
                <GlassPanel
                  key={zone.id}
                  variant={d ? "chip-dark" : "chip-light"}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
                >
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{
                      background: getDemandColor(zone.level),
                      boxShadow: zone.level === "surge"
                        ? `0 0 8px ${getDemandColor(zone.level)}80`
                        : "none",
                    }}
                  />
                  <span style={{ ...GLASS_TYPE.caption, color: c.text.secondary }}>
                    {zone.area}
                  </span>
                  {zone.multiplier > 1.0 && (
                    <span
                      style={{
                        ...GLASS_TYPE.caption,
                        color: getDemandColor(zone.level),
                        fontWeight: 600,
                      }}
                    >
                      {zone.multiplier}x
                    </span>
                  )}
                </GlassPanel>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Top bar: Logo + Status + Avatar ── */}
      <GlassPanel
        variant={d ? "map-dark" : "map-light"}
        className="absolute top-0 left-0 right-0 z-10"
        style={{ paddingTop: "env(safe-area-inset-top, 12px)" }}
      >
        <div className="flex items-center justify-between px-5 py-3">
          <JetLogo variant="full" mode={d ? "dark" : "light"} height={20} />

          <div className="flex items-center gap-3">
            {/* Online status indicator */}
            <div className="flex items-center gap-1.5">
              <motion.div
                className="w-2 h-2 rounded-full"
                animate={{
                  backgroundColor: isOnline ? BRAND_COLORS.green : c.text.muted,
                  boxShadow: isOnline
                    ? `0 0 8px ${BRAND_COLORS.green}60`
                    : "none",
                }}
                transition={MOTION.micro}
              />
              <span
                style={{
                  ...GLASS_TYPE.caption,
                  color: isOnline ? BRAND_COLORS.green : c.text.muted,
                }}
              >
                {isOnline ? "Online" : "Offline"}
              </span>
            </div>

            {/* Driver avatar */}
            <div
              className="w-8 h-8 rounded-full overflow-hidden"
              style={{
                border: `1.5px solid ${isOnline ? BRAND_COLORS.green + "40" : "rgba(255,255,255,0.1)"}`,
              }}
            >
              <img
                src={DRIVER_AVATAR}
                alt=""
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </GlassPanel>

      {/* ── Floating earnings strip ── */}
      <motion.div
        className="absolute left-4 right-4 z-10"
        animate={{ bottom: isOnline ? 100 : 108 }}
        transition={MOTION.standard}
      >
        <GlassPanel
          variant={d ? "dark" : "light"}
          className="rounded-2xl overflow-hidden"
        >
          {/* Compact strip */}
          <motion.button
            className="w-full flex items-center justify-between px-4 py-3"
            onClick={() => setShowExpanded(!showExpanded)}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center gap-3">
              <span
                style={{
                  ...GLASS_TYPE.body,
                  fontFamily: "var(--font-heading)",
                  fontWeight: 600,
                  letterSpacing: "-0.03em",
                  fontSize: "18px",
                  color: c.text.primary,
                }}
              >
                {formatNaira(TODAY_EARNINGS.earnings)}
              </span>
              <span style={{ ...GLASS_TYPE.caption, color: c.text.muted }}>today</span>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <span style={{ ...GLASS_TYPE.caption, color: c.text.tertiary }}>
                  {TODAY_EARNINGS.trips} trips
                </span>
                <span style={{ ...GLASS_TYPE.caption, color: c.text.ghost }}>
                  ·
                </span>
                <span style={{ ...GLASS_TYPE.caption, color: c.text.tertiary }}>
                  {formatHours(TODAY_EARNINGS.hoursOnline)}
                </span>
              </div>
              <motion.div
                animate={{ rotate: showExpanded ? 180 : 0 }}
                transition={MOTION.micro}
              >
                <ChevronUp
                  className="w-4 h-4"
                  style={{ color: c.text.muted }}
                />
              </motion.div>
            </div>
          </motion.button>

          {/* Expanded detail */}
          <AnimatePresence>
            {showExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={MOTION.standard}
                className="overflow-hidden"
              >
                <div
                  className="px-4 pb-4 pt-1"
                  style={{ borderTop: `1px solid ${d ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}` }}
                >
                  {/* Weekly sparkline */}
                  <div className="flex items-end gap-1 h-12 mb-3">
                    {WEEKLY_EARNINGS.map((day, i) => {
                      const max = Math.max(...WEEKLY_EARNINGS.map((d) => d.amount), 1);
                      const h = day.amount > 0 ? (day.amount / max) * 100 : 4;
                      const isToday = i === 3; // Thursday
                      return (
                        <div key={day.day} className="flex-1 flex flex-col items-center gap-1">
                          <motion.div
                            className="w-full rounded-sm"
                            initial={{ height: 0 }}
                            animate={{ height: `${h}%` }}
                            transition={{ delay: i * MOTION.stagger, ...MOTION.standard }}
                            style={{
                              background: isToday
                                ? BRAND_COLORS.green
                                : d
                                  ? "rgba(255,255,255,0.1)"
                                  : "rgba(0,0,0,0.08)",
                              minHeight: "2px",
                            }}
                          />
                          <span
                            style={{
                              ...GLASS_TYPE.caption,
                              fontSize: "9px",
                              color: isToday ? BRAND_COLORS.green : c.text.ghost,
                            }}
                          >
                            {day.day}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Commission transparency row */}
                  <div className="flex items-center justify-between">
                    <span style={{ ...GLASS_TYPE.caption, color: c.text.muted }}>
                      Commission (20%)
                    </span>
                    <span style={{ ...GLASS_TYPE.caption, color: c.text.tertiary }}>
                      -{formatNaira(TODAY_EARNINGS.commission)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span style={{ ...GLASS_TYPE.caption, color: c.text.muted }}>
                      Tips
                    </span>
                    <span style={{ ...GLASS_TYPE.caption, color: BRAND_COLORS.green + "90" }}>
                      +{formatNaira(TODAY_EARNINGS.tips)}
                    </span>
                  </div>

                  {/* Last trip */}
                  {RECENT_TRIPS[0] && (
                    <div
                      className="mt-3 pt-3 flex items-center justify-between"
                      style={{ borderTop: `1px solid ${d ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)"}` }}
                    >
                      <div>
                        <span style={{ ...GLASS_TYPE.caption, color: c.text.secondary }}>
                          Last: {RECENT_TRIPS[0].from} → {RECENT_TRIPS[0].to}
                        </span>
                      </div>
                      <span style={{ ...GLASS_TYPE.caption, color: c.text.primary }}>
                        +{formatNaira(RECENT_TRIPS[0].netEarnings)}
                      </span>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </GlassPanel>
      </motion.div>

      {/* ── Online/Offline toggle ── */}
      <div className="absolute bottom-0 left-0 right-0 z-10 px-4 pb-4">
        <motion.button
          className="w-full h-14 rounded-2xl flex items-center justify-center gap-3 relative overflow-hidden"
          style={{
            background: isOnline
              ? "rgba(29,185,84,0.15)"
              : d
                ? "rgba(255,255,255,0.06)"
                : "rgba(0,0,0,0.06)",
            border: `1px solid ${isOnline ? "rgba(29,185,84,0.3)" : d ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}`,
          }}
          onClick={toggleOnline}
          whileTap={{ scale: 0.97 }}
        >
          {/* Glow when online */}
          {isOnline && (
            <motion.div
              className="absolute inset-0 rounded-2xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                background: `radial-gradient(ellipse at 50% 50%, ${BRAND_COLORS.green}15, transparent 70%)`,
              }}
            />
          )}
          <Power
            className="w-5 h-5 relative z-10"
            style={{
              color: isOnline ? BRAND_COLORS.green : c.text.muted,
              strokeWidth: 2.2,
            }}
          />
          <span
            className="relative z-10"
            style={{
              ...GLASS_TYPE.body,
              fontWeight: 600,
              color: isOnline ? BRAND_COLORS.green : c.text.secondary,
            }}
          >
            {isOnline ? "Go Offline" : "Go Online"}
          </span>
        </motion.button>
      </div>

      {/* ── Rating badge (floating, top-left below header) ── */}
      <motion.div
        className="absolute top-20 left-4 z-10"
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2, ...MOTION.standard }}
      >
        <GlassPanel
          variant={d ? "chip-dark" : "chip-light"}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
        >
          <Star className="w-3 h-3" style={{ color: BRAND_COLORS.green, fill: BRAND_COLORS.green }} />
          <span style={{ ...GLASS_TYPE.caption, color: c.text.secondary }}>
            {DRIVER_PROFILE.rating}
          </span>
          <span style={{ ...GLASS_TYPE.caption, color: c.text.ghost }}>·</span>
          <span style={{ ...GLASS_TYPE.caption, color: c.text.muted }}>
            {DRIVER_PROFILE.acceptanceRate}%
          </span>
        </GlassPanel>
      </motion.div>
    </div>
  );
}
