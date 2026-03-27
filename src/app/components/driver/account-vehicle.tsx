 /**
 * AccountVehicle — Profile, vehicle & documents (Account tab).
 *
 * C spine DNA — MapCanvas background, GlassPanel cards.
 * DRIVER_TYPE enforced — nothing below 13px.
 *
 * Sections:
 *   - Profile header (avatar, name, rating, member since)
 *   - Quick stats (trips, acceptance, hours)
 *   - Vehicle card (make, model, plate, type badge)
 *   - Documents list (license, insurance, vehicle inspection)
 *   - Settings menu (notifications, language, support, sign out)
 */

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Star,
  Car,
  FileText,
  Shield,
  ChevronRight,
  Bell,
  Globe,
  HelpCircle,
  LogOut,
  CheckCircle2,
  AlertCircle,
  Clock,
  Zap,
} from "lucide-react";
import {
  GLASS_COLORS,
  MOTION,
  type GlassColorMode,
} from "../../config/project";
import { BRAND_COLORS } from "../../config/brand";
import { DRIVER_TYPE as DT } from "../../config/driver-type";
import { MapCanvas } from "../rider/map-canvas";
import { GlassPanel } from "../rider/glass-panel";
import { JetConfirm } from "../rider/jet-confirm";
import { useJetToast } from "../rider/jet-toast";
import { DRIVER_PROFILE, formatNaira } from "./driver-data";
import {
  DriverNotificationsSettings,
  DriverSafetySettings,
  DriverHelpSettings,
  DriverLanguageSettings,
} from "./driver-settings";
import { DriverProfileSettings } from "./driver-profile-settings";

// ---------------------------------------------------------------------------
// Document status mock
// ---------------------------------------------------------------------------
interface Document {
  id: string;
  label: string;
  status: "verified" | "pending" | "expired";
  expiry?: string;
}

const DOCUMENTS: Document[] = [
  { id: "license", label: "Driver's license", status: "verified", expiry: "Mar 2028" },
  { id: "insurance", label: "Vehicle insurance", status: "verified", expiry: "Sep 2026" },
  { id: "inspection", label: "Vehicle inspection", status: "pending" },
  { id: "registration", label: "Vehicle registration", status: "verified", expiry: "Dec 2026" },
];

const STATUS_CONFIG: Record<
  Document["status"],
  { color: string; icon: typeof CheckCircle2; label: string }
> = {
  verified: { color: BRAND_COLORS.green, icon: CheckCircle2, label: "Verified" },
  pending: { color: "#F59E0B", icon: Clock, label: "Pending" },
  expired: { color: BRAND_COLORS.error, icon: AlertCircle, label: "Expired" },
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
interface AccountVehicleProps {
  colorMode: GlassColorMode;
}

export function AccountVehicle({ colorMode }: AccountVehicleProps) {
  const c = GLASS_COLORS[colorMode];
  const d = colorMode === "dark";
  const profile = DRIVER_PROFILE;
  const [showSignOut, setShowSignOut] = useState(false);
  const [subScreen, setSubScreen] = useState<"none" | "notifications" | "language" | "safety" | "help" | "profile">("none");
  const { showToast, ToastContainer } = useJetToast(colorMode);

  const handleSignOut = useCallback(() => {
    setShowSignOut(false);
    showToast({ message: "Signed out successfully", variant: "success" });
  }, [showToast]);

  const goBack = useCallback(() => setSubScreen("none"), []);

  // ── Sub-screen rendering ──
  if (subScreen !== "none") {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={subScreen}
          className="h-full"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={MOTION.standard}
        >
          {subScreen === "notifications" && <DriverNotificationsSettings colorMode={colorMode} onBack={goBack} />}
          {subScreen === "language" && <DriverLanguageSettings colorMode={colorMode} onBack={goBack} />}
          {subScreen === "safety" && <DriverSafetySettings colorMode={colorMode} onBack={goBack} />}
          {subScreen === "help" && <DriverHelpSettings colorMode={colorMode} onBack={goBack} />}
          {subScreen === "profile" && <DriverProfileSettings colorMode={colorMode} onBack={goBack} />}
        </motion.div>
      </AnimatePresence>
    );
  }

  const SETTINGS_ITEMS: { icon: typeof Bell; label: string; sub: string; key: "notifications" | "language" | "safety" | "help" | "profile" }[] = [
    { icon: Bell, label: "Notifications", sub: "Push & sound preferences", key: "notifications" },
    { icon: Globe, label: "Language", sub: "English", key: "language" },
    { icon: Shield, label: "Safety", sub: "Emergency contacts, SOS", key: "safety" },
    { icon: HelpCircle, label: "Help & support", sub: "FAQs, contact us", key: "help" },
    { icon: Star, label: "Profile", sub: "Edit your profile", key: "profile" },
  ];

  return (
    <div className="relative w-full h-full" style={{ background: c.bg }}>
      {/* Background */}
      <MapCanvas colorMode={colorMode} variant="dark" />
      {d ? (
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B0B0D]/60 via-[#0B0B0D]/40 to-[#0B0B0D]/80 z-[1]" />
      ) : (
        <div
          className="absolute inset-0 z-[1]"
          style={{
            background:
              "linear-gradient(to bottom, rgba(250,250,250,0.7) 0%, rgba(250,250,250,0.4) 40%, rgba(250,250,250,0.85) 100%)",
          }}
        />
      )}

      {/* Scrollable content */}
      <div
        className="absolute inset-0 z-[2] overflow-y-auto scrollbar-hide"
        style={{ paddingTop: "calc(env(safe-area-inset-top, 12px) + 16px)" }}
      >
        {/* Profile header */}
        <motion.button
          className="px-5 mb-6 w-full text-left"
          onClick={() => setSubScreen("profile")}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-center gap-4">
            <motion.div
              className="w-16 h-16 rounded-full flex items-center justify-center shrink-0"
              style={{
                background: c.green.tint,
                border: `2px solid ${BRAND_COLORS.green}30`,
              }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
            >
              <span
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: "22px",
                  fontWeight: 700,
                  letterSpacing: "-0.03em",
                  color: BRAND_COLORS.green,
                }}
              >
                {profile.initials}
              </span>
            </motion.div>
            <div className="flex-1 min-w-0">
              <div
                style={{
                  ...DT.heading,
                  fontSize: "22px",
                  color: c.text.primary,
                }}
              >
                {profile.firstName} {profile.lastName}
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <div className="flex items-center gap-1">
                  <Star
                    className="w-3.5 h-3.5"
                    style={{ color: BRAND_COLORS.green, fill: BRAND_COLORS.green }}
                  />
                  <span style={{ ...DT.label, color: BRAND_COLORS.green }}>
                    {profile.rating}
                  </span>
                </div>
                <span style={{ ...DT.meta, color: c.text.faint }}>·</span>
                <span style={{ ...DT.meta, color: c.text.muted }}>
                  Since {profile.memberSince}
                </span>
              </div>
            </div>
          </div>
        </motion.button>

        {/* Quick stats */}
        <div className="px-5 mb-5">
          <GlassPanel
            variant={d ? "dark" : "light"}
            blur={20}
            className="rounded-2xl px-4 py-4"
          >
            <div className="flex items-center justify-around">
              {[
                { label: "Trips", value: profile.totalTrips.toLocaleString() },
                { label: "Acceptance", value: `${profile.acceptanceRate}%` },
                { label: "Vehicle", value: profile.vehicle.type },
              ].map((item, i) => (
                <div key={item.label} className="flex items-center">
                  {i > 0 && (
                    <div
                      className="h-8 mr-4"
                      style={{
                        width: 1,
                        background: d ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)",
                      }}
                    />
                  )}
                  <div className="text-center">
                    <div style={{ ...DT.meta, color: c.text.muted }}>{item.label}</div>
                    <div style={{ ...DT.stat, fontSize: "18px", marginTop: "2px", color: c.text.display }}>
                      {item.value}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </GlassPanel>
        </div>

        {/* Vehicle card */}
        <div className="px-5 mb-5">
          <div className="flex items-center justify-between mb-3">
            <span style={{ ...DT.label, color: c.text.primary }}>Vehicle</span>
          </div>
          <GlassPanel
            variant={d ? "dark" : "light"}
            blur={20}
            className="rounded-2xl px-4 py-4"
          >
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: c.surface.subtle }}
              >
                <Car className="w-5 h-5" style={{ color: c.icon.primary }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span style={{ ...DT.label, color: c.text.primary }}>
                    {profile.vehicle.year} {profile.vehicle.make} {profile.vehicle.model}
                  </span>
                  {profile.vehicle.type === "EV" && (
                    <div
                      className="flex items-center gap-1 px-1.5 py-0.5 rounded-full"
                      style={{ background: c.green.evBg }}
                    >
                      <Zap className="w-2.5 h-2.5" style={{ color: BRAND_COLORS.green }} />
                      <span style={{ ...DT.meta, fontSize: "11px", color: c.green.evText }}>
                        EV
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span style={{ ...DT.meta, color: c.text.muted }}>
                    {profile.vehicle.color}
                  </span>
                  <span style={{ ...DT.meta, color: c.text.faint }}>·</span>
                  <span
                    style={{
                      ...DT.meta,
                      fontFamily: "var(--font-heading)",
                      fontWeight: 600,
                      letterSpacing: "0.04em",
                      color: c.text.secondary,
                    }}
                  >
                    {profile.vehicle.plate}
                  </span>
                </div>
              </div>
            </div>
          </GlassPanel>
        </div>

        {/* Documents */}
        <div className="px-5 mb-5">
          <div className="flex items-center justify-between mb-3">
            <span style={{ ...DT.label, color: c.text.primary }}>Documents</span>
            <span style={{ ...DT.meta, color: c.text.muted }}>
              {DOCUMENTS.filter((doc) => doc.status === "verified").length}/{DOCUMENTS.length} verified
            </span>
          </div>
          <GlassPanel
            variant={d ? "dark" : "light"}
            blur={20}
            className="rounded-2xl overflow-hidden"
          >
            {DOCUMENTS.map((doc, i) => {
              const config = STATUS_CONFIG[doc.status];
              const StatusIcon = config.icon;
              return (
                <motion.button
                  key={doc.id}
                  className="w-full px-4 py-3.5 flex items-center gap-3"
                  style={{
                    borderBottom:
                      i < DOCUMENTS.length - 1
                        ? `1px solid ${c.surface.hover}`
                        : "none",
                  }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ ...MOTION.standard, delay: i * 0.03 }}
                >
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: c.surface.subtle }}
                  >
                    <FileText className="w-4 h-4" style={{ color: c.icon.secondary }} />
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <span style={{ ...DT.label, color: c.text.primary }}>
                      {doc.label}
                    </span>
                    {doc.expiry && (
                      <div style={{ ...DT.meta, color: c.text.muted, marginTop: "1px" }}>
                        Expires {doc.expiry}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <StatusIcon
                      className="w-3.5 h-3.5"
                      style={{ color: config.color }}
                    />
                    <span style={{ ...DT.meta, color: config.color }}>
                      {config.label}
                    </span>
                  </div>
                </motion.button>
              );
            })}
          </GlassPanel>
        </div>

        {/* Settings */}
        <div className="px-5 mb-5">
          <div className="mb-3">
            <span style={{ ...DT.label, color: c.text.primary }}>Settings</span>
          </div>
          <GlassPanel
            variant={d ? "dark" : "light"}
            blur={20}
            className="rounded-2xl overflow-hidden"
          >
            {SETTINGS_ITEMS.map(({ icon: Icon, label, sub, key }, i) => (
              <motion.button
                key={label}
                className="w-full px-4 py-3.5 flex items-center gap-3"
                style={{
                  borderBottom:
                    i < SETTINGS_ITEMS.length - 1
                      ? `1px solid ${c.surface.hover}`
                      : "none",
                }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSubScreen(key)}
              >
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background: c.surface.subtle }}
                >
                  <Icon className="w-4 h-4" style={{ color: c.icon.secondary }} />
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <span style={{ ...DT.label, color: c.text.primary }}>{label}</span>
                  <div style={{ ...DT.meta, color: c.text.muted, marginTop: "1px" }}>
                    {sub}
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 shrink-0" style={{ color: c.icon.muted }} />
              </motion.button>
            ))}
          </GlassPanel>
        </div>

        {/* Sign out */}
        <div className="px-5 mb-5">
          <motion.button
            className="w-full py-3.5 rounded-xl flex items-center justify-center gap-2"
            style={{
              background: d ? "rgba(212,24,61,0.08)" : "rgba(212,24,61,0.05)",
              border: `1px solid ${d ? "rgba(212,24,61,0.15)" : "rgba(212,24,61,0.1)"}`,
            }}
            onClick={() => setShowSignOut(true)}
            whileTap={{ scale: 0.97 }}
          >
            <LogOut className="w-4 h-4" style={{ color: BRAND_COLORS.error }} />
            <span style={{ ...DT.label, color: BRAND_COLORS.error }}>Sign out</span>
          </motion.button>
        </div>

        {/* App version */}
        <div className="text-center px-5 pb-4">
          <span style={{ ...DT.meta, color: c.text.ghost }}>
            JET Driver v1.0.0
          </span>
        </div>

        {/* Bottom spacer */}
        <div style={{ height: 100 }} />
      </div>

      {/* Sign out confirmation */}
      <JetConfirm
        open={showSignOut}
        colorMode={colorMode}
        title="Sign out?"
        message="You'll need to sign in again to receive trip requests."
        confirmLabel="Sign out"
        cancelLabel="Stay signed in"
        destructive
        onConfirm={handleSignOut}
        onCancel={() => setShowSignOut(false)}
      />

      {/* Toast container */}
      <ToastContainer />
    </div>
  );
}