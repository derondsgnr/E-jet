 /**
 * InRideScreen — Live trip tracking after OTP confirmation.
 *
 * NORTHSTAR: Uber in-trip + Apple Maps turn-by-turn
 * - Map dominant with animated route progress
 * - Compact bottom card: destination, live ETA + km, fare estimate
 * - Chat sheet for driver communication
 * - Carbon savings indicator for EV rides
 * - Safety tools (SOS, share location, call support)
 *
 * SPINE: GlassPanel, MapCanvas, green-as-scalpel, motion stagger
 */

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Phone,
  MessageSquare,
  Shield,
  Share2,
  MapPin,
  Navigation,
  AlertTriangle,
  X,
  Send,
  Leaf,
  Zap,
} from "lucide-react";
import {
  GLASS_COLORS,
  GLASS_TYPE,
  MOTION,
  type GlassColorMode,
} from "../../config/project";
import { BRAND_COLORS } from "../../config/brand";
import { GlassPanel } from "./glass-panel";
import { MapCanvas } from "./map-canvas";
import { JetConfirm } from "./jet-confirm";
import {
  CancelReasonSheet,
  RIDER_CANCEL_REASONS,
} from "./cancel-reason-sheet";
import {
  mockDriver,
  mockRoute,
  mockChatMessages,
  tripEndOTP,
  type ChatMessage,
} from "./booking-data";

const SPRING = { type: "spring" as const, stiffness: 500, damping: 32, mass: 0.8 };

interface InRideScreenProps {
  colorMode: GlassColorMode;
  onTripComplete: () => void;
  onEmergency?: () => void;
  onCancel?: () => void;
}

export function InRideScreen({
  colorMode,
  onTripComplete,
  onEmergency,
  onCancel,
}: InRideScreenProps) {
  const d = colorMode === "dark";
  const c = GLASS_COLORS[colorMode];

  // Trip constants
  const TOTAL_DISTANCE_KM = 7.1;
  const TOTAL_DURATION_MIN = 14;

  // Trip progress simulation
  const [progress, setProgress] = useState(0); // 0 → 1
  const [fareEstimate] = useState("₦3,200");
  const [showSafety, setShowSafety] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [showCancelReasons, setShowCancelReasons] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(mockChatMessages);
  const [chatInput, setChatInput] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Derived live metrics
  const etaMinutes = Math.max(0, Math.round(TOTAL_DURATION_MIN * (1 - progress)));
  const kmRemaining = Math.max(0, (TOTAL_DISTANCE_KM * (1 - progress)).toFixed(1));
  const carbonSavingLive = mockDriver.isEV
    ? ((TOTAL_DISTANCE_KM * progress * 0.12).toFixed(2)) // 120g/km = 0.12kg/km
    : null;

  // Auto-advance progress for demo
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => {
        const next = p + 0.008;
        if (next >= 1) {
          clearInterval(interval);
          setTimeout(onTripComplete, 600);
          return 1;
        }
        return next;
      });
    }, 150);
    return () => clearInterval(interval);
  }, [onTripComplete]);

  // Scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, showChat]);

  // Car position on a simulated curve
  const carX = 30 + progress * 40;
  const carY = 55 - progress * 30 + Math.sin(progress * Math.PI * 2) * 5;

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;
    const now = new Date();
    const time = now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
    setChatMessages((prev) => [
      ...prev,
      { id: `r-${Date.now()}`, sender: "rider", text: chatInput.trim(), time },
    ]);
    setChatInput("");

    // Simulate driver reply after a delay
    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        {
          id: `d-${Date.now()}`,
          sender: "driver",
          text: "Got it, no problem! 👍",
          time: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
        },
      ]);
    }, 2500);
  };

  return (
    <div
      className="relative h-screen w-full overflow-hidden flex flex-col"
      style={{ background: c.bg }}
    >
      {/* ── Map ── */}
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

        {/* Route line (SVG) */}
        <svg className="absolute inset-0 z-[2] w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path
            d="M 28 58 Q 40 50, 50 40 T 72 25"
            fill="none"
            stroke={d ? "rgba(255,255,255,0.08)" : "rgba(11,11,13,0.06)"}
            strokeWidth="0.5"
            strokeDasharray="1.5 1"
          />
          <path
            d="M 28 58 Q 40 50, 50 40 T 72 25"
            fill="none"
            stroke={BRAND_COLORS.green}
            strokeWidth="0.6"
            strokeDasharray={`${progress * 100} 200`}
            style={{ opacity: 0.6 }}
          />
        </svg>

        {/* Pickup marker */}
        <div className="absolute z-[3]" style={{ left: "26%", top: "56%" }}>
          <div
            className="w-2.5 h-2.5 rounded-full"
            style={{
              background: c.text.muted,
              boxShadow: `0 0 0 4px ${d ? "rgba(255,255,255,0.06)" : "rgba(11,11,13,0.04)"}`,
            }}
          />
        </div>

        {/* Destination marker */}
        <div className="absolute z-[3]" style={{ left: "70%", top: "23%" }}>
          <motion.div
            className="w-3 h-3 rounded-full"
            style={{
              background: BRAND_COLORS.green,
              boxShadow: `0 0 0 5px ${BRAND_COLORS.green}20, 0 0 0 10px ${BRAND_COLORS.green}10`,
            }}
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 2.5, repeat: Infinity }}
          />
        </div>

        {/* Animated car */}
        <motion.div
          className="absolute z-[4]"
          style={{ left: `${carX}%`, top: `${carY}%` }}
          animate={{ left: `${carX}%`, top: `${carY}%` }}
          transition={{ duration: 0.3, ease: "linear" }}
        >
          <motion.div
            className="w-9 h-9 rounded-full flex items-center justify-center -translate-x-1/2 -translate-y-1/2"
            style={{
              background: BRAND_COLORS.green,
              boxShadow: `0 0 16px ${BRAND_COLORS.green}40`,
            }}
          >
            <Navigation className="w-4 h-4" style={{ color: "#fff", transform: "rotate(-45deg)" }} />
          </motion.div>
        </motion.div>

        {/* Top header */}
        <div
          className="absolute top-0 left-0 right-0 z-10 px-5 flex items-center justify-between"
          style={{ paddingTop: "calc(env(safe-area-inset-top, 12px) + 12px)" }}
        >
          <GlassPanel
            variant={d ? "dark" : "light"}
            blur={20}
            className="px-4 py-2.5 rounded-full"
          >
            <div className="flex items-center gap-2">
              <motion.div
                className="w-2 h-2 rounded-full"
                style={{ background: BRAND_COLORS.green }}
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              <span style={{ ...GLASS_TYPE.bodySmall, color: c.text.primary }}>
                In transit
              </span>
              {/* EV badge */}
              {mockDriver.isEV && (
                <div
                  className="flex items-center gap-1 px-1.5 py-0.5 rounded-full ml-0.5"
                  style={{ background: c.green.evBg }}
                >
                  <Zap className="w-2.5 h-2.5" style={{ color: BRAND_COLORS.green }} />
                  <span style={{ ...GLASS_TYPE.caption, fontSize: "9px", color: c.green.evText }}>
                    EV
                  </span>
                </div>
              )}
            </div>
          </GlassPanel>

          <motion.button
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: c.surface.button, backdropFilter: "blur(16px)" }}
            whileTap={{ scale: 0.92 }}
          >
            <Share2 className="w-4 h-4" style={{ color: c.icon.primary }} />
          </motion.button>
        </div>

        {/* Live ETA pill — centered on map */}
        <motion.div
          className="absolute top-0 left-1/2 -translate-x-1/2 z-10"
          style={{ marginTop: "calc(env(safe-area-inset-top, 12px) + 60px)" }}
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ ...SPRING, delay: 0.3 }}
        >
          <GlassPanel
            variant={d ? "dark" : "light"}
            blur={20}
            className="px-5 py-2.5 rounded-2xl"
          >
            <div className="flex items-center gap-3">
              <span
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: "22px",
                  fontWeight: 600,
                  letterSpacing: "-0.03em",
                  lineHeight: "1.2",
                  color: c.text.display,
                }}
              >
                {etaMinutes} min
              </span>
              <div className="w-px h-5" style={{ background: c.surface.hover }} />
              <span style={{ ...GLASS_TYPE.caption, color: c.text.muted }}>
                {kmRemaining} km
              </span>
            </div>
          </GlassPanel>
        </motion.div>

        {/* Carbon savings floating pill — only for EV, appears after some progress */}
        {carbonSavingLive && progress > 0.1 && (
          <motion.div
            className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10"
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ ...SPRING, delay: 0.5 }}
          >
            <GlassPanel
              variant={d ? "dark" : "light"}
              blur={16}
              className="px-3.5 py-1.5 rounded-full"
            >
              <div className="flex items-center gap-1.5">
                <Leaf className="w-3 h-3" style={{ color: BRAND_COLORS.green }} />
                <span style={{ ...GLASS_TYPE.caption, color: BRAND_COLORS.green }}>
                  {carbonSavingLive} kg CO₂ saved
                </span>
                <span style={{ ...GLASS_TYPE.caption, fontSize: "9px", color: c.text.faint }}>
                  this trip
                </span>
              </div>
            </GlassPanel>
          </motion.div>
        )}
      </div>

      {/* ── Bottom card ── */}
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
          {/* Route progress — ETA + km + bar */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <span
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontSize: "15px",
                    fontWeight: 600,
                    letterSpacing: "-0.02em",
                    lineHeight: "1.2",
                    color: c.text.primary,
                  }}
                >
                  {etaMinutes} min
                </span>
                <span style={{ ...GLASS_TYPE.caption, color: c.text.faint }}>·</span>
                <span style={{ ...GLASS_TYPE.bodySmall, color: c.text.muted }}>
                  {kmRemaining} km left
                </span>
              </div>
              <span style={{ ...GLASS_TYPE.bodySmall, color: c.text.primary }}>
                {fareEstimate}
              </span>
            </div>
            <div
              className="h-1 rounded-full overflow-hidden"
              style={{ background: c.surface.subtle }}
            >
              <motion.div
                className="h-full rounded-full"
                style={{ background: BRAND_COLORS.green }}
                animate={{ width: `${progress * 100}%` }}
                transition={{ duration: 0.3, ease: "linear" }}
              />
            </div>
          </div>

          {/* Destination row */}
          <div className="flex items-center gap-3 mb-4">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: c.green.tint }}
            >
              <MapPin className="w-4 h-4" style={{ color: BRAND_COLORS.green }} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="truncate" style={{ ...GLASS_TYPE.body, color: c.text.primary }}>
                {mockRoute.dropoff.name}
              </div>
              <div className="truncate" style={{ ...GLASS_TYPE.caption, color: c.text.muted }}>
                {mockRoute.dropoff.address}
              </div>
            </div>
            {/* EV carbon tag — inline with destination */}
            {mockDriver.isEV && (
              <div
                className="flex items-center gap-1 px-2 py-1 rounded-lg shrink-0"
                style={{ background: c.green.evBg }}
              >
                <Leaf className="w-3 h-3" style={{ color: BRAND_COLORS.green }} />
                <span style={{ ...GLASS_TYPE.caption, fontSize: "10px", color: c.green.evText }}>
                  Zero emission
                </span>
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="h-px mb-4" style={{ background: c.surface.subtle }} />

          {/* Driver row */}
          <div className="flex items-center gap-3 mb-4">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
              style={{ background: c.green.tint }}
            >
              <span style={{ ...GLASS_TYPE.bodySmall, color: BRAND_COLORS.green }}>
                {mockDriver.avatarInitials}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span style={{ ...GLASS_TYPE.body, color: c.text.primary }}>
                  {mockDriver.name}
                </span>
                {mockDriver.isEV && (
                  <Zap className="w-3 h-3" style={{ color: BRAND_COLORS.green }} />
                )}
              </div>
              <div style={{ ...GLASS_TYPE.caption, color: c.text.muted }}>
                {mockDriver.vehicle} · {mockDriver.plate}
              </div>
            </div>
          </div>

          {/* Trip-end code — rider shows this to driver at drop-off */}
          <motion.div
            className="flex items-center justify-between px-4 py-3 rounded-xl mb-4"
            style={{
              background: d ? "rgba(29,185,84,0.06)" : "rgba(29,185,84,0.04)",
              border: `1px solid ${BRAND_COLORS.green}15`,
            }}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...SPRING, delay: 0.4 }}
          >
            <div>
              <div style={{ ...GLASS_TYPE.caption, color: c.text.muted, marginBottom: "4px" }}>
                Trip-end code
              </div>
              <div className="flex gap-1.5">
                {tripEndOTP.digits.map((digit, i) => (
                  <div
                    key={i}
                    className="w-8 h-9 rounded-lg flex items-center justify-center"
                    style={{
                      background: c.green.tint,
                      border: `1px solid ${BRAND_COLORS.green}20`,
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "var(--font-heading)",
                        fontSize: "16px",
                        fontWeight: 700,
                        letterSpacing: "-0.02em",
                        color: BRAND_COLORS.green,
                      }}
                    >
                      {digit}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <span
              style={{
                ...GLASS_TYPE.caption,
                color: c.text.ghost,
                maxWidth: "100px",
                textAlign: "right",
                lineHeight: "1.3",
              }}
            >
              Share with driver at drop-off
            </span>
          </motion.div>

          {/* Action buttons — wired */}
          <div className="flex items-center gap-2">
            {[
              {
                icon: Phone,
                label: "Call",
                action: () => {
                  window.open(`tel:+234800000000`, "_self");
                },
              },
              {
                icon: MessageSquare,
                label: "Chat",
                action: () => setShowChat(true),
              },
              {
                icon: Share2,
                label: "Share trip",
                action: () => {
                  if (navigator.share) {
                    navigator.share({
                      title: "My JET trip",
                      text: `I'm on my way to ${mockRoute.dropoff.name}. ETA: ${etaMinutes} min.`,
                    }).catch(() => {});
                  }
                },
              },
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
                <span style={{ ...GLASS_TYPE.caption, color: c.text.secondary }}>
                  {label}
                </span>
              </motion.button>
            ))}

            {/* Emergency / Safety */}
            <motion.button
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{
                background: d ? "rgba(212,24,61,0.1)" : "rgba(212,24,61,0.06)",
                border: `1px solid ${d ? "rgba(212,24,61,0.2)" : "rgba(212,24,61,0.12)"}`,
              }}
              onClick={() => setShowSafety(true)}
              whileTap={{ scale: 0.9 }}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...SPRING, delay: 0.3 }}
            >
              <Shield className="w-4 h-4" style={{ color: BRAND_COLORS.error }} />
            </motion.button>
          </div>
        </GlassPanel>
      </motion.div>

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
                {/* Chat header */}
                <div
                  className="flex items-center justify-between px-5 py-4 shrink-0"
                  style={{ borderBottom: `1px solid ${c.surface.hover}` }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center"
                      style={{ background: c.green.tint }}
                    >
                      <span style={{ ...GLASS_TYPE.caption, color: BRAND_COLORS.green }}>
                        {mockDriver.avatarInitials}
                      </span>
                    </div>
                    <div>
                      <span style={{ ...GLASS_TYPE.body, color: c.text.primary }}>
                        {mockDriver.name}
                      </span>
                      <div style={{ ...GLASS_TYPE.caption, color: c.text.muted }}>
                        Your driver
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <motion.button
                      className="w-9 h-9 rounded-full flex items-center justify-center"
                      style={{ background: c.surface.subtle }}
                      onClick={() => window.open(`tel:+234800000000`, "_self")}
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
                    const isRider = msg.sender === "rider";
                    return (
                      <motion.div
                        key={msg.id}
                        className={`flex ${isRider ? "justify-end" : "justify-start"}`}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={MOTION.micro}
                      >
                        <div
                          className="max-w-[80%] px-3.5 py-2.5 rounded-2xl"
                          style={{
                            background: isRider
                              ? BRAND_COLORS.green
                              : c.surface.subtle,
                            borderBottomRightRadius: isRider ? "6px" : "16px",
                            borderBottomLeftRadius: isRider ? "16px" : "6px",
                          }}
                        >
                          <div
                            style={{
                              ...GLASS_TYPE.bodySmall,
                              color: isRider ? "#fff" : c.text.primary,
                            }}
                          >
                            {msg.text}
                          </div>
                          <div
                            className="mt-0.5 text-right"
                            style={{
                              ...GLASS_TYPE.caption,
                              fontSize: "9px",
                              color: isRider
                                ? "rgba(255,255,255,0.6)"
                                : c.text.faint,
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

                {/* Chat input */}
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
                      style={{ ...GLASS_TYPE.bodySmall, color: c.text.primary }}
                    />
                    <motion.button
                      className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                      style={{
                        background: chatInput.trim()
                          ? BRAND_COLORS.green
                          : "transparent",
                      }}
                      onClick={handleSendMessage}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Send
                        className="w-3.5 h-3.5"
                        style={{
                          color: chatInput.trim() ? "#fff" : c.icon.muted,
                        }}
                      />
                    </motion.button>
                  </div>
                </div>
              </GlassPanel>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Safety sheet ── */}
      <AnimatePresence>
        {showSafety && (
          <>
            <motion.div
              className="absolute inset-0 z-30"
              style={{ background: d ? "rgba(0,0,0,0.5)" : "rgba(0,0,0,0.15)" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSafety(false)}
            />
            <motion.div
              className="absolute bottom-0 left-0 right-0 z-40"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 350, damping: 30 }}
            >
              <GlassPanel
                variant={d ? "dark" : "light"}
                blur={24}
                className="rounded-t-3xl px-5 pt-5"
                style={{ paddingBottom: "max(env(safe-area-inset-bottom, 24px), 24px)" }}
              >
                <div className="flex items-center justify-between mb-5">
                  <span
                    style={{
                      fontFamily: "var(--font-heading)",
                      fontSize: "18px",
                      fontWeight: 600,
                      letterSpacing: "-0.02em",
                      lineHeight: "1.2",
                      color: c.text.primary,
                    }}
                  >
                    Safety tools
                  </span>
                  <motion.button
                    className="w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ background: c.surface.subtle }}
                    onClick={() => setShowSafety(false)}
                    whileTap={{ scale: 0.9 }}
                  >
                    <X className="w-4 h-4" style={{ color: c.icon.secondary }} />
                  </motion.button>
                </div>

                {[
                  {
                    icon: AlertTriangle,
                    label: "Emergency SOS",
                    sub: "Alert emergency contacts & authorities",
                    color: BRAND_COLORS.error,
                    action: onEmergency,
                  },
                  {
                    icon: Share2,
                    label: "Share live location",
                    sub: "Send real-time trip link to a contact",
                    color: c.text.primary,
                    action: () => {
                      if (navigator.share) {
                        navigator.share({
                          title: "My JET trip — live location",
                          text: `I'm in a JET ride to ${mockRoute.dropoff.name}. Track me live.`,
                        }).catch(() => {});
                      }
                    },
                  },
                  {
                    icon: Phone,
                    label: "Call JET support",
                    sub: "24/7 safety hotline",
                    color: c.text.primary,
                    action: () => window.open("tel:+234800000000", "_self"),
                  },
                ].map(({ icon: Icon, label, sub, color, action }, i) => (
                  <motion.button
                    key={label}
                    className="w-full flex items-center gap-3 py-3 transition-colors"
                    style={{
                      borderBottom:
                        i < 2 ? `1px solid ${c.surface.hover}` : "none",
                    }}
                    onClick={action}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ ...MOTION.standard, delay: i * 0.04 }}
                  >
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                      style={{
                        background:
                          i === 0
                            ? d ? "rgba(212,24,61,0.1)" : "rgba(212,24,61,0.06)"
                            : c.surface.subtle,
                      }}
                    >
                      <Icon
                        className="w-4 h-4"
                        style={{ color: i === 0 ? BRAND_COLORS.error : c.icon.secondary }}
                      />
                    </div>
                    <div className="text-left">
                      <div style={{ ...GLASS_TYPE.bodySmall, color: color }}>
                        {label}
                      </div>
                      <div style={{ ...GLASS_TYPE.caption, color: c.text.muted }}>
                        {sub}
                      </div>
                    </div>
                  </motion.button>
                ))}

                {/* Cancel trip — inside safety tools, quiet link */}
                <div className="h-px mt-2" style={{ background: c.surface.hover }} />
                <motion.button
                  className="w-full py-3 flex items-center justify-center"
                  onClick={() => {
                    setShowSafety(false);
                    setShowCancelConfirm(true);
                  }}
                  whileTap={{ scale: 0.97 }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.15 }}
                >
                  <span style={{ ...GLASS_TYPE.bodySmall, color: c.text.muted }}>
                    Cancel trip
                  </span>
                </motion.button>
              </GlassPanel>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Cancel trip confirmation ── */}
      <JetConfirm
        open={showCancelConfirm}
        colorMode={colorMode}
        title="Cancel trip?"
        message="You're currently in a ride. The driver will be notified and a cancellation fee may apply."
        confirmLabel="Cancel trip"
        cancelLabel="Keep riding"
        destructive
        onConfirm={() => {
          setShowCancelConfirm(false);
          setShowCancelReasons(true);
        }}
        onCancel={() => setShowCancelConfirm(false)}
      />

      {/* ── Cancel trip reasons ── */}
      <CancelReasonSheet
        open={showCancelReasons}
        colorMode={colorMode}
        reasons={RIDER_CANCEL_REASONS}
        onDismiss={() => setShowCancelReasons(false)}
        onSelect={() => {
          setShowCancelReasons(false);
          onCancel?.();
        }}
      />
    </div>
  );
}