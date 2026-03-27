 /**
 * ActiveTrip — Post-accept driver flow.
 *
 * State machine: navigating_to_pickup → arrived_at_pickup → in_trip → completed
 *
 * LAYOUT DNA: Mirrors rider's in-ride-screen.tsx + driver-approach-a.tsx
 * - h-screen flex flex-col root
 * - Map via MapCanvas (flex-1 region)
 * - Bottom card: GlassPanel rounded-t-3xl + safe-area
 * - Action bar: flex-1 rounded-xl buttons (Call / Chat only)
 * - Navigate FAB floats on map, outside bottom sheet
 * - Progress dots across phases
 * - NO double-line pills — all pills single-line, whitespace-nowrap
 * - Timer/ETA inline with heading, not floating on map
 *
 * RIDER-DRIVER SYNC:
 * - Chat mirrors rider's in-ride chat (sender flipped to "driver")
 * - OTP verification at arrived_at_pickup (driver enters code rider shares)
 * - Same mockOTP data shared across both apps
 * - Cancel flow with JetConfirm, per-phase messaging, always available
 *
 * DRIVER TYPOGRAPHY: Nothing below 13px. Hero at 44px.
 */

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Phone,
  MessageSquare,
  Navigation,
  X,
  MapPin,
  Clock,
  Star,
  Shield,
  CheckCircle2,
  Banknote,
  Smartphone,
  Zap,
  Send,
  Building2,
} from "lucide-react";
import {
  GLASS_COLORS,
  MOTION,
  type GlassColorMode,
} from "../../config/project";
import { BRAND_COLORS } from "../../config/brand";
import { DRIVER_TYPE as DT } from "../../config/driver-type";
import { GlassPanel } from "../rider/glass-panel";
import { MapCanvas } from "../rider/map-canvas";
import { JetConfirm } from "../rider/jet-confirm";
import {
  CancelReasonSheet,
  DRIVER_CANCEL_REASONS,
  type CancelReason,
} from "../rider/cancel-reason-sheet";
import {
  type TripRequest,
  type ChatMessage,
  formatNaira,
  MOCK_DRIVER_CHAT,
  TRIP_OTP,
  TRIP_END_OTP,
} from "./driver-data";

// ---------------------------------------------------------------------------
// Trip phases
// ---------------------------------------------------------------------------
export type TripPhase =
  | "navigating_to_pickup"
  | "arrived_at_pickup"
  | "in_trip"
  | "completed";

const PHASES: { id: TripPhase; label: string }[] = [
  { id: "navigating_to_pickup", label: "En route" },
  { id: "arrived_at_pickup", label: "At pickup" },
  { id: "in_trip", label: "In trip" },
  { id: "completed", label: "Complete" },
];

const SPRING = { type: "spring" as const, stiffness: 500, damping: 32, mass: 0.8 };
const SPRING_BOUNCY = { type: "spring" as const, stiffness: 400, damping: 22, mass: 0.6 };

// Cancel reason & messaging per phase
const CANCEL_CONFIG: Record<
  Exclude<TripPhase, "completed">,
  { title: string; message: string; confirmLabel: string }
> = {
  navigating_to_pickup: {
    title: "Cancel trip?",
    message: "Your acceptance rate will be affected. This may impact future trip requests.",
    confirmLabel: "Cancel trip",
  },
  arrived_at_pickup: {
    title: "Cancel trip?",
    message:
      "You've already arrived at the pickup. A cancellation fee may be charged to the rider.",
    confirmLabel: "Cancel trip",
  },
  in_trip: {
    title: "End trip early?",
    message:
      "The rider will be dropped off at the current location. You'll earn a partial fare.",
    confirmLabel: "End trip",
  },
};

// ---------------------------------------------------------------------------
// ActiveTrip
// ---------------------------------------------------------------------------
export interface ActiveTripProps {
  request: TripRequest;
  colorMode: GlassColorMode;
  onTripComplete: (request: TripRequest) => void;
  onTripCancel: (request: TripRequest) => void;
  showToast: (config: {
    message: string;
    variant?: "success" | "error" | "info" | "warning";
    duration?: number;
  }) => void;
}

export function ActiveTrip({
  request,
  colorMode,
  onTripComplete,
  onTripCancel,
  showToast,
}: ActiveTripProps) {
  const c = GLASS_COLORS[colorMode];
  const d = colorMode === "dark";
  const [phase, setPhase] = useState<TripPhase>("navigating_to_pickup");
  const phaseIndex = PHASES.findIndex((p) => p.id === phase);

  // Cancel
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [showCancelReasons, setShowCancelReasons] = useState(false);

  // Chat
  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(MOCK_DRIVER_CHAT);
  const [chatInput, setChatInput] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);

  // OTP
  const [otpInput, setOtpInput] = useState<string[]>(["", "", "", ""]);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpError, setOtpError] = useState(false);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Trip-end OTP
  const [endOtpInput, setEndOtpInput] = useState<string[]>(["", "", "", ""]);
  const [endOtpVerified, setEndOtpVerified] = useState(false);
  const [endOtpError, setEndOtpError] = useState(false);
  const endOtpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Timers
  const [pickupEta, setPickupEta] = useState(request.pickup.etaMinutes);
  const [waitSeconds, setWaitSeconds] = useState(0);
  const [tripEta, setTripEta] = useState(request.estimate.duration);
  const [tripElapsed, setTripElapsed] = useState(0);
  const [tripProgress, setTripProgress] = useState(0);

  useEffect(() => {
    if (phase !== "navigating_to_pickup") return;
    const t = setInterval(() => setPickupEta((p) => Math.max(0, p - 1)), 5000);
    return () => clearInterval(t);
  }, [phase]);

  useEffect(() => {
    if (phase !== "arrived_at_pickup") return;
    const t = setInterval(() => setWaitSeconds((p) => p + 1), 1000);
    return () => clearInterval(t);
  }, [phase]);

  useEffect(() => {
    if (phase !== "in_trip") return;
    const dur = request.estimate.duration;
    const t = setInterval(() => {
      setTripEta((p) => Math.max(0, p - 1));
      setTripElapsed((p) => p + 1);
      setTripProgress((p) => Math.min(1, p + 1 / dur));
    }, 4000);
    return () => clearInterval(t);
  }, [phase, request.estimate.duration]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, showChat]);

  useEffect(() => {
    if (phase === "arrived_at_pickup" && !otpVerified) {
      setTimeout(() => otpRefs.current[0]?.focus(), 400);
    }
  }, [phase, otpVerified]);

  // ── Handlers ──
  const handleArrive = useCallback(() => {
    setPhase("arrived_at_pickup");
    showToast({ message: "You've arrived — enter rider's PIN to start", variant: "success" });
  }, [showToast]);

  const handleStartTrip = useCallback(() => {
    setPhase("in_trip");
    showToast({ message: "Trip started — drive safely", variant: "success" });
  }, [showToast]);

  const handleCompleteTrip = useCallback(() => {
    setPhase("completed");
    showToast({ message: "Trip completed!", variant: "success" });
  }, [showToast]);

  const handleDone = useCallback(() => {
    onTripComplete(request);
  }, [request, onTripComplete]);

  const handleCancelConfirm = useCallback(() => {
    setShowCancelConfirm(false);
    // Step 2: show reason picker
    setShowCancelReasons(true);
  }, []);

  const handleCancelWithReason = useCallback(
    (reason: CancelReason) => {
      setShowCancelReasons(false);
      onTripCancel(request);
      showToast({ message: `Trip cancelled — ${reason.label.toLowerCase()}`, variant: "info" });
    },
    [request, onTripCancel, showToast],
  );

  // Chat
  const handleSendMessage = useCallback(() => {
    if (!chatInput.trim()) return;
    const time = new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
    setChatMessages((prev) => [
      ...prev,
      { id: `d-${Date.now()}`, sender: "driver", text: chatInput.trim(), time },
    ]);
    setChatInput("");
    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        {
          id: `r-${Date.now()}`,
          sender: "rider",
          text: "Okay, noted! 👍",
          time: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
        },
      ]);
    }, 2500);
  }, [chatInput]);

  // OTP
  const handleOtpChange = useCallback(
    (index: number, value: string) => {
      if (!/^\d?$/.test(value)) return;
      const next = [...otpInput];
      next[index] = value;
      setOtpInput(next);
      setOtpError(false);
      if (value && index < 3) otpRefs.current[index + 1]?.focus();
      if (value && index === 3) {
        const code = next.join("");
        if (code === TRIP_OTP.code) {
          setOtpVerified(true);
          showToast({ message: "PIN verified — ready to start", variant: "success" });
        } else {
          setOtpError(true);
          setOtpInput(["", "", "", ""]);
          setTimeout(() => otpRefs.current[0]?.focus(), 200);
          showToast({ message: "Wrong PIN — ask rider again", variant: "error" });
        }
      }
    },
    [otpInput, showToast],
  );

  const handleOtpKeyDown = useCallback(
    (index: number, e: React.KeyboardEvent) => {
      if (e.key === "Backspace" && !otpInput[index] && index > 0) {
        otpRefs.current[index - 1]?.focus();
      }
    },
    [otpInput],
  );

  // Trip-end OTP
  const handleEndOtpChange = useCallback(
    (index: number, value: string) => {
      if (!/^\d?$/.test(value)) return;
      const next = [...endOtpInput];
      next[index] = value;
      setEndOtpInput(next);
      setEndOtpError(false);
      if (value && index < 3) endOtpRefs.current[index + 1]?.focus();
      if (value && index === 3) {
        const code = next.join("");
        if (code === TRIP_END_OTP.code) {
          setEndOtpVerified(true);
          showToast({ message: "PIN verified — ready to complete", variant: "success" });
        } else {
          setEndOtpError(true);
          setEndOtpInput(["", "", "", ""]);
          setTimeout(() => endOtpRefs.current[0]?.focus(), 200);
          showToast({ message: "Wrong PIN — ask rider again", variant: "error" });
        }
      }
    },
    [endOtpInput, showToast],
  );

  const handleEndOtpKeyDown = useCallback(
    (index: number, e: React.KeyboardEvent) => {
      if (e.key === "Backspace" && !endOtpInput[index] && index > 0) {
        endOtpRefs.current[index - 1]?.focus();
      }
    },
    [endOtpInput],
  );

  // ── Derived ──
  const hasSurge = request.surgeMultiplier > 1;
  const isEV = request.vehicleType === "EV";
  const waitMin = Math.floor(waitSeconds / 60);
  const waitSec = waitSeconds % 60;
  const kmRemaining = Math.max(0, +(request.estimate.distance * (1 - tripProgress)).toFixed(1));
  const cancelConfig = phase !== "completed" ? CANCEL_CONFIG[phase] : null;

  // Car position
  const carX =
    phase === "navigating_to_pickup"
      ? 55 - pickupEta * 2
      : phase === "in_trip"
        ? 30 + tripProgress * 40
        : 48;
  const carY =
    phase === "navigating_to_pickup"
      ? 35 + pickupEta
      : phase === "in_trip"
        ? 55 - tripProgress * 30
        : 55;

  return (
    <div
      className="relative h-screen w-full overflow-hidden flex flex-col"
      style={{ background: c.bg }}
    >
      {/* ── Map ── */}
      {phase !== "completed" && (
        <div className="relative flex-1">
          <MapCanvas variant="muted" colorMode={colorMode} />

          {/* Map gradient overlays */}
          {d ? (
            <div className="absolute inset-0 bg-gradient-to-b from-[#0B0B0D]/40 via-transparent to-[#0B0B0D]/70 z-[1]" />
          ) : (
            <div
              className="absolute inset-0 z-[1]"
              style={{
                background:
                  "linear-gradient(to bottom, rgba(250,250,250,0.3) 0%, transparent 40%, rgba(250,250,250,0.7) 100%)",
              }}
            />
          )}

          {/* Car icon */}
          <motion.div
            className="absolute z-[2]"
            style={{ left: `${carX}%`, top: `${carY}%` }}
            animate={{ left: `${carX}%`, top: `${carY}%` }}
            transition={{ duration: 2, ease: "easeInOut" }}
          >
            <motion.div
              className="w-10 h-10 rounded-full flex items-center justify-center -translate-x-1/2 -translate-y-1/2"
              style={{
                background: BRAND_COLORS.green,
                boxShadow: `0 0 20px ${BRAND_COLORS.green}50`,
              }}
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Navigation className="w-5 h-5" style={{ color: "#fff", transform: "rotate(-45deg)" }} />
            </motion.div>
          </motion.div>

          {/* Pickup pin */}
          {phase === "navigating_to_pickup" && (
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
          )}

          {/* Destination pin (in_trip) */}
          {phase === "in_trip" && (
            <motion.div className="absolute z-[3]" style={{ left: "70%", top: "23%" }}>
              <motion.div
                className="w-3 h-3 rounded-full"
                style={{
                  background: BRAND_COLORS.green,
                  boxShadow: `0 0 0 5px ${BRAND_COLORS.green}20, 0 0 0 10px ${BRAND_COLORS.green}10`,
                }}
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ duration: 2.5, repeat: Infinity }}
              />
            </motion.div>
          )}

          {/* ── Top status pill (single-line, compact) ── */}
          <div
            className="absolute top-0 left-0 right-0 z-10 px-5"
            style={{ paddingTop: "calc(env(safe-area-inset-top, 12px) + 12px)" }}
          >
            <GlassPanel
              variant={d ? "dark" : "light"}
              blur={20}
              className="px-3 py-2 rounded-full inline-flex"
            >
              <div className="flex items-center gap-1.5" style={{ whiteSpace: "nowrap" }}>
                <motion.div
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ background: BRAND_COLORS.green }}
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
                <span style={{ ...DT.meta, color: c.text.primary }}>
                  {PHASES[phaseIndex]?.label}
                </span>
                {hasSurge && (
                  <span style={{ ...DT.meta, fontSize: "11px", color: "#F59E0B" }}>
                    {request.surgeMultiplier}x
                  </span>
                )}
                {isEV && (
                  <Zap className="w-3 h-3 shrink-0" style={{ color: BRAND_COLORS.green }} />
                )}
              </div>
            </GlassPanel>
          </div>

          {/* ── Navigate FAB — floats on map above bottom card ── */}
          {(phase === "navigating_to_pickup" || phase === "in_trip") && (
            <motion.button
              className="absolute z-10 right-5 flex items-center justify-center"
              style={{
                bottom: 20,
                width: 52,
                height: 52,
                borderRadius: 16,
                background: BRAND_COLORS.green,
                boxShadow: `0 4px 20px ${BRAND_COLORS.green}40, 0 2px 8px rgba(0,0,0,0.15)`,
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={SPRING_BOUNCY}
              whileTap={{ scale: 0.9 }}
            >
              <Navigation className="w-5 h-5" style={{ color: "#fff", transform: "rotate(-45deg)" }} />
            </motion.button>
          )}
        </div>
      )}

      {/* ── Bottom card ── */}
      <AnimatePresence mode="wait">
        {phase !== "completed" && (
          <motion.div
            key={phase}
            className="relative z-20"
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100, opacity: 0 }}
            transition={SPRING}
          >
            <GlassPanel
              variant={d ? "dark" : "light"}
              blur={24}
              className="rounded-t-3xl px-5 pt-5"
              style={{ paddingBottom: "max(env(safe-area-inset-bottom, 24px), 24px)" }}
            >
              {/* Phase progress dots */}
              <div className="flex items-center gap-1.5 mb-4">
                {PHASES.map((step, i) => (
                  <motion.div
                    key={step.id}
                    className="h-1 rounded-full flex-1"
                    style={{
                      background: i <= phaseIndex ? BRAND_COLORS.green : c.surface.subtle,
                    }}
                    animate={{
                      background: i <= phaseIndex ? BRAND_COLORS.green : c.surface.subtle,
                    }}
                    transition={{ duration: 0.3 }}
                  />
                ))}
              </div>

              {/* ════════════════ NAVIGATING TO PICKUP ══════��═════════ */}
              {phase === "navigating_to_pickup" && (
                <>
                  {/* Heading row — title + inline ETA */}
                  <div className="flex items-start justify-between gap-3 mb-1">
                    <div style={{ ...DT.heading, color: c.text.primary }}>
                      Heading to pickup
                    </div>
                    <div
                      className="shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-lg"
                      style={{
                        background: c.green.tint,
                        whiteSpace: "nowrap",
                      }}
                    >
                      <span
                        style={{
                          fontFamily: "var(--font-heading)",
                          fontSize: "15px",
                          fontWeight: 600,
                          letterSpacing: "-0.02em",
                          color: BRAND_COLORS.green,
                        }}
                      >
                        {pickupEta} min
                      </span>
                      <span style={{ ...DT.meta, fontSize: "11px", color: c.text.muted }}>
                        · {request.pickup.distanceFromDriver} km
                      </span>
                    </div>
                  </div>
                  <div className="mb-1" style={{ ...DT.secondary, color: c.text.muted }}>
                    {request.pickup.address}, {request.pickup.area}
                  </div>
                  {request.bookingSource === "hotel" && request.pickupDetail && (
                    <div className="mb-1" style={{ ...DT.meta, color: BRAND_COLORS.green }}>
                      {request.pickupDetail}
                    </div>
                  )}

                  {/* Hotel badge */}
                  {request.bookingSource === "hotel" && (
                    <div
                      className="flex items-center gap-2 mb-4 px-3 py-2 rounded-xl"
                      style={{
                        background: d ? "rgba(29,185,84,0.06)" : "rgba(29,185,84,0.04)",
                        border: `1px solid ${d ? "rgba(29,185,84,0.12)" : "rgba(29,185,84,0.08)"}`,
                      }}
                    >
                      <Building2 className="w-3.5 h-3.5 shrink-0" style={{ color: BRAND_COLORS.green }} />
                      <div className="flex-1 min-w-0">
                        <span style={{ ...DT.meta, fontWeight: 600, color: BRAND_COLORS.green }}>
                          Hotel booking · {request.hotelName}
                        </span>
                        {request.driverNotes && (
                          <span className="block mt-0.5" style={{ ...DT.meta, fontSize: "11px", color: c.text.muted }}>
                            {request.driverNotes}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {!request.bookingSource && <div className="mb-3" />}

                  {/* Rider row */}
                  <div className="flex items-center gap-3">
                    <div
                      className="w-11 h-11 rounded-full flex items-center justify-center shrink-0"
                      style={{ background: c.green.tint }}
                    >
                      <span style={{ ...DT.label, color: BRAND_COLORS.green }}>
                        {request.rider.initials}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span style={{ ...DT.label, color: c.text.primary }}>
                          {request.bookingSource === "hotel" ? request.guestName || request.rider.name : request.rider.name}
                        </span>
                        {request.rider.rating > 0 && (
                          <>
                            <Star
                              className="w-3 h-3"
                              style={{ color: BRAND_COLORS.green, fill: BRAND_COLORS.green }}
                            />
                            <span style={{ ...DT.meta, color: c.text.secondary }}>
                              {request.rider.rating}
                            </span>
                          </>
                        )}
                      </div>
                      <div style={{ ...DT.meta, color: c.text.muted }}>
                        {request.bookingSource === "hotel"
                          ? `Hotel guest · ${request.paymentType === "digital" ? "Hotel account" : request.paymentType}`
                          : `${request.rider.trips} trips · ${request.paymentType}`}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div
                        style={{
                          fontFamily: "var(--font-heading)",
                          fontSize: "20px",
                          fontWeight: 600,
                          letterSpacing: "-0.03em",
                          color: BRAND_COLORS.green,
                        }}
                      >
                        {formatNaira(request.estimate.netEarnings)}
                      </div>
                    </div>
                  </div>

                  <div className="my-3 h-px" style={{ background: c.surface.subtle }} />

                  {/* Action bar — Call + Chat (Navigate is FAB) */}
                  <div className="flex items-center gap-2 mb-4">
                    {[
                      { icon: Phone, label: "Call rider", action: () => {} },
                      { icon: MessageSquare, label: "Chat", action: () => setShowChat(true) },
                    ].map(({ icon: Icon, label, action }, i) => (
                      <motion.button
                        key={label}
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl"
                        style={{ background: c.surface.subtle }}
                        onClick={action}
                        whileTap={{ scale: 0.95 }}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ ...SPRING, delay: 0.15 + i * 0.04 }}
                      >
                        <Icon className="w-3.5 h-3.5" style={{ color: c.icon.secondary }} />
                        <span style={{ ...DT.meta, color: c.text.secondary }}>{label}</span>
                      </motion.button>
                    ))}
                  </div>

                  {/* Arrive CTA */}
                  <motion.button
                    className="w-full py-4 rounded-2xl flex items-center justify-center gap-2 relative overflow-hidden"
                    style={{ background: BRAND_COLORS.green }}
                    onClick={handleArrive}
                    whileTap={{ scale: 0.97 }}
                  >
                    <MapPin className="w-4 h-4 relative z-10" style={{ color: "#fff" }} />
                    <span className="relative z-10" style={{ ...DT.cta, color: "#fff" }}>
                      I've arrived
                    </span>
                  </motion.button>

                  {/* Cancel — deliberate text link */}
                  <motion.button
                    className="w-full py-3 mt-2 flex items-center justify-center"
                    onClick={() => setShowCancelConfirm(true)}
                    whileTap={{ scale: 0.97 }}
                  >
                    <span style={{ ...DT.meta, color: c.text.muted }}>Cancel trip</span>
                  </motion.button>
                </>
              )}

              {/* ════════════════ ARRIVED AT PICKUP ════════════════ */}
              {phase === "arrived_at_pickup" && (
                <>
                  {/* Heading row — title + inline wait timer */}
                  <div className="flex items-start justify-between gap-3 mb-1">
                    <div style={{ ...DT.heading, color: c.text.primary }}>
                      Waiting for {(request.bookingSource === "hotel" ? request.guestName || request.rider.name : request.rider.name).split(" ")[0]}
                    </div>
                    <div
                      className="shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-lg"
                      style={{
                        background: c.surface.subtle,
                        whiteSpace: "nowrap",
                      }}
                    >
                      <Clock className="w-3.5 h-3.5 shrink-0" style={{ color: c.text.muted }} />
                      <span style={{ ...DT.meta, color: c.text.primary }}>
                        {waitMin}:{waitSec.toString().padStart(2, "0")}
                      </span>
                    </div>
                  </div>
                  <div className="mb-4" style={{ ...DT.secondary, color: c.text.muted }}>
                    {request.pickup.address}, {request.pickup.area}
                  </div>

                  {/* OTP Verification */}
                  <AnimatePresence mode="wait">
                    {!otpVerified ? (
                      <motion.div
                        key="otp-entry"
                        className="rounded-2xl px-4 py-5 mb-4 flex flex-col items-center"
                        style={{
                          background: d ? "rgba(29,185,84,0.06)" : "rgba(29,185,84,0.04)",
                          border: `1px solid ${BRAND_COLORS.green}20`,
                        }}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={SPRING}
                      >
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

                        <div style={{ ...DT.meta, color: c.text.muted, letterSpacing: "0.06em" }}>
                          RIDE VERIFICATION PIN
                        </div>
                        <div className="mt-0.5 mb-4" style={{ ...DT.meta, color: c.text.faint }}>
                          Ask the rider for their 4-digit code
                        </div>

                        <div className="flex items-center justify-center gap-3">
                          {[0, 1, 2, 3].map((i) => (
                            <motion.input
                              key={i}
                              ref={(el) => {
                                otpRefs.current[i] = el;
                              }}
                              type="text"
                              inputMode="numeric"
                              maxLength={1}
                              value={otpInput[i]}
                              onChange={(e) => handleOtpChange(i, e.target.value)}
                              onKeyDown={(e) => handleOtpKeyDown(i, e)}
                              className="w-12 h-14 text-center rounded-xl outline-none"
                              style={{
                                background: c.surface.subtle,
                                border: `1.5px solid ${
                                  otpError
                                    ? BRAND_COLORS.error + "60"
                                    : otpInput[i]
                                      ? BRAND_COLORS.green + "40"
                                      : c.surface.hover
                                }`,
                                fontFamily: "var(--font-heading)",
                                fontSize: "24px",
                                fontWeight: 600,
                                letterSpacing: "-0.03em",
                                color: c.text.display,
                                caretColor: BRAND_COLORS.green,
                                transition: "border-color 0.15s",
                              }}
                              initial={{ opacity: 0, y: 6 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ ...SPRING, delay: i * 0.06 }}
                            />
                          ))}
                        </div>

                        {otpError && (
                          <motion.div
                            className="mt-3"
                            style={{ ...DT.meta, color: BRAND_COLORS.error }}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                          >
                            Incorrect — try again
                          </motion.div>
                        )}
                      </motion.div>
                    ) : (
                      <motion.div
                        key="otp-ok"
                        className="rounded-2xl px-4 py-3.5 mb-4 flex items-center justify-center gap-2"
                        style={{
                          background: d ? "rgba(29,185,84,0.08)" : "rgba(29,185,84,0.05)",
                          border: `1px solid ${BRAND_COLORS.green}25`,
                        }}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={SPRING_BOUNCY}
                      >
                        <CheckCircle2 className="w-5 h-5" style={{ color: BRAND_COLORS.green }} />
                        <span style={{ ...DT.label, color: BRAND_COLORS.green }}>
                          PIN verified
                        </span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="my-3 h-px" style={{ background: c.surface.subtle }} />

                  {/* Action bar */}
                  <div className="flex items-center gap-2 mb-4">
                    {[
                      { icon: Phone, label: "Call rider", action: () => {} },
                      { icon: MessageSquare, label: "Chat", action: () => setShowChat(true) },
                    ].map(({ icon: Icon, label, action }, i) => (
                      <motion.button
                        key={label}
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl"
                        style={{ background: c.surface.subtle }}
                        onClick={action}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Icon className="w-3.5 h-3.5" style={{ color: c.icon.secondary }} />
                        <span style={{ ...DT.meta, color: c.text.secondary }}>{label}</span>
                      </motion.button>
                    ))}
                  </div>

                  {/* Start Trip CTA */}
                  <motion.button
                    className="w-full py-4 rounded-2xl flex items-center justify-center gap-2 relative overflow-hidden"
                    style={{
                      background: otpVerified ? BRAND_COLORS.green : c.surface.subtle,
                      opacity: otpVerified ? 1 : 0.5,
                      cursor: otpVerified ? "pointer" : "not-allowed",
                    }}
                    onClick={otpVerified ? handleStartTrip : undefined}
                    whileTap={otpVerified ? { scale: 0.97 } : undefined}
                  >
                    {otpVerified && (
                      <motion.div
                        className="absolute inset-0"
                        style={{
                          background:
                            "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.12) 50%, transparent 60%)",
                        }}
                        animate={{ x: ["-100%", "200%"] }}
                        transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 3, ease: "linear" }}
                      />
                    )}
                    <Navigation
                      className="w-4 h-4 relative z-10"
                      style={{ color: otpVerified ? "#fff" : c.text.muted }}
                    />
                    <span
                      className="relative z-10"
                      style={{ ...DT.cta, color: otpVerified ? "#fff" : c.text.muted }}
                    >
                      {otpVerified ? "Start trip" : "Enter PIN to start"}
                    </span>
                  </motion.button>

                  {/* Cancel — deliberate text link */}
                  <motion.button
                    className="w-full py-3 mt-2 flex items-center justify-center"
                    onClick={() => setShowCancelConfirm(true)}
                    whileTap={{ scale: 0.97 }}
                  >
                    <span style={{ ...DT.meta, color: c.text.muted }}>Cancel trip</span>
                  </motion.button>
                </>
              )}

              {/* ════════════════ IN TRIP ════════════════ */}
              {phase === "in_trip" && (
                <>
                  {/* Heading row — title + inline ETA */}
                  <div className="flex items-start justify-between gap-3 mb-1">
                    <div className="min-w-0">
                      <div className="truncate" style={{ ...DT.heading, color: c.text.primary }}>
                        {request.destination.address}
                      </div>
                    </div>
                    <div
                      className="shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-lg"
                      style={{
                        background: c.green.tint,
                        whiteSpace: "nowrap",
                      }}
                    >
                      <span
                        style={{
                          fontFamily: "var(--font-heading)",
                          fontSize: "15px",
                          fontWeight: 600,
                          letterSpacing: "-0.02em",
                          color: BRAND_COLORS.green,
                        }}
                      >
                        {tripEta} min
                      </span>
                      <span style={{ ...DT.meta, fontSize: "11px", color: c.text.muted }}>
                        · {kmRemaining} km
                      </span>
                    </div>
                  </div>
                  <div className="mb-3" style={{ ...DT.secondary, color: c.text.muted }}>
                    {request.destination.area}
                  </div>

                  {/* Progress bar */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-1.5">
                      <span style={{ ...DT.meta, color: c.text.muted }}>Trip progress</span>
                      <span
                        style={{
                          fontFamily: "var(--font-heading)",
                          fontSize: "15px",
                          fontWeight: 600,
                          letterSpacing: "-0.02em",
                          color: BRAND_COLORS.green,
                        }}
                      >
                        {formatNaira(request.estimate.netEarnings)}
                      </span>
                    </div>
                    <div
                      className="h-1 rounded-full overflow-hidden"
                      style={{ background: c.surface.subtle }}
                    >
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: BRAND_COLORS.green }}
                        animate={{ width: `${tripProgress * 100}%` }}
                        transition={{ duration: 0.3, ease: "linear" }}
                      />
                    </div>
                  </div>

                  <div className="h-px mb-4" style={{ background: c.surface.subtle }} />

                  {/* Action bar */}
                  <div className="flex items-center gap-2 mb-4">
                    {[
                      { icon: Phone, label: "Call rider", action: () => {} },
                      { icon: MessageSquare, label: "Chat", action: () => setShowChat(true) },
                    ].map(({ icon: Icon, label, action }, i) => (
                      <motion.button
                        key={label}
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl"
                        style={{ background: c.surface.subtle }}
                        onClick={action}
                        whileTap={{ scale: 0.95 }}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ ...SPRING, delay: 0.15 + i * 0.04 }}
                      >
                        <Icon className="w-3.5 h-3.5" style={{ color: c.icon.secondary }} />
                        <span style={{ ...DT.meta, color: c.text.secondary }}>{label}</span>
                      </motion.button>
                    ))}
                    {/* Safety */}
                    <motion.button
                      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                      style={{
                        background: d ? "rgba(212,24,61,0.1)" : "rgba(212,24,61,0.06)",
                        border: `1px solid ${d ? "rgba(212,24,61,0.2)" : "rgba(212,24,61,0.12)"}`,
                      }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Shield className="w-4 h-4" style={{ color: BRAND_COLORS.error }} />
                    </motion.button>
                  </div>

                  {/* Trip-End OTP Verification */}
                  <AnimatePresence mode="wait">
                    {!endOtpVerified ? (
                      <motion.div
                        key="end-otp-entry"
                        className="rounded-2xl px-4 py-4 mb-4 flex flex-col items-center"
                        style={{
                          background: d ? "rgba(29,185,84,0.06)" : "rgba(29,185,84,0.04)",
                          border: `1px solid ${BRAND_COLORS.green}20`,
                        }}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={SPRING}
                      >
                        <div style={{ ...DT.meta, color: c.text.muted, letterSpacing: "0.06em" }}>
                          TRIP-END VERIFICATION
                        </div>
                        <div className="mt-0.5 mb-3" style={{ ...DT.meta, color: c.text.faint }}>
                          Ask rider for their drop-off PIN
                        </div>
                        <div className="flex items-center justify-center gap-3">
                          {[0, 1, 2, 3].map((i) => (
                            <motion.input
                              key={i}
                              ref={(el) => { endOtpRefs.current[i] = el; }}
                              type="text"
                              inputMode="numeric"
                              maxLength={1}
                              value={endOtpInput[i]}
                              onChange={(e) => handleEndOtpChange(i, e.target.value)}
                              onKeyDown={(e) => handleEndOtpKeyDown(i, e)}
                              className="w-12 h-14 text-center rounded-xl outline-none"
                              style={{
                                background: c.surface.subtle,
                                border: `1.5px solid ${
                                  endOtpError
                                    ? BRAND_COLORS.error + "60"
                                    : endOtpInput[i]
                                      ? BRAND_COLORS.green + "40"
                                      : c.surface.hover
                                }`,
                                fontFamily: "var(--font-heading)",
                                fontSize: "24px",
                                fontWeight: 600,
                                letterSpacing: "-0.03em",
                                color: c.text.display,
                                caretColor: BRAND_COLORS.green,
                                transition: "border-color 0.15s",
                              }}
                              initial={{ opacity: 0, y: 6 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ ...SPRING, delay: i * 0.06 }}
                            />
                          ))}
                        </div>
                        {endOtpError && (
                          <motion.div
                            className="mt-3"
                            style={{ ...DT.meta, color: BRAND_COLORS.error }}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                          >
                            Incorrect — try again
                          </motion.div>
                        )}
                      </motion.div>
                    ) : (
                      <motion.div
                        key="end-otp-ok"
                        className="rounded-2xl px-4 py-3.5 mb-4 flex items-center justify-center gap-2"
                        style={{
                          background: d ? "rgba(29,185,84,0.08)" : "rgba(29,185,84,0.05)",
                          border: `1px solid ${BRAND_COLORS.green}25`,
                        }}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={SPRING_BOUNCY}
                      >
                        <CheckCircle2 className="w-5 h-5" style={{ color: BRAND_COLORS.green }} />
                        <span style={{ ...DT.label, color: BRAND_COLORS.green }}>
                          Drop-off PIN verified
                        </span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Complete CTA — only active after trip-end OTP */}
                  <motion.button
                    className="w-full py-4 rounded-2xl flex items-center justify-center gap-2"
                    style={{
                      background: endOtpVerified ? BRAND_COLORS.green : c.surface.subtle,
                      opacity: endOtpVerified ? 1 : 0.5,
                      cursor: endOtpVerified ? "pointer" : "not-allowed",
                    }}
                    onClick={endOtpVerified ? handleCompleteTrip : undefined}
                    whileTap={endOtpVerified ? { scale: 0.97 } : undefined}
                  >
                    <CheckCircle2 className="w-4 h-4" style={{ color: endOtpVerified ? "#fff" : c.text.muted }} />
                    <span style={{ ...DT.cta, color: endOtpVerified ? "#fff" : c.text.muted }}>
                      {endOtpVerified ? "Complete trip" : "Enter PIN to complete"}
                    </span>
                  </motion.button>
                </>
              )}
            </GlassPanel>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Completed screen ── */}
      <AnimatePresence>
        {phase === "completed" && (
          <CompletedScreen
            request={request}
            colorMode={colorMode}
            onDone={handleDone}
            tripDurationMin={tripElapsed || request.estimate.duration}
          />
        )}
      </AnimatePresence>

      {/* ── Chat sheet ── */}
      <AnimatePresence>
        {showChat && (
          <>
            <motion.div
              className="absolute inset-0 z-30"
              style={{ background: d ? "rgba(0,0,0,0.5)" : "rgba(0,0,0,0.15)" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowChat(false)}
            />
            <motion.div
              className="absolute bottom-0 left-0 right-0 z-40 flex flex-col"
              style={{ maxHeight: "70vh" }}
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 350, damping: 30 }}
            >
              <GlassPanel
                variant={d ? "dark" : "light"}
                blur={24}
                className="rounded-t-3xl flex flex-col overflow-hidden"
                style={{ maxHeight: "70vh" }}
              >
                {/* Header */}
                <div
                  className="flex items-center justify-between px-5 py-4 shrink-0"
                  style={{ borderBottom: `1px solid ${c.surface.hover}` }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center"
                      style={{ background: c.green.tint }}
                    >
                      <span style={{ ...DT.meta, color: BRAND_COLORS.green }}>
                        {request.rider.initials}
                      </span>
                    </div>
                    <div>
                      <span style={{ ...DT.label, color: c.text.primary }}>
                        {request.rider.name}
                      </span>
                      <div style={{ ...DT.meta, color: c.text.muted }}>Rider</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <motion.button
                      className="w-9 h-9 rounded-full flex items-center justify-center"
                      style={{ background: c.surface.subtle }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Phone className="w-4 h-4" style={{ color: c.icon.secondary }} />
                    </motion.button>
                    <motion.button
                      className="w-9 h-9 rounded-full flex items-center justify-center"
                      style={{ background: c.surface.subtle }}
                      onClick={() => setShowChat(false)}
                      whileTap={{ scale: 0.9 }}
                    >
                      <X className="w-4 h-4" style={{ color: c.icon.secondary }} />
                    </motion.button>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3 scrollbar-hide">
                  {chatMessages.map((msg) => {
                    const isDriver = msg.sender === "driver";
                    return (
                      <motion.div
                        key={msg.id}
                        className={`flex ${isDriver ? "justify-end" : "justify-start"}`}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={MOTION.micro}
                      >
                        <div
                          className="max-w-[80%] px-3.5 py-2.5 rounded-2xl"
                          style={{
                            background: isDriver ? BRAND_COLORS.green : c.surface.subtle,
                            borderBottomRightRadius: isDriver ? "6px" : "16px",
                            borderBottomLeftRadius: isDriver ? "16px" : "6px",
                          }}
                        >
                          <div
                            style={{
                              ...DT.secondary,
                              color: isDriver ? "#fff" : c.text.primary,
                            }}
                          >
                            {msg.text}
                          </div>
                          <div
                            className="mt-0.5 text-right"
                            style={{
                              ...DT.meta,
                              fontSize: "10px",
                              color: isDriver ? "rgba(255,255,255,0.6)" : c.text.faint,
                            }}
                          >
                            {msg.time}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                  <div ref={chatEndRef} />
                </div>

                {/* Input */}
                <div
                  className="px-5 py-3 shrink-0"
                  style={{
                    borderTop: `1px solid ${c.surface.hover}`,
                    paddingBottom: "max(env(safe-area-inset-bottom, 12px), 12px)",
                  }}
                >
                  <div
                    className="flex items-center gap-2 px-4 py-2.5 rounded-full"
                    style={{
                      background: c.surface.subtle,
                      border: `1px solid ${c.surface.hover}`,
                    }}
                  >
                    <input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                      placeholder="Type a message..."
                      className="flex-1 bg-transparent outline-none"
                      style={{ ...DT.secondary, color: c.text.primary }}
                    />
                    <motion.button
                      className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                      style={{
                        background: chatInput.trim() ? BRAND_COLORS.green : "transparent",
                      }}
                      onClick={handleSendMessage}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Send
                        className="w-3.5 h-3.5"
                        style={{ color: chatInput.trim() ? "#fff" : c.icon.muted }}
                      />
                    </motion.button>
                  </div>
                </div>
              </GlassPanel>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Cancel confirmation — per-phase messaging ── */}
      {cancelConfig && (
        <JetConfirm
          open={showCancelConfirm}
          colorMode={colorMode}
          title={cancelConfig.title}
          message={cancelConfig.message}
          confirmLabel={cancelConfig.confirmLabel}
          cancelLabel="Keep going"
          destructive
          onConfirm={handleCancelConfirm}
          onCancel={() => setShowCancelConfirm(false)}
        />
      )}

      {/* ── Cancel reason picker ── */}
      {showCancelReasons && (
        <CancelReasonSheet
          open={showCancelReasons}
          colorMode={colorMode}
          reasons={DRIVER_CANCEL_REASONS}
          onSelect={handleCancelWithReason}
          onDismiss={() => setShowCancelReasons(false)}
        />
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Completed screen
// ---------------------------------------------------------------------------
function CompletedScreen({
  request,
  colorMode,
  onDone,
  tripDurationMin,
}: {
  request: TripRequest;
  colorMode: GlassColorMode;
  onDone: () => void;
  tripDurationMin: number;
}) {
  const c = GLASS_COLORS[colorMode];
  const d = colorMode === "dark";
  const [rating, setRating] = useState(0);
  const commission = request.estimate.fare - request.estimate.netEarnings;

  return (
    <motion.div
      className="absolute inset-0 z-20 flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="absolute inset-0" style={{ background: c.bg }} />

      {/* Ambient glow */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full"
        style={{
          background: `radial-gradient(ellipse, ${BRAND_COLORS.green} 0%, transparent 65%)`,
          opacity: 0.04,
        }}
      />

      {/* Noise */}
      <div
        className="absolute inset-0 mix-blend-overlay"
        style={{
          opacity: d ? 0.03 : 0.015,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
          backgroundSize: "128px 128px",
        }}
      />

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.15, type: "spring", stiffness: 400, damping: 20 }}
        >
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mb-6"
            style={{
              background: d ? "rgba(29,185,84,0.1)" : "rgba(29,185,84,0.08)",
              border: `1.5px solid ${d ? "rgba(29,185,84,0.15)" : "rgba(29,185,84,0.12)"}`,
            }}
          >
            <CheckCircle2 className="w-8 h-8" style={{ color: BRAND_COLORS.green }} />
          </div>
        </motion.div>

        <motion.span
          style={{ ...DT.secondary, color: c.text.muted, marginBottom: "8px" }}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Trip complete
        </motion.span>

        <motion.span
          style={{
            ...DT.hero,
            fontSize: "48px",
            color: BRAND_COLORS.green,
            display: "block",
            marginBottom: "4px",
          }}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          {formatNaira(request.estimate.netEarnings)}
        </motion.span>

        <motion.span
          style={{ ...DT.meta, color: c.text.muted, marginBottom: "24px" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Fare {formatNaira(request.estimate.fare)} · Commission -{formatNaira(commission)}
        </motion.span>

        {/* Summary card */}
        <motion.div
          className="w-full max-w-[340px]"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, ...MOTION.standard }}
        >
          <GlassPanel variant={d ? "dark" : "light"} className="rounded-2xl overflow-hidden">
            <div className="flex items-center justify-around py-4 px-4">
              {[
                { label: "Distance", value: `${request.estimate.distance} km` },
                { label: "Duration", value: `${tripDurationMin} min` },
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
                    <span style={{ ...DT.meta, color: c.text.muted, display: "block" }}>
                      {item.label}
                    </span>
                    <span
                      style={{
                        fontFamily: "var(--font-heading)",
                        fontSize: "20px",
                        fontWeight: 700,
                        letterSpacing: "-0.03em",
                        color: c.text.display,
                        display: "block",
                        marginTop: "2px",
                      }}
                    >
                      {item.value}
                    </span>
                  </div>
                </div>
              ))}
              <div className="flex items-center">
                <div
                  className="h-8 mr-4"
                  style={{
                    width: 1,
                    background: d ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)",
                  }}
                />
                <div className="text-center">
                  <span style={{ ...DT.meta, color: c.text.muted, display: "block" }}>
                    Payment
                  </span>
                  <div className="flex items-center justify-center gap-1 mt-0.5">
                    {request.paymentType === "cash" ? (
                      <Banknote className="w-4 h-4" style={{ color: c.icon.primary }} />
                    ) : (
                      <Smartphone className="w-4 h-4" style={{ color: c.icon.primary }} />
                    )}
                    <span
                      style={{
                        fontFamily: "var(--font-heading)",
                        fontSize: "15px",
                        fontWeight: 600,
                        color: c.text.display,
                        textTransform: "capitalize" as const,
                      }}
                    >
                      {request.paymentType}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div
              style={{
                height: 1,
                background: d ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)",
              }}
            />

            {/* Rate rider */}
            <div className="px-4 py-4">
              <span
                style={{
                  ...DT.secondary,
                  color: c.text.secondary,
                  display: "block",
                  marginBottom: "10px",
                  textAlign: "center",
                }}
              >
                Rate {request.rider.name}
              </span>
              <div className="flex items-center justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <motion.button
                    key={star}
                    onClick={() => setRating(star)}
                    whileTap={{ scale: 0.85 }}
                    style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}
                  >
                    <Star
                      className="w-8 h-8"
                      style={{
                        color: star <= rating ? BRAND_COLORS.green : c.surface.hover,
                        fill: star <= rating ? BRAND_COLORS.green : "transparent",
                        transition: "color 0.15s, fill 0.15s",
                      }}
                    />
                  </motion.button>
                ))}
              </div>
            </div>
          </GlassPanel>
        </motion.div>
      </div>

      {/* Done CTA */}
      <motion.div
        className="relative z-10 px-6"
        style={{ paddingBottom: "max(env(safe-area-inset-bottom, 32px), 32px)" }}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45, ...MOTION.standard }}
      >
        <motion.button
          className="w-full py-4 rounded-2xl flex items-center justify-center"
          style={{ background: BRAND_COLORS.green }}
          onClick={onDone}
          whileTap={{ scale: 0.97 }}
        >
          <span style={{ ...DT.cta, color: "#fff" }}>Done</span>
        </motion.button>
      </motion.div>
    </motion.div>
  );
}