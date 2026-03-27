 /**
 * Driver Earnings Home — Variation B: "Dashboard"
 *
 * Apple Health / Vercel Analytics DNA — Data-forward, map secondary.
 *
 * Layout:
 *   - Top: Large earnings hero with contextual insight
 *   - Stats row: Trips · Hours · Rating · Acceptance (tight metric cells)
 *   - Weekly bar chart with stagger animation
 *   - Recent trips list (compact)
 *   - Bottom third: Map peek with demand
 *   - Online/Offline pill integrated into earnings area
 *
 * C spine materials maintained: GlassPanel, MapCanvas (peek), ambient glows,
 * noise, typography, green-as-scalpel.
 */

import { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Power,
  TrendingUp,
  Star,
  Clock,
  Car,
  CheckCircle,
  ArrowUpRight,
  Banknote,
  Smartphone,
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
  WEEK_EARNINGS,
  WEEKLY_EARNINGS,
  RECENT_TRIPS,
  formatNaira,
  formatHours,
} from "./driver-data";

const DRIVER_AVATAR =
  "https://images.unsplash.com/photo-1634805211765-4ada7b686dd2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZnJpY2FuJTIwbWFuJTIwZHJpdmVyJTIwcHJvZmVzc2lvbmFsJTIwcG9ydHJhaXQlMjBoZWFkc2hvdHxlbnwxfHx8fDE3NzI2OTY1MjF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";

interface Props {
  colorMode: GlassColorMode;
}

export function EarningsHomeB({ colorMode }: Props) {
  const [isOnline, setIsOnline] = useState(false);
  const c = GLASS_COLORS[colorMode];
  const d = colorMode === "dark";

  const toggleOnline = useCallback(() => setIsOnline((p) => !p), []);

  const stats = useMemo(
    () => [
      { label: "Trips", value: String(TODAY_EARNINGS.trips), icon: Car },
      { label: "Hours", value: formatHours(TODAY_EARNINGS.hoursOnline), icon: Clock },
      { label: "Rating", value: String(DRIVER_PROFILE.rating), icon: Star },
      { label: "Accept", value: `${DRIVER_PROFILE.acceptanceRate}%`, icon: CheckCircle },
    ],
    [],
  );

  // Average earnings calculation for context
  const avgTuesdayEarnings = 19900;
  const percentAbove = Math.round(
    ((TODAY_EARNINGS.earnings - avgTuesdayEarnings) / avgTuesdayEarnings) * 100,
  );

  return (
    <div className="relative w-full h-full overflow-hidden flex flex-col" style={{ background: c.bg }}>
      {/* ── Map peek (bottom 30%) ── */}
      <div className="absolute bottom-0 left-0 right-0 h-[35%]">
        <MapCanvas colorMode={colorMode} variant="muted" />
        {/* Fade into content above */}
        <div
          className="absolute inset-0"
          style={{
            background: d
              ? "linear-gradient(to bottom, #0B0B0D 0%, rgba(11,11,13,0.6) 40%, rgba(11,11,13,0.3) 100%)"
              : "linear-gradient(to bottom, #FAFAFA 0%, rgba(250,250,250,0.6) 40%, rgba(250,250,250,0.3) 100%)",
          }}
        />
      </div>

      {/* ── Scrollable content ── */}
      <div className="relative z-10 flex-1 overflow-y-auto">
        {/* Top bar */}
        <div
          className="flex items-center justify-between px-5 pt-3 pb-2"
          style={{ paddingTop: "max(env(safe-area-inset-top, 12px), 12px)" }}
        >
          <JetLogo variant="full" mode={d ? "dark" : "light"} height={20} />
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-full overflow-hidden"
              style={{
                border: `1.5px solid ${d ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)"}`,
              }}
            >
              <img src={DRIVER_AVATAR} alt="" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>

        {/* ── Earnings hero ── */}
        <div className="px-5 pt-4 pb-2">
          {/* Online toggle pill + status */}
          <div className="flex items-center justify-between mb-6">
            <motion.button
              className="flex items-center gap-2 px-4 py-2 rounded-full"
              style={{
                background: isOnline
                  ? "rgba(29,185,84,0.12)"
                  : d
                    ? "rgba(255,255,255,0.06)"
                    : "rgba(0,0,0,0.04)",
                border: `1px solid ${isOnline ? "rgba(29,185,84,0.25)" : "transparent"}`,
              }}
              onClick={toggleOnline}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                className="w-2.5 h-2.5 rounded-full"
                animate={{
                  backgroundColor: isOnline ? BRAND_COLORS.green : c.text.muted,
                  boxShadow: isOnline ? `0 0 8px ${BRAND_COLORS.green}50` : "none",
                }}
              />
              <span
                style={{
                  ...GLASS_TYPE.bodySmall,
                  color: isOnline ? BRAND_COLORS.green : c.text.tertiary,
                  fontWeight: 600,
                }}
              >
                {isOnline ? "Online" : "Offline"}
              </span>
            </motion.button>

            <span style={{ ...GLASS_TYPE.caption, color: c.text.muted }}>
              Today
            </span>
          </div>

          {/* Hero balance */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={MOTION.emphasis}
          >
            <h1
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "38px",
                fontWeight: 700,
                letterSpacing: "-0.03em",
                lineHeight: "1.1",
                color: c.text.display,
              }}
            >
              {formatNaira(TODAY_EARNINGS.earnings)}
            </h1>
            <div className="flex items-center gap-2 mt-2">
              <TrendingUp
                className="w-3.5 h-3.5"
                style={{ color: BRAND_COLORS.green }}
              />
              <span
                style={{
                  ...GLASS_TYPE.bodySmall,
                  color: BRAND_COLORS.green + "90",
                }}
              >
                {percentAbove}% above your Thursday average
              </span>
            </div>
          </motion.div>
        </div>

        {/* ── Stats row ── */}
        <div className="px-5 py-4">
          <div className="grid grid-cols-4 gap-2">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * MOTION.stagger, ...MOTION.standard }}
                className="flex flex-col items-center gap-1 py-3 rounded-xl"
                style={{
                  background: d ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)",
                }}
              >
                <span
                  style={{
                    ...GLASS_TYPE.body,
                    fontFamily: "var(--font-heading)",
                    fontWeight: 600,
                    fontSize: "16px",
                    letterSpacing: "-0.02em",
                    color: c.text.primary,
                  }}
                >
                  {stat.value}
                </span>
                <span style={{ ...GLASS_TYPE.caption, color: c.text.muted, fontSize: "10px" }}>
                  {stat.label}
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ── Weekly bar chart ── */}
        <div className="px-5 pb-4">
          <div className="flex items-center justify-between mb-3">
            <span style={{ ...GLASS_TYPE.label, color: c.text.muted }}>
              This week
            </span>
            <span style={{ ...GLASS_TYPE.caption, color: c.text.tertiary }}>
              {formatNaira(WEEK_EARNINGS.earnings)}
            </span>
          </div>
          <div className="flex items-end gap-1.5 h-16">
            {WEEKLY_EARNINGS.map((day, i) => {
              const max = Math.max(...WEEKLY_EARNINGS.map((d) => d.amount), 1);
              const h = day.amount > 0 ? (day.amount / max) * 100 : 3;
              const isToday = i === 3;
              return (
                <div key={day.day} className="flex-1 flex flex-col items-center gap-1.5">
                  <motion.div
                    className="w-full rounded-sm"
                    initial={{ height: 0 }}
                    animate={{ height: `${h}%` }}
                    transition={{ delay: i * MOTION.stagger + 0.2, ...MOTION.standard }}
                    style={{
                      background: isToday
                        ? BRAND_COLORS.green
                        : d
                          ? "rgba(255,255,255,0.08)"
                          : "rgba(0,0,0,0.06)",
                      minHeight: "2px",
                      borderRadius: "3px",
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
        </div>

        {/* ── Payment split ── */}
        <div className="px-5 pb-3">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <Banknote className="w-3.5 h-3.5" style={{ color: c.text.muted }} />
              <span style={{ ...GLASS_TYPE.caption, color: c.text.tertiary }}>
                Cash: {TODAY_EARNINGS.cashTrips}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Smartphone className="w-3.5 h-3.5" style={{ color: c.text.muted }} />
              <span style={{ ...GLASS_TYPE.caption, color: c.text.tertiary }}>
                Digital: {TODAY_EARNINGS.digitalTrips}
              </span>
            </div>
            <div className="flex-1" />
            <span style={{ ...GLASS_TYPE.caption, color: c.text.ghost }}>
              Commission: {formatNaira(TODAY_EARNINGS.commission)}
            </span>
          </div>
        </div>

        {/* ── Recent trips ── */}
        <div className="px-5 pt-2 pb-32">
          <div className="flex items-center justify-between mb-3">
            <span style={{ ...GLASS_TYPE.label, color: c.text.muted }}>
              Recent trips
            </span>
            <span
              style={{
                ...GLASS_TYPE.caption,
                color: c.text.ghost,
              }}
            >
              See all
            </span>
          </div>

          <div className="flex flex-col gap-1">
            {RECENT_TRIPS.slice(0, 4).map((trip, i) => (
              <motion.div
                key={trip.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * MOTION.stagger + 0.3, ...MOTION.standard }}
                className="flex items-center justify-between py-3 px-3 rounded-xl"
                style={{
                  background: d ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)",
                }}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span style={{ ...GLASS_TYPE.bodySmall, color: c.text.primarySoft }}>
                      {trip.from}
                    </span>
                    <ArrowUpRight
                      className="w-3 h-3 shrink-0"
                      style={{ color: c.text.ghost }}
                    />
                    <span
                      className="truncate"
                      style={{ ...GLASS_TYPE.bodySmall, color: c.text.primarySoft }}
                    >
                      {trip.to}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span style={{ ...GLASS_TYPE.caption, color: c.text.muted, fontSize: "10px" }}>
                      {trip.time}
                    </span>
                    <span style={{ ...GLASS_TYPE.caption, color: c.text.ghost, fontSize: "10px" }}>·</span>
                    <span style={{ ...GLASS_TYPE.caption, color: c.text.muted, fontSize: "10px" }}>
                      {trip.paymentType === "cash" ? "Cash" : "Digital"}
                    </span>
                  </div>
                </div>
                <div className="text-right shrink-0 ml-3">
                  <span
                    style={{
                      ...GLASS_TYPE.bodySmall,
                      fontFamily: "var(--font-heading)",
                      fontWeight: 600,
                      color: c.text.primary,
                    }}
                  >
                    +{formatNaira(trip.netEarnings)}
                  </span>
                  {trip.tip > 0 && (
                    <div>
                      <span
                        style={{
                          ...GLASS_TYPE.caption,
                          fontSize: "9px",
                          color: BRAND_COLORS.green + "70",
                        }}
                      >
                        +{formatNaira(trip.tip)} tip
                      </span>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Bottom online toggle (persistent) ── */}
      <div
        className="absolute bottom-0 left-0 right-0 z-20 px-4 pb-4 pt-8"
        style={{
          background: d
            ? "linear-gradient(to top, rgba(11,11,13,0.95) 50%, transparent)"
            : "linear-gradient(to top, rgba(250,250,250,0.95) 50%, transparent)",
        }}
      >
        <motion.button
          className="w-full h-14 rounded-2xl flex items-center justify-center gap-3 relative overflow-hidden"
          style={{
            background: isOnline
              ? BRAND_COLORS.green
              : d
                ? "rgba(255,255,255,0.08)"
                : "rgba(0,0,0,0.06)",
          }}
          onClick={toggleOnline}
          whileTap={{ scale: 0.97 }}
        >
          <Power
            className="w-5 h-5"
            style={{
              color: isOnline ? "#fff" : c.text.secondary,
              strokeWidth: 2.2,
            }}
          />
          <span
            style={{
              ...GLASS_TYPE.body,
              fontWeight: 600,
              color: isOnline ? "#fff" : c.text.secondary,
            }}
          >
            {isOnline ? "Go Offline" : "Go Online"}
          </span>
        </motion.button>
      </div>
    </div>
  );
}
