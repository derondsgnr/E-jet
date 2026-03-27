/**
 * FLEET — NOTIFICATION PANEL (content only)
 *
 * Linear/Vercel-style dropdown content for the Bell icon.
 * Parent handles positioning, animation, and open/close.
 *
 * Source: notification_events table
 *
 * Affordances:
 *   - Click notification → navigate + mark read
 *   - "Mark all read" button
 *   - Category filter pills
 *   - Empty state for "no notifications"
 */

import { useState, useCallback } from "react";
import { motion } from "motion/react";
import {
  Wallet, Users, Car, Settings2,
  CheckCheck, BellOff,
} from "lucide-react";
import { useAdminTheme, BRAND, TY, STATUS } from "../../config/admin-theme";
import {
  type FleetNotification,
  type NotifCategory,
} from "../../config/fleet-mock-data";
import { StatusDot } from "./driver-card";

// ─── Category config ────────────────────────────────────────────────────────

const CATEGORY_META: Record<NotifCategory, { icon: typeof Wallet; color: string; label: string }> = {
  earnings: { icon: Wallet, color: BRAND.green, label: "Earnings" },
  drivers:  { icon: Users,  color: STATUS.info, label: "Drivers" },
  vehicles: { icon: Car,    color: STATUS.warning, label: "Vehicles" },
  system:   { icon: Settings2, color: "#8B8B8D", label: "System" },
};

type FilterId = "all" | NotifCategory;

// ─── Component ──────────────────────────────────────────────────────────────

export function NotificationPanel({
  notifications: initialNotifs,
  onClose,
  onNavigate,
}: {
  notifications: FleetNotification[];
  onClose: () => void;
  /** Called when a notification is clicked — parent wires navigateTo */
  onNavigate: (nav: string, opts?: { tab?: string; entityId?: string }) => void;
}) {
  const { t, theme } = useAdminTheme();
  const isDark = theme === "dark";

  // Local state for read/unread (would be server-synced in production)
  const [notifications, setNotifications] = useState<FleetNotification[]>(initialNotifs);
  const [filter, setFilter] = useState<FilterId>("all");

  const unreadCount = notifications.filter(n => !n.read).length;

  // Mark single as read + navigate
  const handleClick = useCallback((notif: FleetNotification) => {
    setNotifications(prev =>
      prev.map(n => n.id === notif.id ? { ...n, read: true } : n)
    );
    if (notif.action) {
      onNavigate(notif.action.nav, {
        tab: notif.action.tab,
        entityId: notif.action.entityId,
      });
    }
    onClose();
  }, [onNavigate, onClose]);

  // Mark all read
  const markAllRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  // Filtered list
  const filtered = filter === "all"
    ? notifications
    : notifications.filter(n => n.category === filter);

  return (
    <div className="flex flex-col" style={{ maxHeight: 480 }}>
      {/* ── Header ──────────────────────────────────────────────── */}
      <div
        className="flex items-center justify-between px-4 py-3 shrink-0"
        style={{
          borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)"}`,
        }}
      >
        <div className="flex items-center gap-2">
          <span style={{
            fontFamily: "'Montserrat', sans-serif", fontWeight: 600,
            fontSize: "13px", letterSpacing: "-0.03em", color: t.text, lineHeight: "1.2",
          }}>
            Notifications
          </span>
          {unreadCount > 0 && (
            <span
              className="px-1.5 py-0.5 rounded-md"
              style={{
                ...TY.body,
                fontSize: "9px",
                background: `${BRAND.green}12`,
                color: BRAND.green,
                lineHeight: "1.2",
                letterSpacing: "-0.02em",
              }}
            >
              {unreadCount} new
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className="flex items-center gap-1 cursor-pointer px-2 py-1 rounded-lg"
            style={{
              background: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)",
            }}
          >
            <CheckCheck size={10} style={{ color: t.textMuted }} />
            <span style={{ ...TY.bodyR, fontSize: "9px", color: t.textMuted, lineHeight: "1.4" }}>
              Mark all read
            </span>
          </button>
        )}
      </div>

      {/* ── Category filter pills ───────────────────────────────── */}
      <div
        className="flex items-center gap-1 px-4 py-2 shrink-0 overflow-x-auto"
        style={{
          borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)"}`,
        }}
      >
        {(["all", "earnings", "drivers", "vehicles", "system"] as FilterId[]).map(f => {
          const active = filter === f;
          const count = f === "all"
            ? notifications.length
            : notifications.filter(n => n.category === f).length;
          return (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className="px-2 py-1 rounded-lg cursor-pointer transition-colors duration-150 whitespace-nowrap"
              style={{
                background: active
                  ? (isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)")
                  : "transparent",
                ...TY.bodyR,
                fontSize: "9px",
                color: active ? t.text : t.textFaint,
                lineHeight: "1.4",
              }}
            >
              {f === "all" ? "All" : CATEGORY_META[f].label}
              <span style={{ opacity: 0.5 }}> {count}</span>
            </button>
          );
        })}
      </div>

      {/* ── Notification list ────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto">
        {filtered.length === 0 ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center py-12 px-4">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
              style={{
                background: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)",
                border: `1px solid ${isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)"}`,
              }}
            >
              <BellOff size={16} style={{ color: t.textFaint }} />
            </div>
            <span style={{ ...TY.body, fontSize: "11px", color: t.textMuted, lineHeight: "1.4" }}>
              No {filter !== "all" ? CATEGORY_META[filter as NotifCategory].label.toLowerCase() + " " : ""}notifications
            </span>
            <span style={{ ...TY.bodyR, fontSize: "9px", color: t.textFaint, lineHeight: "1.5", marginTop: 2 }}>
              You're all caught up
            </span>
          </div>
        ) : (
          filtered.map((notif, i) => {
            const cat = CATEGORY_META[notif.category];
            const Icon = cat.icon;
            return (
              <motion.button
                key={notif.id}
                onClick={() => handleClick(notif)}
                className="w-full flex items-start gap-3 px-4 py-3 cursor-pointer text-left"
                style={{
                  borderBottom: i < filtered.length - 1
                    ? `1px solid ${isDark ? "rgba(255,255,255,0.025)" : "rgba(0,0,0,0.025)"}`
                    : "none",
                  background: !notif.read
                    ? (isDark ? "rgba(255,255,255,0.015)" : "rgba(0,0,0,0.008)")
                    : "transparent",
                }}
                whileHover={{
                  backgroundColor: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.015)",
                }}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.02, duration: 0.2 }}
              >
                {/* Category icon */}
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                  style={{
                    background: `${cat.color}08`,
                    border: `1px solid ${cat.color}12`,
                  }}
                >
                  <Icon size={12} style={{ color: cat.color }} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span
                      className="truncate"
                      style={{
                        ...TY.body,
                        fontSize: "11px",
                        color: t.text,
                        lineHeight: "1.4",
                        letterSpacing: "-0.02em",
                      }}
                    >
                      {notif.title}
                    </span>
                    <span className="shrink-0" style={{
                      ...TY.bodyR,
                      fontSize: "9px",
                      color: t.textFaint,
                      lineHeight: "1.4",
                    }}>
                      {notif.timestamp}
                    </span>
                  </div>
                  <span
                    className="block"
                    style={{
                      ...TY.bodyR,
                      fontSize: "10px",
                      color: t.textMuted,
                      lineHeight: "1.5",
                    }}
                  >
                    {notif.body}
                  </span>
                </div>

                {/* Unread dot */}
                {!notif.read && (
                  <div className="shrink-0 mt-2">
                    <StatusDot color={BRAND.green} size={6} />
                  </div>
                )}
              </motion.button>
            );
          })
        )}
      </div>

      {/* ── Footer ──────────────────────────────────────────────── */}
      <div
        className="px-4 py-2.5 flex items-center justify-center shrink-0"
        style={{
          borderTop: `1px solid ${isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)"}`,
          background: isDark ? "rgba(255,255,255,0.01)" : "rgba(0,0,0,0.01)",
        }}
      >
        <span style={{ ...TY.bodyR, fontSize: "9px", color: t.textFaint, lineHeight: "1.4" }}>
          {notifications.filter(n => !n.read).length === 0
            ? "All caught up"
            : `${notifications.filter(n => !n.read).length} unread`
          }
          {" "}&middot; {notifications.length} total
        </span>
      </div>
    </div>
  );
}
