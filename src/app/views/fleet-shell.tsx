/**
 * FLEET OWNER — SHELL LAYOUT
 *
 * Nav rail (left) + Content (Outlet or inline view).
 * Matches admin shell pattern but simpler — 5 items vs 12.
 *
 * Desktop: 48px collapsed icon rail, 180px expanded on hover.
 * Mobile: bottom tab bar (5 items, 44px touch targets).
 *
 * Includes a demo state toggle (onboarding / empty / active)
 * pinned to bottom-right for testing.
 */

import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router";
import {
  LayoutDashboard, Users, Car, Wallet,
  Settings, Bell, Copy,
  ChevronDown, Plus, X, MapPin, Check, Layers,
  LogOut, User,
} from "lucide-react";
import { AdminThemeProvider, useAdminTheme, BRAND, TY, STATUS } from "../config/admin-theme";
import { MOCK_FLEET_OWNER, MOCK_NOTIFICATIONS } from "../config/fleet-mock-data";
import { StatusDot } from "../components/fleet/driver-card";
import { NotificationPanel } from "../components/fleet/notification-panel";
import { VariationE } from "./fleet-variation-e";
import { FleetOnboarding } from "./fleet-onboarding";
import { FleetEmpty } from "./fleet-empty";
import { FleetDrivers } from "./fleet-drivers";
import { FleetVehicles } from "./fleet-vehicles";
import { FleetEarnings } from "./fleet-earnings";
import { FleetSettings } from "./fleet-settings";
import { Toast } from "../components/shared/toast";
import {
  MOCK_FLEETS, ALL_FLEETS_ID, FleetContext, useFleetContext,
  type FleetWorkspace, type FleetJourneyState, type FleetNavId, type FleetDeepLink,
} from "./fleet-context";

const data = MOCK_FLEET_OWNER;

// ─── Nav Items ──────────────────────────────────────────────────────────────

const NAV_ITEMS: { id: FleetNavId; label: string; icon: typeof LayoutDashboard }[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "drivers", label: "Drivers", icon: Users },
  { id: "vehicles", label: "Vehicles", icon: Car },
  { id: "earnings", label: "Earnings", icon: Wallet },
  { id: "settings", label: "Settings", icon: Settings },
];


// ─── Nav Rail (Desktop) ─────────────────────────────────────────────────────

function FleetNavRail({
  active,
  onChange,
}: {
  active: FleetNavId;
  onChange: (id: FleetNavId) => void;
}) {
  const { t, theme } = useAdminTheme();
  const isDark = theme === "dark";
  const [hovered, setHovered] = useState(false);
  const expanded = hovered;

  return (
    <motion.nav
      className="hidden md:flex flex-col h-full shrink-0 relative z-20"
      style={{
        background: isDark
          ? "linear-gradient(180deg, rgba(255,255,255,0.015) 0%, transparent 100%)"
          : "linear-gradient(180deg, rgba(0,0,0,0.008) 0%, transparent 100%)",
        borderRight: `1px solid ${t.borderSubtle}`,
      }}
      animate={{ width: expanded ? 180 : 48 }}
      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Logo */}
      <div
        className="flex items-center gap-2.5 px-2.5 shrink-0"
        style={{ height: 52, borderBottom: `1px solid ${t.borderSubtle}` }}
      >
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
          style={{
            background: `linear-gradient(135deg, ${BRAND.green}18 0%, ${BRAND.green}06 100%)`,
            border: `1px solid ${BRAND.green}12`,
          }}
        >
          <span style={{
            fontFamily: "'Montserrat', sans-serif", fontWeight: 700,
            fontSize: "10px", color: BRAND.green,
          }}>
            J
          </span>
        </div>
        <AnimatePresence>
          {expanded && (
            <motion.span
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -4 }}
              transition={{ duration: 0.15 }}
              className="truncate"
              style={{
                fontFamily: "'Montserrat', sans-serif", fontWeight: 600,
                fontSize: "12px", letterSpacing: "-0.02em", color: t.text,
                lineHeight: "1.2",
              }}
            >
              {data.businessName}
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Nav items */}
      <div className="flex-1 py-2 px-1.5 space-y-0.5">
        {NAV_ITEMS.map((item) => {
          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onChange(item.id)}
              className="w-full flex items-center gap-2.5 rounded-xl transition-all duration-150 cursor-pointer"
              style={{
                padding: expanded ? "8px 10px" : "8px 0",
                justifyContent: expanded ? "flex-start" : "center",
                background: isActive
                  ? isDark ? `${BRAND.green}08` : `${BRAND.green}06`
                  : "transparent",
                minHeight: 40,
              }}
            >
              <item.icon
                size={16}
                style={{
                  color: isActive ? BRAND.green : t.textFaint,
                  transition: "color 0.15s",
                  flexShrink: 0,
                }}
              />
              <AnimatePresence>
                {expanded && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.1 }}
                    className="truncate"
                    style={{
                      ...TY.body,
                      fontSize: "11px",
                      color: isActive ? BRAND.green : t.textMuted,
                      lineHeight: "1.4",
                    }}
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          );
        })}
      </div>

      {/* Bottom: user avatar */}
      <div
        className="px-2.5 py-3 flex items-center justify-center"
        style={{ borderTop: `1px solid ${t.borderSubtle}` }}
      >
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
          style={{
            background: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)",
            border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
          }}
        >
          <span style={{
            fontFamily: "'Montserrat', sans-serif", fontWeight: 600,
            fontSize: "9px", color: t.textMuted, letterSpacing: "-0.02em",
          }}>
            CO
          </span>
        </div>
      </div>
    </motion.nav>
  );
}


// ─── Mobile Bottom Tabs ────────────────────────────────────────────────────

function FleetBottomTabs({
  active,
  onChange,
}: {
  active: FleetNavId;
  onChange: (id: FleetNavId) => void;
}) {
  const { t, theme } = useAdminTheme();
  const isDark = theme === "dark";

  return (
    <div
      className="md:hidden flex items-center shrink-0"
      style={{
        height: 56,
        background: isDark
          ? "rgba(12,12,14,0.92)"
          : "rgba(255,255,255,0.95)",
        borderTop: `1px solid ${t.borderSubtle}`,
        backdropFilter: "blur(20px)",
      }}
    >
      {NAV_ITEMS.map((item) => {
        const isActive = active === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onChange(item.id)}
            className="flex-1 flex flex-col items-center justify-center gap-1 cursor-pointer"
            style={{ minHeight: 44 }}
          >
            <item.icon
              size={18}
              style={{ color: isActive ? BRAND.green : t.textFaint }}
            />
            <span style={{
              fontFamily: "'Manrope', sans-serif", fontWeight: isActive ? 500 : 400,
              fontSize: "9px", letterSpacing: "-0.02em",
              color: isActive ? BRAND.green : t.textFaint,
              lineHeight: "1.4",
            }}>
              {item.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}


// ─── Top Bar ────────────────────────────────────────────────────────────────

function FleetTopBar() {
  const { t, theme } = useAdminTheme();
  const isDark = theme === "dark";
  const { navigateTo, setActiveNav, activeFleetId, setActiveFleetId, fleets, addFleet, setJourneyState } = useFleetContext();
  const navigate = useNavigate();
  const [fleetDropdownOpen, setFleetDropdownOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [showCreateFleet, setShowCreateFleet] = useState(false);
  const [newFleetName, setNewFleetName] = useState("");
  const [newFleetLocation, setNewFleetLocation] = useState("");
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState<{ msg: string; type: "success" | "info" | "error" } | null>(null);

  const unreadCount = MOCK_NOTIFICATIONS.filter(n => !n.read).length;

  const copyInviteLink = useCallback(() => {
    navigator.clipboard?.writeText(data.inviteLink || "https://jet.ng/fleet/abc123");
    setToastMsg({ msg: "Invite link copied to clipboard", type: "info" });
  }, []);

  const handleCreateFleet = useCallback(() => {
    if (!newFleetName.trim()) return;
    addFleet(newFleetName.trim(), newFleetLocation.trim() || "Nigeria");
    setShowCreateFleet(false);
    setFleetDropdownOpen(false);
    setNewFleetName("");
    setNewFleetLocation("");
    // New fleet starts in empty journey state
    setJourneyState("empty");
    setActiveNav("dashboard");
  }, [newFleetName, newFleetLocation, addFleet, setJourneyState, setActiveNav]);

  const handleNotifNavigate = useCallback((nav: string, opts?: { tab?: string; entityId?: string }) => {
    setActiveNav(nav as FleetNavId);
    if (opts?.entityId) {
      navigateTo(nav as FleetNavId, { entityId: opts.entityId, entityType: nav === "drivers" ? "driver" : "vehicle" });
    }
  }, [navigateTo, setActiveNav]);

  const activeFleetName = activeFleetId === ALL_FLEETS_ID
    ? "All Fleets"
    : fleets.find(f => f.id === activeFleetId)?.name || data.businessName;

  return (
    <div
      className="shrink-0 px-4 md:px-5 flex items-center gap-3"
      style={{
        height: 52,
        borderBottom: `1px solid ${t.borderSubtle}`,
        background: isDark
          ? "linear-gradient(180deg, rgba(255,255,255,0.015) 0%, transparent 100%)"
          : "linear-gradient(180deg, rgba(0,0,0,0.006) 0%, transparent 100%)",
      }}
    >
      {/* Mobile logo */}
      <div className="md:hidden flex items-center gap-2">
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center"
          style={{
            background: `linear-gradient(135deg, ${BRAND.green}18 0%, ${BRAND.green}06 100%)`,
            border: `1px solid ${BRAND.green}12`,
          }}
        >
          <span style={{
            fontFamily: "'Montserrat', sans-serif", fontWeight: 700,
            fontSize: "10px", color: BRAND.green,
          }}>J</span>
        </div>
      </div>

      {/* Fleet switcher */}
      <div className="relative">
        <button
          onClick={() => setFleetDropdownOpen(!fleetDropdownOpen)}
          className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg cursor-pointer transition-all duration-150"
          style={{
            background: fleetDropdownOpen
              ? isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)"
              : "transparent",
            border: `1px solid ${fleetDropdownOpen ? t.borderSubtle : "transparent"}`,
          }}
        >
          <span style={{
            fontFamily: "'Montserrat', sans-serif", fontWeight: 600,
            fontSize: "12px", letterSpacing: "-0.02em", color: t.text,
            lineHeight: "1.2",
          }}>
            {activeFleetName}
          </span>
          <ChevronDown size={12} style={{ color: t.textFaint }} />
        </button>

        {/* Dropdown */}
        <AnimatePresence>
          {fleetDropdownOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => { setFleetDropdownOpen(false); setShowCreateFleet(false); }} />
              <motion.div
                className="absolute top-full left-0 mt-1 z-50 rounded-xl overflow-hidden"
                style={{
                  minWidth: 220,
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
                <div className="p-1">
                  {/* Aggregate: All Fleets */}
                  {fleets.length > 1 && (
                    <>
                      <button
                        onClick={() => { setActiveFleetId(ALL_FLEETS_ID); setFleetDropdownOpen(false); setShowCreateFleet(false); }}
                        className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg cursor-pointer"
                        style={{
                          background: activeFleetId === ALL_FLEETS_ID
                            ? isDark ? `${BRAND.green}08` : `${BRAND.green}04`
                            : "transparent",
                        }}
                      >
                        <div
                          className="w-6 h-6 rounded-md flex items-center justify-center shrink-0"
                          style={{
                            background: activeFleetId === ALL_FLEETS_ID
                              ? `${BRAND.green}12`
                              : isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)",
                          }}
                        >
                          <Layers size={10} style={{ color: activeFleetId === ALL_FLEETS_ID ? BRAND.green : t.textFaint }} />
                        </div>
                        <div className="flex-1 text-left">
                          <span className="block" style={{
                            ...TY.body, fontSize: "11px",
                            color: activeFleetId === ALL_FLEETS_ID ? BRAND.green : t.text,
                            lineHeight: "1.4",
                          }}>
                            All Fleets
                          </span>
                          <span style={{ ...TY.bodyR, fontSize: "9px", color: t.textFaint, lineHeight: "1.5" }}>
                            Aggregate view · {fleets.length} fleets
                          </span>
                        </div>
                        {activeFleetId === ALL_FLEETS_ID && (
                          <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: BRAND.green }} />
                        )}
                      </button>
                      <div className="mx-3 my-1" style={{ borderBottom: `1px solid ${t.borderSubtle}` }} />
                    </>
                  )}
                  {fleets.map((fleet) => (
                    <button
                      key={fleet.id}
                      onClick={() => { setActiveFleetId(fleet.id); setFleetDropdownOpen(false); setShowCreateFleet(false); }}
                      className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg cursor-pointer"
                      style={{
                        background: fleet.id === activeFleetId
                          ? isDark ? `${BRAND.green}08` : `${BRAND.green}04`
                          : "transparent",
                      }}
                    >
                      <div
                        className="w-6 h-6 rounded-md flex items-center justify-center shrink-0"
                        style={{
                          background: fleet.id === activeFleetId
                            ? `${BRAND.green}12`
                            : isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)",
                        }}
                      >
                        <span style={{
                          fontFamily: "'Montserrat', sans-serif", fontWeight: 600,
                          fontSize: "8px", letterSpacing: "-0.02em",
                          color: fleet.id === activeFleetId ? BRAND.green : t.textFaint,
                        }}>
                          {fleet.name.split(" ").pop()?.charAt(0) || "F"}
                        </span>
                      </div>
                      <div className="flex-1 text-left">
                        <span className="block" style={{
                          ...TY.body, fontSize: "11px",
                          color: fleet.id === activeFleetId ? BRAND.green : t.text,
                          lineHeight: "1.4",
                        }}>
                          {fleet.name}
                        </span>
                        <span style={{ ...TY.bodyR, fontSize: "9px", color: t.textFaint, lineHeight: "1.5" }}>
                          {fleet.location}
                        </span>
                      </div>
                      {fleet.id === activeFleetId && (
                        <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: BRAND.green }} />
                      )}
                    </button>
                  ))}
                </div>

                {/* Separator */}
                <div style={{ borderTop: `1px solid ${t.borderSubtle}` }}>
                  <AnimatePresence mode="wait">
                    {!showCreateFleet ? (
                      <motion.div key="add-btn" className="px-1 pb-1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <button
                          className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                          style={{ marginTop: 1 }}
                          onClick={() => setShowCreateFleet(true)}
                        >
                          <Plus size={12} style={{ color: BRAND.green }} />
                          <span style={{ ...TY.body, fontSize: "10px", color: BRAND.green, lineHeight: "1.4", letterSpacing: "-0.02em" }}>
                            Add new fleet
                          </span>
                        </button>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="create-form"
                        className="p-3"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <span style={{ ...TY.body, fontSize: "11px", color: t.text, lineHeight: "1.4", letterSpacing: "-0.02em" }}>
                            New Fleet
                          </span>
                          <button onClick={() => setShowCreateFleet(false)} className="p-0.5 rounded hover:opacity-70">
                            <X size={10} style={{ color: t.textFaint }} />
                          </button>
                        </div>
                        <div className="space-y-2">
                          <input
                            type="text"
                            placeholder="Fleet name"
                            value={newFleetName}
                            onChange={e => setNewFleetName(e.target.value)}
                            className="w-full px-3 py-2 rounded-lg outline-none"
                            style={{
                              background: t.surface,
                              border: `1px solid ${t.borderSubtle}`,
                              ...TY.bodyR, fontSize: "11px", color: t.text, lineHeight: "1.4",
                            }}
                            autoFocus
                            onKeyDown={e => { if (e.key === "Enter") handleCreateFleet(); }}
                          />
                          <div className="flex items-center gap-1.5 px-3 py-2 rounded-lg" style={{ background: t.surface, border: `1px solid ${t.borderSubtle}` }}>
                            <MapPin size={10} style={{ color: t.textFaint }} />
                            <input
                              type="text"
                              placeholder="Location (e.g. Lagos)"
                              value={newFleetLocation}
                              onChange={e => setNewFleetLocation(e.target.value)}
                              className="flex-1 bg-transparent outline-none"
                              style={{ ...TY.bodyR, fontSize: "11px", color: t.text, lineHeight: "1.4" }}
                              onKeyDown={e => { if (e.key === "Enter") handleCreateFleet(); }}
                            />
                          </div>
                          <button
                            onClick={handleCreateFleet}
                            disabled={!newFleetName.trim()}
                            className="w-full py-2 rounded-lg flex items-center justify-center gap-1.5 transition-opacity"
                            style={{
                              background: newFleetName.trim() ? BRAND.green : t.surface,
                              border: `1px solid ${newFleetName.trim() ? BRAND.green : t.borderSubtle}`,
                              opacity: newFleetName.trim() ? 1 : 0.5,
                            }}
                          >
                            <Check size={10} style={{ color: newFleetName.trim() ? "#fff" : t.textFaint }} />
                            <span style={{ ...TY.body, fontSize: "10px", color: newFleetName.trim() ? "#fff" : t.textFaint, lineHeight: "1.4", letterSpacing: "-0.02em" }}>
                              Create fleet
                            </span>
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      <div className="flex-1" />

      {/* Invite link — WIRED */}
      <button
        className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg cursor-pointer transition-colors hover:opacity-80"
        style={{
          border: `1px solid ${t.borderSubtle}`,
          background: "transparent",
        }}
        onClick={copyInviteLink}
      >
        <span style={{ ...TY.bodyR, fontSize: "9px", color: t.textFaint }}>{data.inviteLink}</span>
        <Copy size={10} style={{ color: t.textFaint }} />
      </button>

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

        {/* Notification panel dropdown */}
        <AnimatePresence>
          {notifOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setNotifOpen(false)} />
              <motion.div
                className="absolute top-full right-0 mt-2 z-50 rounded-2xl overflow-hidden"
                style={{
                  width: 360,
                  background: isDark ? "rgba(18,18,20,0.97)" : "rgba(255,255,255,0.98)",
                  border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
                  boxShadow: isDark
                    ? "0 16px 48px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.03)"
                    : "0 16px 48px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.02)",
                  backdropFilter: "blur(20px)",
                }}
                initial={{ opacity: 0, y: -8, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.98 }}
                transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
              >
                <NotificationPanel
                  notifications={MOCK_NOTIFICATIONS}
                  onNavigate={handleNotifNavigate}
                  onClose={() => setNotifOpen(false)}
                />
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      {/* Avatar + User Menu */}
      <div className="relative">
        <button
          onClick={() => setUserMenuOpen(!userMenuOpen)}
          className="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-all duration-150"
          style={{
            background: userMenuOpen
              ? isDark ? `${BRAND.green}08` : `${BRAND.green}06`
              : isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)",
            border: `1px solid ${userMenuOpen
              ? isDark ? `${BRAND.green}18` : `${BRAND.green}14`
              : isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
          }}
          aria-label="User menu"
        >
          <span style={{
            fontFamily: "'Montserrat', sans-serif", fontWeight: 600,
            fontSize: "9px", color: userMenuOpen ? BRAND.green : t.textMuted, letterSpacing: "-0.02em",
          }}>CO</span>
        </button>

        {/* User Menu Dropdown */}
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
                {/* User info */}
                <div className="px-3 py-3" style={{ borderBottom: `1px solid ${t.borderSubtle}` }}>
                  <span className="block" style={{ ...TY.body, fontSize: "12px", color: t.text, lineHeight: "1.4", letterSpacing: "-0.02em" }}>
                    {data.ownerName}
                  </span>
                  <span style={{ ...TY.bodyR, fontSize: "10px", color: t.textMuted, lineHeight: "1.5" }}>
                    {data.email}
                  </span>
                </div>

                {/* Menu items */}
                <div className="p-1">
                  <button
                    onClick={() => { setUserMenuOpen(false); setActiveNav("settings"); }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg cursor-pointer hover:opacity-80"
                    style={{ background: "transparent" }}
                  >
                    <User size={12} style={{ color: t.textMuted }} />
                    <span style={{ ...TY.bodyR, fontSize: "11px", color: t.textSecondary, lineHeight: "1.4" }}>
                      Account settings
                    </span>
                  </button>
                </div>

                {/* Logout — destructive */}
                <div className="p-1" style={{ borderTop: `1px solid ${t.borderSubtle}` }}>
                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      setToastMsg({ msg: "Signed out — redirecting to login", type: "info" });
                      setTimeout(() => navigate("/fleet/login"), 1200);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg cursor-pointer hover:opacity-80"
                    style={{ background: "transparent" }}
                  >
                    <LogOut size={12} style={{ color: STATUS.error }} />
                    <span style={{ ...TY.body, fontSize: "11px", color: STATUS.error, lineHeight: "1.4", letterSpacing: "-0.02em" }}>
                      Sign out
                    </span>
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      {/* Toast */}
      <AnimatePresence>
        {toastMsg && <Toast message={toastMsg.msg} type={toastMsg.type} onDismiss={() => setToastMsg(null)} />}
      </AnimatePresence>
    </div>
  );
}


// ─── Demo State Toggle ──────────────────────────────────────────────────────

function JourneyToggle() {
  const { journeyState, setJourneyState } = useFleetContext();
  const { t, theme } = useAdminTheme();
  const isDark = theme === "dark";

  const states: { id: FleetJourneyState; label: string }[] = [
    { id: "onboarding", label: "Onboarding" },
    { id: "empty", label: "Empty" },
    { id: "active", label: "Active" },
  ];

  return (
    <div
      className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-0.5 p-1 rounded-2xl"
      style={{
        background: isDark ? "rgba(12,12,14,0.9)" : "rgba(255,255,255,0.9)",
        border: `1px solid ${t.borderStrong}`,
        backdropFilter: "blur(20px)",
        boxShadow: isDark ? "0 8px 40px rgba(0,0,0,0.5)" : "0 8px 40px rgba(0,0,0,0.1)",
      }}
    >
      <div className="px-2.5 flex items-center gap-1.5">
        <StatusDot color={STATUS.warning} size={6} pulse />
        <span style={{
          fontFamily: "'Montserrat', sans-serif", fontWeight: 600,
          fontSize: "8px", letterSpacing: "0.06em", color: t.textMuted, lineHeight: "1.2",
        }}>JOURNEY</span>
      </div>
      {states.map((s) => {
        const isActive = journeyState === s.id;
        return (
          <button
            key={s.id}
            onClick={() => setJourneyState(s.id)}
            className="px-3 py-1.5 rounded-xl transition-all duration-200 cursor-pointer"
            style={{
              background: isActive
                ? `linear-gradient(135deg, ${BRAND.green}14 0%, ${BRAND.green}06 100%)`
                : "transparent",
              border: isActive ? `1px solid ${BRAND.green}18` : "1px solid transparent",
              minHeight: 28,
            }}
          >
            <span style={{
              fontFamily: "'Montserrat', sans-serif", fontWeight: isActive ? 600 : 500,
              fontSize: "10px", letterSpacing: "-0.02em",
              color: isActive ? BRAND.green : t.textFaint, lineHeight: "1.2",
            }}>
              {s.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}


// ─── Atmospheric Background ─────────────────────────────────────────────────

function AtmosphericBg() {
  return (
    <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }}>
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2"
        style={{ width: "80%", height: "40%", background: `radial-gradient(ellipse at center, ${BRAND.green}06 0%, transparent 70%)` }}
      />
      <div
        className="absolute top-0 right-0"
        style={{ width: "50%", height: "50%", background: `radial-gradient(ellipse at top right, ${STATUS.info}04 0%, transparent 70%)` }}
      />
    </div>
  );
}


// ══════════════════════════════════════════════════════════════════════════
// MAIN SHELL
// ═══════════════════════════════════════════════════════════════════════════

function FleetShellInner() {
  const { t } = useAdminTheme();
  const [journeyState, setJourneyState] = useState<FleetJourneyState>("active");
  const [activeNav, setActiveNav] = useState<FleetNavId>("dashboard");
  const [deepLink, setDeepLink] = useState<FleetDeepLink | null>(null);
  const [activeFleetId, setActiveFleetId] = useState("lagos");
  const [fleets, setFleets] = useState<FleetWorkspace[]>(MOCK_FLEETS);

  const navigateTo = useCallback((nav: FleetNavId, deepLink?: FleetDeepLink) => {
    setActiveNav(nav);
    if (deepLink) {
      setDeepLink(deepLink);
    }
  }, []);

  const consumeDeepLink = useCallback(() => {
    setDeepLink(null);
  }, []);

  const addFleet = useCallback((name: string, location: string) => {
    const newFleet: FleetWorkspace = {
      id: `fleet-${Date.now()}`,
      name,
      location,
    };
    setFleets(prev => [...prev, newFleet]);
    setActiveFleetId(newFleet.id);
  }, []);
  
  // Onboarding is full-screen, no shell
  if (journeyState === "onboarding") {
    return (
      <FleetContext.Provider value={{ journeyState, setJourneyState, activeNav, setActiveNav, deepLink, navigateTo, consumeDeepLink, activeFleetId, setActiveFleetId, fleets, addFleet }}>
        <div className="w-full h-screen overflow-hidden" style={{ background: t.bg }}>
          <AtmosphericBg />
          <div className="relative h-full" style={{ zIndex: 1 }}>
            <FleetOnboarding onComplete={() => setJourneyState("empty")} />
          </div>
          <JourneyToggle />
        </div>
      </FleetContext.Provider>
    );
  }

  // Shell with nav for empty + active states
  return (
    <FleetContext.Provider value={{ journeyState, setJourneyState, activeNav, setActiveNav, deepLink, navigateTo, consumeDeepLink, activeFleetId, setActiveFleetId, fleets, addFleet }}>
      <div className="w-full h-screen flex flex-col overflow-hidden" style={{ background: t.bg }}>
        <AtmosphericBg />
        <div className="relative flex flex-1 min-h-0" style={{ zIndex: 1 }}>

          {/* Nav Rail (desktop) */}
          <FleetNavRail active={activeNav} onChange={setActiveNav} />

          {/* Main content */}
          <div className="flex-1 flex flex-col min-w-0 min-h-0">
            <FleetTopBar />
            <div className="flex-1 overflow-hidden">
              <AnimatePresence mode="wait">
                {activeNav === "dashboard" && (
                  <motion.div
                    key={`dash-${journeyState}`}
                    className="h-full"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {journeyState === "empty" ? <FleetEmpty /> : <VariationE />}
                  </motion.div>
                )}
                {activeNav === "drivers" && (
                  <motion.div key="drivers" className="h-full" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <FleetDrivers />
                  </motion.div>
                )}
                {activeNav === "vehicles" && (
                  <motion.div key="vehicles" className="h-full" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <FleetVehicles />
                  </motion.div>
                )}
                {activeNav === "earnings" && (
                  <motion.div key="earnings" className="h-full" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <FleetEarnings />
                  </motion.div>
                )}
                {activeNav === "settings" && (
                  <motion.div key="settings" className="h-full" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <FleetSettings />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile bottom tabs */}
            <FleetBottomTabs active={activeNav} onChange={setActiveNav} />
          </div>
        </div>

        <JourneyToggle />
      </div>
    </FleetContext.Provider>
  );
}

export function FleetShell() {
  return (
    <AdminThemeProvider>
      <FleetShellInner />
    </AdminThemeProvider>
  );
}