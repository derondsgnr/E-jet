/**
 * SHARED AUTH — Reset Password (from email link)
 *
 * Used by: Admin, Fleet Owner, Hotel Partner
 * Validates token, accepts new password, shows strength.
 *
 * Data source: password_reset_tokens table → auth.users
 */

import { useState } from "react";
import { motion } from "motion/react";
import { Eye, EyeOff, Check, ArrowRight, Shield, AlertTriangle } from "lucide-react";
import { BRAND, TY, STATUS } from "../../config/admin-theme";

interface ResetPasswordProps {
  /** Whether the reset token is valid */
  tokenValid?: boolean;
  onReset: (password: string) => void;
  onBackToLogin: () => void;
  isDark?: boolean;
}

function getPasswordStrength(pw: string): { score: number; label: string; color: string } {
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;

  if (score <= 1) return { score, label: "Weak", color: STATUS.error };
  if (score <= 2) return { score, label: "Fair", color: STATUS.warning };
  if (score <= 3) return { score, label: "Good", color: "#3B82F6" };
  return { score, label: "Strong", color: BRAND.green };
}

export function AuthResetPassword({ tokenValid = true, onReset, onBackToLogin, isDark = true }: ResetPasswordProps) {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const bg = isDark ? BRAND.black : BRAND.light;
  const cardBg = isDark ? "rgba(18,18,20,0.8)" : "rgba(255,255,255,0.95)";
  const textPrimary = isDark ? "#FAFAFA" : "#0B0B0D";
  const textSecondary = isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)";
  const textFaint = isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)";
  const borderColor = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.08)";
  const inputBg = isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)";

  const strength = getPasswordStrength(password);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password.length < 8) { setError("Password must be at least 8 characters"); return; }
    if (password !== confirm) { setError("Passwords don't match"); return; }
    setLoading(true);
    setTimeout(() => {
      onReset(password);
      setDone(true);
      setLoading(false);
    }, 1200);
  };

  // Token expired state
  if (!tokenValid) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ background: bg }}>
        <motion.div
          className="w-full" style={{ maxWidth: 400 }}
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        >
          <div className="rounded-2xl p-6 text-center space-y-4" style={{
            background: cardBg, border: `1px solid ${borderColor}`,
            backdropFilter: "blur(20px)",
          }}>
            <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto" style={{ background: `${STATUS.error}10` }}>
              <AlertTriangle size={20} style={{ color: STATUS.error }} />
            </div>
            <h2 style={{
              fontFamily: "'Montserrat', sans-serif", fontWeight: 600,
              fontSize: "14px", letterSpacing: "-0.03em", color: textPrimary, lineHeight: "1.2",
            }}>
              Link expired
            </h2>
            <p style={{ ...TY.bodyR, fontSize: "11px", color: textSecondary, lineHeight: "1.5" }}>
              This password reset link has expired or has already been used. Please request a new one.
            </p>
            <button
              onClick={onBackToLogin}
              className="w-full py-2.5 rounded-xl cursor-pointer"
              style={{ background: BRAND.green }}
            >
              <span style={{
                fontFamily: "'Montserrat', sans-serif", fontWeight: 600,
                fontSize: "12px", letterSpacing: "-0.02em", color: "#fff", lineHeight: "1.2",
              }}>
                Back to login
              </span>
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // Success state
  if (done) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ background: bg }}>
        <motion.div
          className="w-full" style={{ maxWidth: 400 }}
          initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        >
          <div className="rounded-2xl p-6 text-center space-y-4" style={{
            background: cardBg, border: `1px solid ${borderColor}`,
            backdropFilter: "blur(20px)",
          }}>
            <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto" style={{ background: `${BRAND.green}10` }}>
              <Check size={20} style={{ color: BRAND.green }} />
            </div>
            <h2 style={{
              fontFamily: "'Montserrat', sans-serif", fontWeight: 600,
              fontSize: "14px", letterSpacing: "-0.03em", color: textPrimary, lineHeight: "1.2",
            }}>
              Password updated
            </h2>
            <p style={{ ...TY.bodyR, fontSize: "11px", color: textSecondary, lineHeight: "1.5" }}>
              Your password has been reset. You can now sign in with your new password.
            </p>
            <button
              onClick={onBackToLogin}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl cursor-pointer"
              style={{ background: BRAND.green }}
            >
              <span style={{
                fontFamily: "'Montserrat', sans-serif", fontWeight: 600,
                fontSize: "12px", letterSpacing: "-0.02em", color: "#fff", lineHeight: "1.2",
              }}>
                Sign in
              </span>
              <ArrowRight size={14} color="#fff" />
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: bg }}>
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }}>
        <div className="absolute inset-0" style={{
          background: isDark
            ? "radial-gradient(ellipse 60% 50% at 50% 100%, rgba(29,185,84,0.04) 0%, transparent 70%)"
            : "radial-gradient(ellipse 60% 50% at 50% 100%, rgba(29,185,84,0.02) 0%, transparent 70%)",
        }} />
      </div>

      <motion.div
        className="w-full relative" style={{ maxWidth: 400, zIndex: 1 }}
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
      >
        <div
          className="rounded-2xl p-6"
          style={{
            background: cardBg, border: `1px solid ${borderColor}`,
            backdropFilter: "blur(20px)",
            boxShadow: isDark ? "0 24px 64px rgba(0,0,0,0.4)" : "0 24px 64px rgba(0,0,0,0.08)",
          }}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <h2 style={{
                fontFamily: "'Montserrat', sans-serif", fontWeight: 600,
                fontSize: "16px", letterSpacing: "-0.03em", color: textPrimary, lineHeight: "1.2",
              }}>
                Set new password
              </h2>
              <p className="mt-1.5" style={{ ...TY.bodyR, fontSize: "11px", color: textSecondary, lineHeight: "1.5" }}>
                Choose a strong password for your account.
              </p>
            </div>

            {error && (
              <motion.div
                className="px-3 py-2.5 rounded-xl"
                style={{ background: `${STATUS.error}08`, border: `1px solid ${STATUS.error}18` }}
                initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
              >
                <span style={{ ...TY.body, fontSize: "11px", color: STATUS.error, lineHeight: "1.4" }}>{error}</span>
              </motion.div>
            )}

            {/* New password */}
            <div>
              <label className="block mb-1.5" style={{ ...TY.body, fontSize: "10px", color: textSecondary, lineHeight: "1.4", letterSpacing: "-0.02em" }}>
                New password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  autoComplete="new-password"
                  className="w-full px-3 py-2.5 pr-10 rounded-xl outline-none"
                  style={{
                    background: inputBg, border: `1px solid ${borderColor}`,
                    ...TY.body, fontSize: "12px", color: textPrimary, lineHeight: "1.4",
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                >
                  {showPassword
                    ? <EyeOff size={14} style={{ color: textFaint }} />
                    : <Eye size={14} style={{ color: textFaint }} />
                  }
                </button>
              </div>

              {/* Password strength */}
              {password.length > 0 && (
                <div className="mt-2 space-y-1.5">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map(level => (
                      <div
                        key={level}
                        className="h-1 flex-1 rounded-full"
                        style={{
                          background: level <= strength.score
                            ? strength.color
                            : isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)",
                          transition: "background 0.2s",
                        }}
                      />
                    ))}
                  </div>
                  <span style={{ ...TY.bodyR, fontSize: "9px", color: strength.color, lineHeight: "1.5" }}>
                    {strength.label}
                  </span>
                </div>
              )}
            </div>

            {/* Confirm */}
            <div>
              <label className="block mb-1.5" style={{ ...TY.body, fontSize: "10px", color: textSecondary, lineHeight: "1.4", letterSpacing: "-0.02em" }}>
                Confirm password
              </label>
              <input
                type="password"
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                placeholder="Re-enter password"
                autoComplete="new-password"
                className="w-full px-3 py-2.5 rounded-xl outline-none"
                style={{
                  background: inputBg, border: `1px solid ${borderColor}`,
                  ...TY.body, fontSize: "12px", color: textPrimary, lineHeight: "1.4",
                }}
              />
              {confirm.length > 0 && password !== confirm && (
                <span className="block mt-1" style={{ ...TY.bodyR, fontSize: "9px", color: STATUS.error, lineHeight: "1.5" }}>
                  Passwords don't match
                </span>
              )}
              {confirm.length > 0 && password === confirm && (
                <span className="flex items-center gap-1 mt-1" style={{ ...TY.bodyR, fontSize: "9px", color: BRAND.green, lineHeight: "1.5" }}>
                  <Check size={10} /> Passwords match
                </span>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl cursor-pointer"
              style={{ background: BRAND.green, opacity: loading ? 0.7 : 1, transition: "opacity 0.15s" }}
            >
              {loading ? (
                <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              ) : (
                <span style={{
                  fontFamily: "'Montserrat', sans-serif", fontWeight: 600,
                  fontSize: "12px", letterSpacing: "-0.02em", color: "#fff", lineHeight: "1.2",
                }}>
                  Reset password
                </span>
              )}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
