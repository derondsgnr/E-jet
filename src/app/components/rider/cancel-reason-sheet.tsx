 /**
 * CancelReasonSheet — Post-confirmation reason selection.
 *
 * Appears after user confirms "Cancel ride/trip?" via JetConfirm.
 * Presents contextual reasons, user taps one, cancel fires with reason.
 *
 * NORTHSTAR: Uber cancel reason flow — simple list, single tap, done.
 * SPINE: GlassPanel, motion stagger, green-as-scalpel.
 */

import { motion, AnimatePresence } from "motion/react";
import { X, ChevronRight } from "lucide-react";
import {
  GLASS_COLORS,
  GLASS_TYPE,
  MOTION,
  Z,
  type GlassColorMode,
} from "../../config/project";
import { BRAND_COLORS } from "../../config/brand";
import { GlassPanel } from "./glass-panel";

export interface CancelReason {
  id: string;
  label: string;
}

export const RIDER_CANCEL_REASONS: CancelReason[] = [
  { id: "changed_plans", label: "Changed my plans" },
  { id: "driver_late", label: "Driver is taking too long" },
  { id: "wrong_address", label: "Incorrect pickup or destination" },
  { id: "found_other", label: "Found another ride" },
  { id: "safety", label: "Safety concern" },
  { id: "other", label: "Other reason" },
];

export const DRIVER_CANCEL_REASONS: CancelReason[] = [
  { id: "rider_not_here", label: "Rider not at pickup location" },
  { id: "rider_unresponsive", label: "Rider not responding" },
  { id: "unsafe", label: "Unsafe conditions" },
  { id: "vehicle_issue", label: "Vehicle issue" },
  { id: "rider_requested", label: "Rider asked to cancel" },
  { id: "other", label: "Other reason" },
];

interface CancelReasonSheetProps {
  open: boolean;
  colorMode: GlassColorMode;
  reasons: CancelReason[];
  title?: string;
  onSelect: (reason: CancelReason) => void;
  onDismiss: () => void;
}

export function CancelReasonSheet({
  open,
  colorMode,
  reasons,
  title = "Why are you cancelling?",
  onSelect,
  onDismiss,
}: CancelReasonSheetProps) {
  const c = GLASS_COLORS[colorMode];
  const d = colorMode === "dark";

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0"
            style={{ zIndex: Z.modal, background: d ? "rgba(0,0,0,0.5)" : "rgba(0,0,0,0.15)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onDismiss}
          />

          {/* Sheet */}
          <motion.div
            className="fixed bottom-0 left-0 right-0"
            style={{ zIndex: Z.modal + 1 }}
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
              {/* Header */}
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
                  {title}
                </span>
                <motion.button
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ background: c.surface.subtle }}
                  onClick={onDismiss}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="w-4 h-4" style={{ color: c.icon.secondary }} />
                </motion.button>
              </div>

              {/* Reasons list */}
              <div className="space-y-0">
                {reasons.map((reason, i) => (
                  <motion.button
                    key={reason.id}
                    className="w-full flex items-center justify-between py-3.5"
                    style={{
                      borderBottom:
                        i < reasons.length - 1
                          ? `1px solid ${c.surface.hover}`
                          : "none",
                    }}
                    onClick={() => onSelect(reason)}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ ...MOTION.standard, delay: i * 0.03 }}
                  >
                    <span style={{ ...GLASS_TYPE.body, color: c.text.primary }}>
                      {reason.label}
                    </span>
                    <ChevronRight
                      className="w-4 h-4 shrink-0"
                      style={{ color: c.icon.muted }}
                    />
                  </motion.button>
                ))}
              </div>

              {/* Go back */}
              <motion.button
                className="w-full py-3 mt-3 rounded-xl flex items-center justify-center"
                style={{ background: c.surface.subtle }}
                onClick={onDismiss}
                whileTap={{ scale: 0.97 }}
              >
                <span style={{ ...GLASS_TYPE.bodySmall, color: c.text.muted }}>
                  Don't cancel
                </span>
              </motion.button>
            </GlassPanel>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}