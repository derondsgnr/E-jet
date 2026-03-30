/**
 * DS PATTERNS — Auth pages, JetLogo, Layout shells, Onboarding patterns.
 */

import { useState } from "react";
import {
  Eye, EyeOff, Mail, Lock, Shield, Building2, Car, Users,
  LayoutDashboard, Settings, Wallet, Bell,
  Home, Clock, User, Zap, Check,
} from "lucide-react";
import { useAdminTheme, BRAND, TY, STATUS } from "../config/admin-theme";
import { JetLogo } from "../components/brand/jet-logo";
import { Section, DSCard, SLabel, PropTable, NoteCard, DSep } from "./ds-primitives";

export default function DSPatterns() {
  const { t, theme } = useAdminTheme();
  const isDark = theme === "dark";
  const [showPw, setShowPw] = useState(false);

  return (
    <div className="max-w-[1100px] mx-auto px-5 py-8 space-y-14">

      {/* ═══ JET LOGO ═══ */}
      <Section id="jet-logo" title="JET LOGO" description="3 variants × 2 modes. Scalable SVG wordmark, PNG icon, PNG wordmark.">
        <DSCard>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Dark background */}
            <div className="rounded-2xl p-6 flex flex-col items-center gap-6" style={{ background: "#0B0B0D" }}>
              <SLabel>ON DARK BACKGROUND</SLabel>
              <JetLogo variant="full" mode="light" height={40} />
              <JetLogo variant="icon" height={40} />
              <JetLogo variant="wordmark-png" mode="light" height={32} />
              <div className="flex gap-3 mt-2">
                {["full", "icon", "wordmark-png"].map(v => (
                  <span key={v} className="px-2 py-0.5 rounded" style={{ ...TY.bodyR, fontSize: "8px", color: "#979797", background: "rgba(255,255,255,0.06)" }}>{v}</span>
                ))}
              </div>
            </div>
            {/* Light background */}
            <div className="rounded-2xl p-6 flex flex-col items-center gap-6" style={{ background: "#FAFAFA", border: "1px solid rgba(0,0,0,0.06)" }}>
              <SLabel>ON LIGHT BACKGROUND</SLabel>
              <JetLogo variant="full" mode="dark" height={40} />
              <JetLogo variant="icon" height={40} />
              <JetLogo variant="wordmark-png" mode="dark" height={32} />
              <div className="flex gap-3 mt-2">
                {["full", "icon", "wordmark-png"].map(v => (
                  <span key={v} className="px-2 py-0.5 rounded" style={{ ...TY.bodyR, fontSize: "8px", color: "#6E6E70", background: "rgba(0,0,0,0.04)" }}>{v}</span>
                ))}
              </div>
            </div>
          </div>
          <PropTable rows={[
            ["variant", "'full' | 'icon' | 'wordmark-png'", "'full'"],
            ["mode", "'dark' | 'light' | 'auto'", "'auto'"],
            ["height", "number (px)", "32"],
            ["className", "string", "''"],
          ]} />
          <NoteCard variant="info">SVG "full" variant is scalable at any size. PNG variants are for contexts needing raster (emails, exports).</NoteCard>
        </DSCard>
      </Section>

      {/* ═══ AUTH PAGES ═══ */}
      <Section id="auth" title="AUTH PAGES" description="Login · Forgot Password · Reset Password — 3 surface variants (Admin, Fleet, Hotel).">
        <DSCard>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { surface: "Admin", icon: Shield, accent: BRAND.green, subtitle: "Platform Command Center" },
              { surface: "Fleet", icon: Car, accent: STATUS.info, subtitle: "Fleet Owner Dashboard" },
              { surface: "Hotel", icon: Building2, accent: STATUS.warning, subtitle: "Hotel Partner Portal" },
            ].map(auth => {
              const AuthIcon = auth.icon;
              return (
                <div key={auth.surface} className="rounded-2xl overflow-hidden" style={{ background: isDark ? "#0F0F11" : "#FAFAFA", border: `1px solid ${t.borderSubtle}` }}>
                  {/* Header */}
                  <div className="p-5 flex flex-col items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${auth.accent}12` }}>
                      <AuthIcon size={18} style={{ color: auth.accent }} />
                    </div>
                    <div className="text-center">
                      <span style={{ ...TY.sub, fontSize: "13px", color: t.text, display: "block", letterSpacing: "-0.02em" }}>{auth.surface} Login</span>
                      <span style={{ ...TY.bodyR, fontSize: "10px", color: t.textFaint, letterSpacing: "-0.02em" }}>{auth.subtitle}</span>
                    </div>
                  </div>
                  {/* Form */}
                  <div className="px-5 pb-5 space-y-3">
                    <div className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{ background: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)", border: `1px solid ${t.borderSubtle}` }}>
                      <Mail size={12} style={{ color: t.textFaint }} />
                      <span style={{ ...TY.bodyR, fontSize: "11px", color: t.textFaint, letterSpacing: "-0.02em" }}>admin@jet.ng</span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{ background: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)", border: `1px solid ${t.borderSubtle}` }}>
                      <Lock size={12} style={{ color: t.textFaint }} />
                      <span className="flex-1" style={{ ...TY.bodyR, fontSize: "11px", color: t.textFaint, letterSpacing: "-0.02em" }}>••••••••</span>
                      {showPw ? <EyeOff size={12} style={{ color: t.textFaint, cursor: "pointer" }} onClick={() => setShowPw(false)} /> : <Eye size={12} style={{ color: t.textFaint, cursor: "pointer" }} onClick={() => setShowPw(true)} />}
                    </div>
                    <button className="w-full py-2.5 rounded-xl text-center" style={{ background: auth.accent, ...TY.body, fontSize: "11px", color: "#fff", letterSpacing: "-0.02em" }}>Sign In</button>
                    <span className="block text-center" style={{ ...TY.bodyR, fontSize: "10px", color: auth.accent, cursor: "pointer", letterSpacing: "-0.02em" }}>Forgot password?</span>
                  </div>
                </div>
              );
            })}
          </div>
          <NoteCard variant="info">Each surface variant has unique icon, accent color, and title. Eye/EyeOff toggle on password field. Error state shows inline below input.</NoteCard>
        </DSCard>
      </Section>

      {/* ═══ LAYOUT SHELLS ═══ */}
      <Section id="layout-shells" title="LAYOUT SHELLS" description="Dashboard (Sidebar + Topbar) and Mobile (Full-bleed + Bottom Nav) patterns.">
        <DSCard>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Dashboard Layout */}
            <div>
              <SLabel>DASHBOARD LAYOUT (Fleet · Hotel · Admin)</SLabel>
              <div className="rounded-xl overflow-hidden flex" style={{ height: 200, border: `1px solid ${t.borderSubtle}`, background: t.bg }}>
                {/* Nav rail */}
                <div className="w-12 shrink-0 flex flex-col items-center py-3 gap-3" style={{ background: isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.015)", borderRight: `1px solid ${t.borderSubtle}` }}>
                  <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{ background: BRAND.green }}><Zap size={10} color="#fff" /></div>
                  {[LayoutDashboard, Car, Users, Wallet, Settings].map((Icon, i) => (
                    <div key={i} className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: i === 0 ? (isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)") : "transparent" }}>
                      <Icon size={12} style={{ color: i === 0 ? t.text : t.iconMuted }} />
                    </div>
                  ))}
                </div>
                {/* Content area */}
                <div className="flex-1 flex flex-col">
                  <div className="h-8 shrink-0 flex items-center px-3 gap-2" style={{ borderBottom: `1px solid ${t.borderSubtle}` }}>
                    <div className="h-2 rounded w-16" style={{ background: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)" }} />
                    <div className="flex-1" />
                    <Bell size={10} style={{ color: t.iconMuted }} />
                    <div className="w-5 h-5 rounded-full" style={{ background: `${BRAND.green}15`, border: `1px solid ${BRAND.green}25` }} />
                  </div>
                  <div className="flex-1 p-3 space-y-2">
                    <div className="h-2 rounded w-24" style={{ background: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)" }} />
                    <div className="grid grid-cols-3 gap-2">
                      {[1, 2, 3].map(i => <div key={i} className="h-10 rounded-lg" style={{ background: t.surface, border: `1px solid ${t.borderSubtle}` }} />)}
                    </div>
                    <div className="h-16 rounded-lg" style={{ background: t.surface, border: `1px solid ${t.borderSubtle}` }} />
                  </div>
                </div>
              </div>
            </div>
            {/* Mobile Layout */}
            <div>
              <SLabel>MOBILE LAYOUT (Rider · Driver)</SLabel>
              <div className="rounded-xl overflow-hidden flex flex-col mx-auto" style={{ width: 160, height: 200, border: `1px solid ${t.borderSubtle}`, background: "#0B0B0D" }}>
                {/* Map area */}
                <div className="flex-1 relative" style={{ background: "radial-gradient(circle at 50% 50%, rgba(29,185,84,0.08), transparent 70%), #0B0B0D" }}>
                  <div className="absolute top-2 left-2 right-2 h-6 rounded-lg" style={{ background: "rgba(255,255,255,0.06)", backdropFilter: "blur(8px)" }} />
                  <div className="absolute bottom-2 left-2 right-2 rounded-lg p-2" style={{ background: "rgba(255,255,255,0.06)", backdropFilter: "blur(12px)" }}>
                    <div className="h-1.5 rounded w-12 mb-1" style={{ background: "rgba(255,255,255,0.12)" }} />
                    <div className="h-1 rounded w-20" style={{ background: "rgba(255,255,255,0.06)" }} />
                  </div>
                </div>
                {/* Bottom nav */}
                <div className="flex items-center justify-around px-2 py-2" style={{ background: "rgba(255,255,255,0.04)", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                  {[Home, Clock, Wallet, User].map((Icon, i) => (
                    <Icon key={i} size={12} style={{ color: i === 0 ? BRAND.green : "rgba(255,255,255,0.3)" }} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </DSCard>
      </Section>

      {/* ═══ ONBOARDING PATTERNS ═══ */}
      <Section id="onboarding" title="ONBOARDING PATTERNS" description="Step indicators, OTP input, progress through multi-stage flows.">
        <DSCard>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Step indicator */}
            <div>
              <SLabel>STEP INDICATOR</SLabel>
              <div className="flex items-center gap-2">
                {[
                  { label: "Auth", done: true },
                  { label: "OTP", done: true },
                  { label: "KYC", done: false, active: true },
                  { label: "Done", done: false },
                ].map((step, i, arr) => (
                  <div key={step.label} className="flex items-center gap-2">
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{
                        background: step.done ? BRAND.green : step.active ? `${BRAND.green}15` : t.surface,
                        border: `1.5px solid ${step.done ? BRAND.green : step.active ? BRAND.green : t.borderSubtle}`,
                      }}>
                        {step.done ? <Check size={12} color="#fff" /> : <span style={{ ...TY.body, fontSize: "10px", color: step.active ? BRAND.green : t.textFaint, letterSpacing: "-0.02em" }}>{i + 1}</span>}
                      </div>
                      <span style={{ ...TY.bodyR, fontSize: "9px", color: step.done || step.active ? t.text : t.textFaint, letterSpacing: "-0.02em" }}>{step.label}</span>
                    </div>
                    {i < arr.length - 1 && (
                      <div className="w-6 h-px mb-4" style={{ background: step.done ? BRAND.green : t.borderSubtle }} />
                    )}
                  </div>
                ))}
              </div>
            </div>
            {/* OTP Input */}
            <div>
              <SLabel>OTP INPUT (6-DIGIT, AUTO-ADVANCE)</SLabel>
              <div className="flex gap-2">
                {[1, 2, 3, null, null, null].map((digit, i) => (
                  <div key={i} className="w-10 h-12 rounded-xl flex items-center justify-center" style={{
                    background: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)",
                    border: `1.5px solid ${digit !== null ? BRAND.green : t.borderSubtle}`,
                    boxShadow: digit !== null ? `0 0 0 2px ${BRAND.green}18` : "none",
                  }}>
                    <span style={{ ...TY.h, fontSize: "18px", color: digit !== null ? t.text : "transparent" }}>{digit ?? "0"}</span>
                  </div>
                ))}
              </div>
              <span style={{ ...TY.bodyR, fontSize: "10px", color: t.textFaint, display: "block", marginTop: 8, letterSpacing: "-0.02em" }}>Resend code in 0:28</span>
            </div>
          </div>
        </DSCard>
      </Section>

      <div className="py-6 text-center">
        <span style={{ ...TY.bodyR, fontSize: "10px", color: t.textGhost, letterSpacing: "-0.02em" }}>JET Design System · Patterns · 17 Mar 2026</span>
      </div>
    </div>
  );
}