/**
 * JET ADMIN — SHELL LAYOUT
 *
 * Shared layout for all admin views:
 *   NavRail (expandable) │ Content (Outlet)
 *
 * Integrates:
 *   - Onboarding system (welcome modal + contextual hints)
 *   - Mobile gate (desktop-first enforcement)
 *   - Responsive nav (hamburger on mobile after gate dismiss)
 */

import { useCallback, useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X, LogOut } from "lucide-react";
import { AdminThemeProvider, useAdminTheme, BRAND, STATUS, TY } from "../config/admin-theme";
import { NavRail, NAV_ITEMS } from "../components/admin/ui/nav-rail";
import { OnboardingProvider, WelcomeModal } from "../components/admin/ui/admin-onboarding";
import { MobileGate } from "../components/admin/ui/mobile-gate";

const NAV_ROUTES: Record<string, string> = {
  command: "/admin",
  rides: "/admin/rides",
  disputes: "/admin/disputes",
  support: "/admin/support",
  riders: "/admin/riders",
  drivers: "/admin/drivers",
  hotels: "/admin/hotels",
  fleet: "/admin/fleet",
  finance: "/admin/finance",
  analytics: "/admin/analytics",
  comms: "/admin/comms",
  settings: "/admin/settings",
};

const ROUTE_TO_NAV: Record<string, string> = Object.fromEntries(
  Object.entries(NAV_ROUTES).map(([k, v]) => [v, k])
);

function AdminShellInner() {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, t } = useAdminTheme();
  const isDark = theme === "dark";
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const activeNav = ROUTE_TO_NAV[location.pathname] || "command";

  const handleNavChange = useCallback((id: string) => {
    const route = NAV_ROUTES[id];
    if (route) navigate(route);
    setMobileNavOpen(false);
  }, [navigate]);

  const handleLogout = useCallback(() => {
    navigate("/admin/login");
  }, [navigate]);

  return (
    <>
      <div className="flex h-screen w-full overflow-hidden" style={{ background: t.bg }}>
        {/* Desktop nav rail */}
        <NavRail activeNav={activeNav} onNavChange={handleNavChange} onLogout={handleLogout} />

        {/* Mobile header + hamburger */}
        <div className="flex-1 flex flex-col min-w-0 min-h-0">
          {/* Mobile top bar — only visible on small screens */}
          <div
            className="flex md:hidden items-center justify-between px-4 shrink-0"
            style={{
              height: 52,
              background: t.overlay,
              borderBottom: `1px solid ${t.border}`,
            }}
          >
            <div className="flex items-center gap-2.5">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center"
                style={{ background: isDark ? "rgba(29,185,84,0.12)" : "rgba(29,185,84,0.08)" }}
              >
                <span
                  style={{
                    fontFamily: "'Montserrat', sans-serif",
                    fontWeight: 700,
                    fontSize: "10px",
                    color: BRAND.green,
                  }}
                >
                  J
                </span>
              </div>
              <span
                style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontWeight: 600,
                  fontSize: "13px",
                  letterSpacing: "-0.02em",
                  color: t.text,
                }}
              >
                JET Admin
              </span>
            </div>
            <button
              onClick={() => setMobileNavOpen(true)}
              className="w-9 h-9 rounded-lg flex items-center justify-center"
              style={{
                background: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)",
                minHeight: 44,
                minWidth: 44,
              }}
            >
              <Menu size={18} style={{ color: t.icon }} />
            </button>
          </div>

          <Outlet />
        </div>
      </div>

      {/* Mobile nav overlay */}
      <AnimatePresence>
        {mobileNavOpen && (
          <div className="fixed inset-0 z-[100] md:hidden">
            <motion.div
              className="absolute inset-0"
              style={{ background: isDark ? "rgba(0,0,0,0.5)" : "rgba(0,0,0,0.2)" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileNavOpen(false)}
            />
            <motion.div
              className="absolute left-0 top-0 bottom-0 flex flex-col overflow-y-auto"
              style={{
                width: 280,
                background: isDark ? "#111113" : "#FFFFFF",
                borderRight: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
                boxShadow: isDark
                  ? "8px 0 40px rgba(0,0,0,0.5)"
                  : "8px 0 40px rgba(0,0,0,0.08)",
              }}
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Header */}
              <div
                className="flex items-center justify-between px-4 shrink-0"
                style={{
                  height: 52,
                  borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
                }}
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center"
                    style={{ background: isDark ? "rgba(29,185,84,0.12)" : "rgba(29,185,84,0.08)" }}
                  >
                    <span
                      style={{
                        fontFamily: "'Montserrat', sans-serif",
                        fontWeight: 700,
                        fontSize: "10px",
                        color: BRAND.green,
                      }}
                    >
                      J
                    </span>
                  </div>
                  <span
                    style={{
                      fontFamily: "'Montserrat', sans-serif",
                      fontWeight: 600,
                      fontSize: "13px",
                      letterSpacing: "-0.02em",
                      color: t.text,
                    }}
                  >
                    JET Admin
                  </span>
                </div>
                <button
                  onClick={() => setMobileNavOpen(false)}
                  className="w-9 h-9 rounded-lg flex items-center justify-center"
                  style={{
                    background: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)",
                    minHeight: 44,
                    minWidth: 44,
                  }}
                >
                  <X size={16} style={{ color: t.textMuted }} />
                </button>
              </div>

              {/* Nav items */}
              <div className="flex-1 py-3 px-3">
                {["OPERATIONS", "PEOPLE", "PARTNERS", "BUSINESS", "SYSTEM"].map((section, si) => {
                  const items = NAV_ITEMS.filter(n => n.section === section);
                  return (
                    <div key={section}>
                      {si > 0 && (
                        <div
                          className="h-px mx-1 my-2"
                          style={{ background: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)" }}
                        />
                      )}
                      <span
                        className="block px-2.5 mb-1"
                        style={{
                          fontFamily: "'Manrope', sans-serif",
                          fontWeight: 600,
                          fontSize: "9px",
                          letterSpacing: "0.05em",
                          color: t.textGhost,
                        }}
                      >
                        {section}
                      </span>
                      {items.map((item) => {
                        const isActive = item.id === activeNav;
                        return (
                          <button
                            key={item.id}
                            onClick={() => handleNavChange(item.id)}
                            className="w-full rounded-xl flex items-center gap-3 px-2.5 mb-0.5 transition-colors"
                            style={{
                              height: 44,
                              background: isActive ? (isDark ? "rgba(29,185,84,0.1)" : "rgba(29,185,84,0.06)") : "transparent",
                            }}
                          >
                            <item.Icon
                              size={16}
                              style={{ color: isActive ? BRAND.green : t.iconSecondary, flexShrink: 0 }}
                            />
                            <span
                              className="flex-1 text-left"
                              style={{
                                fontFamily: "'Manrope', sans-serif",
                                fontWeight: 500,
                                fontSize: "13px",
                                letterSpacing: "-0.02em",
                                color: isActive ? BRAND.green : t.textSecondary,
                              }}
                            >
                              {item.label}
                            </span>
                            {item.badge && (
                              <span
                                className="min-w-[18px] h-[18px] rounded-full flex items-center justify-center"
                                style={{
                                  fontFamily: "'Manrope', sans-serif",
                                  fontWeight: 600,
                                  fontSize: "9px",
                                  color: "#fff",
                                  background: (item.id === "disputes" || item.id === "support") ? "#D4183D" : BRAND.green,
                                }}
                              >
                                {item.badge}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  );
                })}
              </div>

              {/* Footer */}
              <div className="px-3 pb-4 shrink-0 space-y-2">
                {/* Sign out */}
                <button
                  onClick={handleLogout}
                  className="w-full rounded-xl flex items-center gap-3 px-3 py-2.5 cursor-pointer"
                  style={{
                    background: isDark ? "rgba(212,24,61,0.06)" : "rgba(212,24,61,0.04)",
                    minHeight: 44,
                  }}
                >
                  <LogOut size={14} style={{ color: STATUS.error, flexShrink: 0 }} />
                  <span
                    style={{
                      fontFamily: "'Manrope', sans-serif",
                      fontWeight: 500,
                      fontSize: "13px",
                      letterSpacing: "-0.02em",
                      color: STATUS.error,
                    }}
                  >
                    Sign out
                  </span>
                </button>
                <div
                  className="rounded-xl flex items-center gap-2 py-2.5 px-3"
                  style={{
                    background: isDark ? "rgba(255,255,255,0.025)" : "rgba(0,0,0,0.02)",
                  }}
                >
                  <div className="w-2 h-2 rounded-full shrink-0" style={{ background: BRAND.green }} />
                  <span
                    style={{
                      fontFamily: "'Manrope', sans-serif",
                      fontWeight: 500,
                      fontSize: "10px",
                      letterSpacing: "-0.02em",
                      color: t.textMuted,
                    }}
                  >
                    System operational
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Onboarding — shell level */}
      <WelcomeModal />
      <MobileGate />
    </>
  );
}

export function AdminShell() {
  return (
    <AdminThemeProvider>
      <OnboardingProvider>
        <AdminShellInner />
      </OnboardingProvider>
    </AdminThemeProvider>
  );
}