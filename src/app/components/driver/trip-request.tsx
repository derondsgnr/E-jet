/**
 * Driver Trip Request — Incoming ride request overlay.
 *
 * Rebuilt with decision-optimized IA:
 *   1. Countdown timer (urgency frame — ambient, top-right)
 *   2. Net earnings hero (THE number — why you'd say yes)
 *   3. Pickup distance + ETA (cost of saying yes)
 *   4. Route: pickup → destination (strategic context)
 *   5. Trip distance + duration (time commitment)
 *   6. Rider trust signal (compact: name · rating · trips)
 *   7. Payment + contextual badges (modifiers, not primary)
 *   8. Accept CTA (green, shimmer)
 *   9. Decline (quiet muted text link)
 *
 * C spine DNA: GlassPanel, MapCanvas backdrop, green-as-scalpel,
 * motion stagger, gradient depth.
 *
 * Benchmarked against: Uber request screen (urgency without stress),
 * Apple timer ring (spatial clarity), Linear density.
 */

import { useState, useEffect, useCallback, useRef } from "react";
import { motion } from "motion/react";
import {
  Navigation,
  Star,
  Clock,
  Route,
  Banknote,
  Smartphone,
  Zap,
  TrendingUp,
  MapPin,
  Building2,
  StickyNote,
} from "lucide-react";
import {
  GLASS_COLORS,
  MOTION,
  type GlassColorMode,
} from "../../config/project";
import { BRAND_COLORS } from "../../config/brand";
import { DRIVER_TYPE as DT } from "../../config/driver-type";
import { GlassPanel } from "../rider/glass-panel";
import { type TripRequest as TripRequestType, formatNaira } from "./driver-data";

// ---------------------------------------------------------------------------
// Countdown Ring — SVG circular progress (compact)
// ---------------------------------------------------------------------------
const RING_SIZE = 56;
const RING_STROKE = 3.5;
const RING_RADIUS = (RING_SIZE - RING_STROKE) / 2;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

function CountdownRing({
  secondsLeft,
  totalSeconds,
  colorMode,
}: {
  secondsLeft: number;
  totalSeconds: number;
  colorMode: GlassColorMode;
}) {
  const c = GLASS_COLORS[colorMode];
  const d = colorMode === "dark";
  const progress = secondsLeft / totalSeconds;
  const offset = RING_CIRCUMFERENCE * (1 - progress);
  const isUrgent = secondsLeft <= 10;

  return (
    <div className="relative" style={{ width: RING_SIZE, height: RING_SIZE }}>
      <svg
        width={RING_SIZE}
        height={RING_SIZE}
        className="absolute inset-0 -rotate-90"
      >
        {/* Background track */}
        <circle
          cx={RING_SIZE / 2}
          cy={RING_SIZE / 2}
          r={RING_RADIUS}
          fill="none"
          stroke={d ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}
          strokeWidth={RING_STROKE}
        />
        {/* Progress ring */}
        <motion.circle
          cx={RING_SIZE / 2}
          cy={RING_SIZE / 2}
          r={RING_RADIUS}
          fill="none"
          stroke={isUrgent ? "#F59E0B" : BRAND_COLORS.green}
          strokeWidth={RING_STROKE}
          strokeLinecap="round"
          strokeDasharray={RING_CIRCUMFERENCE}
          strokeDashoffset={offset}
          style={{
            filter: isUrgent
              ? "drop-shadow(0 0 4px rgba(245,158,11,0.4))"
              : `drop-shadow(0 0 4px ${BRAND_COLORS.green}40)`,
          }}
        />
      </svg>
      {/* Center number */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.span
          key={secondsLeft}
          initial={{ scale: 1.15, opacity: 0.6 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.15 }}
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "18px",
            fontWeight: 700,
            letterSpacing: "-0.03em",
            lineHeight: "1",
            color: isUrgent ? "#F59E0B" : c.text.display,
          }}
        >
          {secondsLeft}
        </motion.span>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// TripRequestOverlay
// ---------------------------------------------------------------------------
interface Props {
  request: TripRequestType;
  colorMode: GlassColorMode;
  onAccept: (request: TripRequestType) => void;
  onDecline: (request: TripRequestType) => void;
  onTimeout: (request: TripRequestType) => void;
}

export function TripRequestOverlay({
  request,
  colorMode,
  onAccept,
  onDecline,
  onTimeout,
}: Props) {
  const c = GLASS_COLORS[colorMode];
  const d = colorMode === "dark";
  const [secondsLeft, setSecondsLeft] = useState(request.timeoutSeconds);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const hasTimedOut = useRef(false);

  // Countdown logic
  useEffect(() => {
    setSecondsLeft(request.timeoutSeconds);
    hasTimedOut.current = false;

    timerRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          if (!hasTimedOut.current) {
            hasTimedOut.current = true;
            setTimeout(() => onTimeout(request), 0);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [request, onTimeout]);

  const handleAccept = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    onAccept(request);
  }, [request, onAccept]);

  const handleDecline = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    onDecline(request);
  }, [request, onDecline]);

  const hasSurge = request.surgeMultiplier > 1;
  const isEV = request.vehicleType === "EV";
  const commission = request.estimate.fare - request.estimate.netEarnings;
  const isHotel = request.bookingSource === "hotel";

  return (
    <motion.div
      className="absolute inset-0 z-30 flex flex-col justify-end"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
    >
      {/* Scrim */}
      <div
        className="absolute inset-0"
        style={{
          background: d ? "rgba(0,0,0,0.65)" : "rgba(0,0,0,0.35)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
        }}
      />

      {/* Ambient pulse glow */}
      <motion.div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full"
        animate={{
          opacity: [0.03, 0.07, 0.03],
          scale: [0.95, 1.05, 0.95],
        }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          background: `radial-gradient(ellipse, ${BRAND_COLORS.green} 0%, transparent 65%)`,
        }}
      />

      {/* ── Request card ── */}
      <motion.div
        className="relative z-10 px-4 pb-4"
        initial={{ y: "100%", opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: "100%", opacity: 0 }}
        transition={{ type: "spring", stiffness: 320, damping: 30, delay: 0.05 }}
      >
        <GlassPanel
          variant={d ? "dark" : "light"}
          className="rounded-3xl overflow-hidden"
          blur={32}
        >
          {/* ═══════════════════════════════════════════════════════════════
              1. HEADER: "New ride" label + Countdown Ring
              ═══════════════════════════════════════════════════════════════ */}
          <div className="flex items-center justify-between px-5 pt-5 pb-1">
            <motion.span
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "16px",
                fontWeight: 600,
                letterSpacing: "-0.03em",
                lineHeight: "1.3",
                color: c.text.secondary,
              }}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12 }}
            >
              New ride request
            </motion.span>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 400, damping: 25 }}
            >
              <CountdownRing
                secondsLeft={secondsLeft}
                totalSeconds={request.timeoutSeconds}
                colorMode={colorMode}
              />
            </motion.div>
          </div>

          {/* ═══════════════════════════════════════════════════════════════
              HOTEL BADGE (conditional — only for hotel bookings)
              ═══════════════════════════════════════════════════════════════ */}
          {isHotel && (
            <motion.div
              className="flex items-center gap-2 mx-5 mb-1 px-3 py-2 rounded-xl"
              style={{
                background: d ? "rgba(29,185,84,0.06)" : "rgba(29,185,84,0.04)",
                border: `1px solid ${d ? "rgba(29,185,84,0.12)" : "rgba(29,185,84,0.08)"}`,
              }}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.14, ...MOTION.standard }}
            >
              <Building2 className="w-3.5 h-3.5 shrink-0" style={{ color: BRAND_COLORS.green }} />
              <div className="flex-1 min-w-0">
                <span style={{ ...DT.secondary, fontWeight: 600, color: BRAND_COLORS.green, display: "block" }}>
                  Hotel booking · {request.hotelName}
                </span>
                <span style={{ ...DT.meta, color: c.text.muted, display: "block", marginTop: "1px" }}>
                  Guest: {request.guestName}{request.roomNumber ? ` · Room ${request.roomNumber}` : ""} · Payment guaranteed
                </span>
              </div>
            </motion.div>
          )}

          {/* ═══════════════════════════════════════════════════════════════
              2. NET EARNINGS HERO
              ═══════════════════════════════════════════════════════════════ */}
          <motion.div
            className="px-5 pt-1 pb-3"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, ...MOTION.standard }}
          >
            <span
              style={{
                ...DT.hero,
                color: BRAND_COLORS.green,
                display: "block",
              }}
            >
              {formatNaira(request.estimate.netEarnings)}
            </span>
            <span
              style={{
                ...DT.meta,
                color: c.text.muted,
                display: "block",
                marginTop: "3px",
              }}
            >
              Fare {formatNaira(request.estimate.fare)} · Commission -{formatNaira(commission)}
            </span>
          </motion.div>

          {/* ═══════════════════════════════════════════════════════════════
              3. PICKUP COST
              ═══════════════════════════════════════════════════════════════ */}
          <motion.div
            className="flex items-center gap-2 mx-5 mb-3 px-3.5 py-2.5 rounded-xl"
            style={{ background: c.surface.subtle }}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, ...MOTION.standard }}
          >
            <Navigation
              className="w-3.5 h-3.5 shrink-0"
              style={{ color: BRAND_COLORS.green }}
            />
            <span
              style={{
                ...DT.secondary,
                fontWeight: 600,
                color: c.text.primary,
              }}
            >
              {request.pickup.distanceFromDriver} km
            </span>
            <span style={{ ...DT.meta, color: c.text.ghost }}>·</span>
            <span
              style={{
                ...DT.secondary,
                color: c.text.secondary,
              }}
            >
              {request.pickup.etaMinutes} min to pickup
            </span>
          </motion.div>

          {/* ═══════════════════════════════════════════════════════════════
              4. ROUTE
              ═══════════════════════════════════════════════════════════════ */}
          <motion.div
            className="flex items-start gap-3 px-5 mb-2.5"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, ...MOTION.standard }}
          >
            {/* Route dots */}
            <div className="flex flex-col items-center shrink-0 pt-1">
              <div
                className="w-2.5 h-2.5 rounded-full border-2 bg-transparent"
                style={{ borderColor: BRAND_COLORS.green }}
              />
              <div
                className="w-px my-1"
                style={{ height: 22, background: c.surface.hover }}
              />
              <div
                className="w-2.5 h-2.5 rounded-full"
                style={{ background: c.text.ghost }}
              />
            </div>
            {/* Addresses */}
            <div className="flex-1 min-w-0">
              <div className="mb-1">
                <span
                  style={{
                    ...DT.secondary,
                    fontWeight: 600,
                    color: c.text.primary,
                    display: "block",
                  }}
                >
                  {request.pickup.address}
                </span>
                <span
                  style={{
                    ...DT.meta,
                    color: c.text.muted,
                    display: "block",
                    marginTop: "1px",
                  }}
                >
                  {request.pickup.area}
                </span>
                {/* Hotel sub-location detail */}
                {isHotel && request.pickupDetail && (
                  <span
                    style={{
                      ...DT.meta,
                      color: BRAND_COLORS.green,
                      display: "block",
                      marginTop: "2px",
                    }}
                  >
                    {request.pickupDetail}
                  </span>
                )}
              </div>
              <div className="mt-2">
                <span
                  style={{
                    ...DT.secondary,
                    color: c.text.secondary,
                    display: "block",
                  }}
                >
                  {request.destination.address}
                </span>
                <span
                  style={{
                    ...DT.meta,
                    color: c.text.muted,
                    display: "block",
                    marginTop: "1px",
                  }}
                >
                  {request.destination.area}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Hotel driver notes */}
          {isHotel && request.driverNotes && (
            <motion.div
              className="flex items-start gap-2 mx-5 mb-3 px-3 py-2 rounded-xl"
              style={{ background: c.surface.subtle }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.27, ...MOTION.standard }}
            >
              <StickyNote className="w-3 h-3 shrink-0 mt-0.5" style={{ color: c.icon.muted }} />
              <span style={{ ...DT.meta, color: c.text.muted }}>
                {request.driverNotes}
              </span>
            </motion.div>
          )}

          {/* ═══════════════════════════════════════════════════════════════
              5. TRIP METRICS
              ═══════════════════════════════════════════════════════════════ */}
          <motion.div
            className="flex items-center gap-3 px-5 mb-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.28, ...MOTION.standard }}
          >
            <div className="flex items-center gap-1.5">
              <Route className="w-3 h-3" style={{ color: c.icon.muted }} />
              <span style={{ ...DT.meta, color: c.text.muted }}>
                {request.estimate.distance} km
              </span>
            </div>
            <span style={{ ...DT.meta, color: c.text.ghost }}>·</span>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3 h-3" style={{ color: c.icon.muted }} />
              <span style={{ ...DT.meta, color: c.text.muted }}>
                ~{request.estimate.duration} min
              </span>
            </div>
          </motion.div>

          {/* ═══════════════════════════════════════════════════════════════
              6–7. TRUST + PAYMENT + BADGES
              ═══════════════════════════════════════════════════════════════ */}
          <motion.div
            className="flex items-center justify-between px-5 mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, ...MOTION.standard }}
          >
            {/* Rider trust signal */}
            <div className="flex items-center gap-1.5">
              {isHotel ? (
                <>
                  <span style={{ ...DT.secondary, fontWeight: 600, color: c.text.primary }}>
                    {request.guestName || request.rider.name}
                  </span>
                  <span style={{ ...DT.meta, color: c.text.ghost }}>·</span>
                  <span style={{ ...DT.meta, color: c.text.muted }}>
                    Hotel guest
                  </span>
                </>
              ) : (
                <>
                  <span style={{ ...DT.secondary, fontWeight: 600, color: c.text.primary }}>
                    {request.rider.name}
                  </span>
                  <span style={{ ...DT.meta, color: c.text.ghost }}>·</span>
                  <Star
                    className="w-3 h-3"
                    style={{ color: BRAND_COLORS.green, fill: BRAND_COLORS.green }}
                  />
                  <span style={{ ...DT.meta, color: c.text.muted }}>
                    {request.rider.rating}
                  </span>
                  <span style={{ ...DT.meta, color: c.text.ghost }}>·</span>
                  <span style={{ ...DT.meta, color: c.text.muted }}>
                    {request.rider.trips} rides
                  </span>
                </>
              )}
            </div>

            {/* Payment + badges cluster */}
            <div className="flex items-center gap-1.5">
              {/* Payment chip */}
              <div
                className="flex items-center gap-1 px-1.5 py-0.5 rounded-md"
                style={{ background: isHotel ? c.green.evBg : c.surface.subtle }}
              >
                {isHotel ? (
                  <Building2 className="w-3 h-3" style={{ color: BRAND_COLORS.green }} />
                ) : request.paymentType === "cash" ? (
                  <Banknote className="w-3 h-3" style={{ color: c.icon.muted }} />
                ) : (
                  <Smartphone className="w-3 h-3" style={{ color: c.icon.muted }} />
                )}
                <span
                  style={{
                    ...DT.meta,
                    fontSize: "11px",
                    color: isHotel ? BRAND_COLORS.green : c.text.muted,
                    textTransform: "capitalize" as const,
                  }}
                >
                  {isHotel ? "Hotel acct" : request.paymentType}
                </span>
              </div>

              {/* Surge badge */}
              {hasSurge && (
                <motion.div
                  className="flex items-center gap-1 px-1.5 py-0.5 rounded-md"
                  style={{ background: "rgba(245,158,11,0.1)" }}
                  animate={{
                    boxShadow: [
                      "0 0 0px rgba(245,158,11,0)",
                      "0 0 6px rgba(245,158,11,0.15)",
                      "0 0 0px rgba(245,158,11,0)",
                    ],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <TrendingUp className="w-3 h-3" style={{ color: "#F59E0B" }} />
                  <span
                    style={{
                      ...DT.meta,
                      fontSize: "11px",
                      fontWeight: 600,
                      color: "#F59E0B",
                    }}
                  >
                    {request.surgeMultiplier}x
                  </span>
                </motion.div>
              )}

              {/* EV badge */}
              {isEV && (
                <div
                  className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-md"
                  style={{ background: c.green.evBg }}
                >
                  <Zap className="w-3 h-3" style={{ color: c.green.evText }} />
                  <span
                    style={{
                      ...DT.meta,
                      fontSize: "11px",
                      fontWeight: 600,
                      color: c.green.evText,
                    }}
                  >
                    EV
                  </span>
                </div>
              )}
            </div>
          </motion.div>

          {/* ═══════════════════════════════════════════════════════════════
              8. ACCEPT CTA — shimmer green
              ═══════════════════════════════════════════════════════════════ */}
          <motion.div
            className="px-5 pb-2"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.33, ...MOTION.standard }}
          >
            <motion.button
              className="w-full flex items-center justify-center gap-2.5 relative overflow-hidden"
              style={{
                height: 52,
                borderRadius: 14,
                background: BRAND_COLORS.green,
                boxShadow: `0 4px 20px ${BRAND_COLORS.green}30`,
                border: "none",
                cursor: "pointer",
              }}
              onClick={handleAccept}
              whileTap={{ scale: 0.97 }}
            >
              {/* Shimmer */}
              <motion.div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.08) 50%, transparent 100%)",
                }}
                animate={{ x: ["-100%", "100%"] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  repeatDelay: 1,
                }}
              />
              <span
                style={{
                  ...DT.cta,
                  color: "#fff",
                  position: "relative",
                  zIndex: 1,
                }}
              >
                Accept ride
              </span>
            </motion.button>
          </motion.div>

          {/* ═══════════════════════════════════════════════════════════════
              9. DECLINE — quiet muted text link
              ═══════════════════════════════════════════════════════════════ */}
          <motion.div
            className="text-center pb-5 pt-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.38 }}
          >
            <motion.button
              onClick={handleDecline}
              whileTap={{ scale: 0.95 }}
              style={{
                ...DT.secondary,
                color: c.text.muted,
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "8px 16px",
              }}
            >
              Decline
            </motion.button>
          </motion.div>
        </GlassPanel>
      </motion.div>
    </motion.div>
  );
}