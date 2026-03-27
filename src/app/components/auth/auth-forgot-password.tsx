/**
 * SHARED AUTH — Forgot Password (pre-auth)
 *
 * Used by: Admin, Fleet Owner, Hotel Partner
 * Step 1: Enter email → send reset link
 * Step 2: Confirmation screen
 *
 * Data source: auth.users table → password_reset_tokens
 */

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, Mail, Check, Building2, Truck, Shield } from "lucide-react";
import { BRAND, TY, STATUS } from "../../config/admin-theme";
import type { AuthSurface } from "./auth-login";

const SURFACE_ICONS: Record<AuthSurface, typeof Shield> = {
  admin: Shield,
  fleet: Truck,
  hotel: Building2,
};

interface ForgotPasswordProps {
  surface: AuthSurface;
  onBack: () => void;
  isDark?: boolean;
}

export function AuthForgotPassword({ surface, onBack, isDark = true }: ForgotPasswordProps) {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const Icon = SURFACE_ICONS[surface];
  const bg = isDark ? BRAND.black : BRAND.light;
  const cardBg = isDark ? "rgba(18,18,20,0.8)" : "rgba(255,255,255,0.95)";
  const textPrimary = isDark ? "#FAFAFA" : "#0B0B0D";
  const textSecondary = isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)";
  const textFaint = isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)";
  const borderColor = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.08)";
  const inputBg = isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email.trim() || !email.includes("@")) {
      setError("Enter a valid email address");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setSent(true);
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: bg }}>
      {/* Atmospheric background */}
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }}>
        <div className="absolute inset-0" style={{
          background: isDark
            ? "radial-gradient(ellipse 60% 50% at 50% 100%, rgba(29,185,84,0.04) 0%, transparent 70%)"
            : "radial-gradient(ellipse 60% 50% at 50% 100%, rgba(29,185,84,0.02) 0%, transparent 70%)",
        }} />
      </div>

      <motion.div
        className="w-full relative"
        style={{ maxWidth: 400, zIndex: 1 }}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Back button */}
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 mb-6 cursor-pointer"
          style={{ ...TY.body, fontSize: "11px", color: textSecondary, lineHeight: "1.4", letterSpacing: "-0.02em" }}
        >
          <ArrowLeft size={14} />
          Back to login
        </button>

        {/* Logo */}
        <div className="text-center mb-8">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-4"
            style={{
              background: isDark ? `${BRAND.green}08` : `${BRAND.green}06`,
              border: `1px solid ${isDark ? `${BRAND.green}14` : `${BRAND.green}10`}`,
            }}
          >
            <Icon size={18} style={{ color: BRAND.green }} />
          </div>
        </div>

        {/* Card */}
        <div
          className="rounded-2xl p-6"
          style={{
            background: cardBg,
            border: `1px solid ${borderColor}`,
            backdropFilter: "blur(20px)",
            boxShadow: isDark ? "0 24px 64px rgba(0,0,0,0.4)" : "0 24px 64px rgba(0,0,0,0.08)",
          }}
        >
          <AnimatePresence mode="wait">
            {!sent ? (
              <motion.form
                key="form"
                onSubmit={handleSubmit}
                className="space-y-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div>
                  <h2 style={{
                    fontFamily: "'Montserrat', sans-serif", fontWeight: 600,
                    fontSize: "16px", letterSpacing: "-0.03em", color: textPrimary, lineHeight: "1.2",
                  }}>
                    Reset password
                  </h2>
                  <p className="mt-1.5" style={{
                    ...TY.bodyR, fontSize: "11px", color: textSecondary, lineHeight: "1.5",
                  }}>
                    Enter your email and we'll send a reset link.
                  </p>
                </div>

                {error && (
                  <motion.div
                    className="px-3 py-2.5 rounded-xl"
                    style={{ background: `${STATUS.error}08`, border: `1px solid ${STATUS.error}18` }}
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <span style={{ ...TY.body, fontSize: "11px", color: STATUS.error, lineHeight: "1.4" }}>
                      {error}
                    </span>
                  </motion.div>
                )}

                <div>
                  <label className="block mb-1.5" style={{ ...TY.body, fontSize: "10px", color: textSecondary, lineHeight: "1.4", letterSpacing: "-0.02em" }}>
                    Email address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    autoComplete="email"
                    className="w-full px-3 py-2.5 rounded-xl outline-none"
                    style={{
                      background: inputBg,
                      border: `1px solid ${borderColor}`,
                      ...TY.body, fontSize: "12px", color: textPrimary, lineHeight: "1.4",
                    }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl cursor-pointer"
                  style={{
                    background: BRAND.green,
                    opacity: loading ? 0.7 : 1,
                    transition: "opacity 0.15s",
                  }}
                >
                  {loading ? (
                    <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  ) : (
                    <span style={{
                      fontFamily: "'Montserrat', sans-serif", fontWeight: 600,
                      fontSize: "12px", letterSpacing: "-0.02em", color: "#fff", lineHeight: "1.2",
                    }}>
                      Send reset link
                    </span>
                  )}
                </button>
              </motion.form>
            ) : (
              <motion.div
                key="success"
                className="text-center py-4 space-y-4"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center mx-auto"
                  style={{ background: `${BRAND.green}10` }}
                >
                  <Mail size={20} style={{ color: BRAND.green }} />
                </div>
                <div>
                  <h3 style={{
                    fontFamily: "'Montserrat', sans-serif", fontWeight: 600,
                    fontSize: "14px", letterSpacing: "-0.03em", color: textPrimary, lineHeight: "1.2",
                  }}>
                    Check your email
                  </h3>
                  <p className="mt-2" style={{
                    ...TY.bodyR, fontSize: "11px", color: textSecondary, lineHeight: "1.5",
                  }}>
                    We sent a password reset link to
                  </p>
                  <p style={{
                    ...TY.body, fontSize: "12px", color: textPrimary, lineHeight: "1.4", letterSpacing: "-0.02em",
                  }}>
                    {email}
                  </p>
                </div>
                <p style={{ ...TY.bodyR, fontSize: "10px", color: textFaint, lineHeight: "1.5" }}>
                  Didn't receive it? Check spam or{" "}
                  <button
                    onClick={() => setSent(false)}
                    className="cursor-pointer"
                    style={{ color: BRAND.green }}
                  >
                    try again
                  </button>
                </p>
                <button
                  onClick={onBack}
                  className="w-full py-2.5 rounded-xl cursor-pointer"
                  style={{
                    background: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)",
                    border: `1px solid ${borderColor}`,
                  }}
                >
                  <span style={{
                    ...TY.body, fontSize: "11px", color: textSecondary, lineHeight: "1.4", letterSpacing: "-0.02em",
                  }}>
                    Back to login
                  </span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
