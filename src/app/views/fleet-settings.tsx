/**
 * FLEET OWNER — SETTINGS TAB
 *
 * One job: Configure fleet business operations.
 *
 * Architecture: Linear/Vercel Settings-style layout
 *   - Left section nav (desktop) / horizontal pills (mobile)
 *   - Grouped setting sections with inline editing
 *   - Toast feedback on every save
 *   - Destructive action confirmation modals
 *
 * Product OS compliance:
 *   □ DESIGN: One job per screen ✓ · 30-sec completion per change ✓
 *             Empty/loading/error states ✓ · Skeleton loading ✓
 *   □ PM: Supports fleet operations, no dead-ends
 *   □ SECURITY: Destructive actions confirmed · 2FA visible
 *   □ MOTION: 40ms stagger, spring easing, prefers-reduced-motion ✓
 *   □ BRAND: Green as scalpel — only save CTAs, active toggles ✓
 *
 * Data sources (all traceable):
 *   - Profile → fleet_owners table (business_name, owner_name, email, phone)
 *   - Bank → fleet_bank_accounts table (account_number, bank_name)
 *   - Commission → fleet_contracts table (commission_rate, fleet_share)
 *   - Payout → fleet_payout_config table (schedule, auto_payout)
 *   - Preferences → fleet_settings table (notification_prefs, appearance)
 *   - Security → auth.users table (2fa_enabled, last_password_change)
 *   - Sessions → auth.sessions table (device, last_active, ip)
 */

import { useState, useCallback, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Building2, User, CreditCard, Bell, Shield, Palette,
  AlertTriangle, Save, Check, Copy, ExternalLink,
  ChevronRight, Eye, EyeOff, Smartphone, Monitor,
  Trash2, Download, LogOut, Key, Mail, Phone,
  Clock, Calendar, X, ArrowRight, Info, Pencil,
  Globe, MapPin, Receipt, Wallet,
} from "lucide-react";
import { useAdminTheme, BRAND, TY, STATUS } from "../config/admin-theme";
import { MOCK_FLEET_OWNER } from "../config/fleet-mock-data";
import { StatusDot } from "../components/fleet/driver-card";
import { Toast } from "../components/shared/toast";
import { ConfirmModal } from "../components/shared/confirm-modal";
import { usePrefersReducedMotion } from "../hooks/use-reduced-motion";
import {
  SettingCard, SectionHeader, FieldRow, Separator,
  TextInput, Toggle, SelectPill, SaveBar, SettingsSkeleton,
  motionProps,
} from "../components/shared/settings-primitives";

const data = MOCK_FLEET_OWNER;

// ─── Types ──────────────────────────────────────────────────────────────────

type SectionId = "profile" | "bank" | "notifications" | "security" | "appearance" | "danger";

interface NotifPref {
  label: string;
  description: string;
  email: boolean;
  push: boolean;
  sms: boolean;
}

interface Session {
  id: string;
  device: string;
  browser: string;
  location: string;
  lastActive: string;
  current: boolean;
  icon: typeof Monitor;
}

// ─── Mock data ──────────────────────────────────────────────────────────────

const MOCK_SESSIONS: Session[] = [
  { id: "s1", device: "MacBook Pro", browser: "Chrome 122", location: "Lagos, NG", lastActive: "Now", current: true, icon: Monitor },
  { id: "s2", device: "iPhone 15 Pro", browser: "Safari 17", location: "Lagos, NG", lastActive: "2h ago", current: false, icon: Smartphone },
  { id: "s3", device: "Windows Desktop", browser: "Edge 121", location: "Abuja, NG", lastActive: "3d ago", current: false, icon: Monitor },
];

const INITIAL_NOTIF_PREFS: NotifPref[] = [
  { label: "Earnings & Payouts", description: "Payout sent, weekly summary, commission changes", email: true, push: true, sms: false },
  { label: "Driver Activity", description: "New signups, KYC status, driver milestones", email: true, push: true, sms: true },
  { label: "Vehicle Alerts", description: "Inspection due, insurance expiry, maintenance needed", email: true, push: true, sms: false },
  { label: "System Updates", description: "Platform changes, rate updates, new features", email: true, push: false, sms: false },
];

const SECTION_NAV: { id: SectionId; label: string; icon: typeof Building2 }[] = [
  { id: "profile", label: "Business Profile", icon: Building2 },
  { id: "bank", label: "Bank & Payouts", icon: CreditCard },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "security", label: "Security", icon: Shield },
  { id: "appearance", label: "Appearance", icon: Palette },
  { id: "danger", label: "Danger Zone", icon: AlertTriangle },
];


// ═══════════════════════════════════════════════════════════════════════════
// SECTION COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════


// ─── Business Profile ───────────────────────────────────────────────────────

function ProfileSection({ onDirty, showToast }: { onDirty: (d: boolean) => void; showToast: (msg: string, type?: "success" | "info" | "error") => void }) {
  const { t, theme } = useAdminTheme();
  const isDark = theme === "dark";
  const rm = usePrefersReducedMotion();

  const [businessName, setBusinessName] = useState(data.businessName);
  const [ownerName, setOwnerName] = useState(data.ownerName);
  const [email, setEmail] = useState(data.email);
  const [phone, setPhone] = useState(data.phone);
  const [rcNumber, setRcNumber] = useState("RC-2834512");
  const [address, setAddress] = useState("24 Awolowo Road, Ikoyi, Lagos");

  const isDirty = useMemo(() =>
    businessName !== data.businessName || ownerName !== data.ownerName ||
    email !== data.email || phone !== data.phone,
    [businessName, ownerName, email, phone]
  );

  useEffect(() => { onDirty(isDirty); }, [isDirty, onDirty]);

  return (
    <motion.div {...motionProps(0, rm)}>
      <SectionHeader icon={Building2} title="Business Profile" description="Your fleet's registered business information" />
      <SettingCard>
        {/* Avatar/Logo */}
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
            }}>ME</span>
          </div>
          <div className="flex-1">
            <span className="block" style={{ ...TY.body, fontSize: "13px", color: t.text, lineHeight: "1.4" }}>{data.businessName}</span>
            <span className="block" style={{ ...TY.bodyR, fontSize: "10px", color: t.textMuted, lineHeight: "1.5" }}>
              Fleet ID: {data.id} · Since Aug 2025
            </span>
          </div>
          <button
            className="px-3 py-1.5 rounded-lg cursor-pointer flex items-center gap-1.5"
            style={{
              background: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)",
              border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
            }}
          >
            <Pencil size={10} style={{ color: t.textMuted }} />
            <span style={{ ...TY.body, fontSize: "10px", color: t.textMuted, lineHeight: "1.4" }}>Change logo</span>
          </button>
        </div>

        <Separator />

        <FieldRow label="Business name" sublabel="Registered company name">
          <TextInput value={businessName} onChange={setBusinessName} />
        </FieldRow>
        <Separator />
        <FieldRow label="Owner name" sublabel="Primary contact">
          <TextInput value={ownerName} onChange={setOwnerName} />
        </FieldRow>
        <Separator />
        <FieldRow label="Email address" sublabel="For invoices & receipts">
          <TextInput value={email} onChange={setEmail} type="email" />
        </FieldRow>
        <Separator />
        <FieldRow label="Phone number">
          <TextInput value={phone} onChange={setPhone} type="tel" />
        </FieldRow>
        <Separator />
        <FieldRow label="RC Number" sublabel="CAC registration">
          <div className="flex items-center gap-2">
            <TextInput value={rcNumber} onChange={setRcNumber} disabled />
            <div className="px-2 py-1 rounded-lg shrink-0" style={{ background: `${BRAND.green}08`, border: `1px solid ${BRAND.green}12` }}>
              <span style={{ ...TY.body, fontSize: "9px", color: BRAND.green, lineHeight: "1.4" }}>Verified</span>
            </div>
          </div>
        </FieldRow>
        <Separator />
        <FieldRow label="Business address">
          <TextInput value={address} onChange={setAddress} />
        </FieldRow>
      </SettingCard>

      {/* Invite link */}
      <motion.div {...motionProps(1, rm)} className="mt-4">
        <SettingCard>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: `${STATUS.info}08`, border: `1px solid ${STATUS.info}10` }}>
                <Globe size={14} style={{ color: STATUS.info }} />
              </div>
              <div>
                <span className="block" style={{ ...TY.body, fontSize: "12px", color: t.text, lineHeight: "1.4" }}>Driver invite link</span>
                <span className="block" style={{ ...TY.bodyR, fontSize: "10px", color: t.textFaint, lineHeight: "1.5" }}>{data.inviteLink}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(`https://${data.inviteLink}`);
                  showToast("Invite link copied", "info");
                }}
                className="px-2.5 py-1.5 rounded-lg cursor-pointer flex items-center gap-1.5"
                style={{
                  background: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)",
                  border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
                }}
              >
                <Copy size={10} style={{ color: t.textMuted }} />
                <span style={{ ...TY.body, fontSize: "10px", color: t.textMuted, lineHeight: "1.4" }}>Copy</span>
              </button>
            </div>
          </div>
        </SettingCard>
      </motion.div>

      {/* Export data — neutral action, not in Danger Zone */}
      <motion.div {...motionProps(2, rm)} className="mt-4">
        <SettingCard>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)" }}>
                <Download size={14} style={{ color: t.textMuted }} />
              </div>
              <div>
                <span className="block" style={{ ...TY.body, fontSize: "12px", color: t.text, lineHeight: "1.4" }}>Export fleet data</span>
                <span className="block" style={{ ...TY.bodyR, fontSize: "10px", color: t.textFaint, lineHeight: "1.5" }}>Download all fleet data as CSV</span>
              </div>
            </div>
            <button
              onClick={() => showToast("Export started — you'll receive an email when ready", "info")}
              className="px-3 py-1.5 rounded-lg cursor-pointer flex items-center gap-1.5"
              style={{
                background: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)",
                border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
              }}
            >
              <Download size={10} style={{ color: t.textMuted }} />
              <span style={{ ...TY.body, fontSize: "10px", color: t.textMuted, lineHeight: "1.4" }}>Export</span>
            </button>
          </div>
        </SettingCard>
      </motion.div>
    </motion.div>
  );
}


// ─── Bank & Payouts ─────────────────────────────────────────────────────────

function BankSection({ onDirty, showToast }: { onDirty: (d: boolean) => void; showToast: (msg: string, type?: "success" | "info" | "error") => void }) {
  const { t, theme } = useAdminTheme();
  const isDark = theme === "dark";
  const rm = usePrefersReducedMotion();

  const [payoutSchedule, setPayoutSchedule] = useState(data.payoutSchedule);
  const [autoPayout, setAutoPayout] = useState(true);
  const [minPayout, setMinPayout] = useState("50000");

  const isDirty = payoutSchedule !== data.payoutSchedule;
  useEffect(() => { onDirty(isDirty); }, [isDirty, onDirty]);

  return (
    <motion.div {...motionProps(0, rm)}>
      <SectionHeader icon={CreditCard} title="Bank & Payouts" description="Manage your bank account and payout preferences" />

      {/* Bank account card */}
      <SettingCard>
        <div className="flex items-center justify-between mb-4">
          <span style={{ ...TY.body, fontSize: "12px", color: t.text, lineHeight: "1.4", letterSpacing: "-0.02em" }}>
            Bank Account
          </span>
          <div className="px-2 py-1 rounded-lg" style={{ background: `${BRAND.green}08`, border: `1px solid ${BRAND.green}12` }}>
            <span style={{ ...TY.body, fontSize: "9px", color: BRAND.green, lineHeight: "1.4" }}>Primary</span>
          </div>
        </div>

        <div
          className="rounded-xl p-4 mb-4"
          style={{
            background: isDark
              ? "linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)"
              : "linear-gradient(135deg, rgba(0,0,0,0.015) 0%, rgba(0,0,0,0.005) 100%)",
            border: `1px solid ${isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)"}`,
          }}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)" }}>
              <CreditCard size={16} style={{ color: t.textMuted }} />
            </div>
            <div className="flex-1">
              <span className="block" style={{ ...TY.body, fontSize: "12px", color: t.text, lineHeight: "1.4" }}>
                Guaranty Trust Bank
              </span>
              <span className="block" style={{ ...TY.bodyR, fontSize: "11px", color: t.textMuted, lineHeight: "1.5" }}>
                {data.bankAccount}
              </span>
              <span className="block" style={{ ...TY.bodyR, fontSize: "10px", color: t.textFaint, lineHeight: "1.5" }}>
                Metro Express Fleet Ltd
              </span>
            </div>
            <button
              className="px-3 py-1.5 rounded-lg cursor-pointer"
              style={{
                background: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)",
                border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
                ...TY.body, fontSize: "10px", color: t.textMuted, lineHeight: "1.4",
              }}
              onClick={() => showToast("Bank update requires verification — check your email", "info")}
            >
              Change bank
            </button>
          </div>
        </div>

        <Separator />

        {/* Commission transparency — Airbnb trust principle */}
        <div className="py-4">
          <span className="block mb-3" style={{ ...TY.body, fontSize: "12px", color: t.text, lineHeight: "1.4", letterSpacing: "-0.02em" }}>
            Commission Structure
          </span>
          <div className="flex items-center gap-2 mb-3">
            <div className="flex-1 rounded-xl p-3" style={{ background: isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.015)", border: `1px solid ${isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)"}` }}>
              <span className="block" style={{ ...TY.bodyR, fontSize: "9px", color: t.textFaint, lineHeight: "1.4", marginBottom: 2 }}>JET Platform</span>
              <span style={{ ...TY.body, fontSize: "14px", color: t.text, lineHeight: "1.2", letterSpacing: "-0.02em" }}>{data.commissionRate}%</span>
            </div>
            <ArrowRight size={12} style={{ color: t.textFaint }} />
            <div className="flex-1 rounded-xl p-3" style={{ background: isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.015)", border: `1px solid ${isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)"}` }}>
              <span className="block" style={{ ...TY.bodyR, fontSize: "9px", color: t.textFaint, lineHeight: "1.4", marginBottom: 2 }}>Fleet Share</span>
              <span style={{ ...TY.body, fontSize: "14px", color: BRAND.green, lineHeight: "1.2", letterSpacing: "-0.02em" }}>{data.fleetShare}%</span>
            </div>
            <ArrowRight size={12} style={{ color: t.textFaint }} />
            <div className="flex-1 rounded-xl p-3" style={{ background: isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.015)", border: `1px solid ${isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)"}` }}>
              <span className="block" style={{ ...TY.bodyR, fontSize: "9px", color: t.textFaint, lineHeight: "1.4", marginBottom: 2 }}>Driver</span>
              <span style={{ ...TY.body, fontSize: "14px", color: t.text, lineHeight: "1.2", letterSpacing: "-0.02em" }}>{100 - data.commissionRate - data.fleetShare}%</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-2 rounded-lg" style={{ background: `${STATUS.info}06`, border: `1px solid ${STATUS.info}08` }}>
            <Info size={10} style={{ color: STATUS.info }} />
            <span style={{ ...TY.bodyR, fontSize: "9px", color: isDark ? STATUS.info : t.textSecondary, lineHeight: "1.5" }}>
              Commission rates are set in your fleet contract. Contact support to request changes.
            </span>
          </div>
        </div>

        <Separator />

        <FieldRow label="Payout schedule" sublabel="When earnings are deposited">
          <SelectPill
            options={[
              { value: "daily", label: "Daily" },
              { value: "weekly", label: "Weekly" },
            ]}
            value={payoutSchedule}
            onChange={(v) => setPayoutSchedule(v as "daily" | "weekly")}
          />
        </FieldRow>
        <Separator />
        <FieldRow label="Auto-payout" sublabel="Automatically transfer when threshold met">
          <div className="flex items-center gap-3">
            <Toggle checked={autoPayout} onChange={setAutoPayout} />
            {autoPayout && (
              <motion.div
                className="flex items-center gap-1.5"
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
              >
                <span style={{ ...TY.bodyR, fontSize: "10px", color: t.textFaint, lineHeight: "1.4" }}>Min:</span>
                <input
                  type="text"
                  value={`₦${minPayout}`}
                  onChange={(e) => setMinPayout(e.target.value.replace(/[₦,]/g, ""))}
                  className="w-24 px-2 py-1 rounded-lg outline-none"
                  style={{
                    ...TY.bodyR, fontSize: "11px", color: t.text, lineHeight: "1.4",
                    background: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)",
                    border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
                  }}
                />
              </motion.div>
            )}
          </div>
        </FieldRow>
      </SettingCard>
    </motion.div>
  );
}


// ─── Notifications ──────────────────────────────────────────────────────────

function NotificationsSection({ showToast }: { showToast: (msg: string, type?: "success" | "info" | "error") => void }) {
  const { t, theme } = useAdminTheme();
  const isDark = theme === "dark";
  const rm = usePrefersReducedMotion();
  const [prefs, setPrefs] = useState<NotifPref[]>(INITIAL_NOTIF_PREFS);

  const updatePref = useCallback((idx: number, channel: "email" | "push" | "sms", val: boolean) => {
    setPrefs(prev => prev.map((p, i) => i === idx ? { ...p, [channel]: val } : p));
    showToast("Preference updated", "success");
  }, [showToast]);

  return (
    <motion.div {...motionProps(0, rm)}>
      <SectionHeader icon={Bell} title="Notifications" description="Choose what and how you're notified" />
      <div className="flex items-center gap-1.5 mb-3 px-1">
        <Check size={8} style={{ color: BRAND.green }} />
        <span style={{ ...TY.bodyR, fontSize: "9px", color: t.textFaint, lineHeight: "1.4" }}>Changes save automatically</span>
      </div>
      <SettingCard>
        {/* Channel headers */}
        <div className="flex items-center gap-2 mb-3 pb-3" style={{
          borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)"}`,
        }}>
          <div className="flex-1" />
          <div className="w-14 text-center">
            <span style={{ ...TY.label, fontSize: "8px", color: t.textFaint }}>EMAIL</span>
          </div>
          <div className="w-14 text-center">
            <span style={{ ...TY.label, fontSize: "8px", color: t.textFaint }}>PUSH</span>
          </div>
          <div className="w-14 text-center">
            <span style={{ ...TY.label, fontSize: "8px", color: t.textFaint }}>SMS</span>
          </div>
        </div>

        {prefs.map((pref, idx) => (
          <div key={pref.label}>
            <div className="flex items-center gap-2 py-3">
              <div className="flex-1">
                <span className="block" style={{ ...TY.body, fontSize: "12px", color: t.text, lineHeight: "1.4" }}>{pref.label}</span>
                <span className="block" style={{ ...TY.bodyR, fontSize: "10px", color: t.textFaint, lineHeight: "1.5" }}>{pref.description}</span>
              </div>
              <div className="w-14 flex justify-center">
                <Toggle checked={pref.email} onChange={(v) => updatePref(idx, "email", v)} />
              </div>
              <div className="w-14 flex justify-center">
                <Toggle checked={pref.push} onChange={(v) => updatePref(idx, "push", v)} />
              </div>
              <div className="w-14 flex justify-center">
                <Toggle checked={pref.sms} onChange={(v) => updatePref(idx, "sms", v)} />
              </div>
            </div>
            {idx < prefs.length - 1 && <Separator />}
          </div>
        ))}
      </SettingCard>
    </motion.div>
  );
}


// ─── Security ───────────────────────────────────────────────────────────────

function SecuritySection({ showToast, showConfirm }: { showToast: (msg: string, type?: "success" | "info" | "error") => void; showConfirm: (opts: { title: string; message: string; confirmLabel: string; destructive?: boolean; onConfirm: () => void }) => void }) {
  const { t, theme } = useAdminTheme();
  const isDark = theme === "dark";
  const rm = usePrefersReducedMotion();
  const [twoFA, setTwoFA] = useState(false);
  const [showRevoke, setShowRevoke] = useState<string | null>(null);

  return (
    <motion.div {...motionProps(0, rm)}>
      <SectionHeader icon={Shield} title="Security" description="Protect your fleet account" />

      {/* Password */}
      <SettingCard className="mb-4">
        <FieldRow label="Password" sublabel="Last changed 45 days ago">
          <button
            onClick={() => showToast("Password reset email sent to " + data.email, "info")}
            className="px-3 py-1.5 rounded-lg cursor-pointer flex items-center gap-1.5"
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
                  message: "You'll need to scan a QR code with an authenticator app (Google Authenticator, Authy, etc.) on your next login. This adds an extra layer of security to your account.",
                  confirmLabel: "Enable 2FA",
                  onConfirm: () => { setTwoFA(true); showToast("2FA enabled — scan QR on next login", "success"); },
                });
              } else {
                showConfirm({
                  title: "Disable two-factor authentication?",
                  message: "This will remove the extra security layer from your account. Your fleet account will only be protected by your password.",
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
                    style={{ background: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)" }}
                  >
                    <Icon size={14} style={{ color: session.current ? BRAND.green : t.textFaint }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="truncate" style={{ ...TY.body, fontSize: "11px", color: t.text, lineHeight: "1.4" }}>
                        {session.device}
                      </span>
                      {session.current && (
                        <span className="px-1.5 py-0.5 rounded-md shrink-0" style={{ background: `${BRAND.green}08`, border: `1px solid ${BRAND.green}12` }}>
                          <span style={{ ...TY.body, fontSize: "8px", color: BRAND.green, lineHeight: "1.2" }}>This device</span>
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
                          title: `Revoke ${session.device} session?`,
                          message: `This will immediately sign out the ${session.browser} session on ${session.device} (${session.location}). The user will need to log in again.`,
                          confirmLabel: "Revoke session",
                          destructive: true,
                          onConfirm: () => {
                            setShowRevoke(session.id);
                            setTimeout(() => {
                              setShowRevoke(null);
                              showToast(`Revoked ${session.device} session`, "info");
                            }, 500);
                          },
                        });
                      }}
                      className="px-2 py-1 rounded-lg cursor-pointer"
                      style={{
                        background: `${STATUS.error}06`,
                        border: `1px solid ${STATUS.error}10`,
                      }}
                    >
                      <span style={{ ...TY.body, fontSize: "9px", color: STATUS.error, lineHeight: "1.4" }}>
                        {showRevoke === session.id ? "Revoking..." : "Revoke"}
                      </span>
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
  const { t, theme, toggle } = useAdminTheme();
  const isDark = theme === "dark";
  const rm = usePrefersReducedMotion();
  const [compactMode, setCompactMode] = useState(false);

  return (
    <motion.div {...motionProps(0, rm)}>
      <SectionHeader icon={Palette} title="Appearance" description="Customize how the dashboard looks" />
      <div className="flex items-center gap-1.5 mb-3 px-1">
        <Check size={8} style={{ color: BRAND.green }} />
        <span style={{ ...TY.bodyR, fontSize: "9px", color: t.textFaint, lineHeight: "1.4" }}>Changes save automatically</span>
      </div>
      <SettingCard>
        <FieldRow label="Theme" sublabel="Light or dark mode">
          <div className="flex items-center gap-3">
            <SelectPill
              options={[
                { value: "dark", label: "Dark" },
                { value: "light", label: "Light" },
              ]}
              value={theme}
              onChange={(v) => {
                if (v !== theme) {
                  toggle();
                  showToast(`Switched to ${isDark ? "light" : "dark"} mode`, "info");
                }
              }}
            />
          </div>
        </FieldRow>
        <Separator />
        <FieldRow label="Compact mode" sublabel="Denser information layout">
          <Toggle checked={compactMode} onChange={(v) => { setCompactMode(v); showToast(v ? "Compact mode enabled" : "Default mode", "info"); }} />
        </FieldRow>
        <Separator />
        <FieldRow label="Reduced motion" sublabel="Respects system preference">
          <div className="flex items-center gap-2">
            <StatusDot color={rm ? BRAND.green : t.textFaint} size={6} />
            <span style={{ ...TY.bodyR, fontSize: "11px", color: rm ? BRAND.green : t.textMuted, lineHeight: "1.4" }}>
              {rm ? "Active (system)" : "Inactive"}
            </span>
          </div>
        </FieldRow>
      </SettingCard>
    </motion.div>
  );
}


// ─── Danger Zone ─────────────────────────────────���──────────────────────────

function DangerSection({ showToast, showConfirm }: {
  showToast: (msg: string, type?: "success" | "info" | "error") => void;
  showConfirm: (opts: { title: string; message: string; confirmLabel: string; destructive?: boolean; onConfirm: () => void }) => void;
}) {
  const { t, theme } = useAdminTheme();
  const isDark = theme === "dark";
  const rm = usePrefersReducedMotion();

  return (
    <motion.div {...motionProps(0, rm)}>
      <SectionHeader icon={AlertTriangle} title="Danger Zone" description="Irreversible actions — proceed with caution" />
      <SettingCard>
        {/* Deactivate fleet */}
        <div className="flex items-center justify-between py-3">
          <div>
            <span className="block" style={{ ...TY.body, fontSize: "12px", color: t.text, lineHeight: "1.4" }}>Deactivate fleet</span>
            <span className="block" style={{ ...TY.bodyR, fontSize: "10px", color: t.textFaint, lineHeight: "1.5" }}>
              Temporarily disable all fleet operations
            </span>
          </div>
          <button
            onClick={() => showConfirm({
              title: "Deactivate fleet?",
              message: "All drivers will go offline and no new rides will be dispatched. You can reactivate anytime from this page.",
              confirmLabel: "Deactivate",
              destructive: true,
              onConfirm: () => showToast("Fleet deactivated — all drivers notified", "error"),
            })}
            className="px-3 py-1.5 rounded-lg cursor-pointer flex items-center gap-1.5"
            style={{
              background: `${STATUS.error}06`,
              border: `1px solid ${STATUS.error}12`,
            }}
          >
            <AlertTriangle size={10} style={{ color: STATUS.error }} />
            <span style={{ ...TY.body, fontSize: "10px", color: STATUS.error, lineHeight: "1.4" }}>Deactivate</span>
          </button>
        </div>
        <Separator />

        {/* Delete fleet */}
        <div className="flex items-center justify-between py-3">
          <div>
            <span className="block" style={{ ...TY.body, fontSize: "12px", color: STATUS.error, lineHeight: "1.4" }}>Delete fleet permanently</span>
            <span className="block" style={{ ...TY.bodyR, fontSize: "10px", color: t.textFaint, lineHeight: "1.5" }}>
              Remove all data, vehicles, and driver associations. Cannot be undone.
            </span>
          </div>
          <button
            onClick={() => showConfirm({
              title: "Delete fleet permanently?",
              message: "This will permanently delete Metro Express Fleet, all vehicle records, driver associations, and earnings history. This action cannot be reversed.",
              confirmLabel: "Delete forever",
              destructive: true,
              onConfirm: () => showToast("Fleet deletion scheduled — you have 72h to cancel via support", "error"),
            })}
            className="px-3 py-1.5 rounded-lg cursor-pointer flex items-center gap-1.5"
            style={{
              background: `${STATUS.error}08`,
              border: `1px solid ${STATUS.error}15`,
            }}
          >
            <Trash2 size={10} style={{ color: STATUS.error }} />
            <span style={{ ...TY.body, fontSize: "10px", color: STATUS.error, lineHeight: "1.4" }}>Delete</span>
          </button>
        </div>
      </SettingCard>
    </motion.div>
  );
}


// ═══════════════════════════════════════════════════════════════════════════
// MAIN EXPORT
// ═══════════════════════════════════════════════════════════════════════════

export function FleetSettings() {
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

  // Simulate loading (with error recovery)
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

  // Scroll to top when section changes
  useEffect(() => {
    contentRef.current?.scrollTo({ top: 0, behavior: rm ? "auto" : "smooth" });
  }, [activeSection, rm]);

  // Keyboard shortcuts: Cmd+S to save, Escape to discard
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
                    layoutId="settings-nav-dot"
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
              Fleet ID: {data.id}
            </span>
            <span className="block px-3" style={{ ...TY.bodyR, fontSize: "9px", color: t.textGhost, lineHeight: "1.5" }}>
              Last updated: 2h ago
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
                  {activeSection === "bank" && (
                    <BankSection onDirty={setDirty} showToast={showToast} />
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