/**
 * HOTEL — SHELL LAYOUT
 *
 * Mirrors fleet-shell pattern: Nav rail + content area.
 * Journey states: onboarding → empty → active.
 *
 * Desktop: 48px collapsed icon rail, 180px expanded on hover.
 * Mobile: bottom tab bar (5 items, 44px touch targets).
 *
 * Tabs: Dashboard · Book Ride · Rides · Billing · Settings
 */

import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router";
import {
  LayoutDashboard, Car, Clock, Receipt,
  Settings, Bell, Copy, LogOut, User,
  Building2,
} from "lucide-react";
import { AdminThemeProvider, useAdminTheme, BRAND, TY, STATUS } from "../config/admin-theme";
import { MOCK_HOTEL } from "../config/hotel-mock-data";
import { Toast } from "../components/shared/toast";
import { HotelOnboarding } from "./hotel-onboarding";
import { HotelEmpty } from "./hotel-empty";
import { HotelDashboardView } from "./hotel-dashboard-view";
import { HotelBookRide } from "./hotel-book-ride";
import { HotelRides } from "./hotel-rides";
import { HotelBilling } from "./hotel-billing";
import { HotelSettings } from "./hotel-settings";
import {
  HotelContext, useHotelContext,
  type HotelJourneyState, type HotelNavId,
} from "./hotel-context";

const data = MOCK_HOTEL;

// ── Atmospheric Background ─────────────────────────────────────────────────

function AtmosphericBg() {
  const { theme } = useAdminTheme();
  const isDark = theme === "dark";
  return (
    <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }}>
      <div className="absolute inset-0" style={{
        background: isDark
          ? "radial-gradient(ellipse 70% 50% at 50% 100%, rgba(29,185,84,0.03) 0%, transparent 70%), radial-gradient(ellipse 40% 40% at 85% 15%, rgba(29,185,84,0.02) 0%, transparent 60%)"
          : "radial-gradient(ellipse 70% 50% at 50% 100%, rgba(29,185,84,0.015) 0%, transparent 70%)",
      }} />
      <div className="absolute inset-0" style={{
        backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        opacity: 0.03, mixBlendMode: "overlay",
      }} />
    </div>
  );
}


// ── Top Bar ────────────────────────────────────────────────────────────���───

function HotelTopBar() {
  const { t, theme } = useAdminTheme();
  const isDark = theme === "dark";
  const { setActiveNav } = useHotelContext();
  const navigate = useNavigate();
  const [notifOpen, setNotifOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState<{ msg: string; type: "success" | "info" | "error" } | null>(null);

  const unreadCount = data.notifications.filter(n => !n.read).length;

  return (
    <div
      className="h-12 px-3 md:px-4 flex items-center gap-3 shrink-0 relative"
      style={{
        borderBottom: `1px solid ${t.borderSubtle}`,
        background: isDark ? "rgba(11,11,13,0.7)" : "rgba(255,255,255,0.7)",
        backdropFilter: "blur(16px)",
        zIndex: 20,
      }}
    >
      {/* Logo + Hotel Name */}
      <div className="flex items-center gap-2.5">
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center"
          style={{ background: isDark ? `${BRAND.green}08` : `${BRAND.green}06`, border: `1px solid ${isDark ? `${BRAND.green}12` : `${BRAND.green}10`}` }}
        >
          <Building2 size={12} style={{ color: BRAND.green }} />
        </div>
        <div>
          <span className="block" style={{
            fontFamily: "'Montserrat', sans-serif", fontWeight: 600,
            fontSize: "11px", letterSpacing: "-0.03em", color: t.text, lineHeight: "1.2",
          }}>
            {data.hotelName}
          </span>
          <span style={{ ...TY.bodyR, fontSize: "9px", color: t.textFaint, lineHeight: "1.5" }}>
            Hotel Partner
          </span>
        </div>
      </div>

      <div className="flex-1" />

      {/* Notifications */}
      <div className="relative">
        <button
          className="w-8 h-8 rounded-lg flex items-center justify-center relative cursor-pointer"
          style={{ border: `1px solid ${t.borderSubtle}` }}
          onClick={() => setNotifOpen(!notifOpen)}
        >
          <Bell size={14} style={{ color: notifOpen ? BRAND.green : t.textFaint }} />
          {unreadCount > 0 && (
            <span
              className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full"
              style={{ background: STATUS.error, border: `2px solid ${t.bg}` }}
            />
          )}
        </button>

        <AnimatePresence>
          {notifOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setNotifOpen(false)} />
              <motion.div
                className="absolute top-full right-0 mt-2 z-50 rounded-2xl overflow-hidden"
                style={{
                  width: 340,
                  background: isDark ? "rgba(18,18,20,0.97)" : "rgba(255,255,255,0.98)",
                  border: `1px solid ${t.borderSubtle}`,
                  boxShadow: isDark ? "0 16px 48px rgba(0,0,0,0.6)" : "0 16px 48px rgba(0,0,0,0.12)",
                  backdropFilter: "blur(20px)",
                }}
                initial={{ opacity: 0, y: -8, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.98 }}
                transition={{ duration: 0.18 }}
              >
                <div className="px-4 py-3" style={{ borderBottom: `1px solid ${t.borderSubtle}` }}>
                  <span style={{ ...TY.body, fontSize: "12px", color: t.text, lineHeight: "1.4", letterSpacing: "-0.02em" }}>
                    Notifications
                  </span>
                  {unreadCount > 0 && (
                    <span className="ml-2 px-1.5 py-0.5 rounded-md" style={{
                      ...TY.bodyR, fontSize: "9px", background: `${BRAND.green}10`, color: BRAND.green, lineHeight: "1.5",
                    }}>
                      {unreadCount} new
                    </span>
                  )}
                </div>
                <div className="max-h-72 overflow-y-auto">
                  {data.notifications.map((n, i) => (
                    <div
                      key={n.id}
                      className="px-4 py-3 cursor-pointer"
                      style={{
                        borderBottom: i < data.notifications.length - 1 ? `1px solid ${t.borderSubtle}` : "none",
                        background: !n.read ? (isDark ? "rgba(29,185,84,0.02)" : "rgba(29,185,84,0.01)") : "transparent",
                      }}
                      onClick={() => setNotifOpen(false)}
                    >
                      <div className="flex items-start gap-2">
                        {!n.read && <div className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ background: BRAND.green }} />}
                        <div className="flex-1 min-w-0">
                          <span className="block" style={{ ...TY.body, fontSize: "11px", color: t.text, lineHeight: "1.4", letterSpacing: "-0.02em" }}>
                            {n.title}
                          </span>
                          <span className="block" style={{ ...TY.bodyR, fontSize: "10px", color: t.textMuted, lineHeight: "1.5" }}>
                            {n.detail}
                          </span>
                        </div>
                        <span className="shrink-0" style={{ ...TY.bodyR, fontSize: "9px", color: t.textFaint }}>{n.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      {/* User Menu */}
      <div className="relative">
        <button
          onClick={() => setUserMenuOpen(!userMenuOpen)}
          className="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer"
          style={{
            background: userMenuOpen ? (isDark ? `${BRAND.green}08` : `${BRAND.green}06`) : (isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)"),
            border: `1px solid ${userMenuOpen ? (isDark ? `${BRAND.green}18` : `${BRAND.green}14`) : (isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)")}`,
          }}
          aria-label="User menu"
        >
          <span style={{
            fontFamily: "'Montserrat', sans-serif", fontWeight: 600,
            fontSize: "9px", color: userMenuOpen ? BRAND.green : t.textMuted, letterSpacing: "-0.02em",
          }}>AO</span>
        </button>

        <AnimatePresence>
          {userMenuOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
              <motion.div
                className="absolute top-full right-0 mt-2 z-50 rounded-xl overflow-hidden"
                style={{
                  minWidth: 200,
                  background: isDark ? "rgba(18,18,20,0.97)" : "rgba(255,255,255,0.98)",
                  border: `1px solid ${t.borderSubtle}`,
                  backdropFilter: "blur(20px)",
                  boxShadow: isDark ? "0 8px 32px rgba(0,0,0,0.5)" : "0 8px 32px rgba(0,0,0,0.1)",
                }}
                initial={{ opacity: 0, y: -4, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -4, scale: 0.97 }}
                transition={{ duration: 0.15 }}
              >
                <div className="px-3 py-3" style={{ borderBottom: `1px solid ${t.borderSubtle}` }}>
                  <span className="block" style={{ ...TY.body, fontSize: "12px", color: t.text, lineHeight: "1.4", letterSpacing: "-0.02em" }}>
                    {data.contactName}
                  </span>
                  <span style={{ ...TY.bodyR, fontSize: "10px", color: t.textMuted, lineHeight: "1.5" }}>
                    {data.email}
                  </span>
                </div>
                <div className="p-1">
                  <button
                    onClick={() => { setUserMenuOpen(false); setActiveNav("settings"); }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg cursor-pointer hover:opacity-80"
                  >
                    <User size={12} style={{ color: t.textMuted }} />
                    <span style={{ ...TY.bodyR, fontSize: "11px", color: t.textSecondary, lineHeight: "1.4" }}>Account settings</span>
                  </button>
                </div>
                <div className="p-1" style={{ borderTop: `1px solid ${t.borderSubtle}` }}>
                  <button
                    onClick={() => { setUserMenuOpen(false); setToastMsg({ msg: "Signed out — redirecting to login", type: "info" }); setTimeout(() => navigate("/hotel/login"), 1200); }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg cursor-pointer hover:opacity-80"
                  >
                    <LogOut size={12} style={{ color: STATUS.error }} />
                    <span style={{ ...TY.body, fontSize: "11px", color: STATUS.error, lineHeight: "1.4", letterSpacing: "-0.02em" }}>Sign out</span>
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {toastMsg && <Toast message={toastMsg.msg} type={toastMsg.type} onDismiss={() => setToastMsg(null)} />}
      </AnimatePresence>
    </div>
  );
}


// ── Nav Items ──────────────────────────────────────────────────────────────

const NAV_ITEMS: { id: HotelNavId; icon: typeof LayoutDashboard; label: string }[] = [
  { id: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { id: "book",      icon: Car,             label: "Book Ride" },
  { id: "rides",     icon: Clock,           label: "Rides" },
  { id: "billing",   icon: Receipt,         label: "Billing" },
  { id: "settings",  icon: Settings,        label: "Settings" },
];


// ── Nav Rail (Desktop) ────────────────────────────────────────────────────

function NavRail() {
  const { t, theme } = useAdminTheme();
  const isDark = theme === "dark";
  const { activeNav, setActiveNav } = useHotelContext();
  const [hovered, setHovered] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const enter = () => { if (timerRef.current) clearTimeout(timerRef.current); setHovered(true); };
  const leave = () => { timerRef.current = setTimeout(() => setHovered(false), 150); };
  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  return (
    <motion.nav
      className="hidden md:flex flex-col shrink-0 h-full py-3 px-2 gap-1 overflow-hidden"
      style={{
        borderRight: `1px solid ${t.borderSubtle}`,
        background: isDark ? "rgba(11,11,13,0.4)" : "rgba(255,255,255,0.4)",
      }}
      animate={{ width: hovered ? 180 : 48 }}
      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={enter}
      onMouseLeave={leave}
    >
      {NAV_ITEMS.map(item => {
        const active = activeNav === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setActiveNav(item.id)}
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl cursor-pointer overflow-hidden whitespace-nowrap"
            style={{
              background: active
                ? isDark ? `${BRAND.green}08` : `${BRAND.green}04`
                : "transparent",
              minHeight: 40,
            }}
          >
            <item.icon
              size={16}
              style={{ color: active ? BRAND.green : t.textFaint, flexShrink: 0 }}
            />
            <AnimatePresence>
              {hovered && (
                <motion.span
                  initial={{ opacity: 0, x: -4 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.12 }}
                  style={{
                    ...TY.body,
                    fontSize: "11px",
                    color: active ? BRAND.green : t.textSecondary,
                    lineHeight: "1.4",
                    letterSpacing: "-0.02em",
                  }}
                >
                  {item.label}
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        );
      })}
    </motion.nav>
  );
}


// ── Bottom Tabs (Mobile) ──────────────────────────────────────────────────

function BottomTabs() {
  const { t, theme } = useAdminTheme();
  const isDark = theme === "dark";
  const { activeNav, setActiveNav } = useHotelContext();

  return (
    <nav
      className="md:hidden flex items-center justify-around shrink-0"
      style={{
        height: 56,
        borderTop: `1px solid ${t.borderSubtle}`,
        background: isDark ? "rgba(11,11,13,0.85)" : "rgba(255,255,255,0.85)",
        backdropFilter: "blur(16px)",
      }}
    >
      {NAV_ITEMS.map(item => {
        const active = activeNav === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setActiveNav(item.id)}
            className="flex flex-col items-center justify-center cursor-pointer"
            style={{ minWidth: 44, minHeight: 44 }}
          >
            <item.icon
              size={18}
              style={{ color: active ? BRAND.green : t.textFaint, marginBottom: 2 }}
            />
            <span style={{
              ...TY.bodyR, fontSize: "9px",
              color: active ? BRAND.green : t.textFaint,
              lineHeight: "1.4",
            }}>
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}


// ── Content Router ────────────────────────────────────────────────────────

function HotelContent() {
  const { activeNav } = useHotelContext();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={activeNav}
        className="h-full"
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -4 }}
        transition={{ duration: 0.2 }}
      >
        {activeNav === "dashboard" && <HotelDashboardView />}
        {activeNav === "book" && <HotelBookRide />}
        {activeNav === "rides" && <HotelRides />}
        {activeNav === "billing" && <HotelBilling />}
        {activeNav === "settings" && <HotelSettings />}
      </motion.div>
    </AnimatePresence>
  );
}


// ── Shell ──────────────────────────────────────────────────────────────────

function HotelShellInner() {
  const { t } = useAdminTheme();
  // Derive initial journey state from hotel data
  const deriveHotelJourneyState = (): HotelJourneyState => {
    // TODO: replace with real hotel data checks
    // if (!hotel.hasCompletedOnboarding) return "onboarding";
    // if (hotel.rides.length === 0) return "empty";
    return "onboarding";
  };

  const [journeyState, setJourneyState] = useState<HotelJourneyState>(deriveHotelJourneyState);
  const [activeNav, setActiveNav] = useState<HotelNavId>("dashboard");

  const navigateTo = useCallback((nav: HotelNavId) => { setActiveNav(nav); }, []);

  if (journeyState === "onboarding") {
    return (
      <HotelContext.Provider value={{ journeyState, setJourneyState, activeNav, setActiveNav, navigateTo }}>
        <div className="w-full h-screen overflow-hidden" style={{ background: t.bg }}>
          <AtmosphericBg />
          <div className="relative h-full" style={{ zIndex: 1 }}>
            <HotelOnboarding onComplete={() => setJourneyState("empty")} />
          </div>
        </div>
      </HotelContext.Provider>
    );
  }

  return (
    <HotelContext.Provider value={{ journeyState, setJourneyState, activeNav, setActiveNav, navigateTo }}>
      <div className="w-full h-screen flex flex-col overflow-hidden" style={{ background: t.bg }}>
        <AtmosphericBg />
        <div className="relative flex flex-col flex-1 overflow-hidden" style={{ zIndex: 1 }}>
          <HotelTopBar />
          <div className="flex flex-1 overflow-hidden">
            <NavRail />
            <main className="flex-1 overflow-y-auto">
              {journeyState === "empty" ? <HotelEmpty /> : <HotelContent />}
            </main>
          </div>
          <BottomTabs />
        </div>
      </div>
    </HotelContext.Provider>
  );
}


export function HotelShell() {
  return (
    <AdminThemeProvider>
      <HotelShellInner />
    </AdminThemeProvider>
  );
}