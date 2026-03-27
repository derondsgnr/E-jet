/**
 * Booking Flow — "Split" (LOCKED)
 *
 * Horizontal split layout. Map peek on top (~28%), structured content
 * below. Linear-inspired information density. Vehicle rows use bare
 * surfaces (no glass cards) for cleaner hierarchy — glass is reserved
 * for containers and elevated content, not list items.
 *
 * SPINE COMPLIANCE: GlassPanel, MapCanvas, green-as-scalpel,
 * Montserrat/Manrope typography, motion stagger, noise + glow.
 *
 * HIERARCHY PRINCIPLE (LOCKED): List-style selections (vehicle rows,
 * option rows) use transparent backgrounds with selection-state tinting —
 * NOT individual GlassPanel cards. Glass is reserved for: containers,
 * overlays, elevated callouts.
 *
 * POLISH PASS v3:
 * - Radio buttons removed — selection via row tinting only (Uber/Bolt)
 * - Editable route: tappable route bar opens RouteEditSheet
 * - Payment sheet: tappable payment row opens PaymentSheet
 * - Safety sheet: tappable safety row opens SafetySheet
 * - Fixed CTA bar pinned to bottom (thumb zone, safe area aware)
 *
 * Architecture: Map strip (~28%) + Scrollable content + Fixed CTA bar.
 */

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowLeft,
  Car,
  Zap,
  Users,
  Crown,
  Clock,
  MapPin,
  Phone,
  MessageSquare,
  Shield,
  Star,
  CreditCard,
  Navigation,
  CircleDot,
  ChevronRight,
  Share2,
  CheckCircle2,
  Wallet,
  Pencil,
} from "lucide-react";
import {
  GLASS_COLORS,
  GLASS_TYPE,
  MOTION,
  type GlassColorMode,
} from "../../config/project";
import { BRAND_COLORS } from "../../config/brand";
import { RIDER_TYPE as RT } from "../../config/rider-type";
import { GlassPanel } from "./glass-panel";
import { MapCanvas } from "./map-canvas";
import {
  type BookingStage,
  STAGE_ORDER,
  vehicleTypes,
  mockRoute,
  mockDriver,
  mockCompletedTrip,
  tipOptions,
  type VehicleType,
  tripEndOTP,
} from "./booking-data";
import {
  RouteEditSheet,
  PaymentSheet,
  SafetySheet,
  ChatSheet,
} from "./booking-sheets";
import { DriverApproachA } from "./driver-approach-a";

/* ── Spring presets ── */
const SPRING_SNAPPY = {
  type: "spring" as const,
  stiffness: 500,
  damping: 32,
  mass: 0.8,
};
const SPRING_BOUNCY = {
  type: "spring" as const,
  stiffness: 400,
  damping: 22,
  mass: 0.6,
};
const SPRING_GENTLE = {
  type: "spring" as const,
  stiffness: 300,
  damping: 28,
  mass: 1,
};

/* ── Stage transition variants ── */
const stageVariants = {
  enter: { opacity: 0, y: 24, filter: "blur(4px)" },
  center: { opacity: 1, y: 0, filter: "blur(0px)" },
  exit: { opacity: 0, y: -12, filter: "blur(2px)" },
};

const vehicleIcons = {
  car: Car,
  "car-ev": Zap,
  "car-xl": Users,
  "car-lux": Crown,
};

interface BookingFlowBProps {
  colorMode?: GlassColorMode;
  onBack?: () => void;
  onComplete?: () => void;
  onScheduleForLater?: () => void;
}

export function BookingFlowB({ colorMode = "dark", onBack, onComplete, onScheduleForLater }: BookingFlowBProps) {
  const c = GLASS_COLORS[colorMode];
  const d = colorMode === "dark";

  /* ── Core state ── */
  const [stage, setStage] = useState<BookingStage>("vehicle-select");
  const [selectedVehicle, setSelectedVehicle] = useState<string>("jet-go");
  const [rating, setRating] = useState(0);
  const [selectedTip, setSelectedTip] = useState<number | null>(null);
  const [matchProgress, setMatchProgress] = useState(0);

  /* ── Editable route ── */
  const [pickup, setPickup] = useState({
    name: mockRoute.pickup.name,
    address: mockRoute.pickup.address,
  });
  const [dropoff, setDropoff] = useState({
    name: mockRoute.dropoff.name,
    address: mockRoute.dropoff.address,
  });

  /* ── Sheet state ── */
  const [routeSheetOpen, setRouteSheetOpen] = useState(false);
  const [paymentSheetOpen, setPaymentSheetOpen] = useState(false);
  const [safetySheetOpen, setSafetySheetOpen] = useState(false);
  const [chatSheetOpen, setChatSheetOpen] = useState(false);

  /* ── Payment ── */
  const [paymentId, setPaymentId] = useState("visa");
  const [paymentLabel, setPaymentLabel] = useState("Visa •••• 4821");

  /* ── Matching progress ── */
  useEffect(() => {
    if (stage === "matching") {
      setMatchProgress(0);
      const interval = setInterval(() => {
        setMatchProgress((p) => Math.min(p + 1, 100));
      }, 28);
      const t = setTimeout(() => {
        clearInterval(interval);
        setStage("driver-assigned");
      }, 3000);
      return () => {
        clearTimeout(t);
        clearInterval(interval);
      };
    }
  }, [stage]);

  const nextStage = useCallback(() => {
    const idx = STAGE_ORDER.indexOf(stage);
    if (idx < STAGE_ORDER.length - 1) setStage(STAGE_ORDER[idx + 1]);
  }, [stage]);

  const prevStage = useCallback(() => {
    const idx = STAGE_ORDER.indexOf(stage);
    if (idx > 0) setStage(STAGE_ORDER[idx - 1]);
    else onBack?.();
  }, [stage, onBack]);

  const selectedVehicleData = vehicleTypes.find(
    (v) => v.id === selectedVehicle
  );

  /* ══════════════════════════════════════════════════════════════════════
     Vehicle row — selection via background tinting only (no radio)
     ═════════════════════════════════════════════════════════════════════ */
  const renderVehicleRow = (v: VehicleType, i: number) => {
    const Icon = vehicleIcons[v.icon];
    const isSelected = selectedVehicle === v.id;

    return (
      <motion.button
        key={v.id}
        className="w-full text-left"
        initial={{ opacity: 0, y: 12, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{
          ...SPRING_SNAPPY,
          delay: i * 0.06,
        }}
        whileTap={{ scale: 0.97 }}
        onClick={() => setSelectedVehicle(v.id)}
      >
        <div
          className="flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all"
          style={{
            background: isSelected
              ? d
                ? "rgba(29,185,84,0.10)"
                : "rgba(29,185,84,0.05)"
              : "transparent",
            border: isSelected
              ? `1.5px solid ${BRAND_COLORS.green}40`
              : "1.5px solid transparent",
          }}
        >
          {/* Icon */}
          <motion.div
            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
            style={{
              background: v.isEV ? c.green.tint : c.surface.subtle,
            }}
            animate={{ scale: isSelected ? 1.05 : 1 }}
            transition={SPRING_SNAPPY}
          >
            <Icon
              className="w-[18px] h-[18px]"
              style={{
                color: v.isEV ? BRAND_COLORS.green : c.icon.tertiary,
              }}
            />
          </motion.div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <span
                style={{
                  ...GLASS_TYPE.bodySmall,
                  color: c.text.primary,
                  fontWeight: isSelected ? 600 : 500,
                }}
              >
                {v.name}
              </span>
              {v.isEV && (
                <span
                  className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md"
                  style={{ background: c.green.tint }}
                >
                  <Zap
                    className="w-2.5 h-2.5"
                    style={{ color: BRAND_COLORS.green }}
                  />
                  <span
                    style={{
                      ...GLASS_TYPE.caption,
                      fontSize: "10px",
                      color: BRAND_COLORS.green,
                    }}
                  >
                    EV
                  </span>
                </span>
              )}
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <Clock className="w-3 h-3" style={{ color: c.icon.muted }} />
              <span
                style={{ ...GLASS_TYPE.caption, color: c.text.muted }}
              >
                {v.eta}
              </span>
              <span
                style={{ ...GLASS_TYPE.caption, color: c.text.faint }}
              >
                ·
              </span>
              <span
                style={{ ...GLASS_TYPE.caption, color: c.text.muted }}
              >
                {v.capacity} seats
              </span>
            </div>
          </div>

          {/* Price */}
          <div className="text-right shrink-0">
            <span
              style={{
                ...GLASS_TYPE.body,
                color: isSelected ? BRAND_COLORS.green : c.text.primary,
              }}
            >
              {v.fare}
            </span>
            {v.savings && (
              <div
                style={{
                  ...GLASS_TYPE.caption,
                  color: c.green.evText,
                }}
              >
                {v.savings}
              </div>
            )}
          </div>
        </div>
      </motion.button>
    );
  };

  /* ══════════════════════════════════════════════════════════════════════
     Fixed CTA bar (pinned to bottom thumb zone)
     ══════════════════════════════════════════════════════════════════════ */
  const renderCTABar = () => {
    const showPayment = stage === "vehicle-select";
    const showCTA = stage === "vehicle-select" || stage === "complete";
    const showSimulate = stage === "in-progress";

    if (!showCTA && !showSimulate) return null;

    return (
      <motion.div
        className="absolute bottom-0 left-0 right-0 z-30"
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ ...SPRING_GENTLE, delay: 0.3 }}
      >
        {/* Fade gradient above the bar */}
        <div
          className="h-8 pointer-events-none"
          style={{
            background: d
              ? "linear-gradient(to bottom, transparent, #0B0B0D)"
              : "linear-gradient(to bottom, transparent, #FAFAFA)",
          }}
        />
        <div
          className="px-5 pb-2"
          style={{
            paddingBottom: "max(env(safe-area-inset-bottom, 20px), 20px)",
            background: c.bg,
          }}
        >
          {/* Payment method affordance */}
          {showPayment && (
            <motion.button
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl mb-3"
              style={{
                background: c.surface.subtle,
                border: `1px solid ${c.surface.hover}`,
              }}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...SPRING_SNAPPY, delay: 0.4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setPaymentSheetOpen(true)}
            >
              <CreditCard
                className="w-4 h-4"
                style={{ color: c.icon.secondary }}
              />
              <span
                style={{
                  ...GLASS_TYPE.bodySmall,
                  color: c.text.secondary,
                }}
              >
                {paymentLabel}
              </span>
              <ChevronRight
                className="w-4 h-4 ml-auto"
                style={{ color: c.icon.muted }}
              />
            </motion.button>
          )}

          {/* Primary CTA */}
          {showCTA && (
            <motion.button
              className="w-full py-4 rounded-2xl flex items-center justify-center gap-2 relative overflow-hidden"
              style={{ background: BRAND_COLORS.green }}
              onClick={
                stage === "complete"
                  ? () => {
                      setStage("vehicle-select");
                      setRating(0);
                      setSelectedTip(null);
                      onComplete?.();
                    }
                  : nextStage
              }
              whileTap={{ scale: 0.97 }}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={SPRING_SNAPPY}
            >
              {/* Shimmer */}
              <motion.div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.12) 50%, transparent 60%)",
                }}
                animate={{ x: ["-100%", "200%"] }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  repeatDelay: 3,
                  ease: "linear",
                }}
              />
              <span
                className="relative z-10"
                style={{ ...GLASS_TYPE.body, color: "#FFFFFF" }}
              >
                {stage === "complete"
                  ? "Done"
                  : `Book ${selectedVehicleData?.name} · ${selectedVehicleData?.fare}`}
              </span>
            </motion.button>
          )}

          {/* Schedule for later — only on vehicle-select */}
          {stage === "vehicle-select" && onScheduleForLater && (
            <motion.button
              className="w-full flex items-center justify-center gap-2 py-3"
              onClick={onScheduleForLater}
              whileTap={{ scale: 0.97 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Clock className="w-4 h-4" style={{ color: c.text.muted }} />
              <span style={{ ...GLASS_TYPE.bodySmall, color: c.text.muted }}>
                Schedule for later
              </span>
            </motion.button>
          )}

          {/* Simulate arrival (in-progress only) */}
          {showSimulate && (
            <motion.button
              className="w-full py-4 rounded-2xl flex items-center justify-center gap-2"
              style={{
                background: c.surface.subtle,
                border: `1px solid ${c.surface.hover}`,
              }}
              onClick={nextStage}
              whileTap={{ scale: 0.97 }}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ ...SPRING_SNAPPY, delay: 0.3 }}
            >
              <CheckCircle2
                className="w-4 h-4"
                style={{ color: BRAND_COLORS.green }}
              />
              <span
                style={{
                  ...GLASS_TYPE.bodySmall,
                  color: c.text.secondary,
                }}
              >
                Simulate arrival
              </span>
            </motion.button>
          )}
        </div>
      </motion.div>
    );
  };

  /* ══════════════════════════════════════════════════════════════════════
     Render
     ══════════════════════════════════════════════════════════════════════ */
  const isApproachStage = stage === "driver-assigned" || stage === "driver-arriving" || stage === "pickup-otp";

  if (isApproachStage) {
    return (
      <DriverApproachA
        colorMode={colorMode}
        onCancel={() => {
          setStage("vehicle-select");
        }}
        onRideStart={() => {
          setStage("in-progress");
        }}
      />
    );
  }

  return (
    <div
      className="relative h-screen w-full overflow-hidden flex flex-col"
      style={{ background: c.bg }}
    >
      {/* ── Map strip (top ~24%) ── */}
      <div className="relative shrink-0" style={{ height: "24vh" }}>
        <MapCanvas variant="muted" colorMode={colorMode} />

        {/* Map fade overlay */}
        {d && (
          <div className="absolute inset-0 bg-gradient-to-b from-[#0B0B0D]/30 via-transparent to-[#0B0B0D]/90 z-[1]" />
        )}
        {!d && (
          <div
            className="absolute inset-0 z-[1]"
            style={{
              background:
                "linear-gradient(to bottom, transparent 30%, rgba(250,250,250,0.85) 80%, #FAFAFA 100%)",
            }}
          />
        )}

        {/* Header overlay */}
        <div
          className="absolute top-0 left-0 right-0 z-10 px-5 pt-3"
          style={{ paddingTop: "env(safe-area-inset-top, 12px)" }}
        >
          <div className="flex items-center gap-3 pt-3">
            <motion.button
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{
                background: c.surface.button,
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
              }}
              onClick={prevStage}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.92 }}
              transition={SPRING_SNAPPY}
            >
              <ArrowLeft
                className="w-[18px] h-[18px]"
                style={{ color: c.icon.primary }}
              />
            </motion.button>
            <div className="flex-1" />
            {stage === "in-progress" && (
              <motion.button
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{
                  background: c.surface.button,
                  backdropFilter: "blur(16px)",
                  WebkitBackdropFilter: "blur(16px)",
                }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={SPRING_BOUNCY}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.92 }}
              >
                <Share2
                  className="w-4 h-4"
                  style={{ color: c.icon.primary }}
                />
              </motion.button>
            )}
          </div>
        </div>

        {/* Route info overlay on map — tappable to edit */}
        {(stage === "vehicle-select" || stage === "in-progress") && (
          <motion.div
            className="absolute bottom-3 left-5 right-5 z-10"
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ ...SPRING_GENTLE, delay: 0.15 }}
          >
            <motion.button
              className="w-full text-left"
              onClick={() => setRouteSheetOpen(true)}
              whileTap={{ scale: 0.97 }}
            >
              <GlassPanel
                variant={d ? "dark" : "light"}
                blur={20}
                className="px-3.5 py-2.5 rounded-xl"
              >
                <div className="flex items-center gap-2">
                  <CircleDot
                    className="w-3.5 h-3.5 shrink-0"
                    style={{ color: BRAND_COLORS.green }}
                  />
                  <span
                    className="flex-1 truncate"
                    style={{
                      ...GLASS_TYPE.bodySmall,
                      color: c.text.primary,
                    }}
                  >
                    {pickup.name}
                  </span>
                  <div
                    className="w-6 flex items-center justify-center"
                    style={{ color: c.text.muted }}
                  >
                    <motion.div
                      animate={{ x: [0, 3, 0] }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    >
                      →
                    </motion.div>
                  </div>
                  <MapPin
                    className="w-3.5 h-3.5 shrink-0"
                    style={{ color: c.text.tertiary }}
                  />
                  <span
                    className="flex-1 truncate"
                    style={{
                      ...GLASS_TYPE.bodySmall,
                      color: c.text.primary,
                    }}
                  >
                    {dropoff.name}
                  </span>
                  {/* Edit affordance */}
                  <Pencil
                    className="w-3 h-3 shrink-0 ml-1"
                    style={{ color: c.icon.muted }}
                  />
                </div>
              </GlassPanel>
            </motion.button>
          </motion.div>
        )}
      </div>

      {/* ── Content zone ─ */}
      <div
        className="flex-1 overflow-y-auto z-20"
        style={{ paddingBottom: stage === "matching" ? 24 : 140 }}
      >
        <div className="px-5 pt-6 pb-2">
          <AnimatePresence mode="wait">
            {/* ═══ Vehicle Select ═══ */}
            {stage === "vehicle-select" && (
              <motion.div
                key="vehicle-select"
                variants={stageVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={SPRING_GENTLE}
              >
                {/* Header */}
                <motion.div
                  className="flex items-center justify-between mb-4"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ ...SPRING_SNAPPY, delay: 0.05 }}
                >
                  <span
                    style={{
                      ...GLASS_TYPE.display,
                      fontSize: "20px",
                      lineHeight: "1.3",
                      color: c.text.primary,
                    }}
                  >
                    Select ride
                  </span>
                  <div
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg"
                    style={{ background: c.surface.subtle }}
                  >
                    <Navigation
                      className="w-3 h-3"
                      style={{ color: c.text.muted }}
                    />
                    <span
                      style={{
                        ...GLASS_TYPE.caption,
                        color: c.text.muted,
                      }}
                    >
                      {mockRoute.distance} · {mockRoute.duration}
                    </span>
                  </div>
                </motion.div>

                {/* Vehicle list */}
                <div className="space-y-1">
                  {vehicleTypes.map((v, i) => renderVehicleRow(v, i))}
                </div>
              </motion.div>
            )}

            {/* ═══ Matching ═══ */}
            {stage === "matching" && (
              <motion.div
                key="matching"
                className="py-16 text-center flex flex-col items-center"
                variants={stageVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={SPRING_GENTLE}
              >
                <div className="relative w-20 h-20 mx-auto mb-6">
                  {/* Outer ring */}
                  <motion.div
                    className="absolute inset-0 rounded-full"
                    style={{
                      border: `1.5px solid ${BRAND_COLORS.green}`,
                    }}
                    animate={{ scale: [1, 2.2], opacity: [0.4, 0] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeOut",
                    }}
                  />
                  {/* Inner ring */}
                  <motion.div
                    className="absolute inset-0 rounded-full"
                    style={{
                      border: `1px solid ${BRAND_COLORS.green}`,
                    }}
                    animate={{ scale: [1, 1.8], opacity: [0.3, 0] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeOut",
                      delay: 0.6,
                    }}
                  />
                  {/* Center icon */}
                  <motion.div
                    className="w-20 h-20 rounded-full flex items-center justify-center"
                    style={{ background: c.green.tint }}
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <Car
                      className="w-8 h-8"
                      style={{ color: BRAND_COLORS.green }}
                    />
                  </motion.div>
                </div>

                <motion.div
                  style={{ ...GLASS_TYPE.body, color: c.text.primary }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  Finding your driver
                </motion.div>
                <motion.div
                  className="mt-1.5"
                  style={{
                    ...GLASS_TYPE.bodySmallRegular,
                    color: c.text.muted,
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.45 }}
                >
                  Usually takes 10–30 seconds
                </motion.div>

                {/* Progress bar */}
                <motion.div
                  className="w-48 h-1 rounded-full mt-6 overflow-hidden"
                  style={{ background: c.surface.subtle }}
                  initial={{ opacity: 0, scaleX: 0.6 }}
                  animate={{ opacity: 1, scaleX: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <motion.div
                    className="h-full rounded-full"
                    style={{
                      background: BRAND_COLORS.green,
                      width: `${matchProgress}%`,
                      transition: "width 50ms linear",
                    }}
                  />
                </motion.div>
              </motion.div>
            )}

            {/* ═══ In Progress ═══ */}
            {stage === "in-progress" && (
              <motion.div
                key="in-progress"
                variants={stageVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={SPRING_GENTLE}
              >
                {/* Driver info */}
                <motion.div
                  className="flex items-center gap-3 mb-4"
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ ...SPRING_SNAPPY, delay: 0.1 }}
                >
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center shrink-0 relative"
                    style={{ background: c.green.tint }}
                  >
                    <span
                      style={{
                        ...GLASS_TYPE.body,
                        color: BRAND_COLORS.green,
                      }}
                    >
                      {mockDriver.avatarInitials}
                    </span>
                    {/* Online dot */}
                    <motion.div
                      className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full flex items-center justify-center"
                      style={{ background: c.bg }}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ ...SPRING_BOUNCY, delay: 0.4 }}
                    >
                      <div
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ background: BRAND_COLORS.green }}
                      />
                    </motion.div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div
                      style={{
                        ...GLASS_TYPE.body,
                        color: c.text.primary,
                      }}
                    >
                      {mockDriver.name}
                    </div>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <Star
                        className="w-3 h-3"
                        style={{
                          color: BRAND_COLORS.green,
                          fill: BRAND_COLORS.green,
                        }}
                      />
                      <span
                        style={{
                          ...GLASS_TYPE.caption,
                          color: c.text.secondary,
                        }}
                      >
                        {mockDriver.rating}
                      </span>
                      <span
                        style={{
                          ...GLASS_TYPE.caption,
                          color: c.text.faint,
                        }}
                      >
                        ·
                      </span>
                      <span
                        style={{
                          ...GLASS_TYPE.caption,
                          color: c.text.muted,
                        }}
                      >
                        {mockDriver.trips.toLocaleString()} trips
                      </span>
                    </div>
                  </div>

                  {/* Contact buttons */}
                  <div className="flex gap-2">
                    {[
                      { icon: Phone, label: "Call", action: () => {} },
                      { icon: MessageSquare, label: "Chat", action: () => setChatSheetOpen(true) },
                    ].map(({ icon: ActionIcon, label, action }, i) => (
                      <motion.button
                        key={label}
                        className="flex flex-col items-center gap-1"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{
                          ...SPRING_BOUNCY,
                          delay: 0.25 + i * 0.08,
                        }}
                        whileTap={{ scale: 0.88 }}
                        onClick={action}
                      >
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center"
                          style={{ background: c.surface.subtle }}
                        >
                          <ActionIcon
                            className="w-4 h-4"
                            style={{ color: c.icon.secondary }}
                          />
                        </div>
                        <span
                          style={{
                            ...GLASS_TYPE.caption,
                            fontSize: "10px",
                            color: c.text.muted,
                          }}
                        >
                          {label}
                        </span>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>

                {/* Vehicle info */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ ...SPRING_SNAPPY, delay: 0.2 }}
                >
                  <GlassPanel
                    variant={d ? "dark" : "light"}
                    blur={d ? 16 : 24}
                    className="px-4 py-3.5 rounded-xl mb-4"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div
                          style={{
                            ...GLASS_TYPE.bodySmall,
                            color: c.text.primary,
                          }}
                        >
                          {mockDriver.vehicle}
                        </div>
                        <div
                          style={{
                            ...GLASS_TYPE.caption,
                            color: c.text.muted,
                          }}
                        >
                          {mockDriver.color} · {mockDriver.plate}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1">
                          <Navigation
                            className="w-3.5 h-3.5"
                            style={{ color: BRAND_COLORS.green }}
                          />
                          <span
                            style={{
                              ...GLASS_TYPE.bodySmall,
                              color: BRAND_COLORS.green,
                            }}
                          >
                            {mockRoute.duration}
                          </span>
                        </div>
                        <div
                          style={{
                            ...GLASS_TYPE.caption,
                            color: c.text.muted,
                          }}
                        >
                          to destination
                        </div>
                      </div>
                    </div>
                  </GlassPanel>
                </motion.div>

                {/* Trip-end OTP — rider shows this to driver at destination */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ ...SPRING_SNAPPY, delay: 0.25 }}
                >
                  <GlassPanel
                    variant={d ? "dark" : "light"}
                    blur={d ? 16 : 24}
                    className="px-4 py-3.5 rounded-xl mb-4"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div
                          style={{
                            ...GLASS_TYPE.caption,
                            color: c.text.muted,
                            marginBottom: "4px",
                          }}
                        >
                          Trip-end code
                        </div>
                        <div className="flex gap-2">
                          {tripEndOTP.digits.map((digit, i) => (
                            <div
                              key={i}
                              className="w-9 h-10 rounded-lg flex items-center justify-center"
                              style={{
                                background: c.green.tint,
                                border: `1px solid ${BRAND_COLORS.green}20`,
                              }}
                            >
                              <span
                                style={{
                                  fontFamily: "var(--font-heading)",
                                  fontSize: "18px",
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
                      <div className="text-right" style={{ maxWidth: "120px" }}>
                        <span
                          style={{
                            ...GLASS_TYPE.caption,
                            color: c.text.ghost,
                            lineHeight: "1.4",
                          }}
                        >
                          Share this code with your driver at drop-off
                        </span>
                      </div>
                    </div>
                  </GlassPanel>
                </motion.div>

                {/* Safety + Payment — now functional */}
                <motion.button
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl mb-2"
                  style={{ background: c.surface.subtle }}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ ...SPRING_SNAPPY, delay: 0.3 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSafetySheetOpen(true)}
                >
                  <Shield
                    className="w-4 h-4"
                    style={{ color: c.icon.secondary }}
                  />
                  <div className="flex-1 text-left">
                    <span
                      style={{
                        ...GLASS_TYPE.bodySmall,
                        color: c.text.secondary,
                      }}
                    >
                      Safety tools
                    </span>
                  </div>
                  <ChevronRight
                    className="w-4 h-4"
                    style={{ color: c.icon.muted }}
                  />
                </motion.button>

                <motion.button
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl mb-2"
                  style={{ background: c.surface.subtle }}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ ...SPRING_SNAPPY, delay: 0.36 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setPaymentSheetOpen(true)}
                >
                  <Wallet
                    className="w-4 h-4"
                    style={{ color: c.icon.secondary }}
                  />
                  <div className="flex-1 text-left">
                    <span
                      style={{
                        ...GLASS_TYPE.bodySmall,
                        color: c.text.secondary,
                      }}
                    >
                      {paymentLabel}
                    </span>
                  </div>
                  <ChevronRight
                    className="w-4 h-4"
                    style={{ color: c.icon.muted }}
                  />
                </motion.button>
              </motion.div>
            )}

            {/* ═══ Complete ═══ */}
            {stage === "complete" && (
              <motion.div
                key="complete"
                variants={stageVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={SPRING_GENTLE}
              >
                {/* Trip summary */}
                <div className="text-center mb-6">
                  <motion.div
                    initial={{ scale: 0, rotate: -20 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={SPRING_BOUNCY}
                  >
                    <div
                      className="w-14 h-14 rounded-full mx-auto mb-3 flex items-center justify-center"
                      style={{ background: c.green.tint }}
                    >
                      <CheckCircle2
                        className="w-7 h-7"
                        style={{ color: BRAND_COLORS.green }}
                      />
                    </div>
                  </motion.div>
                  <motion.div
                    style={{
                      ...GLASS_TYPE.body,
                      color: c.text.primary,
                    }}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ ...SPRING_SNAPPY, delay: 0.15 }}
                  >
                    You've arrived
                  </motion.div>
                  <motion.div
                    className="mt-1"
                    style={{
                      ...GLASS_TYPE.display,
                      fontSize: "26px",
                      color: c.text.primary,
                    }}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ ...SPRING_BOUNCY, delay: 0.25 }}
                  >
                    {mockCompletedTrip.fare}
                  </motion.div>
                </div>

                {/* Fare breakdown */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ ...SPRING_SNAPPY, delay: 0.3 }}
                >
                  <GlassPanel
                    variant={d ? "dark" : "light"}
                    blur={d ? 16 : 24}
                    className="px-4 py-3.5 rounded-xl mb-4"
                  >
                    {mockCompletedTrip.fareBreakdown.map((item, i) => (
                      <motion.div
                        key={item.label}
                        className="flex items-center justify-between py-1.5"
                        style={{
                          borderBottom:
                            i < mockCompletedTrip.fareBreakdown.length - 1
                              ? `1px solid ${c.surface.subtle}`
                              : "none",
                        }}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                          ...SPRING_SNAPPY,
                          delay: 0.35 + i * 0.05,
                        }}
                      >
                        <span
                          style={{
                            ...GLASS_TYPE.bodySmallRegular,
                            color: c.text.muted,
                          }}
                        >
                          {item.label}
                        </span>
                        <span
                          style={{
                            ...GLASS_TYPE.bodySmall,
                            color: c.text.primary,
                          }}
                        >
                          {item.amount}
                        </span>
                      </motion.div>
                    ))}
                    {/* Payment method in breakdown */}
                    <motion.div
                      className="flex items-center justify-between pt-2.5 mt-1"
                      style={{
                        borderTop: `1px solid ${c.surface.hover}`,
                      }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.55 }}
                    >
                      <div className="flex items-center gap-2">
                        <CreditCard
                          className="w-3.5 h-3.5"
                          style={{ color: c.icon.muted }}
                        />
                        <span
                          style={{
                            ...GLASS_TYPE.caption,
                            color: c.text.muted,
                          }}
                        >
                          {paymentLabel}
                        </span>
                      </div>
                      <span
                        style={{
                          ...GLASS_TYPE.bodySmall,
                          color: c.text.primary,
                        }}
                      >
                        {mockCompletedTrip.fare}
                      </span>
                    </motion.div>
                  </GlassPanel>
                </motion.div>

                {/* Rating row */}
                <motion.div
                  className="flex items-center justify-between mb-4"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ ...SPRING_SNAPPY, delay: 0.45 }}
                >
                  <span
                    style={{
                      ...GLASS_TYPE.bodySmall,
                      color: c.text.secondary,
                    }}
                  >
                    Rate your trip
                  </span>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <motion.button
                        key={star}
                        onClick={() => setRating(star)}
                        whileTap={{ scale: 0.8 }}
                        animate={
                          star <= rating
                            ? { scale: 1.2, rotate: -8 }
                            : { scale: 1, rotate: 0 }
                        }
                        transition={SPRING_BOUNCY}
                      >
                        <Star
                          className="w-7 h-7"
                          style={{
                            color:
                              star <= rating
                                ? BRAND_COLORS.green
                                : c.text.ghost,
                            fill:
                              star <= rating
                                ? BRAND_COLORS.green
                                : "transparent",
                            transition: "color 0.15s, fill 0.15s",
                          }}
                        />
                      </motion.button>
                    ))}
                  </div>
                </motion.div>

                {/* Tip row */}
                <motion.div
                  className="flex gap-2 mb-4"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ ...SPRING_SNAPPY, delay: 0.5 }}
                >
                  {tipOptions.map((tip) => {
                    const isSel = selectedTip === tip.value;
                    return (
                      <motion.button
                        key={tip.value}
                        className="flex-1 py-3 rounded-xl"
                        style={{
                          background: isSel
                            ? c.green.tint
                            : c.surface.subtle,
                          border: isSel
                            ? `1.5px solid ${BRAND_COLORS.green}40`
                            : "1.5px solid transparent",
                        }}
                        onClick={() =>
                          setSelectedTip(
                            selectedTip === tip.value ? null : tip.value
                          )
                        }
                        whileTap={{ scale: 0.94 }}
                        animate={{ y: isSel ? -2 : 0 }}
                        transition={SPRING_SNAPPY}
                      >
                        <span
                          style={{
                            ...GLASS_TYPE.bodySmall,
                            color: isSel
                              ? BRAND_COLORS.green
                              : c.text.secondary,
                          }}
                        >
                          {tip.label}
                        </span>
                      </motion.button>
                    );
                  })}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── Fixed CTA bar ── */}
      <AnimatePresence mode="wait">{renderCTABar()}</AnimatePresence>

      {/* ── Bottom sheet overlays ── */}
      <RouteEditSheet
        open={routeSheetOpen}
        onClose={() => setRouteSheetOpen(false)}
        colorMode={colorMode}
        pickup={pickup}
        dropoff={dropoff}
        onUpdatePickup={setPickup}
        onUpdateDropoff={setDropoff}
      />

      <PaymentSheet
        open={paymentSheetOpen}
        onClose={() => setPaymentSheetOpen(false)}
        colorMode={colorMode}
        selectedId={paymentId}
        onSelect={(id, label, detail) => {
          setPaymentId(id);
          setPaymentLabel(`${label} ${detail}`);
        }}
      />

      <SafetySheet
        open={safetySheetOpen}
        onClose={() => setSafetySheetOpen(false)}
        colorMode={colorMode}
      />

      <ChatSheet
        open={chatSheetOpen}
        onClose={() => setChatSheetOpen(false)}
        colorMode={colorMode}
        driverName={mockDriver.name}
      />
    </div>
  );
}