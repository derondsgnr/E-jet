 /**
 * EarningsHistory — Trip history & earnings breakdown (Trips tab).
 *
 * LAYOUT: Full C spine DNA — MapCanvas background, GlassPanel cards.
 * DRIVER_TYPE enforced — nothing below 13px.
 *
 * IA (benchmarked against Uber Driver / Bolt Driver):
 *   - Period selector (Today / This Week / This Month)
 *   - Summary card (hero earnings, stats, payment split)
 *   - Trip list — tap any trip → TripDetailSheet (full breakdown,
 *     rider info, "Get help" / "Report issue" affordances)
 *   - Empty state for zero-trip periods
 *
 * Every completed trip is tappable. Drivers need this for:
 *   - Fare verification / disputes
 *   - Issue reporting (rider behavior, route problems)
 *   - Tax documentation
 *   - Learning which routes/times pay best
 */

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ChevronRight,
  Clock,
  MapPin,
  Banknote,
  Smartphone,
  Star,
  Zap,
  TrendingUp,
  ArrowUpRight,
  Calendar,
} from "lucide-react";
import {
  GLASS_COLORS,
  MOTION,
  type GlassColorMode,
} from "../../config/project";
import { BRAND_COLORS } from "../../config/brand";
import { DRIVER_TYPE as DT } from "../../config/driver-type";
import { MapCanvas } from "../rider/map-canvas";
import { GlassPanel } from "../rider/glass-panel";
import { TripDetailSheet } from "./driver-sheets";
import {
  RECENT_TRIPS,
  TODAY_EARNINGS,
  WEEK_EARNINGS,
  type TripRecord,
  type EarningsPeriod,
  formatNaira,
  formatHours,
} from "./driver-data";

// ---------------------------------------------------------------------------
// Period configs
// ---------------------------------------------------------------------------
type Period = "today" | "week" | "month";

const PERIODS: { id: Period; label: string }[] = [
  { id: "today", label: "Today" },
  { id: "week", label: "This week" },
  { id: "month", label: "This month" },
];

// Mock month earnings
const MONTH_EARNINGS: EarningsPeriod = {
  label: "This month",
  earnings: 584200,
  trips: 189,
  hoursOnline: 156,
  cashTrips: 112,
  digitalTrips: 77,
  commission: 116840,
  bonuses: 18000,
  tips: 14600,
};

// Extended trip data for "This month"
const MONTH_TRIPS: TripRecord[] = [
  ...RECENT_TRIPS,
  {
    id: "t6",
    rider: "Chioma E.",
    riderRating: 4.9,
    riderTrips: 421,
    from: "Lekki Phase 2",
    to: "Victoria Island",
    grossFare: 4200,
    commission: 840,
    netEarnings: 3360,
    tip: 500,
    paymentType: "digital",
    vehicleType: "Comfort",
    duration: 28,
    distance: 11.3,
    time: "Yesterday",
    timestamp: Date.now() - 86400000,
  },
  {
    id: "t7",
    rider: "Emeka O.",
    riderRating: 4.7,
    riderTrips: 93,
    from: "Ikeja",
    to: "Oshodi",
    grossFare: 2800,
    commission: 560,
    netEarnings: 2240,
    tip: 0,
    paymentType: "cash",
    vehicleType: "Economy",
    duration: 15,
    distance: 6.2,
    time: "Yesterday",
    timestamp: Date.now() - 90000000,
  },
  {
    id: "t8",
    rider: "Bola A.",
    riderRating: 4.8,
    riderTrips: 178,
    from: "Surulere",
    to: "Yaba",
    grossFare: 1800,
    commission: 360,
    netEarnings: 1440,
    tip: 200,
    paymentType: "cash",
    vehicleType: "Economy",
    duration: 10,
    distance: 3.8,
    time: "2 days ago",
    timestamp: Date.now() - 172800000,
  },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
interface EarningsHistoryProps {
  colorMode: GlassColorMode;
}

export function EarningsHistory({ colorMode }: EarningsHistoryProps) {
  const c = GLASS_COLORS[colorMode];
  const d = colorMode === "dark";
  const [period, setPeriod] = useState<Period>("today");
  const [selectedTrip, setSelectedTrip] = useState<TripRecord | null>(null);

  const earnings =
    period === "today"
      ? TODAY_EARNINGS
      : period === "week"
        ? WEEK_EARNINGS
        : MONTH_EARNINGS;

  const trips =
    period === "today"
      ? RECENT_TRIPS.slice(0, 3)
      : period === "week"
        ? RECENT_TRIPS
        : MONTH_TRIPS;

  return (
    <div className="relative w-full h-full" style={{ background: c.bg }}>
      {/* Background */}
      <MapCanvas colorMode={colorMode} variant="dark" />
      {d ? (
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B0B0D]/60 via-[#0B0B0D]/40 to-[#0B0B0D]/80 z-[1]" />
      ) : (
        <div
          className="absolute inset-0 z-[1]"
          style={{
            background:
              "linear-gradient(to bottom, rgba(250,250,250,0.7) 0%, rgba(250,250,250,0.4) 40%, rgba(250,250,250,0.85) 100%)",
          }}
        />
      )}

      {/* Scrollable content */}
      <div
        className="absolute inset-0 z-[2] overflow-y-auto scrollbar-hide"
        style={{ paddingTop: "calc(env(safe-area-inset-top, 12px) + 16px)" }}
      >
        {/* Header */}
        <div className="px-5 mb-5">
          <div style={{ ...DT.heading, fontSize: "22px", color: c.text.primary }}>
            Earnings
          </div>
          <div className="mt-0.5" style={{ ...DT.secondary, color: c.text.muted }}>
            Your trip history & breakdown
          </div>
        </div>

        {/* Period selector */}
        <div className="px-5 mb-5">
          <div
            className="flex items-center gap-1 p-1 rounded-xl"
            style={{ background: c.surface.subtle }}
          >
            {PERIODS.map((p) => {
              const active = period === p.id;
              return (
                <motion.button
                  key={p.id}
                  className="flex-1 py-2 rounded-lg text-center"
                  style={{
                    background: active
                      ? d
                        ? "rgba(255,255,255,0.1)"
                        : "#fff"
                      : "transparent",
                    boxShadow: active
                      ? d
                        ? "0 1px 4px rgba(0,0,0,0.3)"
                        : "0 1px 4px rgba(0,0,0,0.08)"
                      : "none",
                  }}
                  onClick={() => setPeriod(p.id)}
                  whileTap={{ scale: 0.97 }}
                >
                  <span
                    style={{
                      ...DT.meta,
                      fontWeight: active ? 600 : 500,
                      color: active ? c.text.primary : c.text.muted,
                    }}
                  >
                    {p.label}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Summary card */}
        <div className="px-5 mb-5">
          <GlassPanel
            variant={d ? "dark" : "light"}
            blur={20}
            className="rounded-2xl px-5 py-5"
          >
            {/* Hero earnings */}
            <div className="text-center mb-4">
              <div style={{ ...DT.meta, color: c.text.muted, marginBottom: "4px" }}>
                Net earnings
              </div>
              <div
                style={{
                  ...DT.hero,
                  fontSize: "36px",
                  color: BRAND_COLORS.green,
                }}
              >
                {formatNaira(earnings.earnings)}
              </div>
            </div>

            {/* Stats row */}
            <div className="flex items-center justify-around">
              {[
                { label: "Trips", value: `${earnings.trips}` },
                { label: "Hours", value: formatHours(earnings.hoursOnline) },
                { label: "Commission", value: formatNaira(earnings.commission) },
              ].map((item, i) => (
                <div key={item.label} className="flex items-center">
                  {i > 0 && (
                    <div
                      className="h-8 mr-4"
                      style={{
                        width: 1,
                        background: d ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)",
                      }}
                    />
                  )}
                  <div className="text-center">
                    <div style={{ ...DT.meta, color: c.text.muted }}>{item.label}</div>
                    <div style={{ ...DT.stat, fontSize: "17px", marginTop: "2px", color: c.text.display }}>
                      {item.value}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Payment split */}
            <div className="mt-4 pt-3" style={{ borderTop: `1px solid ${c.surface.hover}` }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Banknote className="w-3.5 h-3.5" style={{ color: c.icon.secondary }} />
                  <span style={{ ...DT.meta, color: c.text.secondary }}>
                    Cash · {earnings.cashTrips} trips
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Smartphone className="w-3.5 h-3.5" style={{ color: c.icon.secondary }} />
                  <span style={{ ...DT.meta, color: c.text.secondary }}>
                    Digital · {earnings.digitalTrips} trips
                  </span>
                </div>
              </div>
            </div>

            {/* Bonuses + Tips */}
            {(earnings.bonuses > 0 || earnings.tips > 0) && (
              <div className="flex items-center gap-4 mt-3">
                {earnings.bonuses > 0 && (
                  <div className="flex items-center gap-1.5">
                    <TrendingUp className="w-3 h-3" style={{ color: BRAND_COLORS.green }} />
                    <span style={{ ...DT.meta, color: BRAND_COLORS.green }}>
                      +{formatNaira(earnings.bonuses)} bonuses
                    </span>
                  </div>
                )}
                {earnings.tips > 0 && (
                  <div className="flex items-center gap-1.5">
                    <Star className="w-3 h-3" style={{ color: "#F59E0B" }} />
                    <span style={{ ...DT.meta, color: "#F59E0B" }}>
                      +{formatNaira(earnings.tips)} tips
                    </span>
                  </div>
                )}
              </div>
            )}
          </GlassPanel>
        </div>

        {/* Trip list */}
        <div className="px-5 mb-4">
          <div className="flex items-center justify-between mb-3">
            <span style={{ ...DT.label, color: c.text.primary }}>
              Trip history
            </span>
            <span style={{ ...DT.meta, color: c.text.muted }}>
              {trips.length} trips
            </span>
          </div>

          {trips.length === 0 ? (
            <GlassPanel
              variant={d ? "dark" : "light"}
              blur={16}
              className="rounded-2xl px-5 py-8 text-center"
            >
              <Calendar className="w-8 h-8 mx-auto mb-3" style={{ color: c.icon.muted }} />
              <div style={{ ...DT.label, color: c.text.secondary, marginBottom: "4px" }}>
                No trips yet
              </div>
              <div style={{ ...DT.meta, color: c.text.muted }}>
                Go online to start earning
              </div>
            </GlassPanel>
          ) : (
            <div className="space-y-2">
              {trips.map((trip, i) => (
                <motion.div
                  key={trip.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ ...MOTION.standard, delay: i * 0.03 }}
                >
                  <GlassPanel
                    variant={d ? "dark" : "light"}
                    blur={16}
                    className="rounded-xl overflow-hidden"
                  >
                    <motion.button
                      className="w-full px-4 py-3.5 flex items-center gap-3"
                      onClick={() => setSelectedTrip(trip)}
                      whileTap={{ scale: 0.98 }}
                    >
                      {/* Route icon */}
                      <div
                        className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                        style={{ background: c.green.tint }}
                      >
                        <ArrowUpRight
                          className="w-4 h-4"
                          style={{ color: BRAND_COLORS.green }}
                        />
                      </div>

                      {/* Route + meta */}
                      <div className="flex-1 min-w-0 text-left">
                        <div className="flex items-center gap-1.5">
                          <span
                            className="truncate"
                            style={{ ...DT.label, color: c.text.primary }}
                          >
                            {trip.from} → {trip.to}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span style={{ ...DT.meta, color: c.text.muted }}>
                            {trip.time}
                          </span>
                          <span style={{ ...DT.meta, color: c.text.faint }}>·</span>
                          <span style={{ ...DT.meta, color: c.text.muted }}>
                            {trip.duration} min · {trip.distance} km
                          </span>
                          {trip.tip > 0 && (
                            <>
                              <span style={{ ...DT.meta, color: c.text.faint }}>·</span>
                              <Star className="w-2.5 h-2.5" style={{ color: "#F59E0B" }} />
                            </>
                          )}
                        </div>
                      </div>

                      {/* Earnings + payment */}
                      <div className="text-right shrink-0">
                        <div
                          style={{
                            ...DT.label,
                            color: BRAND_COLORS.green,
                          }}
                        >
                          {formatNaira(trip.netEarnings)}
                        </div>
                        <div className="flex items-center justify-end gap-1 mt-0.5">
                          {trip.paymentType === "cash" ? (
                            <Banknote className="w-3 h-3" style={{ color: c.icon.muted }} />
                          ) : (
                            <Smartphone className="w-3 h-3" style={{ color: c.icon.muted }} />
                          )}
                          <span
                            style={{
                              ...DT.meta,
                              color: c.text.muted,
                              textTransform: "capitalize" as const,
                            }}
                          >
                            {trip.paymentType}
                          </span>
                        </div>
                      </div>

                      <ChevronRight
                        className="w-4 h-4 shrink-0"
                        style={{ color: c.icon.muted }}
                      />
                    </motion.button>
                  </GlassPanel>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Bottom spacer for safe area + nav */}
        <div style={{ height: 120 }} />
      </div>

      {/* ── Trip Detail Sheet ── */}
      <AnimatePresence>
        {selectedTrip && (
          <TripDetailSheet
            key={selectedTrip.id}
            trip={selectedTrip}
            colorMode={colorMode}
            onClose={() => setSelectedTrip(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
