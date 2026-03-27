/**
 * HOTEL — SETTINGS TAB
 *
 * Rewritten to match fleet-settings quality:
 *   - Shared UI primitives (SettingCard, SectionHeader, FieldRow, TextInput, Toggle, Separator)
 *   - Proper focus states on all inputs (green ring + border)
 *   - SaveBar with unsaved-changes guard
 *   - Skeleton loading + error recovery
 *   - Stagger animations + reduced-motion support
 *   - Keyboard shortcuts (Cmd+S, Escape)
 *   - Gradient separators (Linear/Vercel style)
 *   - Consistent rounded-2xl radii
 *
 * Sections: Hotel Profile · Team · Notifications · Appearance · Security · Danger Zone
 *
 * Data sources:
 *   - Profile → hotel_partners table
 *   - Team → hotel_team_members table
 *   - Preferences → hotel_settings table
 *   - Security → auth.users / auth.sessions
 */

import { useState, useCallback, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Building2, Users, Bell, Palette, Check, X,
  UserPlus, Mail, Phone, Shield, Trash2, ChevronRight,
  AlertTriangle, Key, Monitor, Smartphone, Download,
  LogOut,
} from "lucide-react";
import { useAdminTheme, BRAND, TY, STATUS } from "../config/admin-theme";
import { MOCK_HOTEL, type HotelTeamMember } from "../config/hotel-mock-data";
import { Toast } from "../components/shared/toast";
import { ConfirmModal } from "../components/shared/confirm-modal";
import { usePrefersReducedMotion } from "../hooks/use-reduced-motion";
import {
  SettingCard, SectionHeader, FieldRow, Separator,
  TextInput, Toggle, SaveBar, SettingsSkeleton,
  motionProps,
} from "../components/shared/settings-primitives";

const data = MOCK_HOTEL;


// ─── Types ──────────────────────────────────────────────────────────────────

type SectionId = "profile" | "team" | "notifications" | "security" | "appearance" | "danger";

interface Session {
  id: string;
  device: string;
  browser: string;
  location: string;
  lastActive: string;
  current: boolean;
  icon: typeof Monitor;
}

const MOCK_SESSIONS: Session[] = [
  { id: "s1", device: "Front Desk iMac", browser: "Chrome 122", location: "Lagos, NG", lastActive: "Now", current: true, icon: Monitor },
  { id: "s2", device: "Concierge iPad", browser: "Safari 17", location: "Lagos, NG", lastActive: "1h ago", current: false, icon: Monitor },
  { id: "s3", device: "Manager iPhone", browser: "Safari Mobile", location: "Lagos, NG", lastActive: "6h ago", current: false, icon: Smartphone },
];

const SECTION_NAV: { id: SectionId; label: string; icon: typeof Building2 }[] = [
  { id: "profile", label: "Hotel Profile", icon: Building2 },
  { id: "team", label: "Team", icon: Users },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "security", label: "Security", icon: Shield },
  { id: "appearance", label: "Appearance", icon: Palette },
  { id: "danger", label: "Danger Zone", icon: AlertTriangle },
];


// ═══════════════════════════════════════════════════════════════════════════
// SECTION COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════


// ─── Hotel Profile ──────────────────────────────────────────────────────────

function ProfileSection({ onDirty, showToast }: { onDirty: (d: boolean) => void; showToast: (msg: string, type?: "success" | "info" | "error") => void }) {
  const { t, theme } = useAdminTheme();
  const isDark = theme === "dark";
  const rm = usePrefersReducedMotion();

  const [hotelName, setHotelName] = useState(data.hotelName);
  const [address, setAddress] = useState(data.address);
  const [phone, setPhone] = useState(data.phone);
  const [email, setEmail] = useState(data.email);
  const [contactName, setContactName] = useState(data.contactName);

  const isDirty = useMemo(() =>
    hotelName !== data.hotelName || address !== data.address ||
    phone !== data.phone || email !== data.email || contactName !== data.contactName,
    [hotelName, address, phone, email, contactName]
  );

  useEffect(() => { onDirty(isDirty); }, [isDirty, onDirty]);

  return (
    <motion.div {...motionProps(0, rm)}>
      <SectionHeader icon={Building2} title="Hotel Profile" description="Your hotel's registered business information" />
      <SettingCard>
        {/* Hotel avatar */}
        <div className="flex items-center gap-4 mb-4">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
            style={{
              background: `linear-gradient(135deg, ${BRAND.green}14 0%, ${BRAND.green}06 100%)`,
              border: `1px solid ${BRAND.green}14`,
            }}
          >
            <span style={{
              fontFamily: "'Montserrat', sans-serif", fontWeight: 700,
              fontSize: "18px", color: BRAND.green, letterSpacing: "-0.03em",
            }}>
              {data.hotelName.split(" ").map(w => w[0]).slice(0, 2).join("")}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <span className="block truncate" style={{ ...TY.body, fontSize: "13px", color: t.text, lineHeight: "1.4", letterSpacing: "-0.02em" }}>
              {hotelName}
            </span>
            <span className="block" style={{ ...TY.bodyR, fontSize: "10px", color: t.textFaint, lineHeight: "1.5" }}>
              {data.starRating}-star · {data.billingCycle} billing
            </span>
          </div>
          <div className="px-2 py-1 rounded-lg" style={{ background: `${BRAND.green}08`, border: `1px solid ${BRAND.green}12` }}>
            <span style={{ ...TY.body, fontSize: "9px", color: BRAND.green, lineHeight: "1.4" }}>Active</span>
          </div>
        </div>

        <Separator />

        <FieldRow label="Hotel name" sublabel="As registered with JET">
          <TextInput value={hotelName} onChange={setHotelName} placeholder="Hotel name" />
        </FieldRow>
        <Separator />
        <FieldRow label="Address">
          <TextInput value={address} onChange={setAddress} placeholder="Full address" />
        </FieldRow>
        <Separator />
        <FieldRow label="Contact person" sublabel="Primary point of contact">
          <TextInput value={contactName} onChange={setContactName} placeholder="Contact name" />
        </FieldRow>
        <Separator />
        <FieldRow label="Email">
          <TextInput value={email} onChange={setEmail} placeholder="Email address" type="email" />
        </FieldRow>
        <Separator />
        <FieldRow label="Phone">
          <TextInput value={phone} onChange={setPhone} placeholder="Phone number" type="tel" />
        </FieldRow>
      </SettingCard>

      {/* Billing info — read-only */}
      <motion.div {...motionProps(1, rm)} className="mt-4">
        <SettingCard>
          <div className="flex items-center justify-between mb-4">
            <span style={{ ...TY.body, fontSize: "12px", color: t.text, lineHeight: "1.4", letterSpacing: "-0.02em" }}>
              Billing Configuration
            </span>
            <span className="px-2 py-1 rounded-lg" style={{
              ...TY.bodyR, fontSize: "9px",
              background: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)",
              color: t.textFaint, lineHeight: "1.4",
            }}>
              Managed by JET
            </span>
          </div>
          <div
            className="rounded-xl p-4"
            style={{
              background: isDark
                ? "linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)"
                : "linear-gradient(135deg, rgba(0,0,0,0.015) 0%, rgba(0,0,0,0.005) 100%)",
              border: `1px solid ${isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)"}`,
            }}
          >
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="block" style={{ ...TY.bodyR, fontSize: "10px", color: t.textFaint, lineHeight: "1.5" }}>Credit limit</span>
                <span className="block" style={{ ...TY.body, fontSize: "13px", color: t.text, lineHeight: "1.4" }}>
                  {"\u20A6"}{data.creditLimit.toLocaleString()}
                </span>
              </div>
              <div>
                <span className="block" style={{ ...TY.bodyR, fontSize: "10px", color: t.textFaint, lineHeight: "1.5" }}>Credit used</span>
                <span className="block" style={{ ...TY.body, fontSize: "13px", color: t.text, lineHeight: "1.4" }}>
                  {"\u20A6"}{data.creditUsed.toLocaleString()}
                </span>
              </div>
              <div>
                <span className="block" style={{ ...TY.bodyR, fontSize: "10px", color: t.textFaint, lineHeight: "1.5" }}>Billing cycle</span>
                <span className="block" style={{ ...TY.body, fontSize: "12px", color: t.text, lineHeight: "1.4" }}>{data.billingCycle}</span>
              </div>
              <div>
                <span className="block" style={{ ...TY.bodyR, fontSize: "10px", color: t.textFaint, lineHeight: "1.5" }}>Rate type</span>
                <span className="block" style={{ ...TY.body, fontSize: "12px", color: t.text, lineHeight: "1.4" }}>{data.corporateRate}</span>
              </div>
            </div>
          </div>
        </SettingCard>
      </motion.div>
    </motion.div>
  );
}


// ─── Team Section ───────────────────────────────────────────────────────────

function TeamSection({ showToast, showConfirm }: {
  showToast: (msg: string, type?: "success" | "info" | "error") => void;
  showConfirm: (opts: any) => void;
}) {
  const { t, theme } = useAdminTheme();
  const isDark = theme === "dark";
  const rm = usePrefersReducedMotion();
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<"concierge" | "front_desk">("concierge");
  const [inviteFocused, setInviteFocused] = useState(false);

  const invite = () => {
    if (inviteEmail.includes("@")) {
      showToast(`Invitation sent to ${inviteEmail}`, "success");
      setInviteEmail("");
    }
  };

  const roleColor = (role: HotelTeamMember["role"]) => {
    switch (role) {
      case "admin": return BRAND.green;
      case "concierge": return STATUS.info;
      case "front_desk": return STATUS.warning;
      default: return t.textFaint;
    }
  };

  return (
    <motion.div {...motionProps(0, rm)}>
      <SectionHeader icon={Users} title="Team" description="Manage who can book rides on behalf of your hotel" />

      {/* Invite form */}
      <SettingCard className="mb-4">
        <div className="flex items-center justify-between mb-3">
          <span style={{ ...TY.body, fontSize: "12px", color: t.text, lineHeight: "1.4", letterSpacing: "-0.02em" }}>
            Invite member
          </span>
          <span style={{ ...TY.bodyR, fontSize: "10px", color: t.textFaint, lineHeight: "1.4" }}>
            {data.team.length} members
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex-1 relative">
            <input
              value={inviteEmail}
              onChange={e => setInviteEmail(e.target.value)}
              placeholder="Email address"
              onFocus={() => setInviteFocused(true)}
              onBlur={() => setInviteFocused(false)}
              className="w-full px-3 py-2.5 rounded-xl outline-none transition-all duration-150"
              style={{
                ...TY.bodyR, fontSize: "12px", color: t.text, lineHeight: "1.4",
                background: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)",
                border: `1px solid ${inviteFocused ? BRAND.green + "60" : isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
                boxShadow: inviteFocused ? `0 0 0 2px ${BRAND.green}18` : "none",
                minHeight: 40,
              }}
              onKeyDown={e => { if (e.key === "Enter") invite(); }}
            />
          </div>
          <select
            value={inviteRole}
            onChange={e => setInviteRole(e.target.value as any)}
            className="px-3 py-2.5 rounded-xl outline-none cursor-pointer transition-all duration-150"
            style={{
              ...TY.bodyR, fontSize: "11px", color: t.text, lineHeight: "1.4",
              background: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)",
              border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
              minHeight: 40,
            }}
          >
            <option value="concierge">Concierge</option>
            <option value="front_desk">Front Desk</option>
          </select>
          <button
            onClick={invite}
            disabled={!inviteEmail.includes("@")}
            className="px-4 py-2.5 rounded-xl cursor-pointer transition-opacity hover:opacity-90"
            style={{
              background: inviteEmail.includes("@") ? BRAND.green : (isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)"),
              border: `1px solid ${inviteEmail.includes("@") ? BRAND.green : isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
              minHeight: 40,
              opacity: inviteEmail.includes("@") ? 1 : 0.5,
            }}
          >
            <UserPlus size={14} style={{ color: inviteEmail.includes("@") ? "#fff" : t.textFaint }} />
          </button>
        </div>
      </SettingCard>

      {/* Team list */}
      <motion.div {...motionProps(1, rm)}>
        <SettingCard>
          {data.team.map((member, i) => (
            <div key={member.id}>
              <div className="flex items-center gap-3 py-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{
                  background: `${roleColor(member.role)}08`, border: `1px solid ${roleColor(member.role)}14`,
                }}>
                  <span style={{
                    fontFamily: "'Montserrat', sans-serif", fontWeight: 600,
                    fontSize: "10px", color: roleColor(member.role), letterSpacing: "-0.02em",
                  }}>
                    {member.name.split(" ").map(n => n[0]).join("")}
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="truncate" style={{ ...TY.body, fontSize: "12px", color: t.text, lineHeight: "1.4", letterSpacing: "-0.02em" }}>
                      {member.name}
                    </span>
                    <span className="px-1.5 py-0.5 rounded-lg shrink-0" style={{
                      ...TY.bodyR, fontSize: "9px", background: `${roleColor(member.role)}08`, color: roleColor(member.role), lineHeight: "1.5",
                    }}>
                      {member.role.replace("_", " ")}
                    </span>
                    {member.status === "invited" && (
                      <span className="px-1.5 py-0.5 rounded-lg shrink-0" style={{
                        ...TY.bodyR, fontSize: "9px", background: `${STATUS.warning}08`, color: STATUS.warning, lineHeight: "1.5",
                      }}>pending</span>
                    )}
                  </div>
                  <span style={{ ...TY.bodyR, fontSize: "10px", color: t.textFaint, lineHeight: "1.5" }}>
                    {member.email} · {member.ridesBooked} rides · {member.lastActive}
                  </span>
                </div>

                {member.role !== "admin" && (
                  <button
                    onClick={() => showConfirm({
                      title: `Remove ${member.name}?`,
                      message: `This will revoke their access to the hotel dashboard. They won't be able to book rides anymore.`,
                      confirmLabel: "Remove",
                      destructive: true,
                      onConfirm: () => showToast(`${member.name} removed from team`, "info"),
                    })}
                    className="px-2.5 py-1.5 rounded-lg cursor-pointer shrink-0 transition-opacity hover:opacity-80"
                    style={{
                      background: `${STATUS.error}06`,
                      border: `1px solid ${STATUS.error}10`,
                    }}
                  >
                    <Trash2 size={11} style={{ color: STATUS.error }} />
                  </button>
                )}
              </div>
              {i < data.team.length - 1 && <Separator />}
            </div>
          ))}
        </SettingCard>
      </motion.div>
    </motion.div>
  );
}


// ─── Notifications ──────────────────────────────────────────────────────────

function NotificationsSection({ showToast }: { showToast: (msg: string, type?: "success" | "info" | "error") => void }) {
  const { t, theme } = useAdminTheme();
  const isDark = theme === "dark";
  const rm = usePrefersReducedMotion();

  const [prefs, setPrefs] = useState({
    rideCompleted: true,
    rideAssigned: true,
    rideCancelled: true,
    invoiceDue: true,
    teamActivity: false,
    systemUpdates: true,
  });

  const toggle = (key: keyof typeof prefs) => {
    setPrefs(p => ({ ...p, [key]: !p[key] }));
    showToast("Notification preferences updated", "success");
  };

  const NOTIF_ITEMS: { key: keyof typeof prefs; label: string; desc: string }[] = [
    { key: "rideCompleted", label: "Ride completed", desc: "When a guest ride finishes successfully" },
    { key: "rideAssigned", label: "Driver assigned", desc: "When a driver accepts a hotel booking" },
    { key: "rideCancelled", label: "Ride cancelled", desc: "When a ride is cancelled by driver or system" },
    { key: "invoiceDue", label: "Invoice ready", desc: "When a new invoice is generated for billing" },
    { key: "teamActivity", label: "Team activity", desc: "When team members join, leave, or book rides" },
    { key: "systemUpdates", label: "System updates", desc: "Platform changes, rate updates, new features" },
  ];

  return (
    <motion.div {...motionProps(0, rm)}>
      <SectionHeader icon={Bell} title="Notifications" description="Control how you receive updates about hotel bookings" />

      <SettingCard>
        {NOTIF_ITEMS.map((item, i) => (
          <div key={item.key}>
            <div className="flex items-center justify-between py-3.5">
              <div className="flex-1 mr-4">
                <span className="block" style={{ ...TY.body, fontSize: "12px", color: t.text, lineHeight: "1.4", letterSpacing: "-0.02em" }}>{item.label}</span>
                <span style={{ ...TY.bodyR, fontSize: "10px", color: t.textFaint, lineHeight: "1.5" }}>{item.desc}</span>
              </div>
              <Toggle checked={prefs[item.key]} onChange={() => toggle(item.key)} />
            </div>
            {i < NOTIF_ITEMS.length - 1 && <Separator />}
          </div>
        ))}
      </SettingCard>
    </motion.div>
  );
}


// ─── Security ───────────────────────────────────────────────────────────────

function SecuritySection({ showToast, showConfirm }: {
  showToast: (msg: string, type?: "success" | "info" | "error") => void;
  showConfirm: (opts: any) => void;
}) {
  const { t, theme } = useAdminTheme();
  const isDark = theme === "dark";
  const rm = usePrefersReducedMotion();
  const [twoFA, setTwoFA] = useState(false);

  return (
    <motion.div {...motionProps(0, rm)}>
      <SectionHeader icon={Shield} title="Security" description="Protect your hotel's JET account" />

      <SettingCard className="mb-4">
        <FieldRow label="Password" sublabel="Last changed 30 days ago">
          <button
            onClick={() => showToast("Password reset email sent to " + data.email, "info")}
            className="px-3 py-1.5 rounded-lg cursor-pointer flex items-center gap-1.5 transition-opacity hover:opacity-80"
            style={{
              background: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)",
              border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
            }}
          >
            <Key size={10} style={{ color: t.textMuted }} />
            <span style={{ ...TY.body, fontSize: "10px", color: t.textMuted, lineHeight: "1.4" }}>Change password</span>
          </button>
        </FieldRow>
        <Separator />
        <FieldRow label="Two-factor auth" sublabel="Extra security via authenticator app">
          <div className="flex items-center gap-3">
            <Toggle checked={twoFA} onChange={(v) => {
              if (v) {
                showConfirm({
                  title: "Enable two-factor authentication?",
                  message: "You'll need to scan a QR code with an authenticator app on your next login.",
                  confirmLabel: "Enable 2FA",
                  onConfirm: () => { setTwoFA(true); showToast("2FA enabled", "success"); },
                });
              } else {
                showConfirm({
                  title: "Disable two-factor authentication?",
                  message: "This will remove the extra security layer from your hotel account.",
                  confirmLabel: "Disable 2FA",
                  destructive: true,
                  onConfirm: () => { setTwoFA(false); showToast("2FA disabled", "info"); },
                });
              }
            }} />
            {!twoFA && (
              <span style={{ ...TY.bodyR, fontSize: "10px", color: STATUS.warning, lineHeight: "1.4" }}>
                Recommended
              </span>
            )}
          </div>
        </FieldRow>
      </SettingCard>

      {/* Active sessions */}
      <motion.div {...motionProps(1, rm)}>
        <SettingCard>
          <div className="flex items-center justify-between mb-4">
            <span style={{ ...TY.body, fontSize: "12px", color: t.text, lineHeight: "1.4", letterSpacing: "-0.02em" }}>
              Active Sessions
            </span>
            <span style={{ ...TY.bodyR, fontSize: "10px", color: t.textFaint, lineHeight: "1.4" }}>
              {MOCK_SESSIONS.length} devices
            </span>
          </div>

          {MOCK_SESSIONS.map((session, idx) => {
            const Icon = session.icon;
            return (
              <div key={session.id}>
                <div className="flex items-center gap-3 py-3">
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                    style={{
                      background: session.current ? `${BRAND.green}08` : (isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)"),
                      border: `1px solid ${session.current ? `${BRAND.green}12` : isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)"}`,
                    }}
                  >
                    <Icon size={13} style={{ color: session.current ? BRAND.green : t.textFaint }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="truncate" style={{ ...TY.body, fontSize: "12px", color: t.text, lineHeight: "1.4" }}>
                        {session.device}
                      </span>
                      {session.current && (
                        <span className="px-1.5 py-0.5 rounded-lg shrink-0" style={{
                          ...TY.bodyR, fontSize: "8px", background: `${BRAND.green}08`, color: BRAND.green, lineHeight: "1.5",
                        }}>
                          This device
                        </span>
                      )}
                    </div>
                    <span style={{ ...TY.bodyR, fontSize: "10px", color: t.textFaint, lineHeight: "1.5" }}>
                      {session.browser} · {session.location} · {session.lastActive}
                    </span>
                  </div>
                  {!session.current && (
                    <button
                      onClick={() => {
                        showConfirm({
                          title: "Revoke session?",
                          message: `This will sign out ${session.device}. They'll need to log in again.`,
                          confirmLabel: "Revoke",
                          destructive: true,
                          onConfirm: () => showToast(`Session on ${session.device} revoked`, "info"),
                        });
                      }}
                      className="px-2.5 py-1.5 rounded-lg cursor-pointer shrink-0 transition-opacity hover:opacity-80"
                      style={{
                        background: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)",
                        border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
                      }}
                    >
                      <LogOut size={10} style={{ color: t.textMuted }} />
                    </button>
                  )}
                </div>
                {idx < MOCK_SESSIONS.length - 1 && <Separator />}
              </div>
            );
          })}
        </SettingCard>
      </motion.div>
    </motion.div>
  );
}


// ─── Appearance ─────────────────────────────────────────────────────────────

function AppearanceSection({ showToast }: { showToast: (msg: string, type?: "success" | "info" | "error") => void }) {
  const { t, theme, setTheme } = useAdminTheme();
  const isDark = theme === "dark";
  const rm = usePrefersReducedMotion();

  return (
    <motion.div {...motionProps(0, rm)}>
      <SectionHeader icon={Palette} title="Appearance" description="Choose how the hotel dashboard looks" />

      <SettingCard>
        <FieldRow label="Theme" sublabel="Light or dark mode">
          <div className="flex items-center gap-3">
            {(["light", "dark"] as const).map(mode => {
              const active = theme === mode;
              return (
                <button
                  key={mode}
                  onClick={() => { setTheme(mode); showToast(`Switched to ${mode} mode`, "info"); }}
                  className="flex-1 p-4 rounded-xl cursor-pointer text-center transition-all duration-150"
                  style={{
                    border: `1px solid ${active ? `${BRAND.green}30` : isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
                    background: active
                      ? isDark ? `${BRAND.green}06` : `${BRAND.green}04`
                      : isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.01)",
                    boxShadow: active ? `0 0 0 1px ${BRAND.green}18` : "none",
                  }}
                >
                  <div className="w-8 h-8 rounded-lg mx-auto mb-2 flex items-center justify-center" style={{
                    background: mode === "dark" ? "#111113" : "#FAFAFA",
                    border: `1px solid ${mode === "dark" ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}`,
                  }}>
                    <div className="w-3 h-3 rounded-full" style={{ background: mode === "dark" ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.1)" }} />
                  </div>
                  <span style={{
                    ...TY.body, fontSize: "11px",
                    color: active ? BRAND.green : t.textMuted,
                    lineHeight: "1.4", letterSpacing: "-0.02em",
                  }}>
                    {mode.charAt(0).toUpperCase() + mode.slice(1)}
                  </span>
                  {active && (
                    <div className="flex items-center justify-center mt-1">
                      <Check size={10} style={{ color: BRAND.green }} />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </FieldRow>
      </SettingCard>
    </motion.div>
  );
}


// ─── Danger Zone ────────────────────────────────────────────────────────────

function DangerSection({ showToast, showConfirm }: {
  showToast: (msg: string, type?: "success" | "info" | "error") => void;
  showConfirm: (opts: any) => void;
}) {
  const { t, theme } = useAdminTheme();
  const isDark = theme === "dark";
  const rm = usePrefersReducedMotion();

  return (
    <motion.div {...motionProps(0, rm)}>
      <SectionHeader icon={AlertTriangle} title="Danger Zone" description="Irreversible actions — proceed with caution" />

      <SettingCard>
        {/* Export data */}
        <div className="flex items-center justify-between py-3.5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)" }}>
              <Download size={14} style={{ color: t.textMuted }} />
            </div>
            <div>
              <span className="block" style={{ ...TY.body, fontSize: "12px", color: t.text, lineHeight: "1.4" }}>Export hotel data</span>
              <span className="block" style={{ ...TY.bodyR, fontSize: "10px", color: t.textFaint, lineHeight: "1.5" }}>Download all booking and billing data</span>
            </div>
          </div>
          <button
            onClick={() => showToast("Export started — you'll receive an email when ready", "info")}
            className="px-3 py-1.5 rounded-lg cursor-pointer flex items-center gap-1.5 transition-opacity hover:opacity-80"
            style={{
              background: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)",
              border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
            }}
          >
            <Download size={10} style={{ color: t.textMuted }} />
            <span style={{ ...TY.body, fontSize: "10px", color: t.textMuted, lineHeight: "1.4" }}>Export</span>
          </button>
        </div>

        <Separator />

        {/* Deactivate account */}
        <div className="flex items-center justify-between py-3.5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: `${STATUS.error}06` }}>
              <AlertTriangle size={14} style={{ color: STATUS.error }} />
            </div>
            <div>
              <span className="block" style={{ ...TY.body, fontSize: "12px", color: STATUS.error, lineHeight: "1.4" }}>Deactivate hotel account</span>
              <span className="block" style={{ ...TY.bodyR, fontSize: "10px", color: t.textFaint, lineHeight: "1.5" }}>
                Disable booking access. Can be reactivated by JET admin.
              </span>
            </div>
          </div>
          <button
            onClick={() => showConfirm({
              title: "Deactivate hotel account?",
              message: "This will immediately disable all team members' access and prevent new bookings. Outstanding invoices will still be due. Contact JET support to reactivate.",
              confirmLabel: "Deactivate",
              destructive: true,
              onConfirm: () => showToast("Account deactivation requested — JET admin will process", "info"),
            })}
            className="px-3 py-1.5 rounded-lg cursor-pointer flex items-center gap-1.5 transition-opacity hover:opacity-80"
            style={{
              background: `${STATUS.error}06`,
              border: `1px solid ${STATUS.error}12`,
            }}
          >
            <AlertTriangle size={10} style={{ color: STATUS.error }} />
            <span style={{ ...TY.body, fontSize: "10px", color: STATUS.error, lineHeight: "1.4" }}>Deactivate</span>
          </button>
        </div>
      </SettingCard>
    </motion.div>
  );
}


// ═══════════════════════════════════════════════════════════════════════════
// MAIN EXPORT
// ═══════════════════════════════════════════════════════════════════════════

export function HotelSettings() {
  const { t, theme } = useAdminTheme();
  const isDark = theme === "dark";
  const rm = usePrefersReducedMotion();
  const [activeSection, setActiveSection] = useState<SectionId>("profile");
  const [toast, setToast] = useState<{ message: string; type: "success" | "info" | "error" } | null>(null);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [confirmModal, setConfirmModal] = useState<{
    title: string; message: string; confirmLabel: string; destructive?: boolean; onConfirm: () => void;
  } | null>(null);

  // Simulate loading
  const loadSettings = useCallback(() => {
    setLoading(true);
    setLoadError(false);
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const cleanup = loadSettings();
    return cleanup;
  }, [loadSettings]);

  const showToast = useCallback((message: string, type: "success" | "info" | "error" = "success") => {
    setToast({ message, type });
  }, []);

  const showConfirm = useCallback((opts: { title: string; message: string; confirmLabel: string; destructive?: boolean; onConfirm: () => void }) => {
    setConfirmModal(opts);
  }, []);

  const handleSave = useCallback(() => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setDirty(false);
      showToast("Settings saved", "success");
    }, 1200);
  }, [showToast]);

  const handleDiscard = useCallback(() => {
    setDirty(false);
    showToast("Changes discarded", "info");
  }, [showToast]);

  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    contentRef.current?.scrollTo({ top: 0, behavior: rm ? "auto" : "smooth" });
  }, [activeSection, rm]);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "s" && dirty) {
        e.preventDefault();
        handleSave();
      }
      if (e.key === "Escape" && dirty && !confirmModal) {
        handleDiscard();
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [dirty, handleSave, handleDiscard, confirmModal]);

  // Section switch with unsaved changes guard
  const handleSectionChange = useCallback((id: SectionId) => {
    if (dirty) {
      setConfirmModal({
        title: "Unsaved changes",
        message: "You have unsaved changes. Would you like to save before switching sections?",
        confirmLabel: "Save & switch",
        onConfirm: () => {
          setSaving(true);
          setTimeout(() => {
            setSaving(false);
            setDirty(false);
            setActiveSection(id);
            showToast("Settings saved", "success");
          }, 600);
        },
      });
      return;
    }
    setActiveSection(id);
  }, [dirty, showToast]);

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* ── Mobile section pills ─────────────────────────────── */}
      <div
        className="md:hidden shrink-0 flex items-center gap-1 px-4 py-2 overflow-x-auto"
        style={{
          borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)"}`,
          scrollbarWidth: "none",
        }}
      >
        {SECTION_NAV.map((s) => {
          const active = activeSection === s.id;
          const Icon = s.icon;
          const isDanger = s.id === "danger";
          return (
            <button
              key={s.id}
              onClick={() => handleSectionChange(s.id)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl cursor-pointer whitespace-nowrap transition-all duration-150 shrink-0"
              style={{
                background: active
                  ? isDanger ? `${STATUS.error}08` : isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)"
                  : "transparent",
                border: active ? `1px solid ${isDanger ? `${STATUS.error}12` : t.borderSubtle}` : "1px solid transparent",
              }}
            >
              <Icon size={12} style={{ color: active ? (isDanger ? STATUS.error : BRAND.green) : t.textFaint }} />
              <span style={{
                ...TY.body, fontSize: "10px",
                color: active ? (isDanger ? STATUS.error : t.text) : t.textMuted,
                lineHeight: "1.4",
              }}>
                {s.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── Content ──────────────────────────────────────────── */}
      <div className="flex-1 flex min-h-0 overflow-hidden">

        {/* Desktop section nav */}
        <div
          className="hidden md:flex flex-col w-52 shrink-0 py-4 px-3 gap-0.5 overflow-y-auto"
          style={{
            borderRight: `1px solid ${isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)"}`,
          }}
        >
          {SECTION_NAV.map((s) => {
            const active = activeSection === s.id;
            const Icon = s.icon;
            const isDanger = s.id === "danger";
            return (
              <button
                key={s.id}
                onClick={() => handleSectionChange(s.id)}
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-150 text-left"
                style={{
                  background: active
                    ? isDanger ? `${STATUS.error}06` : isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.025)"
                    : "transparent",
                }}
              >
                <Icon size={14} style={{ color: active ? (isDanger ? STATUS.error : BRAND.green) : t.textFaint }} />
                <span style={{
                  ...TY.body, fontSize: "11px",
                  color: active ? (isDanger ? STATUS.error : t.text) : t.textMuted,
                  lineHeight: "1.4",
                }}>
                  {s.label}
                </span>
                {active && (
                  <motion.div
                    className="ml-auto w-1 h-1 rounded-full"
                    style={{ background: isDanger ? STATUS.error : BRAND.green }}
                    layoutId="hotel-settings-nav-dot"
                    transition={{ duration: 0.2 }}
                  />
                )}
              </button>
            );
          })}

          {/* Nav footer */}
          <div className="mt-auto pt-4" style={{
            borderTop: `1px solid ${isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)"}`,
          }}>
            <span className="block px-3" style={{ ...TY.bodyR, fontSize: "9px", color: t.textGhost, lineHeight: "1.5" }}>
              Hotel: {data.hotelName}
            </span>
            <span className="block px-3" style={{ ...TY.bodyR, fontSize: "9px", color: t.textGhost, lineHeight: "1.5" }}>
              Last updated: 1h ago
            </span>
          </div>
        </div>

        {/* Section content */}
        <div ref={contentRef} className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="max-w-2xl">
            {loadError ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
                  style={{ background: `${STATUS.error}08`, border: `1px solid ${STATUS.error}12` }}
                >
                  <AlertTriangle size={20} style={{ color: STATUS.error }} />
                </div>
                <span className="block mb-1" style={{
                  fontFamily: "'Montserrat', sans-serif", fontWeight: 600,
                  fontSize: "14px", letterSpacing: "-0.03em", color: t.text, lineHeight: "1.2",
                }}>
                  Failed to load settings
                </span>
                <span className="block mb-5" style={{ ...TY.bodyR, fontSize: "11px", color: t.textMuted, lineHeight: "1.5" }}>
                  Something went wrong. Please try again.
                </span>
                <button
                  onClick={loadSettings}
                  className="px-4 py-2 rounded-xl cursor-pointer transition-opacity hover:opacity-90"
                  style={{
                    background: BRAND.green,
                    ...TY.body, fontSize: "12px", color: "#fff", lineHeight: "1.4",
                  }}
                >
                  Retry
                </button>
              </div>
            ) : loading ? (
              <SettingsSkeleton />
            ) : (
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeSection}
                  initial={rm ? undefined : { opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={rm ? undefined : { opacity: 0, x: -8 }}
                  transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                >
                  {activeSection === "profile" && (
                    <ProfileSection onDirty={setDirty} showToast={showToast} />
                  )}
                  {activeSection === "team" && (
                    <TeamSection showToast={showToast} showConfirm={showConfirm} />
                  )}
                  {activeSection === "notifications" && (
                    <NotificationsSection showToast={showToast} />
                  )}
                  {activeSection === "security" && (
                    <SecuritySection showToast={showToast} showConfirm={showConfirm} />
                  )}
                  {activeSection === "appearance" && (
                    <AppearanceSection showToast={showToast} />
                  )}
                  {activeSection === "danger" && (
                    <DangerSection showToast={showToast} showConfirm={showConfirm} />
                  )}
                </motion.div>
              </AnimatePresence>
            )}
          </div>
        </div>
      </div>

      {/* ── Save bar ──────────────────────────────────────────── */}
      <SaveBar dirty={dirty} saving={saving} onSave={handleSave} onDiscard={handleDiscard} />

      {/* ── Toast ─────────────────────────────────────────────── */}
      <AnimatePresence>
        {toast && <Toast message={toast.message} type={toast.type} onDismiss={() => setToast(null)} />}
      </AnimatePresence>

      {/* ── Confirm modal ─────────────────────────────────────── */}
      <AnimatePresence>
        {confirmModal && (
          <ConfirmModal
            title={confirmModal.title}
            message={confirmModal.message}
            confirmLabel={confirmModal.confirmLabel}
            destructive={confirmModal.destructive}
            onConfirm={() => { confirmModal.onConfirm(); setConfirmModal(null); }}
            onCancel={() => setConfirmModal(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}