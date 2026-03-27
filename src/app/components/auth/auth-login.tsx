/**
 * SHARED AUTH — Login Page
 *
 * Used by: Admin, Fleet Owner, Hotel Partner
 * Branded per surface via props.
 *
 * Data source: auth.users table (Supabase Auth / custom)
 */

import { useState } from "react";
import { motion } from "motion/react";
import { Eye, EyeOff, ArrowRight, Building2, Truck, Shield } from "lucide-react";
import { BRAND, TY, STATUS } from "../../config/admin-theme";

export type AuthSurface = "admin" | "fleet" | "hotel";

const SURFACE_CONFIG: Record<AuthSurface, {
  title: string;
  subtitle: string;
  icon: typeof Shield;
  accentLabel: string;
}> = {
  admin: {
    title: "Admin Console",
    subtitle: "JET Operations Dashboard",
    icon: Shield,
    accentLabel: "Admin",
  },
  fleet: {
    title: "Fleet Dashboard",
    subtitle: "Manage your fleet with JET",
    icon: Truck,
    accentLabel: "Fleet Owner",
  },
  hotel: {
    title: "Hotel Partner",
    subtitle: "Concierge ride management",
    icon: Building2,
    accentLabel: "Hotel",
  },
};

interface LoginPageProps {
  surface: AuthSurface;
  onLogin: (email: string, password: string) => void;
  onForgotPassword: () => void;
  isDark?: boolean;
}

export function AuthLogin({ surface, onLogin, onForgotPassword, isDark = true }: LoginPageProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const config = SURFACE_CONFIG[surface];
  const Icon = config.icon;

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

    if (!email.trim()) { setError("Email is required"); return; }
    if (!password.trim()) { setError("Password is required"); return; }

    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      // Demo: accept any email with password "jet123"
      if (password === "jet123" || password.length >= 6) {
        onLogin(email, password);
      } else {
        setError("Invalid email or password");
      }
      setLoading(false);
    }, 1200);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: bg }}
    >
      {/* Atmospheric background */}
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }}>
        <div className="absolute inset-0" style={{
          background: isDark
            ? "radial-gradient(ellipse 60% 50% at 50% 100%, rgba(29,185,84,0.04) 0%, transparent 70%), radial-gradient(ellipse 40% 40% at 80% 10%, rgba(29,185,84,0.02) 0%, transparent 60%)"
            : "radial-gradient(ellipse 60% 50% at 50% 100%, rgba(29,185,84,0.02) 0%, transparent 70%)",
        }} />
        <div className="absolute inset-0" style={{
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          opacity: 0.03, mixBlendMode: "overlay",
        }} />
      </div>

      <motion.div
        className="w-full relative"
        style={{ maxWidth: 400, zIndex: 1 }}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Logo + branding */}
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
          <h1 style={{
            fontFamily: "'Montserrat', sans-serif", fontWeight: 600,
            fontSize: "20px", letterSpacing: "-0.03em", color: textPrimary, lineHeight: "1.2",
          }}>
            {config.title}
          </h1>
          <p className="mt-1" style={{
            ...TY.bodyR, fontSize: "12px", color: textSecondary, lineHeight: "1.5",
          }}>
            {config.subtitle}
          </p>
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
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Error */}
            {error && (
              <motion.div
                className="px-3 py-2.5 rounded-xl"
                style={{
                  background: `${STATUS.error}08`,
                  border: `1px solid ${STATUS.error}18`,
                }}
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <span style={{ ...TY.body, fontSize: "11px", color: STATUS.error, lineHeight: "1.4", letterSpacing: "-0.02em" }}>
                  {error}
                </span>
              </motion.div>
            )}

            {/* Email */}
            <div>
              <label className="block mb-1.5" style={{ ...TY.body, fontSize: "10px", color: textSecondary, lineHeight: "1.4", letterSpacing: "-0.02em" }}>
                Email
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
                  ...TY.body, fontSize: "12px", color: textPrimary, lineHeight: "1.4", letterSpacing: "-0.02em",
                }}
              />
            </div>

            {/* Password */}
            <div>
              <label className="block mb-1.5" style={{ ...TY.body, fontSize: "10px", color: textSecondary, lineHeight: "1.4", letterSpacing: "-0.02em" }}>
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter password"
                  autoComplete="current-password"
                  className="w-full px-3 py-2.5 pr-10 rounded-xl outline-none"
                  style={{
                    background: inputBg,
                    border: `1px solid ${borderColor}`,
                    ...TY.body, fontSize: "12px", color: textPrimary, lineHeight: "1.4", letterSpacing: "-0.02em",
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
            </div>

            {/* Remember + Forgot */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={e => setRemember(e.target.checked)}
                  className="w-3.5 h-3.5 rounded accent-green-500"
                />
                <span style={{ ...TY.bodyR, fontSize: "10px", color: textSecondary, lineHeight: "1.5" }}>
                  Remember me
                </span>
              </label>
              <button
                type="button"
                onClick={onForgotPassword}
                className="cursor-pointer"
                style={{ ...TY.body, fontSize: "10px", color: BRAND.green, lineHeight: "1.4", letterSpacing: "-0.02em" }}
              >
                Forgot password?
              </button>
            </div>

            {/* Submit */}
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
                <>
                  <span style={{
                    fontFamily: "'Montserrat', sans-serif", fontWeight: 600,
                    fontSize: "12px", letterSpacing: "-0.02em", color: "#fff", lineHeight: "1.2",
                  }}>
                    Sign in
                  </span>
                  <ArrowRight size={14} color="#fff" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center mt-6" style={{
          ...TY.bodyR, fontSize: "10px", color: textFaint, lineHeight: "1.5",
        }}>
          <span style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 600, letterSpacing: "-0.02em", color: textSecondary }}>JET</span>
          {" "}· {config.accentLabel} · Secure login
        </p>
      </motion.div>
    </div>
  );
}
