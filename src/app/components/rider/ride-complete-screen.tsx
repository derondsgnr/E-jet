 /**
 * RideCompleteScreen — Trip complete with fare breakdown + tip selection.
 *
 * NORTHSTAR: Uber receipt + Apple Pay success moment
 * - Subtle celebration (green check, not confetti)
 * - Clear fare breakdown in a glass card
 * - Tip row: quick presets + custom
 * - Payment method confirmation
 * - "Continue" advances to rating
 *
 * SPINE: GlassPanel, MapCanvas, green-as-scalpel, motion stagger
 */

import { useState } from "react";
import { motion } from "motion/react";
import {
  Check,
  ChevronRight,
  CreditCard,
  Receipt,
  Clock,
  MapPin,
  Navigation,
  Leaf,
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
import { mockDriver, mockRoute, mockCompletedTrip, tipOptions } from "./booking-data";

const SPRING = { type: "spring" as const, stiffness: 500, damping: 32, mass: 0.8 };
const SPRING_BOUNCY = { type: "spring" as const, stiffness: 400, damping: 22, mass: 0.6 };

interface RideCompleteScreenProps {
  colorMode: GlassColorMode;
  onContinueToRating: () => void;
}

export function RideCompleteScreen({
  colorMode,
  onContinueToRating,
}: RideCompleteScreenProps) {
  const d = colorMode === "dark";
  const c = GLASS_COLORS[colorMode];

  const [selectedTip, setSelectedTip] = useState<number | null>(null);
  const [customTip, setCustomTip] = useState("");
  const [showCustom, setShowCustom] = useState(false);

  const handleTipSelect = (value: number) => {
    if (value === -1) {
      setShowCustom(true);
      setSelectedTip(null);
    } else {
      setShowCustom(false);
      setSelectedTip(value === selectedTip ? null : value);
    }
  };

  const totalWithTip = () => {
    const base = 3200;
    const tip = showCustom
      ? parseInt(customTip) || 0
      : selectedTip || 0;
    return `₦${(base + tip).toLocaleString()}`;
  };

  return (
    <div
      className="relative h-screen w-full overflow-hidden flex flex-col"
      style={{ background: c.bg }}
    >
      {/* ── Atmospheric background ── */}
      <div className="absolute inset-0">
        <MapCanvas variant="muted" colorMode={colorMode} />
        {d ? (
          <div className="absolute inset-0 bg-gradient-to-b from-[#0B0B0D]/80 via-[#0B0B0D]/60 to-[#0B0B0D]/90 z-[1]" />
        ) : (
          <div
            className="absolute inset-0 z-[1]"
            style={{
              background:
                "linear-gradient(to bottom, rgba(250,250,250,0.85) 0%, rgba(250,250,250,0.7) 50%, rgba(250,250,250,0.9) 100%)",
            }}
          />
        )}
      </div>

      {/* ── Scrollable content ── */}
      <div
        className="relative z-10 flex-1 overflow-y-auto scrollbar-hide"
        style={{ paddingTop: "calc(env(safe-area-inset-top, 12px) + 24px)" }}
      >
        <div className="px-5 pb-4">
          {/* Success badge */}
          <motion.div
            className="flex flex-col items-center mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...SPRING, delay: 0.1 }}
          >
            <motion.div
              className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
              style={{
                background: d ? "rgba(29,185,84,0.12)" : "rgba(29,185,84,0.08)",
                border: `2px solid ${BRAND_COLORS.green}30`,
              }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={SPRING_BOUNCY}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ ...SPRING_BOUNCY, delay: 0.25 }}
              >
                <Check
                  className="w-7 h-7"
                  style={{ color: BRAND_COLORS.green }}
                  strokeWidth={2.5}
                />
              </motion.div>
            </motion.div>

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
              Trip complete
            </span>
            <span
              className="mt-1"
              style={{ ...GLASS_TYPE.bodySmall, color: c.text.muted }}
            >
              You've arrived at {mockRoute.dropoff.name}
            </span>
          </motion.div>

          {/* ── Fare card ── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...MOTION.standard, delay: 0.2 }}
          >
            <GlassPanel
              variant={d ? "dark" : "light"}
              blur={20}
              className="rounded-2xl px-5 py-5 mb-4"
            >
              {/* Total fare */}
              <div className="flex items-center justify-between mb-4">
                <span style={{ ...GLASS_TYPE.bodySmall, color: c.text.muted }}>
                  Total fare
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontSize: "28px",
                    fontWeight: 600,
                    letterSpacing: "-0.03em",
                    lineHeight: "1.15",
                    color: c.text.display,
                  }}
                >
                  {mockCompletedTrip.fare}
                </span>
              </div>

              {/* Breakdown */}
              <div
                className="pt-3 mb-3"
                style={{ borderTop: `1px solid ${c.surface.hover}` }}
              >
                {mockCompletedTrip.fareBreakdown.map(({ label, amount }, i) => (
                  <div
                    key={label}
                    className="flex items-center justify-between py-1.5"
                  >
                    <span style={{ ...GLASS_TYPE.bodySmall, color: c.text.secondary }}>
                      {label}
                    </span>
                    <span style={{ ...GLASS_TYPE.bodySmall, color: c.text.primary }}>
                      {amount}
                    </span>
                  </div>
                ))}
              </div>

              {/* Payment method */}
              <div
                className="flex items-center justify-between pt-3"
                style={{ borderTop: `1px solid ${c.surface.hover}` }}
              >
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4" style={{ color: c.icon.secondary }} />
                  <span style={{ ...GLASS_TYPE.bodySmall, color: c.text.secondary }}>
                    {mockCompletedTrip.paymentMethod}
                  </span>
                </div>
                <Check className="w-4 h-4" style={{ color: BRAND_COLORS.green }} />
              </div>
            </GlassPanel>
          </motion.div>

          {/* ── Trip summary ── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...MOTION.standard, delay: 0.28 }}
          >
            <GlassPanel
              variant={d ? "dark" : "light"}
              blur={20}
              className="rounded-2xl px-5 py-4 mb-4"
            >
              <div className="flex items-center gap-5">
                {/* Route indicator */}
                <div className="flex flex-col items-center shrink-0">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ background: c.text.muted }}
                  />
                  <div
                    className="w-px h-6 my-1"
                    style={{ background: c.surface.hover }}
                  />
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ background: BRAND_COLORS.green }}
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="mb-3">
                    <div
                      className="truncate"
                      style={{ ...GLASS_TYPE.bodySmall, color: c.text.primary }}
                    >
                      {mockRoute.pickup.name}
                    </div>
                    <div style={{ ...GLASS_TYPE.caption, color: c.text.muted }}>
                      {mockCompletedTrip.pickupTime}
                    </div>
                  </div>
                  <div>
                    <div
                      className="truncate"
                      style={{ ...GLASS_TYPE.bodySmall, color: c.text.primary }}
                    >
                      {mockRoute.dropoff.name}
                    </div>
                    <div style={{ ...GLASS_TYPE.caption, color: c.text.muted }}>
                      {mockCompletedTrip.dropoffTime}
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex flex-col items-end gap-1.5 shrink-0">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" style={{ color: c.icon.muted }} />
                    <span style={{ ...GLASS_TYPE.caption, color: c.text.secondary }}>
                      {mockCompletedTrip.durationActual}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Navigation className="w-3 h-3" style={{ color: c.icon.muted }} />
                    <span style={{ ...GLASS_TYPE.caption, color: c.text.secondary }}>
                      {mockCompletedTrip.distanceActual}
                    </span>
                  </div>
                </div>
              </div>
            </GlassPanel>
          </motion.div>

          {/* ── Carbon saved callout (EV only) ── */}
          {mockCompletedTrip.isEV && mockCompletedTrip.carbonSavedKg && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...MOTION.standard, delay: 0.32 }}
            >
              <div
                className="flex items-center gap-3 px-4 py-3.5 rounded-2xl mb-4"
                style={{
                  background: d ? "rgba(29,185,84,0.06)" : "rgba(29,185,84,0.04)",
                  border: `1px solid rgba(29,185,84,${d ? "0.12" : "0.08"})`,
                }}
              >
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: d ? "rgba(29,185,84,0.12)" : "rgba(29,185,84,0.08)" }}
                >
                  <Leaf className="w-4 h-4" style={{ color: BRAND_COLORS.green }} />
                </div>
                <div className="flex-1">
                  <div className="flex items-baseline gap-1.5">
                    <span
                      style={{
                        fontFamily: "var(--font-heading)",
                        fontSize: "16px",
                        fontWeight: 600,
                        letterSpacing: "-0.02em",
                        lineHeight: "1.2",
                        color: BRAND_COLORS.green,
                      }}
                    >
                      {mockCompletedTrip.carbonSavedKg} kg CO₂
                    </span>
                    <span style={{ ...GLASS_TYPE.caption, color: c.text.muted }}>
                      saved
                    </span>
                  </div>
                  <span style={{ ...GLASS_TYPE.caption, color: c.text.faint }}>
                    vs. a petrol vehicle over {mockCompletedTrip.distanceActual}
                  </span>
                </div>
              </div>
            </motion.div>
          )}

          {/* ── Tip section ── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...MOTION.standard, delay: 0.36 }}
          >
            <GlassPanel
              variant={d ? "dark" : "light"}
              blur={20}
              className="rounded-2xl px-5 py-5 mb-4"
            >
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
                <div>
                  <span style={{ ...GLASS_TYPE.body, color: c.text.primary }}>
                    Tip {mockDriver.name.split(" ")[0]}?
                  </span>
                  <div style={{ ...GLASS_TYPE.caption, color: c.text.muted }}>
                    100% goes to your driver
                  </div>
                </div>
              </div>

              {/* Tip options */}
              <div className="flex gap-2">
                {tipOptions.map(({ label, value }) => {
                  const isSelected =
                    value === -1 ? showCustom : selectedTip === value;
                  return (
                    <motion.button
                      key={label}
                      className="flex-1 py-2.5 rounded-xl transition-colors"
                      style={{
                        background: isSelected
                          ? d
                            ? "rgba(29,185,84,0.12)"
                            : "rgba(29,185,84,0.08)"
                          : c.surface.subtle,
                        border: isSelected
                          ? `1px solid rgba(29,185,84,${d ? "0.25" : "0.2"})`
                          : "1px solid transparent",
                      }}
                      onClick={() => handleTipSelect(value)}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span
                        style={{
                          ...GLASS_TYPE.bodySmall,
                          fontWeight: isSelected ? 600 : 500,
                          color: isSelected
                            ? BRAND_COLORS.green
                            : c.text.secondary,
                        }}
                      >
                        {label}
                      </span>
                    </motion.button>
                  );
                })}
              </div>

              {/* Custom tip input */}
              {showCustom && (
                <motion.div
                  className="mt-3"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  transition={MOTION.standard}
                >
                  <div
                    className="flex items-center gap-2 px-3.5 py-3 rounded-xl"
                    style={{
                      background: c.surface.subtle,
                      border: `1px solid ${d ? "rgba(255,255,255,0.08)" : "rgba(11,11,13,0.08)"}`,
                    }}
                  >
                    <span style={{ ...GLASS_TYPE.bodySmall, color: c.text.muted }}>
                      ₦
                    </span>
                    <input
                      type="number"
                      value={customTip}
                      onChange={(e) => setCustomTip(e.target.value)}
                      placeholder="Enter amount"
                      className="flex-1 bg-transparent outline-none"
                      style={{
                        ...GLASS_TYPE.bodySmall,
                        color: c.text.primary,
                      }}
                      autoFocus
                    />
                  </div>
                </motion.div>
              )}
            </GlassPanel>
          </motion.div>

          {/* ── Get receipt link ── */}
          <motion.button
            className="w-full flex items-center justify-center gap-2 py-3 mb-4"
            onClick={() => {}}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ ...MOTION.standard, delay: 0.44 }}
          >
            <Receipt className="w-4 h-4" style={{ color: c.icon.muted }} />
            <span style={{ ...GLASS_TYPE.bodySmall, color: c.text.muted }}>
              Email receipt
            </span>
          </motion.button>
        </div>
      </div>

      {/* ── Continue bar ── */}
      <div
        className="relative z-10 shrink-0 px-5 pt-3"
        style={{
          paddingBottom: "max(env(safe-area-inset-bottom, 24px), 24px)",
          borderTop: `1px solid ${c.surface.hover}`,
          background: d ? "rgba(11,11,13,0.8)" : "rgba(250,250,250,0.8)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
        }}
      >
        {selectedTip || (showCustom && customTip) ? (
          <div className="flex items-center justify-between mb-3">
            <span style={{ ...GLASS_TYPE.caption, color: c.text.muted }}>
              Total with tip
            </span>
            <span
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "17px",
                fontWeight: 600,
                letterSpacing: "-0.02em",
                lineHeight: "1.2",
                color: c.text.primary,
              }}
            >
              {totalWithTip()}
            </span>
          </div>
        ) : null}

        <motion.button
          className="w-full py-3.5 rounded-xl flex items-center justify-center gap-2 relative overflow-hidden"
          style={{ background: BRAND_COLORS.green }}
          onClick={onContinueToRating}
          whileTap={{ scale: 0.98 }}
        >
          <motion.div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.12) 50%, transparent 60%)",
            }}
            animate={{ x: ["-100%", "200%"] }}
            transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 4, ease: "linear" }}
          />
          <span
            className="relative z-10"
            style={{ ...GLASS_TYPE.small, fontWeight: 600, color: "#fff" }}
          >
            Rate your trip
          </span>
          <ChevronRight className="w-4 h-4 relative z-10" style={{ color: "#fff" }} />
        </motion.button>
      </div>
    </div>
  );
}