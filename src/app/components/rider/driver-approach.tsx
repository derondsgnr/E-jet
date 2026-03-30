 /**
 * Driver Approach — Variation A "Tracker"
 *
 * NORTHSTAR: Uber ride tracking + Apple Maps spatial awareness
 * - Map-dominant (55-60%), driver car icon moving toward pickup
 * - Compact bottom card that transforms per state
 * - Live ETA countdown as the hero metric
 * - OTP appears inline within the card — not a separate screen
 *
 * WHY THIS LAYOUT:
 * - Uber proved that spatial context (seeing the car on the map) is the
 *   #1 anxiety reducer during the wait. The map IS the reassurance.
 * - Apple Maps' "arrival" pattern: the info card stays compact, the map
 *   does the heavy lifting. Progressive disclosure in the card itself.
 * - Compact card means more map visibility = more trust.
 *
 * SPINE COMPLIANCE: GlassPanel, MapCanvas, green-as-scalpel,
 * Montserrat/Manrope, motion stagger, noise + glow.
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Phone,
  MessageSquare,
  Share2,
  Shield,
  Star,
  Car,
  Navigation,
  X,
  ChevronUp,
} from "lucide-react";
import {
  GLASS_COLORS,
  GLASS_TYPE,
  type GlassColorMode,
} from "../../config/project";
import { BRAND_COLORS } from "../../config/brand";
import { GlassPanel } from "./glass-panel";
import { MapCanvas } from "./map-canvas";
import { JetConfirm } from "./jet-confirm";
import {
  CancelReasonSheet,
  RIDER_CANCEL_REASONS,
  type CancelReason,
} from "./cancel-reason-sheet";
import {
  mockDriver,
  mockRoute,
  mockOTP,
  approachSteps,
  type ApproachState,
} from "./booking-data";

const SPRING = { type: "spring" as const, stiffness: 500, damping: 32, mass: 0.8 };
const SPRING_BOUNCY = { type: "spring" as const, stiffness: 400, damping: 22, mass: 0.6 };

interface DriverApproachAProps {
  colorMode?: GlassColorMode;
  onCancel?: () => void;
  onRideStart?: () => void;
  onCall?: () => void;
  onMessage?: () => void;
  onSafety?: () => void;
}

export function DriverApproach({
  colorMode = "dark",
  onCancel,
  onRideStart,
  onCall,
  onMessage,
  onSafety,
}: DriverApproachAProps) {
  const c = GLASS_COLORS[colorMode];
  const d = colorMode === "dark";

  const [state, setState] = useState<ApproachState>("assigned");
  const [otpRevealed, setOtpRevealed] = useState(false);
  const [etaSeconds, setEtaSeconds] = useState(240); // 4 min
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [showCancelReasons, setShowCancelReasons] = useState(false);
  const [cancelReason, setCancelReason] = useState<CancelReason | null>(null);

  // Cancel messaging per state
  const cancelMessage = state === "assigned" || state === "en-route"
    ? "Your driver is on the way. You may be charged a cancellation fee."
    : "Your driver is almost here. A cancellation fee will apply.";

  // Auto-advance states for demo
  useEffect(() => {
    const timers = [
      setTimeout(() => setState("en-route"), 3000),
      setTimeout(() => setState("arriving"), 6000),
      setTimeout(() => setState("here"), 8500),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  // ETA countdown
  useEffect(() => {
    if (state === "here") return;
    const interval = setInterval(() => {
      setEtaSeconds((s) => Math.max(0, s - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [state]);

  // Update ETA on state change
  useEffect(() => {
    if (state === "en-route") setEtaSeconds(120);
    if (state === "arriving") setEtaSeconds(45);
    if (state === "here") setEtaSeconds(0);
  }, [state]);

  const currentStep = approachSteps.find((s) => s.id === state)!;
  const stateIndex = approachSteps.findIndex((s) => s.id === state);
  const formatEta = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return m > 0 ? `${m}:${sec.toString().padStart(2, "0")}` : `0:${sec.toString().padStart(2, "0")}`;
  };

  return (
    <div
      className="relative h-screen w-full overflow-hidden flex flex-col"
      style={{ background: c.bg }}
    >
      {/* ── Map (dominant — 55%) ── */}
      <div className="relative flex-1">
        <MapCanvas variant="muted" colorMode={colorMode} />

        {/* Map overlays */}
        {d && (
          <div className="absolute inset-0 bg-gradient-to-b from-[#0B0B0D]/40 via-transparent to-[#0B0B0D]/70 z-[1]" />
        )}
        {!d && (
          <div
            className="absolute inset-0 z-[1]"
            style={{
              background:
                "linear-gradient(to bottom, rgba(250,250,250,0.3) 0%, transparent 40%, rgba(250,250,250,0.7) 100%)",
            }}
          />
        )}

        {/* Animated car icon on map */}
        <motion.div
          className="absolute z-[2]"
          style={{ left: "55%", top: "35%" }}
          animate={{
            y: state === "here" ? 80 : state === "arriving" ? 50 : state === "en-route" ? 20 : 0,
            x: state === "here" ? -20 : state === "arriving" ? -10 : 0,
          }}
          transition={{ duration: 2, ease: "easeInOut" }}
        >
          <motion.div
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ background: BRAND_COLORS.green, boxShadow: `0 0 20px ${BRAND_COLORS.green}50` }}
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Car className="w-5 h-5" style={{ color: "#fff" }} />
          </motion.div>
        </motion.div>

        {/* Pickup pin */}
        <motion.div
          className="absolute z-[2]"
          style={{ left: "48%", top: "55%" }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={SPRING_BOUNCY}
        >
          <div
            className="w-3 h-3 rounded-full"
            style={{
              background: BRAND_COLORS.green,
              boxShadow: `0 0 0 6px ${BRAND_COLORS.green}20, 0 0 0 12px ${BRAND_COLORS.green}10`,
            }}
          />
        </motion.div>

        {/* Header controls */}
        <div
          className="absolute top-0 left-0 right-0 z-10 px-5 flex items-center justify-between"
          style={{ paddingTop: "calc(env(safe-area-inset-top, 12px) + 12px)" }}
        >
          <motion.button
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: c.surface.button, backdropFilter: "blur(16px)" }}
            onClick={() => setShowCancelConfirm(true)}
            whileTap={{ scale: 0.92 }}
          >
            <X className="w-[18px] h-[18px]" style={{ color: c.icon.primary }} />
          </motion.button>

          <motion.button
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: c.surface.button, backdropFilter: "blur(16px)" }}
            whileTap={{ scale: 0.92 }}
          >
            <Share2 className="w-4 h-4" style={{ color: c.icon.primary }} />
          </motion.button>
        </div>

        {/* Live ETA badge on map */}
        {state !== "here" && (
          <motion.div
            className="absolute top-0 left-1/2 -translate-x-1/2 z-10"
            style={{ marginTop: "calc(env(safe-area-inset-top, 12px) + 16px)" }}
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ ...SPRING, delay: 0.3 }}
          >
            <GlassPanel
              variant={d ? "dark" : "light"}
              blur={20}
              className="px-4 py-2 rounded-full"
            >
              <div className="flex items-center gap-2">
                <motion.div
                  className="w-2 h-2 rounded-full"
                  style={{ background: BRAND_COLORS.green }}
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
                <span style={{ ...GLASS_TYPE.bodySmall, color: c.text.primary }}>
                  {formatEta(etaSeconds)}
                </span>
                <span style={{ ...GLASS_TYPE.caption, color: c.text.muted }}>away</span>
              </div>
            </GlassPanel>
          </motion.div>
        )}
      </div>

      {/* ── Bottom card (compact, transforms per state) ── */}
      <motion.div
        className="relative z-20"
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={SPRING}
      >
        <GlassPanel
          variant={d ? "dark" : "light"}
          blur={24}
          className="rounded-t-3xl px-5 pt-5"
          style={{ paddingBottom: "max(env(safe-area-inset-bottom, 24px), 24px)" }}
        >
          {/* Progress dots */}
          <div className="flex items-center gap-1.5 mb-4">
            {approachSteps.map((step, i) => (
              <motion.div
                key={step.id}
                className="h-1 rounded-full flex-1"
                style={{
                  background:
                    i <= stateIndex ? BRAND_COLORS.green : c.surface.subtle,
                }}
                animate={{
                  background:
                    i <= stateIndex ? BRAND_COLORS.green : c.surface.subtle,
                }}
                transition={{ duration: 0.3 }}
              />
            ))}
          </div>

          {/* State label */}
          <AnimatePresence mode="wait">
            <motion.div
              key={state}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="mb-4"
            >
              <div style={{ ...GLASS_TYPE.display, fontSize: "20px", lineHeight: "1.3", color: c.text.primary }}>
                {currentStep.label}
              </div>
              <div className="mt-0.5" style={{ ...GLASS_TYPE.bodySmall, color: c.text.muted }}>
                {currentStep.sublabel}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Driver row */}
          <div className="flex items-center gap-3 mb-0">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center shrink-0 relative"
              style={{ background: c.green.tint }}
            >
              <span style={{ ...GLASS_TYPE.body, color: BRAND_COLORS.green }}>
                {mockDriver.avatarInitials}
              </span>
              <motion.div
                className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full flex items-center justify-center"
                style={{ background: c.bg }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ ...SPRING_BOUNCY, delay: 0.3 }}
              >
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: BRAND_COLORS.green }} />
              </motion.div>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span style={{ ...GLASS_TYPE.body, color: c.text.primary }}>{mockDriver.name}</span>
                <Star className="w-3 h-3" style={{ color: BRAND_COLORS.green, fill: BRAND_COLORS.green }} />
                <span style={{ ...GLASS_TYPE.caption, color: c.text.secondary }}>{mockDriver.rating}</span>
              </div>
              <div style={{ ...GLASS_TYPE.caption, color: c.text.muted }}>
                {mockDriver.vehicle} · {mockDriver.color} · {mockDriver.plate}
              </div>
            </div>

            {/* Inline ETA hero metric (from C) */}
            {state !== "here" && (
              <motion.div
                className="text-right shrink-0"
                key={state}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={SPRING_BOUNCY}
              >
                <div style={{ ...GLASS_TYPE.display, fontSize: "22px", color: BRAND_COLORS.green }}>
                  {formatEta(etaSeconds)}
                </div>
                <div style={{ ...GLASS_TYPE.caption, color: c.text.muted }}>away</div>
              </motion.div>
            )}
          </div>

          {/* Divider */}
          <div className="mx-0 my-3 h-px" style={{ background: c.surface.subtle }} />

          {/* Action bar (C layout — full-width buttons with labels) */}
          <div className="flex items-center gap-3 mb-4">
            {[
              { icon: Phone, label: "Call", action: onCall },
              { icon: MessageSquare, label: "Message", action: onMessage },
              { icon: Shield, label: "Safety", action: onSafety },
            ].map(({ icon: Icon, label, action }, i) => (
              <motion.button
                key={label}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl"
                style={{ background: c.surface.subtle }}
                onClick={action}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...SPRING, delay: 0.2 + i * 0.06 }}
              >
                <Icon className="w-4 h-4" style={{ color: c.icon.secondary }} />
                <span style={{ ...GLASS_TYPE.caption, color: c.text.secondary }}>{label}</span>
              </motion.button>
            ))}
          </div>

          {/* OTP section — appears when driver arrives */}
          <AnimatePresence>
            {state === "here" && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={SPRING}
              >
                <motion.button
                  className="w-full rounded-2xl px-4 py-5 mb-4 flex flex-col items-center"
                  style={{
                    background: d ? "rgba(29,185,84,0.08)" : "rgba(29,185,84,0.05)",
                    border: `1px solid ${BRAND_COLORS.green}25`,
                  }}
                  onClick={() => setOtpRevealed(!otpRevealed)}
                  whileTap={{ scale: 0.98 }}
                >
                  {/* Shield icon — centered hero anchor */}
                  <motion.div
                    className="w-9 h-9 rounded-full flex items-center justify-center mb-3"
                    style={{
                      background: d ? "rgba(29,185,84,0.12)" : "rgba(29,185,84,0.08)",
                    }}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={SPRING_BOUNCY}
                  >
                    <Shield className="w-4 h-4" style={{ color: BRAND_COLORS.green }} />
                  </motion.div>

                  {/* Title */}
                  <div style={{ ...GLASS_TYPE.caption, color: c.text.muted, letterSpacing: "0.06em" }}>
                    RIDE VERIFICATION PIN
                  </div>
                  <div className="mt-0.5 mb-4" style={{ ...GLASS_TYPE.caption, color: c.text.faint }}>
                    Share this code with your driver
                  </div>

                  {/* OTP digits — single centered row */}
                  {otpRevealed ? (
                    <motion.div
                      className="flex items-center justify-center gap-5"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={SPRING_BOUNCY}
                    >
                      {mockOTP.digits.map((digit, i) => (
                        <motion.span
                          key={i}
                          style={{
                            ...GLASS_TYPE.display,
                            fontSize: "32px",
                            color: BRAND_COLORS.green,
                          }}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ ...SPRING, delay: i * 0.08 }}
                        >
                          {digit}
                        </motion.span>
                      ))}
                    </motion.div>
                  ) : (
                    <div className="flex items-center justify-center gap-3">
                      {[0, 1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className="w-10 h-10 rounded-xl"
                          style={{ background: c.surface.subtle }}
                        />
                      ))}
                    </div>
                  )}

                  {/* Tap hint — below digits */}
                  {!otpRevealed && (
                    <div className="mt-3" style={{ ...GLASS_TYPE.caption, color: BRAND_COLORS.green }}>
                      Tap to reveal
                    </div>
                  )}
                </motion.button>

                {/* Start ride CTA */}
                <motion.button
                  className="w-full py-4 rounded-2xl flex items-center justify-center gap-2 relative overflow-hidden"
                  style={{ background: BRAND_COLORS.green }}
                  onClick={onRideStart}
                  whileTap={{ scale: 0.97 }}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ ...SPRING, delay: 0.2 }}
                >
                  <motion.div
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.12) 50%, transparent 60%)",
                    }}
                    animate={{ x: ["-100%", "200%"] }}
                    transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 3, ease: "linear" }}
                  />
                  <Navigation className="w-4 h-4 relative z-10" style={{ color: "#fff" }} />
                  <span className="relative z-10" style={{ ...GLASS_TYPE.body, color: "#fff" }}>
                    Start ride
                  </span>
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Cancel option (before driver arrives) */}
          {state !== "here" && (
            <motion.button
              className="w-full py-3 rounded-xl flex items-center justify-center"
              style={{ background: c.surface.subtle }}
              onClick={() => setShowCancelConfirm(true)}
              whileTap={{ scale: 0.97 }}
            >
              <span style={{ ...GLASS_TYPE.bodySmall, color: c.text.muted }}>Cancel ride</span>
            </motion.button>
          )}
        </GlassPanel>
      </motion.div>

      {/* Cancel confirmation — step 1 */}
      <JetConfirm
        open={showCancelConfirm}
        colorMode={colorMode}
        title="Cancel ride?"
        message={cancelMessage}
        confirmLabel="Cancel ride"
        cancelLabel="Keep ride"
        destructive
        onConfirm={() => {
          setShowCancelConfirm(false);
          setShowCancelReasons(true);
        }}
        onCancel={() => setShowCancelConfirm(false)}
      />

      {/* Cancel reason — step 2 */}
      <CancelReasonSheet
        open={showCancelReasons}
        colorMode={colorMode}
        reasons={RIDER_CANCEL_REASONS}
        onSelect={() => {
          setShowCancelReasons(false);
          onCancel?.();
        }}
        onDismiss={() => setShowCancelReasons(false)}
      />
    </div>
  );
}