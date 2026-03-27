 /**
 * Rider Account Screen — profile, settings, preferences.
 *
 * Fully wired navigation into settings sub-screens:
 *   Profile edit, Referrals, EV Impact, Notifications,
 *   Safety, Appearance, Help & Support.
 *
 * Sign out with destructive action confirmation.
 * Uses shared JetToast for all feedback.
 */

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ChevronRight, Shield, Bell, HelpCircle,
  Star, Gift, LogOut, Zap, Moon,
} from "lucide-react";
import { GLASS_COLORS, GLASS_TYPE, MOTION, type GlassColorMode } from "../../config/project";
import { BRAND_COLORS } from "../../config/brand";
import { MapCanvas } from "./map-canvas";
import { RIDER_USER } from "./rider-home-c";
import { useJetToast, type ToastConfig } from "./jet-toast";
import { JetConfirm } from "./jet-confirm";
import { ProfileEditScreen } from "./settings-profile";
import { NotificationsSettings } from "./settings-notifications";
import { SafetySettings } from "./settings-safety";
import { AppearanceSettings } from "./settings-appearance";
import { HelpSettings } from "./settings-help";
import { ReferralsScreen } from "./settings-referrals";
import { EVImpactScreen } from "./settings-ev-impact";

import { RIDER_TYPE as RT } from "../../config/rider-type";

const AVATAR_URL =
  "https://images.unsplash.com/photo-1668752600261-e56e7f3780b6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3J0cmFpdCUyMGFmcmljYW4lMjBtYW4lMjBwcm9mZXNzaW9uYWwlMjBoZWFkc2hvdHxlbnwxfHx8fDE3NzI1MzU3NzV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";

type SubScreen =
  | "none"
  | "profile"
  | "referrals"
  | "ev-impact"
  | "notifications"
  | "safety"
  | "appearance"
  | "help";

const menuSections = [
  {
    items: [
      { icon: Star, label: "Favourites", key: "favourites" as const, detail: "Home, Work, Airport", actionLabel: "3 saved" },
      { icon: Gift, label: "Referrals", key: "referrals" as const, detail: "Earn ₦500 per invite", actionLabel: "Share" },
      { icon: Zap, label: "JetEV Impact", key: "ev-impact" as const, detail: "4.2kg CO₂ saved this month", actionLabel: "" },
    ],
  },
  {
    items: [
      { icon: Bell, label: "Notifications", key: "notifications" as const, detail: "Ride updates, promos", actionLabel: "" },
      { icon: Shield, label: "Safety", key: "safety" as const, detail: "Emergency contacts, SOS", actionLabel: "" },
      { icon: Moon, label: "Appearance", key: "appearance" as const, detail: "Dark mode, display", actionLabel: "" },
      { icon: HelpCircle, label: "Help & Support", key: "help" as const, detail: "FAQ, contact us", actionLabel: "" },
    ],
  },
];

interface Props {
  colorMode: GlassColorMode;
  onSavedPlacesTap?: () => void;
  onThemeChange?: (mode: GlassColorMode) => void;
}

export function RiderAccountScreen({ colorMode, onSavedPlacesTap, onThemeChange }: Props) {
  const c = GLASS_COLORS[colorMode];
  const d = colorMode === "dark";
  const [subScreen, setSubScreen] = useState<SubScreen>("none");
  const [showSignOut, setShowSignOut] = useState(false);
  const { showToast, ToastContainer } = useJetToast(colorMode);

  const goBack = useCallback(() => setSubScreen("none"), []);

  const handleMenuTap = (key: string) => {
    if (key === "favourites") {
      onSavedPlacesTap?.();
      return;
    }
    setSubScreen(key as SubScreen);
  };

  const handleSignOut = () => {
    setShowSignOut(false);
    showToast({ message: "Signed out successfully", variant: "success" });
  };

  // ── Sub-screen rendering ──
  if (subScreen !== "none") {
    return (
      <div className="h-full relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={subScreen}
            className="h-full"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            {subScreen === "profile" && (
              <ProfileEditScreen colorMode={colorMode} onBack={goBack} showToast={showToast} />
            )}
            {subScreen === "referrals" && (
              <ReferralsScreen colorMode={colorMode} onBack={goBack} showToast={showToast} />
            )}
            {subScreen === "ev-impact" && (
              <EVImpactScreen colorMode={colorMode} onBack={goBack} />
            )}
            {subScreen === "notifications" && (
              <NotificationsSettings colorMode={colorMode} onBack={goBack} showToast={showToast} />
            )}
            {subScreen === "safety" && (
              <SafetySettings colorMode={colorMode} onBack={goBack} showToast={showToast} />
            )}
            {subScreen === "appearance" && (
              <AppearanceSettings
                colorMode={colorMode}
                onBack={goBack}
                showToast={showToast}
                onThemeChange={onThemeChange}
              />
            )}
            {subScreen === "help" && (
              <HelpSettings colorMode={colorMode} onBack={goBack} showToast={showToast} />
            )}
          </motion.div>
        </AnimatePresence>
        <ToastContainer />
      </div>
    );
  }

  // ── Main account list ──
  return (
    <div className="h-full flex flex-col" style={{ background: c.bg }}>
      {/* Map peek */}
      <div className="relative shrink-0" style={{ height: "12vh" }}>
        <MapCanvas variant="muted" colorMode={colorMode} />
        <div className="absolute inset-0" style={{
          background: d
            ? "linear-gradient(to bottom, transparent 20%, #0B0B0D)"
            : "linear-gradient(to bottom, transparent 20%, #FAFAFA)",
        }} />
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-4 scrollbar-hide">
        {/* Profile header */}
        <motion.button
          className="w-full flex items-center gap-4 pt-4 pb-5 text-left"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setSubScreen("profile")}
        >
          <div className="w-16 h-16 rounded-full overflow-hidden shrink-0 border-2" style={{ borderColor: `${BRAND_COLORS.green}30` }}>
            <img src={AVATAR_URL} alt="Profile" className="w-full h-full object-cover" />
          </div>
          <div className="flex-1">
            <div style={{ ...RT.heading, fontSize: "20px", lineHeight: "1.3", color: c.text.primary }}>
              {RIDER_USER.firstName} {RIDER_USER.lastName}
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <Star className="w-3 h-3" style={{ color: BRAND_COLORS.green, fill: BRAND_COLORS.green }} />
              <span style={{ ...RT.meta, color: c.text.secondary }}>{RIDER_USER.rating} rating</span>
              <span style={{ ...RT.meta, color: c.text.faint }}>·</span>
              <span style={{ ...RT.meta, color: c.text.muted }}>Since {RIDER_USER.memberSince}</span>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 shrink-0" style={{ color: c.icon.muted }} />
        </motion.button>

        {/* Menu sections */}
        {menuSections.map((section, si) => (
          <motion.div
            key={si}
            className="mb-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 + si * 0.08 }}
          >
            <div className="rounded-2xl overflow-hidden" style={{ background: c.surface.subtle }}>
              {section.items.map((item, i) => (
                <motion.button
                  key={item.key}
                  className="w-full flex items-center gap-3 px-4 py-3.5 text-left"
                  style={{
                    borderBottom: i < section.items.length - 1
                      ? `1px solid ${c.surface.hover}`
                      : "none",
                  }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleMenuTap(item.key)}
                >
                  <item.icon className="w-[18px] h-[18px] shrink-0" style={{ color: c.icon.secondary }} />
                  <div className="flex-1">
                    <span style={{ ...RT.bodySmall, color: c.text.primary }}>{item.label}</span>
                    {item.detail && (
                      <div style={{ ...RT.meta, color: c.text.muted }}>{item.detail}</div>
                    )}
                  </div>
                  {item.actionLabel && (
                    <span style={{ ...RT.meta, color: BRAND_COLORS.green }}>{item.actionLabel}</span>
                  )}
                  <ChevronRight className="w-4 h-4 shrink-0" style={{ color: c.icon.muted }} />
                </motion.button>
              ))}
            </div>
          </motion.div>
        ))}

        {/* Sign out */}
        <motion.button
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl mt-2"
          style={{ background: c.surface.subtle }}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setShowSignOut(true)}
        >
          <LogOut className="w-4 h-4" style={{ color: "rgba(239,68,68,0.7)" }} />
          <span style={{ ...RT.bodySmall, color: "rgba(239,68,68,0.7)" }}>Sign out</span>
        </motion.button>
      </div>

      {/* Confirmation dialog */}
      <JetConfirm
        open={showSignOut}
        colorMode={colorMode}
        title="Sign out?"
        message="You'll need to sign in again to book rides."
        confirmLabel="Sign out"
        destructive
        onConfirm={handleSignOut}
        onCancel={() => setShowSignOut(false)}
      />

      {/* Toast container */}
      <ToastContainer />
    </div>
  );
}