/**
 * JET ADMIN — NAVIGATION RAIL
 *
 * Linear-style expandable sidebar.
 * Collapsed: 56px icon rail
 * Expanded: 220px with labels (hover or pinned)
 *
 * No border on active state — just tinted bg + green icon.
 */

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Activity, Users, Navigation, MapPin, Scale, Car,
  Wallet, BarChart3, Settings, ChevronLeft, Pin,
  Shield, MessageSquare, Megaphone, Globe2, FileText,
  LogOut,
} from "lucide-react";
import { useAdminTheme, TY, BRAND, STATUS } from "../../../config/admin-theme";

export interface NavItem {
  id: string;
  Icon: React.ComponentType<{ size?: number; style?: React.CSSProperties }>;
  label: string;
  badge?: number;
  section?: string;
}

export const NAV_ITEMS: NavItem[] = [
  // Operations
  { id: "command", Icon: Activity, label: "Command Center", section: "OPERATIONS" },
  { id: "rides", Icon: MapPin, label: "Rides", section: "OPERATIONS" },
  { id: "disputes", Icon: Scale, label: "Disputes", badge: 12, section: "OPERATIONS" },
  { id: "support", Icon: MessageSquare, label: "Support", badge: 3, section: "OPERATIONS" },
  // People
  { id: "riders", Icon: Navigation, label: "Riders", section: "PEOPLE" },
  { id: "drivers", Icon: Users, label: "Drivers", badge: 23, section: "PEOPLE" },
  // Partners
  { id: "hotels", Icon: Globe2, label: "Hotels", section: "PARTNERS" },
  { id: "fleet", Icon: Car, label: "Fleet", section: "PARTNERS" },
  // Business
  { id: "finance", Icon: Wallet, label: "Finance", section: "BUSINESS" },
  { id: "analytics", Icon: BarChart3, label: "Analytics", section: "BUSINESS" },
  // System
  { id: "comms", Icon: Megaphone, label: "Communications", section: "SYSTEM" },
  { id: "settings", Icon: Settings, label: "Settings", section: "SYSTEM" },
];

interface NavRailProps {
  activeNav: string;
  onNavChange: (id: string) => void;
  onLogout?: () => void;
}

export function NavRail({ activeNav, onNavChange, onLogout }: NavRailProps) {
  const { t } = useAdminTheme();
  const [expanded, setExpanded] = useState(false);
  const [pinned, setPinned] = useState(false);

  const handleMouseEnter = useCallback(() => {
    if (!pinned) setExpanded(true);
  }, [pinned]);

  const handleMouseLeave = useCallback(() => {
    if (!pinned) setExpanded(false);
  }, [pinned]);

  const togglePin = useCallback(() => {
    setPinned(p => {
      if (p) setExpanded(false);
      else setExpanded(true);
      return !p;
    });
  }, []);

  const sections = ["OPERATIONS", "PEOPLE", "PARTNERS", "BUSINESS", "SYSTEM"];

  return (
    <motion.nav
      className="hidden md:flex flex-col h-full shrink-0 relative z-20"
      style={{
        background: t.overlay,
        borderRight: `1px solid ${t.border}`,
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      animate={{ width: expanded ? 220 : 56 }}
      transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
      initial={false}
    >
      {/* ─── Header: Logo + Pin ─── */}
      <div className="flex items-center h-14 px-3 shrink-0" style={{ borderBottom: `1px solid ${t.border}` }}>
        <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style={{ background: t.greenBg }}>
          <span style={{ ...TY.h, fontSize: "12px", color: BRAND.green }}>J</span>
        </div>
        <AnimatePresence>
          {expanded && (
            <motion.div
              className="flex items-center justify-between flex-1 ml-3 overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <span style={{ ...TY.h, fontSize: "14px", color: t.text, whiteSpace: "nowrap" }}>JET Admin</span>
              <button
                onClick={togglePin}
                className="w-6 h-6 rounded-md flex items-center justify-center shrink-0 transition-colors"
                style={{ background: pinned ? t.greenBg : "transparent" }}
                onMouseEnter={e => { if (!pinned) e.currentTarget.style.background = t.surfaceHover; }}
                onMouseLeave={e => { if (!pinned) e.currentTarget.style.background = "transparent"; }}
                title={pinned ? "Unpin sidebar" : "Pin sidebar"}
              >
                {pinned ? (
                  <Pin size={12} style={{ color: BRAND.green, transform: "rotate(45deg)" }} />
                ) : (
                  <ChevronLeft size={12} style={{ color: t.iconMuted, transform: "rotate(180deg)" }} />
                )}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ─── Nav items ─── */}
      <div className="flex-1 overflow-y-auto scrollbar-hide py-2 px-2">
        {sections.map((section, si) => {
          const items = NAV_ITEMS.filter(n => n.section === section);
          return (
            <div key={section}>
              {/* Section divider */}
              {si > 0 && <div className="h-px mx-1 my-2" style={{ background: t.borderSubtle }} />}

              {/* Section label (only when expanded) */}
              <AnimatePresence>
                {expanded && (
                  <motion.span
                    className="block px-2 mb-1"
                    style={{ ...TY.label, fontSize: "8px", color: t.textGhost, whiteSpace: "nowrap" }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.1 }}
                  >
                    {section}
                  </motion.span>
                )}
              </AnimatePresence>

              {items.map((item) => {
                const isActive = item.id === activeNav;
                return (
                  <button
                    key={item.id}
                    onClick={() => onNavChange(item.id)}
                    className="relative w-full rounded-xl flex items-center gap-3 transition-colors mb-0.5"
                    style={{
                      height: 40,
                      paddingLeft: expanded ? 10 : 0,
                      justifyContent: expanded ? "flex-start" : "center",
                      background: isActive ? t.greenBg : "transparent",
                    }}
                    title={expanded ? undefined : item.label}
                    onMouseEnter={e => {
                      if (!isActive) e.currentTarget.style.background = t.surfaceHover;
                    }}
                    onMouseLeave={e => {
                      if (!isActive) e.currentTarget.style.background = "transparent";
                    }}
                  >
                    <item.Icon
                      size={16}
                      style={{ color: isActive ? BRAND.green : t.iconSecondary, flexShrink: 0 }}
                    />

                    {/* Label (only when expanded) */}
                    <AnimatePresence>
                      {expanded && (
                        <motion.span
                          className="flex-1 text-left truncate"
                          style={{
                            ...TY.body,
                            fontSize: "13px",
                            color: isActive ? BRAND.green : t.textSecondary,
                            whiteSpace: "nowrap",
                          }}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.1 }}
                        >
                          {item.label}
                        </motion.span>
                      )}
                    </AnimatePresence>

                    {/* Badge */}
                    {item.badge && (
                      <span
                        className={`${expanded ? "mr-2" : "absolute -top-0.5 -right-0.5"} min-w-[18px] h-[18px] rounded-full flex items-center justify-center shrink-0`}
                        style={{
                          ...TY.cap,
                          fontSize: expanded ? "10px" : "8px",
                          color: "#fff",
                          background: (item.id === "disputes" || item.id === "support") ? STATUS.error : BRAND.green,
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

      {/* ─── Footer: collapsed status ─── */}
      <div className="px-2 pb-3 shrink-0 space-y-1.5">
        {/* Logout button */}
        {onLogout && (
          <button
            onClick={onLogout}
            className="w-full rounded-xl flex items-center gap-3 transition-colors"
            style={{
              height: 36,
              paddingLeft: expanded ? 10 : 0,
              justifyContent: expanded ? "flex-start" : "center",
              background: "transparent",
            }}
            title={expanded ? undefined : "Sign out"}
            onMouseEnter={e => { e.currentTarget.style.background = t.surfaceHover; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
          >
            <LogOut size={14} style={{ color: STATUS.error, flexShrink: 0 }} />
            <AnimatePresence>
              {expanded && (
                <motion.span
                  style={{
                    ...TY.body,
                    fontSize: "12px",
                    color: STATUS.error,
                    whiteSpace: "nowrap",
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.1 }}
                >
                  Sign out
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        )}
        <div
          className="rounded-xl flex items-center justify-center gap-2 py-2.5 px-2"
          style={{ background: t.surface }}
        >
          <div className="w-2 h-2 rounded-full shrink-0" style={{ background: BRAND.green }}>
            <div className="w-2 h-2 rounded-full animate-ping" style={{ background: BRAND.green, opacity: 0.3 }} />
          </div>
          <AnimatePresence>
            {expanded && (
              <motion.span
                style={{ ...TY.cap, fontSize: "10px", color: t.textMuted, whiteSpace: "nowrap" }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.1 }}
              >
                System operational
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.nav>
  );
}