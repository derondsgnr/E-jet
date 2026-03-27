/**
 * JET ADMIN — SURFACE PRIMITIVES
 *
 * Modal (center) and Drawer (side) with a friction-based selection system.
 *
 * ┌─────────────────────────────────────────────────────────────────────┐
 * │  SURFACE SELECTION FRAMEWORK                                       │
 * │                                                                     │
 * │  CENTER MODAL — High friction, deliberate                          │
 * │  Use when:                                                          │
 * │  · Action is irreversible or destructive (suspend, resolve, ban)   │
 * │  · Financial impact (refunds, payouts, charges)                    │
 * │  · Multi-party consequences (affects rider + driver + platform)    │
 * │  · Needs full user attention — background context is irrelevant    │
 * │  · Confirmation with summary before execution                      │
 * │  Pattern: Apple delete dialogs, Linear issue deletion              │
 * │                                                                     │
 * │  SIDE DRAWER — Low friction, contextual                            │
 * │  Use when:                                                          │
 * │  · User needs to reference background content while acting         │
 * │  · Composing (messages, notes, templates)                          │
 * │  · Browsing supplemental detail (trip replay, evidence zoom)       │
 * │  · Multi-step but non-destructive workflows                        │
 * │  · Context-dependent form fills                                     │
 * │  Pattern: Linear issue detail sidebar, Airbnb reservation panel    │
 * │                                                                     │
 * │  INLINE EXPAND — Zero friction, micro                              │
 * │  Use when:                                                          │
 * │  · Toggle, filter, quick state change                              │
 * │  · No confirmation needed                                           │
 * │  · Already handled by component-level interactions                 │
 * │  Pattern: Linear filter toggles, Vercel deployment toggles         │
 * └─────────────────────────────────────────────────────────────────────┘
 */

import { useEffect, useCallback, useRef, type ReactNode } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";
import { useAdminTheme, TY, BRAND, STATUS } from "../../../config/admin-theme";

// ═══════════════════════════════════════════════════════════════════════════
// ADMIN MODAL — Center, high-friction
// ═══════════════════════════════════════════════════════════════════════════

interface AdminModalProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  /** Width of the modal content area */
  width?: number;
  /** If true, clicking backdrop does NOT close (force explicit action) */
  persistent?: boolean;
  /** Danger mode — red accent on overlay */
  danger?: boolean;
}

export function AdminModal({
  open,
  onClose,
  children,
  width = 480,
  persistent = false,
  danger = false,
}: AdminModalProps) {
  const { t, theme } = useAdminTheme();

  // ESC to close (unless persistent)
  useEffect(() => {
    if (!open || persistent) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose, persistent]);

  // Lock body scroll
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = ""; };
    }
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0"
            style={{
              background: danger
                ? theme === "dark"
                  ? "rgba(212,24,61,0.04)"
                  : "rgba(212,24,61,0.02)"
                : "transparent",
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={persistent ? undefined : onClose}
          >
            {/* Scrim */}
            <div
              className="absolute inset-0"
              style={{
                background: theme === "dark"
                  ? "rgba(0,0,0,0.6)"
                  : "rgba(0,0,0,0.25)",
              }}
            />
          </motion.div>

          {/* Content */}
          <motion.div
            className="relative rounded-2xl overflow-hidden"
            style={{
              width,
              maxWidth: "calc(100vw - 48px)",
              maxHeight: "calc(100vh - 96px)",
              background: t.overlay,
              border: `1px solid ${danger ? t.errorBorder : t.border}`,
              boxShadow: theme === "dark"
                ? "0 24px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.03)"
                : "0 24px 80px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.04)",
            }}
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 4 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
          >
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// ADMIN DRAWER — Side, low-friction
// ═══════════════════════════════════════════════════════════════════════════

interface AdminDrawerProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  /** Width of the drawer */
  width?: number;
  /** Side: right (default) or left */
  side?: "right" | "left";
  /** Title for the drawer header */
  title?: string;
  /** Subtitle text */
  subtitle?: string;
}

export function AdminDrawer({
  open,
  onClose,
  children,
  width = 420,
  side = "right",
  title,
  subtitle,
}: AdminDrawerProps) {
  const { t, theme } = useAdminTheme();

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  const xOffset = side === "right" ? width : -width;

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100] flex">
          {/* Backdrop — dimmer, not blurred (context stays legible) */}
          <motion.div
            className="absolute inset-0"
            style={{
              background: theme === "dark"
                ? "rgba(0,0,0,0.35)"
                : "rgba(0,0,0,0.12)",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            className={`absolute top-0 bottom-0 flex flex-col ${side === "right" ? "right-0" : "left-0"}`}
            style={{
              width,
              maxWidth: "calc(100vw - 56px)",
              background: t.overlay,
              borderLeft: side === "right" ? `1px solid ${t.border}` : "none",
              borderRight: side === "left" ? `1px solid ${t.border}` : "none",
              boxShadow: theme === "dark"
                ? "0 0 40px rgba(0,0,0,0.5)"
                : "0 0 40px rgba(0,0,0,0.08)",
            }}
            initial={{ x: xOffset, opacity: 0.5 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: xOffset, opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Header */}
            {title && (
              <div
                className="flex items-center justify-between px-5 shrink-0"
                style={{
                  height: 56,
                  borderBottom: `1px solid ${t.borderSubtle}`,
                }}
              >
                <div className="min-w-0">
                  <span className="block" style={{ ...TY.sub, fontSize: "13px", color: t.text }}>{title}</span>
                  {subtitle && (
                    <span style={{ ...TY.bodyR, fontSize: "11px", color: t.textMuted }}>{subtitle}</span>
                  )}
                </div>
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors"
                  style={{ background: t.surfaceHover }}
                  onMouseEnter={e => (e.currentTarget.style.background = t.surfaceActive)}
                  onMouseLeave={e => (e.currentTarget.style.background = t.surfaceHover)}
                >
                  <X size={14} style={{ color: t.iconSecondary }} />
                </button>
              </div>
            )}

            {/* Content */}
            <div className="flex-1 overflow-y-auto scrollbar-hide">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// MODAL HEADER
// ═══════════════════════════════════════════════════════════════════════════

interface ModalHeaderProps {
  title: string;
  subtitle?: string;
  onClose?: () => void;
  icon?: ReactNode;
  accentColor?: string;
}

export function ModalHeader({ title, subtitle, onClose, icon, accentColor }: ModalHeaderProps) {
  const { t } = useAdminTheme();
  return (
    <div
      className="flex items-center gap-3 px-6 shrink-0"
      style={{
        height: 64,
        borderBottom: `1px solid ${t.borderSubtle}`,
      }}
    >
      {icon && (
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: `${accentColor || t.textMuted}12` }}
        >
          {icon}
        </div>
      )}
      <div className="flex-1 min-w-0">
        <span className="block" style={{ ...TY.sub, fontSize: "14px", color: t.text }}>{title}</span>
        {subtitle && (
          <span className="block" style={{ ...TY.bodyR, fontSize: "11px", color: t.textMuted }}>{subtitle}</span>
        )}
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors"
          style={{ background: t.surfaceHover }}
          onMouseEnter={e => (e.currentTarget.style.background = t.surfaceActive)}
          onMouseLeave={e => (e.currentTarget.style.background = t.surfaceHover)}
        >
          <X size={14} style={{ color: t.iconSecondary }} />
        </button>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// MODAL FOOTER
// ═══════════════════════════════════════════════════════════════════════════

interface ModalFooterProps {
  children: ReactNode;
}

export function ModalFooter({ children }: ModalFooterProps) {
  const { t } = useAdminTheme();
  return (
    <div
      className="flex items-center justify-end gap-3 px-6 shrink-0"
      style={{
        height: 64,
        borderTop: `1px solid ${t.borderSubtle}`,
      }}
    >
      {children}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// ACTION BUTTONS (for modal/drawer footers)
// ═══════════════════════════════════════════════════════════════════════════

interface SurfaceButtonProps {
  label?: string;
  children?: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "danger" | "ghost" | "outline";
  icon?: ReactNode;
  disabled?: boolean;
  loading?: boolean;
}

export function SurfaceButton({
  label,
  children,
  onClick,
  variant = "primary",
  icon,
  disabled = false,
  loading = false,
}: SurfaceButtonProps) {
  const { t } = useAdminTheme();

  const styles: Record<string, React.CSSProperties> = {
    primary: {
      background: BRAND.green,
      border: `1px solid ${BRAND.green}`,
      color: "#FFFFFF",
    },
    danger: {
      background: STATUS.error,
      border: `1px solid ${STATUS.error}`,
      color: "#FFFFFF",
    },
    ghost: {
      background: "transparent",
      border: `1px solid transparent`,
      color: t.textMuted,
    },
    outline: {
      background: "transparent",
      border: `1px solid ${t.borderSubtle}`,
      color: t.textSecondary,
    },
  };

  const s = styles[variant];

  return (
    <button
      className="h-10 px-4 rounded-xl flex items-center justify-center gap-2 transition-opacity"
      style={{
        ...s,
        opacity: disabled || loading ? 0.5 : 1,
        cursor: disabled || loading ? "not-allowed" : "pointer",
        minHeight: 44,
        ...TY.body,
        fontSize: "12px",
      }}
      onClick={disabled || loading ? undefined : onClick}
    >
      {loading ? (
        <div className="w-3.5 h-3.5 rounded-full border-2 border-current border-t-transparent animate-spin" />
      ) : icon ? (
        icon
      ) : null}
      <span style={{ color: s.color }}>{children || label}</span>
    </button>
  );
}