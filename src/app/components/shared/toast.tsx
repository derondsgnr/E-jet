/**
 * Toast — shared component
 *
 * Extracted from 5 fleet views (P2 debt).
 * Superset of all variants: supports success/info/error types,
 * auto-dismiss at 3s, glass-blur surface, green-scalpel status dot.
 *
 * Usage:
 *   <AnimatePresence>
 *     {toast && <Toast message={toast.message} type={toast.type} onDismiss={() => setToast(null)} />}
 *   </AnimatePresence>
 */

import { useEffect } from "react";
import { motion } from "motion/react";
import { useAdminTheme, BRAND, TY, STATUS } from "../../config/admin-theme";

export type ToastType = "success" | "info" | "error";

export function Toast({ message, onDismiss, type = "success" }: {
  message: string;
  onDismiss: () => void;
  type?: ToastType;
}) {
  const { t, theme } = useAdminTheme();
  const isDark = theme === "dark";
  const color = type === "success" ? BRAND.green : type === "error" ? STATUS.error : STATUS.info;

  useEffect(() => {
    const timer = setTimeout(onDismiss, 3000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <motion.div
      className="fixed bottom-6 left-1/2 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl"
      style={{
        background: isDark ? "rgba(22,22,24,0.95)" : "rgba(255,255,255,0.97)",
        border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}`,
        backdropFilter: "blur(20px)",
        boxShadow: isDark ? "0 8px 32px rgba(0,0,0,0.5)" : "0 8px 32px rgba(0,0,0,0.12)",
        transform: "translateX(-50%)",
      }}
      initial={{ opacity: 0, y: 20, x: "-50%" }}
      animate={{ opacity: 1, y: 0, x: "-50%" }}
      exit={{ opacity: 0, y: 10, x: "-50%" }}
      transition={{ duration: 0.25 }}
    >
      <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: color }} />
      <span style={{ ...TY.body, fontSize: "12px", color: t.text, lineHeight: "1.4", letterSpacing: "-0.02em" }}>
        {message}
      </span>
    </motion.div>
  );
}
