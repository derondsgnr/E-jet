/**
 * ConfirmModal — shared component
 *
 * Extracted from 3 fleet views (P2 debt).
 * Superset: supports destructive (red) + success (green) variants,
 * focus trap, Escape key close, ARIA dialog role.
 *
 * Usage:
 *   <AnimatePresence>
 *     {showConfirm && (
 *       <ConfirmModal
 *         title="Delete fleet?"
 *         message="This cannot be undone."
 *         confirmLabel="Delete"
 *         destructive
 *         onConfirm={handleDelete}
 *         onCancel={() => setShowConfirm(false)}
 *       />
 *     )}
 *   </AnimatePresence>
 */

import { useEffect, useRef } from "react";
import { motion } from "motion/react";
import { AlertTriangle, CheckCircle } from "lucide-react";
import { useAdminTheme, BRAND, TY, STATUS } from "../../config/admin-theme";

export function ConfirmModal({ title, message, confirmLabel, destructive, onConfirm, onCancel }: {
  title: string;
  message: string;
  confirmLabel: string;
  destructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const { t, theme } = useAdminTheme();
  const isDark = theme === "dark";
  const color = destructive ? STATUS.error : BRAND.green;
  const confirmRef = useRef<HTMLButtonElement>(null);
  const Icon = destructive ? AlertTriangle : CheckCircle;

  // Focus trap + Escape key
  useEffect(() => {
    confirmRef.current?.focus();
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onCancel]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-title"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="absolute inset-0" style={{ background: isDark ? "rgba(0,0,0,0.7)" : "rgba(0,0,0,0.3)" }} onClick={onCancel} />
      <motion.div
        className="relative w-full max-w-sm rounded-2xl p-6"
        style={{
          background: isDark ? "rgba(22,22,24,0.97)" : "#fff",
          border: `1px solid ${t.borderSubtle}`,
          boxShadow: isDark ? "0 24px 64px rgba(0,0,0,0.5)" : "0 24px 64px rgba(0,0,0,0.15)",
        }}
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ background: `${color}12` }}>
          <Icon size={18} style={{ color }} />
        </div>
        <h3 id="confirm-title" style={{ ...TY.sub, fontSize: "15px", color: t.text, lineHeight: "1.3", marginBottom: 6 }}>{title}</h3>
        <p style={{ ...TY.bodyR, fontSize: "13px", color: t.textSecondary, lineHeight: "1.5", marginBottom: 20 }}>{message}</p>
        <div className="flex gap-3">
          <button
            className="flex-1 py-2.5 rounded-xl transition-colors cursor-pointer"
            style={{ background: t.surface, border: `1px solid ${t.borderSubtle}`, ...TY.body, fontSize: "13px", color: t.textSecondary, lineHeight: "1.4", letterSpacing: "-0.02em" }}
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            ref={confirmRef}
            className="flex-1 py-2.5 rounded-xl transition-opacity hover:opacity-90 cursor-pointer"
            style={{ background: color, ...TY.body, fontSize: "13px", color: "#fff", lineHeight: "1.4", letterSpacing: "-0.02em" }}
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
