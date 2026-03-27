 /**
 * JetConfirm — Confirmation dialog / destructive action modal.
 *
 * Apple-style alert dialog with C spine DNA:
 *   - Glass backdrop + centered card
 *   - Destructive actions get red treatment
 *   - Spring animation with blur entrance
 *   - Keyboard-friendly (Escape to dismiss)
 *
 * Usage:
 *   <JetConfirm
 *     open={showConfirm}
 *     colorMode={colorMode}
 *     title="Sign out?"
 *     message="You'll need to sign in again to book rides."
 *     confirmLabel="Sign out"
 *     destructive
 *     onConfirm={handleSignOut}
 *     onCancel={() => setShowConfirm(false)}
 *   />
 */

import { useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { GLASS_COLORS, GLASS_TYPE, type GlassColorMode, Z } from "../../config/project";
import { BRAND_COLORS } from "../../config/brand";

interface Props {
  open: boolean;
  colorMode: GlassColorMode;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function JetConfirm({
  open,
  colorMode,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  destructive = false,
  onConfirm,
  onCancel,
}: Props) {
  const c = GLASS_COLORS[colorMode];
  const d = colorMode === "dark";

  // Escape key to dismiss
  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) onCancel();
    },
    [open, onCancel]
  );
  useEffect(() => {
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [handleKey]);

  const confirmColor = destructive ? BRAND_COLORS.error : BRAND_COLORS.green;
  const confirmBg = destructive
    ? (d ? "rgba(212,24,61,0.15)" : "rgba(212,24,61,0.1)")
    : (d ? "rgba(29,185,84,0.15)" : "rgba(29,185,84,0.1)");

  return (
    <AnimatePresence>
      {open && (
        <div
          className="fixed inset-0 flex items-center justify-center px-8"
          style={{ zIndex: Z.modal }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0"
            style={{ background: d ? "rgba(0,0,0,0.55)" : "rgba(0,0,0,0.2)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={onCancel}
          />

          {/* Card */}
          <motion.div
            className="relative w-full max-w-[300px] rounded-2xl overflow-hidden"
            style={{
              background: d ? "#1C1C1E" : "#FFFFFF",
              border: `1px solid ${d ? "rgba(255,255,255,0.08)" : "rgba(11,11,13,0.06)"}`,
              boxShadow: d
                ? "0 24px 64px rgba(0,0,0,0.6)"
                : "0 24px 64px rgba(0,0,0,0.12)",
            }}
            initial={{ opacity: 0, scale: 0.88, filter: "blur(8px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 0.92, filter: "blur(4px)" }}
            transition={{ type: "spring", stiffness: 500, damping: 32 }}
          >
            {/* Content */}
            <div className="px-6 pt-6 pb-4 text-center">
              <h3
                style={{
                  ...GLASS_TYPE.body,
                  fontWeight: 600,
                  color: c.text.primary,
                  marginBottom: "6px",
                }}
              >
                {title}
              </h3>
              <p
                style={{
                  ...GLASS_TYPE.bodySmall,
                  color: c.text.muted,
                  lineHeight: "1.5",
                }}
              >
                {message}
              </p>
            </div>

            {/* Divider */}
            <div
              style={{
                height: 1,
                background: d ? "rgba(255,255,255,0.06)" : "rgba(11,11,13,0.06)",
              }}
            />

            {/* Actions — stacked Apple style */}
            <div className="flex flex-col">
              <motion.button
                className="py-3 text-center"
                style={{
                  ...GLASS_TYPE.bodySmall,
                  fontWeight: 600,
                  color: confirmColor,
                  background: confirmBg,
                }}
                whileTap={{ scale: 0.97, opacity: 0.8 }}
                onClick={onConfirm}
              >
                {confirmLabel}
              </motion.button>
              <div
                style={{
                  height: 1,
                  background: d ? "rgba(255,255,255,0.06)" : "rgba(11,11,13,0.06)",
                }}
              />
              <motion.button
                className="py-3 text-center"
                style={{
                  ...GLASS_TYPE.bodySmall,
                  color: c.text.secondary,
                }}
                whileTap={{ scale: 0.97, opacity: 0.8 }}
                onClick={onCancel}
              >
                {cancelLabel}
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
