/**
 * DS SHELL — Design System multi-page layout shell.
 * Sidebar nav + Outlet for child pages.
 */

import { Outlet, useNavigate, useLocation } from "react-router";
import { AdminThemeProvider, useAdminTheme, BRAND, TY } from "../config/admin-theme";
import { Sun, Moon, Zap, ChevronRight } from "lucide-react";

const NAV = [
  { path: "/design-system", label: "Foundation", desc: "Tokens · Colors · Type · Spacing" },
  { path: "/design-system/components", label: "Components", desc: "Buttons · Inputs · Cards · Charts" },
  { path: "/design-system/rider", label: "Rider C Spine", desc: "Glass · Map · Toast · Confirm" },
  { path: "/design-system/driver", label: "Driver", desc: "Earnings · TripRequest · Wallet" },
  { path: "/design-system/admin", label: "Admin Primitives", desc: "KPI · Modal · Drawer · Pipeline" },
  { path: "/design-system/fleet", label: "Fleet", desc: "DriverCard · Tables · Modals" },
  { path: "/design-system/patterns", label: "Patterns", desc: "Auth · Logo · Layout · Onboarding" },
];

function DSShellInner() {
  const { t, theme, toggle } = useAdminTheme();
  const isDark = theme === "dark";
  const nav = useNavigate();
  const loc = useLocation();

  return (
    <div className="flex min-h-screen" style={{ background: t.bg }}>
      {/* ── Sidebar ──────────────────────────────────────── */}
      <nav
        className="hidden lg:flex flex-col w-[220px] shrink-0 sticky top-0 h-screen overflow-y-auto"
        style={{
          borderRight: `1px solid ${t.borderSubtle}`,
          background: isDark ? "rgba(8,8,10,0.6)" : "rgba(247,248,250,0.6)",
          backdropFilter: "blur(12px)",
        }}
      >
        {/* Header */}
        <div className="flex items-center gap-2 px-5 py-4" style={{ borderBottom: `1px solid ${t.borderSubtle}` }}>
          <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{ background: BRAND.green }}>
            <Zap size={12} color="#fff" />
          </div>
          <div>
            <span style={{ ...TY.h, fontSize: "13px", color: t.text, display: "block", lineHeight: "1.2" }}>JET Design System</span>
            <span style={{ ...TY.bodyR, fontSize: "9px", color: t.textFaint }}>v1.0 · Multi-page</span>
          </div>
        </div>

        {/* Nav links */}
        <div className="flex-1 py-3 px-3 space-y-0.5">
          {NAV.map((n) => {
            const active = loc.pathname === n.path;
            return (
              <button
                key={n.path}
                onClick={() => nav(n.path)}
                className="w-full text-left px-3 py-2.5 rounded-xl cursor-pointer transition-all"
                style={{
                  background: active ? (isDark ? "rgba(255,255,255,0.05)" : "#fff") : "transparent",
                  border: `1px solid ${active ? (isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)") : "transparent"}`,
                  boxShadow: active && !isDark ? "0 1px 3px rgba(0,0,0,0.04)" : "none",
                }}
              >
                <div className="flex items-center justify-between">
                  <span style={{ ...TY.body, fontSize: "11px", color: active ? t.text : t.textSecondary, lineHeight: "1.3" }}>{n.label}</span>
                  {active && <ChevronRight size={10} style={{ color: BRAND.green }} />}
                </div>
                <span style={{ ...TY.bodyR, fontSize: "9px", color: t.textFaint, lineHeight: "1.3" }}>{n.desc}</span>
              </button>
            );
          })}
        </div>

        {/* Theme toggle */}
        <div className="px-4 py-3" style={{ borderTop: `1px solid ${t.borderSubtle}` }}>
          <button
            onClick={toggle}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer"
            style={{ background: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)", border: `1px solid ${t.borderSubtle}` }}
          >
            {isDark ? <Moon size={12} style={{ color: t.textSecondary }} /> : <Sun size={12} style={{ color: t.textSecondary }} />}
            <span style={{ ...TY.body, fontSize: "10px", color: t.textSecondary }}>{isDark ? "Dark Mode" : "Light Mode"}</span>
          </button>
        </div>
      </nav>

      {/* ── Mobile topbar ────────────────────────────────── */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-30 flex items-center gap-3 px-4 py-2.5"
        style={{
          background: isDark ? "rgba(8,8,10,0.85)" : "rgba(247,248,250,0.85)",
          backdropFilter: "blur(20px)", borderBottom: `1px solid ${t.borderSubtle}`,
        }}
      >
        <div className="w-5 h-5 rounded flex items-center justify-center" style={{ background: BRAND.green }}><Zap size={10} color="#fff" /></div>
        <span style={{ ...TY.h, fontSize: "12px", color: t.text }}>JET DS</span>
        <div className="flex-1 overflow-x-auto flex gap-1">
          {NAV.map((n) => {
            const active = loc.pathname === n.path;
            return (
              <button
                key={n.path}
                onClick={() => nav(n.path)}
                className="shrink-0 px-2.5 py-1 rounded-lg cursor-pointer"
                style={{
                  background: active ? (isDark ? "rgba(255,255,255,0.06)" : "#fff") : "transparent",
                  border: `1px solid ${active ? t.borderStrong : "transparent"}`,
                  ...TY.body, fontSize: "9px", color: active ? t.text : t.textMuted,
                }}
              >
                {n.label}
              </button>
            );
          })}
        </div>
        <button onClick={toggle} className="shrink-0 w-7 h-7 rounded-lg flex items-center justify-center cursor-pointer"
          style={{ background: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)" }}>
          {isDark ? <Moon size={11} style={{ color: t.textMuted }} /> : <Sun size={11} style={{ color: t.textMuted }} />}
        </button>
      </div>

      {/* ── Content ─────────────────────────────────────── */}
      <main className="flex-1 min-w-0 lg:pt-0 pt-12">
        <Outlet />
      </main>
    </div>
  );
}

export default function DSShell() {
  return (
    <AdminThemeProvider>
      <DSShellInner />
    </AdminThemeProvider>
  );
}