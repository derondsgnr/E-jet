/**
 * JET ADMIN — MOBILE GATE
 *
 * Linear's pattern: admin tools are desktop-first.
 * Mobile gets a respectful gate — not a dead-end, but a clear signal.
 * "Continue anyway" for quick checks. Full experience requires desktop.
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Monitor, ChevronRight, Sparkles } from "lucide-react";
import { useAdminTheme, BRAND } from "../../../config/admin-theme";

const GATE_DISMISSED_KEY = "jet-admin-mobile-gate-dismissed";

export function MobileGate() {
  const { theme, t } = useAdminTheme();
  const isDark = theme === "dark";
  const [dismissed, setDismissed] = useState(() => {
    if (typeof window !== "undefined") {
      return sessionStorage.getItem(GATE_DISMISSED_KEY) === "true";
    }
    return false;
  });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const handleContinue = () => {
    setDismissed(true);
    sessionStorage.setItem(GATE_DISMISSED_KEY, "true");
  };

  if (!isMobile || dismissed) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[300] flex items-center justify-center px-6"
        style={{
          background: isDark ? "#08080A" : "#F5F5F5",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="flex flex-col items-center text-center max-w-[320px]">
          {/* Logo */}
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center mb-8"
            style={{
              background: isDark ? "rgba(29,185,84,0.1)" : "rgba(29,185,84,0.08)",
              border: `1px solid ${isDark ? "rgba(29,185,84,0.15)" : "rgba(29,185,84,0.1)"}`,
            }}
          >
            <Sparkles size={22} style={{ color: BRAND.green }} />
          </div>

          {/* Copy */}
          <h1
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontWeight: 600,
              fontSize: "18px",
              lineHeight: "1.3",
              letterSpacing: "-0.03em",
              color: t.text,
              margin: 0,
            }}
          >
            JET Admin is built for desktop
          </h1>
          <p
            className="mt-3 mb-8"
            style={{
              fontFamily: "'Manrope', sans-serif",
              fontWeight: 400,
              fontSize: "13px",
              lineHeight: "1.6",
              letterSpacing: "-0.02em",
              color: t.textMuted,
              margin: 0,
              marginTop: 12,
              marginBottom: 32,
            }}
          >
            Dispute resolution, driver verification, and analytics work best on a larger screen. You can still browse for quick checks.
          </p>

          {/* Desktop icon */}
          <div
            className="w-full rounded-2xl p-5 mb-6 flex items-center gap-4"
            style={{
              background: isDark ? "rgba(255,255,255,0.025)" : "rgba(0,0,0,0.02)",
              border: `1px solid ${isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)"}`,
            }}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{
                background: isDark ? "rgba(29,185,84,0.1)" : "rgba(29,185,84,0.06)",
              }}
            >
              <Monitor size={18} style={{ color: BRAND.green }} />
            </div>
            <div className="text-left">
              <span
                className="block"
                style={{
                  fontFamily: "'Manrope', sans-serif",
                  fontWeight: 500,
                  fontSize: "12px",
                  letterSpacing: "-0.02em",
                  color: t.text,
                }}
              >
                Switch to desktop
              </span>
              <span
                style={{
                  fontFamily: "'Manrope', sans-serif",
                  fontWeight: 400,
                  fontSize: "11px",
                  letterSpacing: "-0.02em",
                  color: t.textFaint,
                }}
              >
                Open admin.jet.ng on your laptop
              </span>
            </div>
          </div>

          {/* Continue anyway */}
          <button
            onClick={handleContinue}
            className="flex items-center gap-1.5 transition-opacity hover:opacity-80"
            style={{ minHeight: 44 }}
          >
            <span
              style={{
                fontFamily: "'Manrope', sans-serif",
                fontWeight: 500,
                fontSize: "12px",
                letterSpacing: "-0.02em",
                color: t.textMuted,
              }}
            >
              Continue on mobile
            </span>
            <ChevronRight size={12} style={{ color: t.textFaint }} />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
