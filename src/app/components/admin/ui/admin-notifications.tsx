/**
 * JET ADMIN — NOTIFICATIONS DRAWER
 *
 * System alerts, action items, and activity notifications.
 * Grouped by: Urgent · Today · Earlier
 */

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Bell, AlertTriangle, CheckCircle2, Clock, XCircle,
  MessageSquare, Users, Car, Globe2, Wallet, MapPin,
  ChevronRight, X, Check,
} from "lucide-react";
import { useAdminTheme, TY, BRAND, STATUS } from "../../../config/admin-theme";

interface Notification {
  id: string;
  type: "alert" | "action" | "info" | "success";
  title: string;
  body: string;
  time: string;
  group: "urgent" | "today" | "earlier";
  read: boolean;
  route?: string;
  icon: React.ComponentType<{ size?: number; style?: React.CSSProperties }>;
  color: string;
}

const NOTIFICATIONS: Notification[] = [
  { id: "n-1", type: "alert", title: "Payment gateway degraded", body: "Paystack reporting 12% failure rate — auto-retry active", time: "4m ago", group: "urgent", read: false, route: "/admin/finance", icon: AlertTriangle, color: STATUS.error },
  { id: "n-2", type: "action", title: "₦2.8M payout batch pending", body: "412 drivers · Settlement window closes in 4h", time: "2h ago", group: "urgent", read: false, route: "/admin/finance", icon: Wallet, color: STATUS.warning },
  { id: "n-3", type: "action", title: "23 drivers pending document review", body: "Oldest application: 3 days ago", time: "3h ago", group: "today", read: false, route: "/admin/drivers", icon: Users, color: STATUS.info },
  { id: "n-4", type: "info", title: "Eko Hotels invoice overdue", body: "₦2.84M · 7 days past due", time: "1h ago", group: "today", read: false, route: "/admin/hotels", icon: Globe2, color: STATUS.warning },
  { id: "n-5", type: "info", title: "GreenRide Lagos — 8 vehicles expired insurance", body: "Vehicles auto-suspended", time: "2h ago", group: "today", read: true, route: "/admin/fleet", icon: Car, color: STATUS.error },
  { id: "n-6", type: "success", title: "Daily analytics report generated", body: "March 16 report ready for download", time: "6h ago", group: "today", read: true, route: "/admin/analytics", icon: CheckCircle2, color: BRAND.green },
  { id: "n-7", type: "info", title: "New dispute: route deviation", body: "Rider: Chidi E. · Trip #JT-47982", time: "1h ago", group: "today", read: true, route: "/admin/disputes", icon: MapPin, color: STATUS.warning },
  { id: "n-8", type: "success", title: "Fatima B. verification approved", body: "Driver is now active and can accept rides", time: "5h ago", group: "earlier", read: true, route: "/admin/drivers", icon: Users, color: BRAND.green },
  { id: "n-9", type: "success", title: "Metro Express payout processed", body: "₦980K settled to First Bank ****7733", time: "Yesterday", group: "earlier", read: true, route: "/admin/finance", icon: Wallet, color: BRAND.green },
  { id: "n-10", type: "info", title: "Broadcast sent: Weekend promo", body: "Delivered to 12,400 riders", time: "Yesterday", group: "earlier", read: true, route: "/admin/comms", icon: MessageSquare, color: STATUS.info },
];

interface NotificationsDrawerProps {
  open: boolean;
  onClose: () => void;
  onNavigate: (route: string) => void;
}

export function NotificationsDrawer({ open, onClose, onNavigate }: NotificationsDrawerProps) {
  const { t, theme } = useAdminTheme();
  const isDark = theme === "dark";
  const [items, setItems] = useState(NOTIFICATIONS);

  const unreadCount = items.filter(n => !n.read).length;

  const markAllRead = () => setItems(prev => prev.map(n => ({ ...n, read: true })));
  const markRead = (id: string) => setItems(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));

  const groups = [
    { key: "urgent", label: "URGENT", items: items.filter(n => n.group === "urgent") },
    { key: "today", label: "TODAY", items: items.filter(n => n.group === "today") },
    { key: "earlier", label: "EARLIER", items: items.filter(n => n.group === "earlier") },
  ].filter(g => g.items.length > 0);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[150] flex">
          <motion.div
            className="absolute inset-0"
            style={{ background: isDark ? "rgba(0,0,0,0.35)" : "rgba(0,0,0,0.12)" }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="absolute top-0 right-0 bottom-0 flex flex-col"
            style={{
              width: 400,
              maxWidth: "calc(100vw - 56px)",
              background: t.overlay,
              borderLeft: `1px solid ${t.border}`,
              boxShadow: isDark ? "0 0 40px rgba(0,0,0,0.5)" : "0 0 40px rgba(0,0,0,0.08)",
            }}
            initial={{ x: 400, opacity: 0.5 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 shrink-0" style={{ height: 56, borderBottom: `1px solid ${t.borderSubtle}` }}>
              <div className="flex items-center gap-2">
                <span style={{ ...TY.sub, fontSize: "13px", color: t.text }}>Notifications</span>
                {unreadCount > 0 && (
                  <span className="min-w-[18px] h-[18px] rounded-full flex items-center justify-center" style={{ background: STATUS.error, ...TY.cap, fontSize: "9px", color: "#fff" }}>{unreadCount}</span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button onClick={markAllRead} className="h-7 px-2.5 rounded-lg flex items-center gap-1" style={{ background: t.surfaceHover, ...TY.body, fontSize: "10px", color: t.textMuted }}>
                    <Check size={11} /> Mark all read
                  </button>
                )}
                <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: t.surfaceHover }}>
                  <X size={14} style={{ color: t.iconSecondary }} />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              {groups.map((group, gi) => (
                <div key={group.key}>
                  <div className="px-5 pt-4 pb-2">
                    <span style={{ ...TY.label, fontSize: "9px", color: group.key === "urgent" ? STATUS.error : t.textFaint, letterSpacing: "0.06em" }}>{group.label}</span>
                  </div>
                  {group.items.map((notif, i) => (
                    <motion.button
                      key={notif.id}
                      onClick={() => {
                        markRead(notif.id);
                        if (notif.route) { onNavigate(notif.route); onClose(); }
                      }}
                      className="w-full flex items-start gap-3 px-5 py-3 text-left transition-colors group"
                      style={{ background: !notif.read ? (isDark ? "rgba(29,185,84,0.03)" : "rgba(29,185,84,0.02)") : "transparent" }}
                      initial={{ opacity: 0, x: 8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: gi * 0.05 + i * 0.03 }}
                      whileHover={{ backgroundColor: t.surfaceHover }}
                    >
                      <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5" style={{ background: `${notif.color}12` }}>
                        <notif.icon size={14} style={{ color: notif.color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          {!notif.read && <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: BRAND.green }} />}
                          <span className="truncate" style={{ ...TY.body, fontSize: "12px", color: t.text }}>{notif.title}</span>
                        </div>
                        <span className="block" style={{ ...TY.bodyR, fontSize: "11px", color: t.textMuted, lineHeight: "1.4" }}>{notif.body}</span>
                        <span className="block mt-1" style={{ ...TY.bodyR, fontSize: "10px", color: t.textFaint }}>{notif.time}</span>
                      </div>
                      <ChevronRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity mt-1" style={{ color: t.textMuted }} />
                    </motion.button>
                  ))}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
