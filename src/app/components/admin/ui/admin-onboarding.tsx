/**
 * JET ADMIN — ONBOARDING SYSTEM (Shell-level)
 *
 * Two layers:
 *   A. Welcome modal — first visit orientation (no persistence, resets each load for demo)
 *   B. Contextual hints — subtle pointers near key UI elements (session-only)
 *
 * NOT a generic wizard. Think: opening a precision tool for the first time.
 * Linear's restraint, Apple's spatial clarity, Vercel's confidence.
 */

import { useState, useEffect, useCallback, createContext, useContext, type ReactNode } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Activity, Users,
  Globe2, Wallet,
  ArrowRight, X, Sparkles,
} from "lucide-react";
import { useAdminTheme, BRAND, STATUS } from "../../../config/admin-theme";

// ═══════════════════════════════════════════════════════════════════════════
// ONBOARDING CONTEXT — Shell-level state
// ═══════════════════════════════════════════════════════════════════════════
interface OnboardingCtx {
  hasOnboarded: boolean;
  completeOnboarding: () => void;
  isHintSeen: (id: string) => boolean;
  dismissHint: (id: string) => void;
}

const OnboardingContext = createContext<OnboardingCtx>({
  hasOnboarded: true,
  completeOnboarding: () => {},
  isHintSeen: () => true,
  dismissHint: () => {},
});

export function useOnboarding() {
  return useContext(OnboardingContext);
}

export function OnboardingProvider({ children }: { children: ReactNode }) {
  // No persistence — resets every page load for e2e demo
  const [hasOnboarded, setHasOnboarded] = useState(false);
  const [seenHints, setSeenHints] = useState<Set<string>>(new Set());

  const completeOnboarding = useCallback(() => {
    setHasOnboarded(true);
  }, []);

  const isHintSeen = useCallback((id: string) => seenHints.has(id), [seenHints]);

  const dismissHint = useCallback((id: string) => {
    setSeenHints(prev => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  }, []);

  return (
    <OnboardingContext.Provider value={{ hasOnboarded, completeOnboarding, isHintSeen, dismissHint }}>
      {children}
    </OnboardingContext.Provider>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// WELCOME MODAL — First-time orientation
// ════════════��══════════════════════════════════════════════════════════════

const SECTIONS = [
  {
    id: "ops",
    label: "Operations",
    desc: "Live rides, dispute resolution, support cases",
    icon: Activity,
    color: BRAND.green,
    items: ["Command Center", "Rides", "Disputes", "Support"],
  },
  {
    id: "people",
    label: "People",
    desc: "Rider accounts, driver verification pipeline",
    icon: Users,
    color: STATUS.info,
    items: ["Riders", "Drivers"],
  },
  {
    id: "partners",
    label: "Partners",
    desc: "Hotel bookings, fleet owner management",
    icon: Globe2,
    color: STATUS.warning,
    items: ["Hotels", "Fleet"],
  },
  {
    id: "business",
    label: "Business",
    desc: "Revenue flows, analytics, communications",
    icon: Wallet,
    color: "#A78BFA",
    items: ["Finance", "Analytics", "Comms"],
  },
];

export function WelcomeModal() {
  const { theme, t } = useAdminTheme();
  const isDark = theme === "dark";
  const { hasOnboarded, completeOnboarding } = useOnboarding();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!hasOnboarded) {
      const timer = setTimeout(() => setShow(true), 400);
      return () => clearTimeout(timer);
    }
  }, [hasOnboarded]);

  const handleClose = () => {
    setShow(false);
    setTimeout(completeOnboarding, 200);
  };

  return (
    <AnimatePresence>
      {show && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center">
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0"
            style={{
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div
              className="absolute inset-0"
              style={{
                background: isDark ? "rgba(0,0,0,0.7)" : "rgba(0,0,0,0.3)",
              }}
            />
          </motion.div>

          {/* Modal */}
          <motion.div
            className="relative rounded-2xl overflow-hidden flex flex-col"
            style={{
              width: 520,
              maxWidth: "calc(100vw - 48px)",
              maxHeight: "calc(100vh - 64px)",
              background: isDark ? "#111113" : "#FFFFFF",
              border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
              boxShadow: isDark
                ? "0 32px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.03)"
                : "0 32px 80px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.03)",
            }}
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 6 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Close */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-lg flex items-center justify-center z-10 transition-colors"
              style={{ background: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)" }}
              onMouseEnter={e => { e.currentTarget.style.background = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)"; }}
            >
              <X size={14} style={{ color: t.textMuted }} />
            </button>

            {/* Header — atmospheric */}
            <div
              className="relative px-8 pt-10 pb-6"
              style={{
                background: isDark
                  ? "linear-gradient(180deg, rgba(29,185,84,0.06) 0%, transparent 100%)"
                  : "linear-gradient(180deg, rgba(29,185,84,0.04) 0%, transparent 100%)",
              }}
            >
              {/* Logo mark */}
              <div
                className="w-11 h-11 rounded-2xl flex items-center justify-center mb-5"
                style={{
                  background: isDark ? "rgba(29,185,84,0.12)" : "rgba(29,185,84,0.08)",
                  border: `1px solid ${isDark ? "rgba(29,185,84,0.15)" : "rgba(29,185,84,0.12)"}`,
                }}
              >
                <Sparkles size={18} style={{ color: BRAND.green }} />
              </div>

              <h2
                style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontWeight: 600,
                  fontSize: "20px",
                  lineHeight: "1.2",
                  letterSpacing: "-0.03em",
                  color: t.text,
                  margin: 0,
                }}
              >
                Welcome to JET Admin
              </h2>
              <p
                className="mt-2"
                style={{
                  fontFamily: "'Manrope', sans-serif",
                  fontWeight: 400,
                  fontSize: "13px",
                  lineHeight: "1.5",
                  letterSpacing: "-0.02em",
                  color: t.textMuted,
                  margin: 0,
                  maxWidth: 380,
                }}
              >
                Your command center for managing Nigeria's premium e-hailing platform — riders, drivers, partners, and operations.
              </p>
            </div>

            {/* Sections grid */}
            <div className="px-8 pb-2">
              <span
                className="block mb-3"
                style={{
                  fontFamily: "'Manrope', sans-serif",
                  fontWeight: 600,
                  fontSize: "9px",
                  letterSpacing: "0.05em",
                  textTransform: "uppercase" as const,
                  color: t.textFaint,
                }}
              >
                Dashboard areas
              </span>

              <div className="grid grid-cols-2 gap-2.5">
                {SECTIONS.map((section, i) => (
                  <motion.div
                    key={section.id}
                    className="rounded-xl p-3.5"
                    style={{
                      background: isDark ? "rgba(255,255,255,0.025)" : "rgba(0,0,0,0.02)",
                      border: `1px solid ${isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)"}`,
                    }}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 + i * 0.06 }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div
                        className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0"
                        style={{ background: `${section.color}12` }}
                      >
                        <section.icon size={12} style={{ color: section.color }} />
                      </div>
                      <span
                        style={{
                          fontFamily: "'Montserrat', sans-serif",
                          fontWeight: 600,
                          fontSize: "12px",
                          letterSpacing: "-0.02em",
                          color: t.text,
                        }}
                      >
                        {section.label}
                      </span>
                    </div>
                    <p
                      style={{
                        fontFamily: "'Manrope', sans-serif",
                        fontWeight: 400,
                        fontSize: "11px",
                        lineHeight: "1.5",
                        letterSpacing: "-0.02em",
                        color: t.textMuted,
                        margin: 0,
                      }}
                    >
                      {section.desc}
                    </p>
                    <div className="flex flex-wrap gap-1 mt-2.5">
                      {section.items.map(item => (
                        <span
                          key={item}
                          className="px-1.5 py-0.5 rounded"
                          style={{
                            fontFamily: "'Manrope', sans-serif",
                            fontWeight: 500,
                            fontSize: "9px",
                            letterSpacing: "-0.01em",
                            color: t.textFaint,
                            background: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)",
                          }}
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="px-8 pt-4 pb-6 flex items-center justify-between">
              <span
                style={{
                  fontFamily: "'Manrope', sans-serif",
                  fontWeight: 400,
                  fontSize: "11px",
                  letterSpacing: "-0.02em",
                  color: t.textFaint,
                }}
              >
                Use the sidebar to navigate between sections
              </span>
              <button
                onClick={handleClose}
                className="h-9 px-5 rounded-xl flex items-center gap-2 transition-opacity hover:opacity-90"
                style={{
                  background: BRAND.green,
                  minHeight: 44,
                }}
              >
                <span
                  style={{
                    fontFamily: "'Manrope', sans-serif",
                    fontWeight: 600,
                    fontSize: "12px",
                    letterSpacing: "-0.02em",
                    color: "#FFFFFF",
                  }}
                >
                  Get started
                </span>
                <ArrowRight size={13} style={{ color: "#FFFFFF" }} />
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// CONTEXTUAL HINT — Subtle floating pointer
// ═══════════════════════════════════════════════════════════════════════════

interface ContextualHintProps {
  id: string;
  text: string;
  /** Delay before showing (ms) */
  delay?: number;
  /** Position relative to anchor */
  position?: "top" | "bottom" | "right" | "left";
  children: ReactNode;
}

export function ContextualHint({
  id,
  text,
  delay = 800,
  position = "right",
  children,
}: ContextualHintProps) {
  const { theme, t } = useAdminTheme();
  const isDark = theme === "dark";
  const { hasOnboarded, isHintSeen, dismissHint } = useOnboarding();
  const [visible, setVisible] = useState(false);

  const shouldShow = hasOnboarded && !isHintSeen(id);

  useEffect(() => {
    if (!shouldShow) return;
    const timer = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(timer);
  }, [shouldShow, delay]);

  const handleDismiss = () => {
    setVisible(false);
    dismissHint(id);
  };

  // Auto-dismiss after 8 seconds
  useEffect(() => {
    if (!visible) return;
    const timer = setTimeout(handleDismiss, 8000);
    return () => clearTimeout(timer);
  }, [visible]);

  const positionStyles: Record<string, React.CSSProperties> = {
    right: { left: "calc(100% + 10px)", top: "50%", transform: "translateY(-50%)" },
    left: { right: "calc(100% + 10px)", top: "50%", transform: "translateY(-50%)" },
    top: { bottom: "calc(100% + 10px)", left: "50%", transform: "translateX(-50%)" },
    bottom: { top: "calc(100% + 10px)", left: "50%", transform: "translateX(-50%)" },
  };

  // Arrow direction (points toward the element)
  const arrowStyles: Record<string, React.CSSProperties> = {
    right: {
      left: -4,
      top: "50%",
      transform: "translateY(-50%) rotate(45deg)",
    },
    left: {
      right: -4,
      top: "50%",
      transform: "translateY(-50%) rotate(45deg)",
    },
    top: {
      bottom: -4,
      left: "50%",
      transform: "translateX(-50%) rotate(45deg)",
    },
    bottom: {
      top: -4,
      left: "50%",
      transform: "translateX(-50%) rotate(45deg)",
    },
  };

  return (
    <div className="relative inline-flex">
      {children}
      <AnimatePresence>
        {visible && (
          <motion.div
            className="absolute z-[150] pointer-events-auto"
            style={positionStyles[position]}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            onClick={handleDismiss}
          >
            <div
              className="relative px-3 py-2 rounded-lg cursor-pointer whitespace-nowrap"
              style={{
                background: isDark ? "#1A1A1C" : "#1A1A1C",
                border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.04)"}`,
                boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
              }}
            >
              {/* Arrow */}
              <div
                className="absolute w-2 h-2"
                style={{
                  ...arrowStyles[position],
                  background: "#1A1A1C",
                }}
              />
              <span
                style={{
                  fontFamily: "'Manrope', sans-serif",
                  fontWeight: 500,
                  fontSize: "11px",
                  lineHeight: "1.4",
                  letterSpacing: "-0.02em",
                  color: "#E0E0E0",
                }}
              >
                {text}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}