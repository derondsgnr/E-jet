/**
 * JET ADMIN — SETTINGS (Full E2E)
 * Route: /admin/settings
 *
 * Platform configuration, admin user management, compliance, integrations.
 * Pattern: Vercel project settings + Linear workspace settings.
 *
 * Flows wired:
 *   Admin Users: Add User modal, User detail drawer (edit role, deactivate, reset pw)
 *   Pricing: Edit setting modal (reusable)
 *   Notifications: Template editor drawer
 *   Integrations: Config modal (test connection, update keys)
 *   General: Edit setting modal (reusable)
 *   Compliance: Read-only (audit trail)
 */

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Settings, Shield, Users, CreditCard, Bell, Key,
  FileText, Globe2, Smartphone, Mail, Clock, ChevronRight,
  CheckCircle2, XCircle, AlertTriangle, Eye, EyeOff,
  Plus, Edit3, Trash2, Lock, Unlock, BarChart3,
  Zap, Building2, Truck, Car, X, Save, RotateCcw,
  Send, RefreshCw, Power, UserMinus, UserPlus,
} from "lucide-react";
import { useAdminTheme, TY, BRAND, STATUS } from "../config/admin-theme";
import { AdminPageShell } from "../components/admin/ui/admin-page-shell";

/* ─── Types ─── */
type SettingsSection = "admin_users" | "pricing" | "notifications" | "integrations" | "compliance" | "general";

const SECTIONS: { key: SettingsSection; label: string; icon: typeof Settings; desc: string }[] = [
  { key: "general", label: "General", icon: Settings, desc: "Platform name, timezone, defaults" },
  { key: "admin_users", label: "Admin Users", icon: Shield, desc: "Roles, permissions, access control" },
  { key: "pricing", label: "Pricing", icon: CreditCard, desc: "Fares, surge, commission rates" },
  { key: "notifications", label: "Notifications", icon: Bell, desc: "Templates, channels, preferences" },
  { key: "integrations", label: "Integrations", icon: Key, desc: "Paystack, SMS, Maps, webhooks" },
  { key: "compliance", label: "Compliance", icon: FileText, desc: "Data retention, audit trail, legal" },
];

const ROLES = ["Super Admin", "Operations", "Finance", "Partnerships", "Marketing", "Compliance", "Customer Support"];

/* ─── Mock Data ─── */
interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "active" | "inactive";
  lastLogin: string;
  actions: number;
}

const MOCK_ADMIN_USERS: AdminUser[] = [
  { id: "AU-001", name: "Obiora Nkem", email: "obiora@jet.ng", role: "Super Admin", status: "active", lastLogin: "2h ago", actions: 342 },
  { id: "AU-002", name: "Adaeze Okafor", email: "adaeze@jet.ng", role: "Operations", status: "active", lastLogin: "30m ago", actions: 1_204 },
  { id: "AU-003", name: "Tunde Bakare", email: "tunde@jet.ng", role: "Operations", status: "active", lastLogin: "1h ago", actions: 892 },
  { id: "AU-004", name: "Kemi Adebisi", email: "kemi@jet.ng", role: "Finance", status: "active", lastLogin: "4h ago", actions: 456 },
  { id: "AU-005", name: "Yemi Ogundimu", email: "yemi@jet.ng", role: "Partnerships", status: "active", lastLogin: "1d ago", actions: 234 },
  { id: "AU-006", name: "Chisom Eze", email: "chisom@jet.ng", role: "Marketing", status: "active", lastLogin: "3h ago", actions: 178 },
  { id: "AU-007", name: "Fatima Bello", email: "fatima@jet.ng", role: "Compliance", status: "active", lastLogin: "6h ago", actions: 89 },
  { id: "AU-008", name: "David Obi", email: "david@jet.ng", role: "Customer Support", status: "inactive", lastLogin: "2w ago", actions: 567 },
];

const ROLE_COLORS: Record<string, string> = {
  "Super Admin": STATUS.error,
  "Operations": STATUS.info,
  "Finance": STATUS.warning,
  "Partnerships": "#8B5CF6",
  "Marketing": BRAND.green,
  "Compliance": "#F97316",
  "Customer Support": "#737373",
};

interface Integration {
  id: string;
  name: string;
  desc: string;
  status: "connected" | "error" | "not_configured";
  icon: typeof Key;
  lastCheck: string;
  apiKey?: string;
  webhook?: string;
}

const INTEGRATIONS: Integration[] = [
  { id: "int-1", name: "Paystack", desc: "Payment processing", status: "connected", icon: CreditCard, lastCheck: "2m ago", apiKey: "sk_live_****...a8f2", webhook: "https://api.jet.ng/hooks/paystack" },
  { id: "int-2", name: "Termii", desc: "SMS gateway", status: "connected", icon: Smartphone, lastCheck: "5m ago", apiKey: "TRM_****...b3c1" },
  { id: "int-3", name: "Google Maps", desc: "Maps & routing", status: "connected", icon: Globe2, lastCheck: "1m ago", apiKey: "AIza****...Qx9w" },
  { id: "int-4", name: "SendGrid", desc: "Email delivery", status: "error", icon: Mail, lastCheck: "Failed 2h ago", apiKey: "SG.****...expired" },
  { id: "int-5", name: "Firebase", desc: "Push notifications", status: "connected", icon: Bell, lastCheck: "30s ago", apiKey: "AAAA****...f7e2" },
  { id: "int-6", name: "Cloudinary", desc: "Image storage", status: "not_configured", icon: Eye, lastCheck: "—" },
];

const AUDIT_LOG = [
  { time: "14:32", user: "Adaeze O.", action: "Resolved dispute #D-2847", surface: "Disputes" },
  { time: "14:28", user: "Kemi A.", action: "Approved payout batch ₦2.8M", surface: "Finance" },
  { time: "14:15", user: "Tunde B.", action: "Suspended driver DRV-0923", surface: "Drivers" },
  { time: "13:58", user: "Obiora N.", action: "Updated surge multiplier to 1.8x", surface: "Settings" },
  { time: "13:42", user: "Yemi O.", action: "Onboarded hotel partner — Radisson Blu", surface: "Hotels" },
  { time: "13:30", user: "Chisom E.", action: "Sent broadcast to 18k riders", surface: "Comms" },
  { time: "13:12", user: "Fatima B.", action: "Approved driver verification DRV-1204", surface: "Drivers" },
  { time: "12:55", user: "Adaeze O.", action: "Escalated B2B case SC-003", surface: "Support" },
];

/* ═══════════════════════════════════════════════════════════════════
   SHARED — Modal overlay + Drawer overlay
   ═══════════════════════════════════════════════════════════════════ */

function ModalOverlay({ open, onClose, title, width = 440, children }: { open: boolean; onClose: () => void; title: string; width?: number; children: React.ReactNode }) {
  const { t, theme } = useAdminTheme();
  const isDark = theme === "dark";
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center">
          <motion.div className="absolute inset-0" style={{ backdropFilter: "blur(4px)", background: isDark ? "rgba(0,0,0,0.5)" : "rgba(0,0,0,0.2)" }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
          <motion.div
            className="relative rounded-2xl overflow-hidden mx-4"
            style={{ width, maxWidth: "calc(100vw - 32px)", background: t.overlay, border: `1px solid ${t.border}`, boxShadow: isDark ? "0 24px 80px rgba(0,0,0,0.6)" : "0 24px 80px rgba(0,0,0,0.15)" }}
            initial={{ opacity: 0, scale: 0.96, y: 8 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.97, y: 4 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex items-center justify-between px-5 h-13" style={{ borderBottom: `1px solid ${t.borderSubtle}` }}>
              <span style={{ ...TY.sub, fontSize: "14px", color: t.text }}>{title}</span>
              <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: t.surfaceHover }}><X size={14} style={{ color: t.iconSecondary }} /></button>
            </div>
            <div className="p-5">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

function DrawerOverlay({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
  const { t, theme } = useAdminTheme();
  const isDark = theme === "dark";
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[150] flex">
          <motion.div className="absolute inset-0" style={{ background: isDark ? "rgba(0,0,0,0.35)" : "rgba(0,0,0,0.12)" }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
          <motion.div
            className="absolute top-0 right-0 bottom-0 flex flex-col"
            style={{ width: 420, maxWidth: "calc(100vw - 56px)", background: t.overlay, borderLeft: `1px solid ${t.border}`, boxShadow: isDark ? "0 0 40px rgba(0,0,0,0.5)" : "0 0 40px rgba(0,0,0,0.08)" }}
            initial={{ x: 420, opacity: 0.5 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 420, opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex items-center justify-between px-5 shrink-0" style={{ height: 56, borderBottom: `1px solid ${t.borderSubtle}` }}>
              <span style={{ ...TY.sub, fontSize: "13px", color: t.text }}>{title}</span>
              <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: t.surfaceHover }}><X size={14} style={{ color: t.iconSecondary }} /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-5">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

function FormField({ label, value, onChange, placeholder, type = "text", t }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string; t: any }) {
  return (
    <div className="mb-4">
      <label className="block mb-1.5" style={{ ...TY.label, fontSize: "10px", color: t.textMuted, letterSpacing: "0.04em" }}>{label}</label>
      <input
        type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        className="w-full h-10 px-3 rounded-xl bg-transparent outline-none transition-all"
        style={{ border: `1px solid ${t.borderSubtle}`, ...TY.body, fontSize: "13px", color: t.text }}
        onFocus={e => (e.target.style.borderColor = BRAND.green)}
        onBlur={e => (e.target.style.borderColor = t.borderSubtle)}
      />
    </div>
  );
}

function SelectField({ label, value, onChange, options, t }: { label: string; value: string; onChange: (v: string) => void; options: string[]; t: any }) {
  return (
    <div className="mb-4">
      <label className="block mb-1.5" style={{ ...TY.label, fontSize: "10px", color: t.textMuted, letterSpacing: "0.04em" }}>{label}</label>
      <select
        value={value} onChange={e => onChange(e.target.value)}
        className="w-full h-10 px-3 rounded-xl bg-transparent outline-none appearance-none cursor-pointer"
        style={{ border: `1px solid ${t.borderSubtle}`, ...TY.body, fontSize: "13px", color: t.text }}
      >
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

/* ════════════════════════════���══════════════════════════════════════
   MAIN SETTINGS PAGE
   ═══════════════════════════════════════════════════════════════════ */

export function AdminSettingsPage() {
  const { t, theme } = useAdminTheme();
  const isDark = theme === "dark";
  const [activeSection, setActiveSection] = useState<SettingsSection>("admin_users");

  return (
    <AdminPageShell title="Settings" subtitle="Platform configuration">
      <div className="flex h-full">
        {/* Sidebar */}
        <div className="hidden md:block w-56 shrink-0 p-3" style={{ borderRight: `1px solid ${t.borderSubtle}` }}>
          <div className="space-y-0.5">
            {SECTIONS.map(s => (
              <button
                key={s.key}
                onClick={() => setActiveSection(s.key)}
                className="w-full flex items-center gap-2.5 px-3 h-9 rounded-lg text-left transition-colors"
                style={{ background: activeSection === s.key ? t.surfaceActive : "transparent", color: activeSection === s.key ? t.text : t.textMuted }}
              >
                <s.icon size={14} style={{ color: activeSection === s.key ? BRAND.green : t.iconMuted }} />
                <span style={{ ...TY.body, fontSize: "12px" }}>{s.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Mobile section selector */}
        <div className="md:hidden p-3 w-full">
          <div className="flex items-center gap-1 overflow-x-auto mb-4">
            {SECTIONS.map(s => (
              <button
                key={s.key}
                onClick={() => setActiveSection(s.key)}
                className="flex items-center gap-1.5 px-3 h-8 rounded-lg whitespace-nowrap transition-colors"
                style={{ background: activeSection === s.key ? t.surfaceActive : "transparent", color: activeSection === s.key ? t.text : t.textMuted, ...TY.body, fontSize: "12px" }}
              >
                <s.icon size={12} />
                {s.label}
              </button>
            ))}
          </div>
          <SettingsContent section={activeSection} t={t} isDark={isDark} />
        </div>

        {/* Content */}
        <div className="hidden md:block flex-1 p-5 overflow-y-auto max-w-[900px]">
          <SettingsContent section={activeSection} t={t} isDark={isDark} />
        </div>
      </div>
    </AdminPageShell>
  );
}

function SettingsContent({ section, t, isDark }: { section: SettingsSection; t: any; isDark: boolean }) {
  switch (section) {
    case "admin_users": return <AdminUsersSection t={t} isDark={isDark} />;
    case "pricing": return <PricingSection t={t} isDark={isDark} />;
    case "notifications": return <NotificationsSection t={t} isDark={isDark} />;
    case "integrations": return <IntegrationsSection t={t} isDark={isDark} />;
    case "compliance": return <ComplianceSection t={t} isDark={isDark} />;
    case "general": return <GeneralSection t={t} isDark={isDark} />;
  }
}

/* ═══════════════════════════════════════════════════════════════════
   ADMIN USERS — with Add User modal + User detail drawer
   ═══════════════════════════════════════════════════════════════════ */

function AdminUsersSection({ t, isDark }: { t: any; isDark: boolean }) {
  const [addOpen, setAddOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);

  // Add user form
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newRole, setNewRole] = useState("Operations");

  // User drawer state
  const [editRole, setEditRole] = useState("");
  const [confirmDeactivate, setConfirmDeactivate] = useState(false);

  const openUser = (user: AdminUser) => {
    setSelectedUser(user);
    setEditRole(user.role);
    setConfirmDeactivate(false);
  };

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="block" style={{ ...TY.sub, fontSize: "15px", color: t.text }}>Admin Users</span>
          <span style={{ ...TY.bodyR, fontSize: "11px", color: t.textMuted }}>{MOCK_ADMIN_USERS.length} users · {MOCK_ADMIN_USERS.filter(u => u.status === "active").length} active</span>
        </div>
        <button onClick={() => { setAddOpen(true); setNewName(""); setNewEmail(""); setNewRole("Operations"); }} className="h-8 px-3 rounded-lg flex items-center gap-1.5 cursor-pointer" style={{ background: BRAND.green, ...TY.body, fontSize: "12px", color: "#fff" }}>
          <Plus size={13} /> Add User
        </button>
      </div>

      {/* Role summary */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        {Object.entries(ROLE_COLORS).map(([role, color]) => {
          const count = MOCK_ADMIN_USERS.filter(u => u.role === role).length;
          if (!count) return null;
          return (
            <div key={role} className="flex items-center gap-1.5 px-2 py-1 rounded-lg" style={{ background: `${color}12` }}>
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: color }} />
              <span style={{ ...TY.bodyR, fontSize: "10px", color }}>{role} ({count})</span>
            </div>
          );
        })}
      </div>

      {/* User list */}
      <div className="rounded-2xl overflow-hidden" style={{ background: t.surfaceRaised, border: `1px solid ${t.borderSubtle}`, boxShadow: t.shadow }}>
        {MOCK_ADMIN_USERS.map((user, i) => {
          const roleColor = ROLE_COLORS[user.role] || "#737373";
          return (
            <motion.div
              key={user.id}
              onClick={() => openUser(user)}
              className="flex items-center gap-3 px-4 py-3 transition-colors cursor-pointer"
              style={{ borderBottom: `1px solid ${t.borderSubtle}` }}
              whileHover={{ backgroundColor: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)" }}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 + i * 0.03 }}
            >
              <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={{ background: `${roleColor}15` }}>
                <span style={{ ...TY.body, fontSize: "11px", color: roleColor }}>{user.name.split(" ").map(n => n[0]).join("")}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="truncate" style={{ ...TY.body, fontSize: "13px", color: user.status === "active" ? t.text : t.textMuted }}>{user.name}</span>
                  {user.status === "inactive" && (
                    <span className="px-1.5 py-0.5 rounded" style={{ background: `${STATUS.error}12`, ...TY.cap, fontSize: "9px", color: STATUS.error }}>Inactive</span>
                  )}
                </div>
                <span className="block truncate" style={{ ...TY.bodyR, fontSize: "10px", color: t.textMuted }}>{user.email}</span>
              </div>
              <div className="hidden sm:flex items-center gap-1.5 px-2 py-1 rounded-lg shrink-0" style={{ background: `${roleColor}12` }}>
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: roleColor }} />
                <span style={{ ...TY.bodyR, fontSize: "10px", color: roleColor }}>{user.role}</span>
              </div>
              <div className="hidden lg:block text-right shrink-0">
                <span className="block" style={{ ...TY.bodyR, fontSize: "10px", color: t.textFaint }}>{user.lastLogin}</span>
                <span style={{ ...TY.cap, fontSize: "9px", color: t.textGhost }}>{user.actions} actions</span>
              </div>
              <ChevronRight size={14} style={{ color: t.iconMuted }} className="shrink-0" />
            </motion.div>
          );
        })}
      </div>

      {/* ── Add User Modal ── */}
      <ModalOverlay open={addOpen} onClose={() => setAddOpen(false)} title="Add Admin User">
        <FormField label="FULL NAME" value={newName} onChange={setNewName} placeholder="Enter full name" t={t} />
        <FormField label="EMAIL" value={newEmail} onChange={setNewEmail} placeholder="name@jet.ng" type="email" t={t} />
        <SelectField label="ROLE" value={newRole} onChange={setNewRole} options={ROLES} t={t} />
        <div className="flex items-center gap-2 p-3 rounded-xl mb-4" style={{ background: isDark ? "rgba(29,185,84,0.06)" : "rgba(29,185,84,0.04)", border: `1px solid ${isDark ? "rgba(29,185,84,0.12)" : "rgba(29,185,84,0.08)"}` }}>
          <Send size={13} style={{ color: BRAND.green }} />
          <span style={{ ...TY.bodyR, fontSize: "11px", color: t.textMuted }}>An invitation email will be sent with a secure login link</span>
        </div>
        <div className="flex justify-end gap-2">
          <button onClick={() => setAddOpen(false)} className="h-9 px-4 rounded-lg cursor-pointer" style={{ background: t.surfaceHover, ...TY.body, fontSize: "12px", color: t.textSecondary }}>Cancel</button>
          <button onClick={() => setAddOpen(false)} className="h-9 px-4 rounded-lg flex items-center gap-1.5 cursor-pointer" style={{ background: BRAND.green, ...TY.body, fontSize: "12px", color: "#fff" }}>
            <UserPlus size={13} /> Send Invite
          </button>
        </div>
      </ModalOverlay>

      {/* ── User Detail Drawer ── */}
      <DrawerOverlay open={!!selectedUser} onClose={() => setSelectedUser(null)} title={selectedUser?.name || ""}>
        {selectedUser && (
          <>
            {/* Profile header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: `${ROLE_COLORS[selectedUser.role] || "#737373"}15` }}>
                <span style={{ ...TY.h, fontSize: "18px", color: ROLE_COLORS[selectedUser.role] || "#737373" }}>{selectedUser.name.split(" ").map(n => n[0]).join("")}</span>
              </div>
              <div>
                <span className="block" style={{ ...TY.sub, fontSize: "15px", color: t.text }}>{selectedUser.name}</span>
                <span className="block" style={{ ...TY.bodyR, fontSize: "12px", color: t.textMuted }}>{selectedUser.email}</span>
                <div className="flex items-center gap-2 mt-1">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: selectedUser.status === "active" ? BRAND.green : STATUS.error }} />
                  <span style={{ ...TY.cap, fontSize: "9px", color: selectedUser.status === "active" ? BRAND.green : STATUS.error }}>{selectedUser.status === "active" ? "Active" : "Inactive"}</span>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              {[
                { label: "Actions", value: selectedUser.actions.toLocaleString() },
                { label: "Last Login", value: selectedUser.lastLogin },
                { label: "ID", value: selectedUser.id },
              ].map(s => (
                <div key={s.label} className="p-3 rounded-xl" style={{ background: t.surface, border: `1px solid ${t.borderSubtle}` }}>
                  <span className="block" style={{ ...TY.cap, fontSize: "9px", color: t.textFaint, letterSpacing: "0.06em" }}>{s.label}</span>
                  <span className="block mt-0.5" style={{ ...TY.body, fontSize: "13px", color: t.text }}>{s.value}</span>
                </div>
              ))}
            </div>

            {/* Edit Role */}
            <span className="block mb-2" style={{ ...TY.label, fontSize: "9px", color: t.textFaint, letterSpacing: "0.06em" }}>ROLE & PERMISSIONS</span>
            <SelectField label="Role" value={editRole} onChange={setEditRole} options={ROLES} t={t} />
            {editRole !== selectedUser.role && (
              <div className="flex items-center gap-2 mb-4">
                <button onClick={() => setSelectedUser(null)} className="h-8 px-3 rounded-lg flex items-center gap-1.5 cursor-pointer" style={{ background: BRAND.green, ...TY.body, fontSize: "11px", color: "#fff" }}>
                  <Save size={12} /> Save Role Change
                </button>
                <button onClick={() => setEditRole(selectedUser.role)} className="h-8 px-3 rounded-lg cursor-pointer" style={{ background: t.surfaceHover, ...TY.body, fontSize: "11px", color: t.textMuted }}>
                  <RotateCcw size={12} /> Reset
                </button>
              </div>
            )}

            {/* Divider */}
            <div className="h-px my-4" style={{ background: t.borderSubtle }} />

            {/* Actions */}
            <span className="block mb-2" style={{ ...TY.label, fontSize: "9px", color: t.textFaint, letterSpacing: "0.06em" }}>ACTIONS</span>
            <div className="space-y-2">
              <button className="w-full h-10 px-3 rounded-xl flex items-center gap-2.5 cursor-pointer transition-colors" style={{ background: t.surface, border: `1px solid ${t.borderSubtle}` }}
                onMouseEnter={e => (e.currentTarget.style.background = t.surfaceHover)}
                onMouseLeave={e => (e.currentTarget.style.background = t.surface)}
              >
                <Lock size={13} style={{ color: t.iconMuted }} />
                <span style={{ ...TY.body, fontSize: "12px", color: t.textSecondary }}>Reset Password</span>
                <span className="ml-auto" style={{ ...TY.bodyR, fontSize: "10px", color: t.textFaint }}>Sends reset link</span>
              </button>
              <button className="w-full h-10 px-3 rounded-xl flex items-center gap-2.5 cursor-pointer transition-colors" style={{ background: t.surface, border: `1px solid ${t.borderSubtle}` }}
                onMouseEnter={e => (e.currentTarget.style.background = t.surfaceHover)}
                onMouseLeave={e => (e.currentTarget.style.background = t.surface)}
              >
                <Shield size={13} style={{ color: t.iconMuted }} />
                <span style={{ ...TY.body, fontSize: "12px", color: t.textSecondary }}>Force Logout All Sessions</span>
              </button>

              {/* Deactivate with confirmation */}
              {!confirmDeactivate ? (
                <button
                  onClick={() => setConfirmDeactivate(true)}
                  className="w-full h-10 px-3 rounded-xl flex items-center gap-2.5 cursor-pointer"
                  style={{ background: isDark ? "rgba(212,24,61,0.06)" : "rgba(212,24,61,0.04)", border: `1px solid ${isDark ? "rgba(212,24,61,0.12)" : "rgba(212,24,61,0.08)"}` }}
                >
                  <UserMinus size={13} style={{ color: STATUS.error }} />
                  <span style={{ ...TY.body, fontSize: "12px", color: STATUS.error }}>{selectedUser.status === "active" ? "Deactivate User" : "Reactivate User"}</span>
                </button>
              ) : (
                <div className="p-3 rounded-xl" style={{ background: isDark ? "rgba(212,24,61,0.08)" : "rgba(212,24,61,0.04)", border: `1px solid ${isDark ? "rgba(212,24,61,0.15)" : "rgba(212,24,61,0.1)"}` }}>
                  <span className="block mb-2" style={{ ...TY.body, fontSize: "12px", color: STATUS.error }}>
                    {selectedUser.status === "active" ? "This will revoke all access immediately." : "This will restore access for this user."}
                  </span>
                  <div className="flex items-center gap-2">
                    <button onClick={() => setSelectedUser(null)} className="h-8 px-3 rounded-lg cursor-pointer" style={{ background: STATUS.error, ...TY.body, fontSize: "11px", color: "#fff" }}>
                      Confirm {selectedUser.status === "active" ? "Deactivate" : "Reactivate"}
                    </button>
                    <button onClick={() => setConfirmDeactivate(false)} className="h-8 px-3 rounded-lg cursor-pointer" style={{ background: t.surfaceHover, ...TY.body, fontSize: "11px", color: t.textMuted }}>Cancel</button>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </DrawerOverlay>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   PRICING — with Edit Setting modal
   ═══════════════════════════════════════════════════════════════════ */

function PricingSection({ t, isDark }: { t: any; isDark: boolean }) {
  const [rules, setRules] = useState([
    { label: "Base Fare", value: "₦400", desc: "Starting fare for all ride types" },
    { label: "Per KM Rate", value: "₦120/km", desc: "Distance-based pricing" },
    { label: "Per Minute Rate", value: "₦25/min", desc: "Time-based pricing" },
    { label: "Minimum Fare", value: "₦800", desc: "Floor price for any trip" },
    { label: "Surge Multiplier (max)", value: "2.5x", desc: "Maximum surge pricing cap" },
    { label: "Platform Commission", value: "20%", desc: "JET take rate from gross fare" },
    { label: "Hotel Commission", value: "18%", desc: "Reduced rate for hotel partners" },
    { label: "Fleet Commission", value: "15%", desc: "Reduced rate for fleet partners" },
    { label: "EV Bonus", value: "+5%", desc: "Extra driver earnings for EV trips" },
  ]);
  const [editing, setEditing] = useState<{ label: string; value: string; desc: string } | null>(null);
  const [editValue, setEditValue] = useState("");

  return (
    <>
      <span className="block mb-1" style={{ ...TY.sub, fontSize: "15px", color: t.text }}>Pricing Rules</span>
      <span className="block mb-4" style={{ ...TY.bodyR, fontSize: "11px", color: t.textMuted }}>Configure base fares, surge rules, and commission rates</span>
      <div className="rounded-2xl overflow-hidden" style={{ background: t.surfaceRaised, border: `1px solid ${t.borderSubtle}`, boxShadow: t.shadow }}>
        {rules.map((r) => (
          <div
            key={r.label}
            onClick={() => { setEditing(r); setEditValue(r.value); }}
            className="flex items-center justify-between px-4 h-14 cursor-pointer transition-colors"
            style={{ borderBottom: `1px solid ${t.borderSubtle}` }}
            onMouseEnter={e => (e.currentTarget.style.background = isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.015)")}
            onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
          >
            <div>
              <span className="block" style={{ ...TY.body, fontSize: "13px", color: t.text }}>{r.label}</span>
              <span style={{ ...TY.bodyR, fontSize: "10px", color: t.textMuted }}>{r.desc}</span>
            </div>
            <div className="flex items-center gap-2">
              <span style={{ ...TY.h, fontSize: "14px", color: BRAND.green }}>{r.value}</span>
              <Edit3 size={12} style={{ color: t.iconMuted }} />
            </div>
          </div>
        ))}
      </div>

      <ModalOverlay open={!!editing} onClose={() => setEditing(null)} title={`Edit: ${editing?.label || ""}`} width={380}>
        <span className="block mb-3" style={{ ...TY.bodyR, fontSize: "11px", color: t.textMuted }}>{editing?.desc}</span>
        <FormField label="VALUE" value={editValue} onChange={setEditValue} t={t} />
        <div className="flex items-center gap-2 p-3 rounded-xl mb-4" style={{ background: isDark ? "rgba(255,170,0,0.06)" : "rgba(255,170,0,0.04)", border: `1px solid ${isDark ? "rgba(255,170,0,0.12)" : "rgba(255,170,0,0.08)"}` }}>
          <AlertTriangle size={13} style={{ color: STATUS.warning }} />
          <span style={{ ...TY.bodyR, fontSize: "11px", color: t.textMuted }}>Changes apply to all new rides immediately</span>
        </div>
        <div className="flex justify-end gap-2">
          <button onClick={() => setEditing(null)} className="h-9 px-4 rounded-lg cursor-pointer" style={{ background: t.surfaceHover, ...TY.body, fontSize: "12px", color: t.textSecondary }}>Cancel</button>
          <button
            onClick={() => {
              if (editing) {
                setRules(prev => prev.map(r => r.label === editing.label ? { ...r, value: editValue } : r));
                setEditing(null);
              }
            }}
            className="h-9 px-4 rounded-lg flex items-center gap-1.5 cursor-pointer"
            style={{ background: BRAND.green, ...TY.body, fontSize: "12px", color: "#fff" }}
          >
            <Save size={12} /> Save
          </button>
        </div>
      </ModalOverlay>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   NOTIFICATIONS — with Template editor drawer
   ═══════════════════════════════════════════════════════════════════ */

function NotificationsSection({ t, isDark }: { t: any; isDark: boolean }) {
  const templates = [
    { id: "t-1", name: "Ride Confirmation", channel: "Push + SMS", audience: "Riders", status: "active", body: "Your ride has been confirmed! Driver {{driver_name}} is on the way in a {{vehicle_color}} {{vehicle_model}}." },
    { id: "t-2", name: "Driver Nearby", channel: "Push", audience: "Riders", status: "active", body: "{{driver_name}} is {{eta}} away. Please be ready at your pickup point." },
    { id: "t-3", name: "New Ride Request", channel: "Push", audience: "Drivers", status: "active", body: "New ride request! Pickup: {{pickup_address}}. Estimated fare: {{fare}}." },
    { id: "t-4", name: "Payout Processed", channel: "Push + Email", audience: "Drivers + Fleet", status: "active", body: "Your payout of {{amount}} has been processed to {{bank_name}} ****{{last4}}." },
    { id: "t-5", name: "Invoice Generated", channel: "Email", audience: "Hotels", status: "active", body: "Invoice #{{invoice_id}} for {{amount}} has been generated for {{hotel_name}}." },
    { id: "t-6", name: "Verification Update", channel: "Push + SMS", audience: "Drivers", status: "active", body: "Your document verification status has been updated: {{status}}." },
    { id: "t-7", name: "Surge Zone Alert", channel: "Push", audience: "Drivers", status: "draft", body: "High demand in {{zone_name}}! Surge multiplier: {{multiplier}}x." },
    { id: "t-8", name: "Referral Bonus", channel: "Push", audience: "Riders", status: "draft", body: "{{referrer_name}} earned you a ₦{{bonus}} bonus! Use it on your next ride." },
  ];

  const [selectedTemplate, setSelectedTemplate] = useState<typeof templates[0] | null>(null);
  const [editBody, setEditBody] = useState("");

  return (
    <>
      <span className="block mb-1" style={{ ...TY.sub, fontSize: "15px", color: t.text }}>Notification Templates</span>
      <span className="block mb-4" style={{ ...TY.bodyR, fontSize: "11px", color: t.textMuted }}>Manage push, SMS, and email templates across all user types</span>
      <div className="rounded-2xl overflow-hidden" style={{ background: t.surfaceRaised, border: `1px solid ${t.borderSubtle}`, boxShadow: t.shadow }}>
        {templates.map((tmpl) => (
          <div
            key={tmpl.id}
            onClick={() => { setSelectedTemplate(tmpl); setEditBody(tmpl.body); }}
            className="flex items-center justify-between px-4 h-14 cursor-pointer transition-colors"
            style={{ borderBottom: `1px solid ${t.borderSubtle}` }}
            onMouseEnter={e => (e.currentTarget.style.background = isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.015)")}
            onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
          >
            <div className="flex items-center gap-3">
              <Bell size={14} style={{ color: tmpl.status === "active" ? BRAND.green : t.iconMuted }} />
              <div>
                <span className="block" style={{ ...TY.body, fontSize: "13px", color: t.text }}>{tmpl.name}</span>
                <span style={{ ...TY.bodyR, fontSize: "10px", color: t.textMuted }}>{tmpl.channel} · {tmpl.audience}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-1.5 py-0.5 rounded" style={{ background: tmpl.status === "active" ? `${BRAND.green}15` : `${t.textMuted}15`, ...TY.cap, fontSize: "9px", color: tmpl.status === "active" ? BRAND.green : t.textMuted }}>
                {tmpl.status}
              </span>
              <Edit3 size={12} style={{ color: t.iconMuted }} />
            </div>
          </div>
        ))}
      </div>

      {/* Template Editor Drawer */}
      <DrawerOverlay open={!!selectedTemplate} onClose={() => setSelectedTemplate(null)} title={`Edit: ${selectedTemplate?.name || ""}`}>
        {selectedTemplate && (
          <>
            {/* Meta */}
            <div className="grid grid-cols-2 gap-3 mb-5">
              {[
                { label: "Channel", value: selectedTemplate.channel },
                { label: "Audience", value: selectedTemplate.audience },
                { label: "Status", value: selectedTemplate.status },
                { label: "ID", value: selectedTemplate.id },
              ].map(m => (
                <div key={m.label} className="p-3 rounded-xl" style={{ background: t.surface, border: `1px solid ${t.borderSubtle}` }}>
                  <span className="block" style={{ ...TY.cap, fontSize: "9px", color: t.textFaint, letterSpacing: "0.06em" }}>{m.label}</span>
                  <span className="block mt-0.5" style={{ ...TY.body, fontSize: "12px", color: t.text }}>{m.value}</span>
                </div>
              ))}
            </div>

            {/* Template body */}
            <label className="block mb-1.5" style={{ ...TY.label, fontSize: "10px", color: t.textMuted, letterSpacing: "0.04em" }}>TEMPLATE BODY</label>
            <textarea
              value={editBody}
              onChange={e => setEditBody(e.target.value)}
              rows={5}
              className="w-full px-3 py-2.5 rounded-xl bg-transparent outline-none resize-none mb-2"
              style={{ border: `1px solid ${t.borderSubtle}`, ...TY.body, fontSize: "13px", color: t.text, lineHeight: "1.5" }}
              onFocus={e => (e.target.style.borderColor = BRAND.green)}
              onBlur={e => (e.target.style.borderColor = t.borderSubtle)}
            />
            <span className="block mb-4" style={{ ...TY.bodyR, fontSize: "10px", color: t.textFaint }}>Use {"{{variable}}"} for dynamic content</span>

            {/* Variables reference */}
            <span className="block mb-2" style={{ ...TY.label, fontSize: "9px", color: t.textFaint, letterSpacing: "0.06em" }}>AVAILABLE VARIABLES</span>
            <div className="flex flex-wrap gap-1.5 mb-5">
              {["driver_name", "vehicle_model", "vehicle_color", "eta", "fare", "amount", "pickup_address", "status"].map(v => (
                <span key={v} className="px-2 py-1 rounded-lg" style={{ background: t.surface, border: `1px solid ${t.borderSubtle}`, ...TY.cap, fontSize: "9px", color: BRAND.green }}>
                  {`{{${v}}}`}
                </span>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button onClick={() => setSelectedTemplate(null)} className="h-9 px-4 rounded-lg flex items-center gap-1.5 cursor-pointer" style={{ background: BRAND.green, ...TY.body, fontSize: "12px", color: "#fff" }}>
                <Save size={12} /> Save Template
              </button>
              <button className="h-9 px-4 rounded-lg flex items-center gap-1.5 cursor-pointer" style={{ background: t.surfaceHover, ...TY.body, fontSize: "12px", color: t.textSecondary }}>
                <Eye size={12} /> Preview
              </button>
              <button onClick={() => setSelectedTemplate(null)} className="h-9 px-4 rounded-lg cursor-pointer" style={{ background: t.surfaceHover, ...TY.body, fontSize: "12px", color: t.textMuted }}>Cancel</button>
            </div>
          </>
        )}
      </DrawerOverlay>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   INTEGRATIONS — with Config modal
   ═══════════════════════════════════════════════════════════════════ */

function IntegrationsSection({ t, isDark }: { t: any; isDark: boolean }) {
  const [selectedInt, setSelectedInt] = useState<Integration | null>(null);
  const [showKey, setShowKey] = useState(false);
  const [testStatus, setTestStatus] = useState<"idle" | "testing" | "success" | "error">("idle");

  const statusMeta = {
    connected: { label: "Connected", color: STATUS.success, icon: CheckCircle2 },
    error: { label: "Error", color: STATUS.error, icon: XCircle },
    not_configured: { label: "Not Configured", color: "#737373", icon: AlertTriangle },
  };

  const handleTest = () => {
    setTestStatus("testing");
    setTimeout(() => setTestStatus(selectedInt?.status === "error" ? "error" : "success"), 1500);
  };

  return (
    <>
      <span className="block mb-1" style={{ ...TY.sub, fontSize: "15px", color: t.text }}>Integrations</span>
      <span className="block mb-4" style={{ ...TY.bodyR, fontSize: "11px", color: t.textMuted }}>Third-party services and API connections</span>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {INTEGRATIONS.map((int, i) => {
          const sm = statusMeta[int.status];
          return (
            <motion.div
              key={int.name}
              onClick={() => { setSelectedInt(int); setShowKey(false); setTestStatus("idle"); }}
              className="p-4 rounded-2xl cursor-pointer transition-colors"
              style={{ background: t.surfaceRaised, border: `1px solid ${int.status === "error" ? `${STATUS.error}30` : t.borderSubtle}`, boxShadow: t.shadow }}
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.04 }}
              whileHover={{ scale: 1.01 }}
            >
              <div className="flex items-center justify-between mb-3">
                <int.icon size={18} style={{ color: int.status === "connected" ? BRAND.green : int.status === "error" ? STATUS.error : t.iconMuted }} />
                <div className="flex items-center gap-1 px-1.5 py-0.5 rounded" style={{ background: `${sm.color}12` }}>
                  <sm.icon size={9} style={{ color: sm.color }} />
                  <span style={{ ...TY.cap, fontSize: "9px", color: sm.color }}>{sm.label}</span>
                </div>
              </div>
              <span className="block mb-0.5" style={{ ...TY.body, fontSize: "13px", color: t.text }}>{int.name}</span>
              <span className="block mb-2" style={{ ...TY.bodyR, fontSize: "10px", color: t.textMuted }}>{int.desc}</span>
              <span style={{ ...TY.cap, fontSize: "9px", color: t.textGhost }}>Last check: {int.lastCheck}</span>
            </motion.div>
          );
        })}
      </div>

      {/* Integration Config Modal */}
      <ModalOverlay open={!!selectedInt} onClose={() => setSelectedInt(null)} title={`Configure: ${selectedInt?.name || ""}`} width={460}>
        {selectedInt && (
          <>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${statusMeta[selectedInt.status].color}12` }}>
                <selectedInt.icon size={18} style={{ color: statusMeta[selectedInt.status].color }} />
              </div>
              <div>
                <span className="block" style={{ ...TY.body, fontSize: "14px", color: t.text }}>{selectedInt.name}</span>
                <span style={{ ...TY.bodyR, fontSize: "11px", color: t.textMuted }}>{selectedInt.desc}</span>
              </div>
            </div>

            {/* API Key */}
            <label className="block mb-1.5" style={{ ...TY.label, fontSize: "10px", color: t.textMuted, letterSpacing: "0.04em" }}>API KEY</label>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex-1 h-10 px-3 rounded-xl flex items-center" style={{ border: `1px solid ${t.borderSubtle}`, background: t.surface }}>
                <span style={{ ...TY.body, fontSize: "12px", color: t.text }}>{showKey ? selectedInt.apiKey || "Not set" : "••••••••••••••••"}</span>
              </div>
              <button onClick={() => setShowKey(!showKey)} className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 cursor-pointer" style={{ border: `1px solid ${t.borderSubtle}` }}>
                {showKey ? <EyeOff size={14} style={{ color: t.iconMuted }} /> : <Eye size={14} style={{ color: t.iconMuted }} />}
              </button>
            </div>

            {/* Webhook URL */}
            {selectedInt.webhook && (
              <>
                <label className="block mb-1.5" style={{ ...TY.label, fontSize: "10px", color: t.textMuted, letterSpacing: "0.04em" }}>WEBHOOK URL</label>
                <div className="h-10 px-3 rounded-xl flex items-center mb-4" style={{ border: `1px solid ${t.borderSubtle}`, background: t.surface }}>
                  <span style={{ ...TY.bodyR, fontSize: "12px", color: t.textMuted }}>{selectedInt.webhook}</span>
                </div>
              </>
            )}

            {/* Test connection */}
            <div className="flex items-center gap-2 mb-4">
              <button
                onClick={handleTest}
                disabled={testStatus === "testing"}
                className="h-9 px-4 rounded-lg flex items-center gap-1.5 cursor-pointer"
                style={{ background: t.surfaceHover, ...TY.body, fontSize: "12px", color: t.textSecondary, opacity: testStatus === "testing" ? 0.6 : 1 }}
              >
                <RefreshCw size={12} className={testStatus === "testing" ? "animate-spin" : ""} /> Test Connection
              </button>
              {testStatus === "success" && (
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 size={13} style={{ color: BRAND.green }} />
                  <span style={{ ...TY.body, fontSize: "11px", color: BRAND.green }}>Connection successful</span>
                </div>
              )}
              {testStatus === "error" && (
                <div className="flex items-center gap-1.5">
                  <XCircle size={13} style={{ color: STATUS.error }} />
                  <span style={{ ...TY.body, fontSize: "11px", color: STATUS.error }}>Connection failed</span>
                </div>
              )}
            </div>

            <div className="h-px my-4" style={{ background: t.borderSubtle }} />

            <div className="flex justify-between">
              <button className="h-9 px-4 rounded-lg flex items-center gap-1.5 cursor-pointer" style={{ background: isDark ? "rgba(212,24,61,0.06)" : "rgba(212,24,61,0.04)", ...TY.body, fontSize: "12px", color: STATUS.error }}>
                <Power size={12} /> Disconnect
              </button>
              <div className="flex gap-2">
                <button onClick={() => setSelectedInt(null)} className="h-9 px-4 rounded-lg cursor-pointer" style={{ background: t.surfaceHover, ...TY.body, fontSize: "12px", color: t.textSecondary }}>Cancel</button>
                <button onClick={() => setSelectedInt(null)} className="h-9 px-4 rounded-lg flex items-center gap-1.5 cursor-pointer" style={{ background: BRAND.green, ...TY.body, fontSize: "12px", color: "#fff" }}>
                  <Save size={12} /> Save
                </button>
              </div>
            </div>
          </>
        )}
      </ModalOverlay>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   COMPLIANCE — Read-only (audit trail)
   ═══════════════════════════════════���═══════════════════════════════ */

function ComplianceSection({ t, isDark }: { t: any; isDark: boolean }) {
  return (
    <>
      <span className="block mb-1" style={{ ...TY.sub, fontSize: "15px", color: t.text }}>Compliance & Audit</span>
      <span className="block mb-4" style={{ ...TY.bodyR, fontSize: "11px", color: t.textMuted }}>Data retention, audit trail, and regulatory settings</span>

      <span className="block mb-2" style={{ ...TY.label, fontSize: "9px", color: t.textFaint, letterSpacing: "0.06em" }}>DATA RETENTION</span>
      <div className="rounded-2xl overflow-hidden mb-6" style={{ background: t.surfaceRaised, border: `1px solid ${t.borderSubtle}`, boxShadow: t.shadow }}>
        {[
          { label: "Ride data", value: "7 years", desc: "Trip records, fares, routes" },
          { label: "User PII", value: "Account lifetime + 2 years", desc: "Personal data, payment info" },
          { label: "Audit logs", value: "5 years", desc: "Admin actions, system events" },
          { label: "Support cases", value: "3 years", desc: "B2B case records and threads" },
        ].map(r => (
          <div key={r.label} className="flex items-center justify-between px-4 h-14" style={{ borderBottom: `1px solid ${t.borderSubtle}` }}>
            <div>
              <span className="block" style={{ ...TY.body, fontSize: "13px", color: t.text }}>{r.label}</span>
              <span style={{ ...TY.bodyR, fontSize: "10px", color: t.textMuted }}>{r.desc}</span>
            </div>
            <span style={{ ...TY.body, fontSize: "12px", color: t.text }}>{r.value}</span>
          </div>
        ))}
      </div>

      <span className="block mb-2" style={{ ...TY.label, fontSize: "9px", color: t.textFaint, letterSpacing: "0.06em" }}>RECENT AUDIT TRAIL</span>
      <div className="rounded-2xl overflow-hidden" style={{ background: t.surfaceRaised, border: `1px solid ${t.borderSubtle}`, boxShadow: t.shadow }}>
        {AUDIT_LOG.map((entry, i) => (
          <motion.div
            key={i}
            className="flex items-center gap-3 px-4 py-2.5"
            style={{ borderBottom: `1px solid ${t.borderSubtle}` }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 + i * 0.03 }}
          >
            <span className="w-10 text-right shrink-0" style={{ ...TY.cap, fontSize: "10px", color: t.textFaint }}>{entry.time}</span>
            <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: BRAND.green }} />
            <div className="flex-1 min-w-0">
              <span style={{ ...TY.body, fontSize: "12px", color: BRAND.green }}>{entry.user}</span>
              <span style={{ ...TY.bodyR, fontSize: "12px", color: t.text }}> {entry.action}</span>
            </div>
            <span className="px-1.5 py-0.5 rounded shrink-0" style={{ background: t.surface, ...TY.cap, fontSize: "9px", color: t.textMuted }}>{entry.surface}</span>
          </motion.div>
        ))}
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   GENERAL — with Edit Setting modal (reusable)
   ═══════════════════════════════════════════════════════════════════ */

function GeneralSection({ t, isDark }: { t: any; isDark: boolean }) {
  const [settings, setSettings] = useState([
    { label: "Platform Name", value: "JET", desc: "Displayed across all surfaces" },
    { label: "Timezone", value: "WAT (UTC+1)", desc: "All timestamps use this zone" },
    { label: "Default Currency", value: "NGN (₦)", desc: "Nigerian Naira" },
    { label: "Default Language", value: "English", desc: "Primary platform language" },
    { label: "Support Email", value: "support@jet.ng", desc: "Customer-facing email" },
    { label: "Support Phone", value: "+234 800 JET RIDE", desc: "Customer-facing phone" },
    { label: "Max Surge", value: "2.5x", desc: "System-wide surge ceiling" },
    { label: "Driver Acceptance Timeout", value: "15s", desc: "Time to accept ride request" },
    { label: "Cancellation Window", value: "2 min", desc: "Free cancellation period" },
  ]);
  const [editing, setEditing] = useState<{ label: string; value: string; desc: string } | null>(null);
  const [editValue, setEditValue] = useState("");

  return (
    <>
      <span className="block mb-1" style={{ ...TY.sub, fontSize: "15px", color: t.text }}>General Settings</span>
      <span className="block mb-4" style={{ ...TY.bodyR, fontSize: "11px", color: t.textMuted }}>Platform-wide configuration defaults</span>
      <div className="rounded-2xl overflow-hidden" style={{ background: t.surfaceRaised, border: `1px solid ${t.borderSubtle}`, boxShadow: t.shadow }}>
        {settings.map(s => (
          <div
            key={s.label}
            onClick={() => { setEditing(s); setEditValue(s.value); }}
            className="flex items-center justify-between px-4 h-14 cursor-pointer transition-colors"
            style={{ borderBottom: `1px solid ${t.borderSubtle}` }}
            onMouseEnter={e => (e.currentTarget.style.background = isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.015)")}
            onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
          >
            <div>
              <span className="block" style={{ ...TY.body, fontSize: "13px", color: t.text }}>{s.label}</span>
              <span style={{ ...TY.bodyR, fontSize: "10px", color: t.textMuted }}>{s.desc}</span>
            </div>
            <div className="flex items-center gap-2">
              <span style={{ ...TY.body, fontSize: "12px", color: t.text }}>{s.value}</span>
              <Edit3 size={12} style={{ color: t.iconMuted }} />
            </div>
          </div>
        ))}
      </div>

      <ModalOverlay open={!!editing} onClose={() => setEditing(null)} title={`Edit: ${editing?.label || ""}`} width={380}>
        <span className="block mb-3" style={{ ...TY.bodyR, fontSize: "11px", color: t.textMuted }}>{editing?.desc}</span>
        <FormField label="VALUE" value={editValue} onChange={setEditValue} t={t} />
        <div className="flex justify-end gap-2">
          <button onClick={() => setEditing(null)} className="h-9 px-4 rounded-lg cursor-pointer" style={{ background: t.surfaceHover, ...TY.body, fontSize: "12px", color: t.textSecondary }}>Cancel</button>
          <button
            onClick={() => {
              if (editing) {
                setSettings(prev => prev.map(s => s.label === editing.label ? { ...s, value: editValue } : s));
                setEditing(null);
              }
            }}
            className="h-9 px-4 rounded-lg flex items-center gap-1.5 cursor-pointer"
            style={{ background: BRAND.green, ...TY.body, fontSize: "12px", color: "#fff" }}
          >
            <Save size={12} /> Save
          </button>
        </div>
      </ModalOverlay>
    </>
  );
}
