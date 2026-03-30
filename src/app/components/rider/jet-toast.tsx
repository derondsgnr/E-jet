 /**
 * JetToast — Vercel/Linear-style toast notification system.
 *
 * Shared across all Rider screens. Supports:
 *   - success / error / info / warning variants
 *   - auto-dismiss with configurable duration
 *   - stacking (multiple toasts)
 *   - swipe-to-dismiss feel (tap to dismiss)
 *   - C spine: glass surface, Manrope type, green-as-scalpel
 *
 * Usage:
 *   const { showToast, ToastContainer } = useJetToast(colorMode);
 *   showToast({ message: "Place saved", variant: "success" });
 *   // render <ToastContainer /> at root level
 */

import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Check, X, AlertTriangle, Info } from "lucide-react";
import { GLASS_COLORS, GLASS_TYPE, type GlassColorMode, Z } from "../../config/project";
import { BRAND_COLORS } from "../../config/brand";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export type ToastVariant = "success" | "error" | "info" | "warning";

export interface ToastConfig {
  message: string;
  variant?: ToastVariant;
  duration?: number; // ms, default 2500
  action?: { label: string; onPress: () => void };
}

interface ToastEntry extends Required<Omit<ToastConfig, "action">> {
  id: number;
  action?: ToastConfig["action"];
}

// ---------------------------------------------------------------------------
// Variant config
// ---------------------------------------------------------------------------
const VARIANT_ICON = {
  success: Check,
  error: X,
  info: Info,
  warning: AlertTriangle,
};

const variantColor = (variant: ToastVariant, d: boolean) => {
  switch (variant) {
    case "success": return BRAND_COLORS.green;
    case "error":   return BRAND_COLORS.error;
    case "warning": return BRAND_COLORS.warning;
    case "info":    return d ? "rgba(255,255,255,0.5)" : "#6E6E70";
  }
};

const variantBg = (variant: ToastVariant, d: boolean) => {
  switch (variant) {
    case "success": return d ? "rgba(29,185,84,0.12)" : "rgba(29,185,84,0.08)";
    case "error":   return d ? "rgba(212,24,61,0.12)" : "rgba(212,24,61,0.08)";
    case "warning": return d ? "rgba(245,158,11,0.12)" : "rgba(245,158,11,0.08)";
    case "info":    return "transparent";
  }
};

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------
let _toastId = 0;

export function useJetToast(colorMode: GlassColorMode) {
  const [toasts, setToasts] = useState<ToastEntry[]>([]);
  const timers = useRef<Map<number, ReturnType<typeof setTimeout>>>(new Map());

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    const timer = timers.current.get(id);
    if (timer) { clearTimeout(timer); timers.current.delete(id); }
  }, []);

  const showToast = useCallback((config: ToastConfig) => {
    const id = ++_toastId;
    const entry: ToastEntry = {
      id,
      message: config.message,
      variant: config.variant ?? "success",
      duration: config.duration ?? 2500,
      action: config.action,
    };
    setToasts((prev) => [...prev.slice(-2), entry]); // max 3 visible
    const timer = setTimeout(() => dismiss(id), entry.duration);
    timers.current.set(id, timer);
  }, [dismiss]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      timers.current.forEach((t) => clearTimeout(t));
    };
  }, []);

  const ToastContainer = useCallback(() => {
    const d = colorMode === "dark";
    const c = GLASS_COLORS[colorMode];

    return (
      <div
        className="fixed bottom-28 left-1/2 -translate-x-1/2 flex flex-col-reverse items-center gap-2 pointer-events-none"
        style={{ zIndex: Z.toast, width: "calc(100% - 40px)", maxWidth: 360 }}
      >
        <AnimatePresence mode="popLayout">
          {toasts.map((toast) => {
            const Icon = VARIANT_ICON[toast.variant];
            const iconColor = variantColor(toast.variant, d);
            const pillBg = variantBg(toast.variant, d);

            return (
              <motion.div
                key={toast.id}
                layout
                className="pointer-events-auto w-full"
                initial={{ y: 16, opacity: 0, scale: 0.92, filter: "blur(4px)" }}
                animate={{ y: 0, opacity: 1, scale: 1, filter: "blur(0px)" }}
                exit={{ y: 8, opacity: 0, scale: 0.95, filter: "blur(2px)" }}
                transition={{ type: "spring", stiffness: 500, damping: 32 }}
                onClick={() => dismiss(toast.id)}
              >
                <div
                  className="flex items-center gap-2.5 px-4 py-3 rounded-2xl"
                  style={{
                    background: d ? "rgba(28,28,30,0.92)" : "rgba(255,255,255,0.95)",
                    backdropFilter: "blur(24px)",
                    WebkitBackdropFilter: "blur(24px)",
                    border: `1px solid ${d ? "rgba(255,255,255,0.06)" : "rgba(11,11,13,0.06)"}`,
                    boxShadow: d
                      ? "0 8px 32px rgba(0,0,0,0.4), 0 2px 8px rgba(0,0,0,0.2)"
                      : "0 8px 32px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04)",
                  }}
                >
                  {/* Icon pill */}
                  <div
                    className="w-6 h-6 rounded-md flex items-center justify-center shrink-0"
                    style={{ background: pillBg }}
                  >
                    <Icon className="w-3 h-3" style={{ color: iconColor }} strokeWidth={2.5} />
                  </div>

                  {/* Message */}
                  <span
                    className="flex-1"
                    style={{
                      ...GLASS_TYPE.bodySmall,
                      color: c.text.primary,
                    }}
                  >
                    {toast.message}
                  </span>

                  {/* Optional action */}
                  {toast.action && (
                    <button
                      className="shrink-0 px-2 py-0.5 rounded-md"
                      style={{
                        ...GLASS_TYPE.caption,
                        fontWeight: 600,
                        color: BRAND_COLORS.green,
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        toast.action!.onPress();
                        dismiss(toast.id);
                      }}
                    >
                      {toast.action.label}
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    );
  }, [colorMode, toasts, dismiss]);

  return { showToast, ToastContainer, dismiss };
}
