/**
 * Driver Earnings Home — Variation C: "Atmospheric" (LOCKED SPINE)
 *
 * Full C spine DNA — the same visual language as the Rider app.
 *
 * Layout:
 *   - Full MapCanvas atmospheric background (responds to online state)
 *   - Floating GlassPanel earnings card (center-bottom)
 *   - Online/Offline = full atmospheric shift:
 *       Online: map saturates, green glows pulse, card lifts
 *       Offline: map dims, glows fade, card settles with daily summary
 *   - Stats woven into the card as subtle inline metrics
 *   - Green-as-scalpel: only CTAs, active states, status
 *   - Motion stagger on entrance (40ms MOTION config)
 *
 * E2E wired:
 *   - Online/Offline toggle with confirmation (going offline) + toast
 *   - Tap hero earnings → EarningsBreakdownSheet
 *   - Tap last trip → TripDetailSheet
 *   - Tap demand chip → DemandZonesSheet
 *   - New user empty states
 *   - Rating: "New" badge for 0-rated drivers
 */

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Power,
  TrendingUp,
  Star,
  Clock,
  Car,
  ArrowUpRight,
  Zap,
  ChevronRight,
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
import { DRIVER_TYPE as DT } from "../../config/driver-type";
import { MapCanvas } from "../rider/map-canvas";
import { GlassPanel } from "../rider/glass-panel";
import { JetLogo } from "../brand/jet-logo";
import { useJetToast } from "../rider/jet-toast";
import { JetConfirm } from "../rider/jet-confirm";
import {
  TripDetailSheet,
  EarningsBreakdownSheet,
  DemandZonesSheet,
} from "./driver-sheets";
import {
  DRIVER_PROFILE,
  TODAY_EARNINGS,
  WEEK_EARNINGS,
  WEEKLY_EARNINGS,
  DEMAND_ZONES,
  RECENT_TRIPS,
  formatHours,
  getDemandColor,
  NEW_USER_PROFILE,
  NEW_USER_EARNINGS,
  NEW_USER_WEEKLY,
  DRIVER_WALLET,
  canGoOnline,
  formatNaira as formatNairaDW,
  type TripRecord,
} from "./driver-data";

const DRIVER_AVATAR =
  "https://images.unsplash.com/photo-1634805211765-4ada7b686dd2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZnJpY2FuJTIwbWFuJTIwZHJpdmVyJTIwcHJvZmVzc2lvbmFsJTIwcG9ydHJhaXQlMjBoZWFkc2hvdHxlbnwxfHx8fDE3NzI2OTY1MjF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";

interface Props {
  colorMode: GlassColorMode;
  isNewUser?: boolean;
}

export function EarningsHomeC({ colorMode, isNewUser = false }: Props) {
  const [isOnline, setIsOnline] = useState(false);
  const c = GLASS_COLORS[colorMode];
  const d = colorMode === "dark";
  const { showToast, ToastContainer } = useJetToast(colorMode);

  // Sheet states
  const [selectedTrip, setSelectedTrip] = useState<TripRecord | null>(null);
  const [showEarningsBreakdown, setShowEarningsBreakdown] = useState(false);
  const [showDemandZones, setShowDemandZones] = useState(false);
  const [showOfflineConfirm, setShowOfflineConfirm] = useState(false);

  // Data layer (new user vs active)
  const profile = isNewUser ? NEW_USER_PROFILE : DRIVER_PROFILE;
  const earnings = isNewUser ? NEW_USER_EARNINGS : TODAY_EARNINGS;
  const weekEarnings = isNewUser ? NEW_USER_EARNINGS : WEEK_EARNINGS;
  const weekly = isNewUser ? NEW_USER_WEEKLY : WEEKLY_EARNINGS;
  const trips = isNewUser ? [] : RECENT_TRIPS;

  // Demand indicator for highest zone
  const topDemand = DEMAND_ZONES.reduce((a, b) =>
    b.multiplier > a.multiplier ? b : a,
  );

  const handleToggleOnline = useCallback(() => {
    if (isOnline) {
      // Going offline = destructive → confirm
      setShowOfflineConfirm(true);
    } else {
      // Check wallet minimum balance before going online
      if (!canGoOnline(DRIVER_WALLET)) {
        showToast({
          message: `Minimum balance of ${formatNairaDW(DRIVER_WALLET.minimumBalance)} required — fund your wallet`,
          variant: "warning",
          duration: 3500,
        });
        return;
      }
      setIsOnline(true);
      showToast({ message: "You're online — rides incoming", variant: "success" });
    }
  }, [isOnline, showToast]);

  const confirmGoOffline = useCallback(() => {
    setIsOnline(false);
    setShowOfflineConfirm(false);
    showToast({ message: "You're offline", variant: "info", duration: 2000 });
  }, [showToast]);

  return (
    <div className="relative w-full h-full overflow-hidden" style={{ background: c.bg }}>
      {/* ── MapCanvas — atmospheric background ── */}
      <MapCanvas
        colorMode={colorMode}
        variant={isOnline ? "muted" : "dark"}
      />

      {/* ── Atmospheric shift overlay (online/offline) ── */}
      <motion.div
        className="absolute inset-0"
        animate={{
          opacity: isOnline ? 1 : 0,
        }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        style={{
          background: d
            ? "radial-gradient(ellipse at 50% 65%, rgba(29,185,84,0.08) 0%, transparent 55%)"
            : "radial-gradient(ellipse at 50% 65%, rgba(29,185,84,0.05) 0%, transparent 55%)",
        }}
      />

      {/* ── Extra ambient glow when online (pulsing) ── */}
      <AnimatePresence>
        {isOnline && (
          <motion.div
            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] rounded-full"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{
              opacity: [0.04, 0.08, 0.04],
              scale: [0.9, 1.05, 0.9],
            }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{
              opacity: { duration: 3, repeat: Infinity, ease: "easeInOut" },
              scale: { duration: 3, repeat: Infinity, ease: "easeInOut" },
            }}
            style={{
              background: `radial-gradient(ellipse, ${BRAND_COLORS.green} 0%, transparent 70%)`,
            }}
          />
        )}
      </AnimatePresence>

      {/* ── Top bar: Logo + Status + Avatar ── */}
      <GlassPanel
        variant={d ? "map-dark" : "map-light"}
        className="absolute top-0 left-0 right-0 z-10"
        style={{ paddingTop: "env(safe-area-inset-top, 12px)" }}
      >
        <div className="flex items-center justify-between px-5 py-3">
          <div className="flex items-center gap-3">
            <JetLogo variant="full" mode={d ? "dark" : "light"} height={20} />
            {/* Driver badge */}
            <div
              className="px-2 py-0.5 rounded-md"
              style={{
                background: d ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)",
              }}
            >
              <span
                style={{
                  ...GLASS_TYPE.caption,
                  fontSize: "10px",
                  color: c.text.muted,
                  letterSpacing: "0.04em",
                  textTransform: "uppercase" as const,
                }}
              >
                Driver
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-full overflow-hidden"
              style={{
                border: `1.5px solid ${isOnline ? BRAND_COLORS.green + "40" : d ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)"}`,
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

      {/* ── Demand chip (when online) ── */}
      <AnimatePresence>
        {isOnline && (
          <motion.div
            className="absolute top-20 left-5 z-10"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={MOTION.standard}
          >
            <motion.button
              onClick={() => setShowDemandZones(true)}
              whileTap={{ scale: 0.95 }}
            >
              <GlassPanel
                variant={d ? "chip-dark" : "chip-light"}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
              >
                <motion.div
                  className="w-2 h-2 rounded-full"
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.8, 1, 0.8],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  style={{
                    background: getDemandColor(topDemand.level),
                    boxShadow: `0 0 6px ${getDemandColor(topDemand.level)}60`,
                  }}
                />
                <span style={{ ...GLASS_TYPE.caption, color: c.text.secondary }}>
                  {topDemand.area}
                </span>
                <span
                  style={{
                    ...GLASS_TYPE.caption,
                    color: getDemandColor(topDemand.level),
                    fontWeight: 600,
                  }}
                >
                  {topDemand.multiplier}x
                </span>
                <ChevronRight className="w-3 h-3" style={{ color: c.text.ghost }} />
              </GlassPanel>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Main floating card ── */}
      <div className="absolute bottom-0 left-0 right-0 z-10 px-4 pb-4">
        <motion.div
          animate={{ y: 0 }}
          transition={MOTION.emphasis}
        >
          <GlassPanel
            variant={d ? "dark" : "light"}
            className="rounded-2xl overflow-hidden"
          >
            {/* ── Online/Offline status bar ── */}
            <div className="flex items-center justify-between px-5 pt-4 pb-2">
              <div className="flex items-center gap-2">
                <motion.div
                  className="w-2.5 h-2.5 rounded-full"
                  animate={{
                    backgroundColor: isOnline ? BRAND_COLORS.green : c.text.muted,
                    boxShadow: isOnline ? `0 0 10px ${BRAND_COLORS.green}50` : "none",
                  }}
                  transition={MOTION.micro}
                />
                <span
                  style={{
                    ...DT.secondary,
                    fontWeight: 600,
                    color: isOnline ? BRAND_COLORS.green : c.text.tertiary,
                  }}
                >
                  {isOnline ? "Online" : "Offline"}
                </span>
                {isOnline && (
                  <motion.span
                    initial={{ opacity: 0, x: -4 }}
                    animate={{ opacity: 1, x: 0 }}
                    style={{ ...DT.meta, color: c.text.ghost }}
                  >
                    · {formatHours(earnings.hoursOnline)}
                  </motion.span>
                )}
              </div>
              <div className="flex items-center gap-1.5">
                {profile.rating > 0 ? (
                  <>
                    <Star className="w-3.5 h-3.5" style={{ color: BRAND_COLORS.green, fill: BRAND_COLORS.green }} />
                    <span style={{ ...DT.meta, color: c.text.secondary }}>
                      {profile.rating}
                    </span>
                  </>
                ) : (
                  <span
                    className="px-2 py-0.5 rounded-md"
                    style={{
                      ...DT.meta,
                      fontSize: "11px",
                      fontWeight: 600,
                      background: c.green.tint,
                      color: BRAND_COLORS.green,
                    }}
                  >
                    New
                  </span>
                )}
              </div>
            </div>

            {/* ── Hero earnings (tappable → breakdown sheet) ── */}
            <motion.button
              className="w-full text-left px-5 pt-2 pb-3"
              onClick={() => {
                if (!isNewUser) setShowEarningsBreakdown(true);
              }}
              whileTap={!isNewUser ? { scale: 0.98 } : {}}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, ...MOTION.emphasis }}
            >
              <div className="flex items-baseline gap-2">
                <h1
                  style={{
                    ...DT.hero,
                    fontSize: "38px",
                    color: c.text.display,
                  }}
                >
                  {formatNairaDW(earnings.earnings)}
                </h1>
                <span style={{ ...DT.secondary, color: c.text.muted }}>
                  today
                </span>
                {!isNewUser && (
                  <ChevronRight className="w-3.5 h-3.5 ml-auto" style={{ color: c.text.ghost }} />
                )}
              </div>

              {/* Context line */}
              <div className="flex items-center gap-1.5 mt-1.5">
                {isNewUser ? (
                  <span style={{ ...DT.meta, color: c.text.tertiary }}>
                    Go online to start earning
                  </span>
                ) : (
                  <>
                    <TrendingUp className="w-3 h-3" style={{ color: BRAND_COLORS.green + "80" }} />
                    <span style={{ ...DT.meta, color: c.text.tertiary }}>
                      23% above your Thursday average
                    </span>
                  </>
                )}
              </div>
            </motion.button>

            {/* ── Stats row ── */}
            <motion.div
              className="flex items-center gap-4 px-5 pb-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, ...MOTION.standard }}
            >
              <div className="flex items-center gap-1.5">
                <Car className="w-3.5 h-3.5" style={{ color: c.icon.muted }} />
                <span style={{ ...DT.meta, color: c.text.tertiary }}>
                  {earnings.trips} trips
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <Banknote className="w-3.5 h-3.5" style={{ color: c.icon.muted }} />
                <span style={{ ...DT.meta, color: c.text.tertiary }}>
                  {earnings.cashTrips} cash
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <Smartphone className="w-3.5 h-3.5" style={{ color: c.icon.muted }} />
                <span style={{ ...DT.meta, color: c.text.tertiary }}>
                  {earnings.digitalTrips} digital
                </span>
              </div>
            </motion.div>

            {/* ── Sparkline ── */}
            <motion.div
              className="px-5 pb-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25, ...MOTION.standard }}
            >
              <div className="flex items-end gap-1 h-10">
                {weekly.map((day, i) => {
                  const max = Math.max(...weekly.map((dd) => dd.amount), 1);
                  const h = day.amount > 0 ? (day.amount / max) * 100 : 3;
                  const isToday = i === 3;
                  return (
                    <div key={day.day} className="flex-1 flex flex-col items-center gap-1">
                      <motion.div
                        className="w-full rounded-sm"
                        initial={{ height: 0 }}
                        animate={{ height: `${h}%` }}
                        transition={{
                          delay: i * MOTION.stagger + 0.3,
                          ...MOTION.standard,
                        }}
                        style={{
                          background: isToday
                            ? BRAND_COLORS.green
                            : d
                              ? "rgba(255,255,255,0.08)"
                              : "rgba(0,0,0,0.06)",
                          minHeight: "2px",
                          borderRadius: "2px",
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
            </motion.div>

            {/* ── Last trip (tappable → trip detail sheet) ── */}
            {trips[0] && (
              <motion.button
                className="w-full text-left mx-4 mb-3 px-3 py-2.5 rounded-xl flex items-center justify-between"
                style={{
                  background: d ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)",
                  width: "calc(100% - 32px)",
                }}
                onClick={() => setSelectedTrip(trips[0])}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, ...MOTION.standard }}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span style={{ ...DT.meta, fontWeight: 600, color: c.text.primarySoft }}>
                      {trips[0].from}
                    </span>
                    <ArrowUpRight className="w-3 h-3 shrink-0" style={{ color: c.text.ghost }} />
                    <span
                      className="truncate"
                      style={{ ...DT.meta, fontWeight: 600, color: c.text.primarySoft }}
                    >
                      {trips[0].to}
                    </span>
                  </div>
                  <span style={{ ...DT.meta, color: c.text.muted }}>
                    {trips[0].rider} · {trips[0].time}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span
                    style={{
                      ...DT.label,
                      color: c.text.primary,
                    }}
                  >
                    +{formatNairaDW(trips[0].netEarnings)}
                  </span>
                  <ChevronRight className="w-3 h-3" style={{ color: c.text.ghost }} />
                </div>
              </motion.button>
            )}

            {/* ── Commission transparency ── */}
            {!isNewUser && (
              <motion.div
                className="flex items-center justify-between px-5 pb-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, ...MOTION.standard }}
              >
                <span style={{ ...DT.meta, color: c.text.ghost }}>
                  Commission (20%): -{formatNairaDW(earnings.commission)}
                </span>
                {earnings.tips > 0 && (
                  <span style={{ ...DT.meta, color: BRAND_COLORS.green + "60" }}>
                    Tips: +{formatNairaDW(earnings.tips)}
                  </span>
                )}
              </motion.div>
            )}

            {/* ── Online/Offline toggle ── */}
            <div className="px-4 pb-4">
              <motion.button
                className="w-full h-12 rounded-xl flex items-center justify-center gap-2.5 relative overflow-hidden"
                style={{
                  background: isOnline
                    ? BRAND_COLORS.green
                    : d
                      ? "rgba(255,255,255,0.06)"
                      : "rgba(0,0,0,0.05)",
                  border: isOnline
                    ? "none"
                    : `1px solid ${d ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}`,
                }}
                onClick={handleToggleOnline}
                whileTap={{ scale: 0.97 }}
              >
                <Power
                  className="w-[18px] h-[18px]"
                  style={{
                    color: isOnline ? "#fff" : c.text.secondary,
                    strokeWidth: 2.2,
                  }}
                />
                <span
                  style={{
                    ...DT.cta,
                    color: isOnline ? "#fff" : c.text.secondary,
                  }}
                >
                  {isOnline ? "Go Offline" : "Go Online"}
                </span>
              </motion.button>
            </div>
          </GlassPanel>
        </motion.div>
      </div>

      {/* ═══ Sheet overlays ═══ */}
      <AnimatePresence>
        {selectedTrip && (
          <TripDetailSheet
            key="trip-detail"
            trip={selectedTrip}
            colorMode={colorMode}
            onClose={() => setSelectedTrip(null)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showEarningsBreakdown && (
          <EarningsBreakdownSheet
            key="earnings-breakdown"
            today={earnings}
            week={weekEarnings}
            daily={weekly}
            colorMode={colorMode}
            onClose={() => setShowEarningsBreakdown(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showDemandZones && (
          <DemandZonesSheet
            key="demand-zones"
            zones={DEMAND_ZONES}
            colorMode={colorMode}
            onClose={() => setShowDemandZones(false)}
          />
        )}
      </AnimatePresence>

      {/* ── Go Offline confirmation ── */}
      <JetConfirm
        open={showOfflineConfirm}
        colorMode={colorMode}
        title="Go offline?"
        message="You'll stop receiving ride requests. Your current earnings are saved."
        confirmLabel="Go Offline"
        cancelLabel="Stay Online"
        onConfirm={confirmGoOffline}
        onCancel={() => setShowOfflineConfirm(false)}
      />

      {/* ── Toast container ── */}
      <ToastContainer />
    </div>
  );
}